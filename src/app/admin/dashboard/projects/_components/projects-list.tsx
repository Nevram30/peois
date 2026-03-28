"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

export function ProjectsList() {
  const router = useRouter();
  const { data: projects, isLoading } = api.project.getAll.useQuery();

  return (
    <div className="space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="mt-1 text-gray-500">
            Manage all projects and documents
          </p>
        </div>
        <Link
          href="/admin/dashboard/projects/new"
          className="rounded-lg bg-[#1e3a4f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2a4d66]"
        >
          + Add New Project
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading projects...
          </div>
        ) : !projects?.length ? (
          <div className="p-8 text-center text-gray-500">
            No projects found. Click &quot;Add New Project&quot; to create one.
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
                {projects.map((p) => {
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
                        {p.modeOfImplementation.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.locationImplementation.replace("_", " ")}
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
                        <button
                          onClick={() =>
                            router.push(`/admin/dashboard/projects/${p.id}`)
                          }
                          className="rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
                        >
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
