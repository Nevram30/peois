"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import {
  PROJECT_SUB_TYPE_LABEL,
  SOURCE_OF_FUND_ORDER,
  type ProjectSubTypeValue,
} from "~/lib/fund-constants";

const STATUS_STYLES: Record<string, { bg: string; dot: string; text: string; label: string }> = {
  ON_GOING: { bg: "bg-blue-50", dot: "bg-blue-500", text: "text-blue-700", label: "Active" },
  COMPLETED: { bg: "bg-green-50", dot: "bg-green-500", text: "text-green-700", label: "Completed" },
  SUSPENDED: { bg: "bg-red-50", dot: "bg-red-500", text: "text-red-700", label: "Suspended" },
  NOT_YET_STARTED: { bg: "bg-gray-100", dot: "bg-gray-400", text: "text-gray-600", label: "Not Started" },
};

const FUND_SOURCE_LABELS: Record<string, string> = {
  GENERAL_FUND: "General Fund",
  SEF: "SEF",
  TRUST_FUND: "Trust Fund",
  TWENTY_PERCENT_DEV_FUND: "20% Dev Fund",
  AID: "AID",
  LOAN: "Loan",
  OTHERS: "Others",
};

const PROJECT_SUBTYPE_LABELS: Record<string, string> = {
  WATER_SYSTEMS: "Water Systems",
  GOVERNMENT_BUILDINGS: "Government Buildings",
  ELECTRIFICATION: "Electrification",
  RESPONSE_CAMP_MGMT: "Response Camp Mgmt",
  SUPPLEMENTAL_BUDGET_2: "Supplemental Budget 2",
  PARK_AND_DEVELOPMENT: "Park & Development",
  DOH: "DOH",
  PROVINCIAL_GOVT_OFFICE: "Provincial Govt Office",
};

const FUND_SOURCE_COLORS: Record<string, string> = {
  GENERAL_FUND: "#3B82F6",
  SEF: "#F59E0B",
  TRUST_FUND: "#10B981",
  TWENTY_PERCENT_DEV_FUND: "#8B5CF6",
  AID: "#EC4899",
  LOAN: "#06B6D4",
  OTHERS: "#6B7280",
  FIVE_PERCENT_CONFIDENTIAL_FUND: "#6366F1",
  PPOC: "#0EA5E9",
  LDRRM: "#DC2626",
  MOOE: "#65A30D",
  NCDC: "#9333EA",
  PRDP: "#0891B2",
  MIADP: "#DB2777",
};

const SUB_TYPE_COLORS: Record<ProjectSubTypeValue, string> = {
  VARIOUS_WATER_SYSTEM_DEV: "#3B82F6",
  RURAL_ELECTRIFICATION: "#F59E0B",
  PARK_AND_DEVELOPMENT: "#10B981",
  SLOPE_PROTECTION_LAND_DEV: "#8B5CF6",
  INFRA_DEV_GOVT_BUILDINGS: "#EC4899",
  LOCAL_ROADS_DRAINAGE: "#06B6D4",
  PROVINCIAL_ROADS_BRIDGES: "#EF4444",
  SUPPLEMENTAL_BUDGET_1: "#14B8A6",
  SUPPLEMENTAL_BUDGET_2: "#F97316",
  SUPPLEMENTAL_BUDGET_3: "#84CC16",
  SUPPLEMENTAL_BUDGET_4: "#A855F7",
  SUPPLEMENTAL_BUDGET_5: "#0EA5E9",
  PROVINCIAL_GOVT_OFFICE: "#DB2777",
  PDRRMO_RESPONSE_CAMP_MGMT: "#65A30D",
  PDRRMO_REHAB_RECOVERY: "#CA8A04",
  PDRRMO_PREVENTION_MITIGATION: "#7C3AED",
  PDRRMO_DISASTER_PREPAREDNESS: "#0891B2",
  PAMANA: "#DC2626",
  DOH: "#059669",
  NCDC: "#9333EA",
  WATER_SYSTEMS: "#2563EB",
  GOVERNMENT_BUILDINGS: "#D97706",
  ELECTRIFICATION: "#E11D48",
  RESPONSE_CAMP_MGMT: "#4F46E5",
};

const DONUT_RADIUS = 54;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

function formatPeso(amount: number): string {
  if (amount >= 1_000_000_000) return `₱${(amount / 1_000_000_000).toFixed(2)}B`;
  if (amount >= 1_000_000) return `₱${(amount / 1_000_000).toFixed(2)}M`;
  return `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

export default function ProjectsDataListPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [subTypeFilter, setSubTypeFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [barangayFilter, setBarangayFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [cardYearFilter, setCardYearFilter] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const { data: projects, isLoading } = api.project.getAll.useQuery();
  const { data: stats } = api.project.getStats.useQuery();

  const budgetYear = new Date().getFullYear();

  const cardYearProjects = (projects ?? []).filter((p) =>
    cardYearFilter
      ? new Date(p.createdAt).getFullYear().toString() === cardYearFilter
      : true,
  );

  const cardStats = cardYearFilter
    ? {
        completed: cardYearProjects.filter((p) => p.status === "COMPLETED").length,
        ongoing: cardYearProjects.filter((p) => p.status === "ON_GOING").length,
        notYetStarted: cardYearProjects.filter((p) => p.status === "NOT_YET_STARTED").length,
        suspended: cardYearProjects.filter((p) => p.status === "SUSPENDED").length,
      }
    : {
        completed: stats?.completed ?? 0,
        ongoing: stats?.ongoing ?? 0,
        notYetStarted: stats?.notYetStarted ?? 0,
        suspended: stats?.suspended ?? 0,
      };

  const noAllotted = cardYearProjects.filter((p) => p.contractCost === 0).length;

  // --- Financial Overview computations (scoped to selected card year) ---
  const totalAllocation = cardYearProjects.reduce((sum, p) => sum + p.contractCost, 0);

  const bySource = cardYearProjects.reduce<Record<string, number>>((acc, p) => {
    if (p.contractCost > 0) {
      acc[p.sourceOfFund] = (acc[p.sourceOfFund] ?? 0) + p.contractCost;
    }
    return acc;
  }, {});

  type SubEntry = {
    key: string;
    label: string;
    amount: number;
    color: string;
    sourceOfFund: string;
  };

  const bySubTypeMap = cardYearProjects.reduce<
    Record<string, { amount: number; sourceOfFund: string }>
  >((acc, p) => {
    if (p.contractCost <= 0) return acc;
    const key = p.subType ?? `__NONE__:${p.sourceOfFund}`;
    const existing = acc[key];
    if (existing) {
      existing.amount += p.contractCost;
    } else {
      acc[key] = { amount: p.contractCost, sourceOfFund: p.sourceOfFund };
    }
    return acc;
  }, {});

  const subEntries: SubEntry[] = Object.entries(bySubTypeMap).map(
    ([key, v]) => {
      const isNone = key.startsWith("__NONE__:");
      const label = isNone
        ? "Uncategorized"
        : (PROJECT_SUB_TYPE_LABEL[key as ProjectSubTypeValue] ?? key);
      const color = isNone
        ? (FUND_SOURCE_COLORS[v.sourceOfFund] ?? "#6B7280")
        : (SUB_TYPE_COLORS[key as ProjectSubTypeValue] ?? "#6B7280");
      return {
        key,
        label,
        amount: v.amount,
        color,
        sourceOfFund: v.sourceOfFund,
      };
    },
  );

  const sortedSubs = subEntries.slice().sort((a, b) => b.amount - a.amount);

  const orderedSources = SOURCE_OF_FUND_ORDER.filter(
    (s) => (bySource[s] ?? 0) > 0,
  );

  const groupedBreakdown = orderedSources.map((sourceKey) => {
    const sourceAmount = bySource[sourceKey] ?? 0;
    const subs = subEntries
      .filter((e) => e.sourceOfFund === sourceKey)
      .sort((a, b) => b.amount - a.amount);
    return { sourceKey, sourceAmount, subs };
  });

  // Execution rate — average progress across all projects
  const executionRate =
    cardYearProjects.length > 0
      ? cardYearProjects.reduce(
          (sum, p) =>
            sum + Math.max(0, Math.min(100, p.completionPercentage ?? 0)),
          0,
        ) / cardYearProjects.length
      : 0;

  // Build donut segments from sub-categories
  let cumulativeLen = 0;
  const donutSegments = sortedSubs.map((item) => {
    const fraction = totalAllocation > 0 ? item.amount / totalAllocation : 0;
    const dashLength = fraction * DONUT_CIRCUMFERENCE;
    const seg = { ...item, dashLength, dashOffset: -cumulativeLen };
    cumulativeLen += dashLength;
    return seg;
  });
  // --- end Financial Overview computations ---

  const availableYears = Array.from(
    new Set(
      (projects ?? []).map(
        (p) =>
          p.budgetYear ??
          new Date(p.createdAt).getFullYear().toString(),
      ),
    ),
  ).sort((a, b) => Number(b) - Number(a));

  const availableCities = Array.from(
    new Set(
      (projects ?? [])
        .map((p) => p.cityMunicipality)
        .filter((v): v is string => !!v),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const availableBarangays = Array.from(
    new Set(
      (projects ?? [])
        .filter((p) => !cityFilter || p.cityMunicipality === cityFilter)
        .map((p) => p.barangay)
        .filter((v): v is string => !!v),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const filtered = (projects ?? []).filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.projectCode.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      (p.cityMunicipality ?? "").toLowerCase().includes(q) ||
      (p.barangay ?? "").toLowerCase().includes(q);
    const matchDistrict = !districtFilter || p.locationImplementation === districtFilter;
    const matchMode = !modeFilter || p.modeOfImplementation === modeFilter;
    const matchSource = !sourceFilter || p.sourceOfFund === sourceFilter;
    const matchSubType = !subTypeFilter || p.subType === subTypeFilter;
    const matchCity = !cityFilter || p.cityMunicipality === cityFilter;
    const matchBarangay = !barangayFilter || p.barangay === barangayFilter;
    const matchStatus = !statusFilter || p.status === statusFilter;
    const projectYear =
      p.budgetYear ?? new Date(p.createdAt).getFullYear().toString();
    const matchYear = !yearFilter || projectYear === yearFilter;
    return (
      matchSearch &&
      matchDistrict &&
      matchMode &&
      matchSource &&
      matchSubType &&
      matchCity &&
      matchBarangay &&
      matchStatus &&
      matchYear
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetPage = () => setPage(1);

  const hasActiveFilters = !!(
    search ||
    districtFilter ||
    modeFilter ||
    sourceFilter ||
    subTypeFilter ||
    cityFilter ||
    barangayFilter ||
    statusFilter ||
    yearFilter
  );

  const clearFilters = () => {
    setSearch("");
    setDistrictFilter("");
    setModeFilter("");
    setSourceFilter("");
    setSubTypeFilter("");
    setCityFilter("");
    setBarangayFilter("");
    setStatusFilter("");
    setYearFilter("");
    resetPage();
  };

  const handlePrint = () => window.print();

  const handleExport = () => {
    const headers = ["Project ID", "Project Name", "Contract Cost", "District", "Mode", "Status"];
    const rows = filtered.map((p) => [
      p.projectCode,
      `"${p.title.replace(/"/g, '""')}"`,
      p.contractCost.toFixed(2),
      p.locationImplementation === "DISTRICT_I" ? "District 1" : "District 2",
      p.modeOfImplementation === "BY_CONTRACT" ? "By Contract" : "By Administration",
      STATUS_STYLES[p.status]?.label ?? p.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "projects-data-list.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Project Cards Year Filter */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Project Cards Overview</p>
            <p className="text-xs text-gray-500">
              {cardYearFilter
                ? `Showing statistics for ${cardYearFilter}`
                : "Showing statistics across all years"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="card-year-filter" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Filter by Year
          </label>
          <div className="relative">
            <select
              id="card-year-filter"
              value={cardYearFilter}
              onChange={(e) => setCardYearFilter(e.target.value)}
              className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-9 text-sm font-medium text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Years</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
          {cardYearFilter && (
            <button
              onClick={() => setCardYearFilter("")}
              className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* Budget Year */}
        <div className="flex flex-col gap-1 rounded-xl bg-linear-to-br from-blue-600 to-blue-700 p-4 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide opacity-80">Budget Year</span>
            <svg className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
          <span className="text-2xl font-bold">{cardYearFilter || budgetYear}</span>
        </div>

        {/* Completed */}
        <div className="flex flex-col gap-1 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 p-4 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide opacity-80">Completed</span>
            <svg className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <span className="text-2xl font-bold">{cardStats.completed}</span>
          <span className="text-xs opacity-70">Projects</span>
        </div>

        {/* On-Going */}
        <div className="flex flex-col gap-1 rounded-xl bg-linear-to-br from-sky-500 to-sky-600 p-4 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide opacity-80">On-Going</span>
            <svg className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="text-2xl font-bold">{cardStats.ongoing}</span>
          <span className="text-xs opacity-70">Projects</span>
        </div>

        {/* For Implementation */}
        <div className="flex flex-col gap-1 rounded-xl bg-linear-to-br from-amber-400 to-amber-500 p-4 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide opacity-80">For Implementation</span>
            <svg className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <span className="text-2xl font-bold">{cardStats.notYetStarted}</span>
          <span className="text-xs opacity-70">Projects</span>
        </div>

        {/* Suspended */}
        <div className="flex flex-col gap-1 rounded-xl bg-linear-to-br from-red-500 to-red-600 p-4 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide opacity-80">Suspended</span>
            <svg className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <span className="text-2xl font-bold">{cardStats.suspended}</span>
          <span className="text-xs opacity-70">Projects</span>
        </div>

        {/* No Allotted */}
        <div className="flex flex-col gap-1 rounded-xl bg-linear-to-br from-gray-600 to-gray-700 p-4 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide opacity-80">No Allotted</span>
            <svg className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <span className="text-2xl font-bold">{noAllotted}</span>
          <span className="text-xs opacity-70">Projects</span>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Financial Overview
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {cardYearFilter
                ? `Aggregated project funding for ${cardYearFilter}`
                : "Aggregated project funding across all years"}
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export Fiscal Report
          </button>
        </div>

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-3">
          {/* Left — Donut + Execution Rate */}
          <div className="flex flex-col items-center justify-center gap-4 border-b border-gray-100 px-6 py-6 lg:border-b-0 lg:border-r">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Total Annual Allocation
            </p>

            {/* Donut chart */}
            <div className="relative">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <g transform="rotate(-90 70 70)">
                  {/* Background circle */}
                  <circle cx="70" cy="70" r={DONUT_RADIUS} fill="none" stroke="#F3F4F6" strokeWidth="20" />
                  {/* Segments */}
                  {donutSegments.map((seg) => (
                    <circle
                      key={seg.key}
                      cx="70"
                      cy="70"
                      r={DONUT_RADIUS}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="20"
                      strokeDasharray={`${seg.dashLength} ${DONUT_CIRCUMFERENCE}`}
                      strokeDashoffset={seg.dashOffset}
                    />
                  ))}
                </g>
              </svg>
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-gray-900">
                  {formatPeso(totalAllocation)}
                </span>
                <span className="text-xs text-gray-400">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
              {donutSegments.slice(0, 6).map((seg) => (
                <div key={seg.key} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: seg.color }} />
                  <span className="text-xs text-gray-600">{seg.label}</span>
                </div>
              ))}
              {donutSegments.length > 6 && (
                <span className="text-xs text-gray-400">
                  +{donutSegments.length - 6} more
                </span>
              )}
            </div>

            {/* Execution Rate */}
            <div className="w-full rounded-lg bg-gray-50 px-4 py-3">
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Execution Rate
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Average progress across all projects
                    {cardYearFilter ? ` (${cardYearFilter})` : ""}
                  </span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  {Math.min(100, Math.max(0, executionRate)).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{
                    width: `${Math.min(100, Math.max(0, executionRate))}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right — Source of Funds Breakdown (grouped by sub-category) */}
          <div className="col-span-2 px-6 py-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Source of Funds Breakdown
            </p>
            {isLoading ? (
              <div className="flex h-32 items-center justify-center text-sm text-gray-400">Loading...</div>
            ) : groupedBreakdown.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-gray-400">No data available</div>
            ) : (
              <div className="grid max-h-96 grid-cols-1 gap-3 overflow-y-auto pr-1 md:grid-cols-2">
                {groupedBreakdown.map(({ sourceKey, sourceAmount, subs }) => {
                  const sourcePct = totalAllocation > 0
                    ? (sourceAmount / totalAllocation) * 100
                    : 0;
                  return (
                    <div
                      key={sourceKey}
                      className="rounded-lg border border-gray-100 bg-gray-50/60 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: FUND_SOURCE_COLORS[sourceKey] ?? "#6B7280" }}
                          />
                          <span className="truncate text-sm font-semibold text-gray-700">
                            {FUND_SOURCE_LABELS[sourceKey] ?? sourceKey}
                          </span>
                        </div>
                        <div className="ml-3 shrink-0 text-right">
                          <p className="text-sm font-bold text-gray-900">
                            ₱{sourceAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-[10px] text-gray-400">{sourcePct.toFixed(1)}%</p>
                        </div>
                      </div>
                      {subs.length > 0 && (
                        <div className="flex flex-col gap-1 border-t border-gray-100 pl-3.5 pt-2">
                          {subs.map((s) => {
                            const pct = totalAllocation > 0
                              ? (s.amount / totalAllocation) * 100
                              : 0;
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
                                    ₱{s.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                  </span>
                                  <span className="ml-1.5 text-[10px] text-gray-400">
                                    {pct.toFixed(1)}%
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
            <div className="mt-4 flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
              <span className="text-sm font-semibold text-blue-700">Grand Total Combined Allocation</span>
              <span className="text-base font-bold text-blue-800">
                ₱{totalAllocation.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Table Header — title + inline filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-5 py-4">
          {/* Title */}
          <div className="mr-2 shrink-0">
            <h2 className="text-base font-bold text-gray-900">Project Data List</h2>
            <p className="text-xs text-gray-400">Manage Projects</p>
          </div>

          {/* Search */}
          <div className="relative min-w-55 flex-1">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search by Project Title, Tracking Number, City, or Barangay....."
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* District */}
          <div className="relative shrink-0">
            <select
              value={districtFilter}
              onChange={(e) => { setDistrictFilter(e.target.value); resetPage(); }}
              className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">District</option>
              <option value="DISTRICT_I">District 1</option>
              <option value="DISTRICT_II">District 2</option>
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {/* Mode of Implementation */}
          <div className="relative shrink-0">
            <select
              value={modeFilter}
              onChange={(e) => { setModeFilter(e.target.value); resetPage(); }}
              className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Mode of Implementation</option>
              <option value="BY_CONTRACT">By Contract</option>
              <option value="BY_ADMINISTRATION">By Administration</option>
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {/* Source of Fund */}
          <div className="relative shrink-0">
            <select
              value={sourceFilter}
              onChange={(e) => { setSourceFilter(e.target.value); resetPage(); }}
              className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Source of Fund</option>
              {Object.entries(FUND_SOURCE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {/* Sub-Category */}
          <div className="relative shrink-0">
            <select
              value={subTypeFilter}
              onChange={(e) => { setSubTypeFilter(e.target.value); resetPage(); }}
              className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sub-Category</option>
              {Object.entries(PROJECT_SUBTYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {/* City/Municipality */}
          <div className="relative shrink-0">
            <select
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setBarangayFilter("");
                resetPage();
              }}
              className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">City/Municipality</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {/* Barangay */}
          <div className="relative shrink-0">
            <select
              value={barangayFilter}
              onChange={(e) => { setBarangayFilter(e.target.value); resetPage(); }}
              disabled={availableBarangays.length === 0}
              className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Barangay</option>
              {availableBarangays.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {/* Status */}
          <div className="relative shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); resetPage(); }}
              className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Status</option>
              <option value="NOT_YET_STARTED">Not Started</option>
              <option value="ON_GOING">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {/* Year */}
          <div className="relative shrink-0">
            <select
              value={yearFilter}
              onChange={(e) => { setYearFilter(e.target.value); resetPage(); }}
              className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Year</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
            </svg>
            Print
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Project Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Project Cost
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                District
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Mode of Implementation
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Source of Fund
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Sub-Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                City/Municipality
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Barangay
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Year
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={11} className="py-16 text-center text-sm text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="h-8 w-8 animate-spin text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span>Loading projects...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-16 text-center text-sm text-gray-400">
                  No projects found.
                </td>
              </tr>
            ) : (
              paginated.map((project) => {
                const style =
                  STATUS_STYLES[project.status] ?? STATUS_STYLES.NOT_YET_STARTED!;
                const projectYear =
                  project.budgetYear ??
                  new Date(project.createdAt).getFullYear().toString();
                return (
                  <tr key={project.id} className="transition hover:bg-gray-50">
                    <td className="max-w-xs px-4 py-3 font-medium text-gray-900">
                      <span className="line-clamp-2">{project.title}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      ₱{project.projectCost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {project.locationImplementation === "DISTRICT_I" ? "District 1" : "District 2"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {project.modeOfImplementation === "BY_CONTRACT" ? "By Contract" : "By Administration"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {FUND_SOURCE_LABELS[project.sourceOfFund] ?? project.sourceOfFund}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {project.subType
                        ? (PROJECT_SUBTYPE_LABELS[project.subType] ?? project.subType)
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {project.cityMunicipality ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {project.barangay ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {style.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{projectYear}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          router.push(
                            `/super-admin/projects-data-list/${project.id}?id=${userId}`,
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"
                          />
                        </svg>
                        Override
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <p className="text-xs text-gray-500">
            {filtered.length === 0 ? (
              "No results"
            ) : (
              <>
                Showing <span className="font-bold">{(safePage - 1) * PAGE_SIZE + 1}</span> to{" "}
                <span className="font-bold">{Math.min(safePage * PAGE_SIZE, filtered.length)}</span> of{" "}
                <span className="font-bold">{filtered.length}</span> results
              </>
            )}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition ${
                  p === safePage
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
