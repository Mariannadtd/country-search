export function createRequestSignal(userSignal: AbortSignal, timeoutMs: number): AbortSignal {
  return AbortSignal.any([userSignal, AbortSignal.timeout(timeoutMs)]);
}
