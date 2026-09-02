/**
 * This app has no backend yet — every feature module's `api/index.ts` calls
 * `mockDelay` instead of hitting `lib/axios.ts`, but returns data shaped
 * exactly like the eventual real response ({success, message, data}
 * envelopes, see `lib/api-types.ts`) so swapping in real endpoints later is a
 * one-line change per module. Mirrors the stand-in convention already used
 * for the sales-rep app's home/notifications mock data.
 */
export function mockDelay<T>(data: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}
