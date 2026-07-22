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
