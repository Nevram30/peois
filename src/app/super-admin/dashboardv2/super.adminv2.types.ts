// ── types ───────────────────────────────────────────────────────
// Keys MUST match the Prisma `ProjectStatus` enum, because `getDistrictData`
// returns counts keyed by the raw enum value (e.g. FOR_IMPLEMENTATION).
export type ProjectStatus =
  | 'COMPLETED'
  | 'FOR_IMPLEMENTATION'
  | 'IN_PROCUREMENT'
  | 'RE_ALIGNMENT'
  | 'ON_GOING'
  | 'NOT_YET_STARTED'
  | 'SUSPENDED'
  | 'OTHERS'
  | 'FOR_SURVEY'
  | 'FOR_PLANS'
  | 'FOR_POW'
  | 'FOR_PLANS_AND_POW'
  | 'FOR_DETERMINATION';
export type StatusCounts = Partial<Record<ProjectStatus, number>>;

export type DistrictData = {
  district: string;
  counts: StatusCounts;
}

export type DistrictCardItem = {
  label: string;
  value: number;
  color: string;
}

export type DistrictCardProps = {
  title: string;
  data: DistrictCardItem[];
}

// ── constants ───────────────────────────────────────────────────
export const STATUS_COLORS: Record<ProjectStatus, string> = {
  COMPLETED: '#22c55e',
  FOR_IMPLEMENTATION: '#f59e0b',
  IN_PROCUREMENT: '#14b8a6',
  RE_ALIGNMENT: '#8b5cf6',
  ON_GOING: '#3b82f6',
  NOT_YET_STARTED: '#0ea5e9',
  SUSPENDED: '#ef4444',
  OTHERS: '#94a3b8',
  FOR_SURVEY: '#d946ef',
  FOR_PLANS: '#6366f1',
  FOR_POW: '#06b6d4',
  FOR_PLANS_AND_POW: '#ec4899',
  FOR_DETERMINATION: '#84cc16',
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  COMPLETED: 'COMPLETED',
  FOR_IMPLEMENTATION: 'FOR IMPLEMENTATION',
  IN_PROCUREMENT: 'IN PROCUREMENT',
  RE_ALIGNMENT: 'RE-ALIGNED',
  ON_GOING: 'ON-GOING',
  NOT_YET_STARTED: 'NOT STARTED',
  SUSPENDED: 'SUSPENDED',
  OTHERS: 'OTHERS',
  FOR_SURVEY: 'FOR SURVEY',
  FOR_PLANS: 'FOR PLANS',
  FOR_POW: 'FOR POW',
  FOR_PLANS_AND_POW: 'FOR PLANS & POW',
  FOR_DETERMINATION: 'FOR DETERMINATION',
};

export type BySubTypeMap = Record<string, { amount: number; sourceOfFund: string }>;

export type AnnualAllocationCardProps = {
  bySource: Record<string, number>;
  bySubType: BySubTypeMap;
  variationBySource: Record<string, number>;
  variationProjectsBySource: Record<string, Record<string, number>>;
  total: number;
  budgetYear: string;
};

export type SourceBreakdownCardProps = {
  title: string;
  footerLabel: string;
  bySource: Record<string, number>;
  bySubType: BySubTypeMap;
  variationProjectsBySource?: Record<string, Record<string, number>>;
  total: number;
};