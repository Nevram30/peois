"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { DocumentAccessActions } from "~/app/_components/document-access-actions";
import { toImageSlots } from "~/lib/project-images";
import { ProjectImageGallery } from "~/app/_components/project-image-gallery";
import {
  DISBURSEMENT_TYPE_LABEL,
  FUNDING_PROGRAM_LABEL,
  PROJECT_ACCOUNT_LABEL,
  PROJECT_STATUS_LABEL,
  PROJECT_SUB_TYPE_LABEL,
  SOURCE_OF_FUND_LABEL,
  type FundingProgramValue,
  type ProjectStatusValue,
  type ProjectSubTypeValue,
  type SourceOfFundValue,
} from "~/lib/fund-constants";
import { DOC_CHECKLIST, inferDocType, type DocType } from "~/lib/project-documents";

const STATUS_DOT: Record<string, string> = {
  NOT_YET_STARTED: "bg-gray-400",
  ON_GOING: "bg-amber-400",
  COMPLETED: "bg-green-500",
  SUSPENDED: "bg-red-500",
  FOR_IMPLEMENTATION: "bg-blue-500",
  RE_ALIGNMENT: "bg-amber-400",
  OTHERS: "bg-gray-400",
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

const fmt = (d: Date | string | null | undefined) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const timeAgo = (d: Date | string) => {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

const peso = (n: number | null | undefined) => {
  const v = typeof n === "number" ? n : 0;
  return `₱ ${v.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

const card = "rounded-sm border border-gray-200 bg-white p-4 shadow-sm sm:p-6";
const sectionTitle = "flex items-center gap-2 border-b border-gray-100 pb-4 mb-5";
const fieldLabel = "text-[11px] font-semibold uppercase tracking-wider text-gray-400";
const fieldBox =
  "mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800";

interface Props {
  projectId: string;
}

export const UserProjectDetail = ({ projectId }: Props) => {
  const { data: project, isLoading } = api.project.getById.useQuery({ id: projectId });
  const { data: activities } = api.projectActivity.getByProjectId.useQuery({ projectId });
  const { data: disbursements } = api.project.getDisbursements.useQuery({ projectId });
  const { data: variationOrdersData } = api.project.getVariationOrders.useQuery({ projectId });
  const { data: timelineAdjustmentsData } = api.project.getTimelineAdjustments.useQuery({ projectId });
  const { data: files } = api.projectFile.getByProjectId.useQuery({ projectId });
  const { data: me } = api.user.getMe.useQuery();

  // Which documentary requirements are on file. Mirrors the edit form: files
  // saved before docType existed fall back to a guess from the file name, so
  // the checklist is not blank on older projects.
  const satisfiedDocs = new Set(
    (files ?? []).map(
      (f) => (f.docType as DocType | null) ?? inferDocType(f.fileName),
    ),
  );
  const satisfiedCount = DOC_CHECKLIST.filter((item) =>
    satisfiedDocs.has(item.key),
  ).length;

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
          href="/user/projects"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  const statusLabel =
    PROJECT_STATUS_LABEL[project.status as ProjectStatusValue] ?? project.status;

  const sourceLabel = project.sourceOfFund
    ? (SOURCE_OF_FUND_LABEL[project.sourceOfFund as SourceOfFundValue] ?? project.sourceOfFund)
    : "—";
  const subTypeLabel = project.subType
    ? (PROJECT_SUB_TYPE_LABEL[project.subType as ProjectSubTypeValue] ?? project.subType)
    : "—";
  const programLabel = project.program
    ? (FUNDING_PROGRAM_LABEL[project.program as FundingProgramValue] ?? project.program)
    : "—";
  const projectAccountLabel = project.projectAccount
    ? (PROJECT_ACCOUNT_LABEL[project.projectAccount] ?? project.projectAccount)
    : "—";

  const districtLabel = project.district
    ? (DISTRICT_LABEL[project.district] ?? project.district)
    : "—";

  const totalDisbursed = (disbursements ?? []).reduce((sum, d) => sum + d.amount, 0);
  const variationOrders = variationOrdersData ?? [];

  // Balances mirror the drawdown model used across the fund views: disbursements
  // draw down the primary (project cost) fund first, and any excess overflows
  // onto the variation orders. No balance is allowed to go below zero.
  const rawPrimary = project.projectCost - totalDisbursed;
  const primaryBalance = Math.max(0, rawPrimary);
  let voOverflow = Math.max(0, -rawPrimary);
  let variationBalance = 0;
  for (const vo of variationOrders) {
    if (vo.amount <= 0) continue;
    const consumed = Math.min(voOverflow, vo.amount);
    voOverflow -= consumed;
    variationBalance += vo.amount - consumed;
  }
  const totalRemainingBalance = primaryBalance + variationBalance;

  const timelineAdjustments = timelineAdjustmentsData ?? [];

  const handleExportLog = () => {
    if (!activities?.length) return;
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = [
      ["Date", "Time", "Description", "User"],
      ...activities.map((a) => [
        new Date(a.createdAt).toLocaleDateString("en-PH", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        new Date(a.createdAt).toLocaleTimeString("en-PH", {
          hour: "numeric",
          minute: "2-digit",
        }),
        a.description,
        a.createdBy.name ?? a.createdBy.email ?? "",
      ]),
    ];
    const csv = rows.map((r) => r.map(escape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `activity-log-${project.projectCode}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const engineers = (project.projectEngineer ?? "")
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      {/* Breadcrumb + Back button */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
          <Link href="/user/dashboard" className="hover:text-gray-700">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/user/projects" className="hover:text-gray-700">
            Projects
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-900">Project Details</span>
        </nav>
        <Link
          href="/user/projects"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
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
              {/* Photos */}
              <ProjectImageGallery
                slots={toImageSlots(project)}
                alt={project.title}
                twoUp
                className="w-full shrink-0 sm:w-2/5"
                badge={
                  <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] font-semibold text-white">
                    # {project.projectCode}
                  </span>
                }
              />

              {/* Right column - fields */}
              <div className="flex-1 space-y-3">
                <div>
                  <label className={fieldLabel}>Project Title</label>
                  <div className={fieldBox}>{project.title}</div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabel}>Project Cost</label>
                    <div className={`${fieldBox} font-semibold`}>{peso(project.projectCost)}</div>
                  </div>
                  <div>
                    <label className={fieldLabel}>Current Status</label>
                    <div className={`${fieldBox} flex items-center gap-2 font-semibold`}>
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_DOT[project.status] ?? "bg-gray-400"}`} />
                      {statusLabel}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabel}>Track Number</label>
                    <div className={`${fieldBox} font-mono`}>{project.projectCode}</div>
                  </div>
                  <div>
                    <label className={fieldLabel}>Implementation Mode</label>
                    <div className={fieldBox}>
                      {project.modeOfImplementation === "BY_ADMINISTRATION"
                        ? "By Administration"
                        : project.modeOfImplementation === "BY_CONTRACT"
                          ? "By Contract"
                          : "Unassigned - For Determination"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabel}>Contractor Name</label>
                    <div className={fieldBox}>{project.contractorName ?? "—"}</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className={fieldLabel}>Physical Progress</label>
                      <span className="text-sm font-semibold text-gray-500">
                        ({project.completionPercentage}%)
                      </span>
                    </div>
                    <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-900 transition-all"
                        style={{ width: `${project.completionPercentage}%` }}
                      />
                    </div>
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

        {/* ── Funding Information ── */}
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
              Funding Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
            <div>
              <label className={fieldLabel}>Budget Year</label>
              <div className={fieldBox}>{project.budgetYear ?? "—"}</div>
            </div>
            <div>
              <label className={fieldLabel}>Program</label>
              <div className={fieldBox}>{subTypeLabel}</div>
            </div>
            <div>
              <label className={fieldLabel}>Source of Fund</label>
              <div className={fieldBox}>{sourceLabel}</div>
            </div>
            <div>
              <label className={fieldLabel}>Project</label>
              <div className={fieldBox}>{programLabel}</div>
            </div>
            <div>
              <label className={fieldLabel}>Supplemental Budget Year</label>
              <div className={fieldBox}>{project.supplementalBudgetYear ?? "—"}</div>
            </div>
            <div>
              <label className={fieldLabel}>Project Account</label>
              <div className={fieldBox}>{projectAccountLabel}</div>
            </div>
            <div>
              <label className={fieldLabel}>Supplemental Budget Number</label>
              <div className={fieldBox}>{project.supplementalBudgetNumber ?? "—"}</div>
            </div>
            <div>
              <label className={fieldLabel}>* LANDBANK [LBP-TL#]</label>
              <div className={fieldBox}>{project.landbankNumber ?? "—"}</div>
            </div>
          </div>
        </section>

        {/* ── Financial Summary ── */}
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
                d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
              />
            </svg>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
              Financial Summary
            </h2>
          </div>

          {/* Balance tiles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-sm border border-gray-200 bg-gray-50/60 px-4 py-3.5">
              <p className="text-sm font-bold text-blue-800">Total Remaining Balance</p>
              <p className="mt-1 text-xl font-extrabold text-blue-900">{peso(totalRemainingBalance)}</p>
            </div>
            <div className="rounded-sm border border-gray-200 bg-gray-50/60 px-4 py-3.5">
              <p className="text-sm font-bold text-blue-800">Primary Fund Balance</p>
              <p className="mt-1 text-lg font-extrabold text-gray-900">{peso(primaryBalance)}</p>
            </div>
            <div className="rounded-sm border border-gray-200 bg-gray-50/60 px-4 py-3.5">
              <p className="text-sm font-bold text-blue-800">Variation Order Balance</p>
              <p className="mt-1 text-lg font-extrabold text-gray-900">{peso(variationBalance)}</p>
            </div>
          </div>

          {/* Recent Disbursements */}
          <div className="mt-6">
            <p className={`${fieldLabel} mb-2`}>Recent Disbursements</p>
            <div
              className="overflow-y-auto rounded-lg border border-gray-200"
              style={{ maxHeight: "268px" }}
            >
              <table className="w-full min-w-150 border-separate border-spacing-0 text-sm">
                <thead className="sticky top-0 z-10 bg-gray-50">
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 [&>th]:border-b [&>th]:border-gray-200">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Reference #</th>
                    <th className="px-4 py-3">Source of Fund</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3 text-right">Amount (₱)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {disbursements && disbursements.length > 0 ? (
                    disbursements.map((d) => (
                      <tr key={d.id} className="text-gray-700">
                        <td className="px-4 py-3 text-gray-500">{fmt(d.date)}</td>
                        <td className="px-4 py-3 font-mono text-xs">{d.referenceNumber ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{sourceLabel}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {d.type ? DISBURSEMENT_TYPE_LABEL[d.type] : "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {d.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                        No disbursements recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revised Contract Cost History */}
          <div className="mt-6">
            <p className={`${fieldLabel} mb-2`}>Revised Contract Cost History</p>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-200 text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Original Cost</th>
                    <th className="px-4 py-3">Source of Fund</th>
                    <th className="px-4 py-3">Program</th>
                    <th className="px-4 py-3">Project</th>
                    <th className="px-4 py-3">Variation Order</th>
                    <th className="px-4 py-3 text-right">Revised Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {variationOrders.length > 0 ? (
                    (() => {
                      let running = project.projectCost ?? 0;
                      return variationOrders.map((vo) => {
                        const original = running;
                        running += vo.amount;
                        return (
                          <tr key={vo.id} className="text-gray-700">
                            <td className="px-4 py-3 text-gray-500">{fmt(vo.date)}</td>
                            <td className="px-4 py-3">
                              {original.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3">
                              {vo.sourceOfFund
                                ? (SOURCE_OF_FUND_LABEL[vo.sourceOfFund] ?? vo.sourceOfFund)
                                : "—"}
                            </td>
                            <td className="px-4 py-3">
                              {vo.subType
                                ? (PROJECT_SUB_TYPE_LABEL[vo.subType as ProjectSubTypeValue] ?? vo.subType)
                                : "—"}
                            </td>
                            <td className="px-4 py-3">
                              {vo.program
                                ? (FUNDING_PROGRAM_LABEL[vo.program as FundingProgramValue] ?? vo.program)
                                : "—"}
                            </td>
                            <td className="px-4 py-3">
                              {vo.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold">
                              {running.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        );
                      });
                    })()
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                        No variation orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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

          <p className={fieldLabel}>Timeline Adjustment History</p>
          <div className="mt-1.5 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-160 text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">Start Date</th>
                  <th className="px-4 py-3">End Date</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Adjustment Type</th>
                  <th className="px-4 py-3">Justification Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {timelineAdjustments.length > 0 ? (
                  timelineAdjustments.map((tl) => (
                    <tr key={tl.id} className="text-gray-700 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{fmt(tl.startDate)}</td>
                      <td className="px-4 py-3 text-gray-500">{fmt(tl.endDate)}</td>
                      <td className="px-4 py-3 font-semibold">{tl.duration} Days</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                          {tl.type}
                        </span>
                      </td>
                      <td className="max-w-md px-4 py-3 italic text-gray-600">
                        {tl.justification ?? "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-gray-400"
                    >
                      No timeline adjustments recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Workforce Distribution + Project In-Charge & Profile ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Workforce Distribution */}
          <section className={`${card} lg:col-span-1`}>
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
              <div className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.348 14.652a3.75 3.75 0 010-5.304m5.304 0a3.75 3.75 0 010 5.304m-7.425 2.121a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M12 12h.008v.008H12V12z"
                  />
                </svg>
                <span className="text-[11px] font-bold uppercase tracking-wider text-green-600">
                  Live
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-sm border border-gray-200 bg-gray-50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Female
                </p>
                <div className="mt-1.5 flex items-end justify-between">
                  <p className="text-2xl font-bold text-gray-900">{project.numFemale}</p>
                  <span className="text-lg leading-none text-gray-400">♀</span>
                </div>
              </div>
              <div className="rounded-sm border border-gray-200 bg-gray-50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Male
                </p>
                <div className="mt-1.5 flex items-end justify-between">
                  <p className="text-2xl font-bold text-gray-900">{project.numMale}</p>
                  <span className="text-lg leading-none text-gray-400">♂</span>
                </div>
              </div>
              <div className="rounded-sm border border-gray-300 bg-gray-100 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-900">
                  Total
                </p>
                <div className="mt-1.5 flex items-end justify-between">
                  <p className="text-2xl font-bold text-blue-900">{project.numPersons}</p>
                  <svg
                    className="h-4.5 w-4.5 text-gray-400"
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

          {/* Project In-Charge & Profile */}
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
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                Project In-Charge &amp; Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div>
                <label className={fieldLabel}>Engineers In-Charge</label>
                <div className="mt-1.5 flex min-h-20 flex-wrap content-start items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  {engineers.length > 0 ? (
                    engineers.map((eng) => (
                      <span
                        key={eng}
                        className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-sm"
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
                <label className={fieldLabel}>Project Profile</label>
                <div className="mt-1.5 min-h-20 w-full whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm leading-relaxed text-gray-700">
                  {project.description ?? "—"}
                </div>
              </div>
            </div>
          </section>
        </div>

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

          <div className="grid gap-5 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
            {/* Document checklist — ticked by the category each file is filed
                under. Read-only: uploading is an administrator action. */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Document Checklist
                </span>
                <span className="text-[10px] font-bold tracking-wider text-gray-400">
                  {satisfiedCount}/{DOC_CHECKLIST.length}
                </span>
              </div>
              <ul className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-1">
                {DOC_CHECKLIST.map((item) => {
                  const done = satisfiedDocs.has(item.key);
                  return (
                    <li
                      key={item.key}
                      role="checkbox"
                      aria-checked={done}
                      aria-readonly
                      className="flex items-start gap-3"
                    >
                      <span
                        className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${done
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-200 bg-white"
                          }`}
                      >
                        {done && (
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 12.75 6 6 9-13.5"
                            />
                          </svg>
                        )}
                      </span>
                      <span
                        className={`text-sm leading-snug ${done ? "font-semibold text-gray-900" : "text-gray-600"}`}
                      >
                        {item.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-160 text-sm">
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
                          <DocumentAccessActions
                            projectId={projectId}
                            fileId={f.id}
                            fileName={f.fileName}
                            fileUrl={f.fileUrl}
                            requestMode="form"
                            projectTitle={project.title}
                            requesterName={me?.name ?? ""}
                            requesterEmployeeId={me?.employeeId ?? ""}
                          />
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
          </div>
        </section>

        {/* ── Activity Log (full width) — kept ── */}
        <section className={card}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
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
            <button
              onClick={handleExportLog}
              disabled={!activities?.length}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Export
            </button>
          </div>

          {activities && activities.length > 0 ? (
            <div className="rounded-sm border border-gray-100 bg-gray-50/50">
              {/* Header row */}
              <div className="hidden border-b border-gray-200 px-5 py-3 sm:grid sm:grid-cols-[190px_1fr_200px]">
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
                      className="grid grid-cols-1 gap-2 border-b border-gray-100 px-4 py-4 last:border-0 sm:grid-cols-[190px_1fr_200px] sm:items-center sm:gap-0 sm:px-5"
                    >
                      <div className="text-sm text-gray-500">
                        <p>{fmt(a.createdAt)}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(a.createdAt).toLocaleTimeString("en-PH", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
                        <span className="text-sm text-gray-700">{a.description}</span>
                      </div>
                      <div className="flex sm:justify-end">
                        <span className="inline-flex max-w-full items-center gap-2 rounded-lg border border-gray-200 bg-white py-1 pl-1 pr-3 text-xs font-medium text-gray-700 shadow-sm">
                          {a.createdBy.image ? (
                            <img
                              src={a.createdBy.image}
                              alt={a.createdBy.name ?? a.createdBy.email ?? "User"}
                              className="h-6 w-6 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                              {(a.createdBy.name ?? a.createdBy.email ?? "U")
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          )}
                          <span className="truncate">
                            {a.createdBy.name ?? a.createdBy.email}
                          </span>
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

        {/* Last updated tag */}
        <div className="text-right text-xs text-gray-400">
          Last updated: {timeAgo(project.updatedAt)}
        </div>
      </div>
    </div>
  );
}
