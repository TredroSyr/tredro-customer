export interface ReverseGeocodeResult {
  governorate: string;
  region: string;
  city: string;
  displayName: string;
}

interface NominatimAddress {
  state?: string;
  region?: string;
  state_district?: string;
  county?: string;
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  city_district?: string;
}

/** Resolves a lat/lng pick to a governorate/region/city breakdown via OpenStreetMap's Nominatim reverse-geocoding API (best-effort, no API key needed since the map already relies on OSM tiles). For Syrian addresses, Nominatim's `state` maps to المحافظة and `state_district` maps to المنطقة. */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<ReverseGeocodeResult> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ar&zoom=14`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error("reverse-geocode-failed");
  }
  const data: { address?: NominatimAddress; display_name?: string } =
    await response.json();
  const address = data.address ?? {};

  return {
    governorate: address.state ?? address.region ?? "",
    region: address.state_district ?? address.county ?? "",
    city:
      address.city ??
      address.town ??
      address.village ??
      address.suburb ??
      address.city_district ??
      "",
    displayName: data.display_name ?? "",
  };
}
