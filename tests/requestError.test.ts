import { describe, expect, it } from 'vitest';

import { HttpError } from '../src/errors/HttpError';
import { classifyRequestError } from '../src/errors/classifyRequestError';

describe('classifyRequestError', () => {
  it('recognizes a request aborted by the application', () => {
    const error = new DOMException('The request was aborted', 'AbortError');

    expect(classifyRequestError(error)).toBe('aborted');
  });

  it('recognizes a request timeout', () => {
    const error = new DOMException('The request timed out', 'TimeoutError');

    expect(classifyRequestError(error)).toBe('timeout');
  });

  it('recognizes an HTTP error', () => {
    const error = new HttpError('Server error', 500);

    expect(classifyRequestError(error)).toBe('http');
  });

  it('treats other errors as network errors', () => {
    const error = new TypeError('Failed to fetch');

    expect(classifyRequestError(error)).toBe('network');
  });
});
