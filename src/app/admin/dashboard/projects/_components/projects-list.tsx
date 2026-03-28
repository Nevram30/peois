"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

const STATUS_TITLES: Record<string, string> = {
  COMPLETED: "Completed Projects",
  SUSPENDED: "Suspended Projects",
  NOT_YET_STARTED: "Projects For Implementation",
  ON_GOING: "On-Going Projects",
  today: "New Projects Today",
};

export function ProjectsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");
  const filterToday = searchParams.get("filter") === "today";

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [statusLocal, setStatusLocal] = useState("");

  const { data: projects, isLoading } = api.project.getAll.useQuery();

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
    if (divisionFilter && p.locationImplementation !== divisionFilter)
      return false;
    if (roleFilter && p.modeOfImplementation !== roleFilter) return false;
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

  const handleExport = () => {
    if (!filtered) return;
    const headers = [
      "Tracking Number",
      "Project Title",
      "Contract Cost",
      "Mode",
      "District",
      "Date Started",
      "Status",
      "Progress",
    ];
    const rows = filtered.map((p) => [
      p.projectCode,
      `"${p.title.replace(/"/g, '""')}"`,
      p.contractCost.toFixed(2),
      p.modeOfImplementation.replace("_", " "),
      p.locationImplementation.replace("_", " "),
      p.dateStarted ? new Date(p.dateStarted).toLocaleDateString() : "",
      p.status,
      `${p.completionPercentage ?? 0}%`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "projects.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  const pageTitle =
    filterToday
      ? STATUS_TITLES.today
      : statusFilter
        ? (STATUS_TITLES[statusFilter] ?? "Projects")
        : "All Projects";

  return (
    <div className="space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-gray-400">
            <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link> &rsaquo; Projects
          </p>
          <h2 className="text-2xl font-bold text-gray-900">{pageTitle}</h2>
          <p className="mt-1 text-gray-500">
            Manage all projects and documents
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(statusFilter ?? filterToday) && (
            <Link
              href="/admin/dashboard/projects"
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Clear Filter
            </Link>
          )}
          <Link
            href="/admin/dashboard/projects/new"
            className="rounded-lg bg-[#1e3a4f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2a4d66]"
          >
            + Add New Project
          </Link>
        </div>
      </div>

      {/* Advanced filter bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-55">
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
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* All Roles */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">All Roles</option>
          <option value="BY_ADMINISTRATION">By Administration</option>
          <option value="BY_CONTRACT">By Contract</option>
        </select>

        {/* All Divisions */}
        <select
          value={divisionFilter}
          onChange={(e) => setDivisionFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">All Divisions</option>
          <option value="DISTRICT_I">District I</option>
          <option value="DISTRICT_II">District II</option>
        </select>

        {/* All Status */}
        <select
          value={statusLocal}
          onChange={(e) => setStatusLocal(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">All Status</option>
          <option value="NOT_YET_STARTED">Not Yet Started</option>
          <option value="ON_GOING">On-going</option>
          <option value="COMPLETED">Completed</option>
          <option value="SUSPENDED">Suspended</option>
        </select>

        {/* Export */}
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
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
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          Export
        </button>

        {/* Print */}
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
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
              d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
            />
          </svg>
          Print
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading projects...
          </div>
        ) : !filtered?.length ? (
          <div className="p-8 text-center text-gray-500">
            No projects found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500">
                  <th className="px-4 py-3 font-medium">Tracking Number</th>
                  <th className="px-4 py-3 font-medium">Project Title</th>
                  <th className="px-4 py-3 font-medium">Contract Cost</th>
                  <th className="px-4 py-3 font-medium">Mode</th>
                  <th className="px-4 py-3 font-medium">District</th>
                  <th className="px-4 py-3 font-medium">Date Started</th>
                  <th className="px-4 py-3 font-medium">Created By</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Progress</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
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
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {p.title}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        ₱{p.contractCost.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.modeOfImplementation.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.locationImplementation.replace("_", " ")}
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
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-blue-500"
                              style={{ width: `${p.completionPercentage ?? 0}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">
                            {p.completionPercentage ?? 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            router.push(`/admin/dashboard/projects/${p.id}`)
                          }
                          className="inline-flex items-center gap-1.5 rounded-md bg-green-500 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-green-600"
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
        )}
      </div>
    </div>
  );
}
