export function createRequestSignal(userSignal, timeoutMs) {
    return AbortSignal.any([userSignal, AbortSignal.timeout(timeoutMs)]);
}
