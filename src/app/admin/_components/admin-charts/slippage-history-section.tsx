"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "~/trpc/react";
import {
    SLIPPAGE_STAGE_CONFIG,
    SLIPPAGE_STAGE_VALUES,
    type SlippageStage,
    computeSlippage,
    formatSlippage,
    getSlippageStage,
} from "~/lib/slippage";
import { ProgressChartSkeleton } from "../admin-cards/skeleton.cards";

// ── Types ──────────────────────────────────────────────────────

export type SlippagePoint = {
    id: string;
    date: Date;
    target: number;
    actual: number;
    revision: number;
};

export type SlippageProject = {
    id: string;
    projectCode: string;
    title: string;
    cityMunicipality: string | null;
    // Oldest first.
    slippageAssessments: SlippagePoint[];
};

// ── Stage colours ──────────────────────────────────────────────
// Hex twins of the Tailwind classes in SLIPPAGE_STAGE_CONFIG (emerald, blue,
// amber, orange, red 500), since SVG fills can't take a class.
const STAGE_HEX: Record<SlippageStage, string> = {
    ON_TRACK: "#10b981",
    EARLY_WARNING: "#3b82f6",
    WARNING: "#f59e0b",
    CRITICAL: "#f97316",
    TERMINAL: "#ef4444",
};

// Stage bands on the slippage axis, as [from, to) in percentage points. The
// outer bands are open-ended and get clipped to the chart's domain.
const STAGE_BANDS: { stage: SlippageStage; from: number; to: number }[] = [
    { stage: "TERMINAL", from: -Infinity, to: -15 },
    { stage: "CRITICAL", from: -15, to: -10 },
    { stage: "WARNING", from: -10, to: -5 },
    { stage: "EARLY_WARNING", from: -5, to: -1 },
    { stage: "ON_TRACK", from: -1, to: Infinity },
];

const shortDate = new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric" });
const fullDate = new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" });

const formatPct = (value: number) => `${Number(value.toFixed(2)).toLocaleString("en-PH")}%`;

// ── Geometry ───────────────────────────────────────────────────
// Left gutter fits a "-20%" slippage tick, the bottom band the date labels.
// The right gutter leaves room for half of a centred "Sep 19" on the last point.
const PAD = { top: 10, right: 18, bottom: 24, left: 38 };
// Date labels closer than this (centre to centre) are dropped so they never
// overprint.
const MIN_LABEL_GAP = 40;

// ── Chart ──────────────────────────────────────────────────────
// One project's slippage history as a line, so the trend — sliding toward a
// worse stage or recovering — reads at a glance. Time runs along the x axis on
// a true date scale (oldest on the left), so gaps between assessments show as
// gaps; slippage runs up the y axis, below zero is behind schedule, with the
// stage bands tinted behind the line.
export const SlippageHistoryChart = ({
    points,
    domain,
    height = 220,
}: {
    points: SlippagePoint[];
    // Slippage range for this card's y axis, from `domainFor`.
    domain: [number, number];
    height?: number;
}) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [active, setActive] = useState<number | null>(null);

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

    const [sMin, sMax] = domain;
    const plotW = Math.max(0, width - PAD.left - PAD.right);
    const plotH = Math.max(0, height - PAD.top - PAD.bottom);

    // Higher slippage sits higher on the chart: ahead of schedule at the top,
    // the Terminal band at the bottom.
    const yOf = (slippage: number) =>
        PAD.top + (1 - (Math.min(sMax, Math.max(sMin, slippage)) - sMin) / (sMax - sMin)) * plotH;

    const coords = useMemo(() => {
        const times = points.map((p) => new Date(p.date).getTime());
        const tMin = Math.min(...times);
        const tMax = Math.max(...times);
        return points.map((p, i) => {
            const slippage = computeSlippage(p.target, p.actual);
            const t = times[i]!;
            return {
                point: p,
                slippage,
                stage: getSlippageStage(slippage),
                // A single date (or several on one day) sits mid-plot.
                x: tMax === tMin ? PAD.left + plotW / 2 : PAD.left + ((t - tMin) / (tMax - tMin)) * plotW,
                y: yOf(slippage),
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [points, sMin, sMax, plotW, plotH]);

    // Date labels at the assessments themselves, skipping any that would crowd
    // the one before. Same-day assessments share a label.
    const xLabels = useMemo(() => {
        const labels: { x: number; text: string }[] = [];
        for (const c of coords) {
            const prev = labels[labels.length - 1];
            if (prev && c.x - prev.x < MIN_LABEL_GAP) continue;
            labels.push({ x: c.x, text: shortDate.format(new Date(c.point.date)) });
        }
        return labels;
    }, [coords]);

    const yTicks = useMemo(() => {
        if (!plotH) return [];
        const step = plotH < 160 ? 10 : 5;
        const ticks: number[] = [];
        for (let v = Math.ceil(sMin / step) * step; v <= sMax; v += step) ticks.push(v);
        if (!ticks.includes(0) && sMin <= 0 && sMax >= 0) ticks.push(0);
        return ticks.sort((a, b) => a - b);
    }, [plotH, sMin, sMax]);

    const current = active === null ? null : (coords[active] ?? null);

    return (
        <div ref={wrapRef} className="relative w-full">
            {width > 0 && (
                <svg
                    width={width}
                    height={height}
                    role="img"
                    tabIndex={0}
                    aria-label={`Slippage history, ${coords.length} assessment${coords.length === 1 ? "" : "s"}: ${coords
                        .map((c) => `${fullDate.format(new Date(c.point.date))} ${formatSlippage(c.slippage)}% (${SLIPPAGE_STAGE_CONFIG[c.stage].label})`)
                        .join("; ")}.`}
                    className="touch-none outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                    onPointerMove={(e) => {
                        if (!coords.length) return;
                        const px = e.clientX - e.currentTarget.getBoundingClientRect().left;
                        let best = 0;
                        coords.forEach((c, i) => {
                            if (Math.abs(c.x - px) < Math.abs(coords[best]!.x - px)) best = i;
                        });
                        setActive(best);
                    }}
                    onPointerLeave={() => setActive(null)}
                    onBlur={() => setActive(null)}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                            e.preventDefault();
                            const delta = e.key === "ArrowRight" ? 1 : -1;
                            setActive((a) => Math.min(coords.length - 1, Math.max(0, a === null ? 0 : a + delta)));
                        } else if (e.key === "Escape") {
                            setActive(null);
                        }
                    }}
                >
                    {/* Stage bands — a faint tint, so the line and dots carry the ink */}
                    {STAGE_BANDS.map((band) => {
                        const from = Math.max(sMin, band.from);
                        const to = Math.min(sMax, band.to);
                        if (to <= from) return null;
                        return (
                            <rect
                                key={band.stage}
                                x={PAD.left}
                                y={yOf(to)}
                                width={plotW}
                                height={yOf(from) - yOf(to)}
                                fill={STAGE_HEX[band.stage]}
                                opacity={0.08}
                            />
                        );
                    })}

                    {/* Horizontal gridlines + slippage ticks. The 0% line is
                        dashed rather than a heavier solid: a project sitting at
                        0% draws its trend line along it, and two solid slate
                        lines on the same pixels read as one — the line looked
                        missing, leaving its dots seemingly unconnected. */}
                    {yTicks.map((tick) => (
                        <g key={tick}>
                            <line
                                x1={PAD.left}
                                x2={PAD.left + plotW}
                                y1={yOf(tick)}
                                y2={yOf(tick)}
                                stroke={tick === 0 ? "#94a3b8" : "#e2e8f0"}
                                strokeWidth={1}
                                strokeDasharray={tick === 0 ? "4 3" : undefined}
                            />
                            <text
                                x={PAD.left - 8}
                                y={yOf(tick) + 3}
                                textAnchor="end"
                                fontSize="9"
                                fill="#94a3b8"
                                fontFamily="inherit"
                                style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                {tick > 0 ? `+${tick}` : tick}%
                            </text>
                        </g>
                    ))}

                    {/* Date labels */}
                    {xLabels.map((label, i) => (
                        <text
                            key={i}
                            x={label.x}
                            y={PAD.top + plotH + 15}
                            textAnchor="middle"
                            fontSize="9"
                            fill="#94a3b8"
                            fontFamily="inherit"
                        >
                            {label.text}
                        </text>
                    ))}

                    {/* Crosshair on the hovered assessment */}
                    {current && (
                        <line
                            x1={current.x}
                            x2={current.x}
                            y1={PAD.top}
                            y2={PAD.top + plotH}
                            stroke="#cbd5e1"
                            strokeWidth={1}
                        />
                    )}

                    {coords.length > 1 && (
                        <polyline
                            points={coords.map((c) => `${c.x},${c.y}`).join(" ")}
                            fill="none"
                            stroke="#0f172a"
                            strokeWidth={2}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                    )}
                    {coords.map((c, i) => (
                        <circle
                            key={c.point.id}
                            cx={c.x}
                            cy={c.y}
                            // A lone assessment has no line to carry it, so its dot
                            // is drawn at the hovered size to hold the eye.
                            r={i === active || coords.length === 1 ? 5 : 3.5}
                            fill={STAGE_HEX[c.stage]}
                            stroke="#ffffff"
                            strokeWidth={2}
                        />
                    ))}

                    {/* With one assessment there's no trend to draw — label the
                        value directly so the chart doesn't look broken. */}
                    {coords.length === 1 && coords[0] && active === null && (
                        <text
                            x={coords[0].x + 10}
                            y={coords[0].y + 3}
                            fontSize="10"
                            fontWeight="700"
                            fill="#334155"
                            fontFamily="inherit"
                            style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                            {formatSlippage(coords[0].slippage)}%
                        </text>
                    )}
                </svg>
            )}

            {current && (
                <div
                    className="pointer-events-none absolute z-10 w-48 rounded-sm border border-slate-200 bg-white p-2.5 shadow-lg"
                    style={{
                        top: PAD.top,
                        left: current.x,
                        transform:
                            current.x > PAD.left + plotW / 2 ? "translateX(calc(-100% - 12px))" : "translateX(12px)",
                    }}
                >
                    <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[10px] text-slate-500">{fullDate.format(new Date(current.point.date))}</span>
                        <span className={`text-[12px] font-extrabold ${SLIPPAGE_STAGE_CONFIG[current.stage].text}`}>
                            {formatSlippage(current.slippage)}%
                        </span>
                    </div>
                    {/* Stage in words beside its dot — colour alone never carries it */}
                    <p className="mt-0.5 flex items-center gap-1 text-[9px] font-bold tracking-wide text-slate-600">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: STAGE_HEX[current.stage] }} />
                        {SLIPPAGE_STAGE_CONFIG[current.stage].label.toUpperCase()}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                        Target <span className="font-bold text-slate-700">{formatPct(current.point.target)}</span>
                        {" · "}Actual <span className="font-bold text-slate-700">{formatPct(current.point.actual)}</span>
                    </p>
                    <p className="text-[9px] text-slate-400">Revision {current.point.revision}</p>
                </div>
            )}
        </div>
    );
};

// The y range for one card: its own assessments, but never narrower than the
// published bands (+5% down to −20%), so the stage stripes stay legible and a
// project that never left On Track doesn't get a scale of its own noise.
// Rounded outwards to whole 5s, which is where the ticks fall.
const domainFor = (points: SlippagePoint[]): [number, number] => {
    const values = points.map((p) => computeSlippage(p.target, p.actual));
    return [
        Math.floor(Math.min(-20, ...values) / 5) * 5,
        Math.ceil(Math.max(5, ...values) / 5) * 5,
    ];
};

// ── Project card ───────────────────────────────────────────────
const SlippageProjectCard = ({ project }: { project: SlippageProject }) => {
    const points = project.slippageAssessments;
    const domain = useMemo(() => domainFor(points), [points]);
    const latest = points[points.length - 1]!;
    const latestSlippage = computeSlippage(latest.target, latest.actual);
    const stage = SLIPPAGE_STAGE_CONFIG[getSlippageStage(latestSlippage)];

    return (
        <div className="bg-white rounded-sm border border-slate-200 p-4">
            <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-800" title={project.title}>{project.title}</p>
                    <p className="truncate text-[10.5px] text-slate-500">
                        <span className="text-blue-500">{project.projectCode}</span>
                        {project.cityMunicipality ? ` · ${project.cityMunicipality}` : ""}
                    </p>
                </div>
                <div className="shrink-0 text-right">
                    <p className={`text-lg font-extrabold leading-none ${stage.text}`} style={{ fontVariantNumeric: "tabular-nums" }}>
                        {formatSlippage(latestSlippage)}%
                    </p>
                    <span className={`mt-1 inline-block rounded-full px-2 py-px text-[9px] font-bold ${stage.badge}`}>
                        {stage.label}
                    </span>
                </div>
            </div>
            <SlippageHistoryChart points={points} domain={domain} />
            <p className="mt-1 text-[10px] text-slate-400">
                {points.length === 1
                    ? `1 assessment · ${fullDate.format(new Date(latest.date))} · the trend line starts with the next assessment`
                    : `${points.length} assessments · latest ${fullDate.format(new Date(latest.date))}`}
            </p>
        </div>
    );
};

// ── Section ────────────────────────────────────────────────────
const PAGE_SIZE = 12;

export const SlippageHistorySection = ({ budgetYear }: { budgetYear: string }) => {
    const { data, isLoading } = api.project.getSlippageHistory.useQuery(
        budgetYear ? { budgetYear } : undefined,
    );
    const [search, setSearch] = useState("");
    const [shown, setShown] = useState(PAGE_SIZE);

    const projects = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return data ?? [];
        return (data ?? []).filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.projectCode.toLowerCase().includes(q) ||
                (p.cityMunicipality ?? "").toLowerCase().includes(q),
        );
    }, [data, search]);

    return (
        <div>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-[15px] font-extrabold uppercase tracking-widest text-[#1e3a8a]">
                        Slippage History per Project
                    </p>
                    <p className="text-[10px] text-slate-500">
                        Assessment dates run across, slippage (actual − target) runs up; below 0% is behind schedule.
                        Each chart is scaled to its own range, so check the axis before comparing two projects.
                    </p>
                </div>
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setShown(PAGE_SIZE);
                    }}
                    className="w-full rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#1e3a4f] focus:outline-none focus:ring-2 focus:ring-[#1e3a4f]/20 sm:w-64"
                />
            </div>

            {/* Stage legend: what the band and dot colours mean */}
            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                {SLIPPAGE_STAGE_VALUES.map((s) => (
                    <div key={s} className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: STAGE_HEX[s] }} />
                        <span className="text-[10.5px] text-slate-500">
                            {SLIPPAGE_STAGE_CONFIG[s].label} <span className="text-slate-400">({SLIPPAGE_STAGE_CONFIG[s].range})</span>
                        </span>
                    </div>
                ))}
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <ProgressChartSkeleton height={220} />
                    <ProgressChartSkeleton height={220} />
                    <ProgressChartSkeleton height={220} />
                </div>
            ) : !projects.length ? (
                <div className="bg-white rounded-sm border border-slate-200 p-10 text-center text-sm text-slate-400">
                    {search ? "No projects match your search." : "No slippage assessments filed yet."}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {projects.slice(0, shown).map((p) => (
                            <SlippageProjectCard key={p.id} project={p} />
                        ))}
                    </div>
                    {projects.length > shown && (
                        <div className="mt-4 flex justify-center">
                            <button
                                type="button"
                                onClick={() => setShown((n) => n + PAGE_SIZE)}
                                className="rounded-sm border border-slate-200 bg-white px-4 py-2 text-xs font-bold tracking-wide text-slate-600 hover:bg-slate-50"
                            >
                                SHOW MORE ({projects.length - shown} LEFT)
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
