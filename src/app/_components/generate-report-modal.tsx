"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { api } from "~/trpc/react";
import {
  SOURCE_OF_FUND_LABEL,
  SOURCE_OF_FUND_ORDER,
  PROJECT_SUB_TYPE_LABEL,
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_ORDER,
  SOURCE_TO_SUB_TYPES,
  type SourceOfFundValue,
  type ProjectSubTypeValue,
  type ProjectStatusValue,
} from "~/lib/fund-constants";
import {
  getMunicipalitiesByDistrict,
  getBarangaysByMunicipality,
  type DavaoDistrict,
} from "~/lib/davao-del-norte-locations";
import { type ColumnDef, type ReportFormat, type ReportProject } from "../types/GenerateReportsTypes";

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
    displayLabel: "Project Cost",
    value: (p) => formatAmount(p.projectCost),
  },
  {
    key: "contractorName",
    label: "Contractor Name",
    displayLabel: "Contractor",
    value: (p) => p.contractorName ?? "—",
  },
  {
    key: "projectEngineer",
    label: "Project Engineer",
    value: (p) => p.projectEngineer ?? "—",
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
  "physicalAccomplishment",
  "financialAccomplishment",
];

const FORMAT_OPTIONS: { value: ReportFormat; label: string; description: string }[] = [
  { value: "csv", label: "CSV", description: "Comma-separated values" },
  { value: "xlsx", label: "XLSX", description: "Excel spreadsheet" },
  { value: "pdf", label: "PDF", description: "Printable document" },
];

export const GenerateReportModal = ({
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
}) => {
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED);
  const [format, setFormat] = useState<ReportFormat>("csv");
  const [filterMode, setFilterMode] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [filterSubType, setFilterSubType] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterBarangay, setFilterBarangay] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterYear, setFilterYear] = useState("");

  // District their access is limited to (DISTRICT_I/DISTRICT_II divisions),
  // or null for unrestricted divisions (SMAD/PDPM/EPM/QACD) and super admins.
  const { data: districtScope } = api.project.getMyDistrictScope.useQuery();

  if (!open) return null;

  const toggleColumn = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const allSelected = selected.length === COLUMNS.length;

  const availableSubTypes = filterSource
    ? SOURCE_TO_SUB_TYPES[filterSource as SourceOfFundValue] ?? []
    : [];

  // District 1/2 division users have a fixed district (their scope); the
  // unrestricted divisions pick one via the District filter.
  const effectiveDistrict = (districtScope ?? filterDistrict) as
    | DavaoDistrict
    | "";

  // Canonical cascade from the static location data, matching the
  // Project Location card on the add/edit project forms.
  const availableCities = getMunicipalitiesByDistrict(effectiveDistrict).map(
    (m) => m.name,
  );

  const availableBarangays = getBarangaysByMunicipality(filterCity).map(
    (b) => b.name,
  );

  const availableYears = Array.from(
    new Set(projects.map((p) => p.budgetYear).filter((y): y is string => !!y)),
  ).sort((a, b) => b.localeCompare(a));

  // Checkbox = include the column in the report; dropdown = filter the rows.
  const filterFields: {
    key: string;
    label: string;
    allLabel: string;
    accent: string;
    value: string;
    setValue: (v: string) => void;
    disabled?: boolean;
    options: { value: string; label: string }[];
  }[] = [
      {
        key: "modeOfImplementation",
        label: "Mode of Implementation",
        allLabel: "Select Mode",
        accent: "#2563EB",
        value: filterMode,
        setValue: setFilterMode,
        options: [
          { value: "BY_CONTRACT", label: "By Contract" },
          { value: "BY_ADMINISTRATION", label: "By Administration" },
        ],
      },
      {
        key: "sourceOfFund",
        label: "Source of Fund",
        allLabel: "All Sources",
        accent: "#1D4ED8",
        value: filterSource,
        setValue: (v) => {
          setFilterSource(v);
          setFilterSubType("");
        },
        options: SOURCE_OF_FUND_ORDER.map((k) => ({
          value: k,
          label: SOURCE_OF_FUND_LABEL[k],
        })),
      },
      {
        key: "subType",
        label: "Sub-Category",
        allLabel: !filterSource
          ? "Select a Source of Fund first"
          : availableSubTypes.length === 0
            ? "No Sub-Categories"
            : "All Categories",
        accent: "#7C3AED",
        value: filterSubType,
        setValue: setFilterSubType,
        disabled: !filterSource || availableSubTypes.length === 0,
        options: availableSubTypes.map((k) => ({
          value: k,
          label: PROJECT_SUB_TYPE_LABEL[k],
        })),
      },
      // Only unrestricted divisions (SMAD/PDPM/EPM/QACD) may filter by district;
      // District 1/2 divisions already see only their own district's projects.
      ...(districtScope
        ? []
        : [
          {
            key: "district",
            label: "District",
            allLabel: "All Districts",
            accent: "#16A34A",
            value: filterDistrict,
            setValue: (v: string) => {
              setFilterDistrict(v);
              setFilterCity("");
              setFilterBarangay("");
            },
            options: [
              { value: "DISTRICT_I", label: "District 1" },
              { value: "DISTRICT_II", label: "District 2" },
            ],
          },
        ]),
      {
        key: "cityMunicipality",
        label: "City/Municipality",
        allLabel: !effectiveDistrict ? "Select District first" : "All Cities",
        accent: "#D97706",
        value: filterCity,
        setValue: (v) => {
          setFilterCity(v);
          setFilterBarangay("");
        },
        disabled: !effectiveDistrict,
        options: availableCities.map((c) => ({ value: c, label: c })),
      },
      {
        key: "barangay",
        label: "Barangay",
        allLabel: !filterCity ? "Select Municipality first" : "All Barangays",
        accent: "#DC2626",
        value: filterBarangay,
        setValue: setFilterBarangay,
        disabled: !filterCity,
        options: availableBarangays.map((b) => ({ value: b, label: b })),
      },
      {
        key: "status",
        label: "Status",
        allLabel: "All Statuses",
        accent: "#0D9488",
        value: filterStatus,
        setValue: setFilterStatus,
        options: PROJECT_STATUS_ORDER.map((k) => ({
          value: k,
          label: PROJECT_STATUS_LABEL[k],
        })),
      },
      {
        key: "budgetYear",
        label: "Year",
        allLabel: "All Year",
        accent: "#334155",
        value: filterYear,
        setValue: setFilterYear,
        options: availableYears.map((y) => ({ value: y, label: `FY ${y}` })),
      },
    ];

  // Renders one row: checkbox card on the left, the field's filter dropdown
  // beside it on the right (empty cell when the field has no filter).
  const renderField = (key: string) => {
    const column = COLUMNS.find((c) => c.key === key);
    if (!column) return null;
    const filter = filterFields.find((f) => f.key === key);
    return (
      <div key={key} className="grid grid-cols-1 items-center gap-2 sm:grid-cols-2 sm:gap-6">
        <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition hover:bg-gray-50">
          <input
            type="checkbox"
            checked={selected.includes(key)}
            onChange={() => toggleColumn(key)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-gray-800">
            {filter?.label ?? column.displayLabel ?? column.label}
          </span>
        </label>
        {filter && (
          <div className="relative">
            <select
              value={filter.value}
              onChange={(e) => filter.setValue(e.target.value)}
              disabled={filter.disabled}
              style={{
                borderColor: `${filter.accent}33`,
                borderLeftColor: filter.accent,
                backgroundColor: `${filter.accent}0D`,
              }}
              className="w-full cursor-pointer appearance-none rounded-lg border border-l-4 py-2.5 pl-3.5 pr-9 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">{filter.allLabel}</option>
              {filter.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        )}
      </div>
    );
  };

  const reportProjects = projects.filter(
    (p) =>
      (!filterMode || p.modeOfImplementation === filterMode) &&
      (!filterSource || p.sourceOfFund === filterSource) &&
      (!filterSubType || p.subType === filterSubType) &&
      (!filterDistrict || p.locationImplementation === filterDistrict) &&
      (!filterCity || p.cityMunicipality === filterCity) &&
      (!filterBarangay || p.barangay === filterBarangay) &&
      (!filterStatus || p.status === filterStatus) &&
      (!filterYear || p.budgetYear === filterYear),
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
          {/* Column selection + filters */}
          <div className="mb-3 flex items-center justify-between">
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
          <div className="flex flex-col gap-4">
            {COLUMNS.map((c) => renderField(c.key))}
          </div>

          {/* Format selection */}
          <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            File Format
          </p>
          <div className="grid grid-cols-3 gap-2">
            {FORMAT_OPTIONS.map((f) => (
              <label
                key={f.value}
                className={`relative flex cursor-pointer flex-col items-center gap-0.5 rounded-lg border px-3 py-3 text-center transition ${format === f.value
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
