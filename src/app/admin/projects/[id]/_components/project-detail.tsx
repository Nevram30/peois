"use client";

import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/react";
import {
  PROJECT_STATUS_LABEL,
  PROJECT_SUB_TYPE_LABEL,
  SOURCE_OF_FUND_LABEL,
  DISBURSEMENT_TYPE_LABEL,
  FUNDING_PROGRAM_LABEL,
  PROJECT_ACCOUNT_LABEL,
  type ProjectStatusValue,
  type ProjectSubTypeValue,
  type SourceOfFundValue,
  type FundingProgramValue,
} from "~/lib/fund-constants";
import {
  SLIPPAGE_STAGE_VALUES,
  SLIPPAGE_STAGE_CONFIG,
  computeSlippage,
  formatSlippage,
  getSlippageStageConfig,
} from "~/lib/slippage";
import { GeospatialSummary } from "~/app/_components/geospatial-summary";
import { MODE_LABELS } from "~/app/admin/_components/admin-constant/constant";

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

const ADJUSTMENT_TYPE_PILL: Record<string, string> = {
  EXTENSION: "bg-blue-50 text-blue-600 border border-blue-200",
  SUSPENSION: "bg-red-50 text-red-600 border border-red-200",
  RESUMPTION: "bg-green-50 text-green-600 border border-green-200",
  REVISION: "bg-amber-50 text-amber-600 border border-amber-200",
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

const initials = (name?: string | null, email?: string | null) => {
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

const peso = (n: number | null | undefined) => {
  const v = typeof n === "number" ? n : 0;
  return `₱ ${v.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

const card = "rounded-sm border border-gray-200 bg-white p-4 shadow-sm sm:p-6";
const sectionTitle = "flex items-center gap-2 border-b border-gray-100 pb-4 mb-5";
const fieldLabel = "text-[11px] font-semibold uppercase tracking-wider text-gray-400";
const fieldText = "mt-1 w-full text-sm font-medium text-gray-800";

// ─── Identity & Location cards ───────────────────────────────────────────
// These two cards mirror the add/edit forms field for field, so a record reads
// the same wherever it is opened. The boxes here only look like inputs — the
// page stays read-only and the pencil in each header is the way into the form.
const cardShell = "rounded-sm border border-gray-200 bg-white shadow-sm";
const boxLabel = "mb-1.5 block text-sm font-bold text-gray-600";
const box =
  "block w-full truncate rounded-sm border border-gray-200 bg-white px-3.5 py-2.5 text-sm shadow-sm";

const InfoIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
    />
  </svg>
);

const PinIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);

const PencilIcon = (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z"
    />
  </svg>
);

const CardHeader = ({
  icon,
  title,
  editHref,
}: {
  icon: React.ReactNode;
  title: string;
  editHref: string;
}) => (
  <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-5 py-3.5">
    <div className="flex items-center gap-2">
      <span className="text-blue-500">{icon}</span>
      <span className="text-xs font-bold uppercase tracking-widest text-gray-700">
        {title}
      </span>
    </div>
    <Link
      href={editHref}
      aria-label={`Edit ${title}`}
      className="text-gray-400 transition hover:text-gray-600"
    >
      {PencilIcon}
    </Link>
  </div>
);

// `chevron` matches the dropdowns of the form this card mirrors; it is a marker
// of where a value is chosen from a list, not a control — nothing opens here.
const ViewField = ({
  label,
  value,
  chevron = false,
  muted = false,
}: {
  label: string;
  value: string;
  chevron?: boolean;
  muted?: boolean;
}) => (
  <div className="min-w-0">
    <label className={boxLabel}>{label}</label>
    <div className="relative">
      <div
        className={`${box} ${muted ? "text-gray-400" : "text-gray-900"} ${chevron ? "pr-9" : ""}`}
      >
        {value}
      </div>
      {chevron && (
        <svg
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      )}
    </div>
  </div>
);

interface Props {
  projectId: string;
}

export const ProjectDetail = ({ projectId }: Props) => {
  const { data: project, isLoading } = api.project.getById.useQuery({ id: projectId });
  const { data: activities } = api.projectActivity.getByProjectId.useQuery({ projectId });
  const { data: disbursements } = api.project.getDisbursements.useQuery({ projectId });
  const { data: variationOrders } = api.project.getVariationOrders.useQuery({ projectId });
  const { data: timelineAdjustments } = api.project.getTimelineAdjustments.useQuery({ projectId });
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
          href="/admin/projects"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  const editHref = `/admin/projects/${projectId}/edit`;
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

  // Balances — mirror the edit form's calculations so the view is consistent.
  // Disbursements draw down the Project Cost first; once the Primary Fund is exhausted,
  // any excess is automatically deducted from the Variation Order so neither goes negative.
  const totalDisb = (disbursements ?? []).reduce((s, d) => s + d.amount, 0);
  const totalVariationOrder = (variationOrders ?? []).reduce((s, v) => s + v.amount, 0);
  const rawPrimary = (project.projectCost ?? 0) - totalDisb;
  const primaryFundBalance = Math.max(0, rawPrimary);
  const overflow = Math.max(0, -rawPrimary);
  const variationOrderBalance = Math.max(0, totalVariationOrder - overflow);
  const totalRemainingBalance = primaryFundBalance + variationOrderBalance;

  // Slippage is always derived from the two figures on file, never stored.
  const slippage =
    project.slippageTarget !== null && project.slippageActual !== null
      ? computeSlippage(project.slippageTarget, project.slippageActual)
      : null;
  const slippageStage =
    slippage !== null ? getSlippageStageConfig(slippage) : null;

  const engineers = (project.projectEngineer ?? "")
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const handleExportLog = () => {
    if (!activities || activities.length === 0) return;
    const headers = [
      "Timestamp",
      "Administrator",
      "Source of Fund",
      "Justification Record",
      "Auth Status",
    ];
    const rows = activities.map((a) => [
      new Date(a.createdAt).toLocaleString("en-PH"),
      `"${(a.createdBy.name ?? a.createdBy.email ?? "").replace(/"/g, '""')}"`,
      sourceLabel,
      `"${a.description.replace(/"/g, '""')}"`,
      "VERIFIED",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-log-${project.projectCode}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb + Edit action */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-7 border-gray-200 bg-white">
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
          <Link href="/admin/dashboard" className="hover:text-gray-600">Dashboard</Link>
          <span>/</span>
          <Link href="/admin/projects" className="hover:text-gray-700">
            Projects
          </Link>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          <span className="font-medium text-gray-900">Project Details</span>
        </nav>

        <Link
          href={`/admin/projects/${projectId}/edit`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
          </svg>
          UpdateProject
        </Link>
      </div>

      <div className="space-y-6 px-4 py-8 sm:px-6">
        {/* ── Identity & Status (2/3) beside Location (1/3) ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Project Identity & Status */}
          <section className={`${cardShell} lg:col-span-2`}>
            <CardHeader
              icon={InfoIcon}
              title="Project Identity & Status"
              editHref={editHref}
            />

            <div className="space-y-4 p-5">
              {/* Project image — full-width banner */}
              <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-gray-200 bg-gray-50">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-300">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"
                      />
                    </svg>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      No Image Uploaded
                    </p>
                  </div>
                )}
                <span className="absolute top-3 left-3 rounded-md bg-gray-900/90 px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider text-white">
                  #{project.projectCode}
                </span>
              </div>

              <ViewField label="Project Title" value={project.title} />

              <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                <ViewField label="Project Cost" value={peso(project.projectCost)} />
                {/* As Per Plan mirrors the Target Completion Date on file. */}
                <ViewField
                  label="As Per Plan"
                  value={fmt(project.targetCompletionDate)}
                  muted={!project.targetCompletionDate}
                />
                <ViewField label="Current Status" value={statusLabel} chevron />
                <ViewField label="Project I.D." value={project.projectCode} />
                <ViewField
                  label="Implementation Mode"
                  value={
                    MODE_LABELS[project.modeOfImplementation] ??
                    project.modeOfImplementation
                  }
                  chevron
                />
                <ViewField
                  label="Contractor Name"
                  value={project.contractorName ?? "—"}
                  muted={!project.contractorName}
                />
              </div>

              {/* Progress */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-gray-600">
                    Physical Progress
                  </span>
                  <span className="text-xs font-bold text-blue-600">
                    {project.completionPercentage}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-700 transition-all"
                    style={{ width: `${project.completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Project Location */}
          <section className={cardShell}>
            <CardHeader icon={PinIcon} title="Project Location" editHref={editHref} />

            <div className="space-y-3 p-5">
              {/* The card is a third of the row, so the administrative levels
                  stack instead of sitting side by side */}
              <ViewField label="District" value={districtLabel} chevron />
              <ViewField
                label="City / Municipality"
                value={project.cityMunicipality ?? "—"}
                muted={!project.cityMunicipality}
                chevron
              />
              <ViewField
                label="Barangay"
                value={project.barangay ?? "—"}
                muted={!project.barangay}
                chevron
              />
              <div className="grid grid-cols-2 gap-3">
                <ViewField
                  label="Purok"
                  value={project.purok ?? "—"}
                  muted={!project.purok}
                  chevron
                />
                <ViewField
                  label="Sitio"
                  value={project.sitio ?? "N/A"}
                  muted={!project.sitio}
                />
              </div>

              {/* ── Geospatial Data ── */}
              <div className="border-t border-gray-100 pt-4">
                <GeospatialSummary
                  latitude={project.latitude}
                  longitude={project.longitude}
                  labelClassName={boxLabel}
                  valueClassName={`${box} text-gray-900`}
                  mapClassName="h-150"
                />
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

          {/* Every field here is a dropdown on the form, so they all carry the
              chevron marker. */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
            <ViewField
              label="Budget Year"
              value={project.budgetYear ?? "\u2014"}
              muted={!project.budgetYear}
              chevron
            />
            <ViewField
              label="Program"
              value={programLabel}
              muted={!project.program}
              chevron
            />
            <ViewField
              label="Source of Fund"
              value={sourceLabel}
              muted={!project.sourceOfFund}
              chevron
            />
            <ViewField
              label="Project"
              value={subTypeLabel}
              muted={!project.subType}
              chevron
            />
            <ViewField
              label="Supplemental Budget Year"
              value={project.supplementalBudgetYear ?? "\u2014"}
              muted={!project.supplementalBudgetYear}
              chevron
            />
            <ViewField
              label="Project Account"
              value={projectAccountLabel}
              muted={!project.projectAccount}
              chevron
            />
            <ViewField
              label="Supplemental Budget Number"
              value={project.supplementalBudgetNumber ?? "\u2014"}
              muted={!project.supplementalBudgetNumber}
              chevron
            />
            <ViewField
              label="* LANDBANK [LBP-TL#]"
              value={project.landbankNumber ?? "\u2014"}
              muted={!project.landbankNumber}
              chevron
            />
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
            <div>
              <p className="text-sm font-bold text-blue-800">Total Remaining Balance</p>
              <p className="mt-1 text-xl font-extrabold text-blue-900">{peso(totalRemainingBalance)}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-blue-800">Primary Fund Balance</p>
              <p className="mt-1 text-lg font-extrabold text-gray-900">{peso(primaryFundBalance)}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-blue-800">Variation Order Balance</p>
              <p className="mt-1 text-lg font-extrabold text-gray-900">{peso(variationOrderBalance)}</p>
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
                  {variationOrders && variationOrders.length > 0 ? (
                    (() => {
                      let running = project.projectCost ?? 0;
                      return variationOrders.map((v) => {
                        const original = running;
                        running += v.amount;
                        return (
                          <tr key={v.id} className="text-gray-700">
                            <td className="px-4 py-3 text-gray-500">{fmt(v.date)}</td>
                            <td className="px-4 py-3">
                              {original.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3">
                              {v.sourceOfFund
                                ? (SOURCE_OF_FUND_LABEL[v.sourceOfFund] ?? v.sourceOfFund)
                                : "—"}
                            </td>
                            <td className="px-4 py-3">
                              {v.program
                                ? (FUNDING_PROGRAM_LABEL[v.program as FundingProgramValue] ?? v.program)
                                : "—"}
                            </td>
                            <td className="px-4 py-3">
                              {v.subType
                                ? (PROJECT_SUB_TYPE_LABEL[v.subType as ProjectSubTypeValue] ?? v.subType)
                                : "—"}
                            </td>
                            <td className="px-4 py-3">
                              {v.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
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

          {/* Timeline Adjustment History */}
          <div>
            <p className={`${fieldLabel} mb-2`}>Timeline Adjustment History</p>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
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
                  {timelineAdjustments && timelineAdjustments.length > 0 ? (
                    timelineAdjustments.map((t) => (
                      <tr key={t.id} className="text-gray-700">
                        <td className="px-4 py-3 text-gray-600">{fmt(t.startDate)}</td>
                        <td className="px-4 py-3 text-gray-600">{fmt(t.endDate)}</td>
                        <td className="px-4 py-3 font-semibold text-gray-800">{t.duration} Days</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${ADJUSTMENT_TYPE_PILL[t.type] ?? "bg-gray-50 text-gray-600 border border-gray-200"}`}
                          >
                            {t.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 italic text-gray-600">
                          {t.justification ?? "—"}
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
          </div>
        </section>

        {/* ── Slippage ── */}
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
                d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
              />
            </svg>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
              Slippage
            </h2>
          </div>

          <div className="flex flex-wrap items-stretch gap-4">
            {/* Readout — actual minus target, with its stage */}
            <div
              className={`flex min-w-70 flex-1 items-center justify-between gap-4 rounded-sm border px-4 py-3 ${slippageStage ? slippageStage.tile : "border-gray-200 bg-gray-50"
                }`}
            >
              <div>
                <p
                  className={`text-[10px] font-bold uppercase tracking-widest ${slippageStage ? slippageStage.text : "text-gray-400"
                    }`}
                >
                  Slippage
                </p>
                <p
                  className={`mt-0.5 text-3xl font-extrabold ${slippageStage ? slippageStage.text : "text-gray-300"
                    }`}
                >
                  {slippage !== null ? formatSlippage(slippage) : "—"}
                  <span className="ml-0.5 text-base font-bold">%</span>
                </p>
              </div>
              {slippageStage && (
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${slippageStage.badge}`}
                >
                  {slippageStage.label}
                </span>
              )}
            </div>

            <div className="w-full shrink-0 sm:w-40">
              <label className={fieldLabel}>Target %</label>
              <div className={fieldText}>
                {project.slippageTarget !== null
                  ? `${project.slippageTarget.toFixed(2)}%`
                  : "—"}
              </div>
            </div>
            <div className="w-full shrink-0 sm:w-40">
              <label className={fieldLabel}>Actual %</label>
              <div className={fieldText}>
                {project.slippageActual !== null
                  ? `${project.slippageActual.toFixed(2)}%`
                  : "—"}
              </div>
            </div>
            <div className="w-full shrink-0 sm:w-32">
              <label className={fieldLabel}>Revision</label>
              <div className={fieldText}>Rev. {project.slippageRevision}</div>
            </div>
          </div>

          {/* Prescribed action for the stage on file */}
          {slippageStage ? (
            <p className="mt-3 text-xs text-gray-500">
              <span className="font-semibold text-gray-700">
                {slippageStage.label}:
              </span>{" "}
              {slippageStage.action}
              <span className="ml-1 text-gray-400">
                — filed as Rev. {project.slippageRevision}.
              </span>
            </p>
          ) : (
            <p className="mt-3 text-xs text-gray-400">
              No slippage assessment has been filed for this project yet.
            </p>
          )}

          {/* Stage legend */}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gray-100 pt-4">
            {SLIPPAGE_STAGE_VALUES.map((stage) => {
              const cfg = SLIPPAGE_STAGE_CONFIG[stage];
              return (
                <span key={stage} className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {cfg.range}: {cfg.label}
                  </span>
                </span>
              );
            })}
          </div>
        </section>

        {/* ── Workforce Distribution + Project In-Charge & Profile ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Workforce Distribution */}
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
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                <svg
                  className="h-3.5 w-3.5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.348 14.652a3.75 3.75 0 010-5.304m5.304 0a3.75 3.75 0 010 5.304m-7.425 2.121a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M12 12h.008v.008H12V12z"
                  />
                </svg>
                Live
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Female
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900">{project.numFemale}</p>
                  <span className="text-xl leading-none text-gray-400">♀</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Male
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900">{project.numMale}</p>
                  <span className="text-xl leading-none text-gray-400">♂</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Total
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900">{project.numPersons}</p>
                  <svg
                    className="h-5 w-5 shrink-0 text-gray-400"
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
                {engineers.length > 0 ? (
                  <div className={fieldText}>
                    {engineers.map((eng) => (
                      <p key={eng}>{eng}</p>
                    ))}
                  </div>
                ) : (
                  <div className={fieldText}>—</div>
                )}
              </div>
              <div>
                <label className={fieldLabel}>Project Profile</label>
                <div className={`${fieldText} whitespace-pre-wrap`}>
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

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-160 text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">File Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Upload Date</th>
                  <th className="px-4 py-3">Uploaded By</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {files && files.length > 0 ? (
                  files.map((f) => (
                    <tr key={f.id} className="text-gray-700">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {f.fileType === "IMAGE" ? (
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
                                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-4 w-4 text-red-500"
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
                          )}
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
                      <td className="px-4 py-3 text-gray-700">
                        {f.createdBy.name ?? f.createdBy.email ?? "—"}
                      </td>
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
                      colSpan={5}
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

        {/* ── Administrative Update History / Audit Trail ── */}
        <section className={card}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
              Administrative Update History Audit Trail
            </h2>
            <button
              type="button"
              onClick={handleExportLog}
              disabled={!activities || activities.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
              Export Log
            </button>
          </div>

          {activities && activities.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <div className="max-h-210 overflow-y-auto">
                <table className="w-full min-w-150 border-separate border-spacing-0 text-sm">
                  <thead className="sticky top-0 z-10 bg-gray-50">
                    <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 [&>th]:border-b [&>th]:border-gray-200">
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">Administrator</th>
                      <th className="px-4 py-3">Source of Fund</th>
                      <th className="px-4 py-3">Justification Record</th>
                      <th className="px-4 py-3 text-right">Auth Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {activities.map((a) => (
                      <tr key={a.id} className="text-gray-700">
                        <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                          {new Date(a.createdAt).toLocaleDateString("en-PH", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          {" · "}
                          {new Date(a.createdAt).toLocaleTimeString("en-PH", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            {a.createdBy.image ? (
                              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                                <Image
                                  src={a.createdBy.image}
                                  alt={a.createdBy.name ?? a.createdBy.email ?? "User"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e3a8a] text-[10px] font-bold text-white">
                                {initials(a.createdBy.name, a.createdBy.email)}
                              </span>
                            )}
                            <span className="font-semibold text-gray-800">
                              {a.createdBy.name ?? a.createdBy.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{sourceLabel}</td>
                        <td className="px-4 py-3 italic text-gray-600">{a.description}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex rounded-md border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-600">
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-400">
              No administrative updates logged yet.
            </p>
          )}
        </section>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4 pb-8">
          <Link
            href="/admin/projects"
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

          <span className="text-xs text-gray-400">
            Last updated: {timeAgo(project.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
