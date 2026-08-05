"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPeso } from "~/helper/formatter";
import { api, type RouterOutputs } from "~/trpc/react";
import { useRouter, useSearchParams } from "next/navigation";
import { GenerateReportModal } from "~/app/_components/generate-report-modal";
import {
  SOURCE_OF_FUND_LABEL,
  SOURCE_OF_FUND_ORDER,
  PROJECT_SUB_TYPE_LABEL,
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_ORDER,
  SOURCE_TO_SUB_TYPES,
  FUNDING_PROGRAM_LABEL,
  SOURCE_TO_PROGRAMS,
  PROGRAM_TO_PROJECTS,
  type SourceOfFundValue,
  type FundingProgramValue,
} from "~/lib/fund-constants";
import { projectLabel } from "~/lib/funding-options";
import { HardHat } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  NOT_YET_STARTED: {
    label: "Not Yet Started",
    className: "bg-sky-100 text-sky-700",
  },
  ON_GOING: { label: "On-going", className: "bg-orange-100 text-orange-700" },
  COMPLETED: {
    label: "Completed",
    className: "bg-green-100 text-green-700",
  },
  SUSPENDED: { label: "Suspended", className: "bg-red-100 text-red-700" },
  FOR_IMPLEMENTATION: {
    label: "For Implementation",
    className: "bg-amber-100 text-amber-700",
  },
  RE_ALIGNMENT: {
    label: "Re-alignment",
    className: "bg-purple-100 text-purple-700",
  },
  OTHERS: {
    label: "Others",
    className: "bg-slate-100 text-slate-700",
  },
};

const STATUS_TITLES: Record<string, string> = {
  COMPLETED: "Completed Projects",
  SUSPENDED: "Suspended Projects",
  FOR_IMPLEMENTATION: "Projects For Implementation",
  ON_GOING: "On-Going Projects",
  RE_ALIGNMENT: "Projects For Re-alignment",
  OTHERS: "Other Projects",
  NOT_YET_STARTED: "Projects Not Yet Started",
  today: "New Projects Today",
};

type ProjectRow = RouterOutputs["project"]["getAll"][number];

const StatusBadge = ({ status }: { status: string }) => {
  const s = STATUS_LABELS[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${s.className}`}
    >
      {s.label}
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

const ProjectProgress = ({
  project,
  barClassName = "w-24",
}: {
  project: ProjectRow;
  barClassName?: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 overflow-hidden rounded-full bg-gray-200 ${barClassName}`}>
        <div
          className={`h-full rounded-full ${project.status === "SUSPENDED" ? "bg-red-500" : (project.completionPercentage ?? 0) >= 100 ? "bg-green-500" : "bg-orange-500"}`}
          style={{ width: `${project.completionPercentage ?? 0}%` }}
        />
      </div>
      <span className="text-xs text-gray-600">
        {project.completionPercentage ?? 0}%
      </span>
    </div>
  );
}

const ProjectActions = ({
  id,
  grow = false,
}: {
  id: ProjectRow["id"];
  grow?: boolean;
}) => {
  const router = useRouter();
  const growClass = grow ? "flex-1" : "";
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => router.push(`/admin/projects/${id}/view`)}
        className={`inline-flex items-center justify-center gap-1.5 rounded-sm bg-blue-500 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-blue-600 ${growClass}`}
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
        View
      </button>
      <button
        onClick={() => router.push(`/admin/projects/${id}`)}
        className={`inline-flex items-center justify-center gap-1.5 rounded-sm bg-green-500 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-green-600 ${growClass}`}
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
        Update
      </button>
    </div>
  );
}

const ProjectsList = () => {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");
  const filterToday = searchParams.get("filter") === "today";

  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [sourceOfFundFilter, setSourceOfFundFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [subTypeFilter, setSubTypeFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [barangayFilter, setBarangayFilter] = useState("");
  const [statusLocal, setStatusLocal] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const availablePrograms = sourceOfFundFilter
    ? SOURCE_TO_PROGRAMS[sourceOfFundFilter as SourceOfFundValue] ?? []
    : [];

  const availableSubTypes = programFilter
    ? PROGRAM_TO_PROJECTS[programFilter as FundingProgramValue] ?? []
    : sourceOfFundFilter
      ? SOURCE_TO_SUB_TYPES[sourceOfFundFilter as SourceOfFundValue] ?? []
      : [];

  const { data: projects, isLoading } = api.project.getAll.useQuery();
  const { data: budgetYears } = api.project.getBudgetYears.useQuery();
  const { data: districtScope } = api.project.getMyDistrictScope.useQuery();

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
    if (statusFilter && p.status !== statusFilter) return false;
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

  const totalPages = Math.max(1, Math.ceil((filtered?.length ?? 0) / PAGE_SIZE));
  const paginated = filtered?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pageTitle =
    filterToday
      ? STATUS_TITLES.today
      : statusFilter
        ? (STATUS_TITLES[statusFilter] ?? "Projects")
        : "All Projects";

  const selectClass =
    "w-full rounded-sms border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

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
    <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 sm:block">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500 sm:mb-4">
            <Link href="/admin/dashboard" className="hover:text-gray-700">
              Dashboard
            </Link>
            <span>/</span>
            <p className="hover:text-gray-700">Projects</p>
          </div>
          <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">{pageTitle}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-72">
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
              placeholder="Project Code or Name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-sm border border-gray-200 py-2.5 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          {(statusFilter ?? filterToday) && (
            <Link
              href="/admin/projects"
              className="grow rounded-sm border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-600 transition hover:bg-gray-50 sm:grow-0"
            >
              Clear Filter
            </Link>
          )}
          <button
            onClick={() => setReportModalOpen(true)}
            className="inline-flex grow cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-sm border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:grow-0"
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
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm-3 12h6m-6 3h3"
              />
            </svg>
            Generate Report
          </button>
          <Link
            href="/admin/projects/new"
            className="grow whitespace-nowrap rounded-sm bg-[#1e3a4f] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#2a4d66] sm:grow-0"
          >
            + Add New Project
          </Link>
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-sm border border-gray-200 bg-white shadow-sm">
        {/* Mobile filter toggle */}
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 lg:hidden"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-blue-500" />
            )}
          </span>
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        <div className={`${filtersOpen ? "block" : "hidden"} border-t border-gray-100 px-4 py-4 sm:px-5 lg:block lg:border-t-0`}>
          <div
            className={`grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 ${districtScope ? "xl:grid-cols-9" : "xl:grid-cols-10"}`}
          >
            {/* Mode */}
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Mode
              </p>
              <select
                value={modeFilter}
                onChange={(e) => { setModeFilter(e.target.value); setPage(1); }}
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
                onChange={(e) => { setSourceOfFundFilter(e.target.value); setProgramFilter(""); setSubTypeFilter(""); setPage(1); }}
                className={selectClass}
              >
                <option value="">All</option>
                {SOURCE_OF_FUND_ORDER.map((k) => (
                  <option key={k} value={k}>{SOURCE_OF_FUND_LABEL[k]}</option>
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
                onChange={(e) => { setProgramFilter(e.target.value); setSubTypeFilter(""); setPage(1); }}
                disabled={!sourceOfFundFilter || availablePrograms.length === 0}
                className={`${selectClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}
              >
                <option value="">
                  {sourceOfFundFilter && availablePrograms.length === 0 ? "None" : "All"}
                </option>
                {availablePrograms.map((k) => (
                  <option key={k} value={k}>{FUNDING_PROGRAM_LABEL[k]}</option>
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
                onChange={(e) => { setSubTypeFilter(e.target.value); setPage(1); }}
                disabled={!sourceOfFundFilter || availableSubTypes.length === 0}
                className={`${selectClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}
              >
                <option value="">
                  {(sourceOfFundFilter || programFilter) && availableSubTypes.length === 0 ? "None" : "All"}
                </option>
                {availableSubTypes.map((k) => (
                  <option key={k} value={k}>{PROJECT_SUB_TYPE_LABEL[k]}</option>
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
                  onChange={(e) => { setDistrictFilter(e.target.value); setPage(1); }}
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
                onChange={(e) => { setCityFilter(e.target.value); setBarangayFilter(""); setPage(1); }}
                className={selectClass}
              >
                <option value="">All Cities</option>
                {cityOptions.map((c) => (
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
                onChange={(e) => { setBarangayFilter(e.target.value); setPage(1); }}
                className={selectClass}
              >
                <option value="">All</option>
                {barangayOptions.map((b) => (
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
                value={statusLocal}
                onChange={(e) => { setStatusLocal(e.target.value); setPage(1); }}
                className={selectClass}
              >
                <option value="">All Status</option>
                {PROJECT_STATUS_ORDER.map((k) => (
                  <option key={k} value={k}>{PROJECT_STATUS_LABEL[k]}</option>
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
                onChange={(e) => { setYearFilter(e.target.value); setPage(1); }}
                className={selectClass}
              >
                <option value="">All Years</option>
                {budgetYears?.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="flex w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-red-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-8 text-center text-gray-500">
            <div className="relative h-12 w-12">
              <svg className="h-12 w-12 animate-spin text-amber-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <HardHat className="absolute inset-0 m-auto h-6 w-6 text-amber-600" />
            </div>
            <span className="text-base">Loading Projects.....</span>
          </div>
        ) : !filtered?.length ? (
          <div className="p-8 text-center text-gray-500">
            No projects found.
          </div>
        ) : (
          <>
            {/* Mobile / tablet card list */}
            <div className="divide-y divide-gray-100 lg:hidden">
              {paginated?.map((p) => (
                <div key={p.id} className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">{p.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {formatPeso(p.projectCost)}
                      </p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                        Mode
                      </dt>
                      <dd className="text-gray-600">
                        {p.modeOfImplementation === "BY_CONTRACT" ? "By Contract" : "By Administration"}
                      </dd>
                      {p.modeOfImplementation === "BY_CONTRACT" && p.contractorName && (
                        <dd className="text-xs text-gray-400">{p.contractorName}</dd>
                      )}
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                        District
                      </dt>
                      <dd className="text-gray-600">
                        {p.locationImplementation === "DISTRICT_I" ? "District 1" : "District 2"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                        Source / Sub
                      </dt>
                      <dd className="text-gray-600">
                        {p.sourceOfFund ? SOURCE_OF_FUND_LABEL[p.sourceOfFund] : "—"}
                      </dd>
                      {p.subType && (
                        <dd className="text-xs text-gray-400">{projectLabel(p.subType)}</dd>
                      )}
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
                  <ProjectProgress project={p} barClassName="flex-1" />
                  <ProjectActions id={p.id} grow />
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-275 text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                    <th className="px-4 py-3 font-medium">Project ID</th>
                    <th className="px-4 py-3 font-medium">Project Title & Cost</th>
                    <th className="px-4 py-3 font-medium">Mode</th>
                    <th className="px-4 py-3 font-medium">District</th>
                    <th className="px-4 py-3 font-medium">Source / Sub</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Budget Year</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Involved Users</th>
                    <th className="px-4 py-3 font-medium">Progress</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated?.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-gray-600">
                        {p.projectCode}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{p.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatPeso(p.projectCost)}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <p>{p.modeOfImplementation === "BY_CONTRACT" ? "By Contract" : "By Administration"}</p>
                        {p.modeOfImplementation === "BY_CONTRACT" && p.contractorName && (
                          <p className="text-xs text-gray-400 mt-0.5">{p.contractorName}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.locationImplementation === "DISTRICT_I" ? "District 1" : "District 2"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <p>{p.sourceOfFund ? SOURCE_OF_FUND_LABEL[p.sourceOfFund] : "—"}</p>
                        {p.subType && (
                          <p className="text-xs text-gray-400">{projectLabel(p.subType)}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-600">{p.cityMunicipality ?? "—"}</p>
                        {p.barangay && (
                          <p className="mt-0.5 text-xs text-gray-400">{p.barangay}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.budgetYear ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3">
                        <ContributorAvatars project={p} />
                      </td>
                      <td className="px-4 py-3">
                        <ProjectProgress project={p} />
                      </td>
                      <td className="px-4 py-3">
                        <ProjectActions id={p.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Rows per page */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Rows per page:</span>
                <select
                  value={PAGE_SIZE}
                  disabled
                  className="rounded-sm border border-gray-300 px-2 py-1 text-sm text-gray-700 focus:outline-none"
                >
                  <option value={20}>20</option>
                </select>
              </div>

              {/* Page controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1]! > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "…" ? (
                      <span key={`ellipsis-${idx}`} className="flex h-8 w-8 items-center justify-center text-sm text-gray-400">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={`flex h-8 w-8 items-center justify-center rounded-sm border text-sm font-medium transition ${page === item
                          ? "border-blue-500 text-blue-600"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <GenerateReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        projects={filtered ?? []}
        fileName="projects-report"
        reportTitle={pageTitle}
      />
    </div>
  );
}

export default ProjectsList;