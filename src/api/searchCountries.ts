import { HttpError } from '../errors/HttpError.js';
import { mapCountryResponse } from '../mappers/mapCountryResponse.js';
import type { Country, RawCountry } from '../types/country.js';

const COUNTRIES_API_URL = 'https://countries.dev/name';

export async function searchCountries(query: string, signal: AbortSignal): Promise<Country[]> {
  const encodedQuery = encodeURIComponent(query);

  const response = await fetch(`${COUNTRIES_API_URL}/${encodedQuery}`, {
    signal,
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new HttpError(`Country request failed with status ${response.status}`, response.status);
  }

  const rawCountries = (await response.json()) as RawCountry[];

  return rawCountries.map(mapCountryResponse);
}
