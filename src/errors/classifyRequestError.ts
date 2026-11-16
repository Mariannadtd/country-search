import { HttpError } from './HttpError.js';

export type RequestErrorKind = 'aborted' | 'timeout' | 'http' | 'network';

export function classifyRequestError(error: unknown): RequestErrorKind {
  if (error instanceof DOMException) {
    if (error.name === 'AbortError') {
      return 'aborted';
    }

    if (error.name === 'TimeoutError') {
      return 'timeout';
    }
  }

  if (error instanceof HttpError) {
    return 'http';
  }

  return 'network';
}
