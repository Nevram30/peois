"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LocationPickerMap } from "./location-picker-map";
import {
  LOCATION_TYPE_LABEL,
  LOCATION_TYPE_VALUES,
  NOMINATIM_REVERSE_URL,
  NOMINATIM_SEARCH_URL,
  osmFullMapHref,
  parseCoord,
  type GeoResult,
  type LocationTypeValue,
} from "~/lib/geo";

// ─── Geospatial Data ──────────────────────────────────────────────────────
// The one place a project's coordinates are captured, shared by the new-project
// and edit-project forms so both offer the same three ways in: search a place,
// pin the device's own position, or drag the map. The coordinates stay strings
// here so a half-typed value survives editing; the parsed pair is handed back
// through `onChange`.
//
// A host that passes `onLocationTypeChange` also gets the Building / Road
// category. A road is captured as two points: `latitude`/`longitude` is its
// start and `endLatitude`/`endLongitude` its end.

const GlobeIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.949 8.949 0 0 0 12 21Zm3-11.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const CompassIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
  </svg>
);

const BuildingIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);

const RoadIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 3 4 21M16 3l4 18M12 4v2m0 4v3m0 4v3" />
  </svg>
);

const SearchIcon = (
  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const PinIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const PinLargeIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const CrosshairIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m9-9h-2.25M5.25 12H3m15 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm-3.75 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
  </svg>
);

const ExternalLinkIcon = (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

const DEFAULT_INPUT_CLASS =
  "block w-full rounded-sm border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none";
const DEFAULT_LABEL_CLASS =
  "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-500";
const DEFAULT_ERROR_CLASS =
  "border-red-400 focus:border-red-500 focus:ring-red-500/20";

/** Which of a road's two points the map, search and locate button set. */
type Point = "start" | "end";

type Props = {
  latitude: string;
  longitude: string;
  onLatitudeChange: (value: string) => void;
  onLongitudeChange: (value: string) => void;
  /** Fires whenever the parsed pair changes, including when it becomes null. */
  onChange?: (lat: number | null, lng: number | null) => void;
  showLatitudeError?: boolean;
  showLongitudeError?: boolean;
  /** Host form styling, so the block sits inside either form's look. */
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  mapClassName?: string;
  /**
   * `default`: uppercase heading, coordinates, then a "Pin My Location" button.
   * `compact`: sentence-case heading, with the locate button inline beside the
   * coordinate pair.
   */
  variant?: "default" | "compact";
  /** Building or Road. The picker only shows when `onLocationTypeChange` is set. */
  locationType?: LocationTypeValue;
  onLocationTypeChange?: (type: LocationTypeValue) => void;
  /** A road's end point; `latitude`/`longitude` is then its start. */
  endLatitude?: string;
  endLongitude?: string;
  onEndLatitudeChange?: (value: string) => void;
  onEndLongitudeChange?: (value: string) => void;
  showEndLatitudeError?: boolean;
  showEndLongitudeError?: boolean;
};

export function GeospatialFields({
  latitude,
  longitude,
  onLatitudeChange,
  onLongitudeChange,
  onChange,
  showLatitudeError = false,
  showLongitudeError = false,
  inputClassName = DEFAULT_INPUT_CLASS,
  labelClassName = DEFAULT_LABEL_CLASS,
  errorClassName = DEFAULT_ERROR_CLASS,
  mapClassName = "h-64",
  variant = "default",
  locationType = "BUILDING",
  onLocationTypeChange,
  endLatitude = "",
  endLongitude = "",
  onEndLatitudeChange,
  onEndLongitudeChange,
  showEndLatitudeError = false,
  showEndLongitudeError = false,
}: Props) {
  const [mapQuery, setMapQuery] = useState("");
  const [mapResults, setMapResults] = useState<GeoResult[]>([]);
  const [isSearchingMap, setIsSearchingMap] = useState(false);
  const [mapSearchMessage, setMapSearchMessage] = useState<string | null>(null);
  // The point a device-location request is filling in, while it is pending.
  const [locatingPoint, setLocatingPoint] = useState<Point | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  // Metres of uncertainty reported by the device, kept so the encoder can see
  // whether the reading is worth adjusting by hand.
  const [geoAccuracy, setGeoAccuracy] = useState<number | null>(null);
  // Address the current pin resolves to, refreshed whenever the pin moves.
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  // Picking a result writes its full name back into the search box; this flag
  // stops that write from triggering another lookup.
  const skipNextGeoSearch = useRef(false);
  const [activePoint, setActivePoint] = useState<Point>("start");

  const compact = variant === "compact";
  const isLocating = locatingPoint !== null;
  const hasCategory = !!onLocationTypeChange;
  const isRoad =
    locationType === "ROAD" && !!onEndLatitudeChange && !!onEndLongitudeChange;
  // A building only has the one point, whatever was last toggled.
  const target: Point = isRoad ? activePoint : "start";

  const parsedLat = useMemo(() => parseCoord(latitude, 90), [latitude]);
  const parsedLng = useMemo(() => parseCoord(longitude, 180), [longitude]);
  const parsedEndLat = useMemo(() => parseCoord(endLatitude, 90), [endLatitude]);
  const parsedEndLng = useMemo(() => parseCoord(endLongitude, 180), [endLongitude]);

  // The map, the reverse lookup and Full View all follow the point being set.
  const pinLat = target === "end" ? parsedEndLat : parsedLat;
  const pinLng = target === "end" ? parsedEndLng : parsedLng;

  const fullMapHref =
    pinLat !== null && pinLng !== null ? osmFullMapHref(pinLat, pinLng) : null;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  useEffect(() => {
    onChangeRef.current?.(parsedLat, parsedLng);
  }, [parsedLat, parsedLng]);

  // Place search. Debounced and aborted on every keystroke to stay inside the
  // Nominatim usage policy (max one request per second).
  useEffect(() => {
    if (skipNextGeoSearch.current) {
      skipNextGeoSearch.current = false;
      return;
    }
    const query = mapQuery.trim();
    if (query.length < 3) {
      setMapResults([]);
      setMapSearchMessage(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setIsSearchingMap(true);
      void fetch(NOMINATIM_SEARCH_URL(query), {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Search request failed");
          return res.json() as Promise<GeoResult[]>;
        })
        .then((results) => {
          setMapResults(results);
          setMapSearchMessage(
            results.length === 0 ? "No matching place found." : null,
          );
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setMapResults([]);
          setMapSearchMessage(
            "Map search is unavailable. Enter the coordinates manually.",
          );
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsSearchingMap(false);
        });
    }, 600);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [mapQuery]);

  // Reverse lookup — names whatever the pin currently sits on, so moving it is
  // confirmed by something readable and not just two changed numbers.
  useEffect(() => {
    if (pinLat === null || pinLng === null) {
      setResolvedAddress(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setIsResolvingAddress(true);
      void fetch(NOMINATIM_REVERSE_URL(pinLat, pinLng), {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Reverse lookup failed");
          return res.json() as Promise<{ display_name?: string }>;
        })
        .then((result) => setResolvedAddress(result.display_name ?? null))
        .catch(() => {
          // The coordinates are still valid without a name for them.
          if (!controller.signal.aborted) setResolvedAddress(null);
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsResolvingAddress(false);
        });
    }, 800);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [pinLat, pinLng]);

  const setPoint = useCallback(
    (point: Point, lat: string, lng: string) => {
      if (point === "end") {
        onEndLatitudeChange?.(lat);
        onEndLongitudeChange?.(lng);
      } else {
        onLatitudeChange(lat);
        onLongitudeChange(lng);
      }
    },
    [onLatitudeChange, onLongitudeChange, onEndLatitudeChange, onEndLongitudeChange],
  );

  const applyGeoResult = (result: GeoResult) => {
    skipNextGeoSearch.current = true;
    setPoint(target, Number(result.lat).toFixed(6), Number(result.lon).toFixed(6));
    setMapQuery(result.display_name);
    setMapResults([]);
    setMapSearchMessage(null);
    setGeoError(null);
    // A searched place is not a device reading, so the accuracy no longer says
    // anything about the pin.
    setGeoAccuracy(null);
  };

  // Dragging or tapping the map is the primary way to adjust the pin; the
  // number fields stay authoritative and simply follow it.
  const handleMapPinChange = useCallback(
    (lat: number, lng: number) => {
      setPoint(target, lat.toFixed(6), lng.toFixed(6));
      setGeoError(null);
      // The reading is the user's own placement now, not the device's.
      setGeoAccuracy(null);
    },
    [setPoint, target],
  );

  // "Pin My Location" seeds the pin from the device; it is a starting point,
  // not the final answer — the map underneath stays adjustable.
  const handleUseMyLocation = (point: Point) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError("Location services are not available in this browser.");
      return;
    }
    if (isRoad) setActivePoint(point);
    setLocatingPoint(point);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPoint(
          point,
          position.coords.latitude.toFixed(6),
          position.coords.longitude.toFixed(6),
        );
        setGeoAccuracy(
          Number.isFinite(position.coords.accuracy)
            ? Math.round(position.coords.accuracy)
            : null,
        );
        setLocatingPoint(null);
      },
      (error) => {
        setGeoError(
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied. Allow it in your browser, or drag the pin on the map."
            : "Could not read your location. Drag the pin on the map or type the coordinates.",
        );
        setLocatingPoint(null);
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 },
    );
  };

  const coordField = ({
    label,
    value,
    onValueChange,
    placeholder,
    showError,
    range,
    point,
  }: {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    showError: boolean;
    range: number;
    point: Point;
  }) => (
    <div className={compact ? "min-w-0" : "flex-1"}>
      <label className={labelClassName}>{label}</label>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        // Typing into a road's point also points the map at it.
        onFocus={isRoad ? () => setActivePoint(point) : undefined}
        placeholder={placeholder}
        className={`${inputClassName} ${showError ? errorClassName : ""}`}
      />
      {showError && (
        <p className="mt-1 text-xs text-red-500">
          Enter a value between -{range} and {range}
        </p>
      )}
    </div>
  );

  // One compact row: Lat, Long and the device-location button for a point.
  const coordRow = (point: Point) => {
    const isEnd = point === "end";
    const suffix = isRoad ? (isEnd ? "End" : "Start") : "Pri";
    const locateLabel = isRoad
      ? `Pin my location as the road's ${isEnd ? "end" : "start"}`
      : "Pin my location";
    return (
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-start gap-3">
        {coordField({
          label: `Lat (${suffix})`,
          value: isEnd ? endLatitude : latitude,
          onValueChange: isEnd ? (v) => onEndLatitudeChange?.(v) : onLatitudeChange,
          placeholder: "7.4478",
          showError: isEnd ? showEndLatitudeError : showLatitudeError,
          range: 90,
          point,
        })}
        {coordField({
          label: `Long (${suffix})`,
          value: isEnd ? endLongitude : longitude,
          onValueChange: isEnd ? (v) => onEndLongitudeChange?.(v) : onLongitudeChange,
          placeholder: "125.8078",
          showError: isEnd ? showEndLongitudeError : showLongitudeError,
          range: 180,
          point,
        })}
        <div>
          {/* Invisible label keeps the button level with the inputs. */}
          <span aria-hidden className={`${labelClassName} invisible`}>
            Pin
          </span>
          <button
            type="button"
            onClick={() => handleUseMyLocation(point)}
            disabled={isLocating}
            aria-label={locateLabel}
            title={locateLabel}
            className={`flex h-11.5 w-12 items-center justify-center rounded-md text-blue-900 shadow-sm transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60 ${
              isRoad && target === point ? "bg-blue-100 ring-2 ring-blue-300" : "bg-slate-100"
            }`}
          >
            {locatingPoint === point ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
            ) : isEnd ? (
              PinLargeIcon
            ) : (
              CrosshairIcon
            )}
          </button>
        </div>
      </div>
    );
  };

  const accuracyNote = geoAccuracy !== null && (
    <span className="text-xs text-gray-500">
      Device accuracy ±{geoAccuracy} m — drag the map to correct it.
    </span>
  );

  return (
    <div className={compact ? "space-y-4" : "space-y-3"}>
      {compact ? (
        <div className="flex items-center gap-2">
          <span className="text-blue-900">{CompassIcon}</span>
          <span className="text-base font-semibold text-slate-900">
            Geospatial Data
          </span>
          {/* The category doubles as the project's work tag. */}
          {hasCategory && (
            <span
              className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                isRoad ? "bg-amber-100 text-amber-800" : "bg-blue-50 text-blue-800"
              }`}
            >
              {isRoad ? RoadIcon : BuildingIcon}
              {LOCATION_TYPE_LABEL[isRoad ? "ROAD" : "BUILDING"]} Work
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-blue-500">{GlobeIcon}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-700">
            Geospatial Data
          </span>
        </div>
      )}

      {/* Location category: a building is one point, a road two */}
      {hasCategory && (
        <div>
          <label className={labelClassName}>Location Category</label>
          <div
            role="radiogroup"
            aria-label="Location category"
            className="grid grid-cols-2 gap-1 rounded-md bg-slate-100 p-1"
          >
            {LOCATION_TYPE_VALUES.map((type) => {
              const selected = locationType === type;
              return (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    onLocationTypeChange(type);
                    setActivePoint("start");
                  }}
                  className={`flex items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium transition ${
                    selected
                      ? "bg-white text-blue-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {type === "ROAD" ? RoadIcon : BuildingIcon}
                  {LOCATION_TYPE_LABEL[type]}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            {isRoad
              ? "Captures the road's start and end points."
              : "Captures the building's location as a single point."}
          </p>
        </div>
      )}

      {/* Place search */}
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-gray-400">
          {SearchIcon}
        </span>
        <input
          type="text"
          value={mapQuery}
          onChange={(e) => setMapQuery(e.target.value)}
          placeholder={
            isRoad
              ? `Search the road's ${target === "end" ? "end" : "start"} on map...`
              : "Search on map..."
          }
          autoComplete="off"
          className={`${inputClassName} pl-11`}
        />
        {isSearchingMap && (
          <span className="absolute inset-y-0 right-3.5 flex items-center">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500" />
          </span>
        )}
        {mapResults.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-sm border border-gray-200 bg-white py-1 shadow-lg">
            {mapResults.map((result) => (
              <li key={result.place_id}>
                <button
                  type="button"
                  onClick={() => applyGeoResult(result)}
                  className="flex w-full items-start gap-2 px-3 py-2 text-left text-xs text-gray-700 hover:bg-blue-50"
                >
                  <span className="mt-0.5 shrink-0 text-blue-400">{PinIcon}</span>
                  <span className="line-clamp-2">{result.display_name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {mapSearchMessage && (
          <p className="mt-1 text-xs text-gray-400">{mapSearchMessage}</p>
        )}
      </div>

      {compact ? (
        <>
          {/* Coordinates, with the device-location button inline */}
          {coordRow("start")}
          {isRoad && coordRow("end")}
          {accuracyNote && <p>{accuracyNote}</p>}
        </>
      ) : (
        <>
          {/* Coordinates */}
          <div className="flex items-start gap-3">
            {coordField({
              label: "Latitude",
              value: latitude,
              onValueChange: onLatitudeChange,
              placeholder: "7.4478",
              showError: showLatitudeError,
              range: 90,
              point: "start",
            })}
            {coordField({
              label: "Longitude",
              value: longitude,
              onValueChange: onLongitudeChange,
              placeholder: "125.8078",
              showError: showLongitudeError,
              range: 180,
              point: "start",
            })}
          </div>

          {/* Pin from the device, then adjust by hand on the map */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleUseMyLocation("start")}
              disabled={isLocating}
              className="inline-flex items-center gap-2 rounded-sm border border-blue-200 bg-blue-50 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-blue-700 shadow-sm transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLocating ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
              ) : (
                CrosshairIcon
              )}
              {isLocating ? "Locating..." : "Pin My Location"}
            </button>
            {accuracyNote}
          </div>
        </>
      )}

      {geoError && <p className="text-xs text-red-500">{geoError}</p>}

      {/* Road: choose which point the map pin places */}
      {isRoad && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium text-gray-600">Map pin sets the</span>
          <div className="inline-flex rounded-md bg-slate-100 p-0.5">
            {(["start", "end"] as const).map((point) => (
              <button
                key={point}
                type="button"
                aria-pressed={activePoint === point}
                onClick={() => setActivePoint(point)}
                className={`rounded px-3 py-1.5 text-xs font-semibold transition ${
                  activePoint === point
                    ? "bg-white text-blue-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {point === "start" ? "Start point" : "End point"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactive map — the pin is whatever the centre sits on */}
      <div className={compact ? "relative overflow-hidden rounded-md border border-gray-200 shadow-sm" : "relative"}>
        <LocationPickerMap
          latitude={pinLat}
          longitude={pinLng}
          onChange={handleMapPinChange}
          className={mapClassName}
        />
        {isRoad && (
          <span className="pointer-events-none absolute top-3 right-3 rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-md">
            {target === "end" ? "End point" : "Start point"}
          </span>
        )}
        {fullMapHref && (
          <a
            href={fullMapHref}
            target="_blank"
            rel="noopener noreferrer"
            className={
              compact
                ? "absolute right-3 bottom-3 flex items-center gap-2 rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 shadow-md transition hover:text-blue-700"
                : "absolute right-3 bottom-3 flex items-center gap-1.5 rounded-sm bg-white/95 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-700 shadow-md transition hover:bg-white hover:text-blue-600"
            }
          >
            <span className={compact ? "text-slate-900" : "text-blue-500"}>{ExternalLinkIcon}</span>
            Full View
          </a>
        )}
      </div>

      <p className="text-xs text-gray-400">
        {isRoad
          ? "Pick Start or End point, then tap or drag the map to place it — the coordinates follow."
          : pinLat === null || pinLng === null
            ? compact
              ? "Tap the map, search for a place, or use the locate button to drop the pin."
              : "Tap the map, search for a place, or use Pin My Location to drop the pin."
            : "Drag or tap the map to adjust the pin — the coordinates follow it."}
      </p>

      {(isResolvingAddress || resolvedAddress) && (
        <p className="flex items-start gap-1.5 text-xs text-gray-500">
          <span className="mt-0.5 shrink-0 text-blue-400">{PinIcon}</span>
          <span className="line-clamp-2">
            {isResolvingAddress && !resolvedAddress
              ? "Resolving address..."
              : resolvedAddress}
          </span>
        </p>
      )}
    </div>
  );
}
