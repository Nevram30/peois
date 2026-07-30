import {
  FUNDING_PROGRAM_LABEL,
  PROGRAM_TO_PROJECTS,
  PROJECT_SUB_TYPE_LABEL,
  SOURCE_TO_PROGRAMS,
  type FundingProgramValue,
  type ProjectSubTypeValue,
  type SourceOfFundValue,
} from "~/lib/fund-constants";

// The Funding Information dropdowns are the built-in lists in fund-constants
// plus whatever a super admin added from the Manual Entry card. Custom entries
// are stored — and selected — by their own name, so a value coming back from the
// database is either a built-in key or the custom name verbatim.

export type CustomFundingOptions = {
  programs: { id: string; name: string; sourceOfFund: string }[];
  projects: { id: string; name: string; program: string }[];
  landbankNumbers: { id: string; number: string }[];
};

export type SelectOption = {
  value: string;
  label: string;
  /** True for super-admin additions, so the UI can mark them. */
  custom: boolean;
};

const EMPTY: CustomFundingOptions = { programs: [], projects: [], landbankNumbers: [] };

/** Programs for a Source of Fund: built-in first, then the custom additions. */
export function programOptions(
  sourceOfFund: SourceOfFundValue | "",
  custom: CustomFundingOptions | undefined,
): SelectOption[] {
  if (!sourceOfFund) return [];
  const builtIn = (SOURCE_TO_PROGRAMS[sourceOfFund] ?? []).map((k) => ({
    value: k,
    label: FUNDING_PROGRAM_LABEL[k],
    custom: false,
  }));
  const added = (custom ?? EMPTY).programs
    .filter((p) => p.sourceOfFund === sourceOfFund)
    .map((p) => ({ value: p.name, label: p.name, custom: true }));
  return [...builtIn, ...added];
}

/**
 * Projects for a Program. `program` is a built-in key or a custom program name;
 * either way custom projects are matched on that same string.
 */
export function projectOptions(
  program: string,
  custom: CustomFundingOptions | undefined,
): SelectOption[] {
  if (!program) return [];
  const builtIn = (PROGRAM_TO_PROJECTS[program as FundingProgramValue] ?? []).map((k) => ({
    value: k,
    label: PROJECT_SUB_TYPE_LABEL[k],
    custom: false,
  }));
  const added = (custom ?? EMPTY).projects
    .filter((p) => p.program === program)
    .map((p) => ({ value: p.name, label: p.name, custom: true }));
  return [...builtIn, ...added];
}

/** Every LBP-Term loan number a super admin has registered. */
export function landbankOptions(custom: CustomFundingOptions | undefined): string[] {
  return (custom ?? EMPTY).landbankNumbers.map((l) => l.number);
}

/** All programs across every source — for the Manual Entry "Add Project" picker. */
export function allProgramOptions(custom: CustomFundingOptions | undefined): SelectOption[] {
  const builtIn = (Object.keys(FUNDING_PROGRAM_LABEL) as FundingProgramValue[]).map((k) => ({
    value: k,
    label: FUNDING_PROGRAM_LABEL[k],
    custom: false,
  }));
  const added = (custom ?? EMPTY).programs.map((p) => ({
    value: p.name,
    label: p.name,
    custom: true,
  }));
  return [...builtIn, ...added];
}

/** Built-in keys render as their label; custom values render as themselves. */
export function programLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return FUNDING_PROGRAM_LABEL[value as FundingProgramValue] ?? value;
}

export function projectLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return PROJECT_SUB_TYPE_LABEL[value as ProjectSubTypeValue] ?? value;
}

/**
 * A saved value may no longer be offered by the cascade — a custom entry that
 * was deleted, or a legacy pairing. Append it so the select still shows it
 * instead of silently resetting to the placeholder.
 */
export function withSelected(
  options: SelectOption[],
  selected: string,
  label: (v: string) => string,
): SelectOption[] {
  if (!selected || options.some((o) => o.value === selected)) return options;
  return [...options, { value: selected, label: label(selected), custom: true }];
}
