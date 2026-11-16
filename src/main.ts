import { CountrySearchController } from './controllers/CountrySearchController.js';
import { createApp } from './ui/createApp.js';
import { renderSearchState } from './ui/renderSearchState.js';

const elements = createApp();
const controller = new CountrySearchController((state) => {
  renderSearchState(state, elements);
});

elements.input.addEventListener('input', () => {
  controller.handleInput(elements.input.value);
});

elements.form.addEventListener('submit', (event) => {
  event.preventDefault();
  controller.handleInput(elements.input.value);
});

elements.retryButton.addEventListener('click', () => {
  controller.retry();
});

elements.closeDialogButton.addEventListener('click', () => {
  elements.dialog.close();
});

elements.dialog.addEventListener('click', (event) => {
  if (event.target === elements.dialog) {
    elements.dialog.close();
  }
});
