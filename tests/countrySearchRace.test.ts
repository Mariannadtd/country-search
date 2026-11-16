import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  CountrySearchController,
  type SearchState,
} from '../src/controllers/CountrySearchController';
import type { Country } from '../src/types/country';

interface PendingRequest {
  readonly signal: AbortSignal;
  resolve(countries: Country[]): void;
}

const SPAIN: Country = {
  name: 'Spain',
  capital: 'Madrid',
  region: 'Europe',
  population: 47_351_567,
  area: 505_992,
  flagUrl: 'https://flagcdn.com/es.svg',
  languages: ['Spanish'],
  currencies: ['Euro'],
  borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
};

describe('CountrySearchController request race', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('aborts the older request and keeps only the latest result', async () => {
    vi.useFakeTimers();

    const pendingRequests = new Map<string, PendingRequest>();
    const states: SearchState[] = [];

    const search = vi.fn(
      (query: string, signal: AbortSignal): Promise<Country[]> =>
        new Promise((resolve, reject) => {
          const rejectAsAborted = (): void => {
            reject(signal.reason ?? new DOMException('The request was aborted', 'AbortError'));
          };

          if (signal.aborted) {
            rejectAsAborted();
            return;
          }

          signal.addEventListener('abort', rejectAsAborted, { once: true });
          pendingRequests.set(query, { resolve, signal });
        }),
    );

    const controller = new CountrySearchController(
      (state) => states.push(state),
      search,
      8_000,
      10,
    );

    controller.handleInput('sp');
    await vi.advanceTimersByTimeAsync(10);

    const olderRequest = pendingRequests.get('sp');
    expect(olderRequest).toBeDefined();

    controller.handleInput('spain');

    expect(olderRequest?.signal.aborted).toBe(true);
    expect(olderRequest?.signal.reason).toBeInstanceOf(DOMException);
    expect(olderRequest?.signal.reason.name).toBe('AbortError');

    await vi.advanceTimersByTimeAsync(10);

    pendingRequests.get('spain')?.resolve([SPAIN]);

    await vi.waitFor(() => {
      expect(states.at(-1)).toEqual({
        status: 'results',
        query: 'spain',
        countries: [SPAIN],
      });
    });

    expect(states).not.toContainEqual({
      status: 'results',
      query: 'sp',
      countries: expect.any(Array),
    });
  });
});
