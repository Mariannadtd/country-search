function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  element.className = className;

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

export function createApp(): void {
  const app = createElement('main', 'app');

  const header = createElement('header', 'header');
  const title = createElement('h1', 'title', 'Country Search');
  const description = createElement('p', 'description', 'Find information about any country');

  header.append(title, description);

  const searchForm = createElement('form', 'search-form');
  const label = createElement('label', 'search-label', 'Country name');
  const input = createElement('input', 'search-input');

  input.type = 'search';
  input.name = 'country';
  input.placeholder = 'For example: Spain';
  input.autocomplete = 'off';

  label.htmlFor = 'country-search';
  input.id = 'country-search';

  searchForm.append(label, input);

  const status = createElement('p', 'status', 'Start typing a country name');

  status.setAttribute('aria-live', 'polite');

  const results = createElement('section', 'results');
  results.setAttribute('aria-label', 'Search results');

  app.append(header, searchForm, status, results);
  document.body.append(app);
}
