"use client";

import { useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { api } from "~/trpc/react";
import { statusColor, statusLabel, type ProgressSeries } from "./progress-line-chart";
import { ChartCard, DISTRICT_META, LINE_COLOR } from "./district-progress-section";
import { ProgressChartSkeleton } from "../admin-cards/skeleton.cards";

type View = "graph" | "table";
type LayoutMode = "combined" | "separate";

const formatPct = (value: number) => `${Number(value.toFixed(2)).toLocaleString("en-PH")}%`;
const dateLabel = new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" });

// One table row per plotted project, in the chart's order: by district, then
// least to most advanced.
const toRows = (series: ProgressSeries[]) =>
    series.flatMap((s) =>
        s.points.map((p) => ({
            id: `${s.key}-${p.id}`,
            districtKey: s.key,
            district: s.shortLabel,
            projectCode: p.projectCode,
            title: p.title,
            status: p.status,
            actual: p.progress,
            date: p.date,
        })),
    );

const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Prints the table on its own page, so the dashboard around it stays out of
// the printout.
const printTable = (rows: ReturnType<typeof toRows>, heading: string, period: string, budgetYear: string) => {
    const win = window.open("", "_blank", "width=1000,height=700");
    if (!win) return;
    const avg = rows.length ? rows.reduce((sum, r) => sum + r.actual, 0) / rows.length : 0;
    const body = rows
        .map(
            (r, i) => `<tr>
                <td class="num">${i + 1}</td>
                <td>${escapeHtml(r.district)}</td>
                <td>${escapeHtml(r.projectCode)}</td>
                <td>${escapeHtml(r.title)}</td>
                <td>${escapeHtml(statusLabel(r.status))}</td>
                <td class="num">${formatPct(r.actual)}</td>
                <td>As of ${dateLabel.format(r.date)}</td>
            </tr>`,
        )
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
            tfoot td { font-weight: bold; background: #f1f5f9; }
            thead { display: table-header-group; }
            tr { page-break-inside: avoid; }
        </style></head><body>
        <h1>${escapeHtml(heading)}</h1>
        <p>${escapeHtml(budgetYear ? `CY ${budgetYear}` : "All calendar years")} ·  per project (${escapeHtml(period)})</p>
        <table>
            <thead><tr><th class="num">#</th><th>District</th><th>Project Code</th><th>Project Title</th><th>Status</th><th class="num">Physical Progress</th><th>Date Recorded</th></tr></thead>
            <tbody>${body}</tbody>
            <tfoot><tr><td colspan="5">${rows.length} project${rows.length === 1 ? "" : "s"} · Average</td><td class="num">${formatPct(avg)}</td><td></td></tr></tfoot>
        </table>
        </body></html>`);
    win.document.close();
    win.focus();
    win.print();
};

// ── Table ──────────────────────────────────────────────────────
const PAGE_SIZE = 10;

const ActualProgressTable = ({ rows }: { rows: ReturnType<typeof toRows> }) => {
    const [page, setPage] = useState(1);
    // The average covers every row, not just the page shown.
    const avg = rows.length ? rows.reduce((sum, r) => sum + r.actual, 0) / rows.length : 0;
    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const current = Math.min(page, totalPages);
    const offset = (current - 1) * PAGE_SIZE;
    const visible = rows.slice(offset, offset + PAGE_SIZE);

    return (
        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-[11px]">
                    <thead className="bg-[#1e3a8a] text-[10px] font-bold uppercase tracking-wide text-white">
                        <tr>
                            <th className="px-3 py-2 text-right">#</th>
                            <th className="px-3 py-2">District</th>
                            <th className="px-3 py-2">Project Code</th>
                            <th className="px-3 py-2">Project Title</th>
                            <th className="px-3 py-2">Status</th>
                            <th className="px-3 py-2 text-right">Physical Progress</th>
                            <th className="px-3 py-2">Date Recorded</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {visible.map((r, i) => (
                            <tr key={r.id} className="hover:bg-slate-50">
                                <td className="px-3 py-2 text-right text-slate-400">{offset + i + 1}</td>
                                <td className="whitespace-nowrap px-3 py-2 text-slate-600">{r.district}</td>
                                <td className="whitespace-nowrap px-3 py-2 font-semibold text-slate-700">{r.projectCode}</td>
                                <td className="px-3 py-2 text-slate-700">{r.title}</td>
                                <td className="whitespace-nowrap px-3 py-2">
                                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: statusColor(r.status) }} />
                                        {statusLabel(r.status)}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-right font-bold text-slate-900">{formatPct(r.actual)}</td>
                                <td className="whitespace-nowrap px-3 py-2 text-slate-600">{dateLabel.format(r.date)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="border-t border-slate-300 bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-700">
                        <tr>
                            <td colSpan={5} className="px-3 py-2">
                                {rows.length} project{rows.length === 1 ? "" : "s"} · Average
                            </td>
                            <td className="px-3 py-2 text-right text-slate-900">{formatPct(avg)}</td>
                            <td />
                        </tr>
                    </tfoot>
                </table>
            </div>

            {rows.length > PAGE_SIZE && (
                <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-[11px] text-slate-500">
                    <span>
                        {offset + 1}–{Math.min(offset + PAGE_SIZE, rows.length)} of {rows.length} · Page {current} of {totalPages}
                    </span>
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={() => setPage(current - 1)}
                            disabled={current === 1}
                            aria-label="Previous page"
                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
                        >
                            &lsaquo;
                        </button>
                        <button
                            type="button"
                            onClick={() => setPage(current + 1)}
                            disabled={current === totalPages}
                            aria-label="Next page"
                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
                        >
                            &rsaquo;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Month helpers ──────────────────────────────────────────────
const ALL = "all";
const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const monthLabel = new Intl.DateTimeFormat("en-PH", { month: "long", year: "numeric" });
const labelOf = (key: string) => {
    const [y, m] = key.split("-").map(Number);
    return monthLabel.format(new Date(y!, m! - 1, 1));
};

// ── Section ────────────────────────────────────────────────────
export const ActualProgressSection = ({ budgetYear }: { budgetYear: string }) => {
    const { data, isLoading } = api.project.getActualProgressByDistrict.useQuery(
        budgetYear ? { budgetYear } : undefined,
    );

    const [month, setMonth] = useState<string>(ALL);
    const [view, setView] = useState<View>("graph");
    const [layoutMode, setLayoutMode] = useState<LayoutMode>("combined");
    const [tableDistrict, setTableDistrict] = useState<string>(ALL);
    const activeView = view;

    const { data: districtScope, isLoading: scopeLoading } = api.project.getMyDistrictScope.useQuery();
    const isOfficeDivision = !scopeLoading && districtScope == null;
    const activeTableDistrict = isOfficeDivision && activeView === "table" ? tableDistrict : ALL;

    const months = useMemo(() => {
        const keys = new Set<string>();
        for (const d of data ?? [])
            for (const p of d.projects)
                for (const a of p.slippageAssessments) keys.add(monthKey(new Date(a.date)));
        return [...keys].sort().reverse();
    }, [data]);

    const activeMonth = month === ALL || months.includes(month) ? month : ALL;

    const series = useMemo<ProgressSeries[]>(
        () =>
            (data ?? [])
                .map((d) => {
                    const meta = DISTRICT_META[d.district] ?? {
                        label: d.district.replace("_", " "),
                        short: d.district.replace("_", " "),
                    };
                    const points = d.projects.flatMap((p) => {
                        const entry = p.slippageAssessments.find(
                            (a) => activeMonth === ALL || monthKey(new Date(a.date)) === activeMonth,
                        );
                        if (!entry) return [];
                        return [
                            {
                                id: p.id,
                                projectCode: p.projectCode,
                                title: p.title,
                                status: p.status,
                                progress: entry.actual,
                                date: new Date(entry.date),
                                estimated: false,
                                dateLabel: "Recorded",
                            },
                        ];
                    });
                    return {
                        key: d.district,
                        label: meta.label,
                        shortLabel: meta.short,
                        color: LINE_COLOR,
                        dash: meta.dash,
                        points: points.sort((a, b) => a.progress - b.progress),
                    };
                })
                .filter((s) => s.points.length > 0),
        [data, activeMonth],
    );

    const maxRank = series.reduce((max, s) => Math.max(max, s.points.length), 0);
    const periodText = activeMonth === ALL ? "latest entry per project" : `entries recorded in ${labelOf(activeMonth)}`;

    const rows = useMemo(() => {
        const allRows = toRows(series);
        if (activeTableDistrict === ALL) return allRows;
        return allRows.filter((r) => r.districtKey === activeTableDistrict);
    }, [series, activeTableDistrict]);

    const title = useMemo(() => {
        if (activeView === "table" && activeTableDistrict !== ALL) {
            const label = DISTRICT_META[activeTableDistrict]?.label ?? activeTableDistrict;
            return `${label} PROJECT ACCOMPLISHMENT`;
        }
        return series.length === 1 && series[0]
            ? `${series[0].label} PROJECT ACCOMPLISHMENT for General Appropriations Infrastructure Projects`
            : "DISTRICT I & DISTRICT II PROJECT PROGRESS OVERVIEW for General Appropriations Infrastructure Projects";
    }, [activeView, activeTableDistrict, series]);

    return (
        <div className="mb-5">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                    <div role="group" aria-label="View" className="inline-flex rounded-md bg-slate-200 p-0.5">
                        {(["graph", "table"] as const).map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setView(option)}
                                aria-pressed={activeView === option}
                                className={`rounded-[5px] px-3 py-1 text-[11px] font-bold tracking-wide transition-colors ${activeView === option
                                    ? "bg-[#1e3a8a] text-white"
                                    : "text-slate-600 hover:text-slate-900"
                                    }`}
                            >
                                {option === "graph" ? "GRAPH" : "TABLE"}
                            </button>
                        ))}
                    </div>

                    {isOfficeDivision && activeView === "graph" && series.length > 1 && (
                        <div role="group" aria-label="Chart Layout" className="inline-flex rounded-md bg-slate-200 p-0.5">
                            {(["combined", "separate"] as const).map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setLayoutMode(mode)}
                                    aria-pressed={layoutMode === mode}
                                    className={`rounded-[5px] px-3 py-1 text-[11px] font-bold tracking-wide transition-colors ${layoutMode === mode
                                        ? "bg-[#1e3a8a] text-white"
                                        : "text-slate-600 hover:text-slate-900"
                                        }`}
                                >
                                    {mode === "combined" ? "COMBINED" : "SEPARATE"}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {isOfficeDivision && activeView === "table" && (
                        <label className="flex items-center gap-2">
                            <span className="text-[11px] font-bold tracking-wide text-slate-600">DISTRICT</span>
                            <select
                                value={tableDistrict}
                                onChange={(e) => setTableDistrict(e.target.value)}
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
                        <span className="text-[11px] font-bold tracking-wide text-slate-600">MONTH</span>
                        <select
                            value={activeMonth}
                            onChange={(e) => setMonth(e.target.value)}
                            disabled={!months.length}
                            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 focus:border-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        >
                            <option value={ALL}>All months (latest)</option>
                            {months.map((m) => (
                                <option key={m} value={m}>
                                    {labelOf(m)}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        type="button"
                        onClick={() => printTable(rows, title, periodText, budgetYear)}
                        disabled={!rows.length}
                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold tracking-wide text-[#1e3a8a] transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50 inline-flex items-center gap-1.5"
                    >
                        <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                        PRINT
                    </button>
                </div>
            </div>

            {isLoading ? (
                <ProgressChartSkeleton />
            ) : !series.length || (activeView === "table" && !rows.length) ? (
                <div className="rounded-sm border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
                    {months.length
                        ? `No Physical Progress was recorded${activeTableDistrict === ALL ? "" : ` for ${DISTRICT_META[activeTableDistrict]?.short ?? activeTableDistrict}`}${activeMonth === ALL ? "" : ` in ${labelOf(activeMonth)}`}.`
                        : "No Physical Progress & Slippage entries recorded yet."}
                </div>
            ) : activeView === "table" ? (
                <ActualProgressTable key={`${budgetYear}-${activeMonth}-${activeTableDistrict}`} rows={rows} />
            ) : layoutMode === "combined" || !isOfficeDivision ? (
                <ChartCard
                    title={title}
                    subtitle={`PROJECT PROGRESS OVERVIEW per project (${periodText}), ranked from least to most advanced`}
                    series={series}
                    maxRank={maxRank}
                    height={280}
                    chartType="line"
                    budgetYear={budgetYear}
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {series.map((s) => (
                        <ChartCard
                            key={s.key}
                            title={`${s.label} PROJECT ACCOMPLISHMENT for General Appropriations Infrastructure Projects`}
                            subtitle={`PROJECT PROGRESS OVERVIEW per project (${periodText}), ranked from least to most advanced`}
                            series={[s]}
                            maxRank={s.points.length}
                            height={280}
                            chartType="line"
                            budgetYear={budgetYear}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};