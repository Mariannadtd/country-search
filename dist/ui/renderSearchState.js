import { createElement } from './createApp.js';
const numberFormatter = new Intl.NumberFormat('en-US');
function createFact(label, value) {
    const fact = createElement('div', 'fact');
    const term = createElement('dt', 'fact-label', label);
    const description = createElement('dd', 'fact-value', value);
    fact.append(term, description);
    return fact;
}
function showCountryDetails(country, elements) {
    const title = createElement('h2', 'dialog-title', country.name);
    const flag = createElement('img', 'dialog-flag');
    const description = createElement('p', 'dialog-description', `${country.name} is located in ${country.region}. Its capital is ${country.capital}.`);
    const facts = createElement('dl', 'detail-facts');
    flag.src = country.flagUrl;
    flag.alt = `Flag of ${country.name}`;
    facts.append(createFact('Area', `${numberFormatter.format(country.area)} km²`), createFact('Population', numberFormatter.format(country.population)), createFact('Languages', country.languages.join(', ') || 'Not specified'), createFact('Currencies', country.currencies.join(', ') || 'Not specified'), createFact('Borders', country.borders.join(', ') || 'No land borders'));
    elements.dialogContent.replaceChildren(flag, title, description, facts);
    elements.dialog.showModal();
}
function createCountryCard(country, elements) {
    const card = createElement('button', 'country-card');
    const flag = createElement('img', 'country-flag');
    const content = createElement('span', 'country-card-content');
    const name = createElement('span', 'country-name', country.name);
    const summary = createElement('span', 'country-summary', `${country.capital} · ${country.region}`);
    const population = createElement('span', 'country-population', `${numberFormatter.format(country.population)} people`);
    card.type = 'button';
    flag.src = country.flagUrl;
    flag.alt = `Flag of ${country.name}`;
    flag.loading = 'lazy';
    content.append(name, summary, population);
    card.append(flag, content);
    card.addEventListener('click', () => showCountryDetails(country, elements));
    return card;
}
export function renderSearchState(state, elements) {
    elements.retryButton.hidden = true;
    if (state.status === 'idle') {
        elements.results.replaceChildren();
        elements.status.textContent =
            elements.input.value.trim() === ''
                ? 'Start typing a country name'
                : 'Waiting for you to finish typing…';
        return;
    }
    if (state.status === 'loading') {
        elements.results.replaceChildren();
        elements.status.textContent = `Searching for “${state.query}”…`;
        return;
    }
    if (state.status === 'empty') {
        elements.results.replaceChildren();
        elements.status.textContent = `No countries found for “${state.query}”.`;
        return;
    }
    if (state.status === 'error') {
        elements.results.replaceChildren();
        elements.status.textContent = state.message;
        elements.retryButton.hidden = false;
        return;
    }
    elements.status.textContent = `${state.countries.length} result${state.countries.length === 1 ? '' : 's'} found.`;
    elements.results.replaceChildren(...state.countries.map((country) => createCountryCard(country, elements)));
}
