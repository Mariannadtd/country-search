import { createRequestSignal } from '../api/createRequestSignal.js';
import { searchCountries } from '../api/searchCountries.js';
import { classifyRequestError } from '../errors/classifyRequestError.js';
import type { Country } from '../types/country.js';
import { debounce } from '../utils/debounce.js';

export type SearchState =
  | { status: 'idle' }
  | { status: 'loading'; query: string }
  | { status: 'results'; query: string; countries: Country[] }
  | { status: 'empty'; query: string }
  | { status: 'error'; query: string; message: string };

type SearchFunction = (query: string, signal: AbortSignal) => Promise<Country[]>;

type StateListener = (state: SearchState) => void;

export class CountrySearchController {
  private activeController: AbortController | undefined;
  private lastQuery = '';
  private readonly debouncedSearch: (query: string) => void;

  constructor(
    private readonly onStateChange: StateListener,
    private readonly search: SearchFunction = searchCountries,
    private readonly timeoutMs = 8_000,
    debounceMs = 350,
  ) {
    this.debouncedSearch = debounce((query: string) => {
      void this.executeSearch(query);
    }, debounceMs);
  }

  handleInput(query: string): void {
    this.activeController?.abort();

    this.lastQuery = query.trim();
    this.onStateChange({ status: 'idle' });

    this.debouncedSearch(this.lastQuery);
  }

  retry(): void {
    if (this.lastQuery === '') {
      return;
    }

    this.activeController?.abort();
    void this.executeSearch(this.lastQuery);
  }

  private async executeSearch(query: string): Promise<void> {
    if (query === '') {
      return;
    }

    const controller = new AbortController();
    this.activeController = controller;

    this.onStateChange({ status: 'loading', query });

    try {
      const signal = createRequestSignal(controller.signal, this.timeoutMs);

      const countries = await this.search(query, signal);

      if (countries.length === 0) {
        this.onStateChange({ status: 'empty', query });
        return;
      }

      this.onStateChange({
        status: 'results',
        query,
        countries,
      });
    } catch (error: unknown) {
      const errorKind = classifyRequestError(error);

      if (errorKind === 'aborted') {
        return;
      }

      const message =
        errorKind === 'timeout'
          ? 'The request timed out. Please try again.'
          : 'Unable to load countries. Please try again.';

      this.onStateChange({
        status: 'error',
        query,
        message,
      });
    } finally {
      if (this.activeController === controller) {
        this.activeController = undefined;
      }
    }
  }
}
