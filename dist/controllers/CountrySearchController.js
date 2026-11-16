import { createRequestSignal } from '../api/createRequestSignal.js';
import { searchCountries } from '../api/searchCountries.js';
import { classifyRequestError } from '../errors/classifyRequestError.js';
import { debounce } from '../utils/debounce.js';
export class CountrySearchController {
    onStateChange;
    search;
    timeoutMs;
    activeController;
    lastQuery = '';
    debouncedSearch;
    constructor(onStateChange, search = searchCountries, timeoutMs = 8_000, debounceMs = 350) {
        this.onStateChange = onStateChange;
        this.search = search;
        this.timeoutMs = timeoutMs;
        this.debouncedSearch = debounce((query) => {
            void this.executeSearch(query);
        }, debounceMs);
    }
    handleInput(query) {
        this.activeController?.abort();
        this.lastQuery = query.trim();
        this.onStateChange({ status: 'idle' });
        this.debouncedSearch(this.lastQuery);
    }
    retry() {
        if (this.lastQuery === '') {
            return;
        }
        this.activeController?.abort();
        void this.executeSearch(this.lastQuery);
    }
    async executeSearch(query) {
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
        }
        catch (error) {
            const errorKind = classifyRequestError(error);
            if (errorKind === 'aborted') {
                return;
            }
            const message = errorKind === 'timeout'
                ? 'The request timed out. Please try again.'
                : 'Unable to load countries. Please try again.';
            this.onStateChange({
                status: 'error',
                query,
                message,
            });
        }
        finally {
            if (this.activeController === controller) {
                this.activeController = undefined;
            }
        }
    }
}
