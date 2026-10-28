"use client";

import { useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { api } from "~/trpc/react";
import { formatPeso } from "~/helper/formatter";
import { PROJECT_SUB_TYPE_LABEL, type ProjectSubTypeValue, SOURCE_OF_FUND_ORDER } from "~/lib/fund-constants";
import { MODE_LABELS, REM_SOURCE_LABEL, SOURCE_COLORS, SOURCE_SHORT_LABEL } from "../admin-constant/constant";
import { DISTRICT_META } from "../admin-charts/district-progress-section";
import { FyBadge } from "./cards";
import { FinancialCardSkeleton } from "./skeleton.cards";

const ALL = "all";

type Project = {
    id: string;
    projectCode: string;
    title: string;
    locationImplementation: string | null;
    modeOfImplementation: string;
    sourceOfFund: string;
    subType: string | null;
    supplementalBudgetNumber: string | null;
    supplementalBudgetYear: string | null;
    landbankNumber: string | null;
    projectCost: number;
    disbursements: { amount: number }[];
    variationOrders: { amount: number; sourceOfFund: string | null }[];
};

type Row = {
    id: string;
    district: string;
    mode: string;
    projectCode: string;
    title: string;
    subType: string;
    // Supplemental Budget No. (with its year) and LBP Term Loan number, "—" if none.
    sbNo: string;
    lbpNo: string;
    // Project cost charged to this source.
    allocation: number;
    // Project cost plus variation orders charged to this source.
    total: number;
    disbursed: number;
    remaining: number;
};

type Group = { src: string; label: string; color: string; total: number; rows: Row[] };

// Which card the table reports on: the amounts shown per row, and the one each
// source subtotal and the grand total add up.
type Report = "allocation" | "remaining" | "disbursed";

type Column = { label: string; value: (r: Row) => number };

const REPORTS: Record<
    Report,
    { heading: string; subtitle: string; footer: string; sourceLabel: Record<string, string>; columns: Column[]; value: (r: Row) => number }
> = {
    allocation: {
        heading: "SOURCE BREAKDOWN PER PROJECT",
        subtitle: "Annual allocation per source of fund, down to the projects that make it up",
        footer: "Total Combined Allocation",
        sourceLabel: SOURCE_SHORT_LABEL,
        columns: [
            { label: "Allocation", value: (r) => r.allocation },
            { label: "Total", value: (r) => r.total },
        ],
        value: (r) => r.total,
    },
    remaining: {
        heading: "REMAINING BALANCE PER PROJECT",
        subtitle: "Remaining balance from annual allocation per source of fund, down to the project",
        footer: "Grand Total Balance",
        sourceLabel: REM_SOURCE_LABEL,
        columns: [
            { label: "Allocation", value: (r) => r.total },
            { label: "Disbursed", value: (r) => r.disbursed },
            { label: "Remaining Balance", value: (r) => r.remaining },
        ],
        value: (r) => r.remaining,
    },
    disbursed: {
        heading: "DISBURSEMENT PER PROJECT",
        subtitle: "Disbursement summary per source of fund, down to the project",
        footer: "Total Disbursement",
        sourceLabel: REM_SOURCE_LABEL,
        columns: [
            { label: "Allocation", value: (r) => r.total },
            { label: "Remaining Balance", value: (r) => r.remaining },
            { label: "Disbursed", value: (r) => r.disbursed },
        ],
        value: (r) => r.disbursed,
    },
};

// # District, Implementation, Project Code, Project Title, Sub-Type, SB No.,
// LBP-TL# come before the amounts.
const LEADING_COLUMNS = 8;

const sbLabel = (no: string | null, year: string | null) => {
    const n = no?.trim();
    if (!n) return "—";
    const y = year?.trim();
    return y ? `SB No. ${n} (${y})` : `SB No. ${n}`;
};

// Implementation modes the tables can be narrowed to. Unassigned projects
// only show under All.
const MODE_FILTERS = ["BY_ADMINISTRATION", "BY_CONTRACT"] as const;

const districtLabel = (d: string | null) => (d ? (DISTRICT_META[d]?.short ?? d.replace("_", " ")) : "—");
const subTypeLabel = (s: string | null) => (s ? (PROJECT_SUB_TYPE_LABEL[s as ProjectSubTypeValue] ?? s) : "—");
const formatPct = (value: number) => `${Number(value.toFixed(2)).toLocaleString("en-PH")}%`;

// One row per project per source of fund, counted the same way as the cards:
// the project cost goes to the project's own source, and each variation order
// to the source it is charged against (falling back to the project's). A
// project whose orders are charged elsewhere shows under both.
//
// Disbursements follow getRemainingBalance: they draw down the project cost
// first, any excess eats into the variation orders in turn, and whatever is
// left over still counts against the project's own source. No balance goes
// below zero.
const toGroups = (projects: Project[], report: Report): Group[] => {
    const bySource = new Map<string, Map<string, Row>>();
    const rowFor = (p: Project, src: string) => {
        let rows = bySource.get(src);
        if (!rows) bySource.set(src, (rows = new Map<string, Row>()));
        let row = rows.get(p.id);
        if (!row) {
            row = {
                id: `${src}-${p.id}`,
                district: districtLabel(p.locationImplementation),
                mode: MODE_LABELS[p.modeOfImplementation] ?? p.modeOfImplementation,
                projectCode: p.projectCode,
                title: p.title,
                subType: subTypeLabel(p.subType),
                sbNo: sbLabel(p.supplementalBudgetNumber, p.supplementalBudgetYear),
                lbpNo: p.landbankNumber?.trim() ? p.landbankNumber.trim() : "—",
                allocation: 0,
                total: 0,
                disbursed: 0,
                remaining: 0,
            };
            rows.set(p.id, row);
        }
        return row;
    };

    for (const p of projects) {
        const disbursed = p.disbursements.reduce((s, d) => s + d.amount, 0);
        const rawPrimary = p.projectCost - disbursed;
        let overflow = Math.max(0, -rawPrimary);

        if (p.projectCost > 0) {
            const row = rowFor(p, p.sourceOfFund);
            row.allocation += p.projectCost;
            row.total += p.projectCost;
            row.remaining += Math.max(0, rawPrimary);
            row.disbursed += Math.min(disbursed, p.projectCost);
        }
        for (const vo of p.variationOrders) {
            if (vo.amount <= 0) continue;
            const consumed = Math.min(overflow, vo.amount);
            overflow -= consumed;
            const row = rowFor(p, vo.sourceOfFund ?? p.sourceOfFund);
            row.total += vo.amount;
            row.remaining += vo.amount - consumed;
            row.disbursed += consumed;
        }
        if (overflow > 0) rowFor(p, p.sourceOfFund).disbursed += overflow;
    }

    const { sourceLabel, value } = REPORTS[report];
    // Known sources first, in the cards' order, then any unmapped ones.
    const ordered = [...SOURCE_OF_FUND_ORDER, "CONFIDENTIAL", ...bySource.keys()].filter(
        (src, i, arr) => arr.indexOf(src) === i && bySource.has(src),
    );
    return ordered.map((src) => {
        const rows = [...bySource.get(src)!.values()].sort(
            (a, b) => a.subType.localeCompare(b.subType) || a.projectCode.localeCompare(b.projectCode),
        );
        return {
            src,
            label: sourceLabel[src] ?? src,
            color: SOURCE_COLORS[src] ?? "#94a3b8",
            total: rows.reduce((s, r) => s + value(r), 0),
            rows,
        };
    });
};

const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Prints the table on its own page, so the dashboard around it stays out of
// the printout.
const printTable = (groups: Group[], grandTotal: number, report: Report, heading: string, budgetYear: string, mode: string) => {
    const win = window.open("", "_blank", "width=1000,height=700");
    if (!win) return;
    const { subtitle, footer, columns } = REPORTS[report];
    const span = LEADING_COLUMNS + columns.length - 1;
    let n = 0;
    const body = groups
        .map((g) => {
            const rows = g.rows
                .map(
                    (r) => `<tr>
                        <td class="num">${++n}</td>
                        <td>${escapeHtml(r.district)}</td>
                        <td>${escapeHtml(r.mode)}</td>
                        <td>${escapeHtml(r.projectCode)}</td>
                        <td>${escapeHtml(r.title)}</td>
                        <td>${escapeHtml(r.subType)}</td>
                        <td>${escapeHtml(r.sbNo)}</td>
                        <td>${escapeHtml(r.lbpNo)}</td>
                        ${columns.map((c) => `<td class="num">${formatPeso(c.value(r))}</td>`).join("")}
                    </tr>`,
                )
                .join("");
            const pct = grandTotal > 0 ? (g.total / grandTotal) * 100 : 0;
            return `<tr class="group"><td colspan="${span}">${escapeHtml(g.label)} · ${g.rows.length} project${g.rows.length === 1 ? "" : "s"} · ${formatPct(pct)}</td><td class="num">${formatPeso(g.total)}</td></tr>${rows}`;
        })
        .join("");
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(heading)}</title>
        <style>
            body { font-family: Arial, sans-serif; color: #0f172a; margin: 24px; }
            h1 { font-size: 16px; color: #1e3a8a; margin: 0 0 4px; letter-spacing: .05em; }
            p { font-size: 11px; color: #475569; margin: 0 0 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th, td { border: 1px solid #cbd5e1; padding: 5px 7px; text-align: left; vertical-align: top; }
            th { background: #1e3a8a; color: #fff; font-weight: bold; }
            .num { text-align: right; white-space: nowrap; }
            tr.group td { font-weight: bold; background: #e2e8f0; }
            tfoot td { font-weight: bold; background: #f1f5f9; }
            thead { display: table-header-group; }
            tr { page-break-inside: avoid; }
        </style></head><body>
        <h1>${escapeHtml(heading)}</h1>
        <p>${escapeHtml(budgetYear ? `CY ${budgetYear}` : "All calendar years")} · ${escapeHtml(mode === ALL ? "All implementation modes" : (MODE_LABELS[mode] ?? mode))} · ${escapeHtml(subtitle)}</p>
        <table>
            <thead><tr><th class="num">#</th><th>District</th><th>Implementation</th><th>Project Code</th><th>Project Title</th><th>Sub-Type</th><th>Supplemental Budget No.</th><th>LBP Term Loan No.</th>${columns.map((c) => `<th class="num">${escapeHtml(c.label)}</th>`).join("")}</tr></thead>
            <tbody>${body}</tbody>
            <tfoot><tr><td colspan="${span}">${escapeHtml(footer)}</td><td class="num">${formatPeso(grandTotal)}</td></tr></tfoot>
        </table>
        </body></html>`);
    win.document.close();
    win.focus();
    win.print();
};

// ── Section ────────────────────────────────────────────────────
// A financial card's figures as a record table: every source of fund with its
// subtotal, and the projects that make it up. `report` picks the card — the
// Annual Allocation & Source Breakdown, the Remaining Balance or the
// Disbursement Summary. Office
// divisions (SMAD/PDPM/EPM/QACD) can narrow it to one district; the district
// admins are already scoped to their own by the server.
export const AllocationRecordsTable = ({ budgetYear, report = "allocation" }: { budgetYear: string; report?: Report }) => {
    const { data, isLoading } = api.project.getAllocationRecords.useQuery(budgetYear ? { budgetYear } : undefined);
    const { data: districtScope, isLoading: scopeLoading } = api.project.getMyDistrictScope.useQuery();
    const isOfficeDivision = !scopeLoading && districtScope == null;
    const [district, setDistrict] = useState<string>(ALL);
    const activeDistrict = isOfficeDivision ? district : ALL;
    // Every division can filter by mode of implementation.
    const [mode, setMode] = useState<string>(ALL);

    const groups = useMemo(
        () =>
            toGroups(
                (data ?? []).filter(
                    (p) =>
                        (activeDistrict === ALL || p.locationImplementation === activeDistrict) &&
                        (mode === ALL || p.modeOfImplementation === mode),
                ),
                report,
            ),
        [data, activeDistrict, mode, report],
    );
    const { subtitle, footer, columns } = REPORTS[report];
    const span = LEADING_COLUMNS + columns.length - 1;
    const grandTotal = groups.reduce((s, g) => s + g.total, 0);
    const projectCount = groups.reduce((s, g) => s + g.rows.length, 0);
    const heading =
        activeDistrict === ALL
            ? REPORTS[report].heading
            : `${DISTRICT_META[activeDistrict]?.label ?? activeDistrict} ${REPORTS[report].heading}`;

    if (isLoading) {
        return (
            <div className="mb-3">
                <FinancialCardSkeleton />
            </div>
        );
    }

    let n = 0;
    return (
        <div className="mb-3 overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 p-4 sm:px-5">
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-[12px] font-extrabold uppercase tracking-widest text-slate-800">{heading}</p>
                        <FyBadge year={budgetYear} />
                    </div>
                    <p className="mt-0.5 text-[10px] text-slate-500">{subtitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {isOfficeDivision && (
                        <label className="flex items-center gap-2">
                            <span className="text-[11px] font-bold tracking-wide text-slate-600">DISTRICT</span>
                            <select
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            >
                                <option value={ALL}>All districts</option>
                                {Object.entries(DISTRICT_META).map(([key, meta]) => (
                                    <option key={key} value={key}>
                                        {meta.short}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}
                    <label className="flex items-center gap-2">
                        <span className="text-[11px] font-bold tracking-wide text-slate-600">IMPLEMENTATION</span>
                        <select
                            value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        >
                            <option value={ALL}>All modes</option>
                            {MODE_FILTERS.map((m) => (
                                <option key={m} value={m}>
                                    {MODE_LABELS[m]}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        type="button"
                        onClick={() => printTable(groups, grandTotal, report, heading, budgetYear, mode)}
                        disabled={!groups.length}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold tracking-wide text-[#1e3a8a] transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                        PRINT
                    </button>
                </div>
            </div>

            {!groups.length ? (
                <div className="border-t border-slate-200 p-10 text-center text-sm text-slate-400">
                    No allocation recorded
                    {activeDistrict === ALL ? "" : ` for ${DISTRICT_META[activeDistrict]?.short ?? activeDistrict}`}
                    {mode === ALL ? "" : ` ${(MODE_LABELS[mode] ?? mode).toLowerCase()}`}
                    {budgetYear ? ` in CY ${budgetYear}` : ""}.
                </div>
            ) : (
                <div className="max-h-[520px] overflow-auto border-t border-slate-200">
                    <table className="w-full min-w-[1100px] text-left text-[11px]">
                        <thead className="sticky top-0 z-10 bg-[#1e3a8a] text-[10px] font-bold uppercase tracking-wide text-white">
                            <tr>
                                <th className="px-3 py-2 text-right">#</th>
                                <th className="px-3 py-2">District</th>
                                <th className="px-3 py-2">Implementation</th>
                                <th className="px-3 py-2">Project Code</th>
                                <th className="px-3 py-2">Project Title</th>
                                <th className="px-3 py-2">Sub-Type</th>
                                <th className="whitespace-nowrap px-3 py-2">Supplemental Budget No.</th>
                                <th className="whitespace-nowrap px-3 py-2">LBP Term Loan No.</th>
                                {columns.map((c) => (
                                    <th key={c.label} className="whitespace-nowrap px-3 py-2 text-right">{c.label}</th>
                                ))}
                            </tr>
                        </thead>
                        {groups.map((g) => (
                            <tbody key={g.src} className="divide-y divide-slate-100">
                                <tr className="bg-slate-100 font-bold text-slate-800">
                                    <td colSpan={span} className="px-3 py-2">
                                        <span className="inline-flex items-center gap-2">
                                            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: g.color }} />
                                            <span className="tracking-wide">{g.label}</span>
                                            <span className="font-normal text-slate-500">
                                                {g.rows.length} project{g.rows.length === 1 ? "" : "s"} ·{" "}
                                                {formatPct(grandTotal > 0 ? (g.total / grandTotal) * 100 : 0)}
                                            </span>
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">{formatPeso(g.total)}</td>
                                </tr>
                                {g.rows.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-50">
                                        <td className="px-3 py-2 text-right text-slate-400">{++n}</td>
                                        <td className="whitespace-nowrap px-3 py-2 text-slate-600">{r.district}</td>
                                        <td className="whitespace-nowrap px-3 py-2 text-slate-600">{r.mode}</td>
                                        <td className="whitespace-nowrap px-3 py-2 font-semibold text-slate-700">{r.projectCode}</td>
                                        <td className="px-3 py-2 text-slate-700">{r.title}</td>
                                        <td className="px-3 py-2 text-slate-600">{r.subType}</td>
                                        <td className="whitespace-nowrap px-3 py-2 text-slate-600">{r.sbNo}</td>
                                        <td className="whitespace-nowrap px-3 py-2 text-slate-600">{r.lbpNo}</td>
                                        {columns.map((c, i) => (
                                            <td
                                                key={c.label}
                                                className={`whitespace-nowrap px-3 py-2 text-right tabular-nums ${i === columns.length - 1 ? "font-bold text-slate-900" : "text-slate-700"}`}
                                            >
                                                {formatPeso(c.value(r))}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        ))}
                        <tfoot className="sticky bottom-0 border-t border-slate-300 bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-700">
                            <tr>
                                <td colSpan={span} className="px-3 py-2">
                                    {footer} · {projectCount} record{projectCount === 1 ? "" : "s"}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-slate-900">{formatPeso(grandTotal)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
};
