export function mapCountryResponse(rawCountry) {
    return {
        name: rawCountry.name,
        capital: rawCountry.capital ?? 'No capital',
        region: rawCountry.region ?? 'Unknown region',
        population: rawCountry.population ?? 0,
        area: rawCountry.area ?? 0,
        flagUrl: rawCountry.flags?.svg ?? rawCountry.flags?.png ?? '',
        languages: (rawCountry.languages ?? []).map((language) => language.name),
        currencies: (rawCountry.currencies ?? []).map((currency) => currency.name),
        borders: [...(rawCountry.borders ?? [])],
    };
}
