"use client";

import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { HardHat } from "lucide-react";

const formatDateTime = (d: Date | string): string => {
  const date = new Date(d);
  return date.toLocaleString("en-PH", {
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

const getActivityTone = (description: string): { dot: string; bg: string; text: string; label: string } => {
  const lower = description.toLowerCase();
  if (lower.startsWith("created new project")) {
    return { dot: "bg-indigo-500", bg: "bg-indigo-50", text: "text-indigo-700", label: "Created" };
  }
  if (lower.startsWith("[override]")) {
    return { dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700", label: "Override" };
  }
  if (lower.startsWith("recorded disbursement")) {
    return { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", label: "Disbursement" };
  }
  if (lower.startsWith("uploaded")) {
    return { dot: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-700", label: "Document" };
  }
  return { dot: "bg-gray-400", bg: "bg-gray-100", text: "text-gray-600", label: "Comment" };
}

const ProjectActivityLogPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const { data: activities, isLoading, refetch } = api.projectActivity.getAll.useQuery(
    undefined,
    {
      refetchInterval: 15_000,
      refetchOnWindowFocus: true,
    },
  );

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 25;

  const projectOptions = useMemo(() => {
    const map = new Map<string, { id: string; projectCode: string; title: string }>();
    for (const a of activities ?? []) {
      if (!map.has(a.project.id)) map.set(a.project.id, a.project);
    }
    return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title));
  }, [activities]);

  const filtered = (activities ?? []).filter((a) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      a.description.toLowerCase().includes(q) ||
      a.project.title.toLowerCase().includes(q) ||
      a.project.projectCode.toLowerCase().includes(q) ||
      (a.createdBy.name ?? "").toLowerCase().includes(q) ||
      (a.createdBy.email ?? "").toLowerCase().includes(q);
    const matchType = !typeFilter || getActivityTone(a.description).label === typeFilter;
    const matchProject = !projectFilter || a.project.id === projectFilter;
    return matchSearch && matchType && matchProject;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const counts = useMemo(() => {
    const c = { total: 0, Created: 0, Disbursement: 0, Document: 0, Override: 0, Comment: 0 };
    for (const a of activities ?? []) {
      c.total += 1;
      const label = getActivityTone(a.description).label as keyof typeof c;
      c[label] = (c[label] ?? 0) + 1;
    }
    return c;
  }, [activities]);

  const hasFilters = !!(search || typeFilter || projectFilter);
  const clearFilters = () => {
    setSearch("");
    setTypeFilter("");
    setProjectFilter("");
    setPage(1);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-gray-200 bg-white px-5 py-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Project Activity Log</p>
            <p className="text-xs text-gray-500">Audit trail of project creations, disbursements, documents, overrides, and comments across all projects.</p>
          </div>
        </div>
        <button
          onClick={() => void refetch()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Entries</p>
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </div>
          <p className="mt-1 text-3xl font-extrabold leading-none text-gray-900">{counts.total}</p>
        </div>
        <div className="rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Created</p>
            <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="mt-1 text-3xl font-extrabold leading-none text-gray-900">{counts.Created}</p>
        </div>
        <div className="rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Disbursements</p>
            <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>
          </div>
          <p className="mt-1 text-3xl font-extrabold leading-none text-gray-900">{counts.Disbursement}</p>
        </div>
        <div className="rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Documents</p>
            <svg className="h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <p className="mt-1 text-3xl font-extrabold leading-none text-gray-900">{counts.Document}</p>
        </div>
        <div className="rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Overrides</p>
            <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
            </svg>
          </div>
          <p className="mt-1 text-3xl font-extrabold leading-none text-gray-900">{counts.Override}</p>
        </div>
        <div className="rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Comments</p>
            <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
          </div>
          <p className="mt-1 text-3xl font-extrabold leading-none text-gray-900">{counts.Comment}</p>
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
              placeholder="Search description, project, or user..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative shrink-0">
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="Created">Created</option>
              <option value="Disbursement">Disbursement</option>
              <option value="Document">Document</option>
              <option value="Override">Override</option>
              <option value="Comment">Comment</option>
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          <div className="relative shrink-0">
            <select
              value={projectFilter}
              onChange={(e) => { setProjectFilter(e.target.value); setPage(1); }}
              className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Projects</option>
              {projectOptions.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
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
          <table className="w-full min-w-200 text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Date / Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Project</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Activity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">User</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-sm text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative h-12 w-12">
                        <svg className="h-12 w-12 animate-spin text-amber-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <HardHat className="absolute inset-0 m-auto h-6 w-6 text-amber-600" />
                      </div>
                      <span>Loading activity log...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-sm text-gray-400">
                    No activity found.
                  </td>
                </tr>
              ) : (
                paginated.map((a) => {
                  const tone = getActivityTone(a.description);
                  const description = tone.label === "Override"
                    ? a.description.replace(/^\[OVERRIDE\]\s*/i, "")
                    : a.description;
                  return (
                    <tr key={a.id} className="transition hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDateTime(a.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${tone.bg} ${tone.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                          {tone.label}
                        </span>
                      </td>
                      <td className="max-w-xs px-4 py-3">
                        <p className="line-clamp-1 font-medium text-gray-900">{a.project.title}</p>
                        <p className="text-xs text-gray-400">{a.project.projectCode}</p>
                      </td>
                      <td className="max-w-md px-4 py-3 text-gray-700">
                        <p className="line-clamp-2">{description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {a.createdBy.image ? (
                            <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
                              <Image
                                src={a.createdBy.image}
                                alt={a.createdBy.name ?? a.createdBy.email ?? "User"}
                                fill
                                sizes="28px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                              {getInitials(a.createdBy.name, a.createdBy.email)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-gray-700">{a.createdBy.name ?? "—"}</p>
                            <p className="truncate text-[10px] text-gray-400">{a.createdBy.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/super-admin/projects-data-list/${a.project.id}?id=${userId ?? ""}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                          View Project
                        </Link>
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
                <span className="font-bold">{filtered.length}</span> entries
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
    </>
  );
}

export default ProjectActivityLogPage;