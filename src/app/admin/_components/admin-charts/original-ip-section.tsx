"use client";

import { useMemo } from "react";
import { api } from "~/trpc/react";
import type { ProgressSeries } from "./progress-line-chart";
import { ChartCard, DISTRICT_META, LINE_COLOR } from "./district-progress-section";
import { ProgressChartSkeleton } from "../admin-cards/skeleton.cards";

// ── Section ────────────────────────────────────────────────────
// Original Projects under IP: the 2nd Engineering District's fixed list of
// projects (~/lib/original-ip-projects) as one ranked progress curve, the
// same reading as the Project Progress Overview. Only rendered for 2ND ENGR
// DIST admins. It is the CY 2026 list, so the year is part of the title
// rather than following the dashboard's year filter.
export const OriginalIpSection = () => {
    const { data, isLoading } = api.project.getOriginalIpProgress.useQuery();

    const series = useMemo<ProgressSeries[]>(() => {
        const points = (data?.points ?? []).map((p) => ({ ...p, date: new Date(p.date) }));
        if (!points.length) return [];
        const meta = DISTRICT_META.DISTRICT_II!;
        return [
            {
                key: "ORIGINAL_IP",
                label: meta.label,
                shortLabel: meta.short,
                color: LINE_COLOR,
                dash: meta.dash,
                points,
            },
        ];
    }, [data]);

    const missing = data?.missing ?? [];

    return (
        <div className="mb-5">
            <div className="mb-3">
                <p className="text-[15px] font-extrabold tracking-wide text-blue-900">
                    Projects Under AIP (Annual Investment Plan) CY 2026
                </p>
            </div>

            {isLoading ? (
                <ProgressChartSkeleton />
            ) : !series.length ? (
                <div className="rounded-sm border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
                    None of the original projects under IP were found.
                </div>
            ) : (
                <ChartCard
                    series={series}
                    height={280}
                    chartType="line"
                />
            )}

            {!isLoading && missing.length > 0 && (
                <p className="mt-2 text-[10px] text-slate-500">
                    <span className="font-bold text-slate-600">Not found ({missing.length}):</span> {missing.join(" · ")}
                </p>
            )}
        </div>
    );
};
