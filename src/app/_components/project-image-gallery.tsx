"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { PROJECT_IMAGE_SLOTS, type ProjectImageSlots } from "~/lib/project-images";

// Read-only 4-slot photo grid for the project view pages. Slot 1 keeps the
// full-width banner the pages had before the gallery; slots 2-4 sit beneath it.
// Empty slots render the "No Image Uploaded" placeholder, which is also where a
// slot lands if the URL fails to load — older records were saved through an
// uploader that accepted PDFs, and those cannot be told apart from photos by
// their URL alone (UploadThing keys carry no extension).

const PlaceholderIcon = ({ className }: { className?: string }) => (
  <svg
    className={className ?? "h-8 w-8"}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"
    />
  </svg>
);

interface TileProps {
  url: string | null;
  alt: string;
  index: number;
  compact: boolean;
  badge?: ReactNode;
  /** On large screens, drop the 16:9 ratio and fill the grid cell instead. */
  fill?: boolean;
}

const GalleryTile = ({ url, alt, index, compact, badge, fill = false }: TileProps) => {
  const [failed, setFailed] = useState(false);
  const showImage = !!url && !failed;

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-sm border border-gray-200 bg-gray-50 ${fill ? "lg:aspect-auto lg:h-full lg:min-h-28" : ""}`}
    >
      {showImage ? (
        <Image
          src={url}
          alt={`${alt} — photo ${index + 1}`}
          fill
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-300">
          <PlaceholderIcon className={compact ? "h-6 w-6" : "h-8 w-8"} />
          {!compact && (
            <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
              No Image Uploaded
            </p>
          )}
        </div>
      )}
      {badge}
    </div>
  );
};

interface Props {
  slots: ProjectImageSlots;
  alt: string;
  /** Rendered over slot 1 — the pages each overlay their own #projectCode chip. */
  badge?: ReactNode;
  /** Lay slots 2-4 out in two columns, for narrow side-by-side layouts. */
  twoUp?: boolean;
  /** All four slots as equal tiles in a 2×2 grid, no banner — for a photo column.
   *  On large screens the tiles stretch to fill the grid's height. */
  grid?: boolean;
  className?: string;
}

export const ProjectImageGallery = ({
  slots,
  alt,
  badge,
  twoUp = false,
  grid = false,
  className = "",
}: Props) => {
  const padded: ProjectImageSlots = Array.from(
    { length: PROJECT_IMAGE_SLOTS },
    (_, i) => slots[i] ?? null,
  );
  const [cover, ...rest] = padded;

  if (grid) {
    return (
      <div className={`grid grid-cols-2 gap-2 lg:grid-rows-2 ${className}`}>
        {padded.map((url, i) => (
          <GalleryTile
            key={i}
            url={url}
            alt={alt}
            index={i}
            compact
            fill
            badge={i === 0 ? badge : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <GalleryTile
        url={cover ?? null}
        alt={alt}
        index={0}
        compact={twoUp}
        badge={badge}
      />
      <div className={`grid gap-2 ${twoUp ? "grid-cols-2" : "grid-cols-3"}`}>
        {rest.map((url, i) => (
          <GalleryTile
            key={i}
            url={url}
            alt={alt}
            index={i + 1}
            compact
          />
        ))}
      </div>
    </div>
  );
};
