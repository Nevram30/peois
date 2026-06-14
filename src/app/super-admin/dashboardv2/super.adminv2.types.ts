// ── types ───────────────────────────────────────────────────────
export type ProjectStatus = 'COMPLETED' | 'FOR_IMP' | 'RE_ALIGNED' | 'ON_GOING' | 'SUSPENDED' | 'OTHERS';
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
  COMPLETED:  '#22c55e',
  FOR_IMP:    '#f59e0b',
  RE_ALIGNED: '#8b5cf6',
  ON_GOING:   '#3b82f6',
  SUSPENDED:  '#ef4444',
  OTHERS:     '#94a3b8',
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  COMPLETED:  'COMPLETED',
  FOR_IMP:    'FOR IMP.',
  RE_ALIGNED: 'RE-ALIGNED',
  ON_GOING:   'ON-GOING',
  SUSPENDED:  'SUSPENDED',
  OTHERS:     'OTHERS',
};
