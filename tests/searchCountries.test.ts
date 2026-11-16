import { afterEach, describe, expect, it, vi } from 'vitest';

import { searchCountries } from '../src/api/searchCountries';
import { HttpError } from '../src/errors/HttpError';

function createResponse(body: unknown, options: { ok: boolean; status: number }): Response {
  return {
    ok: options.ok,
    status: options.status,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe('HttpError', () => {
  it('is an Error that stores the HTTP status', () => {
    const error = new HttpError('Request failed', 500);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('HttpError');
    expect(error.message).toBe('Request failed');
    expect(error.status).toBe(500);
  });
});

describe('searchCountries', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests countries and maps the successful response', async () => {
    const rawCountry = {
      name: 'Spain',
      capital: 'Madrid',
      region: 'Europe',
      population: 47_351_567,
      area: 505_992,
      flags: {
        png: 'https://flagcdn.com/w320/es.png',
        svg: 'https://flagcdn.com/es.svg',
      },
      languages: [{ name: 'Spanish' }],
      currencies: [{ name: 'Euro' }],
      borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
    };

    const fetchMock = vi
      .fn()
      .mockResolvedValue(createResponse([rawCountry], { ok: true, status: 200 }));

    vi.stubGlobal('fetch', fetchMock);

    const controller = new AbortController();
    const result = await searchCountries('spain', controller.signal);

    expect(fetchMock).toHaveBeenCalledWith('https://countries.dev/name/spain', {
      signal: controller.signal,
    });

    expect(result).toEqual([
      {
        name: 'Spain',
        capital: 'Madrid',
        region: 'Europe',
        population: 47_351_567,
        area: 505_992,
        flagUrl: 'https://flagcdn.com/es.svg',
        languages: ['Spanish'],
        currencies: ['Euro'],
        borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
      },
    ]);
  });

  it('returns an empty array when the API responds with 404', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createResponse(null, { ok: false, status: 404 }));

    vi.stubGlobal('fetch', fetchMock);

    const result = await searchCountries('missing-country', new AbortController().signal);

    expect(result).toEqual([]);
  });

  it('throws HttpError for a non-404 unsuccessful response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createResponse(null, { ok: false, status: 500 }));

    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCountries('spain', new AbortController().signal)).rejects.toMatchObject({
      name: 'HttpError',
      status: 500,
    });
  });
});
