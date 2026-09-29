"use client";

import { useEffect, useMemo } from "react";
import { api } from "~/trpc/react";
import type { ProgressSeries } from "./progress-line-chart";
import { ChartCard, DISTRICT_META, LINE_COLOR } from "./district-progress-section";
import { ProgressChartSkeleton } from "../admin-cards/skeleton.cards";

// ── Status progress modal ──────────────────────────────────────
// Opened from a Project Status tile's VIEW button: the same progress curve as
// the Project Progress Overview (y = physical accomplishment %, x = the
// project's rank within its district), narrowed to one status. It reads the
// same query with the same input as that section, so opening it reuses the
// cached rows instead of fetching again.
export const StatusProgressModal = ({
    status,
    label,
    budgetYear,
    onClose,
}: {
    status: string;
    label: string;
    budgetYear: string;
    onClose: () => void;
}) => {
    const { data, isLoading } = api.project.getProgressByDistrict.useQuery(
        budgetYear ? { budgetYear } : undefined,
    );

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    // A district with no projects in this status is dropped rather than drawn
    // as an empty line, so the legend only names what is plotted.
    const series = useMemo<ProgressSeries[]>(
        () =>
            (data ?? [])
                .map((d) => {
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
                        points: d.points
                            .filter((p) => p.status === status)
                            .map((p) => ({ ...p, date: new Date(p.date) })),
                    };
                })
                .filter((s) => s.points.length > 0),
        [data, status],
    );

    const maxRank = series.reduce((max, s) => Math.max(max, s.points.length), 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/50" onClick={onClose} />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="status-progress-title"
                className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-sm bg-slate-100 shadow-2xl"
            >
                <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
                    <div className="min-w-0">
                        <h3 id="status-progress-title" className="text-lg font-extrabold text-[#1e3a8a] tracking-wide">
                            {label}
                        </h3>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                            Physical accomplishment (%) against number of projects
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="shrink-0 rounded-sm p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto p-4">
                    {isLoading ? (
                        <ProgressChartSkeleton />
                    ) : !series.length ? (
                        <div className="bg-white rounded-sm border border-slate-200 p-10 text-center text-sm text-slate-400">
                            No projects with this status to plot.
                        </div>
                    ) : (
                        <ChartCard
                            title={`${label} PROGRESS`}
                            series={series}
                            maxRank={maxRank}
                            height={300}
                            chartType="line"
                            budgetYear={budgetYear}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
