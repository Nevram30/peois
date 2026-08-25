// ─── Project photo gallery ────────────────────────────────────────────────
// A project carries up to four photos in `Project.imageUrls`. `Project.imageUrl`
// predates the gallery and is kept in sync with slot 1, so the readers that
// still expect a single cover photo keep working.

export const PROJECT_IMAGE_SLOTS = 4;

export type ProjectImageSlots = (string | null)[];

type GallerySource = {
  imageUrl?: string | null;
  imageUrls?: string[] | null;
};

/**
 * Pads a project's stored gallery to exactly {@link PROJECT_IMAGE_SLOTS} slots.
 * Rows written before the gallery existed only have `imageUrl`; that becomes
 * slot 1 and the rest come back null so every surface can render a fixed grid
 * with placeholders in the empty slots.
 */
export const toImageSlots = (project: GallerySource): ProjectImageSlots => {
  const stored = (project.imageUrls ?? []).filter((url) => !!url?.trim());
  const urls =
    stored.length > 0
      ? stored
      : project.imageUrl?.trim()
        ? [project.imageUrl]
        : [];

  const slots: ProjectImageSlots = urls.slice(0, PROJECT_IMAGE_SLOTS);
  while (slots.length < PROJECT_IMAGE_SLOTS) slots.push(null);
  return slots;
};

/** The slots that actually hold a photo, in order — what gets persisted. */
export const filledImages = (slots: ProjectImageSlots): string[] =>
  slots.filter((url): url is string => !!url);

export const sameImageSlots = (a: ProjectImageSlots, b: ProjectImageSlots) =>
  a.length === b.length && a.every((url, i) => (url ?? "") === (b[i] ?? ""));
