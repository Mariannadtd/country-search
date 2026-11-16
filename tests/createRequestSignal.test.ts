import { afterEach, describe, expect, it, vi } from 'vitest';

import { createRequestSignal } from '../src/api/createRequestSignal';

describe('createRequestSignal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('aborts with AbortError when the user signal is aborted', () => {
    const userController = new AbortController();
    const timeoutController = new AbortController();

    vi.spyOn(AbortSignal, 'timeout').mockReturnValue(timeoutController.signal);

    const signal = createRequestSignal(userController.signal, 5_000);

    userController.abort();

    expect(signal.aborted).toBe(true);
    expect(signal.reason).toBeInstanceOf(DOMException);
    expect(signal.reason.name).toBe('AbortError');
  });

  it('aborts with TimeoutError when the timeout signal is aborted', () => {
    const userController = new AbortController();
    const timeoutController = new AbortController();

    vi.spyOn(AbortSignal, 'timeout').mockReturnValue(timeoutController.signal);

    const signal = createRequestSignal(userController.signal, 5_000);

    timeoutController.abort(new DOMException('The request timed out', 'TimeoutError'));

    expect(AbortSignal.timeout).toHaveBeenCalledWith(5_000);
    expect(signal.aborted).toBe(true);
    expect(signal.reason).toBeInstanceOf(DOMException);
    expect(signal.reason.name).toBe('TimeoutError');
  });
});
