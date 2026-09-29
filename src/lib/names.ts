/** Normalises a person's name so free-text engineers match user accounts. */
export const normalizeName = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/**
 * Whether `name` is listed under a project's "Engineers In-Charge", which is
 * stored as free text separated by commas.
 */
export const isEngineerInCharge = (
  projectEngineer: string | null | undefined,
  name: string | null | undefined,
): boolean => {
  const target = normalizeName(name ?? "");
  if (!target) return false;
  return (projectEngineer ?? "")
    .split(",")
    .some((e) => normalizeName(e) === target);
};
