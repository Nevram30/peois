"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";
import { STATUS_LABELS } from "~/app/super-admin/dashboardv2/super.adminv2.types";
import { statusColor, statusLabel } from "./progress-line-chart";
import { ProgressChartSkeleton } from "../admin-cards/skeleton.cards";
import { FyBadge } from "../admin-cards/cards";

// ── Types ──────────────────────────────────────────────────────

export type LocationRow = {
    // City/municipality; null groups projects with no municipality recorded.
    name: string | null;
    // In the district's official municipality list (vs. legacy free text).
    known: boolean;
    total: number;
    avgProgress: number;
    counts: Record<string, number>;
};

export type DistrictLocations = {
    district: string;
    locations: LocationRow[];
};

const DISTRICT_TITLE: Record<string, string> = {
    DISTRICT_I: "1ST ENGINEERING DISTRICT",
    DISTRICT_II: "2ND ENGINEERING DISTRICT",
};

// Same order as the District Project Status cards, so segments stack the same
// way everywhere on the dashboard.
const STATUS_ORDER = Object.keys(STATUS_LABELS);
const statusRank = (s: string) =>
    STATUS_ORDER.includes(s) ? STATUS_ORDER.indexOf(s) : STATUS_ORDER.length;

// Progress is a magnitude, not a status, so it takes a neutral ink rather than
// any status colour — a blue bar here would read as ON-GOING next door.
const PROGRESS_COLOR = "#475569";

const UNASSIGNED_LABEL = "No municipality recorded";

const formatPct = (value: number) => `${Number(value.toFixed(2)).toLocaleString("en-PH")}%`;

// ── Row ────────────────────────────────────────────────────────
// Two measures with different scales, so two bars side by side rather than
// one chart with two axes: average progress on a fixed 0–100% track, and the
// status mix as a stacked bar whose length is the project count, scaled to the
// busiest location in the card so row lengths compare directly.
const LocationRowView = ({ row, maxTotal }: { row: LocationRow; maxTotal: number }) => {
    const [open, setOpen] = useState(false);
    const name = row.name ?? UNASSIGNED_LABEL;
    const statuses = Object.entries(row.counts)
        .filter(([, n]) => n > 0)
        .sort(([a], [b]) => statusRank(a) - statusRank(b));

    const summary = row.total
        ? `${name}: ${row.total} project${row.total === 1 ? "" : "s"}, ${formatPct(row.avgProgress)} average progress. ${statuses
            .map(([s, n]) => `${statusLabel(s)} ${n}`)
            .join(", ")}.`
        : `${name}: no projects.`;

    return (
        <div
            // Focusable so the breakdown is reachable by keyboard, not hover alone.
            tabIndex={row.total ? 0 : -1}
            aria-label={summary}
            onPointerEnter={() => setOpen(true)}
            onPointerLeave={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            className="relative grid grid-cols-1 gap-2 rounded-sm px-2 py-3.5 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500/40 sm:grid-cols-[minmax(7rem,9rem)_minmax(0,1fr)_minmax(0,1.4fr)] sm:items-center sm:gap-4"
        >
            {/* Location */}
            <div className="flex items-baseline justify-between gap-2 sm:block">
                <p className={`truncate text-xs font-semibold ${row.name ? "text-slate-700" : "italic text-slate-500"}`}>{name}</p>
                <p className="text-[10.5px] text-slate-500">
                    {row.total} project{row.total === 1 ? "" : "s"}
                </p>
            </div>

            {/* Average progress */}
            <div className="flex items-center gap-2">
                <span className="w-16 shrink-0 text-[9.5px] font-bold tracking-wide text-slate-400 sm:hidden">PROGRESS</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                    {row.total > 0 && (
                        <div
                            className="h-full rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, row.avgProgress))}%`, background: PROGRESS_COLOR }}
                        />
                    )}
                </div>
                <span className="w-14 shrink-0 text-right text-xs font-bold text-slate-800" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {row.total ? formatPct(row.avgProgress) : "—"}
                </span>
            </div>

            {/* Status mix */}
            <div className="flex items-center gap-2">
                <span className="w-16 shrink-0 text-[9.5px] font-bold tracking-wide text-slate-400 sm:hidden">STATUS</span>
                <div className="flex h-4 flex-1 items-center">
                    {row.total ? (
                        <div
                            // 2px surface gap between segments instead of borders.
                            className="flex h-full gap-[2px]"
                            style={{ width: `${(row.total / maxTotal) * 100}%` }}
                        >
                            {statuses.map(([status, n], i) => (
                                <div
                                    key={status}
                                    className={`h-full min-w-[3px] ${i === 0 ? "rounded-l-sm" : ""} ${i === statuses.length - 1 ? "rounded-r-sm" : ""}`}
                                    style={{ flexGrow: n, flexBasis: 0, background: statusColor(status) }}
                                />
                            ))}
                        </div>
                    ) : (
                        <span className="text-[10.5px] text-slate-400">No projects</span>
                    )}
                </div>
            </div>

            {/* Breakdown on hover / focus — every figure here is also in the
                row's accessible label. */}
            {open && row.total > 0 && (
                <div className="pointer-events-none absolute right-2 top-full z-10 mt-1 w-56 rounded-sm border border-slate-200 bg-white p-2.5 shadow-lg">
                    <div className="mb-1.5 flex items-baseline justify-between gap-2">
                        <p className="truncate text-[11px] font-bold text-slate-800">{name}</p>
                        <p className="text-[12px] font-extrabold text-slate-900">{formatPct(row.avgProgress)}</p>
                    </div>
                    {statuses.map(([status, n]) => (
                        <div key={status} className="flex items-center justify-between gap-2 py-px">
                            <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: statusColor(status) }} />
                                {statusLabel(status)}
                            </span>
                            <span className="text-[11px] font-bold text-slate-800">{n}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ── District card ──────────────────────────────────────────────
const DistrictLocationCard = ({ data, budgetYear }: { data: DistrictLocations; budgetYear?: string }) => {
    const rows = useMemo(
        () =>
            [...data.locations].sort((a, b) => {
                // Unassigned last, then busiest first, then alphabetical.
                if ((a.name === null) !== (b.name === null)) return a.name === null ? 1 : -1;
                return b.total - a.total || (a.name ?? "").localeCompare(b.name ?? "");
            }),
        [data.locations],
    );

    const total = rows.reduce((s, r) => s + r.total, 0);
    const progressSum = rows.reduce((s, r) => s + r.avgProgress * r.total, 0);
    const maxTotal = Math.max(1, ...rows.map((r) => r.total));
    // Coverage counts official municipalities only; legacy names and the
    // unassigned bucket still get rows but aren't extra "locations".
    const withProjects = rows.filter((r) => r.known && r.total > 0).length;
    const municipalities = rows.filter((r) => r.known).length;

    const statusTotals = new Map<string, number>();
    for (const r of rows) {
        for (const [s, n] of Object.entries(r.counts)) statusTotals.set(s, (statusTotals.get(s) ?? 0) + n);
    }
    const presentStatuses = [...statusTotals.entries()]
        .filter(([, n]) => n > 0)
        .sort(([a], [b]) => statusRank(a) - statusRank(b));

    return (
        // h-full + column flex: side by side, the district with fewer
        // municipalities still fills the row's height, and its footer bar stays
        // pinned to the bottom rather than floating mid-card.
        <div className="flex h-full flex-col bg-white rounded-sm overflow-hidden border border-slate-200">
            <div className="flex-1 p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="mb-1 text-[15px] font-extrabold uppercase tracking-widest text-[#1e3a8a]">
                            {DISTRICT_TITLE[data.district] ?? data.district.replace("_", " ")}
                        </p>
                        <p className="text-[10px] text-slate-500">
                            Average progress and project status for each city / municipality
                        </p>
                    </div>
                    <div className="shrink-0 text-right">
                        <div className="mb-1 flex justify-end">
                            <FyBadge year={budgetYear} />
                        </div>
                        <p className="text-3xl font-extrabold leading-none text-slate-900">
                            {total ? formatPct(progressSum / total) : "—"}
                        </p>
                        <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">AVG PROGRESS</p>
                    </div>
                </div>

                {/* Status legend: what the segment colours mean, with this card's totals */}
                {presentStatuses.length > 0 && (
                    <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                        {presentStatuses.map(([status, n]) => (
                            <div key={status} className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: statusColor(status) }} />
                                <span className="text-[10.5px] text-slate-500">
                                    {statusLabel(status)} <span className="font-bold text-slate-700">{n}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Column headings (wide screens; on phones each bar carries its own label) */}
                <div className="hidden border-b border-slate-200 px-2 pb-1.5 text-[9.5px] font-bold tracking-wide text-slate-400 sm:grid sm:grid-cols-[minmax(7rem,9rem)_minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-4">
                    <span>LOCATION</span>
                    <span>AVG PROGRESS</span>
                    <span>PROJECTS BY STATUS</span>
                </div>

                <div className="divide-y divide-slate-100">
                    {rows.map((row) => (
                        <LocationRowView key={row.name ?? "__unassigned"} row={row} maxTotal={maxTotal} />
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-slate-300 bg-white px-4 py-[9px] text-[11px] font-bold uppercase tracking-widest text-black">
                <span>{withProjects} OF {municipalities} LOCATIONS WITH PROJECTS</span>
                <span>{total} PROJECTS</span>
            </div>
        </div>
    );
};

// ── Panel ──────────────────────────────────────────────────────
// Presentational half: renders from plain data. Office divisions pass both
// districts (two cards); 1ST/2ND ENGR DIST admins pass only their own.
export const LocationBreakdownPanel = ({
    districts,
    isLoading = false,
    budgetYear,
}: {
    districts: DistrictLocations[];
    isLoading?: boolean;
    budgetYear?: string;
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <ProgressChartSkeleton height={220} />
                <ProgressChartSkeleton height={220} />
            </div>
        );
    }

    if (!districts.length) {
        return (
            <div className="bg-white rounded-sm border border-slate-200 p-10 text-center text-sm text-slate-400">
                No location data yet.
            </div>
        );
    }

    return (
        // No items-start: the cards stretch to the tallest in the row.
        <div className={`grid grid-cols-1 gap-4 ${districts.length > 1 ? "xl:grid-cols-2" : ""}`}>
            {districts.map((d) => (
                <DistrictLocationCard key={d.district} data={d} budgetYear={budgetYear} />
            ))}
        </div>
    );
};

// ── Section ────────────────────────────────────────────────────
// Data half. The server scopes the districts to the caller's division.
export const LocationBreakdownSection = ({ budgetYear }: { budgetYear: string }) => {
    const { data, isLoading } = api.project.getLocationBreakdown.useQuery(
        budgetYear ? { budgetYear } : undefined,
    );
    return <LocationBreakdownPanel districts={data ?? []} isLoading={isLoading} budgetYear={budgetYear} />;
};
