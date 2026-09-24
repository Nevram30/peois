"use client";

import { formatCoord, osmEmbedSrc, osmFullMapHref } from "~/lib/geo";

// ─── Geospatial Data, read-only ───────────────────────────────────────────
// The view counterpart to <GeospatialFields>: the same pin, shown on a static
// OpenStreetMap embed with no way to move it. Used by the project detail pages.

const GlobeIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.949 8.949 0 0 0 12 21Zm3-11.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const ExternalLinkIcon = (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

const MapPlaceholderIcon = (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
  </svg>
);

type Props = {
  latitude: number | null;
  longitude: number | null;
  /** Host page styling for the two coordinate readouts. */
  labelClassName?: string;
  valueClassName?: string;
  mapClassName?: string;
  /** False when the host page places <GeospatialMap> itself (e.g. beside the fields). */
  showMap?: boolean;
};

export function GeospatialSummary({
  latitude,
  longitude,
  labelClassName = "text-[11px] font-semibold uppercase tracking-wider text-gray-400",
  valueClassName = "mt-1 w-full text-sm font-medium text-gray-800",
  mapClassName = "h-52",
  showMap = true,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-blue-500">{GlobeIcon}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-700">
          Geospatial Data
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClassName}>Latitude</label>
          <div className={valueClassName}>
            {latitude !== null ? formatCoord(latitude, "lat") : "—"}
          </div>
        </div>
        <div>
          <label className={labelClassName}>Longitude</label>
          <div className={valueClassName}>
            {longitude !== null ? formatCoord(longitude, "lng") : "—"}
          </div>
        </div>
      </div>

      {showMap && (
        <GeospatialMap latitude={latitude} longitude={longitude} className={mapClassName} />
      )}
    </div>
  );
}

// The static map on its own, for pages that lay it out separately from the
// coordinate readouts.
export function GeospatialMap({
  latitude,
  longitude,
  className = "h-52",
}: {
  latitude: number | null;
  longitude: number | null;
  className?: string;
}) {
  const hasPin = latitude !== null && longitude !== null;

  return (
    <div
      className={`relative overflow-hidden rounded-sm border border-gray-200 bg-gray-50 ${className}`}
    >
      {hasPin ? (
        <>
          <iframe
            src={osmEmbedSrc(latitude, longitude)}
            title="Project location map"
            loading="lazy"
            className="h-full w-full border-0"
          />
          <a
            href={osmFullMapHref(latitude, longitude)}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-sm bg-white/95 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-700 shadow-md transition hover:bg-white hover:text-blue-600"
          >
            <span className="text-blue-500">{ExternalLinkIcon}</span>
            Full View
          </a>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-gray-400">
          {MapPlaceholderIcon}
          <p className="text-[11px] font-semibold uppercase tracking-widest">
            No Pin Recorded
          </p>
          <p className="text-xs">
            Coordinates have not been set for this project.
          </p>
        </div>
      )}
    </div>
  );
}
