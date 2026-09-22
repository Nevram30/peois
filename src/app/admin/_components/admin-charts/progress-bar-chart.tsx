"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { statusColor, statusLabel, type ProgressSeries } from "./progress-line-chart";

// ── Geometry ───────────────────────────────────────────────────
// Matches the line chart's gutters so the two views swap without the plot
// shifting: same left gutter for "100%", same bottom band for the rank ticks.
const PAD = { top: 14, right: 16, bottom: 24, left: 40 };
const Y_TICKS = [0, 25, 50, 75, 100];

const clampPct = (value: number) => Math.min(100, Math.max(0, value));

const fullDate = new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
});

const formatPct = (value: number) =>
    `${Number(value.toFixed(2)).toLocaleString("en-PH")}%`;

// ── Chart ──────────────────────────────────────────────────────
// The same data as the line chart, read as magnitude instead of trend: one bar
// per project, least advanced on the left, coloured by status. Two districts
// share each rank slot as a pair of bars, so the ranks still line up.
export const ProgressBarChart = ({
    series,
    maxRank,
    height = 260,
}: {
    series: ProgressSeries[];
    // Largest project count to scale the x axis against, so side-by-side cards
    // keep comparable bar widths.
    maxRank?: number | null;
    height?: number;
}) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    // Rank the pointer (or the arrow keys) is snapped to, 1-based.
    const [anchor, setAnchor] = useState<number | null>(null);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const observer = new ResizeObserver(([entry]) => {
            setWidth(entry?.contentRect.width ?? 0);
        });
        observer.observe(el);
        setWidth(el.clientWidth);
        return () => observer.disconnect();
    }, []);

    const totalPoints = series.reduce((sum, s) => sum + s.points.length, 0);
    const ownMax = series.reduce((max, s) => Math.max(max, s.points.length), 0);
    const axisMax = Math.max(maxRank ?? 0, ownMax);

    const plotW = Math.max(0, width - PAD.left - PAD.right);
    const plotH = Math.max(0, height - PAD.top - PAD.bottom);
    const baselineY = PAD.top + plotH;

    // One slot per rank, shared by the districts. Bars keep a hairline gap so
    // neighbours never merge into one block; below ~3px the gap is dropped
    // rather than eating the bar.
    const slotW = axisMax > 0 ? plotW / axisMax : 0;
    const groupW = series.length > 0 ? slotW / series.length : slotW;
    const barW = Math.max(1, groupW >= 4 ? groupW - 1 : groupW);

    // Projects sorted the same way as the line chart (least to most advanced),
    // so switching views keeps every project in its place.
    const laidOut = useMemo(
        () =>
            series.map((s, seriesIndex) => ({
                ...s,
                bars: [...s.points]
                    .sort((a, b) => a.progress - b.progress)
                    .map((point, i) => {
                        const pct = clampPct(point.progress);
                        const h = (pct / 100) * plotH;
                        return {
                            point,
                            rank: i + 1,
                            x: PAD.left + slotW * i + groupW * seriesIndex + (groupW - barW) / 2,
                            // At least 1px so a 0% project still reads as a bar.
                            y: baselineY - Math.max(1, h),
                            h: Math.max(1, h),
                        };
                    }),
            })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [series, axisMax, plotW, plotH],
    );

    // Every series' bar at the anchored rank — one tooltip covers the pair, the
    // way the line chart's crosshair does. A district whose projects run out
    // before that rank simply isn't listed.
    const activeRows = useMemo(() => {
        if (anchor === null) return [];
        return laidOut
            .map((s) => {
                const bar = s.bars[anchor - 1];
                return bar ? { series: s, bar } : null;
            })
            .filter((row): row is { series: (typeof laidOut)[number]; bar: NonNullable<typeof row>["bar"] } => row !== null);
    }, [anchor, laidOut]);

    const xTicks = useMemo(() => {
        if (!plotW || !axisMax) return [];
        if (axisMax === 1) return [{ x: PAD.left + slotW / 2, label: "1" }];
        const count = Math.min(axisMax, plotW < 360 ? 3 : 5);
        return Array.from({ length: count }, (_, i) => {
            const rank = Math.round(1 + ((axisMax - 1) * i) / (count - 1));
            return { x: PAD.left + slotW * (rank - 0.5), label: String(rank) };
        });
    }, [plotW, axisMax, slotW]);

    if (!totalPoints) {
        return (
            <div
                className="flex items-center justify-center rounded-sm border border-dashed border-slate-200 text-[11px] text-slate-400"
                style={{ height }}
            >
                No projects to plot for this budget year.
            </div>
        );
    }

    const anchorX = anchor === null ? 0 : PAD.left + slotW * (anchor - 0.5);

    return (
        <div ref={wrapRef} className="relative w-full">
            {width > 0 && (
                <svg
                    width={width}
                    height={height}
                    role="img"
                    tabIndex={0}
                    aria-label={`Progress of ${totalPoints} project${totalPoints === 1 ? "" : "s"} as bars, each district's projects ranked from least to most advanced. ${series
                        .map((s) => `${s.label}: ${s.points.length} projects`)
                        .join("; ")}.`}
                    className="touch-none outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                    onPointerMove={(e) => {
                        if (!slotW) return;
                        const px = e.clientX - e.currentTarget.getBoundingClientRect().left;
                        const rank = Math.floor((px - PAD.left) / slotW) + 1;
                        setAnchor(Math.min(axisMax, Math.max(1, rank)));
                    }}
                    onPointerLeave={() => setAnchor(null)}
                    onBlur={() => setAnchor(null)}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                            e.preventDefault();
                            const delta = e.key === "ArrowRight" ? 1 : -1;
                            setAnchor((a) => Math.min(axisMax, Math.max(1, (a ?? 0) + delta)));
                        } else if (e.key === "Escape") {
                            setAnchor(null);
                        }
                    }}
                >
                    {/* Gridlines — recessive hairlines behind the bars */}
                    {Y_TICKS.map((tick) => {
                        const y = PAD.top + (1 - tick / 100) * plotH;
                        return (
                            <g key={tick}>
                                <line x1={PAD.left} x2={PAD.left + plotW} y1={y} y2={y} stroke="#e2e8f0" strokeWidth={1} />
                                <text
                                    x={PAD.left - 8}
                                    y={y + 3}
                                    textAnchor="end"
                                    fontSize="9"
                                    fill="#94a3b8"
                                    fontFamily="inherit"
                                    style={{ fontVariantNumeric: "tabular-nums" }}
                                >
                                    {tick}%
                                </text>
                            </g>
                        );
                    })}

                    {/* X ticks — the project's rank within its district */}
                    {xTicks.map((tick, i) => (
                        <text
                            key={i}
                            x={tick.x}
                            y={PAD.top + plotH + 15}
                            textAnchor={i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle"}
                            fontSize="9"
                            fill="#94a3b8"
                            fontFamily="inherit"
                            style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                            {tick.label}
                        </text>
                    ))}

                    {/* Anchored slot, behind the bars */}
                    {anchor !== null && activeRows.length > 0 && (
                        <rect x={anchorX - slotW / 2} y={PAD.top} width={slotW} height={plotH} fill="#0f172a" opacity={0.05} />
                    )}

                    {/* Bars, rounded at the data end only, anchored to the baseline */}
                    {laidOut.map((s) => (
                        <g key={s.key}>
                            {s.bars.map((bar) => (
                                <rect
                                    key={bar.point.id}
                                    x={bar.x}
                                    y={bar.y}
                                    width={barW}
                                    height={bar.h}
                                    rx={Math.min(2, barW / 3)}
                                    fill={statusColor(bar.point.status)}
                                    opacity={anchor === null || bar.rank === anchor ? 1 : 0.55}
                                />
                            ))}
                        </g>
                    ))}

                    {/* Baseline */}
                    <line x1={PAD.left} x2={PAD.left + plotW} y1={baselineY} y2={baselineY} stroke="#cbd5e1" strokeWidth={1} />
                </svg>
            )}

            {/* Tooltip — the same figures the line chart's tooltip carries */}
            {anchor !== null && activeRows.length > 0 && (
                <div
                    className="pointer-events-none absolute z-10 w-56 rounded-sm border border-slate-200 bg-white p-2.5 shadow-lg"
                    style={{
                        left: anchorX,
                        top: PAD.top,
                        transform:
                            anchorX > PAD.left + plotW / 2
                                ? "translateX(calc(-100% - 12px))"
                                : "translateX(12px)",
                    }}
                >
                    {activeRows.map((row) => (
                        <div key={row.series.key} className="mb-2 last:mb-0">
                            <div className="flex items-baseline justify-between gap-2">
                                <span className="truncate text-[10px] text-slate-500">
                                    {row.series.shortLabel} · #{row.bar.rank}
                                </span>
                                <span className="text-[12px] font-extrabold text-slate-900">
                                    {formatPct(row.bar.point.progress)}
                                </span>
                            </div>
                            <p className="mt-0.5 truncate text-[10px] font-semibold text-slate-700">
                                {row.bar.point.projectCode}
                            </p>
                            <p className="truncate text-[10px] text-slate-500">{row.bar.point.title}</p>
                            {/* Status in words beside its swatch — colour alone never carries it */}
                            <p className="mt-0.5 flex items-center gap-1 text-[9px] font-bold tracking-wide text-slate-600">
                                <span
                                    className="h-2 w-2 shrink-0 rounded-full"
                                    style={{ background: statusColor(row.bar.point.status) }}
                                />
                                {statusLabel(row.bar.point.status)}
                            </p>
                            <p className="text-[9px] text-slate-400">
                                {row.bar.point.estimated ? "Added " : "Started "}
                                {fullDate.format(row.bar.point.date)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
