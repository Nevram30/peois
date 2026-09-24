// Preparation stages a project moves through, tracked separately from its
// status (On-going, Suspended, ...). String literals (not the Prisma enum) so
// this module stays client-safe.
export const PREPARATION_STAGE_VALUES = ["FOR_SURVEY", "FOR_PLANS", "FOR_POW"] as const;

export type PreparationStageValue = (typeof PREPARATION_STAGE_VALUES)[number];

export const PREPARATION_STAGE_LABEL: Record<PreparationStageValue, string> = {
  FOR_SURVEY: "For Survey",
  FOR_PLANS: "For Plans",
  FOR_POW: "For POW",
};

export const PREPARATION_STAGE_DESCRIPTION: Record<PreparationStageValue, string> = {
  FOR_SURVEY: "Fieldwork, layout, and data collection",
  FOR_PLANS: "Drafting architectural/structural blueprints",
  FOR_POW: "Cost estimation, materials breakdown, and budgeting",
};

export const PREPARATION_STAGE_BADGE: Record<PreparationStageValue, string> = {
  FOR_SURVEY: "bg-teal-50 text-teal-700 border-teal-200",
  FOR_PLANS: "bg-indigo-50 text-indigo-700 border-indigo-200",
  FOR_POW: "bg-cyan-50 text-cyan-700 border-cyan-200",
};

// Chart colours (donut slices, pipeline bar), matching the badge palette above.
export const PREPARATION_STAGE_COLOR: Record<PreparationStageValue, string> = {
  FOR_SURVEY: "#14b8a6",
  FOR_PLANS: "#6366f1",
  FOR_POW: "#06b6d4",
};

/**
 * The stage a project should move to when it reaches `target`'s milestone, or
 * null when it should stay put. Stages only move forward, so a file uploaded
 * after a disbursement leaves the project at For POW. Projects with no stage yet
 * (created before stages existed) move straight to the target.
 */
export const advancePreparationStage = (
  current: string | null,
  target: PreparationStageValue,
): PreparationStageValue | null => {
  const rank = (stage: string | null) =>
    stage ? (PREPARATION_STAGE_VALUES as readonly string[]).indexOf(stage) : -1;
  return rank(current) < rank(target) ? target : null;
};

/** Display name for a stored stage, or null when the project has none. */
export const preparationStageLabel = (stage: string | null | undefined): string | null =>
  stage ? (PREPARATION_STAGE_LABEL[stage as PreparationStageValue] ?? stage) : null;
