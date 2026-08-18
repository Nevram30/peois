"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";

const PAGE_SIZE = 10;
const BOX_RANGE_SIZE = 15;
const BOX_RANGE_COUNT = 20;

const BOX_RANGES = Array.from({ length: BOX_RANGE_COUNT }, (_, i) => {
  const start = i * BOX_RANGE_SIZE + 1;
  const end = (i + 1) * BOX_RANGE_SIZE;
  return `${start}-${end}`;
});

type BoxLabel = "COMPLETED" | "OTHERS";

type ArchiveEntry = {
  id: string;
  boxLabel: BoxLabel;
  boxRange: string;
  boxNumbers: string | null;
  createdAt: Date;
  createdBy: { id: string; name: string | null };
};

type ProjectRow = {
  id: string;
  projectCode: string;
  title: string;
  budgetYear: string | null;
  status: string;
  locationImplementation: string;
  cityMunicipality: string | null;
  contractorName: string | null;
  projectEngineer: string | null;
  dateCompleted: Date | null;
  archiveLocations: ArchiveEntry[];
};

const districtLabel = (d: string) =>
  d === "DISTRICT_I" ? "District I" : d === "DISTRICT_II" ? "District II" : d;

// Box label is derived from project status until an archive entry pins it.
const labelForProject = (p: ProjectRow): BoxLabel =>
  p.archiveLocations[0]?.boxLabel ??
  (p.status === "COMPLETED" ? "COMPLETED" : "OTHERS");

function BoxLabelPill({ label }: { label: BoxLabel }) {
  return label === "COMPLETED" ? (
    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-green-800">
      Completed
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
      Others
    </span>
  );
}

const ArchiverProjectsPage = () => {
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [labelFilter, setLabelFilter] = useState("");
  const [boxIdFilter, setBoxIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [archiveTarget, setArchiveTarget] = useState<{
    project: ProjectRow;
    existing?: ArchiveEntry;
  } | null>(null);
  const [viewTarget, setViewTarget] = useState<ProjectRow | null>(null);

  const { data: projects, isLoading } = api.archive.listProjects.useQuery();

  const completedCount =
    projects?.filter((p) => labelForProject(p) === "COMPLETED").length ?? 0;
  const othersCount = (projects?.length ?? 0) - completedCount;

  const budgetYears = useMemo(() => {
    const years = new Set<string>();
    projects?.forEach((p) => p.budgetYear && years.add(p.budgetYear));
    return [...years].sort((a, b) => b.localeCompare(a));
  }, [projects]);

  const usedBoxRanges = useMemo(() => {
    const ranges = new Set<string>();
    projects?.forEach((p) =>
      p.archiveLocations.forEach((a) => ranges.add(a.boxRange)),
    );
    return [...ranges].sort(
      (a, b) => Number(a.split("-")[0]) - Number(b.split("-")[0]),
    );
  }, [projects]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (projects ?? []).filter((p) => {
      const archived = p.archiveLocations.length > 0;
      if (term && !`${p.title} ${p.projectCode}`.toLowerCase().includes(term))
        return false;
      if (yearFilter && p.budgetYear !== yearFilter) return false;
      if (labelFilter && labelForProject(p) !== labelFilter) return false;
      if (boxIdFilter && p.archiveLocations[0]?.boxRange !== boxIdFilter)
        return false;
      if (statusFilter === "ARCHIVED" && !archived) return false;
      if (statusFilter === "NOT_ARCHIVED" && archived) return false;
      return true;
    });
  }, [projects, search, yearFilter, labelFilter, boxIdFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const resetPage = () => setPage(1);

  // Rendered above and below the table so long pages can be paged without
  // scrolling to the bottom; only the divider side differs.
  const renderPagination = (position: "top" | "bottom") => (
    <div
      className={`flex items-center justify-between gap-3 ${position === "top" ? "border-b" : "border-t"
        } border-gray-200 px-5 py-4`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        Showing {pageRows.length} of {filtered.length} projects
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setPage((v) => Math.max(1, v - 1))}
          disabled={currentPage <= 1}
          className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="px-1 text-xs text-gray-500">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setPage((v) => Math.min(totalPages, v + 1))}
          disabled={currentPage >= totalPages}
          className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-xl border-l-4 border-green-500 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Completed
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {isLoading ? "—" : completedCount}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border-l-4 border-slate-400 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Others
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {isLoading ? "—" : othersCount}
            </p>
          </div>
        </div>
      </div>

      {/* Section heading */}
      <h1 className="mt-8 text-xl font-bold uppercase tracking-wide text-[#1e3a8a]">
        Projects
      </h1>

      {/* Filters */}
      <div className="mt-4 rounded-xl bg-white p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Project Title
            </label>
            <div className="relative">
              <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetPage();
                }}
                placeholder="Search..."
                className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Budget Year
            </label>
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                resetPage();
              }}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="">All Years</option>
              {budgetYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Box Label
            </label>
            <select
              value={labelFilter}
              onChange={(e) => {
                setLabelFilter(e.target.value);
                resetPage();
              }}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="">All Labels</option>
              <option value="COMPLETED">Completed</option>
              <option value="OTHERS">Others</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Box ID
            </label>
            <select
              value={boxIdFilter}
              onChange={(e) => {
                setBoxIdFilter(e.target.value);
                resetPage();
              }}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="">All</option>
              {usedBoxRanges.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Archive Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                resetPage();
              }}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="ARCHIVED">Archived</option>
              <option value="NOT_ARCHIVED">Not Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects table */}
      <div className="mt-4 rounded-xl bg-white shadow-sm">
        {/* Pagination header */}
        {renderPagination("top")}

        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Project Title</th>
                <th className="px-5 py-4 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Budget Year</th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Box Label</th>
                <th className="px-5 py-4 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Box ID</th>
                <th className="px-5 py-4 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Box Number</th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Archive Status</th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    Loading projects...
                  </td>
                </tr>
              ) : pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    No projects match your filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((p) => {
                  const archive = p.archiveLocations[0];
                  return (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="max-w-sm font-semibold text-gray-900">{p.title}</p>
                        <p className="mt-0.5 font-mono text-xs text-gray-400">
                          {p.projectCode} · {districtLabel(p.locationImplementation)}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-center text-gray-600">
                        {p.budgetYear ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <BoxLabelPill label={labelForProject(p)} />
                      </td>
                      <td className="px-5 py-4 text-center text-gray-600">
                        {archive?.boxRange ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-center text-gray-600">
                        {archive?.boxNumbers ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        {archive ? (
                          <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-green-800">
                            Archived
                          </span>
                        ) : (
                          <button
                            onClick={() => setArchiveTarget({ project: p })}
                            className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-red-600 transition hover:bg-red-100"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>
                            Archive
                          </button>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewTarget(p)}
                            className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1e3a8a] transition hover:bg-blue-100"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            View
                          </button>
                          {archive && (
                            <button
                              onClick={() =>
                                setArchiveTarget({ project: p, existing: archive })
                              }
                              className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700 transition hover:bg-amber-100"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                              </svg>
                              Update
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {renderPagination("bottom")}
      </div>

      {archiveTarget && (
        <PhysicalArchiveEntryModal
          project={archiveTarget.project}
          existing={archiveTarget.existing}
          onClose={() => setArchiveTarget(null)}
        />
      )}
      {viewTarget && (
        <ProjectViewModal
          project={viewTarget}
          onClose={() => setViewTarget(null)}
        />
      )}
    </div>
  );
}

const PhysicalArchiveEntryModal = ({
  project,
  existing,
  onClose,
}: {
  project: ProjectRow;
  existing?: ArchiveEntry;
  onClose: () => void;
}) => {
  const [boxLabel, setBoxLabel] = useState<BoxLabel>(
    existing?.boxLabel ??
    (project.status === "COMPLETED" ? "COMPLETED" : "OTHERS"),
  );
  const [boxRange, setBoxRange] = useState(existing?.boxRange ?? "");
  const [boxNumber, setBoxNumber] = useState(
    existing?.boxNumbers?.split(",")[0]?.trim() ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  const utils = api.useUtils();
  const onMutationSettled = {
    onSuccess: () => {
      void utils.archive.listProjects.invalidate();
      void utils.archive.getAll.invalidate();
      onClose();
    },
    onError: (err: { message?: string }) =>
      setError(err.message ?? "Failed to save archive location."),
  };
  const createArchive = api.archive.create.useMutation(onMutationSettled);
  const updateArchive = api.archive.update.useMutation(onMutationSettled);
  const isPending = createArchive.isPending || updateArchive.isPending;

  const rangeBounds = useMemo(() => {
    const [start, end] = boxRange.split("-").map(Number);
    return start && end ? { start, end } : null;
  }, [boxRange]);

  const handleSave = () => {
    if (!boxRange) {
      setError("Please select a box range.");
      return;
    }
    const value = boxNumber.trim();
    if (!value) {
      setError("Please enter a box number.");
      return;
    }
    const num = Number(value);
    if (!Number.isInteger(num) || num < 1) {
      setError("Box number must be a whole number (1 or higher).");
      return;
    }
    if (rangeBounds && (num < rangeBounds.start || num > rangeBounds.end)) {
      setError(`Box number must be within the selected range (${boxRange}).`);
      return;
    }

    setError(null);
    if (existing) {
      updateArchive.mutate({
        id: existing.id,
        boxLabel,
        boxRange,
        boxNumbers: [String(num)],
      });
    } else {
      createArchive.mutate({
        projectId: project.id,
        boxLabel,
        boxRange,
        boxNumbers: [String(num)],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl">
        {/* Modal header */}
        <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
          <nav className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            <span>Projects</span>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-gray-600">Archive Management</span>
          </nav>
          <div className="mt-1 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Physical Archive Entry
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-800">
                  Project
                </span>
                <span className="text-sm text-gray-700">{project.title}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 px-6 py-6 sm:px-8 lg:grid-cols-5">
          {/* Storage Metadata form */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-[#1e3a4f]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
              <h3 className="text-base font-bold text-gray-900">Storage Metadata</h3>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Box Label
                </label>
                <select
                  value={boxLabel}
                  onChange={(e) => setBoxLabel(e.target.value as BoxLabel)}
                  className="block w-full rounded-lg border border-gray-200 bg-slate-50 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="COMPLETED">Completed</option>
                  <option value="OTHERS">Others</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Box Range
                </label>
                <select
                  value={boxRange}
                  onChange={(e) => {
                    setBoxRange(e.target.value);
                    setBoxNumber("");
                    setError(null);
                  }}
                  className="block w-full rounded-lg border border-gray-200 bg-slate-50 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="">Select range...</option>
                  {BOX_RANGES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Box Number
                </label>
                <input
                  type="number"
                  min={1}
                  value={boxNumber}
                  onChange={(e) => setBoxNumber(e.target.value)}
                  placeholder="Enter specific box number"
                  className="block w-full rounded-lg border border-gray-200 bg-slate-50 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
                {rangeBounds && (
                  <p className="mt-2 text-xs italic text-gray-400">
                    Must be within the selected range ({boxRange})
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
              <button
                onClick={onClose}
                disabled={isPending}
                className="rounded-lg bg-blue-50 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#16304f] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661l-2.41-7.839a2.25 2.25 0 0 0-2.151-1.588H15M9 3.75v2.5A1.75 1.75 0 0 0 10.75 8h2.5A1.75 1.75 0 0 0 15 6.25v-2.5M9 3.75h6" />
                  </svg>
                )}
                {isPending
                  ? "Saving..."
                  : existing
                    ? "Update Archive Location"
                    : "Save Archive Location"}
              </button>
            </div>
          </div>

          {/* Archiver Guidelines */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-slate-50 p-5">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-[#1e3a4f]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">
                  Archiver Guidelines
                </h3>
              </div>

              <ol className="mt-5 space-y-5">
                {[
                  {
                    title: "Verify Box Label & Metadata",
                    body: "Ensure the physical box label matches the selected label in the MIS.",
                  },
                  {
                    title: "Range & Box Number Validation",
                    body: "Confirm the box number range (e.g., 1-15) matches the physical storage sequence.",
                  },
                  {
                    title: "Link Project to Physical Box",
                    body: "All project metadata must correlate with the assigned box label and number in the registry.",
                  },
                ].map((item, i) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#1e3a4f] shadow-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProjectViewModal = ({
  project,
  onClose,
}: {
  project: ProjectRow;
  onClose: () => void;
}) => {
  const archive = project.archiveLocations[0];

  const rows: [string, string][] = [
    ["Project Code", project.projectCode],
    ["Budget Year", project.budgetYear ?? "—"],
    ["Status", project.status.replaceAll("_", " ")],
    ["District", districtLabel(project.locationImplementation)],
    ["City / Municipality", project.cityMunicipality ?? "—"],
    ["Contractor", project.contractorName ?? "—"],
    ["Project Engineer", project.projectEngineer ?? "—"],
    [
      "Date Completed",
      project.dateCompleted
        ? new Date(project.dateCompleted).toLocaleDateString()
        : "—",
    ],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Project Details
            </p>
            <h2 className="mt-0.5 text-lg font-bold text-gray-900">{project.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  {label}
                </dt>
                <dd className="mt-0.5 text-sm text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Physical Archive
            </p>
            {archive ? (
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Box Label
                  </dt>
                  <dd className="mt-1">
                    <BoxLabelPill label={archive.boxLabel} />
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Box Range
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-900">{archive.boxRange}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Box Numbers
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-900">
                    {archive.boxNumbers ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Archived By
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-900">
                    {archive.createdBy.name ?? "—"} ·{" "}
                    {new Date(archive.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                This project has not been archived yet.
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 text-right">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#1e3a5f] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#16304f]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArchiverProjectsPage;