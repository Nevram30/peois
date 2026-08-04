// ─── Geocoding ────────────────────────────────────────────────────────────
// Free-form place search and reverse lookup are served by OpenStreetMap's
// Nominatim endpoint — no API key and no extra dependency, in exchange for a
// strict usage policy (hence the debounces at every call site).

export type GeoResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

/**
 * Returns null for anything that is not a usable coordinate, so a half-typed
 * value ("-", "125.") simply reads as "no pin yet" instead of NaN.
 */
export const parseCoord = (value: string, max: number) => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || Math.abs(parsed) > max) return null;
  return parsed;
};

export const NOMINATIM_SEARCH_URL = (query: string) =>
  `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=ph&q=${encodeURIComponent(query)}`;

export const NOMINATIM_REVERSE_URL = (lat: number, lng: number) =>
  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&lat=${lat}&lon=${lng}`;

export const osmFullMapHref = (lat: number, lng: number) =>
  `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
