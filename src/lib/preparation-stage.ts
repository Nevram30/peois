// Preparation steps of a project. They used to be a separate stage
// (Project.preparationStage); they are now project statuses (ProjectStatus
// FOR_SURVEY / FOR_PLANS / FOR_POW), picked by hand from Current Status. The
// stage column is kept in the database so its data is not lost, but it is no
// longer shown or updated. String literals (not the Prisma enum) so this
// module stays client-safe.
export const PREPARATION_STAGE_VALUES = [
  "FOR_SURVEY",
  "FOR_PLANS",
  "FOR_POW",
  "NOT_APPLICABLE",
] as const;

export type PreparationStageValue = (typeof PREPARATION_STAGE_VALUES)[number];

// The preparation statuses. The stage maps below share these keys, so they
// also serve as these statuses' labels, descriptions and colours.
export const PREPARATION_STATUS_VALUES = ["FOR_SURVEY", "FOR_PLANS", "FOR_POW"] as const;

export type PreparationStatusValue = (typeof PREPARATION_STATUS_VALUES)[number];

export const PREPARATION_STAGE_LABEL: Record<PreparationStageValue, string> = {
  FOR_SURVEY: "For Survey",
  FOR_PLANS: "For Plans",
  FOR_POW: "For POW",
  NOT_APPLICABLE: "N/A",
};

export const PREPARATION_STAGE_DESCRIPTION: Record<PreparationStageValue, string> = {
  FOR_SURVEY: "Fieldwork, layout, and data collection",
  FOR_PLANS: "Drafting architectural/structural blueprints",
  FOR_POW: "Cost estimation, materials breakdown, and budgeting",
  NOT_APPLICABLE: "No preparation work applies to this project",
};

// Chart colours (donut slices, pipeline bar), matching the status badges.
export const PREPARATION_STAGE_COLOR: Record<PreparationStageValue, string> = {
  // Fuchsia, not teal: teal is In Procurement's status colour.
  FOR_SURVEY: "#d946ef",
  FOR_PLANS: "#6366f1",
  FOR_POW: "#06b6d4",
  NOT_APPLICABLE: "#94a3b8",
};
