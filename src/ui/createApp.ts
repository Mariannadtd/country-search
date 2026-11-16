export interface AppElements {
  readonly form: HTMLFormElement;
  readonly input: HTMLInputElement;
  readonly status: HTMLParagraphElement;
  readonly results: HTMLElement;
  readonly retryButton: HTMLButtonElement;
  readonly dialog: HTMLDialogElement;
  readonly dialogContent: HTMLDivElement;
  readonly closeDialogButton: HTMLButtonElement;
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
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

export function createApp(): AppElements {
  const app = createElement('main', 'app');

  const header = createElement('header', 'header');
  const eyebrow = createElement('p', 'eyebrow', 'Explore the world');
  const title = createElement('h1', 'title', 'Country Search');
  const description = createElement(
    'p',
    'description',
    'Find capitals, languages, currencies and more.',
  );

  header.append(eyebrow, title, description);

  const form = createElement('form', 'search-form');
  const label = createElement('label', 'search-label', 'Country name');
  const searchRow = createElement('div', 'search-row');
  const input = createElement('input', 'search-input');
  const searchButton = createElement('button', 'search-button', 'Search');

  input.type = 'search';
  input.name = 'country';
  input.placeholder = 'For example: Spain';
  input.autocomplete = 'off';
  input.id = 'country-search';
  label.htmlFor = input.id;
  searchButton.type = 'submit';

  searchRow.append(input, searchButton);
  form.append(label, searchRow);

  const feedback = createElement('div', 'feedback');
  const status = createElement('p', 'status', 'Start typing a country name');
  const retryButton = createElement('button', 'retry-button', 'Try again');

  status.setAttribute('aria-live', 'polite');
  retryButton.type = 'button';
  retryButton.hidden = true;
  feedback.append(status, retryButton);

  const results = createElement('section', 'results');
  results.setAttribute('aria-label', 'Search results');

  const dialog = createElement('dialog', 'country-dialog');
  const dialogPanel = createElement('div', 'dialog-panel');
  const closeDialogButton = createElement('button', 'dialog-close', 'Close');
  const dialogContent = createElement('div', 'dialog-content');

  closeDialogButton.type = 'button';
  closeDialogButton.setAttribute('aria-label', 'Close country details');
  dialogPanel.append(closeDialogButton, dialogContent);
  dialog.append(dialogPanel);

  app.append(header, form, feedback, results);
  document.body.append(app, dialog);

  return {
    form,
    input,
    status,
    results,
    retryButton,
    dialog,
    dialogContent,
    closeDialogButton,
  };
}
