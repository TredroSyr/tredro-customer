import { Geolocation, type Position } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";

export class GeoPermissionError extends Error {
  constructor() {
    super("permission-denied");
    this.name = "GeoPermissionError";
  }
}

/** الموقع غير متاح لأن الصفحة مش مفتوحة عبر HTTPS (أو localhost). */
export class GeoInsecureContextError extends Error {
  constructor() {
    super("insecure-context");
    this.name = "GeoInsecureContextError";
  }
}

function assertSecureContext() {
  if (typeof window === "undefined") return;
  if (!Capacitor.isNativePlatform() && window.isSecureContext === false) {
    throw new GeoInsecureContextError();
  }
}

async function ensurePermission() {
  if (!Capacitor.isNativePlatform()) return true; // browser prompts natively via getCurrentPosition
  const status = await Geolocation.checkPermissions();
  if (status.location === "granted") return true;
  const req = await Geolocation.requestPermissions();
  return req.location === "granted";
}

/** One-shot high-accuracy fix. Resolves to [lat, lng] or throws GeoPermissionError / GeoInsecureContextError. */
export async function getCurrentPosition(): Promise<[number, number]> {
  assertSecureContext();
  const ok = await ensurePermission();
  if (!ok) throw new GeoPermissionError();
  const pos: Position = await Geolocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 8000,
  });
  return [pos.coords.latitude, pos.coords.longitude];
}
