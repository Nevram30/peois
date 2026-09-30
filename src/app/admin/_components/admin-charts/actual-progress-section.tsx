"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";
import type { ProgressSeries } from "./progress-line-chart";
import { ChartCard, DISTRICT_META, LINE_COLOR } from "./district-progress-section";
import { ProgressChartSkeleton } from "../admin-cards/skeleton.cards";

// ── Month helpers ──────────────────────────────────────────────
// A month is keyed "yyyy-mm" in local time, the calendar the entries were
// recorded against.
const ALL = "all";
const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const monthLabel = new Intl.DateTimeFormat("en-PH", { month: "long", year: "numeric" });
const labelOf = (key: string) => {
    const [y, m] = key.split("-").map(Number);
    return monthLabel.format(new Date(y!, m! - 1, 1));
};

// ── Section ────────────────────────────────────────────────────
// Actual % progress: the same ranked progress curve as the Project Progress
// Overview, but each project's value is the Actual % from its Physical
// Progress & Slippage entries rather than the Project Progress field.
//  • A month selected → the latest entry each project recorded in that month;
//    projects with no entry that month are left out.
//  • All months → each project's latest entry overall (its current actual).
export const ActualProgressSection = ({ budgetYear }: { budgetYear: string }) => {
    const { data, isLoading } = api.project.getActualProgressByDistrict.useQuery(
        budgetYear ? { budgetYear } : undefined,
    );
    const [month, setMonth] = useState<string>(ALL);

    // Months that have at least one entry, newest first.
    const months = useMemo(() => {
        const keys = new Set<string>();
        for (const d of data ?? [])
            for (const p of d.projects)
                for (const a of p.slippageAssessments) keys.add(monthKey(new Date(a.date)));
        return [...keys].sort().reverse();
    }, [data]);
    // A month from a previous year's data falls back to All months.
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
                        // Entries come newest first, so the first match is the latest.
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

    return (
        <div className="mb-5">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-[15px] font-extrabold tracking-wide text-blue-900">ACTUAL % PROGRESS OVERVIEW</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                        Actual accomplishment from Physical Progress &amp; Slippage entries, filtered by the month recorded
                    </p>
                </div>
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
            </div>

            {isLoading ? (
                <ProgressChartSkeleton />
            ) : !series.length ? (
                <div className="rounded-sm border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
                    {months.length
                        ? `No actual % was recorded in ${labelOf(activeMonth)}.`
                        : "No Physical Progress & Slippage entries recorded yet."}
                </div>
            ) : (
                <ChartCard
                    title={
                        series.length === 1 && series[0]
                            ? `${series[0].label} ACTUAL %`
                            : "DISTRICT I & DISTRICT II ACTUAL %"
                    }
                    subtitle={`Actual % per project (${periodText}), ranked from least to most advanced`}
                    series={series}
                    maxRank={maxRank}
                    height={280}
                    chartType="line"
                    budgetYear={budgetYear}
                />
            )}
        </div>
    );
};
