"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import type { DistrictCardProps, Segment, StatCard, UserCard, UserIconProps, DonutChartProps } from "~/app/super-admin/dashboardv2/super.admin.types";
import type { DistrictCardItem, ProjectStatus, StatusCounts } from "~/app/super-admin/dashboardv2/super.adminv2.types";
import { STATUS_COLORS, STATUS_LABELS } from "~/app/super-admin/dashboardv2/super.adminv2.types";
import { formatPeso } from "~/helper/formatter";
import { formatToPHPBillions, formatToPHPMillions } from "~/helper/formatter";
import {
    SOURCE_OF_FUND_ORDER,
    PROJECT_SUB_TYPE_LABEL,
    type ProjectSubTypeValue,
} from "~/lib/fund-constants";

// ── DonutChart ─────────────────────────────────────────────────
function DonutChart({ segments, size = 120, thickness = 28, centerLabel }: DonutChartProps) {
    const r = (size - thickness) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * r;
    const total = segments.reduce((s, g) => s + g.value, 0);
    let cumulative = 0;
    const arcs = segments.map((seg) => {
        const fraction = seg.value / total;
        const dashLen = fraction * circumference;
        const offset = circumference * (1 - cumulative);
        cumulative += fraction;
        return { ...seg, dashLen, offset };
    });
    return (
        <svg width={size} height={size} className="flex-shrink-0">
            {arcs.map((arc, i) => (
                <circle
                    key={i}
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={arc.color}
                    strokeWidth={thickness}
                    strokeDasharray={`${arc.dashLen} ${circumference - arc.dashLen}`}
                    strokeDashoffset={arc.offset}
                    style={{ transform: `rotate(-90deg)`, transformOrigin: `${cx}px ${cy}px` }}
                />
            ))}
            {centerLabel && (
                <>
                    <text x={cx} y={cy - 6} textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="Inter,sans-serif">
                        TOTAL VALUE
                    </text>
                    <text x={cx} y={cy + 9} textAnchor="middle" fontSize="13" fontWeight="800" fill="#1e293b" fontFamily="Inter,sans-serif">
                        {centerLabel}
                    </text>
                </>
            )}
        </svg>
    );
}

// ── UserIcon ───────────────────────────────────────────────────
function UserIcon({ type, color }: UserIconProps) {
    if (type === "group")
        return (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        );
    if (type === "slash")
        return (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
                <line x1="4" y1="4" x2="20" y2="20" />
            </svg>
        );
    if (type === "plus")
        return (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="16" y1="11" x2="22" y2="11" />
            </svg>
        );
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

// ── transform ───────────────────────────────────────────────────
function toCardData(counts: StatusCounts): DistrictCardItem[] {
    return (Object.keys(STATUS_LABELS) as ProjectStatus[]).map((status) => ({
        key: status,                        // ← add this
        label: STATUS_LABELS[status],
        value: counts[status] ?? 0,
        color: STATUS_COLORS[status],
    }));
}

// ── DistrictCard ─────────────────────────────────────────────────
function DistrictCard({ title, data }: DistrictCardProps) {
    const total = data.reduce((s, d) => s + d.value, 0);
    return (
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
            <div className="p-4">
                <p className="text-[11px] font-extrabold text-[#1e3a8a] tracking-widest uppercase mb-3">
                    {title}
                </p>
                <div className="flex items-center gap-4">
                    <DonutChart
                        segments={data.filter((d) => d.value > 0).map((d) => ({ value: d.value, color: d.color }))}
                        size={100}
                        thickness={22}
                    />
                    <div className="grid grid-cols-2 gap-x-3 gap-y-[3px] flex-1">
                        {data.map((d) => (
                            <div key={d.label} className="flex items-center justify-between gap-1">
                                <div className="flex items-center gap-1">
                                    <span
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ background: d.color }}
                                    />
                                    <span className="text-[10.5px] text-slate-500">{d.label}</span>
                                </div>
                                <span className="text-[10.5px] font-bold text-slate-800">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-[#1e3a8a] text-white px-4 py-[9px] flex justify-between items-center text-[11px] font-bold tracking-widest uppercase">
                <span>TOTAL PROJECTS</span>
                <span>{total}</span>
            </div>
        </div>
    );
}

// ── Annual Allocation & Source Breakdown ───────────────────────
const SOURCE_COLORS: Record<string, string> = {
    TWENTY_PERCENT_DEV_FUND: "#1e3a8a",
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
    OTHERS: "#a8a29e",
};

const SOURCE_SHORT_LABEL: Record<string, string> = {
    TWENTY_PERCENT_DEV_FUND: "20% DEVELOPMENT FUND",
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
    OTHERS: "OTHERS",
};

type BySubTypeMap = Record<string, { amount: number; sourceOfFund: string }>;

type AnnualAllocationCardProps = {
    bySource: Record<string, number>;
    bySubType: BySubTypeMap;
    total: number;
    budgetYear: string;
};

function AnnualAllocationCard({ bySource, bySubType, total, budgetYear }: AnnualAllocationCardProps) {
    // Order known sources first, then append any unmapped sources that have allocations.
    const ordered = [...SOURCE_OF_FUND_ORDER, "CONFIDENTIAL", ...Object.keys(bySource)].filter(
        (src, i, arr) => arr.indexOf(src) === i && (bySource[src] ?? 0) > 0,
    );

    const entries = ordered.map((src) => {
        const amount = bySource[src] ?? 0;
        const subTypes = Object.entries(bySubType)
            .filter(([key, v]) => v.sourceOfFund === src && !key.startsWith("__NONE__"))
            .map(([key, v]) => ({
                label: PROJECT_SUB_TYPE_LABEL[key as ProjectSubTypeValue] ?? key,
                amount: v.amount,
            }))
            .sort((a, b) => b.amount - a.amount);
        return {
            src,
            label: SOURCE_SHORT_LABEL[src] ?? src,
            color: SOURCE_COLORS[src] ?? "#94a3b8",
            amount,
            pct: total > 0 ? Math.round((amount / total) * 100) : 0,
            subTypes,
        };
    });

    const segments: Segment[] = entries.map((e) => ({ value: e.amount, color: e.color }));

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-3 border border-slate-200">
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[12px] font-extrabold text-slate-800 tracking-widest uppercase">
                        Annual Allocation &amp; Source Breakdown
                    </p>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 rounded px-2 py-0.5">
                        FY {budgetYear}
                    </span>
                </div>

                <div className="flex items-start gap-8">
                    <div className="shrink-0 pt-2">
                        <DonutChart segments={segments} size={150} thickness={34} centerLabel={formatToPHPBillions(total)} />
                    </div>

                    <div className="flex-1 columns-2 gap-12 *:break-inside-avoid">
                        {entries.map((e) => (
                            <div key={e.src} className="mb-2.5">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                                        <span className="text-[11.5px] font-extrabold text-slate-800 tracking-wide truncate">
                                            {e.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-[10px] text-slate-400">{e.pct}%</span>
                                        <span className="text-[12px] font-bold text-slate-800 tabular-nums">
                                            {formatToPHPMillions(e.amount)}
                                        </span>
                                    </div>
                                </div>

                                {e.subTypes.length > 0 && (
                                    <div className="mt-1 ml-1 border-l border-slate-200 pl-3 flex flex-col gap-0.5">
                                        {e.subTypes.map((s) => (
                                            <div key={s.label} className="flex items-center justify-between gap-2">
                                                <span className="text-[10.5px] text-slate-500 truncate">{s.label}</span>
                                                <span className="text-[10.5px] text-slate-500 tabular-nums shrink-0">
                                                    {formatToPHPMillions(s.amount)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-[#1e3a8a] text-white px-6 py-3.5 flex justify-between items-center text-[12px] font-bold tracking-widest uppercase">
                <span>Total Combined Allocation</span>
                <span className="tabular-nums">{formatPeso(total)}</span>
            </div>
        </div>
    );
}

// ── Remaining Balance from Annual Allocation ───────────────────
// Compact source-of-fund legend (matches the dashboard mock): each source of
// fund shows its remaining balance with a breakdown of its sub-types beneath.
const REM_SOURCE_LABEL: Record<string, string> = {
    TWENTY_PERCENT_DEV_FUND: "20% Dev. Fund",
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
    OTHERS: "Others",
};

type SourceBreakdownCardProps = {
    title: string;
    footerLabel: string;
    bySource: Record<string, number>;
    bySubType: BySubTypeMap;
    total: number;
};

function SourceBreakdownCard({ title, footerLabel, bySource, bySubType, total }: SourceBreakdownCardProps) {
    const ordered = [...SOURCE_OF_FUND_ORDER, "CONFIDENTIAL", ...Object.keys(bySource)].filter(
        (src, i, arr) => arr.indexOf(src) === i && (bySource[src] ?? undefined) !== undefined,
    );

    const entries = ordered.map((src) => {
        const amount = bySource[src] ?? 0;
        const subTypes = Object.entries(bySubType)
            .filter(([key, v]) => v.sourceOfFund === src && !key.startsWith("__NONE__"))
            .map(([key, v]) => ({
                label: PROJECT_SUB_TYPE_LABEL[key as ProjectSubTypeValue] ?? key,
                amount: v.amount,
            }))
            .sort((a, b) => b.amount - a.amount);
        return {
            src,
            label: REM_SOURCE_LABEL[src] ?? src,
            color: SOURCE_COLORS[src] ?? "#94a3b8",
            amount,
            subTypes,
        };
    });

    const segments: Segment[] = entries
        .filter((e) => e.amount > 0)
        .map((e) => ({ value: e.amount, color: e.color }));

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
            <div className="p-5">
                <p className="text-[12px] font-extrabold text-slate-800 tracking-widest uppercase mb-4">
                    {title}
                </p>

                <div className="flex items-start gap-5">
                    <div className="shrink-0 pt-1">
                        <DonutChart segments={segments} size={120} thickness={60} />
                    </div>

                    <div className="flex-1 columns-2 gap-6 *:break-inside-avoid">
                        {entries.map((e) => (
                            <div key={e.src} className="mb-2.5">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                                        <span className="text-[11.5px] font-extrabold text-slate-800 tracking-wide truncate">
                                            {e.label}
                                        </span>
                                    </div>
                                    <span className="text-[12px] font-bold text-slate-800 tabular-nums shrink-0">
                                        {formatToPHPMillions(e.amount)}
                                    </span>
                                </div>

                                {e.subTypes.length > 0 && (
                                    <div className="mt-1 ml-1 border-l border-slate-200 pl-3 flex flex-col gap-0.5">
                                        {e.subTypes.map((s) => (
                                            <div key={s.label} className="flex items-center justify-between gap-2">
                                                <span className="text-[10.5px] text-slate-500 truncate">{s.label}</span>
                                                <span className="text-[10.5px] text-slate-500 tabular-nums shrink-0">
                                                    {formatToPHPMillions(s.amount)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-[#1e3a8a] text-white px-6 py-3.5 flex justify-between items-center text-[12px] font-bold tracking-widest uppercase">
                <span>{footerLabel}</span>
                <span className="tabular-nums">{formatPeso(total)}</span>
            </div>
        </div>
    );
}

// ── Recent Project Updates table helpers ───────────────────────
const DISTRICT_LABELS: Record<string, string> = {
    DISTRICT_I: "1st District",
    DISTRICT_II: "2nd District",
};

const SOURCE_LABELS: Record<string, string> = {
    GENERAL_FUND: "General Fund",
    SEF: "SEF",
    TRUST_FUND: "Trust Fund",
    TWENTY_PERCENT_DEV_FUND: "20% Dev Fund",
    AID: "AID",
    LOAN: "Loan",
    OTHERS: "Others",
};

const MODE_LABELS: Record<string, string> = {
    BY_ADMINISTRATION: "By Administration",
    BY_CONTRACT: "By Contract",
};

const STATUS_CONFIG: Record<
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

// ── Skeletons ──────────────────────────────────────────────────
function StatCardsSkeleton() {
    return (
        <div className="grid grid-cols-7 gap-2 mb-3">
            {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-3 flex flex-col gap-1 border-t-[3px] border-slate-200 animate-pulse">
                    <div className="w-6 h-6 rounded-md bg-slate-200 mb-1" />
                    <div className="h-2.5 w-16 rounded bg-slate-200" />
                    <div className="h-6 w-10 rounded bg-slate-200 mt-1" />
                </div>
            ))}
        </div>
    );
}

function UserCardsSkeleton() {
    return (
        <div className="grid grid-cols-4 gap-2 mb-5">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-3 flex items-center gap-3 border-l-4 border-slate-200 animate-pulse">
                    <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                    <div className="flex flex-col gap-1.5">
                        <div className="h-2.5 w-16 rounded bg-slate-200" />
                        <div className="h-5 w-10 rounded bg-slate-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function DistrictCardsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-5">
            {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-slate-200">
                    <div className="p-4 animate-pulse">
                        <div className="h-2.5 w-40 rounded bg-slate-200 mb-3" />
                        <div className="flex items-center gap-4">
                            <div className="w-[100px] h-[100px] rounded-full bg-slate-200 shrink-0" />
                            <div className="grid grid-cols-2 gap-x-3 gap-y-2 flex-1">
                                {Array.from({ length: 6 }).map((_, j) => (
                                    <div key={j} className="h-2.5 rounded bg-slate-200" />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="h-9 bg-slate-200" />
                </div>
            ))}
        </div>
    );
}

function FinancialCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
            <div className="p-5 animate-pulse">
                <div className="h-3 w-56 rounded bg-slate-200 mb-4" />
                <div className="flex items-start gap-8">
                    <div className="w-[150px] h-[150px] rounded-full bg-slate-200 shrink-0" />
                    <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-3">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-3 rounded bg-slate-200" />
                        ))}
                    </div>
                </div>
            </div>
            <div className="h-12 bg-slate-200" />
        </div>
    );
}

// ── Main Dashboard ─────────────────────────────────────────────
export function AdminDashboardContent() {
    const router = useRouter();

    const { data: statsData, isLoading: statsLoading } = api.project.getStats.useQuery();
    const { data: userData, isLoading: userLoading } = api.user.getStats.useQuery();
    const { data: projectAllocationData, isLoading: allocationLoading } = api.project.getFinancialOverview.useQuery();
    const { data: districtData, isLoading: districtLoading } = api.project.getDistrictData.useQuery();
    const { data: remainingBalanceData, isLoading: remainingLoading } = api.project.getRemainingBalance.useQuery();

    const TotalAllocation = projectAllocationData
        ? Object.values(projectAllocationData.bySource).reduce((s, v) => s + v, 0)
        : 0;

    const statCards: StatCard[] = [
        { label: "BUDGET YEAR", value: "2024", borderColor: "border-blue-600", iconBg: "bg-blue-100", iconColor: "text-blue-600", icon: "📅" },
        { label: "COMPLETED PROJECTS", value: statsData?.completed ?? "0", borderColor: "border-green-600", iconBg: "bg-green-100", iconColor: "text-green-600", icon: "✅" },
        { label: "ON-GOING PROJECTS", value: statsData?.ongoing ?? "0", borderColor: "border-blue-500", iconBg: "bg-blue-100", iconColor: "text-blue-500", icon: "▷" },
        { label: "FOR IMPLEMENTATION", value: statsData?.forImplementation ?? "0", borderColor: "border-amber-500", iconBg: "bg-amber-100", iconColor: "text-amber-500", icon: "⚠" },
        { label: "SUSPENDED PROJECTS", value: statsData?.suspended ?? "0", borderColor: "border-red-600", iconBg: "bg-red-100", iconColor: "text-red-600", icon: "⊗" },
        { label: "RE-ALIGNED PROJECTS", value: statsData?.reAlignment ?? "0", borderColor: "border-red-500", iconBg: "bg-red-100", iconColor: "text-red-500", icon: "↔" },
        { label: "OTHERS", value: statsData?.others ?? "0", borderColor: "border-slate-400", iconBg: "bg-slate-100", iconColor: "text-slate-500", icon: "⋯" },
    ];

    const userCards: UserCard[] = [
        { label: "TOTAL USERS", value: userData?.total ?? "0", border: "border-l-blue-600", iconBg: "bg-blue-100", iconColor: "#2563eb", type: "group" },
        { label: "ACTIVE USERS", value: userData?.active ?? "0", border: "border-l-green-600", iconBg: "bg-green-100", iconColor: "#16a34a", type: "single" },
        { label: "INACTIVE USERS", value: userData?.inactive ?? "0", border: "border-l-slate-400", iconBg: "bg-slate-100", iconColor: "#64748b", type: "slash" },
        { label: "PENDING APPROVAL", value: userData?.pending ?? "0", border: "border-l-amber-500", iconBg: "bg-amber-100", iconColor: "#d97706", type: "plus" },
    ];

    // ── Recent Project Updates table state ──────────────────────
    const [search, setSearch] = useState("");
    const [fiscalYear, setFiscalYear] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const { data: projects, isLoading } = api.project.getAll.useQuery();
    const { data: budgetYears } = api.project.getBudgetYears.useQuery();

    const filteredProjects = projects?.filter((p) => {
        if (fiscalYear && p.budgetYear !== fiscalYear) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            p.title.toLowerCase().includes(q) ||
            p.projectCode.toLowerCase().includes(q) ||
            (p.barangay ?? "").toLowerCase().includes(q) ||
            (p.cityMunicipality ?? "").toLowerCase().includes(q)
        );
    });

    const totalFiltered = filteredProjects?.length ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
    const paginatedProjects = filteredProjects?.slice(
        (page - 1) * pageSize,
        page * pageSize,
    );

    return (
        <div className="bg-slate-100 min-h-screen p-4 font-sans text-slate-800">

            {/* Stat Cards */}
            {statsLoading ? (
                <StatCardsSkeleton />
            ) : (
                <div className="grid grid-cols-7 gap-2 mb-3">
                    {statCards.map((c) => (
                        <div key={c.label} className={`bg-white rounded-lg shadow-sm p-3 flex flex-col gap-1 border-t-[3px] ${c.borderColor}`}>
                            <div className={`w-6 h-6 rounded-md ${c.iconBg} ${c.iconColor} flex items-center justify-center text-xs mb-1`}>
                                {c.icon}
                            </div>
                            <p className="text-[9px] font-bold text-slate-500 leading-tight tracking-wide">{c.label}</p>
                            <p className="text-2xl font-extrabold text-slate-900 leading-none">{c.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* User Cards */}
            {userLoading ? (
                <UserCardsSkeleton />
            ) : (
                <div className="grid grid-cols-4 gap-2 mb-5">
                    {userCards.map((c) => (
                        <div key={c.label} className={`bg-white rounded-lg shadow-sm p-3 flex items-center gap-3 border-l-4 ${c.border}`}>
                            <div className={`w-9 h-9 rounded-full ${c.iconBg} flex items-center justify-center shrink-0`}>
                                <UserIcon type={c.type} color={c.iconColor} />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-slate-500 tracking-wide leading-tight">{c.label}</p>
                                <p className="text-[22px] font-extrabold text-slate-900 leading-tight">{c.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Financial Overview Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-[15px] font-extrabold text-blue-900 tracking-wide">FINANCIAL OVERVIEW</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Aggregated project funding sources and allocations</p>
                </div>
                <button className="bg-[#1e3a8a] text-white text-[11px] font-bold px-4 py-1.5 rounded-md flex items-center gap-2 hover:bg-blue-900 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    YEAR
                </button>
            </div>

            {/* DISTRICT I and DISTRICT II Tracker */}
            {districtLoading ? (
                <DistrictCardsSkeleton />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-5">
                    {districtData?.map((d) => (
                        <DistrictCard
                            key={d.district}
                            title={`${d.district.replace('_', ' ')} PROJECT STATUS`}
                            data={toCardData(d.counts)}
                        />
                    ))}
                </div>
            )}

            {/* Annual Allocation & Source Breakdown */}
            {allocationLoading ? (
                <div className="mb-3">
                    <FinancialCardSkeleton />
                </div>
            ) : (
                <AnnualAllocationCard
                    bySource={projectAllocationData?.bySource ?? {}}
                    bySubType={projectAllocationData?.bySubType ?? {}}
                    total={TotalAllocation}
                    budgetYear={projectAllocationData?.budgetYear ?? "2024"}
                />
            )}

            {/* Remaining Balance & Disbursement Summary */}
            <div className="grid grid-cols-1 gap-3">
                {remainingLoading ? (
                    <>
                        <FinancialCardSkeleton />
                        <FinancialCardSkeleton />
                    </>
                ) : (
                    <>
                        <SourceBreakdownCard
                            title="Remaining Balance from Annual Allocation"
                            footerLabel="Grand Total Balance"
                            bySource={remainingBalanceData?.remaining.bySource ?? {}}
                            bySubType={remainingBalanceData?.remaining.bySubType ?? {}}
                            total={remainingBalanceData?.remaining.total ?? 0}
                        />
                        <SourceBreakdownCard
                            title="Disbursement Summary"
                            footerLabel="Total Disbursement"
                            bySource={remainingBalanceData?.disbursed.bySource ?? {}}
                            bySubType={remainingBalanceData?.disbursed.bySubType ?? {}}
                            total={remainingBalanceData?.disbursed.total ?? 0}
                        />
                    </>
                )}
            </div>

            {/* Recent Project Updates */}
            <div className="mt-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-5">
                    <h2 className="text-md font-semibold text-gray-900">
                        Recent Project Updates
                    </h2>

                    {/* Search + Fiscal Year Filter */}
                    <div className="flex items-center gap-2">
                        <div className="relative w-72">
                            <svg
                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search projects, documents, or data..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-[#1e3a4f] focus:outline-none focus:ring-2 focus:ring-[#1e3a4f]/20"
                            />
                        </div>
                        <div className="relative">
                            <svg
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                                />
                            </svg>
                            <select
                                value={fiscalYear}
                                onChange={(e) => {
                                    setFiscalYear(e.target.value);
                                    setPage(1);
                                }}
                                className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-gray-700 shadow-sm focus:border-[#1e3a4f] focus:outline-none focus:ring-2 focus:ring-[#1e3a4f]/20"
                            >
                                <option value="">All Fiscal Years</option>
                                {budgetYears?.map((y) => (
                                    <option key={y} value={y}>
                                        FY {y}
                                    </option>
                                ))}
                            </select>
                            <svg
                                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-10 text-center text-sm text-gray-400">
                            Loading projects...
                        </div>
                    ) : !paginatedProjects?.length ? (
                        <div className="p-10 text-center text-sm text-gray-400">
                            {search
                                ? "No projects match your search."
                                : 'No projects yet. Click "Add Project" to create one.'}
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Project Name
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Location
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Implementation
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        District
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Source of Fund
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Progress
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Involved Users
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedProjects.map((p) => {
                                    const statusCfg = STATUS_CONFIG[p.status] ?? {
                                        label: p.status,
                                        dot: "bg-gray-400",
                                        text: "text-gray-600",
                                        badge: "bg-gray-100 text-gray-600",
                                    };
                                    const location = [p.barangay, p.cityMunicipality]
                                        .filter(Boolean)
                                        .join(", ");

                                    return (
                                        <tr
                                            key={p.id}
                                            className="hover:bg-gray-50/60 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">
                                                    {p.title}
                                                </p>
                                                <p className="text-xs text-blue-500">
                                                    {p.projectCode}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4 text-gray-600">
                                                {location || "—"}
                                            </td>
                                            <td className="px-4 py-4 text-gray-600">
                                                {MODE_LABELS[p.modeOfImplementation] ?? p.modeOfImplementation}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                                                    {DISTRICT_LABELS[p.locationImplementation] ?? p.locationImplementation}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-gray-600">
                                                {SOURCE_LABELS[p.sourceOfFund] ?? p.sourceOfFund}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCfg.badge}`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`}
                                                    />
                                                    {statusCfg.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                                                        <div
                                                            className={`h-full rounded-full ${p.status === "SUSPENDED" ? "bg-red-500" : (p.completionPercentage ?? 0) >= 100 ? "bg-green-500" : "bg-orange-500"}`}
                                                            style={{ width: `${p.completionPercentage ?? 0}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-600">
                                                        {p.completionPercentage ?? 0}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                {(() => {
                                                    const seen = new Set<string>();
                                                    const contributors: { id: string; name: string | null; email: string; image: string | null }[] = [];
                                                    const allUsers = [p.createdBy, ...p.activities.map((a) => a.createdBy)];
                                                    for (const u of allUsers) {
                                                        if (!seen.has(u.id)) {
                                                            seen.add(u.id);
                                                            contributors.push(u);
                                                        }
                                                    }
                                                    const MAX_SHOW = 4;
                                                    const visible = contributors.slice(0, MAX_SHOW);
                                                    const extra = contributors.length - MAX_SHOW;
                                                    return (
                                                        <div className="flex items-center">
                                                            {visible.map((u, i) => {
                                                                const initials = (u.name ?? u.email)
                                                                    .split(" ")
                                                                    .map((w) => w[0])
                                                                    .join("")
                                                                    .slice(0, 2)
                                                                    .toUpperCase();
                                                                const colors = [
                                                                    "bg-blue-500",
                                                                    "bg-emerald-500",
                                                                    "bg-violet-500",
                                                                    "bg-orange-500",
                                                                ];
                                                                return (
                                                                    <div
                                                                        key={u.id}
                                                                        style={{ zIndex: visible.length - i, marginLeft: i === 0 ? 0 : "-8px" }}
                                                                        className={`group relative flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-white text-white text-[10px] font-bold cursor-default ${colors[i % colors.length]}`}
                                                                    >
                                                                        {u.image ? (
                                                                            <img
                                                                                src={u.image}
                                                                                alt={u.name ?? u.email}
                                                                                className="h-full w-full rounded-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            initials
                                                                        )}
                                                                        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[11px] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                                                                            {u.name ?? u.email}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                            {extra > 0 && (
                                                                <div
                                                                    style={{ zIndex: 0, marginLeft: "-8px" }}
                                                                    className="relative flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-white bg-gray-200 text-gray-600 text-[10px] font-bold"
                                                                >
                                                                    +{extra}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() =>
                                                        router.push(`/admin/dashboard/projects/${p.id}/view`)
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-white transition hover:bg-green-600"
                                                    title="View project"
                                                >
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                        />
                                                    </svg>
                                                    <span className="text-xs font-medium">View</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination Footer */}
                {!isLoading && totalFiltered > 0 && (
                    <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Rows per page:</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a4f]/20"
                            >
                                {[10, 20, 50, 100].map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
                            >
                                &lsaquo;
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-medium transition ${
                                        p === page
                                            ? "border-blue-500 bg-white text-blue-600 ring-1 ring-blue-500"
                                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
                            >
                                &rsaquo;
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
