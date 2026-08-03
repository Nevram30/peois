"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { GenerateReportModal } from "~/app/_components/generate-report-modal";
import {
  PROJECT_SUB_TYPE_LABEL,
  PROJECT_SUB_TYPE_VALUES,
  SOURCE_OF_FUND_LABEL,
  SOURCE_OF_FUND_ORDER,
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_ORDER,
  SOURCE_TO_SUB_TYPES,
  type SourceOfFundValue,
  type ProjectSubTypeValue,
  type ProjectStatusValue,
} from "~/lib/fund-constants";

const STATUS_STYLES: Record<ProjectStatusValue, { bg: string; dot: string; text: string }> = {
  COMPLETED: { bg: "bg-green-100", dot: "bg-green-500", text: "text-green-700" },
  SUSPENDED: { bg: "bg-red-100", dot: "bg-red-500", text: "text-red-700" },
  FOR_IMPLEMENTATION: { bg: "bg-amber-100", dot: "bg-amber-500", text: "text-amber-700" },
  ON_GOING: { bg: "bg-orange-100", dot: "bg-orange-500", text: "text-orange-700" },
  RE_ALIGNMENT: { bg: "bg-purple-100", dot: "bg-purple-500", text: "text-purple-700" },
  OTHERS: { bg: "bg-slate-100", dot: "bg-slate-500", text: "text-slate-700" },
  NOT_YET_STARTED: { bg: "bg-sky-100", dot: "bg-sky-500", text: "text-sky-700" },
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
  REPAIR_PROV_ROADS_DISTRICT_I: "#1D4ED8",
  REPAIR_PROV_ROADS_DISTRICT_II: "#B45309",
  ROAD_OPENING: "#BE123C",
  PRDP_PROVINCIAL_COUNTERPART: "#4338CA",
  BARANGAY_PROJECTS_DISTRICT_I: "#15803D",
  BARANGAY_PROJECTS_DISTRICT_II: "#C2410C",
  STIMULUS_BARANGAYS_DISTRICT_I: "#7E22CE",
  STIMULUS_BARANGAYS_DISTRICT_II: "#0F766E",
  CONFLICT_INSURGENCY_ANTI_TERRORISM: "#B91C1C",
  ANTI_CRIMINALITY_LAWLESSNESS: "#334155",
  FLOOD_CONTROL_SLOPE_PROTECTION_MOOE: "#0369A1",
  FLOOD_CONTROL_SLOPE_PROTECTION_PPE: "#0284C7",
  DRR_CCA_PROMOTION_AWARENESS_ADVOCACY: "#CA8A04",
  BUILDING_BACK_BETTER: "#16A34A",
  QUICK_RESPONSE_FUND: "#EA580C",
  CONST_CHILD_DEV_CENTERS: "#DB2777",
  CONST_IMPVT_COMPL_SCHOOL_BLDGS: "#9333EA",
  CONSTRUCTION_SCHOOL_BUILDINGS: "#2DD4BF",
  CONSTRUCTION_SCHOOL_BUILDINGS_FACILITIES: "#F43F5E",
  REPAIR_MAINT_BUILDINGS_STRUCTURES: "#84CC16",
  OTHER_MAINT_OPERATING_EXPENSES: "#64748B",
};

function formatPeso(value: number): string {
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

  const visible = segments.filter((s) => s.value > 0);
  const sumValue = visible.reduce((sum, s) => sum + s.value, 0);
  const minFraction = visible.length > 1 ? 0.02 : 0;
  const rawFractions = visible.map((s) =>
    sumValue > 0 ? s.value / sumValue : 0,
  );
  const flooredFractions = rawFractions.map((f) => Math.max(f, minFraction));
  const flooredSum = flooredFractions.reduce((a, b) => a + b, 0) || 1;
  const fractions = flooredFractions.map((f) => f / flooredSum);

  let cumulativeLen = 0;
  const arcs = visible.map((seg, i) => {
    const dashLength = fractions[i]! * circumference;
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
  const [cardYearFilter, setCardYearFilter] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const utils = api.useUtils();
  const { data: projects, isLoading } = api.project.getAll.useQuery();
  const statsInput = cardYearFilter ? { budgetYear: cardYearFilter } : undefined;
  const { data: stats } = api.project.getStats.useQuery(statsInput);
  const { data: financial } = api.project.getFinancialOverview.useQuery(statsInput);
  const { data: budgetYears } = api.project.getBudgetYears.useQuery();

  const deleteProject = api.project.delete.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
      void utils.project.getStats.invalidate();
      void utils.project.getFinancialOverview.invalidate();
      void utils.project.getBudgetYears.invalidate();
      setDeleteTarget(null);
      setDeleteError(null);
    },
    onError: (err) => {
      setDeleteError(err.message ?? "Failed to delete project.");
    },
  });

  const availableYears = budgetYears ?? [];

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

  const subTypeOptions = sourceFilter
    ? (SOURCE_TO_SUB_TYPES[sourceFilter as SourceOfFundValue] ?? [])
    : PROJECT_SUB_TYPE_VALUES;

  const selectClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

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
    const matchYear = !cardYearFilter || p.budgetYear === cardYearFilter;
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
    cardYearFilter
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
    setCardYearFilter("");
    resetPage();
  };

  return (
    <>
      {/* Project Cards Year Filter */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-gray-200 bg-white px-5 py-3 shadow-sm">
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
            Filter by Budget Year
          </label>
          <div className="relative">
            <select
              id="card-year-filter"
              value={cardYearFilter}
              onChange={(e) => { setCardYearFilter(e.target.value); resetPage(); }}
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

      {/* Colored Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 xl:grid-cols-8">
        {/* Budget Year */}
        <div className="flex flex-col rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Budget Year
            </span>
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none text-gray-900">
            {financial?.budgetYear ?? new Date().getFullYear()}
          </p>
        </div>

        {/* Number of Projects */}
        <div className="flex flex-col rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">No. of Projects</span>
            <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none text-gray-900">{stats?.total ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">Projects</p>
        </div>

        {/* Completed */}
        <div className="flex flex-col rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Completed</span>
            <svg className="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none text-gray-900">{stats?.completed ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">Projects</p>
        </div>

        {/* Suspended */}
        <div className="flex flex-col rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Suspended</span>
            <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none text-gray-900">{stats?.suspended ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">Projects</p>
        </div>

        {/* For Implementation */}
        <div className="flex flex-col rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">For Implementation</span>
            <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none text-gray-900">{stats?.forImplementation ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">Projects</p>
        </div>

        {/* On-Going */}
        <div className="flex flex-col rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">On-going</span>
            <svg className="h-4 w-4 text-orange-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none text-gray-900">{stats?.ongoing ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">Projects</p>
        </div>

        {/* Re-alignment */}
        <div className="flex flex-col rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Re-alignment</span>
            <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none text-gray-900">{stats?.reAlignment ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">Projects</p>
        </div>

        {/* Others */}
        <div className="flex flex-col rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Others</span>
            <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none text-gray-900">{stats?.others ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">Projects</p>
        </div>

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
              ? (FUND_SOURCE_COLORS[v.sourceOfFund] ?? "#94a3b8")
              : (SUB_TYPE_COLORS[key as ProjectSubTypeValue] ?? "#94a3b8");
            return {
              key,
              label,
              value: v.amount,
              color,
              sourceOfFund: v.sourceOfFund,
            };
          });

        const orderedSources = SOURCE_OF_FUND_ORDER.filter(
          (s) => (bySource[s] ?? 0) > 0,
        );

        const segments = orderedSources
          .map((sourceKey) => ({
            label: FUND_SOURCE_LABELS[sourceKey] ?? sourceKey,
            value: bySource[sourceKey] ?? 0,
            color: FUND_SOURCE_COLORS[sourceKey] ?? "#94a3b8",
          }))
          .sort((a, b) => b.value - a.value);

        const groupedBreakdown = orderedSources.map((sourceKey) => {
          const sourceAmount = bySource[sourceKey] ?? 0;
          const subs = subEntries
            .filter((e) => e.sourceOfFund === sourceKey)
            .sort((a, b) => b.value - a.value);
          return { sourceKey, sourceAmount, subs };
        });

        return (
          <div className="mb-8 rounded-sm border border-gray-100 bg-white shadow-sm">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6">
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
                        FUND_SOURCE_LABELS[g.sourceKey] ?? g.sourceKey,
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
                {/* Legend (by Source of Fund) */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                  {groupedBreakdown.slice(0, 8).map((g) => (
                    <span key={g.sourceKey} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: FUND_SOURCE_COLORS[g.sourceKey] ?? "#94a3b8" }}
                      />
                      {FUND_SOURCE_LABELS[g.sourceKey] ?? g.sourceKey}
                    </span>
                  ))}
                  {groupedBreakdown.length > 8 && (
                    <span className="text-xs text-gray-400">
                      +{groupedBreakdown.length - 8} more
                    </span>
                  )}
                  {groupedBreakdown.length === 0 && (
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
                                style={{ backgroundColor: FUND_SOURCE_COLORS[sourceKey] ?? "#94a3b8" }}
                              />
                              <span className="text-xs font-semibold text-gray-700">
                                {FUND_SOURCE_LABELS[sourceKey] ?? sourceKey}
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

      {/* Filter bar */}
      <div className="mb-4 rounded-sm border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9">
          {/* Mode */}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Mode
            </p>
            <select
              value={modeFilter}
              onChange={(e) => { setModeFilter(e.target.value); resetPage(); }}
              className={selectClass}
            >
              <option value="">All Modes</option>
              <option value="BY_ADMINISTRATION">By Administration</option>
              <option value="BY_CONTRACT">By Contract</option>
            </select>
          </div>

          {/* Source of Fund */}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Source of Fund
            </p>
            <select
              value={sourceFilter}
              onChange={(e) => { setSourceFilter(e.target.value); setSubTypeFilter(""); resetPage(); }}
              className={selectClass}
            >
              <option value="">All</option>
              {SOURCE_OF_FUND_ORDER.map((k) => (
                <option key={k} value={k}>{SOURCE_OF_FUND_LABEL[k]}</option>
              ))}
            </select>
          </div>

          {/* Sub-Category */}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Sub-Category
            </p>
            <select
              value={subTypeFilter}
              onChange={(e) => { setSubTypeFilter(e.target.value); resetPage(); }}
              disabled={!!sourceFilter && subTypeOptions.length === 0}
              className={`${selectClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}
            >
              <option value="">
                {sourceFilter && subTypeOptions.length === 0 ? "None" : "All"}
              </option>
              {subTypeOptions.map((k) => (
                <option key={k} value={k}>{PROJECT_SUB_TYPE_LABEL[k]}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              District
            </p>
            <select
              value={districtFilter}
              onChange={(e) => { setDistrictFilter(e.target.value); resetPage(); }}
              className={selectClass}
            >
              <option value="">All</option>
              <option value="DISTRICT_I">District I</option>
              <option value="DISTRICT_II">District II</option>
            </select>
          </div>

          {/* City / Municipality */}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              City/Municipality
            </p>
            <select
              value={cityFilter}
              onChange={(e) => { setCityFilter(e.target.value); setBarangayFilter(""); resetPage(); }}
              className={selectClass}
            >
              <option value="">All Cities</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Barangay */}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Barangay
            </p>
            <select
              value={barangayFilter}
              onChange={(e) => { setBarangayFilter(e.target.value); resetPage(); }}
              disabled={availableBarangays.length === 0}
              className={`${selectClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}
            >
              <option value="">All</option>
              {availableBarangays.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Status
            </p>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); resetPage(); }}
              className={selectClass}
            >
              <option value="">All Status</option>
              {PROJECT_STATUS_ORDER.map((s) => (
                <option key={s} value={s}>{PROJECT_STATUS_LABEL[s]}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Year
            </p>
            <select
              value={cardYearFilter}
              onChange={(e) => { setCardYearFilter(e.target.value); resetPage(); }}
              className={selectClass}
            >
              <option value="">All Years</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="flex w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-red-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
        {/* Table Header — title + inline filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-5 py-4">
          {/* Title */}
          {/* <div className="mr-2 shrink-0">
            <h2 className="text-base font-bold text-gray-900">Project Data List</h2>
            <p className="text-xs text-gray-400">Manage Projects</p>
          </div> */}

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

          {/* Generate Report */}
          <button
            onClick={() => setReportModalOpen(true)}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm-3 12h6m-6 3h3" />
            </svg>
            Generate Report
          </button>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full min-w-250 text-sm">
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
                Source / Sub-Category
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
                Budget Year
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={10} className="py-16 text-center text-sm text-gray-400">
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
                <td colSpan={10} className="py-16 text-center text-sm text-gray-400">
                  No projects found.
                </td>
              </tr>
            ) : (
              paginated.map((project) => {
                const style =
                  STATUS_STYLES[project.status as ProjectStatusValue] ??
                  STATUS_STYLES.NOT_YET_STARTED;
                const statusLabel =
                  PROJECT_STATUS_LABEL[project.status as ProjectStatusValue] ??
                  project.status;
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
                      <p>{FUND_SOURCE_LABELS[project.sourceOfFund] ?? project.sourceOfFund}</p>
                      {project.subType && (
                        <p className="text-xs text-gray-400">
                          {PROJECT_SUBTYPE_LABELS[project.subType] ?? project.subType}
                        </p>
                      )}
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
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{project.budgetYear ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/super-admin/projects-data-list/${project.id}?id=${userId}`,
                            )
                          }
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700"
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
                        <button
                          onClick={() => {
                            setDeleteTarget({ id: project.id, title: project.title });
                            setDeleteError(null);
                          }}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
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
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
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
          <div className="flex flex-wrap items-center gap-1">
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
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition ${p === safePage
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

      <GenerateReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        projects={filtered}
        fileName="projects-data-list-report"
        reportTitle="Projects Data List Report"
      />

      <DeleteProjectConfirmModal
        open={!!deleteTarget}
        projectTitle={deleteTarget?.title}
        error={deleteError}
        isDeleting={deleteProject.isPending}
        onCancel={() => {
          if (deleteProject.isPending) return;
          setDeleteTarget(null);
          setDeleteError(null);
        }}
        onConfirm={() => {
          if (deleteTarget) deleteProject.mutate({ id: deleteTarget.id });
        }}
      />
    </>
  );
}

function DeleteProjectConfirmModal({
  open,
  projectTitle,
  error,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  projectTitle?: string;
  error: string | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start gap-4 px-6 pt-6 pb-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">Delete Project</h3>
            <p className="mt-1 text-sm text-gray-600">
              Are you sure you want to delete
              {projectTitle ? (
                <>
                  {" "}
                  <span className="font-semibold text-gray-900">{projectTitle}</span>
                </>
              ) : (
                " this project"
              )}
              ? This action cannot be undone and all associated data will be permanently removed.
            </p>
          </div>
        </div>

        {error && (
          <div className="mx-6 mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting && (
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {isDeleting ? "Deleting..." : "Delete Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
