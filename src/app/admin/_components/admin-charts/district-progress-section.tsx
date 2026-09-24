"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";
import {
    LineKey,
    ProgressLineChart,
    type ProgressSeries,
    statusColor,
    statusLabel,
} from "./progress-line-chart";
import { ProgressBarChart } from "./progress-bar-chart";
import { STATUS_LABELS } from "~/app/super-admin/dashboardv2/super.adminv2.types";
import { ProgressChartSkeleton } from "../admin-cards/skeleton.cards";
import { FyBadge } from "../admin-cards/cards";

// Line reads the progress curve (how much of the portfolio is past halfway);
// bars read each project's progress on its own. Same data, same order.
export type ChartType = "line" | "bar";

// The dots carry status colour, so the lines stay neutral: a blue District I
// line measured ΔE 5.6 against the ON-GOING dot and an orange District II line
// ΔE 6.9 against SUSPENDED — those dots would vanish into their own line.
// Slate-300 clears every status colour (lowest ΔE 15.9, against OTHERS), and
// the districts are told apart by dash, legend and end-of-line label instead.
export const LINE_COLOR = "#cbd5e1";

const DISTRICT_META: Record<string, { label: string; short: string; dash?: string }> = {
    DISTRICT_I: { label: "1ST ENGINEERING DISTRICT", short: "District I" },
    DISTRICT_II: { label: "2ND ENGINEERING DISTRICT", short: "District II", dash: "5 5" },
};

// Status legend order — the same order as the District Project Status cards.
const STATUS_ORDER = Object.keys(STATUS_LABELS);

const average = (values: number[]) =>
    values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;

const formatPct = (value: number) => `${Number(value.toFixed(2)).toLocaleString("en-PH")}%`;

// ── Legend ─────────────────────────────────────────────────────
// Always present once two series share a plot, and it carries each district's
// headline figures so the summary doesn't depend on reading the line.
// On the bar view the dash key means nothing, so each district is named by its
// position in the rank slot instead ("left bar" / "right bar").
const SLOT_POSITION = ["left bar", "right bar", "3rd bar", "4th bar"];

const Legend = ({ series, chartType }: { series: ProgressSeries[]; chartType: ChartType }) => (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
        {series.map((s, i) => (
            <div key={s.key} className="flex items-center gap-1.5">
                {chartType === "line" ? (
                    <LineKey color="#64748b" dash={s.dash} width={20} />
                ) : (
                    <span className="text-[10px] text-slate-500">{SLOT_POSITION[i] ?? `bar ${i + 1}`}:</span>
                )}
                <span className="text-[10.5px] font-semibold text-slate-700">{s.shortLabel}</span>
                <span className="text-[10.5px] text-slate-500">
                    {s.points.length} project{s.points.length === 1 ? "" : "s"} ·{" "}
                    {formatPct(average(s.points.map((p) => p.progress)))} avg
                </span>
            </div>
        ))}
    </div>
);

// ── Status legend ──────────────────────────────────────────────
// What the dot colours mean. Lists only the statuses this card actually
// plots; each status keeps its fixed colour, so filtering never repaints one.
const StatusLegend = ({ series }: { series: ProgressSeries[] }) => {
    const counts = new Map<string, number>();
    for (const p of series.flatMap((s) => s.points)) {
        counts.set(p.status, (counts.get(p.status) ?? 0) + 1);
    }
    const present = [...counts.keys()].sort((a, b) => {
        const rank = (s: string) => (STATUS_ORDER.includes(s) ? STATUS_ORDER.indexOf(s) : STATUS_ORDER.length);
        return rank(a) - rank(b);
    });
    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {present.map((status) => (
                <div key={status} className="flex items-center gap-1.5">
                    <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: statusColor(status) }}
                    />
                    <span className="text-[10.5px] text-slate-500">
                        {statusLabel(status)}{" "}
                        <span className="font-bold text-slate-700">{counts.get(status)}</span>
                    </span>
                </div>
            ))}
        </div>
    );
};

// ── Chart card ─────────────────────────────────────────────────
// Also used by the source / sub-type progress chart, which passes its own
// subtitle.
export const ChartCard = ({
    title,
    subtitle = "Physical accomplishment per project, ranked from least to most advanced",
    series,
    maxRank,
    height,
    chartType,
    budgetYear,
}: {
    title: string;
    subtitle?: string;
    series: ProgressSeries[];
    maxRank?: number | null;
    height?: number;
    chartType: ChartType;
    budgetYear?: string;
}) => {
    const allPoints = series.flatMap((s) => s.points);
    return (
        <div className="bg-white rounded-sm overflow-hidden border border-slate-200">
            <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                        <p className="text-[15px] font-extrabold text-[#1e3a8a] tracking-widest uppercase mb-1">
                            {title}
                        </p>
                        <p className="text-[10px] text-slate-500">{subtitle}</p>
                    </div>
                    {/* Headline figure for the card, top right where it is read
                        first, with the card's calendar year above it */}
                    <div className="shrink-0 text-right">
                        <div className="mb-1 flex justify-end">
                            <FyBadge year={budgetYear} />
                        </div>
                        <p className="text-3xl font-extrabold leading-none text-slate-900">
                            {formatPct(average(allPoints.map((p) => p.progress)))}
                        </p>
                        <p className="mt-1 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                            AVG PROGRESS
                        </p>
                    </div>
                </div>
                {/* District legend for two series (a single series is named by the
                    title above it); the status legend always, since every card
                    colours its marks by status. */}
                <div className="mb-2 flex flex-col gap-1.5">
                    {series.length > 1 && <Legend series={series} chartType={chartType} />}
                    <StatusLegend series={series} />
                </div>
                {chartType === "line" ? (
                    <ProgressLineChart series={series} maxRank={maxRank} height={height} />
                ) : (
                    <ProgressBarChart series={series} maxRank={maxRank} height={height} />
                )}
            </div>
            <div className="bg-white text-black border-t border-slate-300 px-4 py-[9px] flex justify-between items-center text-[11px] font-bold tracking-widest uppercase">
                <span>PROJECTS PLOTTED</span>
                <span>{allPoints.length}</span>
            </div>
        </div>
    );
};

// ── Panel ──────────────────────────────────────────────────────
// Presentational half of the section: the header, the combined/separate
// toggle and the chart cards. Split from the query below so it can be
// rendered from plain data.
export const DistrictProgressPanel = ({
    series,
    isLoading = false,
    budgetYear,
}: {
    series: ProgressSeries[];
    isLoading?: boolean;
    budgetYear?: string;
}) => {
    // Combined overlays both districts on one axis; separate splits them into
    // small multiples that share an x axis so they stay comparable.
    const [mode, setMode] = useState<"combined" | "separate">("combined");
    // Line by default: the curve is what this card was built to show, and the
    // bars are the per-project reading of the same ranked data.
    const [chartType, setChartType] = useState<ChartType>("line");

    // Shared across the small multiples: without it each district's axis would
    // fit its own project count, and a 12-project district would draw the same
    // full-width curve as a 90-project one.
    const maxRank = useMemo(
        () => series.reduce((max, s) => Math.max(max, s.points.length), 0),
        [series],
    );

    // Engineering-district admins (1ST/2ND ENGR DIST) are scoped to one
    // district by the server, so there is nothing to separate — they get their
    // own chart and no toggle.
    const canToggle = series.length > 1;
    const separated = canToggle && mode === "separate";

    return (
        <div className="mb-5">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                    <p className="text-[15px] font-extrabold text-blue-900 tracking-wide">
                        PROJECT PROGRESS OVERVIEW
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                        Physical accomplishment of all projects by engineering district
                    </p>
                </div>

                {/* Chart type always; the layout toggle only where there are two
                    districts to lay out. Both are the same pill control. */}
                <div className="flex shrink-0 items-center gap-2">
                    <div
                        role="group"
                        aria-label="Chart type"
                        className="inline-flex rounded-md bg-slate-200 p-0.5"
                    >
                        {(["line", "bar"] as const).map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setChartType(option)}
                                aria-pressed={chartType === option}
                                className={`rounded-[5px] px-3 py-1 text-[11px] font-bold tracking-wide transition-colors ${chartType === option
                                    ? "bg-[#1e3a8a] text-white"
                                    : "text-slate-600 hover:text-slate-900"
                                    }`}
                            >
                                {option === "line" ? "LINE" : "BAR"}
                            </button>
                        ))}
                    </div>

                    {canToggle && (
                        <div
                            role="group"
                            aria-label="Chart layout"
                            className="inline-flex rounded-md bg-slate-200 p-0.5"
                        >
                            {(["combined", "separate"] as const).map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setMode(option)}
                                    aria-pressed={mode === option}
                                    className={`rounded-[5px] px-3 py-1 text-[11px] font-bold tracking-wide transition-colors ${mode === option
                                        ? "bg-[#1e3a8a] text-white"
                                        : "text-slate-600 hover:text-slate-900"
                                        }`}
                                >
                                    {option === "combined" ? "COMBINED" : "SEPARATE"}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isLoading ? (
                <ProgressChartSkeleton />
            ) : !series.length ? (
                <div className="bg-white rounded-sm border border-slate-200 p-10 text-center text-sm text-slate-400">
                    No projects to plot yet.
                </div>
            ) : separated ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                    {series.map((s) => (
                        <ChartCard
                            key={s.key}
                            title={`${s.label} PROGRESS`}
                            series={[s]}
                            maxRank={maxRank}
                            height={240}
                            chartType={chartType}
                            budgetYear={budgetYear}
                        />
                    ))}
                </div>
            ) : (
                <ChartCard
                    title={
                        series.length === 1 && series[0]
                            ? `${series[0].label} PROGRESS`
                            : "DISTRICT I & DISTRICT II PROGRESS"
                    }
                    series={series}
                    maxRank={maxRank}
                    height={280}
                    chartType={chartType}
                    budgetYear={budgetYear}
                />
            )}
        </div>
    );
}

// ── Section ────────────────────────────────────────────────────
// Data half: the server already scopes the districts to the caller's division,
// so a 1ST/2ND ENGR DIST admin gets a single series (and no toggle) while the
// office divisions get both.
export const DistrictProgressSection = ({ budgetYear }: { budgetYear: string }) => {
    const { data, isLoading } = api.project.getProgressByDistrict.useQuery(
        budgetYear ? { budgetYear } : undefined,
    );

    const series = useMemo<ProgressSeries[]>(
        () =>
            (data ?? []).map((d) => {
                const meta = DISTRICT_META[d.district] ?? {
                    label: d.district.replace("_", " "),
                    short: d.district.replace("_", " "),
                };
                return {
                    key: d.district,
                    label: meta.label,
                    shortLabel: meta.short,
                    color: LINE_COLOR,
                    dash: meta.dash,
                    points: d.points.map((p) => ({ ...p, date: new Date(p.date) })),
                };
            }),
        [data],
    );

    return <DistrictProgressPanel series={series} isLoading={isLoading} budgetYear={budgetYear} />;
}
