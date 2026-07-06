"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import type { DistrictCardProps, Segment, StatCard, UserCard, UserIconProps, DonutChartProps } from "./super.admin.types";
import type { DistrictCardItem, ProjectStatus, StatusCounts } from "./super.adminv2.types";
import { STATUS_COLORS, STATUS_LABELS } from "./super.adminv2.types";
import { formatPeso } from "~/helper/formatter"
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
    variationBySource: Record<string, number>;
    variationProjectsBySource: Record<string, Record<string, number>>;
    total: number;
    budgetYear: string;
};

function AnnualAllocationCard({ bySource, bySubType, variationBySource, variationProjectsBySource, total }: AnnualAllocationCardProps) {
    // Order known sources first, then append any unmapped sources that have allocations.
    const ordered = [...SOURCE_OF_FUND_ORDER, "CONFIDENTIAL", ...Object.keys(bySource)].filter(
        (src, i, arr) => arr.indexOf(src) === i && (bySource[src] ?? 0) > 0,
    );

    const entries = ordered.map((src) => {
        const amount = bySource[src] ?? 0;
        // Portion of this source's allocation that comes from variation orders,
        // broken down by the tracking number of the project each order belongs to.
        const variationFund = variationBySource[src] ?? 0;
        const variationProjects = Object.entries(variationProjectsBySource[src] ?? {})
            .map(([trackingNumber, voAmount]) => ({ trackingNumber, amount: voAmount }))
            .sort((a, b) => b.amount - a.amount);
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
            variationFund,
            variationProjects,
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

                                {(e.subTypes.length > 0 || e.variationFund > 0) && (
                                    <div className="mt-1 ml-1 border-l border-slate-200 pl-3 flex flex-col gap-0.5">
                                        {e.subTypes.map((s) => (
                                            <div key={s.label} className="flex items-center justify-between gap-2">
                                                <span className="text-[10.5px] text-slate-500 truncate">{s.label}</span>
                                                <span className="text-[10.5px] text-slate-500 tabular-nums shrink-0">
                                                    {formatToPHPMillions(s.amount)}
                                                </span>
                                            </div>
                                        ))}

                                        {/* Variation Fund (variation orders for this source, per project tracking number) */}
                                        {e.variationFund > 0 && (
                                            <>
                                                <span className="text-[10.5px] font-semibold text-amber-600 truncate">Variation Fund</span>
                                                {e.variationProjects.map((vp) => (
                                                    <div key={vp.trackingNumber} className="flex items-center justify-between gap-2 pl-2">
                                                        <span className="text-[10.5px] text-slate-500 truncate">{vp.trackingNumber}</span>
                                                        <span className="text-[10.5px] text-slate-500 tabular-nums shrink-0">
                                                            {formatToPHPMillions(vp.amount)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </>
                                        )}
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
    variationProjectsBySource?: Record<string, Record<string, number>>;
    total: number;
};

function SourceBreakdownCard({ title, footerLabel, bySource, bySubType, variationProjectsBySource, total }: SourceBreakdownCardProps) {
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
        // Variation-order portion for this source, per project tracking number.
        const variationProjects = Object.entries(variationProjectsBySource?.[src] ?? {})
            .map(([trackingNumber, voAmount]) => ({ trackingNumber, amount: voAmount }))
            .sort((a, b) => b.amount - a.amount);
        return {
            src,
            label: REM_SOURCE_LABEL[src] ?? src,
            color: SOURCE_COLORS[src] ?? "#94a3b8",
            amount,
            subTypes,
            variationProjects,
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

                                {(e.subTypes.length > 0 || e.variationProjects.length > 0) && (
                                    <div className="mt-1 ml-1 border-l border-slate-200 pl-3 flex flex-col gap-0.5">
                                        {e.subTypes.map((s) => (
                                            <div key={s.label} className="flex items-center justify-between gap-2">
                                                <span className="text-[10.5px] text-slate-500 truncate">{s.label}</span>
                                                <span className="text-[10.5px] text-slate-500 tabular-nums shrink-0">
                                                    {formatToPHPMillions(s.amount)}
                                                </span>
                                            </div>
                                        ))}

                                        {/* Variation-order portion, per project tracking number */}
                                        {e.variationProjects.length > 0 && (
                                            <>
                                                <span className="text-[10.5px] font-semibold text-amber-600 truncate">Variation Order</span>
                                                {e.variationProjects.map((vp) => (
                                                    <div key={vp.trackingNumber} className="flex items-center justify-between gap-2 pl-2">
                                                        <span className="text-[10.5px] text-slate-500 truncate">{vp.trackingNumber}</span>
                                                        <span className="text-[10.5px] text-slate-500 tabular-nums shrink-0">
                                                            {formatToPHPMillions(vp.amount)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </>
                                        )}
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

// ── Year Filter (header button) ────────────────────────────────
// Styled to match the dashboard's dark "YEAR" header button, but acts as a
// fiscal-year selector that drives the year-aware cards.
function YearFilter({
    value,
    onChange,
    years,
}: {
    value: string;
    onChange: (value: string) => void;
    years: string[];
}) {
    return (
        <div className="relative">
            <svg
                className="pointer-events-none absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
            >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none cursor-pointer bg-[#1e3a8a] text-white text-[11px] font-bold rounded-md pl-8 pr-8 py-1.5 hover:bg-blue-900 transition-colors focus:outline-none"
            >
                <option value="">ALL YEARS</option>
                {years.map((y) => (
                    <option key={y} value={y}>
                        FY {y}
                    </option>
                ))}
            </select>
            <svg
                className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
        </div>
    );
}

// ── Main Dashboard ─────────────────────────────────────────────
const PEOISDashboard = () => {

    // Fiscal year filter shared by the dashboard cards (driven by the header YEAR button).
    const [dashboardYear, setDashboardYear] = useState("");
    const yearInput = dashboardYear ? { budgetYear: dashboardYear } : undefined;

    const { data: statsData } = api.project.getStats.useQuery(yearInput);
    const { data: userData } = api.user.getStats.useQuery();
    const { data: projectAllocationData } = api.project.getFinancialOverview.useQuery(yearInput);
    const { data: districtData } = api.project.getDistrictData.useQuery(yearInput);
    const { data: remainingBalanceData } = api.project.getRemainingBalance.useQuery(yearInput);
    const { data: budgetYears } = api.project.getBudgetYears.useQuery();

    const TotalAllocation = projectAllocationData
        ? Object.values(projectAllocationData.bySource).reduce((s, v) => s + v, 0)
        : 0;

    const statCards: StatCard[] = [
        { label: "BUDGET YEAR", value: dashboardYear || "All", borderColor: "border-blue-600", iconBg: "bg-blue-100", iconColor: "text-blue-600", icon: "📅" },
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

    return (
        <div className="bg-slate-100 min-h-screen p-4 font-sans text-slate-800">

            {/* Users Status Overview Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-[15px] font-extrabold text-blue-900 tracking-wide">USERS STATUS OVERVIEW</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">User activity and engagement metrics</p>
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

            {/* User Cards */}
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

            {/* Project Status Overview Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-[15px] font-extrabold text-blue-900 tracking-wide">PROJECT STATUS OVERVIEW</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Project Status Information</p>
                </div>
                <YearFilter value={dashboardYear} onChange={setDashboardYear} years={budgetYears ?? []} />
            </div>

            {/* Stat Cards */}
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

            {/* DISTRICT I and DISTRICT II Tracker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-5">
                {districtData?.map((d) => (
                    <DistrictCard
                        key={d.district}
                        title={`${d.district.replace('_', ' ')} PROJECT STATUS`}
                        data={toCardData(d.counts)}
                    />
                ))}
            </div>

            {/* Financial Overview Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-[15px] font-extrabold text-blue-900 tracking-wide">FINANCIAL OVERVIEW</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Aggregated project funding sources and allocations</p>
                </div>
                <YearFilter value={dashboardYear} onChange={setDashboardYear} years={budgetYears ?? []} />
            </div>

            {/* Annual Allocation & Source Breakdown */}
            <AnnualAllocationCard
                bySource={projectAllocationData?.bySource ?? {}}
                bySubType={projectAllocationData?.bySubType ?? {}}
                variationBySource={projectAllocationData?.variationBySource ?? {}}
                variationProjectsBySource={projectAllocationData?.variationProjectsBySource ?? {}}
                total={TotalAllocation}
                budgetYear={projectAllocationData?.budgetYear ?? "2024"}
            />

            {/* Remaining Balance & Disbursement Summary */}
            <div className="grid grid-cols-1 gap-3">
                <SourceBreakdownCard
                    title="Remaining Balance from Annual Allocation"
                    footerLabel="Grand Total Balance"
                    bySource={remainingBalanceData?.remaining.bySource ?? {}}
                    bySubType={remainingBalanceData?.remaining.bySubType ?? {}}
                    variationProjectsBySource={remainingBalanceData?.remaining.variationProjectsBySource ?? {}}
                    total={remainingBalanceData?.remaining.total ?? 0}
                />
                <SourceBreakdownCard
                    title="Disbursement Summary"
                    footerLabel="Total Disbursement"
                    bySource={remainingBalanceData?.disbursed.bySource ?? {}}
                    bySubType={remainingBalanceData?.disbursed.bySubType ?? {}}
                    variationProjectsBySource={remainingBalanceData?.disbursed.variationProjectsBySource ?? {}}
                    total={remainingBalanceData?.disbursed.total ?? 0}
                />
            </div>

        </div>
    );
}

export default PEOISDashboard;
