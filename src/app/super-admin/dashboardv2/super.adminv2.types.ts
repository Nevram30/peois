// ── types ───────────────────────────────────────────────────────
// Keys MUST match the Prisma `ProjectStatus` enum, because `getDistrictData`
// returns counts keyed by the raw enum value (e.g. FOR_IMPLEMENTATION).
export type ProjectStatus =
  | 'COMPLETED'
  | 'FOR_IMPLEMENTATION'
  | 'RE_ALIGNMENT'
  | 'ON_GOING'
  | 'NOT_YET_STARTED'
  | 'SUSPENDED'
  | 'OTHERS';
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
  RE_ALIGNMENT: '#8b5cf6',
  ON_GOING: '#3b82f6',
  NOT_YET_STARTED: '#0ea5e9',
  SUSPENDED: '#ef4444',
  OTHERS: '#94a3b8',
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  COMPLETED: 'COMPLETED',
  FOR_IMPLEMENTATION: 'FOR IMPLEMENTATION',
  RE_ALIGNMENT: 'RE-ALIGNED',
  ON_GOING: 'ON-GOING',
  NOT_YET_STARTED: 'NOT STARTED',
  SUSPENDED: 'SUSPENDED',
  OTHERS: 'OTHERS',
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