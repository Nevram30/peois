"use client";

import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/react";
import {
  PROJECT_STATUS_LABEL,
  PROJECT_SUB_TYPE_LABEL,
  SOURCE_OF_FUND_LABEL,
  type ProjectStatusValue,
  type ProjectSubTypeValue,
  type SourceOfFundValue,
} from "~/lib/fund-constants";

// const STATUS_BADGE: Record<string, string> = {
//   NOT_YET_STARTED: "bg-gray-500 text-white",
//   ON_GOING: "bg-orange-500 text-white",
//   COMPLETED: "bg-green-500 text-white",
//   SUSPENDED: "bg-red-500 text-white",
//   FOR_IMPLEMENTATION: "bg-blue-500 text-white",
//   RE_ALIGNMENT: "bg-amber-500 text-white",
//   OTHERS: "bg-gray-500 text-white",
// };

const STATUS_PILL: Record<string, string> = {
  NOT_YET_STARTED: "bg-gray-50 text-gray-600 border border-gray-200",
  ON_GOING: "bg-orange-50 text-orange-600 border border-orange-200",
  COMPLETED: "bg-green-50 text-green-600 border border-green-200",
  SUSPENDED: "bg-red-50 text-red-600 border border-red-200",
  FOR_IMPLEMENTATION: "bg-blue-50 text-blue-600 border border-blue-200",
  RE_ALIGNMENT: "bg-amber-50 text-amber-600 border border-amber-200",
  OTHERS: "bg-gray-50 text-gray-600 border border-gray-200",
};

const FILE_TYPE_PILL: Record<string, string> = {
  IMAGE: "bg-blue-50 text-blue-600 border border-blue-200",
  BLUEPRINT: "bg-indigo-50 text-indigo-600 border border-indigo-200",
  REPORT: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  CONTRACT: "bg-amber-50 text-amber-600 border border-amber-200",
  PERMIT: "bg-purple-50 text-purple-600 border border-purple-200",
  OTHER: "bg-gray-50 text-gray-600 border border-gray-200",
};

const FILE_TYPE_LABEL: Record<string, string> = {
  IMAGE: "Image",
  BLUEPRINT: "Blueprint",
  REPORT: "Report",
  CONTRACT: "Contract",
  PERMIT: "Permit",
  OTHER: "Other",
};

const DISTRICT_LABEL: Record<string, string> = {
  DISTRICT_I: "District 1",
  DISTRICT_II: "District 2",
};

function fmt(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtInput(d: Date | string | null | undefined) {
  if (!d) return "";
  const date = new Date(d);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
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

function peso(n: number | null | undefined) {
  const v = typeof n === "number" ? n : 0;
  return `₱ ${v.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

const card = "rounded-xl border border-gray-200 bg-white p-6 shadow-sm";
const sectionTitle = "flex items-center gap-2 border-b border-gray-100 pb-4 mb-5";
const fieldLabel = "text-[11px] font-semibold uppercase tracking-wider text-gray-400";
const fieldBox =
  "mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800";

interface Props {
  projectId: string;
}

export function UserProjectDetail({ projectId }: Props) {
  const { data: project, isLoading } = api.project.getById.useQuery({ id: projectId });
  const { data: activities } = api.projectActivity.getByProjectId.useQuery({ projectId });
  const { data: disbursements } = api.project.getDisbursements.useQuery({ projectId });
  const { data: files } = api.projectFile.getByProjectId.useQuery({ projectId });

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
        <Link
          href="/user/dashboard/projects"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  const pillClass = STATUS_PILL[project.status] ?? STATUS_PILL.OTHERS!;
  const statusLabel =
    PROJECT_STATUS_LABEL[project.status as ProjectStatusValue] ?? project.status;

  const sourceLabel = project.sourceOfFund
    ? (SOURCE_OF_FUND_LABEL[project.sourceOfFund as SourceOfFundValue] ?? project.sourceOfFund)
    : "—";
  const subTypeLabel = project.subType
    ? (PROJECT_SUB_TYPE_LABEL[project.subType as ProjectSubTypeValue] ?? project.subType)
    : "—";

  const districtLabel = project.district
    ? (DISTRICT_LABEL[project.district] ?? project.district)
    : "—";

  const totalDisbursed = (disbursements ?? []).reduce((sum, d) => sum + d.amount, 0);
  const remainingBalance = project.contractCost - totalDisbursed;

  const totalDays =
    project.dateStarted && project.targetCompletionDate
      ? Math.max(
        0,
        Math.ceil(
          (new Date(project.targetCompletionDate).getTime() -
            new Date(project.dateStarted).getTime()) /
          (1000 * 60 * 60 * 24),
        ),
      )
      : project.duration;

  const engineers = (project.projectEngineer ?? "")
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/user/dashboard" className="hover:text-gray-700">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/user/dashboard/projects" className="hover:text-gray-700">
          Projects
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-900">Project Details</span>
      </nav>

      <div className="space-y-6">
        {/* ── Top row: Identity & Status (left, wide) + Location (right) ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Project Identity & Status */}
          <section className={`${card} lg:col-span-2`}>
            <div className={sectionTitle}>
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                Project Identity &amp; Status
              </h2>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row">
              {/* Image */}
              <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-linear-to-br from-slate-700 to-slate-900 sm:h-44 sm:w-44">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <svg
                      className="h-14 w-14"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"
                      />
                    </svg>
                  </div>
                )}
                <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-mono font-semibold text-white">
                  # {project.projectCode}
                </span>
              </div>

              {/* Right column - fields */}
              <div className="flex-1 space-y-3">
                <div>
                  <label className={fieldLabel}>Project Title</label>
                  <div className={fieldBox}>{project.title}</div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabel}>Project Cost</label>
                    <div className={fieldBox}>{peso(project.projectCost)}</div>
                  </div>
                  <div>
                    <label className={fieldLabel}>Contract Cost</label>
                    <div className={fieldBox}>{peso(project.contractCost)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabel}>Track Number</label>
                    <div className={`${fieldBox} font-mono`}>{project.projectCode}</div>
                  </div>
                  <div>
                    <label className={fieldLabel}>Current Status</label>
                    <div
                      className={`mt-1.5 flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-semibold ${pillClass}`}
                    >
                      <span>{statusLabel}</span>
                      <svg
                        className="h-4 w-4 opacity-60"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabel}>Implementation Mode</label>
                    <div className={fieldBox}>
                      {project.modeOfImplementation === "BY_ADMINISTRATION"
                        ? "By Administration"
                        : "By Contract"}
                    </div>
                  </div>
                  <div>
                    <label className={fieldLabel}>Contractor Name</label>
                    <div className={fieldBox}>{project.contractorName ?? "—"}</div>
                  </div>
                </div>

                {/* Progress */}
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <label className={fieldLabel}>Project Progress</label>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Real-Time
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-700 transition-all"
                        style={{ width: `${project.completionPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700">
                      {project.completionPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Project Location */}
          <section className={card}>
            <div className={sectionTitle}>
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                Project Location
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className={fieldLabel}>District</label>
                <div className={fieldBox}>{districtLabel}</div>
              </div>
              <div>
                <label className={fieldLabel}>Municipality</label>
                <div className={fieldBox}>{project.cityMunicipality ?? "—"}</div>
              </div>
              <div>
                <label className={fieldLabel}>Barangay</label>
                <div className={fieldBox}>{project.barangay ?? "—"}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={fieldLabel}>Purok</label>
                  <div className={fieldBox}>{project.purok ?? "—"}</div>
                </div>
                <div>
                  <label className={fieldLabel}>Sitio</label>
                  <div className={fieldBox}>{project.sitio ?? "N/A"}</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── Funding & Disbursement Tracking ── */}
        <section className={card}>
          <div className={sectionTitle}>
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 12a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V12zm-12 0h.008v.008H6V12z"
              />
            </svg>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
              Funding &amp; Disbursement Tracking
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left: 4 fields */}
            <div className="space-y-3 lg:col-span-1">
              <div>
                <label className={fieldLabel}>Source of Fund</label>
                <div className={fieldBox}>{sourceLabel}</div>
              </div>
              <div>
                <label className={fieldLabel}>Fund Category</label>
                <div className={fieldBox}>{subTypeLabel}</div>
              </div>
              <div>
                <label className={fieldLabel}>Budget Year</label>
                <div className={fieldBox}>{project.budgetYear ?? "—"}</div>
              </div>
              <div>
                <label className={fieldLabel}>Remaining Balance</label>
                <div className="mt-1.5 w-full rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-sm font-semibold text-blue-700">
                  {peso(remainingBalance)}
                </div>
                <p className="mt-1 text-[10px] italic text-gray-400">
                  * CALCULATED BASED ON TOTAL COST VS RECORDED DISBURSEMENTS
                </p>
              </div>
            </div>

            {/* Right: Recent Disbursements table */}
            <div className="lg:col-span-2">
              <p className={fieldLabel}>Recent Disbursements</p>
              <div className="mt-1.5 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Reference / Check #</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3 text-right">Amount (₱)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {disbursements && disbursements.length > 0 ? (
                      disbursements.map((d) => (
                        <tr key={d.id} className="text-gray-700">
                          <td className="px-4 py-3 text-gray-500">{fmt(d.date)}</td>
                          <td className="px-4 py-3 font-mono text-xs">
                            {d.referenceNumber ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-500">Disbursement</td>
                          <td className="px-4 py-3 text-right font-semibold">
                            {d.amount.toLocaleString("en-PH", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-sm text-gray-400"
                        >
                          No disbursements recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ── Project Timeline ── */}
        <section className={card}>
          <div className={sectionTitle}>
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
              Project Timeline
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={fieldLabel}>Date Started</label>
              <div className={fieldBox}>{fmtInput(project.dateStarted) || "—"}</div>
            </div>
            <div>
              <label className={fieldLabel}>Original Target</label>
              <div className={fieldBox}>{fmtInput(project.targetCompletionDate) || "—"}</div>
            </div>
            <div>
              <label className={fieldLabel}>Revised Target Completion</label>
              <div className={`${fieldBox} ${project.revisedCompletionDate ? "" : "text-gray-400"}`}>
                {fmtInput(project.revisedCompletionDate) || "mm/dd/yyyy"}
              </div>
            </div>
            <div>
              <label className={fieldLabel}>Total Days</label>
              <div className="mt-1.5 w-full rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-sm font-semibold text-blue-700">
                {totalDays} Days
              </div>
            </div>
          </div>
        </section>

        {/* ── Workforce Distribution ── */}
        <section className={card}>
          <div className={`${sectionTitle} justify-between`}>
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                Workforce Distribution
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-blue-600">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              Live Updates
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Female Personnel
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{project.numFemale}</p>
                </div>
                <span className="text-xl text-pink-400">♀</span>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Male Personnel
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{project.numMale}</p>
                </div>
                <span className="text-xl text-blue-400">♂</span>
              </div>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
                    Total Workforce
                  </p>
                  <p className="mt-2 text-3xl font-bold text-blue-700">{project.numPersons}</p>
                </div>
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ── Project Responsibility & Scope ── */}
        <section className={card}>
          <div className={sectionTitle}>
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
              Project Responsibility &amp; Scope
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <label className={fieldLabel}>Engineers In-Charge</label>
              <div className="mt-1.5 flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                {engineers.length > 0 ? (
                  engineers.map((eng) => (
                    <span
                      key={eng}
                      className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm"
                    >
                      {eng}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </div>
            </div>
            <div>
              <label className={fieldLabel}>Detailed Scope of Work</label>
              <div className="mt-1.5 min-h-22 w-full whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700">
                {project.description ?? "—"}
              </div>
            </div>
          </div>
        </section>

        {/* ── Project Documentation ── */}
        <section className={card}>
          <div className={sectionTitle}>
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
              />
            </svg>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
              Project Documentation
            </h2>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">File Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Upload Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {files && files.length > 0 ? (
                  files.map((f) => (
                    <tr key={f.id} className="text-gray-700">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <svg
                            className="h-4 w-4 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                            />
                          </svg>
                          <span className="font-medium">{f.fileName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${FILE_TYPE_PILL[f.fileType] ?? FILE_TYPE_PILL.OTHER}`}
                        >
                          {FILE_TYPE_LABEL[f.fileType] ?? f.fileType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{fmt(f.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-3">
                          <a
                            href={f.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                            aria-label={`View ${f.fileName}`}
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </a>
                          <a
                            href={f.fileUrl}
                            download={f.fileName}
                            className="text-blue-500 hover:text-blue-700"
                            aria-label={`Download ${f.fileName}`}
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                              />
                            </svg>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-sm text-gray-400"
                    >
                      No documents uploaded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Activity Log (full width) — kept ── */}
        <section className={card}>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h2 className="text-base font-bold text-gray-900">
                Project History / Activity Log
              </h2>
            </div>
          </div>

          {activities && activities.length > 0 ? (
            <div className="rounded-xl border border-gray-100 bg-gray-50/50">
              {/* Header row */}
              <div className="grid grid-cols-[160px_1fr_160px] border-b border-gray-200 px-5 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Date
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Description
                </span>
                <span className="text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                  User
                </span>
              </div>
              {/* Scrollable rows — max 15 visible */}
              <div className="max-h-210 overflow-y-auto">
                {activities.map((a, i) => {
                  const dotColors = [
                    "bg-blue-500",
                    "bg-green-500",
                    "bg-purple-500",
                    "bg-gray-300",
                  ];
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
            <p className="py-8 text-center text-sm text-gray-400">
              No activity logged yet.
            </p>
          )}
        </section>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 pb-8">
          <Link
            href="/user/dashboard/projects"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
            Back to Projects
          </Link>
        </div>

        {/* Last updated tag */}
        <div className="text-right text-xs text-gray-400">
          Last updated: {timeAgo(project.updatedAt)}
        </div>
      </div>
    </div>
  );
}
