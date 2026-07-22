"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

const ProjectRegistryPage = () => {
  const [search, setSearch] = useState("");

  const { data: entries, isLoading } = api.archive.getAll.useQuery();

  const term = search.trim().toLowerCase();
  const filtered = entries?.filter((e) => {
    if (!term) return true;
    return [
      e.project.title,
      e.project.projectCode,
      e.project.budgetYear ?? "",
      e.boxLabel,
      e.boxRange,
      e.boxNumbers ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(term);
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        <span>Projects</span>
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-gray-600">Project Registry</span>
      </nav>

      <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
        Project Registry
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Physical archive locations recorded for each project.
      </p>

      <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by project, box label, range, or number..."
          className="block w-full max-w-md rounded-lg border border-gray-200 bg-slate-50 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
        />

        <div className="-mx-4 mt-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-210 whitespace-nowrap text-left text-sm sm:whitespace-normal">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Project</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Budget Year</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Box Label</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Box Range</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Box Numbers</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Archived By</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Archive Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                    Loading registry...
                  </td>
                </tr>
              ) : !filtered || filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                    {term
                      ? "No archive entries match your search."
                      : "No archive entries recorded yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="max-w-64 truncate font-medium text-gray-900" title={e.project.title}>
                        {e.project.title}
                      </p>
                      <p className="font-mono text-xs text-gray-500">{e.project.projectCode}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{e.project.budgetYear ?? "—"}</td>
                    <td className="px-4 py-3">
                      {e.boxLabel === "COMPLETED" ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-green-800">
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                          Others
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-600">{e.boxRange}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-600">{e.boxNumbers ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{e.createdBy.name ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProjectRegistryPage;