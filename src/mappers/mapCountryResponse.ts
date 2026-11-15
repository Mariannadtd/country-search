import type { Country, RawCountry } from '../types/country.js';

export function mapCountryResponse(rawCountry: RawCountry): Country {
  return {
    name: rawCountry.name,
    capital: rawCountry.capital,
    region: rawCountry.region,
    population: rawCountry.population,
    area: rawCountry.area,
    flagUrl: rawCountry.flags.svg,
    languages: rawCountry.languages.map((language) => language.name),
    currencies: rawCountry.currencies.map((currency) => currency.name),
    borders: [...rawCountry.borders],
  };
}
