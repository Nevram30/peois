"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  FOR_REVIEW: "bg-blue-100 text-blue-700",
  REVISION: "bg-amber-100 text-amber-700",
  RELEASED: "bg-green-100 text-green-700",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  FOR_REVIEW: "For Review",
  REVISION: "Revision",
  RELEASED: "Released",
};

const typeLabels: Record<string, string> = {
  POW: "POW",
  PURCHASE_REQUEST: "Purchase Request",
};

export function DocumentsList() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const utils = api.useUtils();
  const { data: documents, isLoading } = api.document.getAll.useQuery();

  const updateStatusMutation = api.document.updateStatus.useMutation({
    onSuccess: () => utils.document.invalidate(),
  });

  const deleteMutation = api.document.delete.useMutation({
    onSuccess: () => utils.document.invalidate(),
  });

  const filtered = documents?.filter((doc) => {
    const matchesSearch =
      !search ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.documentCode.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "ALL" || doc.type === typeFilter;
    const matchesStatus = statusFilter === "ALL" || doc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleStatusChange = (id: string, status: string) => {
    if (
      status === "RELEASED" &&
      !confirm("Release this document to the Division Clerk? This cannot be undone.")
    ) {
      return;
    }
    updateStatusMutation.mutate({
      id,
      status: status as "DRAFT" | "FOR_REVIEW" | "REVISION" | "RELEASED",
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this draft document?")) return;
    deleteMutation.mutate({ id });
  };

  return (
    <div className="space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage POWs and Purchase Requests
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin-assistant/dashboard/documents/new?type=POW"
            className="rounded-lg bg-[#1e3a4f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2a4d66]"
          >
            Upload POW
          </Link>
          <Link
            href="/admin-assistant/dashboard/documents/new?type=PURCHASE_REQUEST"
            className="rounded-lg border border-[#1e3a4f] px-4 py-2 text-sm font-medium text-[#1e3a4f] transition hover:bg-[#1e3a4f]/5"
          >
            Create PR
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by title or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1e3a4f] focus:outline-none focus:ring-1 focus:ring-[#1e3a4f]"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1e3a4f] focus:outline-none focus:ring-1 focus:ring-[#1e3a4f]"
        >
          <option value="ALL">All Types</option>
          <option value="POW">POW</option>
          <option value="PURCHASE_REQUEST">Purchase Request</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1e3a4f] focus:outline-none focus:ring-1 focus:ring-[#1e3a4f]"
        >
          <option value="ALL">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="FOR_REVIEW">For Review</option>
          <option value="REVISION">Revision</option>
          <option value="RELEASED">Released</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-gray-500">Loading documents...</p>
          </div>
        ) : !filtered || filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="mb-3 h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            <p className="text-sm font-medium text-gray-900">No documents found</p>
            <p className="mt-1 text-sm text-gray-500">
              Create your first document to get started
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">Code</th>
                <th className="px-4 py-3 font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 font-medium text-gray-500">Title</th>
                <th className="px-4 py-3 font-medium text-gray-500">District</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500">Created</th>
                <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">
                    {doc.documentCode}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {typeLabels[doc.type] ?? doc.type}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {doc.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {doc.district.replace("_", " ")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[doc.status] ?? ""}`}
                    >
                      {statusLabels[doc.status] ?? doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {/* DRAFT actions */}
                      {doc.status === "DRAFT" && (
                        <>
                          <Link
                            href={`/admin-assistant/dashboard/documents/${doc.id}/edit`}
                            className="rounded px-2 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() =>
                              handleStatusChange(doc.id, "FOR_REVIEW")
                            }
                            disabled={updateStatusMutation.isPending}
                            className="rounded px-2 py-1 text-xs font-medium text-[#1e3a4f] transition hover:bg-teal-50 disabled:opacity-50"
                          >
                            Submit
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            disabled={deleteMutation.isPending}
                            className="rounded px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {/* FOR_REVIEW actions */}
                      {doc.status === "FOR_REVIEW" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(doc.id, "REVISION")
                            }
                            disabled={updateStatusMutation.isPending}
                            className="rounded px-2 py-1 text-xs font-medium text-amber-600 transition hover:bg-amber-50 disabled:opacity-50"
                          >
                            Revise
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(doc.id, "RELEASED")
                            }
                            disabled={updateStatusMutation.isPending}
                            className="rounded px-2 py-1 text-xs font-medium text-green-600 transition hover:bg-green-50 disabled:opacity-50"
                          >
                            Release
                          </button>
                        </>
                      )}
                      {/* REVISION actions */}
                      {doc.status === "REVISION" && (
                        <>
                          <Link
                            href={`/admin-assistant/dashboard/documents/${doc.id}/edit`}
                            className="rounded px-2 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() =>
                              handleStatusChange(doc.id, "FOR_REVIEW")
                            }
                            disabled={updateStatusMutation.isPending}
                            className="rounded px-2 py-1 text-xs font-medium text-[#1e3a4f] transition hover:bg-teal-50 disabled:opacity-50"
                          >
                            Resubmit
                          </button>
                        </>
                      )}
                      {/* RELEASED - view only */}
                      {doc.status === "RELEASED" && (
                        <span className="px-2 py-1 text-xs text-gray-400">
                          Released{" "}
                          {doc.releasedAt
                            ? new Date(doc.releasedAt).toLocaleDateString()
                            : ""}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
