"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

const priorityConfig: Record<Priority, { label: string; bg: string }> = {
  URGENT: { label: "URGENT", bg: "bg-red-600" },
  HIGH: { label: "HIGH", bg: "bg-orange-500" },
  MEDIUM: { label: "MEDIUM", bg: "bg-yellow-500" },
  LOW: { label: "LOW", bg: "bg-green-500" },
};

const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const timeAgo = (date: Date | string): string => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const TaskDetailPage = () => {
  const params = useParams();
  const id = params.id as string;

  const { data: task, isLoading } = api.taskNotification.getById.useQuery({ id });

  const router = useRouter();

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
          <div className="h-64 animate-pulse rounded-sm bg-white border border-gray-200" />
        </div>
      </div>
    );
  }

  // Not found
  if (!task) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-lg font-semibold text-gray-700">Task not found</p>
        <Link
          href="/admin/my-task"
          className="text-sm text-[#1e3a4f] underline underline-offset-2"
        >
          Back to My Tasks
        </Link>
      </div>
    );
  }

  const { label: priorityLabel, bg: priorityBg } = priorityConfig[task.priority as Priority];
  const assignerName = task.createdBy.name ?? task.createdBy.email;
  const assignerInitial = (assignerName ?? "?").charAt(0).toUpperCase();
  const isAcknowledged = task.acknowledged;
  const hasInProgress = task.replies.some((r) => r.taskStatus === "in-progress");
  const hasActionTaken = task.replies.some((r) => r.taskStatus === "action-taken");

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl">

        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          <Link href="/admin/dashboard" className="transition hover:text-gray-600">
            Dashboard
          </Link>
          <span className="text-gray-300">&gt;</span>
          <Link href="/admin/my-task" className="transition hover:text-gray-600">
            My Tasks
          </Link>
          <span className="text-gray-300">&gt;</span>
          <span className="truncate max-w-35 text-gray-500">{task.id.slice(0, 12).toUpperCase()}</span>
        </nav>

        {/* Page Heading */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Task Assignment</h1>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">

          {/* Card Body */}
          <div className="p-4 sm:p-6">

            {/* Task Title Row */}
            <div className="mb-4 flex items-start gap-3">
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1e3a4f]/10">
                <svg className="h-5 w-5 text-[#1e3a4f]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>

              {/* Title + Meta */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900">Task Assignment</h2>
                  <span className={`rounded px-2 py-0.5 text-[11px] font-bold tracking-widest text-white ${priorityBg}`}>
                    {priorityLabel}
                  </span>
                  {isAcknowledged && (
                    <span className="rounded-full border border-green-300 bg-green-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600">
                      Acknowledge
                    </span>
                  )}
                  {hasInProgress && (
                    <span className="rounded-full border border-green-300 bg-green-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600">
                      In Progress
                    </span>
                  )}
                  {hasActionTaken && (
                    <span className="rounded-full border border-green-300 bg-green-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600">
                      Action Taken
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    Assigned by {assignerName}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    {formatDate(task.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="mb-6 text-sm leading-relaxed text-gray-600">
              {task.description}
            </p>

            {/* Related Project */}
            <Link
              href={`/admin/projects/${task.project.id}`}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 transition hover:bg-gray-50"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#1e3a4f]">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Related Project
                </p>
                <p className="truncate text-sm font-semibold text-gray-800">
                  {task.project.title} ({task.project.projectCode})
                </p>
              </div>
              <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 px-4 py-4 sm:px-6">
            {/* View Project Details */}
            <Link
              href={`/admin/projects/${task.project.id}`}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-700 transition hover:bg-gray-50"
            >
              View Project Details
            </Link>

            {/* Messages */}
            <Link
              href={`/admin/my-task/${id}/messages`}
              className="flex items-center gap-2 rounded-lg border border-[#1e3a4f] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#1e3a4f] transition hover:bg-[#1e3a4f] hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              Messages
            </Link>

            {/* Reply — pushed right */}
            <button
              onClick={() => router.push(`/admin/my-task/${id}/reply`)}
              className="ml-auto flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-[#1e3a4f]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
              Reply
            </button>
          </div>
        </div>

        {/* Activity / Replies */}
        <div className="mt-8">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Activity</p>

          <div className="flex flex-col gap-3">
            {/* Task created */}
            <div className="flex items-start gap-3 rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1e3a4f] text-sm font-bold text-white">
                {assignerInitial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-800">{assignerName}</p>
                  <span className="shrink-0 text-xs text-gray-400">{timeAgo(task.createdAt)}</span>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Assigned this task with{" "}
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${priorityBg}`}>
                    {priorityLabel}
                  </span>{" "}
                  priority.
                </p>
              </div>
            </div>

            {/* Acknowledged event */}
            {isAcknowledged && task.acknowledgedAt && (
              <div className="flex items-start gap-3 rounded-sm border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-emerald-800">You acknowledged this task</p>
                    <span className="shrink-0 text-xs text-emerald-500">{timeAgo(task.acknowledgedAt)}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-emerald-600">Receipt confirmed</p>
                </div>
              </div>
            )}

            {/* Replies */}
            {task.replies.map((reply) => {
              const replyAuthor = reply.createdBy.name ?? reply.createdBy.email ?? "You";
              const replyInitial = replyAuthor.charAt(0).toUpperCase();
              const statusLabel =
                reply.taskStatus === "in-progress" ? "In Progress" :
                  reply.taskStatus === "action-taken" ? "Action Taken" : null;
              return (
                <div key={reply.id} className="flex items-start gap-3 rounded-sm border border-blue-100 bg-blue-50 p-4 shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                    {replyInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-blue-900">{replyAuthor}</p>
                        {statusLabel && (
                          <span className="rounded-full bg-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                            {statusLabel}
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-xs text-blue-400">{timeAgo(reply.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-blue-800">{reply.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default TaskDetailPage;