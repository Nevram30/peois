"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import {
  PROJECT_SUB_TYPE_LABEL,
  SOURCE_OF_FUND_ORDER,
  type ProjectSubTypeValue,
} from "~/lib/fund-constants";

const SOURCE_COLORS: Record<string, string> = {
  GENERAL_FUND: "#3b82f6",
  TWENTY_PERCENT_DEV_FUND: "#8b5cf6",
  SEF: "#f97316",
  AID: "#ec4899",
  LOAN: "#14b8a6",
  TRUST_FUND: "#84cc16",
  OTHERS: "#94a3b8",
  FIVE_PERCENT_CONFIDENTIAL_FUND: "#6366f1",
  PPOC: "#0ea5e9",
  LDRRM: "#dc2626",
  MOOE: "#65a30d",
  NCDC: "#9333ea",
  PRDP: "#0891b2",
  MIADP: "#db2777",
};

const SUB_TYPE_COLORS: Record<ProjectSubTypeValue, string> = {
  VARIOUS_WATER_SYSTEM_DEV: "#3b82f6",
  RURAL_ELECTRIFICATION: "#f59e0b",
  PARK_AND_DEVELOPMENT: "#10b981",
  SLOPE_PROTECTION_LAND_DEV: "#8b5cf6",
  INFRA_DEV_GOVT_BUILDINGS: "#ec4899",
  LOCAL_ROADS_DRAINAGE: "#06b6d4",
  PROVINCIAL_ROADS_BRIDGES: "#ef4444",
  SUPPLEMENTAL_BUDGET_1: "#14b8a6",
  SUPPLEMENTAL_BUDGET_2: "#f97316",
  SUPPLEMENTAL_BUDGET_3: "#84cc16",
  SUPPLEMENTAL_BUDGET_4: "#a855f7",
  SUPPLEMENTAL_BUDGET_5: "#0ea5e9",
  PROVINCIAL_GOVT_OFFICE: "#db2777",
  PDRRMO_RESPONSE_CAMP_MGMT: "#65a30d",
  PDRRMO_REHAB_RECOVERY: "#ca8a04",
  PDRRMO_PREVENTION_MITIGATION: "#7c3aed",
  PDRRMO_DISASTER_PREPAREDNESS: "#0891b2",
  PAMANA: "#dc2626",
  DOH: "#059669",
  NCDC: "#9333ea",
  WATER_SYSTEMS: "#2563eb",
  GOVERNMENT_BUILDINGS: "#d97706",
  ELECTRIFICATION: "#e11d48",
  RESPONSE_CAMP_MGMT: "#4f46e5",
};

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function DonutChart({
  segments,
  total,
}: {
  segments: { label: string; value: number; color: string }[];
  total: number;
}) {
  const cx = 100;
  const cy = 100;
  const r = 64;
  const strokeWidth = 28;
  const circumference = 2 * Math.PI * r;

  let cumulativeLen = 0;
  const arcs = segments.map((seg) => {
    const fraction = total > 0 ? seg.value / total : 0;
    const dashLength = fraction * circumference;
    const arc = { ...seg, dashLength, dashOffset: -cumulativeLen };
    cumulativeLen += dashLength;
    return arc;
  });

  return (
    <svg viewBox="0 0 200 200" className="h-44 w-44">
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {total > 0 &&
          arcs.map((arc, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arc.dashLength} ${circumference}`}
              strokeDashoffset={arc.dashOffset}
            />
          ))}
      </g>
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        className="fill-gray-900 text-sm font-bold"
        style={{ fontSize: "11px", fontWeight: 700 }}
      >
        {formatPeso(total)}
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        style={{ fontSize: "9px", fill: "#6b7280" }}
      >
        Total
      </text>
    </svg>
  );
}

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

export function AdminDashboardContent() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [fiscalYear, setFiscalYear] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const statsInput = fiscalYear ? { budgetYear: fiscalYear } : undefined;
  const { data: stats } = api.project.getStats.useQuery(statsInput);
  const { data: financial } = api.project.getFinancialOverview.useQuery(statsInput);
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
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
        </div>

        {/* Search + Fiscal Year Filter */}
        <div className="mt-2 flex items-center gap-2">
          <div className="relative w-80">
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

      {/* Colored Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7 xl:grid-cols-7">
        {/* Budget Year */}
        <div className="flex flex-col rounded-2xl bg-blue-600 p-4 text-white shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
              Budget Year
            </span>
            <svg className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none">
            {financial?.budgetYear ?? new Date().getFullYear()}
          </p>
        </div>

        {/* Completed */}
        <Link href="/admin/dashboard/projects?status=COMPLETED" className="flex flex-col rounded-2xl bg-teal-500 p-4 text-white shadow-sm transition hover:bg-teal-600">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Completed</span>
            <svg className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none">{stats?.completed ?? 0}</p>
          <p className="mt-1 text-xs opacity-70">Projects</p>
        </Link>

        {/* Suspended */}
        <Link href="/admin/dashboard/projects?status=SUSPENDED" className="flex flex-col rounded-2xl bg-red-500 p-4 text-white shadow-sm transition hover:bg-red-600">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Suspended</span>
            <svg className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none">{stats?.suspended ?? 0}</p>
          <p className="mt-1 text-xs opacity-70">Projects</p>
        </Link>

        {/* For Implementation */}
        <Link href="/admin/dashboard/projects?status=FOR_IMPLEMENTATION" className="flex flex-col rounded-2xl bg-amber-500 p-4 text-white shadow-sm transition hover:bg-amber-600">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">For Implementation</span>
            <svg className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none">{stats?.forImplementation ?? 0}</p>
          <p className="mt-1 text-xs opacity-70">Projects</p>
        </Link>

        {/* On-Going */}
        <Link href="/admin/dashboard/projects?status=ON_GOING" className="flex flex-col rounded-2xl bg-orange-400 p-4 text-white shadow-sm transition hover:bg-orange-500">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">On-going</span>
            <svg className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none">{stats?.ongoing ?? 0}</p>
          <p className="mt-1 text-xs opacity-70">Projects</p>
        </Link>

        {/* Re-alignment */}
        <Link href="/admin/dashboard/projects?status=RE_ALIGNMENT" className="flex flex-col rounded-2xl bg-purple-500 p-4 text-white shadow-sm transition hover:bg-purple-600">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Re-alignment</span>
            <svg className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none">{stats?.reAlignment ?? 0}</p>
          <p className="mt-1 text-xs opacity-70">Projects</p>
        </Link>

        {/* Others */}
        <Link href="/admin/dashboard/projects?status=OTHERS" className="flex flex-col rounded-2xl bg-slate-500 p-4 text-white shadow-sm transition hover:bg-slate-600">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Others</span>
            <svg className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none">{stats?.others ?? 0}</p>
          <p className="mt-1 text-xs opacity-70">Projects</p>
        </Link>

      </div>


      {/* Financial Overview */}
      {(() => {
        const totalAllocation = financial?.totalAllocation ?? 0;
        const bySource = financial?.bySource ?? {};
        const bySubType = financial?.bySubType ?? {};
        const executionRate = financial?.executionRate ?? 0;

        type SubEntry = {
          key: string;
          label: string;
          value: number;
          color: string;
          sourceOfFund: string;
        };

        const subEntries: SubEntry[] = Object.entries(bySubType)
          .filter(([, v]) => v.amount > 0)
          .map(([key, v]) => {
            const isNone = key.startsWith("__NONE__:");
            const label = isNone
              ? "Uncategorized"
              : (PROJECT_SUB_TYPE_LABEL[key as ProjectSubTypeValue] ?? key);
            const color = isNone
              ? (SOURCE_COLORS[v.sourceOfFund] ?? "#94a3b8")
              : (SUB_TYPE_COLORS[key as ProjectSubTypeValue] ?? "#94a3b8");
            return {
              key,
              label,
              value: v.amount,
              color,
              sourceOfFund: v.sourceOfFund,
            };
          });

        const segments = subEntries
          .slice()
          .sort((a, b) => b.value - a.value)
          .map((e) => ({ label: e.label, value: e.value, color: e.color }));

        // Group sub-entries under each source of fund for the breakdown panel
        const orderedSources = SOURCE_OF_FUND_ORDER.filter(
          (s) => (bySource[s] ?? 0) > 0,
        );

        const groupedBreakdown = orderedSources.map((sourceKey) => {
          const sourceAmount = bySource[sourceKey] ?? 0;
          const subs = subEntries
            .filter((e) => e.sourceOfFund === sourceKey)
            .sort((a, b) => b.value - a.value);
          return { sourceKey, sourceAmount, subs };
        });

        return (
          <div className="mb-8 rounded-2xl border border-gray-100 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Financial Overview
                </p>
                <p className="text-xs text-gray-400">
                  Source of funds broken down by sub-category
                </p>
              </div>
              <button
                onClick={() => {
                  const rows: string[][] = [
                    ["Source of Fund", "Sub-Category", "Amount (PHP)", "Percentage"],
                  ];
                  for (const g of groupedBreakdown) {
                    for (const s of g.subs) {
                      const pct = totalAllocation > 0 ? ((s.value / totalAllocation) * 100).toFixed(1) : "0.0";
                      rows.push([
                        SOURCE_LABELS[g.sourceKey] ?? g.sourceKey,
                        s.label,
                        s.value.toFixed(2),
                        `${pct}%`,
                      ]);
                    }
                  }
                  rows.push(["Grand Total", "", totalAllocation.toFixed(2), "100%"]);
                  const csv = rows.map((r) => r.join(",")).join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `fiscal-report-${financial?.budgetYear ?? ""}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Export Fiscal Report
              </button>
            </div>

            <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
              {/* Left: Donut Chart */}
              <div className="flex flex-col items-center justify-center gap-4 border-b border-gray-100 px-6 py-6 lg:border-b-0 lg:border-r">
                <p className="self-start text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total Annual Allocation
                </p>
                <DonutChart segments={segments} total={totalAllocation} />
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                  {segments.slice(0, 8).map((seg) => (
                    <span key={seg.label} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: seg.color }}
                      />
                      {seg.label}
                    </span>
                  ))}
                  {segments.length > 8 && (
                    <span className="text-xs text-gray-400">
                      +{segments.length - 8} more
                    </span>
                  )}
                  {segments.length === 0 && (
                    <span className="text-xs text-gray-400">No allocation data for {financial?.budgetYear ?? new Date().getFullYear()}</span>
                  )}
                </div>

                {/* Execution Rate */}
                <div className="w-full rounded-lg bg-gray-50 px-3 py-2.5">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <div className="flex flex-col">
                      <span className="font-semibold uppercase tracking-wider text-gray-500">
                        Execution Rate
                      </span>
                      <span className="text-[10px] font-normal normal-case text-gray-400">
                        Average progress across all projects
                      </span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      {Math.min(100, Math.max(0, executionRate)).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, executionRate))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Source of Funds Breakdown (grouped by sub-category) */}
              <div className="px-6 py-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Source of Funds Breakdown
                </p>
                {groupedBreakdown.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-400">
                    No fund allocation data found for {financial?.budgetYear ?? new Date().getFullYear()}.
                  </p>
                ) : (
                  <div className="flex max-h-80 flex-col gap-3 overflow-y-auto pr-1">
                    {groupedBreakdown.map(({ sourceKey, sourceAmount, subs }) => {
                      const sourcePct = totalAllocation > 0
                        ? ((sourceAmount / totalAllocation) * 100).toFixed(1)
                        : "0.0";
                      return (
                        <div
                          key={sourceKey}
                          className="rounded-lg border border-gray-100 bg-gray-50/50 p-3"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: SOURCE_COLORS[sourceKey] ?? "#94a3b8" }}
                              />
                              <span className="text-xs font-semibold text-gray-700">
                                {SOURCE_LABELS[sourceKey] ?? sourceKey}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-gray-900">
                                {formatPeso(sourceAmount)}
                              </p>
                              <p className="text-[10px] text-gray-400">{sourcePct}%</p>
                            </div>
                          </div>
                          {subs.length > 0 && (
                            <div className="flex flex-col gap-1 pl-4">
                              {subs.map((s) => {
                                const pct = totalAllocation > 0
                                  ? ((s.value / totalAllocation) * 100).toFixed(1)
                                  : "0.0";
                                return (
                                  <div
                                    key={s.key}
                                    className="flex items-center justify-between gap-2"
                                  >
                                    <div className="flex min-w-0 items-center gap-1.5">
                                      <span
                                        className="inline-block h-2 w-2 shrink-0 rounded-full"
                                        style={{ backgroundColor: s.color }}
                                      />
                                      <span className="truncate text-[11px] text-gray-600">
                                        {s.label}
                                      </span>
                                    </div>
                                    <div className="shrink-0 text-right">
                                      <span className="text-[11px] font-semibold text-gray-800">
                                        {formatPeso(s.value)}
                                      </span>
                                      <span className="ml-1.5 text-[10px] text-gray-400">
                                        {pct}%
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Grand Total */}
                {groupedBreakdown.length > 0 && (
                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        Grand Total Combined Allocation
                      </span>
                      <span className="text-sm font-extrabold text-blue-600">
                        {formatPeso(totalAllocation)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Recent Project Updates */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-md font-semibold text-gray-900">
              Recent Project Updates
            </h2>
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
                            router.push(`/admin/dashboard/projects/${p.id}`)
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
