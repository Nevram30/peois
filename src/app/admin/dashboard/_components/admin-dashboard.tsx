"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  NOT_YET_STARTED: {
    label: "Not Yet Started",
    className: "bg-gray-100 text-gray-700",
  },
  ON_GOING: { label: "On-going", className: "bg-blue-100 text-blue-700" },
  COMPLETED: {
    label: "Completed",
    className: "bg-green-100 text-green-700",
  },
  SUSPENDED: { label: "Suspended", className: "bg-red-100 text-red-700" },
};

const MODE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "BY_ADMINISTRATION", label: "By Administration" },
  { value: "BY_CONTRACT", label: "By Contract" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "NOT_YET_STARTED", label: "Not Yet Started" },
  { value: "ON_GOING", label: "On-going" },
  { value: "COMPLETED", label: "Completed" },
  { value: "SUSPENDED", label: "Suspended" },
];

export function AdminDashboardContent() {
  const router = useRouter();
  const utils = api.useUtils();
  const { data: stats } = api.project.getStats.useQuery();
  const { data: projects, isLoading } = api.project.getAll.useQuery();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const deleteProject = api.project.delete.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
      void utils.project.getStats.invalidate();
      setDeletingId(null);
    },
  });

  const handleDelete = (id: string, title: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      )
    ) {
      setDeletingId(id);
      deleteProject.mutate({ id });
    }
  };

  const years = Array.from(
    new Set(
      projects
        ?.map((p) =>
          p.dateStarted
            ? new Date(p.dateStarted).getFullYear().toString()
            : null,
        )
        .filter(Boolean) as string[],
    ),
  ).sort((a, b) => b.localeCompare(a));

  const filteredProjects = projects?.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.projectCode.toLowerCase().includes(search.toLowerCase())) return false;
    if (modeFilter && p.modeOfImplementation !== modeFilter) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    if (yearFilter && p.dateStarted) {
      const projectYear = new Date(p.dateStarted).getFullYear().toString();
      if (projectYear !== yearFilter) return false;
    }
    if (yearFilter && !p.dateStarted) return false;
    return true;
  });

  return (
    <div className="space-y-8 px-6 py-8">
      {/* Dashboard Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Dashboard Overview
        </h2>
      </div>

      {/* Stat Cards - 2x2 Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Total Projects */}
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-xl bg-blue-500" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Projects
              </p>
              <p className="mt-2 text-4xl font-bold text-gray-900">
                {stats?.total ?? 0}
              </p>
              <p className="mt-1 text-sm text-gray-500">Active AIP Projects</p>
              <span className="mt-3 inline-block rounded-md bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                &uarr; 12% from last month
              </span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <svg
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-xl bg-green-500" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Completed
              </p>
              <p className="mt-2 text-4xl font-bold text-gray-900">
                {stats?.completed ?? 0}
              </p>
              <p className="mt-1 text-sm text-gray-500">Projects This Year</p>
              <span className="mt-3 inline-block rounded-md bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                &uarr; 8% completion rate
              </span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
              <svg
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Ongoing */}
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-xl bg-orange-400" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Ongoing
              </p>
              <p className="mt-2 text-4xl font-bold text-gray-900">
                {stats?.ongoing ?? 0}
              </p>
              <p className="mt-1 text-sm text-gray-500">In Progress</p>
              <span className="mt-3 inline-block rounded-md bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                &uarr; 5 new this week
              </span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
              <svg
                className="h-6 w-6 text-orange-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-xl bg-purple-500" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Documents
              </p>
              <p className="mt-2 text-4xl font-bold text-gray-900">
                {stats?.documents?.toLocaleString() ?? 0}
              </p>
              <p className="mt-1 text-sm text-gray-500">Total Transactions</p>
              <span className="mt-3 inline-block rounded-md bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                &uarr; {stats?.todayCount ?? 0} today
              </span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
              <svg
                className="h-6 w-6 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* AIP Projects Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Annual Investment Plan (AIP) Projects
        </h2>
        <Link
          href="/admin/dashboard/projects/new"
          className="flex items-center gap-2 rounded-lg bg-[#1e3a4f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2a4d66]"
        >
          <span className="text-lg leading-none">+</span> Add New Project
        </Link>
      </div>

      {/* Advanced Filters */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex w-full items-center justify-between px-6 py-4"
        >
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-gray-400"
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
            <span className="text-sm font-semibold text-gray-700">
              Advanced Filters
            </span>
          </div>
          <span className="text-sm font-medium text-blue-600">
            {filtersOpen ? "Collapse" : "Expand"}{" "}
            <span
              className={`inline-block transition-transform ${filtersOpen ? "rotate-180" : ""}`}
            >
              &#8964;
            </span>
          </span>
        </button>

        {filtersOpen && (
          <div className="border-t border-gray-100 px-6 pb-5 pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Search Projects
                </label>
                <input
                  type="text"
                  placeholder="Search by title or code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#1e3a4f] focus:ring-2 focus:ring-[#1e3a4f]/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Implementation Type
                </label>
                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#1e3a4f] focus:ring-2 focus:ring-[#1e3a4f]/20 focus:outline-none"
                >
                  {MODE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Project Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#1e3a4f] focus:ring-2 focus:ring-[#1e3a4f]/20 focus:outline-none"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Year
                </label>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#1e3a4f] focus:ring-2 focus:ring-[#1e3a4f]/20 focus:outline-none"
                >
                  <option value="">All Years</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Projects Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading projects...
          </div>
        ) : !filteredProjects?.length ? (
          <div className="p-8 text-center text-gray-500">
            No projects found.{" "}
            {search || modeFilter || statusFilter || yearFilter
              ? "Try adjusting your filters."
              : 'Click "Add New Project" to create one.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="px-4 py-3 font-medium">Project Code</th>
                  <th className="px-4 py-3 font-medium">Project Title</th>
                  <th className="px-4 py-3 font-medium">Mode</th>
                  <th className="px-4 py-3 font-medium">District</th>
                  <th className="px-4 py-3 font-medium">Contract Cost</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date Started</th>
                  <th className="px-4 py-3 font-medium">Created By</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => {
                  const status = STATUS_LABELS[p.status] ?? {
                    label: p.status,
                    className: "bg-gray-100 text-gray-700",
                  };
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-mono text-sm text-blue-700">
                        {p.projectCode}
                      </td>
                      <td className="max-w-50 truncate px-4 py-3 font-medium text-gray-900">
                        {p.title}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.modeOfImplementation.replace(/_/g, " ")}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.locationImplementation.replace(/_/g, " ")}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.contractCost.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {p.dateStarted
                          ? new Date(p.dateStarted).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {p.createdBy.name ?? p.createdBy.email}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/admin/dashboard/projects/${p.id}/edit`,
                              )
                            }
                            className="rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            disabled={deletingId === p.id}
                            className="rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            {deletingId === p.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
