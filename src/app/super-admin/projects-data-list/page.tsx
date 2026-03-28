"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";

const STATUS_STYLES: Record<string, { bg: string; dot: string; text: string; label: string }> = {
  ON_GOING: { bg: "bg-blue-50", dot: "bg-blue-500", text: "text-blue-700", label: "Active" },
  COMPLETED: { bg: "bg-green-50", dot: "bg-green-500", text: "text-green-700", label: "Completed" },
  SUSPENDED: { bg: "bg-red-50", dot: "bg-red-500", text: "text-red-700", label: "Suspended" },
  NOT_YET_STARTED: { bg: "bg-gray-100", dot: "bg-gray-400", text: "text-gray-600", label: "Not Started" },
};

export default function ProjectsDataListPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: projects, isLoading } = api.project.getAll.useQuery();

  const filtered = (projects ?? []).filter(
    (p) =>
      p.projectCode.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.cityMunicipality ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects Data List</h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all project records. Click Override to modify a project.
          </p>
        </div>

        <div className="relative">
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
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
            placeholder="Search by Project ID, Name or Location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Project ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Project Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Contract Cost
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                District
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-sm text-gray-400">
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
                <td colSpan={6} className="py-16 text-center text-sm text-gray-400">
                  No projects found.
                </td>
              </tr>
            ) : (
              filtered.map((project) => {
                const style =
                  STATUS_STYLES[project.status] ?? STATUS_STYLES.NOT_YET_STARTED!;
                return (
                  <tr key={project.id} className="transition hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {project.projectCode}
                    </td>
                    <td className="max-w-xs px-4 py-3 font-medium text-gray-900">
                      <span className="line-clamp-2">{project.title}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      ₱{project.contractCost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {project.locationImplementation === "DISTRICT_I" ? "District 1" : "District 2"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {style.label}
                      </span>
                    </td>
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

        {filtered.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
            Showing {filtered.length} of {projects?.length ?? 0} results
          </div>
        )}
      </div>
    </>
  );
}
