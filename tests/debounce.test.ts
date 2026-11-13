import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { debounce } from '../src/utils/debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('delays the function call for the specified time', () => {
    const callback = vi.fn();
    const debouncedCallback = debounce(callback, 300);

    debouncedCallback('spain');

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith('spain');
  });

  it('resets the timer when called again before the delay expires', () => {
    const callback = vi.fn();
    const debouncedCallback = debounce(callback, 300);

    debouncedCallback('sp');
    vi.advanceTimersByTime(200);

    debouncedCallback('spain');
    vi.advanceTimersByTime(299);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith('spain');
  });

  it('uses arguments from the latest call', () => {
    const callback = vi.fn();
    const debouncedCallback = debounce(callback, 300);

    debouncedCallback('s');
    debouncedCallback('sp');
    debouncedCallback('spain');

    vi.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith('spain');
  });
});
