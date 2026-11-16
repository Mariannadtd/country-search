import { describe, expect, it } from 'vitest';

import { mapCountryResponse } from '../src/mappers/mapCountryResponse';

describe('mapCountryResponse', () => {
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
    languages: [
      {
        name: 'Spanish',
        iso639_1: 'es',
        iso639_2: 'spa',
        nativeName: 'Español',
      },
    ],
    currencies: [
      {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
      },
    ],
    borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
  };

  it('converts an API country into application data', () => {
    expect(mapCountryResponse(rawCountry)).toEqual({
      name: 'Spain',
      capital: 'Madrid',
      region: 'Europe',
      population: 47_351_567,
      area: 505_992,
      flagUrl: 'https://flagcdn.com/es.svg',
      languages: ['Spanish'],
      currencies: ['Euro'],
      borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
    });
  });

  it('does not change the original API object', () => {
    const originalCountry = structuredClone(rawCountry);

    mapCountryResponse(rawCountry);

    expect(rawCountry).toEqual(originalCountry);
  });
});
