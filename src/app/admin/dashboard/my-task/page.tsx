"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type PriorityFilter = Priority | "ALL";

const priorityConfig: Record<Priority, { label: string; bg: string }> = {
  URGENT: { label: "URGENT", bg: "bg-red-600" },
  HIGH:   { label: "HIGH",   bg: "bg-orange-500" },
  MEDIUM: { label: "MEDIUM", bg: "bg-yellow-500" },
  LOW:    { label: "LOW",    bg: "bg-green-500" },
};

const tabs: { key: PriorityFilter; label: string }[] = [
  { key: "ALL",    label: "All" },
  { key: "URGENT", label: "Urgent" },
  { key: "HIGH",   label: "High" },
  { key: "MEDIUM", label: "Medium" },
  { key: "LOW",    label: "Low" },
];

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MyTaskPage() {
  const [activeTab, setActiveTab] = useState<PriorityFilter>("ALL");

  const { data: tasks, isLoading } = api.taskNotification.getTasksSentByMe.useQuery();

  const filtered =
    activeTab === "ALL"
      ? (tasks ?? [])
      : (tasks ?? []).filter((t) => t.priority === activeTab);

  const counts = {
    ALL:    tasks?.length ?? 0,
    URGENT: tasks?.filter((t) => t.priority === "URGENT").length ?? 0,
    HIGH:   tasks?.filter((t) => t.priority === "HIGH").length ?? 0,
    MEDIUM: tasks?.filter((t) => t.priority === "MEDIUM").length ?? 0,
    LOW:    tasks?.filter((t) => t.priority === "LOW").length ?? 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl">

        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          <Link href="/admin/dashboard" className="transition hover:text-gray-600">
            Dashboard
          </Link>
          <span className="text-gray-300">&gt;</span>
          <span className="text-gray-500">My Tasks</span>
        </nav>

        {/* Page Heading */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <span className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 shadow-sm">
            {counts.ALL} task{counts.ALL !== 1 ? "s" : ""} sent
          </span>
        </div>

        {/* Summary Strip */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["URGENT", "HIGH", "MEDIUM", "LOW"] as Priority[]).map((p) => (
            <div
              key={p}
              className={`rounded-xl border px-4 py-3 shadow-sm ${
                p === "URGENT" ? "border-red-100 bg-red-50" :
                p === "HIGH"   ? "border-orange-100 bg-orange-50" :
                p === "MEDIUM" ? "border-yellow-100 bg-yellow-50" :
                                 "border-green-100 bg-green-50"
              }`}
            >
              <p className={`text-[10px] font-bold uppercase tracking-widest ${
                p === "URGENT" ? "text-red-400" :
                p === "HIGH"   ? "text-orange-400" :
                p === "MEDIUM" ? "text-yellow-500" :
                                 "text-green-400"
              }`}>
                {p}
              </p>
              <p className={`mt-0.5 text-2xl font-bold ${
                p === "URGENT" ? "text-red-700" :
                p === "HIGH"   ? "text-orange-700" :
                p === "MEDIUM" ? "text-yellow-700" :
                                 "text-green-700"
              }`}>
                {counts[p]}
              </p>
            </div>
          ))}
        </div>

        {/* Toggle Tabs */}
        <div className="mb-4 flex gap-2 overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`-mb-px flex flex-1 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap border-b-[3px] px-2 py-2.5 text-xs uppercase tracking-wide transition sm:px-3 ${
                activeTab === tab.key
                  ? "border-amber-500 font-semibold text-amber-600"
                  : "border-transparent font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeTab === tab.key
                    ? "bg-amber-500/10 text-amber-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Task Cards */}
        <div className="flex flex-col gap-3">

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-xl border border-gray-200 bg-white" />
              ))}
            </div>
          )}

          {/* Empty */}
          {!isLoading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">No tasks sent yet</p>
            </div>
          )}

          {/* Task List */}
          {!isLoading && filtered.map((task) => {
            const { label: priorityLabel, bg: priorityBg } = priorityConfig[task.priority as Priority];
            const recipientName = task.notifyUser.name ?? task.notifyUser.email;
            const recipientInitial = (recipientName ?? "?").charAt(0).toUpperCase();
            const isAcknowledged = task.acknowledged;
            const hasInProgress = task.replies.some((r) => r.taskStatus === "in-progress");
            const hasActionTaken = task.replies.some((r) => r.taskStatus === "action-taken");

            return (
              <Link
                key={task.id}
                href={`/admin/dashboard/my-task/${task.id}`}
                className="block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-gray-300 hover:shadow-md"
              >
                {/* Card Body */}
                <div className="p-5">
                  {/* Priority Badge */}
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-white ${priorityBg}`}>
                      {priorityLabel}
                    </span>
                    <span className="text-[11px] font-semibold tracking-wide text-gray-400">
                      {timeAgo(task.createdAt)}
                    </span>
                  </div>

                  {/* Title Row */}
                  <div className="mb-2 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1e3a4f]/10">
                      <svg className="h-5 w-5 text-[#1e3a4f]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-sm font-bold leading-snug text-gray-900">
                          Task Assignment
                        </p>
                        {isAcknowledged && (
                          <span className="rounded-full border border-green-300 bg-green-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-green-600">
                            Acknowledge
                          </span>
                        )}
                        {hasInProgress && (
                          <span className="rounded-full border border-green-300 bg-green-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-green-600">
                            In Progress
                          </span>
                        )}
                        {hasActionTaken && (
                          <span className="rounded-full border border-green-300 bg-green-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-green-600">
                            Action Taken
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                          </svg>
                          Assigned to {recipientName}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                          </svg>
                          {formatDate(task.createdAt)}
                        </span>
                      </div>
                    </div>
                    {/* Recipient avatar */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e3a4f] text-xs font-bold text-white">
                      {recipientInitial}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-gray-500">
                    {task.description}
                  </p>

                  {/* Related Project */}
                  <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2.5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#1e3a4f]">
                      <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                        Related Project
                      </p>
                      <p className="truncate text-xs font-semibold text-gray-700">
                        {task.project.title} ({task.project.projectCode})
                      </p>
                    </div>
                    <svg className="h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-end border-t border-gray-100 bg-gray-50/60 px-5 py-2.5">
                  <span className="text-[11px] font-semibold text-[#1e3a4f]">
                    View details →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
