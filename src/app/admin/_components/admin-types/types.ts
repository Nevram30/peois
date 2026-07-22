// ── Annual Allocation & Source Breakdown ───────────────────────

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
