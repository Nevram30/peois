"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// ─── Slippy map ───────────────────────────────────────────────────────────
// A minimal OpenStreetMap tile viewer. The pin is fixed to the centre of the
// viewport and the map moves under it, so dragging (or tapping) is what
// adjusts the coordinates — the same gesture the field crews already know from
// ride-hailing apps. Tiles come straight from the OSM tile server, matching the
// dependency-free approach the place search already takes.

const TILE_SIZE = 256;
const MIN_ZOOM = 4;
const MAX_ZOOM = 19;
// Web Mercator is undefined at the poles; this is the usual cut-off.
const MAX_LAT = 85.05112878;
// Davao del Norte — where the map opens before a pin exists.
const FALLBACK_CENTER = { lat: 7.4478, lng: 125.8078 };
const KEYBOARD_STEP_PX = 24;

type LatLng = { lat: number; lng: number };

const project = (lat: number, lng: number, zoom: number) => {
  const scale = TILE_SIZE * 2 ** zoom;
  const clampedLat = Math.max(-MAX_LAT, Math.min(MAX_LAT, lat));
  const sin = Math.sin((clampedLat * Math.PI) / 180);
  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
};

const unproject = (x: number, y: number, zoom: number): LatLng => {
  const scale = TILE_SIZE * 2 ** zoom;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lng = (x / scale) * 360 - 180;
  return {
    lat: (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))),
    // Panning past the date line wraps rather than running off the scale.
    lng: ((((lng + 180) % 360) + 360) % 360) - 180,
  };
};

const isSameSpot = (a: LatLng, b: LatLng) =>
  Math.abs(a.lat - b.lat) < 1e-6 && Math.abs(a.lng - b.lng) < 1e-6;

type Props = {
  latitude: number | null;
  longitude: number | null;
  // Fired once a gesture settles, never on every frame of a drag.
  onChange: (lat: number, lng: number) => void;
  className?: string;
};

export function LocationPickerMap({
  latitude,
  longitude,
  onChange,
  className = "",
}: Props) {
  const hasPin = latitude !== null && longitude !== null;

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(16);
  const [center, setCenter] = useState<LatLng>(
    hasPin ? { lat: latitude, lng: longitude } : FALLBACK_CENTER,
  );
  const [isDragging, setIsDragging] = useState(false);

  // The pointerup handler needs the centre the last pointermove produced, not
  // the one captured when the gesture started.
  const centerRef = useRef(center);
  centerRef.current = center;

  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);

  // Coordinates set elsewhere — typed in, geolocated, or picked from search —
  // recentre the map without touching the zoom the user chose.
  useEffect(() => {
    if (latitude === null || longitude === null) return;
    const next = { lat: latitude, lng: longitude };
    setCenter((prev) => (isSameSpot(prev, next) ? prev : next));
  }, [latitude, longitude]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () =>
      setSize({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const commit = useCallback(
    (next: LatLng) => {
      setCenter(next);
      onChange(next.lat, next.lng);
    },
    [onChange],
  );

  // Zoom keeps the pin — the map centre — exactly where it is.
  const changeZoom = (delta: number) =>
    setZoom((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z + delta)));

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const origin = project(centerRef.current.lat, centerRef.current.lng, zoom);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: origin.x,
      originY: origin.y,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    if (drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) > 3) drag.moved = true;
    if (!drag.moved) return;
    const scale = TILE_SIZE * 2 ** zoom;
    // The map follows the pointer, so the centre moves the opposite way.
    setCenter(
      unproject(
        drag.originX - dx,
        Math.max(0, Math.min(scale, drag.originY - dy)),
        zoom,
      ),
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    if (drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (drag.moved) {
      commit(centerRef.current);
      return;
    }

    // A tap that never turned into a drag drops the pin where it landed.
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    const origin = project(centerRef.current.lat, centerRef.current.lng, zoom);
    commit(unproject(origin.x + offsetX, origin.y + offsetY, zoom));
  };

  const handlePointerCancel = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  // Dragging is unusable without a mouse or touch, so the arrows nudge the pin.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const nudge: Record<string, [number, number]> = {
      ArrowUp: [0, -KEYBOARD_STEP_PX],
      ArrowDown: [0, KEYBOARD_STEP_PX],
      ArrowLeft: [-KEYBOARD_STEP_PX, 0],
      ArrowRight: [KEYBOARD_STEP_PX, 0],
    };
    const step = nudge[e.key];
    if (step) {
      e.preventDefault();
      const origin = project(centerRef.current.lat, centerRef.current.lng, zoom);
      commit(unproject(origin.x + step[0], origin.y + step[1], zoom));
      return;
    }
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      changeZoom(1);
    } else if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      changeZoom(-1);
    }
  };

  // ── Tile grid ────────────────────────────────────────────────────────
  const worldCenter = project(center.lat, center.lng, zoom);
  const left = worldCenter.x - size.width / 2;
  const top = worldCenter.y - size.height / 2;
  const tileCount = 2 ** zoom;

  const tiles: { key: string; url: string; x: number; y: number }[] = [];
  if (size.width > 0 && size.height > 0) {
    const minTileX = Math.floor(left / TILE_SIZE);
    const maxTileX = Math.floor((left + size.width) / TILE_SIZE);
    const minTileY = Math.max(0, Math.floor(top / TILE_SIZE));
    const maxTileY = Math.min(
      tileCount - 1,
      Math.floor((top + size.height) / TILE_SIZE),
    );
    for (let tileX = minTileX; tileX <= maxTileX; tileX++) {
      // Columns wrap around the world; rows stop at the poles.
      const wrappedX = ((tileX % tileCount) + tileCount) % tileCount;
      for (let tileY = minTileY; tileY <= maxTileY; tileY++) {
        tiles.push({
          key: `${zoom}/${tileX}/${tileY}`,
          url: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${tileY}.png`,
          x: tileX * TILE_SIZE - left,
          y: tileY * TILE_SIZE - top,
        });
      }
    }
  }

  return (
    <div
      className={`relative overflow-hidden rounded-sm border border-gray-200 bg-gray-100 ${className}`}
    >
      <div
        ref={containerRef}
        role="application"
        tabIndex={0}
        aria-label="Project location map. Drag or tap to move the pin, arrow keys to nudge it."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onKeyDown={handleKeyDown}
        className={`h-full w-full touch-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {tiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.url}
            alt=""
            aria-hidden="true"
            draggable={false}
            width={TILE_SIZE}
            height={TILE_SIZE}
            className="pointer-events-none absolute max-w-none"
            style={{ left: tile.x, top: tile.y }}
          />
        ))}
      </div>

      {/* Centre pin — hollow until coordinates are actually set */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
        <svg
          className={`h-9 w-9 drop-shadow-md transition-transform ${
            isDragging ? "-translate-y-1.5" : ""
          } ${hasPin ? "text-blue-600" : "text-gray-400"}`}
          viewBox="0 0 24 24"
          fill={hasPin ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={hasPin ? 0 : 2}
        >
          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z" />
          <circle cx="12" cy="9" r="2.5" className="fill-white" />
        </svg>
      </div>
      {/* The exact spot the pin's point rests on */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/40" />

      {/* Zoom */}
      <div className="absolute left-3 top-3 flex flex-col overflow-hidden rounded-sm border border-gray-200 bg-white shadow-md">
        <button
          type="button"
          onClick={() => changeZoom(1)}
          disabled={zoom >= MAX_ZOOM}
          aria-label="Zoom in"
          className="flex h-8 w-8 items-center justify-center text-lg font-bold leading-none text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => changeZoom(-1)}
          disabled={zoom <= MIN_ZOOM}
          aria-label="Zoom out"
          className="flex h-8 w-8 items-center justify-center border-t border-gray-200 text-lg font-bold leading-none text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>
      </div>

      {/* Required by the OSM tile usage policy */}
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-0 left-0 bg-white/85 px-1.5 py-0.5 text-[9px] text-gray-500 hover:text-blue-600"
      >
        © OpenStreetMap contributors
      </a>
    </div>
  );
}
