"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { uploadFiles } from "~/lib/uploadthing";
import { MAX_IMAGE_BYTES, formatBytes } from "~/lib/project-documents";
import { PROJECT_IMAGE_SLOTS, type ProjectImageSlots } from "~/lib/project-images";

// Editable 4-slot photo grid shared by the add and edit project forms. Each
// slot uploads on its own through `uploadFiles` rather than the `useUploadThing`
// hook, so one slot's spinner and error never bleed into the other three.

const ACCEPT = "image/jpeg,image/png";

const PlaceholderIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z"
    />
  </svg>
);

interface SlotProps {
  url: string | null;
  index: number;
  compact: boolean;
  disabled: boolean;
  badge?: ReactNode;
  onChange: (index: number, url: string | null) => void;
  onBusyChange: (index: number, busy: boolean) => void;
}

const UploadSlot = ({
  url,
  index,
  compact,
  disabled,
  badge,
  onChange,
  onBusyChange,
}: SlotProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Shown while the upload is in flight, so the tile fills in immediately.
  const [preview, setPreview] = useState<string | null>(null);

  // Object URLs are revoked once the real URL takes over, or on unmount.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only JPG or PNG images are accepted.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError(`Image is ${formatBytes(file.size)} — the limit is ${formatBytes(MAX_IMAGE_BYTES)}.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setError(null);
    setIsUploading(true);
    onBusyChange(index, true);
    try {
      const result = await uploadFiles("imageUploader", { files: [file] });
      const uploaded = result[0];
      const uploadedUrl = uploaded?.ufsUrl ?? uploaded?.url;
      if (!uploadedUrl) {
        setError("Upload failed. Please try again.");
        return;
      }
      onChange(index, uploadedUrl);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      onBusyChange(index, false);
      setPreview(null);
    }
  };

  const src = preview ?? url;
  const iconSize = compact ? "h-6 w-6" : "h-8 w-8";

  return (
    <div>
      <div
        onClick={() => {
          if (!disabled && !isUploading) inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (disabled || isUploading) return;
          const file = e.dataTransfer.files[0];
          if (file) void handleFile(file);
        }}
        className={`group relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-sm border-2 border-dashed transition ${
          isDragging
            ? "border-blue-500 bg-blue-50/70"
            : error
              ? "border-red-300 bg-red-50/40"
              : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        {src ? (
          // Local object URLs and remote uploads share one tag; next/image
          // cannot take a blob: source.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={`Project photo ${index + 1}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            <PlaceholderIcon className={`${iconSize} text-gray-300`} />
            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
              {compact ? `Photo ${index + 1}` : "No Image Uploaded"}
            </p>
            {!compact && (
              <span className="rounded-md bg-white px-3 py-1 text-[10px] font-bold tracking-wider text-gray-600 uppercase shadow-sm ring-1 ring-gray-200 group-hover:ring-blue-300">
                ⬆ Upload Photo
              </span>
            )}
          </>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          </div>
        )}

        {url && !isUploading && !disabled && (
          <button
            type="button"
            aria-label={`Remove photo ${index + 1}`}
            onClick={(e) => {
              e.stopPropagation();
              setError(null);
              onChange(index, null);
            }}
            className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900/70 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100 hover:bg-gray-900"
          >
            ✕
          </button>
        )}

        {badge}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            // Allow re-picking the same file after a removal or a failure.
            e.target.value = "";
            if (file) void handleFile(file);
          }}
        />
      </div>
      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
    </div>
  );
};

interface Props {
  slots: ProjectImageSlots;
  onChange: (index: number, url: string | null) => void;
  /** Fires whenever any slot starts or stops uploading, so forms can block submit. */
  onUploadingChange?: (busy: boolean) => void;
  /** Rendered over slot 1 — the forms overlay their own tracking-number chip. */
  badge?: ReactNode;
  disabled?: boolean;
}

export const ProjectImageUploader = ({
  slots,
  onChange,
  onUploadingChange,
  badge,
  disabled = false,
}: Props) => {
  // Which slots are mid-upload. A ref, not state: nothing here re-renders on
  // it, the parent is told via onUploadingChange.
  const busySlots = useRef(new Set<number>());

  const handleBusyChange = (index: number, busy: boolean) => {
    if (busy) busySlots.current.add(index);
    else busySlots.current.delete(index);
    onUploadingChange?.(busySlots.current.size > 0);
  };

  const padded: ProjectImageSlots = Array.from(
    { length: PROJECT_IMAGE_SLOTS },
    (_, i) => slots[i] ?? null,
  );

  return (
    <div className="space-y-2">
      <UploadSlot
        url={padded[0] ?? null}
        index={0}
        compact={false}
        disabled={disabled}
        badge={badge}
        onChange={onChange}
        onBusyChange={handleBusyChange}
      />
      <div className="grid grid-cols-3 gap-2">
        {padded.slice(1).map((url, i) => (
          <UploadSlot
            key={i + 1}
            url={url}
            index={i + 1}
            compact
            disabled={disabled}
            onChange={onChange}
            onBusyChange={handleBusyChange}
          />
        ))}
      </div>
    </div>
  );
};
