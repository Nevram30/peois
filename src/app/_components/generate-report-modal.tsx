"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  SOURCE_OF_FUND_LABEL,
  SOURCE_OF_FUND_ORDER,
  PROJECT_SUB_TYPE_LABEL,
  PROJECT_SUB_TYPE_VALUES,
  PROJECT_STATUS_LABEL,
  SOURCE_TO_SUB_TYPES,
  type SourceOfFundValue,
  type ProjectSubTypeValue,
  type ProjectStatusValue,
} from "~/lib/fund-constants";

export type ReportProject = {
  projectCode: string;
  title: string;
  subType: string | null;
  modeOfImplementation: string;
  locationImplementation: string;
  sourceOfFund: string;
  projectCost: number;
  contractCost: number;
  contractorName: string | null;
  projectEngineer: string | null;
  budgetYear: string | null;
  dateStarted: Date | string | null;
  targetCompletionDate: Date | string | null;
  dateCompleted: Date | string | null;
  duration: number;
  cityMunicipality: string | null;
  barangay: string | null;
  status: string;
  completionPercentage: number | null;
  disbursements?: { amount: number }[];
};

type ReportFormat = "csv" | "xlsx" | "pdf";

type ColumnDef = {
  key: string;
  label: string;
  value: (p: ReportProject) => string;
};

function formatDate(d: Date | string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatAmount(v: number): string {
  return v.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Financial Accomplishment: Percentage = (Disbursed Amount / Project Cost) * 100
function financialAccomplishment(p: ReportProject): string {
  const disbursed = (p.disbursements ?? []).reduce((sum, d) => sum + d.amount, 0);
  if (!p.projectCost) return "—";
  return `${((disbursed / p.projectCost) * 100).toFixed(1)}%`;
}

const COLUMNS: ColumnDef[] = [
  { key: "projectCode", label: "Tracking Number", value: (p) => p.projectCode },
  { key: "title", label: "Project Name", value: (p) => p.title },
  {
    key: "modeOfImplementation",
    label: "Mode of Implementation",
    value: (p) =>
      p.modeOfImplementation === "BY_CONTRACT" ? "By Contract" : "By Administration",
  },
  {
    key: "sourceOfFund",
    label: "Source of Fund",
    value: (p) =>
      SOURCE_OF_FUND_LABEL[p.sourceOfFund as SourceOfFundValue] ?? p.sourceOfFund,
  },
  {
    key: "subType",
    label: "Sub-Category",
    value: (p) =>
      p.subType
        ? PROJECT_SUB_TYPE_LABEL[p.subType as ProjectSubTypeValue] ?? p.subType
        : "—",
  },
  {
    key: "district",
    label: "District",
    value: (p) =>
      p.locationImplementation === "DISTRICT_I" ? "District 1" : "District 2",
  },
  {
    key: "cityMunicipality",
    label: "City/Municipality",
    value: (p) => p.cityMunicipality ?? "—",
  },
  { key: "barangay", label: "Barangay", value: (p) => p.barangay ?? "—" },
  {
    key: "status",
    label: "Status",
    value: (p) => PROJECT_STATUS_LABEL[p.status as ProjectStatusValue] ?? p.status,
  },
  { key: "budgetYear", label: "Budget Year", value: (p) => p.budgetYear ?? "—" },
  {
    key: "projectCost",
    label: "Project Cost (PHP)",
    value: (p) => formatAmount(p.projectCost),
  },
  {
    key: "contractCost",
    label: "Contract Cost (PHP)",
    value: (p) => formatAmount(p.contractCost),
  },
  {
    key: "contractorName",
    label: "Contractor Name",
    value: (p) => p.contractorName ?? "—",
  },
  {
    key: "projectEngineer",
    label: "Project Engineer",
    value: (p) => p.projectEngineer ?? "—",
  },
  { key: "dateStarted", label: "Date Started", value: (p) => formatDate(p.dateStarted) },
  {
    key: "targetCompletionDate",
    label: "Target Completion Date",
    value: (p) => formatDate(p.targetCompletionDate),
  },
  {
    key: "dateCompleted",
    label: "Date Completed",
    value: (p) => formatDate(p.dateCompleted),
  },
  {
    key: "duration",
    label: "Duration (days)",
    value: (p) => String(p.duration ?? 0),
  },
  {
    key: "physicalAccomplishment",
    label: "Physical Accomplishment",
    value: (p) => `${p.completionPercentage ?? 0}%`,
  },
  {
    key: "financialAccomplishment",
    label: "Financial Accomplishment",
    value: financialAccomplishment,
  },
];

const DEFAULT_SELECTED = [
  "title",
  "modeOfImplementation",
  "sourceOfFund",
  "subType",
  "district",
  "status",
  "dateStarted",
  "targetCompletionDate",
  "physicalAccomplishment",
  "financialAccomplishment",
];

const FORMAT_OPTIONS: { value: ReportFormat; label: string; description: string }[] = [
  { value: "csv", label: "CSV", description: "Comma-separated values" },
  { value: "xlsx", label: "XLSX", description: "Excel spreadsheet" },
  { value: "pdf", label: "PDF", description: "Printable document" },
];

export function GenerateReportModal({
  open,
  onClose,
  projects,
  fileName = "projects-report",
  reportTitle = "Projects Report",
}: {
  open: boolean;
  onClose: () => void;
  projects: ReportProject[];
  fileName?: string;
  reportTitle?: string;
}) {
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED);
  const [format, setFormat] = useState<ReportFormat>("csv");
  const [dateStartedFrom, setDateStartedFrom] = useState("");
  const [dateStartedTo, setDateStartedTo] = useState("");
  const [targetCompletionFrom, setTargetCompletionFrom] = useState("");
  const [targetCompletionTo, setTargetCompletionTo] = useState("");
  const [budgetYear, setBudgetYear] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [subTypeFilter, setSubTypeFilter] = useState("");

  if (!open) return null;

  const availableBudgetYears = Array.from(
    new Set(projects.map((p) => p.budgetYear).filter((y): y is string => !!y)),
  ).sort((a, b) => b.localeCompare(a));

  const toggleColumn = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const allSelected = selected.length === COLUMNS.length;

  // A project passes when the date exists and falls inside the chosen bounds;
  // the "to" bound is inclusive through the end of that day.
  const inRange = (
    date: Date | string | null,
    from: string,
    to: string,
  ): boolean => {
    if (!from && !to) return true;
    if (!date) return false;
    const time = new Date(date).getTime();
    if (from && time < new Date(`${from}T00:00:00`).getTime()) return false;
    if (to && time > new Date(`${to}T23:59:59.999`).getTime()) return false;
    return true;
  };

  const availableSubTypes = sourceFilter
    ? SOURCE_TO_SUB_TYPES[sourceFilter as SourceOfFundValue] ?? []
    : PROJECT_SUB_TYPE_VALUES;

  const reportProjects = projects.filter(
    (p) =>
      (!budgetYear || p.budgetYear === budgetYear) &&
      (!modeFilter || p.modeOfImplementation === modeFilter) &&
      (!sourceFilter || p.sourceOfFund === sourceFilter) &&
      (!subTypeFilter || p.subType === subTypeFilter) &&
      inRange(p.dateStarted, dateStartedFrom, dateStartedTo) &&
      inRange(p.targetCompletionDate, targetCompletionFrom, targetCompletionTo),
  );

  const handleGenerate = () => {
    const columns = COLUMNS.filter((c) => selected.includes(c.key));
    if (columns.length === 0) return;

    const headers = columns.map((c) => c.label);
    const rows = reportProjects.map((p) => columns.map((c) => c.value(p)));

    if (format === "csv") {
      const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
      const csv = [headers, ...rows]
        .map((r) => r.map(escape).join(","))
        .join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "xlsx") {
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      ws["!cols"] = columns.map((c) => ({
        wch: Math.max(c.label.length + 2, 14),
      }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Projects");
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } else {
      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      doc.setFontSize(14);
      doc.text(reportTitle, 40, 40);
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        `Generated on ${new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })} · ${reportProjects.length} project(s)`,
        40,
        56,
      );
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 72,
        margin: { left: 40, right: 40 },
        styles: { fontSize: 7, cellPadding: 4, overflow: "linebreak" },
        headStyles: { fillColor: [30, 58, 79], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [246, 248, 250] },
      });
      doc.save(`${fileName}.pdf`);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Generate Report</h3>
            <p className="text-xs text-gray-500">
              Select the project data to include and choose a file format.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Column selection */}
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Project Data to Include
            </p>
            <button
              onClick={() =>
                setSelected(allSelected ? [] : COLUMNS.map((c) => c.key))
              }
              className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {COLUMNS.map((c) => (
              <label
                key={c.key}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(c.key)}
                  onChange={() => toggleColumn(c.key)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {c.label}
              </label>
            ))}
          </div>

          {/* Filters */}
          <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Filters
          </p>
          <div className="flex flex-col gap-2">
            {(
              [
                {
                  label: "Budget Year",
                  value: budgetYear,
                  setValue: setBudgetYear,
                  disabled: false,
                  allLabel: "All Budget Years",
                  options: availableBudgetYears.map((y) => ({
                    value: y,
                    label: `FY ${y}`,
                  })),
                },
                {
                  label: "Mode of Implementation",
                  value: modeFilter,
                  setValue: setModeFilter,
                  disabled: false,
                  allLabel: "All Modes",
                  options: [
                    { value: "BY_CONTRACT", label: "By Contract" },
                    { value: "BY_ADMINISTRATION", label: "By Administration" },
                  ],
                },
                {
                  label: "Source of Fund",
                  value: sourceFilter,
                  setValue: (v: string) => {
                    setSourceFilter(v);
                    setSubTypeFilter("");
                  },
                  disabled: false,
                  allLabel: "All Sources",
                  options: SOURCE_OF_FUND_ORDER.map((k) => ({
                    value: k,
                    label: SOURCE_OF_FUND_LABEL[k],
                  })),
                },
                {
                  label: "Sub-Category",
                  value: subTypeFilter,
                  setValue: setSubTypeFilter,
                  disabled: !sourceFilter || availableSubTypes.length === 0,
                  allLabel: !sourceFilter
                    ? "Select a Source of Fund first"
                    : availableSubTypes.length === 0
                      ? "No Sub-Categories"
                      : "All Sub-Categories",
                  options: sourceFilter
                    ? availableSubTypes.map((k) => ({
                        value: k,
                        label: PROJECT_SUB_TYPE_LABEL[k],
                      }))
                    : [],
                },
              ] as const
            ).map((filter) => (
              <div
                key={filter.label}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-100 px-3 py-2"
              >
                <span className="w-44 shrink-0 text-sm text-gray-700">
                  {filter.label}
                </span>
                <div className="relative">
                  <select
                    value={filter.value}
                    onChange={(e) => filter.setValue(e.target.value)}
                    disabled={filter.disabled}
                    className="appearance-none rounded-lg border border-gray-200 py-1.5 pl-2.5 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="">{filter.allLabel}</option>
                    {filter.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
                {filter.value && (
                  <button
                    onClick={() => filter.setValue("")}
                    className="cursor-pointer text-xs font-medium text-red-500 hover:text-red-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Date range selection */}
          <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Date Range
          </p>
          <div className="flex flex-col gap-2">
            {(
              [
                {
                  label: "Date Started",
                  from: dateStartedFrom,
                  to: dateStartedTo,
                  setFrom: setDateStartedFrom,
                  setTo: setDateStartedTo,
                },
                {
                  label: "Target Completion Date",
                  from: targetCompletionFrom,
                  to: targetCompletionTo,
                  setFrom: setTargetCompletionFrom,
                  setTo: setTargetCompletionTo,
                },
              ] as const
            ).map((range) => (
              <div
                key={range.label}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-100 px-3 py-2"
              >
                <span className="w-44 shrink-0 text-sm text-gray-700">
                  {range.label}
                </span>
                <input
                  type="date"
                  value={range.from}
                  max={range.to || undefined}
                  onChange={(e) => range.setFrom(e.target.value)}
                  className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-400">to</span>
                <input
                  type="date"
                  value={range.to}
                  min={range.from || undefined}
                  onChange={(e) => range.setTo(e.target.value)}
                  className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {(range.from || range.to) && (
                  <button
                    onClick={() => {
                      range.setFrom("");
                      range.setTo("");
                    }}
                    className="cursor-pointer text-xs font-medium text-red-500 hover:text-red-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            ))}
            <p className="text-[11px] text-gray-400">
              Leave empty to include all projects. Projects without the selected
              date are excluded when a range is set.
            </p>
          </div>

          {/* Format selection */}
          <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            File Format
          </p>
          <div className="grid grid-cols-3 gap-2">
            {FORMAT_OPTIONS.map((f) => (
              <label
                key={f.value}
                className={`flex cursor-pointer flex-col items-center gap-0.5 rounded-lg border px-3 py-3 text-center transition ${
                  format === f.value
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="report-format"
                  value={f.value}
                  checked={format === f.value}
                  onChange={() => setFormat(f.value)}
                  className="sr-only"
                />
                <span
                  className={`text-sm font-bold ${format === f.value ? "text-blue-700" : "text-gray-800"}`}
                >
                  {f.label}
                </span>
                <span className="text-[11px] text-gray-400">{f.description}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer — Cancel & Generate at bottom right */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <p className="text-xs text-gray-400">
            {reportProjects.length} project(s) · {selected.length} column(s)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={selected.length === 0 || reportProjects.length === 0}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
