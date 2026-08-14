"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/react";
import { HardHat } from "lucide-react";

const formatDateTime = (d: Date | string): string => {
  return new Date(d).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const getInitials = (name?: string | null, email?: string | null): string => {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return (email?.[0] ?? "U").toUpperCase();
}

const STATUS_PILL: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  PENDING: { dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700", label: "Pending" },
  APPROVED: { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", label: "Approved" },
  DENIED: { dot: "bg-red-500", bg: "bg-red-50", text: "text-red-700", label: "Denied" },
};

const ACTION_PILL: Record<string, string> = {
  VIEW: "bg-blue-50 text-blue-700",
  DOWNLOAD: "bg-indigo-50 text-indigo-700",
};

const ROLE_PILL: Record<string, string> = {
  SUPER_ADMIN: "bg-purple-50 text-purple-700",
  ADMIN: "bg-blue-50 text-blue-700",
  USER: "bg-gray-100 text-gray-600",
};

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  USER: "User",
};

const ProjectAccessRequestPage = () => {
  const utils = api.useUtils();

  const { data: requests, isLoading } = api.projectAccessRequest.list.useQuery(undefined, {
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });

  const decide = api.projectAccessRequest.decide.useMutation({
    onSuccess: () => {
      void utils.projectAccessRequest.list.invalidate();
      void utils.projectAccessRequest.pendingCount.invalidate();
    },
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 25;

  const [noteModal, setNoteModal] = useState<{
    note: string;
    fileName: string;
    projectTitle: string;
    requesterName: string;
    role: string;
    inCharge: string;
  } | null>(null);

  const counts = useMemo(() => {
    const c = { total: 0, PENDING: 0, APPROVED: 0, DENIED: 0 };
    for (const r of requests ?? []) {
      c.total += 1;
      c[r.status] = (c[r.status] ?? 0) + 1;
    }
    return c;
  }, [requests]);

  const filtered = (requests ?? []).filter((r) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      r.project.title.toLowerCase().includes(q) ||
      r.project.projectCode.toLowerCase().includes(q) ||
      r.projectFile.fileName.toLowerCase().includes(q) ||
      (r.requestedBy.name ?? "").toLowerCase().includes(q) ||
      (r.requestedBy.email ?? "").toLowerCase().includes(q);
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const hasFilters = !!(search || statusFilter);
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPage(1);
  };

  const isDeciding = (id: string) => decide.isPending && decide.variables?.id === id;

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-gray-200 bg-white px-5 py-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Project Access Request</p>
            <p className="text-xs text-gray-500">Approve or deny requests to view and download project documents.</p>
          </div>
        </div>
        <button
          onClick={() => void utils.projectAccessRequest.list.invalidate()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-sm bg-blue-600 p-4 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Total Requests</p>
          <p className="mt-1 text-3xl font-extrabold leading-none">{counts.total}</p>
        </div>
        <div className="rounded-sm bg-amber-500 p-4 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Pending</p>
          <p className="mt-1 text-3xl font-extrabold leading-none">{counts.PENDING}</p>
        </div>
        <div className="rounded-sm bg-emerald-500 p-4 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Approved</p>
          <p className="mt-1 text-3xl font-extrabold leading-none">{counts.APPROVED}</p>
        </div>
        <div className="rounded-sm bg-red-500 p-4 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Denied</p>
          <p className="mt-1 text-3xl font-extrabold leading-none">{counts.DENIED}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-5 py-4">
          <div className="relative min-w-55 flex-1">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search project, document, or requester..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="DENIED">Denied</option>
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-250 text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Date / Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Project</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Document</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Action</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Requested By</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Role</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">Notes</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-sm text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative h-12 w-12">
                        <svg className="h-12 w-12 animate-spin text-amber-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <HardHat className="absolute inset-0 m-auto h-6 w-6 text-amber-600" />
                      </div>
                      <span>Loading access requests...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-sm text-gray-400">
                    No access requests found.
                  </td>
                </tr>
              ) : (
                paginated.map((r) => {
                  const status = STATUS_PILL[r.status] ?? STATUS_PILL.PENDING!;
                  return (
                    <tr key={r.id} className="transition hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDateTime(r.createdAt)}</td>
                      <td className="max-w-xs px-4 py-3">
                        <Link
                          href={`/admin/projects/${r.project.id}`}
                          className="line-clamp-1 font-medium text-gray-900 hover:text-blue-600"
                        >
                          {r.project.title}
                        </Link>
                        <p className="text-xs text-gray-400">{r.project.projectCode}</p>
                      </td>
                      <td className="max-w-xs px-4 py-3">
                        <p className="line-clamp-1 text-gray-700">{r.projectFile.fileName}</p>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400">{r.projectFile.fileType}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${ACTION_PILL[r.action] ?? "bg-gray-100 text-gray-600"}`}>
                          {r.action}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {r.requestedBy.image ? (
                            <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
                              <Image
                                src={r.requestedBy.image}
                                alt={r.requestedBy.name ?? r.requestedBy.email ?? "User"}
                                fill
                                sizes="28px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                              {getInitials(r.requestedBy.name, r.requestedBy.email)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-gray-700">{r.requestedBy.name ?? "—"}</p>
                            <p className="truncate text-[10px] text-gray-400">
                              {r.requestedBy.employeeId ? `ID: ${r.requestedBy.employeeId}` : r.requestedBy.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${ROLE_PILL[r.requestedBy.role] ?? "bg-gray-100 text-gray-600"}`}>
                          {ROLE_LABEL[r.requestedBy.role] ?? r.requestedBy.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {r.note ? (
                          <button
                            type="button"
                            onClick={() =>
                              setNoteModal({
                                note: r.note ?? "",
                                fileName: r.projectFile.fileName,
                                projectTitle: r.project.title,
                                requesterName: r.requestedBy.name ?? r.requestedBy.email ?? "—",
                                role: ROLE_LABEL[r.requestedBy.role] ?? r.requestedBy.role,
                                inCharge: r.assignedTo?.name ?? r.assignedTo?.email ?? "—",
                              })
                            }
                            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-1.5 text-blue-500 shadow-sm transition hover:bg-blue-50 hover:text-blue-700"
                            title="View justification"
                            aria-label="View justification"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                          </button>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                        {r.reviewedBy && (
                          <p className="mt-1 text-[10px] text-gray-400">by {r.reviewedBy.name ?? r.reviewedBy.email}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => decide.mutate({ id: r.id, decision: "APPROVED" })}
                            disabled={r.status === "APPROVED" || isDeciding(r.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            Approve
                          </button>
                          <button
                            onClick={() => decide.mutate({ id: r.id, decision: "DENIED" })}
                            disabled={r.status === "DENIED" || isDeciding(r.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            Deny
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            {filtered.length === 0 ? (
              "No results"
            ) : (
              <>
                Showing <span className="font-bold">{(safePage - 1) * PAGE_SIZE + 1}</span> to{" "}
                <span className="font-bold">{Math.min(safePage * PAGE_SIZE, filtered.length)}</span> of{" "}
                <span className="font-bold">{filtered.length}</span> requests
              </>
            )}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <span className="px-3 text-xs font-medium text-gray-600">
              Page {safePage} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Justification / Notes Modal */}
      {noteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setNoteModal(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-4.5M16.862 3.487a1.875 1.875 0 1 1 2.652 2.652L10.582 15.07a4.5 4.5 0 0 1-1.897 1.13l-2.685.806.806-2.685a4.5 4.5 0 0 1 1.13-1.897l9.226-9.226Z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Justification / Business Reason</h2>
                  <p className="text-xs text-gray-500">{noteModal.requesterName} · {noteModal.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNoteModal(null)}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                <p><span className="font-semibold text-gray-700">Project:</span> {noteModal.projectTitle}</p>
                <p><span className="font-semibold text-gray-700">Document:</span> {noteModal.fileName}</p>
                <p><span className="font-semibold text-gray-700">Project In-Charge:</span> {noteModal.inCharge}</p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-700">
                {noteModal.note}
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setNoteModal(null)}
                className="rounded-lg bg-[#1e3a4f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#152a3a]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectAccessRequestPage;