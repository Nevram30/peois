"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

const DISTRICT_LABELS: Record<string, string> = {
  DISTRICT_I: "1st District",
  DISTRICT_II: "2nd District",
};

const SOURCE_LABELS: Record<string, string> = {
  GENERAL_FUND: "General Fund",
  SEF: "SEF",
  TRUST_FUND: "Trust Fund",
  TWENTY_PERCENT_DEV_FUND: "20% Dev Fund",
  AID: "AID",
  LOAN: "Loan",
  OTHERS: "Others",
};

const MODE_LABELS: Record<string, string> = {
  BY_ADMINISTRATION: "By Administration",
  BY_CONTRACT: "By Contract",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; dot: string; text: string; badge: string }
> = {
  ON_GOING: {
    label: "Ongoing",
    dot: "bg-blue-500",
    text: "text-blue-700",
    badge: "bg-blue-50 text-blue-700",
  },
  NOT_YET_STARTED: {
    label: "For Bidding",
    dot: "bg-orange-400",
    text: "text-orange-600",
    badge: "bg-orange-50 text-orange-600",
  },
  COMPLETED: {
    label: "Completed",
    dot: "bg-green-500",
    text: "text-green-700",
    badge: "bg-green-50 text-green-700",
  },
  SUSPENDED: {
    label: "Suspended",
    dot: "bg-gray-400",
    text: "text-gray-600",
    badge: "bg-gray-100 text-gray-600",
  },
};

export function AdminDashboardContent() {
  const router = useRouter();
  const { data: stats } = api.project.getStats.useQuery();
  const { data: projects, isLoading } = api.project.getAll.useQuery();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filteredProjects = projects?.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.projectCode.toLowerCase().includes(q) ||
      (p.barangay ?? "").toLowerCase().includes(q) ||
      (p.cityMunicipality ?? "").toLowerCase().includes(q)
    );
  });

  const totalFiltered = filteredProjects?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const paginatedProjects = filteredProjects?.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const statCards = [
    {
      key: "completed",
      label: "COMPLETED",
      value: stats?.completed ?? 0,
      badge: "+4%",
      badgeClass: "text-green-600",
      iconBg: "bg-green-50",
      href: "/admin/dashboard/projects?status=COMPLETED",
      icon: (
        <svg className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      key: "suspended",
      label: "SUSPENDED",
      value: stats?.suspended ?? 0,
      badge: "Alert",
      badgeClass: "text-red-600",
      iconBg: "bg-red-50",
      href: "/admin/dashboard/projects?status=SUSPENDED",
      icon: (
        <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      key: "notYetStarted",
      label: "FOR IMPLEMENTATION",
      value: stats?.notYetStarted ?? 0,
      badge: "Pending",
      badgeClass: "text-orange-500",
      iconBg: "bg-orange-50",
      href: "/admin/dashboard/projects?status=NOT_YET_STARTED",
      icon: (
        <svg className="h-7 w-7 text-orange-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
        </svg>
      ),
    },
    {
      key: "ongoing",
      label: "ON-GOING",
      value: stats?.ongoing ?? 0,
      badge: "Active",
      badgeClass: "text-blue-600",
      iconBg: "bg-blue-50",
      href: "/admin/dashboard/projects?status=ON_GOING",
      icon: (
        <svg className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      ),
    },
    {
      key: "total",
      label: "TOTAL PROJECTS",
      value: stats?.total ?? 0,
      badge: "All",
      badgeClass: "text-purple-600",
      iconBg: "bg-purple-50",
      href: "/admin/dashboard/projects",
      icon: (
        <svg className="h-7 w-7 text-purple-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
      ),
    },
    {
      key: "todayCount",
      label: "NEW TODAY",
      value: stats?.todayCount ?? 0,
      badge: "Today",
      badgeClass: "text-gray-500",
      iconBg: "bg-gray-50",
      href: "/admin/dashboard/projects?filter=today",
      icon: (
        <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-gray-400">
            HOME &rsaquo; DASHBOARD
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time status of provincial engineering infrastructure projects.
          </p>
        </div>

        {/* Search */}
        <div className="relative mt-2 w-80">
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
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search projects, documents, or data..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-[#1e3a4f] focus:outline-none focus:ring-2 focus:ring-[#1e3a4f]/20"
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {statCards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="flex flex-col items-start rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md cursor-pointer"
          >
            <div className="mb-3 flex w-full items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}>
                {card.icon}
              </div>
              <span className={`text-xs font-semibold ${card.badgeClass}`}>
                {card.badge}
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {card.label}
            </p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {String(card.value).padStart(2, "0")}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Project Updates */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Project Updates
            </h2>
            <p className="text-sm text-gray-400">
              Summary of latest changes across all districts
            </p>
          </div>
          <Link
            href="/admin/dashboard/projects/new"
            className="flex items-center gap-1.5 rounded-lg bg-[#1e3a4f] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2a4d66]"
          >
            <span className="text-base leading-none">+</span> Add Project
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-10 text-center text-sm text-gray-400">
              Loading projects...
            </div>
          ) : !paginatedProjects?.length ? (
            <div className="p-10 text-center text-sm text-gray-400">
              {search
                ? "No projects match your search."
                : 'No projects yet. Click "Add Project" to create one.'}
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Project Name
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Location
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Implementation
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    District
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Source of Fund
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedProjects.map((p) => {
                  const statusCfg = STATUS_CONFIG[p.status] ?? {
                    label: p.status,
                    dot: "bg-gray-400",
                    text: "text-gray-600",
                    badge: "bg-gray-100 text-gray-600",
                  };
                  const location = [p.barangay, p.cityMunicipality]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {p.title}
                        </p>
                        <p className="text-xs text-blue-500">
                          {p.projectCode}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {location || "—"}
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {MODE_LABELS[p.modeOfImplementation] ?? p.modeOfImplementation}
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                          {DISTRICT_LABELS[p.locationImplementation] ?? p.locationImplementation}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {SOURCE_LABELS[p.sourceOfFund] ?? p.sourceOfFund}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCfg.badge}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`}
                          />
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
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
                      <td className="px-4 py-4">
                        <button
                          onClick={() =>
                            router.push(`/admin/dashboard/projects/${p.id}`)
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-white transition hover:bg-green-600"
                          title="View project"
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
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                          <span className="text-xs font-medium">View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {!isLoading && totalFiltered > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
            <p className="text-sm text-gray-500">
              SHOWING {Math.min((page - 1) * PAGE_SIZE + 1, totalFiltered)}–
              {Math.min(page * PAGE_SIZE, totalFiltered)} OF {totalFiltered}{" "}
              TOTAL PROJECTS
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
              >
                &lsaquo;
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
              >
                &rsaquo;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
