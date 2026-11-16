# Country Search design

## Request cancellation

`CountrySearchController.handleInput` aborts the active `AbortController` on every input event, before the debounced search is allowed to start. This order is intentional: if cancellation happened only when the next debounced callback ran, the previous request could resolve during the debounce delay and render stale data.

Each network request receives a signal created by `createRequestSignal`. It combines the controller owned by the current user interaction with `AbortSignal.timeout` through `AbortSignal.any`. Therefore either a new input or the timeout can stop the same `fetch`, while the original abort reason is preserved.

`classifyRequestError` keeps the outcomes separate:

- `AbortError` means the application cancelled an obsolete request, so no error is shown;
- `TimeoutError` means the server did not answer in time, so the UI shows an error and Retry;
- `HttpError` represents a non-successful HTTP status other than 404;
- other failures are treated as network errors.

The API uses 404 to mean that no country matched. `searchCountries` converts that response to an empty array instead of throwing. The controller then emits the dedicated `empty` state.

Ignoring stale results with a timestamp or an “is current” flag would hide the race visually, but would leave obsolete network work running. Real cancellation releases resources and is observable as an aborted request in the browser Network panel.

## Debounce delay

The delay is 350 ms. It is long enough to avoid a request for every keystroke during ordinary typing, but short enough for the interface to still feel immediate.

Without debounce, typing `spain` could start five requests. A very large delay would reduce requests further but make the interface feel unresponsive. Cancellation and debounce solve different problems: debounce prevents unnecessary future requests, while `AbortController` stops a request that has already started.

## Complexity

`mapCountryResponse` maps the language and currency arrays and copies the borders array. If `L` is the number of languages, `C` the number of currencies, and `B` the number of borders, its time complexity is `O(L + C + B)`. The returned arrays require `O(L + C + B)` additional memory.

Rendering search results is `O(N)`, where `N` is the number of returned countries. Each card is built once with DOM methods.

## Clean-code decisions

- **Single responsibility:** `searchCountries` handles HTTP semantics, `mapCountryResponse` transforms data, `CountrySearchController` coordinates state, and the files in `src/ui` create and render the DOM.
- **Dependency injection:** `CountrySearchController` accepts a search function and a state listener. The request-race test can use a deterministic mock without a real network or DOM.
- **Pure functions:** `mapCountryResponse` and `classifyRequestError` do not depend on the DOM and do not mutate their arguments.
- **Explicit state:** the `SearchState` discriminated union defines idle, loading, results, empty, and error states. Rendering is based on those states rather than scattered Boolean flags.
- **Small named helpers:** `createRequestSignal`, `createCountryCard`, `createFact`, and `createElement` keep individual operations readable.
- **Safe DOM updates:** dynamic content uses `textContent`, `append`, and `replaceChildren`; the application does not use `innerHTML` or `insertAdjacentHTML`.

## Test strategy

Network calls are mocked. Utility tests use fake timers where appropriate. The race test deliberately starts an older request, starts a newer request, verifies that the older signal is aborted, and makes the mock reject with `AbortError`. The final state is asserted to contain only the newer result.
