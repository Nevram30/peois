"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
    type ProjectStatus,
    STATUS_COLORS,
    STATUS_LABELS,
} from "~/app/super-admin/dashboardv2/super.adminv2.types";

// ── Status colours ─────────────────────────────────────────────
// Dots take the same status palette as the District Project Status cards
// above the chart, so a colour means one status everywhere on the dashboard.
// An unrecognised status reads as OTHERS rather than going uncoloured.
export const statusColor = (status: string) =>
    STATUS_COLORS[status as ProjectStatus] ?? STATUS_COLORS.OTHERS;

export const statusLabel = (status: string) =>
    STATUS_LABELS[status as ProjectStatus] ?? status.replace(/_/g, " ");

// ── Line key ───────────────────────────────────────────────────
// A short stroke drawn with the series' own colour and dash, so the legend and
// tooltip keys match the line exactly (a CSS bar can't show a dash pattern).
export const LineKey = ({ color, dash, width = 16 }: { color: string; dash?: string; width?: number }) => (
    <svg width={width} height={4} className="shrink-0" aria-hidden>
        <line x1={1} x2={width - 1} y1={2} y2={2} stroke={color} strokeWidth={2} strokeDasharray={dash} strokeLinecap="round" />
    </svg>
);

// ── Types ──────────────────────────────────────────────────────

export type ProgressPoint = {
    id: string;
    projectCode: string;
    title: string;
    status: string;
    progress: number;
    // When the project started (`dateStarted`), or when it was added if no
    // start date was ever recorded — see `estimated`. Tooltip only; the x axis
    // is progress rank, not time.
    date: Date;
    estimated: boolean;
};

export type ProgressSeries = {
    key: string;
    label: string;
    // Short form used for the direct label at the end of the line, where the
    // full district name would collide with the plot.
    shortLabel: string;
    // Line colour. Kept neutral: the dots carry status colour, and two of the
    // status colours sit too close to a blue or orange line to be seen on it.
    color: string;
    // SVG dash pattern — with the line colour shared, this is what tells the
    // districts apart. Undefined draws a solid line.
    dash?: string;
    // Expected in ascending progress order (the server sorts them); the chart
    // re-sorts defensively so a caller can't hand it a scribble.
    points: ProgressPoint[];
};

type ProgressLineChartProps = {
    series: ProgressSeries[];
    // Largest project count to scale the x axis against. Passed in when several
    // charts sit side by side so their axes line up and the curves stay
    // comparable; omitted, each chart fits its own data.
    maxRank?: number | null;
    height?: number;
};

// ── Geometry ───────────────────────────────────────────────────
// Left gutter fits "100%", the bottom band the rank ticks — an axis clipped by
// the container is the classic way these cards end up with a nested scrollbar.
// What the rank ticks mean is said once, in the card's subtitle, rather than
// re-inked per chart. The right gutter holds the end-of-line district label,
// so a lone series (the separated view) gives that space back to the plot.
const padding = (seriesCount: number) => ({
    top: 14,
    right: seriesCount > 1 ? 60 : 16,
    bottom: 24,
    left: 40,
});
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
// Each district's projects, sorted least- to most-advanced, form one line: the
// district's progress curve. Reading it: how far along the line sits above 50%
// is how much of that district's portfolio is past halfway.
export const ProgressLineChart = ({ series, maxRank, height = 260 }: ProgressLineChartProps) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    // Index into `merged` — the point the crosshair is snapped to, from either
    // the pointer or the arrow keys.
    const [anchor, setAnchor] = useState<number | null>(null);

    // Measured rather than scaled with a viewBox: a uniformly scaled SVG would
    // shrink the tick text along with the plot on narrow screens.
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

    const PAD = padding(series.length);
    const totalPoints = series.reduce((sum, s) => sum + s.points.length, 0);
    const ownMax = series.reduce((max, s) => Math.max(max, s.points.length), 0);
    const axisMax = Math.max(maxRank ?? 0, ownMax);

    const plotW = Math.max(0, width - PAD.left - PAD.right);
    const plotH = Math.max(0, height - PAD.top - PAD.bottom);

    // x is the project's rank within its district, on a shared 1..axisMax axis:
    // a district with fewer projects simply has a shorter line, which reads as
    // the smaller portfolio it is.
    // Dot size is decided once for the whole chart from the on-screen gap
    // between neighbouring ranks, never per series: a per-series cutoff once
    // left a 60+ project district dotless beside a smaller one with dots.
    // Dense charts shrink the dots instead of dropping them, so every line
    // keeps its points. The white ring never goes below 1px: neighbouring dots
    // are different statuses now, and without it their colours run together.
    const rankGap = axisMax > 1 ? plotW / (axisMax - 1) : plotW;
    const marker = {
        r: Math.min(4, Math.max(2, rankGap / 2.5)),
        ring: rankGap >= 8 ? 2 : 1,
    };

    const xOfRank = (rank: number) =>
        axisMax <= 1 ? PAD.left + plotW / 2 : PAD.left + ((rank - 1) / (axisMax - 1)) * plotW;

    const laidOut = useMemo(
        () =>
            series.map((s) => ({
                ...s,
                coords: [...s.points]
                    .sort((a, b) => a.progress - b.progress)
                    .map((point, i) => ({
                        point,
                        rank: i + 1,
                        x: xOfRank(i + 1),
                        y: PAD.top + (1 - clampPct(point.progress) / 100) * plotH,
                    })),
            })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [series, axisMax, plotW, plotH],
    );

    // Every point from every series in x order — what the crosshair snaps to,
    // so the pointer only has to be nearest, never dead-centre on a 2px line.
    const merged = useMemo(
        () =>
            laidOut
                .flatMap((s, seriesIndex) => s.coords.map((c) => ({ ...c, seriesIndex })))
                .sort((a, b) => a.x - b.x),
        [laidOut],
    );

    const active = anchor === null ? null : (merged[anchor] ?? null);

    // One tooltip lists every series at the crosshair's rank: the reader never
    // has to land on a particular line to get its number. A district whose line
    // has already ended at that rank is left out rather than clamped to its
    // last project, which would report a point the crosshair isn't on.
    const activeRows = useMemo(() => {
        if (!active) return [];
        return laidOut
            .map((s) => {
                const coord = s.coords[active.rank - 1];
                return coord ? { series: s, coord } : null;
            })
            .filter((row): row is { series: (typeof laidOut)[number]; coord: NonNullable<typeof row>["coord"] } => row !== null);
    }, [active, laidOut]);

    const xTicks = useMemo(() => {
        if (!plotW || !axisMax) return [];
        if (axisMax === 1) return [{ x: PAD.left + plotW / 2, label: "1" }];
        const count = Math.min(axisMax, plotW < 360 ? 3 : 5);
        return Array.from({ length: count }, (_, i) => {
            const rank = Math.round(1 + ((axisMax - 1) * i) / (count - 1));
            return { x: xOfRank(rank), label: String(rank) };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plotW, axisMax]);

    const moveAnchor = (delta: number) => {
        if (!merged.length) return;
        setAnchor((current) => {
            const next = current === null ? 0 : current + delta;
            return Math.min(merged.length - 1, Math.max(0, next));
        });
    };

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

    return (
        <div ref={wrapRef} className="relative w-full">
            {width > 0 && (
                <svg
                    width={width}
                    height={height}
                    role="img"
                    tabIndex={0}
                    aria-label={`Progress curve of ${totalPoints} project${totalPoints === 1 ? "" : "s"}, each district's projects ranked from least to most advanced. ${series
                        .map((s) => `${s.label}: ${s.points.length} projects`)
                        .join("; ")}.`}
                    className="touch-none outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                    onPointerMove={(e) => {
                        if (!merged.length) return;
                        const px = e.clientX - e.currentTarget.getBoundingClientRect().left;
                        let best = 0;
                        let bestDistance = Infinity;
                        merged.forEach((m, i) => {
                            const distance = Math.abs(m.x - px);
                            if (distance < bestDistance) {
                                bestDistance = distance;
                                best = i;
                            }
                        });
                        setAnchor(best);
                    }}
                    onPointerLeave={() => setAnchor(null)}
                    onBlur={() => setAnchor(null)}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowRight") {
                            e.preventDefault();
                            moveAnchor(1);
                        } else if (e.key === "ArrowLeft") {
                            e.preventDefault();
                            moveAnchor(-1);
                        } else if (e.key === "Escape") {
                            setAnchor(null);
                        }
                    }}
                >
                    {/* Gridlines — solid hairlines, one step off the surface */}
                    {Y_TICKS.map((tick) => {
                        const y = PAD.top + (1 - tick / 100) * plotH;
                        return (
                            <g key={tick}>
                                <line
                                    x1={PAD.left}
                                    x2={PAD.left + plotW}
                                    y1={y}
                                    y2={y}
                                    stroke="#e2e8f0"
                                    strokeWidth={1}
                                />
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
                    {/* Crosshair, beneath the lines so it never covers a mark */}
                    {active && (
                        <line
                            x1={active.x}
                            x2={active.x}
                            y1={PAD.top}
                            y2={PAD.top + plotH}
                            stroke="#cbd5e1"
                            strokeWidth={1}
                        />
                    )}

                    {/* Series */}
                    {laidOut.map((s) => {
                        const last = s.coords[s.coords.length - 1];
                        return (
                            <g key={s.key}>
                                {s.coords.length > 1 && (
                                    <polyline
                                        points={s.coords.map((c) => `${c.x},${c.y}`).join(" ")}
                                        fill="none"
                                        stroke={s.color}
                                        strokeWidth={2}
                                        strokeDasharray={s.dash}
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                    />
                                )}
                                {s.coords.map((c) => (
                                    <circle
                                        key={c.point.id}
                                        cx={c.x}
                                        cy={c.y}
                                        r={marker.r}
                                        fill={statusColor(c.point.status)}
                                        stroke="#ffffff"
                                        strokeWidth={marker.ring}
                                    />
                                ))}
                                {/* Direct label at the end of the line: identity is never
                                    carried by colour alone, even with the legend scrolled away */}
                                {series.length > 1 && last && (
                                    <text
                                        x={Math.min(last.x + 8, width - 4)}
                                        y={last.y + 3}
                                        fontSize="9"
                                        fontWeight="700"
                                        fill="#475569"
                                        fontFamily="inherit"
                                    >
                                        {s.shortLabel}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Hovered points, drawn last so they read above every line */}
                    {activeRows.map((row) => (
                        <circle
                            key={row.series.key}
                            cx={row.coord.x}
                            cy={row.coord.y}
                            r={5}
                            fill={statusColor(row.coord.point.status)}
                            stroke="#ffffff"
                            strokeWidth={2}
                        />
                    ))}

                    {/* Baseline */}
                    <line
                        x1={PAD.left}
                        x2={PAD.left + plotW}
                        y1={PAD.top + plotH}
                        y2={PAD.top + plotH}
                        stroke="#cbd5e1"
                        strokeWidth={1}
                    />
                </svg>
            )}

            {/* Tooltip — per-project figures for the hovered point. */}
            {active && activeRows.length > 0 && (
                <div
                    className="pointer-events-none absolute z-10 w-56 rounded-sm border border-slate-200 bg-white p-2.5 shadow-lg"
                    style={{
                        left: active.x,
                        top: PAD.top,
                        transform:
                            active.x > PAD.left + plotW / 2
                                ? "translateX(calc(-100% - 12px))"
                                : "translateX(12px)",
                    }}
                >
                    {activeRows.map((row) => (
                        <div key={row.series.key} className="mb-2 last:mb-0">
                            <div className="flex items-baseline justify-between gap-2">
                                <div className="flex min-w-0 items-center gap-1.5">
                                    {/* Darker than the plotted line so the dash reads at key size,
                                        matching the card's district legend */}
                                    <LineKey color="#64748b" dash={row.series.dash} />
                                    <span className="truncate text-[10px] text-slate-500">
                                        {row.series.shortLabel} · #{row.coord.rank}
                                    </span>
                                </div>
                                <span className="text-[12px] font-extrabold text-slate-900">
                                    {formatPct(row.coord.point.progress)}
                                </span>
                            </div>
                            <p className="mt-0.5 truncate text-[10px] font-semibold text-slate-700">
                                {row.coord.point.projectCode}
                            </p>
                            <p className="truncate text-[10px] text-slate-500">{row.coord.point.title}</p>
                            {/* Status in words beside its dot — colour alone never carries it */}
                            <p className="mt-0.5 flex items-center gap-1 text-[9px] font-bold tracking-wide text-slate-600">
                                <span
                                    className="h-2 w-2 shrink-0 rounded-full"
                                    style={{ background: statusColor(row.coord.point.status) }}
                                />
                                {statusLabel(row.coord.point.status)}
                            </p>
                            <p className="text-[9px] text-slate-400">
                                {row.coord.point.estimated ? "Added " : "Started "}
                                {fullDate.format(row.coord.point.date)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
