// ── Annual Allocation & Source Breakdown ───────────────────────
export const SOURCE_COLORS: Record<string, string> = {
    TWENTY_PERCENT_DEV_FUND: "#1e3a8a",
    // Without an entry here a source falls back to #94a3b8 — which is PPOC's
    // own colour, so the two would be indistinguishable in the donut.
    FIVE_PERCENT_CALAMITY_FUND: "#b45309",
    FIVE_PERCENT_CONFIDENTIAL_FUND: "#dc2626",
    CONFIDENTIAL: "#dc2626",
    GENERAL_FUND: "#2563eb",
    LDRRM: "#059669",
    MOOE: "#9333ea",
    MIADP: "#64748b",
    NCDC: "#cbd5e1",
    PPOC: "#94a3b8",
    PRDP: "#475569",
    SEF: "#f97316",
    TRUST_FUND: "#292524",
    AID: "#0891b2",
    LOAN: "#7c3aed",
    LBP_LOAN: "#15803d",
    OTHERS: "#a8a29e",
};

export const SOURCE_SHORT_LABEL: Record<string, string> = {
    TWENTY_PERCENT_DEV_FUND: "20% DEVELOPMENT FUND",
    FIVE_PERCENT_CALAMITY_FUND: "5% CALAMITY FUND",
    FIVE_PERCENT_CONFIDENTIAL_FUND: "5% CONFIDENTIAL FUND",
    CONFIDENTIAL: "5% CONFIDENTIAL FUND",
    GENERAL_FUND: "GENERAL FUND",
    LDRRM: "LDRRM",
    MOOE: "MOOE",
    MIADP: "MIADP",
    NCDC: "NCDC",
    PPOC: "PPOC",
    PRDP: "PRDP",
    SEF: "SEF",
    TRUST_FUND: "TRUST FUND",
    AID: "AID",
    LOAN: "LOAN",
    LBP_LOAN: "LBP LOAN",
    OTHERS: "OTHERS",
};

// ── Remaining Balance from Annual Allocation ───────────────────
// Compact source-of-fund legend (matches the dashboard mock): each source of
// fund shows its remaining balance with a breakdown of its sub-types beneath.
export const REM_SOURCE_LABEL: Record<string, string> = {
    TWENTY_PERCENT_DEV_FUND: "20% Dev. Fund",
    FIVE_PERCENT_CALAMITY_FUND: "5% Calamity Fund",
    FIVE_PERCENT_CONFIDENTIAL_FUND: "5% Conf. Fund",
    CONFIDENTIAL: "5% Conf. Fund",
    GENERAL_FUND: "General Fund",
    LDRRM: "LDRRM",
    MOOE: "MOOE",
    MIADP: "MIADP",
    NCDC: "NCDC",
    PPOC: "PPOC",
    PRDP: "PRDP",
    SEF: "SEF",
    TRUST_FUND: "Trust Fund",
    AID: "Aid",
    LOAN: "Loan",
    LBP_LOAN: "LBP Loan",
    OTHERS: "Others",
};

// ── Project table helpers ──────────────────────────────────────
export const DISTRICT_LABELS: Record<string, string> = {
    DISTRICT_I: "1st District",
    DISTRICT_II: "2nd District",
};

export const MODE_LABELS: Record<string, string> = {
    BY_ADMINISTRATION: "By Administration",
    BY_CONTRACT: "By Contract",
    UNASSIGNED_FOR_DETERMINATION: "Unassigned - For Determination",
};

export const STATUS_CONFIG: Record<
    string,
    { label: string; dot: string; text: string; badge: string }
> = {
    ON_GOING: {
        label: "On-going",
        dot: "bg-orange-500",
        text: "text-orange-700",
        badge: "bg-orange-50 text-orange-700",
    },
    NOT_YET_STARTED: {
        label: "Not Yet Started",
        dot: "bg-sky-500",
        text: "text-sky-600",
        badge: "bg-sky-50 text-sky-600",
    },
    COMPLETED: {
        label: "Completed",
        dot: "bg-green-500",
        text: "text-green-700",
        badge: "bg-green-50 text-green-700",
    },
    SUSPENDED: {
        label: "Suspended",
        dot: "bg-red-500",
        text: "text-red-600",
        badge: "bg-red-50 text-red-600",
    },
    FOR_IMPLEMENTATION: {
        label: "For Implementation",
        dot: "bg-amber-500",
        text: "text-amber-700",
        badge: "bg-amber-50 text-amber-700",
    },
    IN_PROCUREMENT: {
        label: "In Procurement",
        dot: "bg-teal-500",
        text: "text-teal-700",
        badge: "bg-teal-50 text-teal-700",
    },
    FOR_SURVEY: {
        label: "For Survey",
        dot: "bg-fuchsia-500",
        text: "text-fuchsia-700",
        badge: "bg-fuchsia-50 text-fuchsia-700",
    },
    FOR_PLANS: {
        label: "For Plans",
        dot: "bg-indigo-500",
        text: "text-indigo-700",
        badge: "bg-indigo-50 text-indigo-700",
    },
    FOR_POW: {
        label: "For POW",
        dot: "bg-cyan-500",
        text: "text-cyan-700",
        badge: "bg-cyan-50 text-cyan-700",
    },
    FOR_PLANS_AND_POW: {
        label: "For Plans & POW",
        dot: "bg-pink-500",
        text: "text-pink-700",
        badge: "bg-pink-50 text-pink-700",
    },
    FOR_DETERMINATION: {
        label: "For Determination",
        dot: "bg-lime-500",
        text: "text-lime-700",
        badge: "bg-lime-50 text-lime-700",
    },
    RE_ALIGNMENT: {
        label: "Re-alignment",
        dot: "bg-purple-500",
        text: "text-purple-700",
        badge: "bg-purple-50 text-purple-700",
    },
    OTHERS: {
        label: "Others",
        dot: "bg-slate-500",
        text: "text-slate-700",
        badge: "bg-slate-50 text-slate-700",
    },
};