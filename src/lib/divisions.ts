// Divisions a user can belong to. The engineering-district divisions restrict
// the user to that district's projects; the office divisions see everything.
export const DIVISIONS: readonly string[] = [
  "SMAD",
  "PDPM",
  "EPM",
  "QACD",
  "1ST ENGR DIST",
  "2ND ENGR DIST",
];

// String literals (not the Prisma enum) so this module stays client-safe.
export type DistrictValue = "DISTRICT_I" | "DISTRICT_II";

const DIVISION_TO_DISTRICT: Record<string, DistrictValue> = {
  "1ST ENGR DIST": "DISTRICT_I",
  "2ND ENGR DIST": "DISTRICT_II",
};

/**
 * Maps a user's division to the district their project access is limited to.
 * Returns null for unrestricted divisions (SMAD/PDPM/EPM/QACD), missing
 * divisions, and unrecognized values. Matching is tolerant (trim, uppercase,
 * collapsed whitespace) because legacy division values were free-text.
 */
export const divisionToDistrict = (
  division: string | null | undefined,
): DistrictValue | null => {
  if (!division) return null;
  const normalized = division.trim().toUpperCase().replace(/\s+/g, " ");
  return DIVISION_TO_DISTRICT[normalized] ?? null;
}

/**
 * Whether someone in `division` is reachable by a caller limited to `scope`.
 *
 * An unscoped caller (office division or super admin) reaches everyone. For a
 * district-scoped caller, their own district is reachable — and so is anyone
 * `divisionToDistrict` maps to null: the office divisions (SMAD/PDPM/EPM/QACD)
 * work across both districts, and the same is true of records with a missing or
 * unrecognized division, which are better left reachable than orphaned.
 */
export const isReachableFromDistrict = (
  division: string | null | undefined,
  scope: DistrictValue | null,
): boolean => {
  if (!scope) return true;
  const district = divisionToDistrict(division);
  return district === null || district === scope;
}

// Reader-facing names for the stored codes. Only the district divisions need
// spelling out; the office divisions are known by their acronym.
const DIVISION_LABEL: Record<string, string> = {
  "1ST ENGR DIST": "1st Engineering District",
  "2ND ENGR DIST": "2nd Engineering District",
};

export const UNASSIGNED_DIVISION_LABEL = "No Division";

/**
 * Display name for a division. Normalizes the same tolerant way as
 * `divisionToDistrict` and falls back to the stored string, so legacy
 * free-text values still read as themselves rather than disappearing.
 */
export const divisionLabel = (division: string | null | undefined): string => {
  if (!division?.trim()) return UNASSIGNED_DIVISION_LABEL;
  const normalized = division.trim().toUpperCase().replace(/\s+/g, " ");
  return DIVISION_LABEL[normalized] ?? division.trim();
}

/**
 * Buckets people by division for grouped `<optgroup>` rendering. Groups follow
 * the canonical `DIVISIONS` order, then any legacy free-text divisions
 * alphabetically, with the division-less bucket last.
 */
export const groupByDivision = <T extends { division: string | null }>(
  people: readonly T[],
): { label: string; people: T[] }[] => {
  const buckets = new Map<string, T[]>();
  for (const person of people) {
    const label = divisionLabel(person.division);
    const bucket = buckets.get(label);
    if (bucket) bucket.push(person);
    else buckets.set(label, [person]);
  }

  const canonical = DIVISIONS.map(divisionLabel);
  const rank = (label: string) => {
    if (label === UNASSIGNED_DIVISION_LABEL) return Number.MAX_SAFE_INTEGER;
    const index = canonical.indexOf(label);
    return index === -1 ? canonical.length : index;
  };

  return [...buckets.entries()]
    .map(([label, groupPeople]) => ({ label, people: groupPeople }))
    .sort((a, b) => rank(a.label) - rank(b.label) || a.label.localeCompare(b.label));
}
