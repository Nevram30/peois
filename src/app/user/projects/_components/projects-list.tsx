"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { formatPeso } from "~/helper/formatter";
import {
  SOURCE_OF_FUND_LABEL,
  SOURCE_OF_FUND_ORDER,
  PROJECT_SUB_TYPE_LABEL,
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_ORDER,
  SOURCE_TO_SUB_TYPES,
  FUNDING_PROGRAM_LABEL,
  SOURCE_TO_PROGRAMS,
  builtInProjectsFor,
  type SourceOfFundValue,
} from "~/lib/fund-constants";
import { projectLabel } from "~/lib/funding-options";

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  NOT_YET_STARTED: {
    label: "PENDING",
    className: "bg-amber-100 text-amber-700",
  },
  ON_GOING: { label: "ON-GOING", className: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "COMPLETED", className: "bg-emerald-100 text-emerald-700" },
  SUSPENDED: { label: "SUSPENDED", className: "bg-red-100 text-red-700" },
  FOR_IMPLEMENTATION: {
    label: "FOR IMPLEMENTATION",
    className: "bg-orange-100 text-orange-700",
  },
  IN_PROCUREMENT: {
    label: "IN PROCUREMENT",
    className: "bg-teal-100 text-teal-700",
  },
  FOR_SURVEY: { label: "FOR SURVEY", className: "bg-fuchsia-100 text-fuchsia-700" },
  FOR_PLANS: { label: "FOR PLANS", className: "bg-indigo-100 text-indigo-700" },
  FOR_POW: { label: "FOR POW", className: "bg-cyan-100 text-cyan-700" },
  FOR_PLANS_AND_POW: { label: "FOR PLANS & POW", className: "bg-pink-100 text-pink-700" },
  FOR_DETERMINATION: { label: "FOR DETERMINATION", className: "bg-lime-100 text-lime-700" },
  RE_ALIGNMENT: {
    label: "RE-ALIGNED",
    className: "bg-purple-100 text-purple-700",
  },
  OTHERS: { label: "OTHERS", className: "bg-slate-100 text-slate-600" },
};

const DISTRICT_LABELS: Record<string, string> = {
  DISTRICT_I: "1st District",
  DISTRICT_II: "2nd District",
};

const MODE_LABELS: Record<string, string> = {
  BY_ADMINISTRATION: "By Administration",
  BY_CONTRACT: "By Contract",
  UNASSIGNED_FOR_DETERMINATION: "Unassigned - For Determination",
};

const progressBarColor = (status: string, pct: number) => {
  if (status === "SUSPENDED") return "bg-red-500";
  if (pct >= 100) return "bg-emerald-500";
  if (
    ["NOT_YET_STARTED", "FOR_SURVEY", "FOR_PLANS", "FOR_POW", "FOR_PLANS_AND_POW", "FOR_DETERMINATION", "IN_PROCUREMENT", "FOR_IMPLEMENTATION"].includes(status)
  )
    return "bg-amber-400";
  return "bg-blue-900";
};

type ProjectRow = RouterOutputs["project"]["getAll"][number];

const StatusBadge = ({ status }: { status: string }) => {
  const badge = STATUS_BADGES[status] ?? {
    label: status.replace(/_/g, " "),
    className: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}

const ContributorAvatars = ({ project }: { project: ProjectRow }) => {
  const seen = new Set<string>();
  const contributors: { id: string; name: string | null; email: string; image: string | null }[] = [];
  const allUsers = [project.createdBy, ...project.activities.map((a) => a.createdBy)];
  for (const u of allUsers) {
    if (!seen.has(u.id)) {
      seen.add(u.id);
      contributors.push(u);
    }
  }
  const MAX_SHOW = 4;
  const visible = contributors.slice(0, MAX_SHOW);
  const extra = contributors.length - MAX_SHOW;
  const colors = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-orange-500"];
  return (
    <div className="flex items-center">
      {visible.map((u, i) => {
        const initials = (u.name ?? u.email)
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        return (
          <div
            key={u.id}
            style={{ zIndex: visible.length - i, marginLeft: i === 0 ? 0 : "-8px" }}
            className={`group relative flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-white text-white text-[10px] font-bold cursor-default ${colors[i % colors.length]}`}
          >
            {u.image ? (
              <img src={u.image} alt={u.name ?? u.email} className="h-full w-full rounded-full object-cover" />
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
}

// ── Stat cards (top summary row) ────────────────────────────────
type StatCardDef = {
  label: string;
  value: string | number;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
};

const StatCards = ({
  budgetYearLabel,
  stats,
  loading,
}: {
  budgetYearLabel: string;
  stats:
  | {
    completed: number;
    ongoing: number;
    forImplementation: number;
    suspended: number;
    reAlignment: number;
    others: number;
  }
  | undefined;
  loading: boolean;
}) => {
  const cards: StatCardDef[] = [
    {
      label: "Budget Year",
      value: budgetYearLabel,
      borderColor: "border-indigo-600",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
      ),
    },
    {
      label: "Completed",
      value: stats?.completed ?? 0,
      borderColor: "border-emerald-500",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
        </svg>
      ),
    },
    {
      label: "On-Going",
      value: stats?.ongoing ?? 0,
      borderColor: "border-blue-900",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-800",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
        </svg>
      ),
    },
    {
      label: "Implementation",
      value: stats?.forImplementation ?? 0,
      borderColor: "border-amber-500",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      ),
    },
    {
      label: "Suspended",
      value: stats?.suspended ?? 0,
      borderColor: "border-red-700",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      label: "Re-Aligned",
      value: stats?.reAlignment ?? 0,
      borderColor: "border-slate-400",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      ),
    },
    {
      label: "Others",
      value: stats?.others ?? 0,
      borderColor: "border-slate-600",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-500",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
      {cards.map((c) => (
        <div
          key={c.label}
          className="flex items-center gap-3 rounded-sm bg-white p-4 shadow-sm"
        >
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${c.iconBg} ${c.iconColor}`}>
            {c.icon}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              {c.label}
            </p>
            {loading && c.label !== "Budget Year" ? (
              <div className="mt-1 h-6 w-10 animate-pulse rounded bg-slate-200" />
            ) : (
              <p className="text-2xl font-extrabold leading-tight text-gray-900">
                {c.value}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main list ───────────────────────────────────────────────────
export const UserProjectsList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilterParam = searchParams.get("status");
  const filterToday = searchParams.get("filter") === "today";

  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [sourceOfFundFilter, setSourceOfFundFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [subTypeFilter, setSubTypeFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [barangayFilter, setBarangayFilter] = useState("");
  const [statusLocal, setStatusLocal] = useState(statusFilterParam ?? "");
  const [yearFilter, setYearFilter] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const { data: projects, isLoading } = api.project.getAll.useQuery();
  const { data: districtScope } = api.project.getMyDistrictScope.useQuery();
  const { data: budgetYears } = api.project.getBudgetYears.useQuery();
  const { data: stats, isLoading: statsLoading } = api.project.getStats.useQuery(
    yearFilter ? { budgetYear: yearFilter } : undefined,
  );

  // Distinct city / barangay options derived from the loaded projects.
  const cityOptions = Array.from(
    new Set(projects?.map((p) => p.cityMunicipality).filter((c): c is string => Boolean(c))),
  ).sort();
  const barangayOptions = Array.from(
    new Set(
      projects
        ?.filter((p) => !cityFilter || p.cityMunicipality === cityFilter)
        .map((p) => p.barangay)
        .filter((b): b is string => Boolean(b)),
    ),
  ).sort();

  const availablePrograms = sourceOfFundFilter
    ? SOURCE_TO_PROGRAMS[sourceOfFundFilter as SourceOfFundValue] ?? []
    : [];

  const availableSubTypes = programFilter
    ? builtInProjectsFor(programFilter, sourceOfFundFilter)
    : sourceOfFundFilter
      ? SOURCE_TO_SUB_TYPES[sourceOfFundFilter as SourceOfFundValue] ?? []
      : [];

  const filtered = projects?.filter((p) => {
    if (filterToday) {
      const today = new Date();
      const created = new Date(p.createdAt);
      if (
        created.getFullYear() !== today.getFullYear() ||
        created.getMonth() !== today.getMonth() ||
        created.getDate() !== today.getDate()
      )
        return false;
    }
    if (statusLocal && p.status !== statusLocal) return false;
    if (modeFilter && p.modeOfImplementation !== modeFilter) return false;
    if (districtFilter && p.locationImplementation !== districtFilter)
      return false;
    if (cityFilter && p.cityMunicipality !== cityFilter) return false;
    if (barangayFilter && p.barangay !== barangayFilter) return false;
    if (sourceOfFundFilter && p.sourceOfFund !== sourceOfFundFilter)
      return false;
    if (programFilter && p.program !== programFilter) return false;
    if (subTypeFilter && p.subType !== subTypeFilter) return false;
    if (yearFilter && p.budgetYear !== yearFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !p.title.toLowerCase().includes(q) &&
        !p.projectCode.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const totalFiltered = filtered?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const paginated = filtered?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Rendered above and below the table so long pages can be paged without
  // scrolling to the bottom; only the divider side differs.
  const renderPagination = (position: "top" | "bottom") => (
    <div
      className={`flex flex-col gap-2 ${position === "top" ? "border-b" : "border-t"
        } border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
        Showing {paginated?.length ?? 0} of {totalFiltered} projects
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="text-xs text-gray-500">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );

  const selectClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  const hasActiveFilters = !!(
    search ||
    modeFilter ||
    sourceOfFundFilter ||
    programFilter ||
    subTypeFilter ||
    districtFilter ||
    cityFilter ||
    barangayFilter ||
    statusLocal ||
    yearFilter
  );

  const clearFilters = () => {
    setSearch("");
    setModeFilter("");
    setSourceOfFundFilter("");
    setProgramFilter("");
    setSubTypeFilter("");
    setDistrictFilter("");
    setCityFilter("");
    setBarangayFilter("");
    setStatusLocal("");
    setYearFilter("");
    setPage(1);
  };

  return (
    <div className="space-y-6 bg-slate-50 px-4 py-6 sm:px-6">
      {/* Summary stat cards */}
      <StatCards
        budgetYearLabel={yearFilter || "All"}
        stats={stats}
        loading={statsLoading}
      />

      {/* Heading */}
      <h2 className="text-lg font-extrabold uppercase tracking-wide text-blue-900">
        Projects
      </h2>

      {/* Filter bar */}
      <div className="rounded-sm border border-gray-200 bg-white px-4 py-4 shadow-sm sm:px-5">
        <div
          className={`grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 ${districtScope ? "xl:grid-cols-11" : "xl:grid-cols-12"}`}
        >
          {/* Project Title */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 xl:col-span-2">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Project Title
            </p>
            <div className="relative">
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
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Mode */}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Mode
            </p>
            <select
              value={modeFilter}
              onChange={(e) => {
                setModeFilter(e.target.value);
                setPage(1);
              }}
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
              value={sourceOfFundFilter}
              onChange={(e) => {
                setSourceOfFundFilter(e.target.value);
                setProgramFilter("");
                setSubTypeFilter("");
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="">All</option>
              {SOURCE_OF_FUND_ORDER.map((k) => (
                <option key={k} value={k}>
                  {SOURCE_OF_FUND_LABEL[k]}
                </option>
              ))}
            </select>
          </div>

          {/* Program */}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Program
            </p>
            <select
              value={programFilter}
              onChange={(e) => {
                setProgramFilter(e.target.value);
                setSubTypeFilter("");
                setPage(1);
              }}
              disabled={!sourceOfFundFilter || availablePrograms.length === 0}
              className={`${selectClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}
            >
              <option value="">
                {sourceOfFundFilter && availablePrograms.length === 0
                  ? "None"
                  : "All"}
              </option>
              {availablePrograms.map((k) => (
                <option key={k} value={k}>
                  {FUNDING_PROGRAM_LABEL[k]}
                </option>
              ))}
            </select>
          </div>

          {/* Project */}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Project
            </p>
            <select
              value={subTypeFilter}
              onChange={(e) => {
                setSubTypeFilter(e.target.value);
                setPage(1);
              }}
              disabled={!sourceOfFundFilter || availableSubTypes.length === 0}
              className={`${selectClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}
            >
              <option value="">
                {(sourceOfFundFilter || programFilter) &&
                availableSubTypes.length === 0
                  ? "None"
                  : "All"}
              </option>
              {availableSubTypes.map((k) => (
                <option key={k} value={k}>
                  {PROJECT_SUB_TYPE_LABEL[k]}
                </option>
              ))}
            </select>
          </div>

          {/* District (hidden when the user's division limits them to one district) */}
          {!districtScope && (
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                District
              </p>
              <select
                value={districtFilter}
                onChange={(e) => {
                  setDistrictFilter(e.target.value);
                  setPage(1);
                }}
                className={selectClass}
              >
                <option value="">All</option>
                <option value="DISTRICT_I">District I</option>
                <option value="DISTRICT_II">District II</option>
              </select>
            </div>
          )}

          {/* City / Municipality */}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              City/Municipality
            </p>
            <select
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setBarangayFilter("");
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="">All Cities</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
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
              onChange={(e) => {
                setBarangayFilter(e.target.value);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="">All</option>
              {barangayOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Status
            </p>
            <select
              value={statusLocal}
              onChange={(e) => {
                setStatusLocal(e.target.value);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="">All Status</option>
              {PROJECT_STATUS_ORDER.map((k) => (
                <option key={k} value={k}>
                  {PROJECT_STATUS_LABEL[k]}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Year
            </p>
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="">All Years</option>
              {budgetYears?.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
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

      {/* Projects table */}
      <div className="rounded-sm border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading projects...
          </div>
        ) : !filtered?.length ? (
          <div className="p-8 text-center text-gray-500">No projects found.</div>
        ) : (
          <>
            {/* Header */}
            {renderPagination("top")}

            {/* Mobile / tablet card list */}
            <div className="divide-y divide-gray-100 lg:hidden">
              {paginated?.map((p) => {
                const pct = p.completionPercentage ?? 0;
                return (
                  <div key={p.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">{p.title}</p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {formatPeso(p.projectCost)}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <StatusBadge status={p.status} />
                      </div>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                          Mode
                        </dt>
                        <dd className="text-gray-600">
                          {MODE_LABELS[p.modeOfImplementation] ??
                            p.modeOfImplementation.replace(/_/g, " ")}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                          Source/Sub
                        </dt>
                        <dd className="text-gray-600">
                          {SOURCE_OF_FUND_LABEL[
                            p.sourceOfFund as SourceOfFundValue
                          ] ?? p.sourceOfFund.replace(/_/g, " ")}
                        </dd>
                        {p.subType && (
                          <dd className="text-xs text-gray-400">
                            {projectLabel(p.subType)}
                          </dd>
                        )}
                      </div>
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                          District
                        </dt>
                        <dd className="text-gray-600">
                          {DISTRICT_LABELS[p.locationImplementation] ??
                            p.locationImplementation.replace(/_/g, " ")}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                          Location
                        </dt>
                        <dd className="text-gray-600">{p.cityMunicipality ?? "—"}</dd>
                        {p.barangay && (
                          <dd className="text-xs text-gray-400">{p.barangay}</dd>
                        )}
                      </div>
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                          Budget Year
                        </dt>
                        <dd className="text-gray-600">{p.budgetYear ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                          Involved Users
                        </dt>
                        <dd>
                          <ContributorAvatars project={p} />
                        </dd>
                      </div>
                    </dl>
                    <div>
                      <p className="mb-1 text-xs font-semibold text-gray-800">
                        Physical Progress: {pct}%
                      </p>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full ${progressBarColor(p.status, pct)}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        router.push(`/user/projects/${p.id}`)
                      }
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-blue-900 transition hover:bg-blue-50"
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
                      View
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-275 text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-400">
                    <th className="px-5 py-4 font-semibold">Project Title & Project Cost</th>
                    <th className="px-4 py-4 font-semibold">Mode</th>
                    <th className="px-4 py-4 font-semibold">Source/Sub</th>
                    <th className="px-4 py-4 font-semibold">District</th>
                    <th className="px-4 py-4 font-semibold">Location</th>
                    <th className="px-4 py-4 font-semibold">Status</th>
                    <th className="px-4 py-4 font-semibold">Budget Year</th>
                    <th className="px-4 py-4 font-semibold">Involved Users</th>
                    <th className="px-4 py-4 font-semibold">
                      Physical Progress
                    </th>
                    <th className="px-4 py-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated?.map((p) => {
                    const pct = p.completionPercentage ?? 0;
                    return (
                      <tr
                        key={p.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                      >
                        <td className="max-w-xs px-5 py-4">
                          <p className="font-semibold text-gray-900">
                            {p.title}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {formatPeso(p.projectCost)}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-gray-600">
                          {MODE_LABELS[p.modeOfImplementation] ??
                            p.modeOfImplementation.replace(/_/g, " ")}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-gray-700">
                            {SOURCE_OF_FUND_LABEL[
                              p.sourceOfFund as SourceOfFundValue
                            ] ?? p.sourceOfFund.replace(/_/g, " ")}
                          </p>
                          {p.subType && (
                            <p className="mt-0.5 text-xs text-gray-400">
                              {projectLabel(p.subType)}
                            </p>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                          {DISTRICT_LABELS[p.locationImplementation] ??
                            p.locationImplementation.replace(/_/g, " ")}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-gray-700">
                            {p.cityMunicipality ?? "—"}
                          </p>
                          {p.barangay && (
                            <p className="mt-0.5 text-xs text-gray-400">
                              {p.barangay}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="px-4 py-4 text-gray-600">
                          {p.budgetYear ?? "—"}
                        </td>
                        <td className="px-4 py-4">
                          <ContributorAvatars project={p} />
                        </td>
                        <td className="px-4 py-4">
                          <p className="mb-1 text-xs font-semibold text-gray-800">
                            {pct}%
                          </p>
                          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className={`h-full rounded-full ${progressBarColor(p.status, pct)}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() =>
                              router.push(`/user/projects/${p.id}`)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-900 transition hover:bg-blue-50"
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
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            {renderPagination("bottom")}
          </>
        )}
      </div>
    </div>
  );
}
