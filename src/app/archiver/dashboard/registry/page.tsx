"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function ProjectRegistryPage() {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: entries, isLoading } = api.archive.getAll.useQuery();
  const utils = api.useUtils();

  const deleteEntry = api.archive.delete.useMutation({
    onSuccess: () => {
      setDeleteId(null);
      void utils.archive.getAll.invalidate();
    },
  });

  const term = search.trim().toLowerCase();
  const filtered = entries?.filter((e) => {
    if (!term) return true;
    return [
      e.project.title,
      e.project.projectCode,
      e.roomLocation,
      e.cabinetLabel,
      e.boxId,
      e.folderRange,
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

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Project Registry
        </h1>
        <Link
          href="/archiver/dashboard"
          className="flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#16304f]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Archive Entry
        </Link>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Physical archive locations recorded for each project.
      </p>

      <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by project, room, cabinet, box, or folder..."
          className="block w-full max-w-md rounded-lg border border-gray-200 bg-slate-50 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
        />

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Project</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Room Location</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Cabinet</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Shelf</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Box ID</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Folders</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Archived By</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Date</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-gray-400">
                    Loading registry...
                  </td>
                </tr>
              ) : !filtered || filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-gray-400">
                    {term
                      ? "No archive entries match your search."
                      : "No archive entries recorded yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{e.project.title}</p>
                      <p className="font-mono text-xs text-gray-500">{e.project.projectCode}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{e.roomLocation}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-600">{e.cabinetLabel}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {String(e.shelfNumber).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-600">{e.boxId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-600">{e.folderRange}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{e.createdBy.name ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setDeleteId(e.id)}
                        title="Delete entry"
                        className="rounded-full p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-center text-lg font-semibold text-gray-900">Delete archive entry</h2>
            <p className="mt-1 text-center text-sm text-gray-500">
              This removes the recorded physical location. The physical folders are not affected.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteEntry.mutate({ id: deleteId })}
                disabled={deleteEntry.isPending}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deleteEntry.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
