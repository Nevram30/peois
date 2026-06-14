"use client";

import { api } from "~/trpc/react";
import type { AllocationEntry, DistrictCardProps, LegendEntry, MiniLegendProps, Segment, StatCard, UserCard, UserIconProps, DonutChartProps } from "./super.admin.types";
import type { DistrictCardItem, ProjectStatus, StatusCounts } from "./super.adminv2.types";
import { STATUS_COLORS, STATUS_LABELS } from "./super.adminv2.types";
import { formatPeso } from "~/helper/formatter";

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

const allocSegments: Segment[] = [
    { value: 920000000, color: "#1e3a8a" }, { value: 480000000, color: "#2563eb" },
    { value: 340000000, color: "#7c3aed" }, { value: 115000000, color: "#059669" },
    { value: 85000000, color: "#d97706" }, { value: 120000000, color: "#dc2626" },
    { value: 65500000, color: "#0891b2" }, { value: 42000000, color: "#9333ea" },
    { value: 28000000, color: "#64748b" }, { value: 18200000, color: "#f97316" },
];

const remainingData: LegendEntry[] = [
    { label: "General Fund", amount: "₱152,900,000.00", color: "#1e3a8a" },
    { label: "5% Confidential", amount: "₱20,100,000.00", color: "#dc2626" },
    { label: "20% Dev. Fund", amount: "₱80,500,000.00", color: "#2563eb" },
    { label: "PRDP (Rural)", amount: "₱12,100,000.00", color: "#0891b2" },
    { label: "Trust Fund", amount: "₱56,300,000.00", color: "#7c3aed" },
    { label: "PPOC (Peace)", amount: "₱8,100,000.00", color: "#9333ea" },
    { label: "LDRRM", amount: "₱20,100,000.00", color: "#059669" },
    { label: "NCDC", amount: "₱4,000,000.00", color: "#64748b" },
    { label: "SEF (Education)", amount: "₱16,100,000.00", color: "#d97706" },
    { label: "MIADP", amount: "₱32,300,000.00", color: "#f97316" },
];

const remSegments: Segment[] = remainingData.map((d) => ({
    value: parseFloat(d.amount.replace(/[₱,]/g, "")),
    color: d.color,
}));

const disbursementData: LegendEntry[] = [
    { label: "General Fund", amount: "-347,500,000.00", color: "#1e3a8a" },
    { label: "5% Confidential", amount: "-45,700,000.00", color: "#dc2626" },
    { label: "20% Dev. Fund", amount: "-182,900,000.00", color: "#2563eb" },
    { label: "PRDP (Rural)", amount: "-27,400,000.00", color: "#0891b2" },
    { label: "Trust Fund", amount: "-128,000,000.00", color: "#7c3aed" },
    { label: "PPOC (Peace)", amount: "-18,300,000.00", color: "#9333ea" },
    { label: "LDRRM", amount: "-45,700,000.00", color: "#059669" },
    { label: "NCDC", amount: "-9,100,000.00", color: "#64748b" },
    { label: "SEF (Education)", amount: "-36,600,000.00", color: "#d97706" },
    { label: "MIADP", amount: "-73,200,000.00", color: "#f97316" },
];

const disSegments: Segment[] = disbursementData.map((d) => ({
    value: Math.abs(parseFloat(d.amount.replace(/,/g, ""))),
    color: d.color,
}));

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

// ── MiniLegend ─────────────────────────────────────────────────
function MiniLegend({ data, negative = false }: MiniLegendProps) {
    return (
        <div className="grid grid-cols-2 gap-x-2 gap-y-0.75 flex-1">
            {data.map((d) => (
                <div key={d.label} className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1 min-w-0">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                        <span className="text-[10px] text-slate-600 truncate">{d.label}</span>
                    </div>
                    <span className={`text-[10px] font-bold shrink-0 ${negative ? "text-red-600" : "text-slate-800"}`}>
                        {negative ? "-" : ""}₱{" "}
                        {Math.abs(parseFloat(d.amount.replace(/[₱,-]/g, ""))).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                        })}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ── Main Dashboard ─────────────────────────────────────────────
const PEOISDashboard = () => {

    const { data: statsData } = api.project.getStats.useQuery();
    const { data: userData } = api.user.getStats.useQuery();
    const { data: projectAllocationData } = api.project.getFinancialOverview.useQuery();
    const { data: districtData } = api.project.getDistrictData.useQuery();

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

    const allocationData: AllocationEntry[] = [
        { label: "General Fund", pct: "38%", amount: formatPeso(projectAllocationData?.bySource?.GENERAL_FUND), color: "#1e3a8a" },
        { label: "5% Confidential", pct: "5%", amount: formatPeso(projectAllocationData?.bySource?.CONFIDENTIAL), color: "#dc2626" },
        { label: "20% Dev. Fund", pct: "20%", amount: formatPeso(projectAllocationData?.bySource?.DEV_FUND), color: "#2563eb" },
        { label: "PRDP (Rural)", pct: "3%", amount: formatPeso(projectAllocationData?.bySource?.PRDP), color: "#0891b2" },
        { label: "Trust Fund", pct: "14%", amount: formatPeso(projectAllocationData?.bySource?.TRUST_FUND), color: "#7c3aed" },
        { label: "PPOC (Peace)", pct: "2%", amount: formatPeso(projectAllocationData?.bySource?.PPOC), color: "#9333ea" },
        { label: "LDRRM", pct: "5%", amount: formatPeso(projectAllocationData?.bySource?.LDRRM), color: "#059669" },
        { label: "NCDC", pct: "1%", amount: formatPeso(projectAllocationData?.bySource?.NCDC), color: "#64748b" },
        { label: "SEF (Education)", pct: "4%", amount: formatPeso(projectAllocationData?.bySource?.SEF), color: "#d97706" },
        { label: "MIADP", pct: "8%", amount: formatPeso(projectAllocationData?.bySource?.MIADP), color: "#f97316" },
    ];


    return (
        <div className="bg-slate-100 min-h-screen p-4 font-sans text-slate-800">

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-5">
                {districtData?.map((d) => (
                    <DistrictCard
                        key={d.district}
                        title={`${d.district.replace('_', ' ')} PROJECT STATUS`}
                        data={toCardData(d.counts)}
                    />
                ))}
            </div>

            {/* Annual Allocation */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-3">
                <div className="p-4 flex items-center gap-6">
                    <div className="shrink-0">
                        <p className="text-[11px] font-extrabold text-slate-800 tracking-widest mb-3">
                            ANNUAL ALLOCATION &amp; SOURCE BREAKDOWN
                        </p>
                        <DonutChart segments={allocSegments} size={130} thickness={32} centerLabel="₱2.42B" />
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.25 flex-1 text-[11px]">
                        {allocationData.map((d) => (
                            <div key={d.label} className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                                    <span className="text-slate-600">{d.label}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-slate-400 text-[10px]">{d.pct}</span>
                                    <span className="font-bold text-slate-800">{d.amount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-slate-400 self-start pt-1">FY 2024</p>
                </div>
                <div className="bg-[#1e3a8a] text-white px-5 py-2.5 flex justify-between items-center text-[12px] font-bold tracking-widest">
                    <span>TOTAL COMBINED ALLOCATION</span>
                    <span>{formatPeso(TotalAllocation)}</span>
                </div>
            </div>

            {/* Remaining Balance & Disbursement */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4">
                        <p className="text-[11px] font-extrabold text-slate-800 tracking-widest mb-3">
                            REMAINING BALANCE FROM ANNUAL ALLOCATION
                        </p>
                        <div className="flex items-center gap-3">
                            <DonutChart segments={remSegments} size={82} thickness={20} />
                            <MiniLegend data={remainingData} />
                        </div>
                    </div>
                    <div className="bg-[#1e3a8a] text-white px-4 py-2.5 flex justify-between items-center text-[11px] font-bold tracking-widest">
                        <span>GRAND TOTAL REMAINING BALANCE</span>
                        <span>₱ 402,500,000.00</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4">
                        <p className="text-[11px] font-extrabold text-slate-800 tracking-widest mb-3">
                            DISBURSEMENT SUMMARY
                        </p>
                        <div className="flex items-center gap-3">
                            <DonutChart segments={disSegments} size={82} thickness={20} />
                            <MiniLegend data={disbursementData} negative />
                        </div>
                    </div>
                    <div className="bg-[#1e3a8a] text-white px-4 py-2.5 flex justify-between items-center text-[11px] font-bold tracking-widest">
                        <span>TOTAL DISBURSEMENT</span>
                        <span>₱ 914,400,000.00</span>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default PEOISDashboard;