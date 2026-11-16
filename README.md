# Country Search

A TypeScript application for live country search using the public `countries.dev` API.

## Features

- debounced search while the user types;
- real cancellation of obsolete requests with `AbortController`;
- request timeout with a distinct `TimeoutError` path;
- friendly loading, empty, error, and result states;
- Retry for the latest query;
- country cards and a detailed dialog;
- tests for mapping, HTTP semantics, cancellation, timeout classification, and request races.

## Run locally

```bash
npm install
npm run build
```

Serve the repository root with a local static server and open `index.html`. After changing TypeScript, run `npm run build` again.

## Commands

```bash
npm test
npm run build
npm run lint
npm run format
npm run format:check
```

## Architecture

See [DESIGN.md](./DESIGN.md) for cancellation, debounce, complexity, and clean-code decisions.
