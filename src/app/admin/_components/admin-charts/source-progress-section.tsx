"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";
import { PROJECT_SUB_TYPE_LABEL, SOURCE_OF_FUND_ORDER, type ProjectSubTypeValue, type SourceOfFundValue } from "~/lib/fund-constants";
import { REM_SOURCE_LABEL } from "../admin-constant/constant";
import { ProgressChartSkeleton } from "../admin-cards/skeleton.cards";
import { ChartCard, LINE_COLOR } from "./district-progress-section";
import type { ProgressSeries } from "./progress-line-chart";

// Group key for projects with no sub-type recorded.
const NO_SUB_TYPE = "__none__";

const formatPct = (value: number) => `${Number(value.toFixed(2)).toLocaleString("en-PH")}%`;

const average = (values: number[]) =>
    values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;

const sourceLabel = (s: string) => REM_SOURCE_LABEL[s] ?? s.replaceAll("_", " ");
const subTypeLabel = (s: string) =>
    s === NO_SUB_TYPE ? "No sub-type" : (PROJECT_SUB_TYPE_LABEL[s as ProjectSubTypeValue] ?? s.replaceAll("_", " "));

// Canonical source order, so sources list in the same order as the Financial
// tab; anything outside the list follows alphabetically.
const sourceRank = (s: string) => {
    const i = SOURCE_OF_FUND_ORDER.indexOf(s as SourceOfFundValue);
    return i === -1 ? SOURCE_OF_FUND_ORDER.length : i;
};

type Point = ProgressSeries["points"][number] & { sourceOfFund: string; subType: string | null };

const toSeries = (key: string, label: string, points: Point[]): ProgressSeries => ({
    key,
    label,
    shortLabel: label,
    color: LINE_COLOR,
    points,
});

// ── Section ────────────────────────────────────────────────────
// The Project Progress Overview's line chart as small multiples: one chart
// per source of fund, or — with a source picked — one per sub-type within it.
// Every chart shares one x axis (the largest group's project count), so a
// short line reads as the smaller portfolio it is, as in the district
// chart's separate view.
export const SourceProgressSection = ({ budgetYear }: { budgetYear?: string }) => {
    const { data, isLoading } = api.project.getProgressBySource.useQuery(
        budgetYear ? { budgetYear } : undefined,
    );
    const [source, setSource] = useState("");

    const points = useMemo<Point[]>(
        () => (data ?? []).map((p) => ({ ...p, date: new Date(p.date) })),
        [data],
    );

    const bySource = useMemo(() => {
        const groups = new Map<string, Point[]>();
        for (const p of points) groups.set(p.sourceOfFund, [...(groups.get(p.sourceOfFund) ?? []), p]);
        return [...groups.entries()].sort(([a], [b]) => sourceRank(a) - sourceRank(b) || a.localeCompare(b));
    }, [points]);

    // A choice the new year's data no longer has falls back to "all" rather
    // than showing nothing.
    const activeSource = bySource.some(([s]) => s === source) ? source : "";

    const series = useMemo<ProgressSeries[]>(() => {
        if (!activeSource) return bySource.map(([s, pts]) => toSeries(s, sourceLabel(s), pts));
        const groups = new Map<string, Point[]>();
        for (const p of points) {
            if (p.sourceOfFund !== activeSource) continue;
            const key = p.subType ?? NO_SUB_TYPE;
            groups.set(key, [...(groups.get(key) ?? []), p]);
        }
        return [...groups.entries()]
            // Highest average first; "No sub-type" last.
            .sort(([a, pa], [b, pb]) => {
                if ((a === NO_SUB_TYPE) !== (b === NO_SUB_TYPE)) return a === NO_SUB_TYPE ? 1 : -1;
                return average(pb.map((p) => p.progress)) - average(pa.map((p) => p.progress));
            })
            .map(([key, pts]) => toSeries(key, subTypeLabel(key), pts));
    }, [points, bySource, activeSource]);

    const maxRank = series.reduce((max, s) => Math.max(max, s.points.length), 0);

    return (
        <div className="mb-5">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-[15px] font-extrabold text-blue-900 tracking-wide">
                        OVERALL PERCENTAGE PER SOURCE / SUB
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                        {activeSource
                            ? `Physical accomplishment of ${sourceLabel(activeSource)} projects, one chart per sub-type`
                            : "Physical accomplishment of projects, one chart per source of fund — pick a source to see its sub-types"}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <label className="sr-only" htmlFor="source-progress-source">Source of fund</label>
                    <select
                        id="source-progress-source"
                        value={activeSource}
                        onChange={(e) => setSource(e.target.value)}
                        className="max-w-[16rem] rounded-md border-0 bg-slate-200 py-1 pl-2.5 pr-7 text-[11px] font-bold tracking-wide text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    >
                        <option value="">ALL SOURCES</option>
                        {bySource.map(([s, pts]) => (
                            <option key={s} value={s}>
                                {sourceLabel(s)} · {formatPct(average(pts.map((p) => p.progress)))} ({pts.length})
                            </option>
                        ))}
                    </select>
                    {activeSource && (
                        <button
                            type="button"
                            onClick={() => setSource("")}
                            className="text-[11px] font-bold tracking-wide text-blue-700 hover:underline"
                        >
                            ← ALL SOURCES
                        </button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <ProgressChartSkeleton />
            ) : !points.length ? (
                <div className="bg-white rounded-sm border border-slate-200 p-10 text-center text-sm text-slate-400">
                    No projects to plot yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                    {series.map((s) => (
                        <ChartCard
                            key={s.key}
                            title={`${s.label} PROGRESS`}
                            subtitle={
                                activeSource
                                    ? "Physical accomplishment per project in this sub-type, ranked from least to most advanced"
                                    : "Physical accomplishment per project in this source, ranked from least to most advanced"
                            }
                            series={[s]}
                            maxRank={maxRank}
                            height={220}
                            chartType="line"
                            budgetYear={budgetYear}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
