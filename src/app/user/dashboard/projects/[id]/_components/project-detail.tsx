"use client";

import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/react";

const STATUS_BADGE: Record<string, string> = {
  NOT_YET_STARTED: "bg-gray-500 text-white",
  ON_GOING: "bg-orange-500 text-white",
  COMPLETED: "bg-green-500 text-white",
  SUSPENDED: "bg-red-500 text-white",
};

const STATUS_LABEL: Record<string, string> = {
  NOT_YET_STARTED: "Not Yet Started",
  ON_GOING: "Ongoing",
  COMPLETED: "Completed",
  SUSPENDED: "Suspended",
};

function fmt(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function timeAgo(d: Date | string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

const card = "rounded-xl border border-gray-200 bg-white p-6 shadow-sm";

interface Props {
  projectId: string;
}

export function UserProjectDetail({ projectId }: Props) {
  const { data: project, isLoading } = api.project.getById.useQuery({ id: projectId });
  const { data: activities } = api.projectActivity.getByProjectId.useQuery({ projectId });

  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center text-gray-400">
        Loading project details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-75 flex-col items-center justify-center gap-3 text-gray-400">
        <p>Project not found.</p>
        <Link href="/user/dashboard/projects" className="text-sm font-medium text-blue-600 hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  const badgeClass = STATUS_BADGE[project.status] ?? "bg-gray-500 text-white";
  const statusLabel = STATUS_LABEL[project.status] ?? project.status;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/user/dashboard" className="hover:text-gray-700">Dashboard</Link>
        <span>/</span>
        <Link href="/user/dashboard/projects" className="hover:text-gray-700">Projects</Link>
        <span>/</span>
        <span className="font-medium text-gray-900">Project Details</span>
      </nav>

      <div className="space-y-6">

        {/* ── Hero Card ── */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative h-64 w-full shrink-0 sm:h-auto sm:w-120">
              {project.imageUrl ? (
                <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
              ) : (
                <div className="flex h-full min-h-64 w-full items-center justify-center bg-gray-200">
                  <svg className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
                  </svg>
                </div>
              )}
              <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest shadow ${badgeClass}`}>
                {statusLabel}
              </span>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-between p-7">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Active Project</span>
                  <span className="text-xs text-gray-400">Last updated: {timeAgo(project.updatedAt)}</span>
                </div>
                <h1 className="mt-1 text-2xl font-extrabold leading-snug text-gray-900">{project.title}</h1>
              </div>

              {/* info boxes */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {/* Tracking Number */}
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tracking Number</p>
                    <p className="mt-0.5 font-mono text-sm font-bold text-gray-900">{project.projectCode}</p>
                  </div>
                </div>

                {/* Project Cost */}
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Project Cost</p>
                    <p className="mt-0.5 text-sm font-bold text-gray-900">
                      ₱ {project.contractCost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Implementer */}
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Implementer</p>
                    <p className="mt-0.5 text-sm font-bold text-gray-900">
                      {project.modeOfImplementation === "BY_ADMINISTRATION"
                        ? "By Administration"
                        : project.contractorName
                          ? `By Contract — ${project.contractorName}`
                          : "By Contract"}
                    </p>
                  </div>
                </div>

                {/* Target Completion */}
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Target Completion</p>
                    <p className="mt-0.5 text-sm font-bold text-gray-900">{fmt(project.targetCompletionDate)}</p>
                  </div>
                </div>

                {/* Progress Percentage */}
                <div className="col-span-2 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Progress</p>
                    <p className="mt-0.5 text-sm font-bold text-gray-900">{project.completionPercentage}%</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Activity Log (full width) ── */}
        <section className={card}>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <h2 className="text-base font-bold text-gray-900">Project History / Activity Log</h2>
            </div>
          </div>

          {activities && activities.length > 0 ? (
            <div className="rounded-xl border border-gray-100 bg-gray-50/50">
              {/* Header row */}
              <div className="grid grid-cols-[160px_1fr_160px] border-b border-gray-200 px-5 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Date</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Description</span>
                <span className="text-right text-xs font-semibold uppercase tracking-wider text-gray-400">User</span>
              </div>
              {/* Scrollable rows — max 15 visible */}
              <div className="max-h-210 overflow-y-auto">
                {activities.map((a, i) => {
                  const dotColors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-gray-300"];
                  const dot = dotColors[i % dotColors.length]!;
                  return (
                    <div
                      key={a.id}
                      className="grid grid-cols-[160px_1fr_160px] items-center border-b border-gray-100 px-5 py-4 last:border-0"
                    >
                      <span className="text-sm text-gray-500">
                        {new Date(a.createdAt).toISOString().split("T")[0]}
                      </span>
                      <div className="flex items-center gap-2.5">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
                        <span className="text-sm text-gray-700">{a.description}</span>
                      </div>
                      <div className="flex justify-end">
                        <span className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
                          {a.createdBy.name ?? a.createdBy.email}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-400">No activity logged yet.</p>
          )}
        </section>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 pb-8">
          <Link
            href="/user/dashboard/projects"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Back to Projects
          </Link>
        </div>

      </div>

    </div>
  );
}
