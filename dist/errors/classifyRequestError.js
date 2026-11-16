import { HttpError } from './HttpError.js';
export function classifyRequestError(error) {
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
