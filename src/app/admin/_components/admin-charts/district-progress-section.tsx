"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";
import { ProgressLineChart, type ProgressSeries } from "./progress-line-chart";
import { ProgressChartSkeleton } from "../admin-cards/skeleton.cards";

// Categorical slots 1 and 2 — validated for colour-vision deficiency against a
// white surface (worst-pair ΔE 24.7) — plus the reader-facing district names.
const DISTRICT_META: Record<string, { label: string; short: string; color: string }> = {
    DISTRICT_I: { label: "1ST ENGINEERING DISTRICT", short: "District I", color: "#2a78d6" },
    DISTRICT_II: { label: "2ND ENGINEERING DISTRICT", short: "District II", color: "#eb6834" },
};

const average = (values: number[]) =>
    values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;

const formatPct = (value: number) => `${Number(value.toFixed(2)).toLocaleString("en-PH")}%`;

// ── Legend ─────────────────────────────────────────────────────
// Always present once two series share a plot, and it carries each district's
// headline figures so the summary doesn't depend on reading the line.
const Legend = ({ series }: { series: ProgressSeries[] }) => (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
        {series.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
                <span className="h-[2px] w-4 rounded-full" style={{ background: s.color }} />
                <span className="text-[10.5px] font-semibold text-slate-700">{s.shortLabel}</span>
                <span className="text-[10.5px] text-slate-500">
                    {s.points.length} project{s.points.length === 1 ? "" : "s"} ·{" "}
                    {formatPct(average(s.points.map((p) => p.progress)))} avg
                </span>
            </div>
        ))}
    </div>
);

// ── Chart card ─────────────────────────────────────────────────
const ChartCard = ({
    title,
    series,
    maxRank,
    height,
}: {
    title: string;
    series: ProgressSeries[];
    maxRank?: number | null;
    height?: number;
}) => {
    const allPoints = series.flatMap((s) => s.points);
    return (
        <div className="bg-white rounded-sm overflow-hidden border border-slate-200">
            <div className="p-4">
                <p className="text-[15px] font-extrabold text-[#1e3a8a] tracking-widest uppercase mb-1">
                    {title}
                </p>
                <p className="text-[10px] text-slate-500 mb-3">
                    Physical accomplishment per project, ranked from least to most advanced
                </p>
                {/* A legend for two series; a single series is named by the title above it. */}
                {series.length > 1 && (
                    <div className="mb-2">
                        <Legend series={series} />
                    </div>
                )}
                <ProgressLineChart series={series} maxRank={maxRank} height={height} />
            </div>
            <div className="bg-white text-black border-t border-slate-300 px-4 py-[9px] flex justify-between items-center text-[11px] font-bold tracking-widest uppercase">
                <span>{allPoints.length} PROJECTS PLOTTED</span>
                <span>{formatPct(average(allPoints.map((p) => p.progress)))} AVG PROGRESS</span>
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
}: {
    series: ProgressSeries[];
    isLoading?: boolean;
}) => {
    // Combined overlays both districts on one axis; separate splits them into
    // small multiples that share an x axis so they stay comparable.
    const [mode, setMode] = useState<"combined" | "separate">("combined");

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

                {canToggle && (
                    <div
                        role="group"
                        aria-label="Chart layout"
                        className="inline-flex shrink-0 rounded-md bg-slate-200 p-0.5"
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
                />
            )}

            <p className="mt-2 text-[10px] text-slate-400">
                Every plotted figure is also listed per project in Recent Project Updates below.
            </p>
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
                    color: "#64748b",
                };
                return {
                    key: d.district,
                    label: meta.label,
                    shortLabel: meta.short,
                    color: meta.color,
                    points: d.points.map((p) => ({ ...p, date: new Date(p.date) })),
                };
            }),
        [data],
    );

    return <DistrictProgressPanel series={series} isLoading={isLoading} />;
}
