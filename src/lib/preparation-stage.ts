// Preparation steps of a project. They used to be a separate stage
// (Project.preparationStage); they are now project statuses (ProjectStatus
// FOR_SURVEY / FOR_PLANS / FOR_POW / FOR_PLANS_AND_POW), picked by hand from
// Current Status. The stage column is kept in the database so its data is not
// lost, but it is no longer shown or updated. String literals (not the Prisma
// enum) so this module stays client-safe.
export const PREPARATION_STATUS_VALUES = [
  "FOR_SURVEY",
  "FOR_PLANS",
  "FOR_POW",
  "FOR_PLANS_AND_POW",
] as const;

export type PreparationStatusValue = (typeof PREPARATION_STATUS_VALUES)[number];

export const PREPARATION_STAGE_LABEL: Record<PreparationStatusValue, string> = {
  FOR_SURVEY: "For Survey",
  FOR_PLANS: "For Plans",
  FOR_POW: "For POW",
  FOR_PLANS_AND_POW: "For Plans & POW",
};

export const PREPARATION_STAGE_DESCRIPTION: Record<PreparationStatusValue, string> = {
  FOR_SURVEY: "Fieldwork, layout, and data collection",
  FOR_PLANS: "Drafting architectural/structural blueprints",
  FOR_POW: "Cost estimation, materials breakdown, and budgeting",
  FOR_PLANS_AND_POW: "Blueprints and cost estimation prepared together",
};

// Chart colours (donut slices, pipeline bar), matching the status badges.
export const PREPARATION_STAGE_COLOR: Record<PreparationStatusValue, string> = {
  // Fuchsia, not teal: teal is In Procurement's status colour.
  FOR_SURVEY: "#d946ef",
  FOR_PLANS: "#6366f1",
  FOR_POW: "#06b6d4",
  FOR_PLANS_AND_POW: "#ec4899",
};
