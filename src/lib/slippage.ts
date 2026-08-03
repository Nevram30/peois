// Slippage = actual physical accomplishment − target accomplishment, in
// percentage points. A negative value means the project is behind schedule,
// and each band carries a prescribed administrative action.
//
// The published bands are 0%+, −1 to −4.99, −5 to −9.99, −10 to −14.99 and
// −15 to −20. They are matched here as open ranges so that the gaps between
// them (e.g. −0.5) and anything past −20 still resolve to a stage.

export const SLIPPAGE_STAGE_VALUES = [
  "ON_TRACK",
  "EARLY_WARNING",
  "WARNING",
  "CRITICAL",
  "TERMINAL",
] as const;

export type SlippageStage = (typeof SLIPPAGE_STAGE_VALUES)[number];

export type SlippageStageConfig = {
  /** Short badge label, e.g. the pill shown beside the percentage. */
  label: string;
  /** Range as published in the guidelines, for the legend. */
  range: string;
  /** Prescribed action for the stage. */
  action: string;
  /** Tailwind classes for the stage badge. */
  badge: string;
  /** Tailwind classes for the stage's summary tile. */
  tile: string;
  /** Text colour for the percentage readout. */
  text: string;
  /** Background colour for the legend dot. */
  dot: string;
};

export const SLIPPAGE_STAGE_CONFIG: Record<SlippageStage, SlippageStageConfig> = {
  ON_TRACK: {
    label: "On Track",
    range: "0%+",
    action: "Project on track",
    badge: "bg-emerald-500 text-white",
    tile: "border-emerald-200 bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  EARLY_WARNING: {
    label: "Early Warning",
    range: "-1% to -4.99%",
    action: "Informal notice; internal schedule adjustment",
    badge: "bg-blue-500 text-white",
    tile: "border-blue-200 bg-blue-50",
    text: "text-blue-600",
    dot: "bg-blue-500",
  },
  WARNING: {
    label: "Warning",
    range: "-5% to -9.99%",
    action: "Formal warning letter; mandatory catch-up program",
    badge: "bg-amber-500 text-white",
    tile: "border-amber-200 bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  CRITICAL: {
    label: "Critical",
    range: "-10% to -14.99%",
    action: "Final warning; strict liquidation plans",
    badge: "bg-orange-500 text-white",
    tile: "border-orange-200 bg-orange-50",
    text: "text-orange-600",
    dot: "bg-orange-500",
  },
  TERMINAL: {
    label: "Terminal",
    range: "-15% to -20%",
    action: "Contract termination or takeover procedures",
    badge: "bg-red-500 text-white",
    tile: "border-red-200 bg-red-50",
    text: "text-red-600",
    dot: "bg-red-500",
  },
};

/** Percentage-point difference between actual and target accomplishment. */
export const computeSlippage = (target: number, actual: number) =>
  actual - target;

export const getSlippageStage = (slippage: number): SlippageStage => {
  if (slippage > -1) return "ON_TRACK";
  if (slippage > -5) return "EARLY_WARNING";
  if (slippage > -10) return "WARNING";
  if (slippage > -15) return "CRITICAL";
  return "TERMINAL";
};

export const getSlippageStageConfig = (slippage: number) =>
  SLIPPAGE_STAGE_CONFIG[getSlippageStage(slippage)];

/** Signed, two-decimal readout, e.g. "-5.00" or "+2.50". */
export const formatSlippage = (slippage: number) =>
  `${slippage > 0 ? "+" : ""}${slippage.toFixed(2)}`;
