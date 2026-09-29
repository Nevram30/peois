"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { api } from "~/trpc/react";
import {
    SLIPPAGE_STAGE_CONFIG,
    SLIPPAGE_STAGE_VALUES,
    computeSlippage,
    formatSlippage,
    getSlippageStage,
} from "~/lib/slippage";
import { ProgressChartSkeleton } from "../admin-cards/skeleton.cards";
import { FyBadge } from "../admin-cards/cards";
import { STAGE_HEX } from "./slippage-history-section";

// ── Types ──────────────────────────────────────────────────────

type Assessment = {
    id: string;
    date: Date;
    target: number;
    actual: number;
    revision: number;
};

export type SCurveProject = {
    id: string;
    projectCode: string;
    title: string;
    cityMunicipality: string | null;
    dateStarted: Date | null;
    targetCompletionDate: Date | null;
    revisedCompletionDate: Date | null;
    // Oldest first.
    slippageAssessments: Assessment[];
};

type CurvePoint = { t: number; value: number };

// ── Colours ────────────────────────────────────────────────────
// Planned is the reference line, so it stays neutral (slate-500, dashed); the
// revised target is the brand blue; the recorded actual is the heaviest ink.
// Each line also differs by dash or weight, and the legend names all three.
const PLANNED = "#64748b";
const REVISED = "#3b82f6";
const ACTUAL = "#1e3a8a";

const shortDate = new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric" });
const fullDate = new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" });

const formatPct = (value: number) => `${value.toFixed(2)}%`;
const dayOf = (d: Date | string) => new Date(d).setHours(0, 0, 0, 0);

// ── Curves ─────────────────────────────────────────────────────
// Built from the project's filed assessments:
//  • Planned  — the 0% baseline at the start date, each Rev. 0 assessment's
//               target, and 100% at the target completion date.
//  • Revised  — only once a target has been revised (a Rev. 1+ assessment or a
//               revised completion date): it branches off the last Rev. 0
//               target, runs through the revised targets and ends at 100% on
//               the revised completion date.
//  • Actual   — the 0% baseline, then each assessment's recorded actual.
const buildCurves = (project: SCurveProject) => {
    const assessments = project.slippageAssessments;
    const first = assessments[0];
    const start = project.dateStarted ? dayOf(project.dateStarted) : null;
    // A start date after the first assessment would draw the curve backwards,
    // so the baseline is only used when it comes first.
    const baseline: CurvePoint | null =
        start !== null && (!first || start <= dayOf(first.date)) ? { t: start, value: 0 } : null;

    const original = assessments.filter((a) => a.revision === 0);
    const revisedRows = assessments.filter((a) => a.revision > 0);

    const planned: CurvePoint[] = [
        ...(baseline ? [baseline] : []),
        ...original.map((a) => ({ t: dayOf(a.date), value: a.target })),
    ];
    const lastPlanned = planned[planned.length - 1];
    const targetEnd = project.targetCompletionDate ? dayOf(project.targetCompletionDate) : null;
    if (targetEnd !== null && (!lastPlanned || targetEnd > lastPlanned.t)) {
        planned.push({ t: targetEnd, value: 100 });
    }

    const revisedEndRaw = project.revisedCompletionDate ? dayOf(project.revisedCompletionDate) : null;
    const hasRevision = revisedRows.length > 0 || (revisedEndRaw !== null && revisedEndRaw !== targetEnd);
    let revised: CurvePoint[] = [];
    if (hasRevision) {
        const anchor = [...planned].reverse().find((p) => p.value < 100) ?? baseline;
        revised = [
            ...(anchor ? [anchor] : []),
            ...revisedRows.map((a) => ({ t: dayOf(a.date), value: a.target })),
        ];
        const lastRevised = revised[revised.length - 1];
        if (revisedEndRaw !== null && (!lastRevised || revisedEndRaw > lastRevised.t)) {
            revised.push({ t: revisedEndRaw, value: 100 });
        }
        if (revised.length < 2) revised = [];
    }

    const actual: CurvePoint[] = [
        ...(baseline ? [baseline] : []),
        ...assessments.map((a) => ({ t: dayOf(a.date), value: a.actual })),
    ];

    return {
        planned,
        revised,
        actual,
        baseline,
        targetEnd: planned.some((p) => p.t === targetEnd && p.value === 100) ? targetEnd : null,
        revisedEnd: revised.some((p) => p.t === revisedEndRaw && p.value === 100) ? revisedEndRaw : null,
    };
};

// ── Geometry ───────────────────────────────────────────────────
// Left gutter fits "100%"; the bottom band the date labels; the top leaves
// room for a callout over a point near 100%.
const PAD = { top: 44, right: 28, bottom: 30, left: 44 };
// Date labels closer than this (centre to centre) are dropped so they never
// overprint; "Target (2027)" and "Feb 20, 2024" are both ~70px wide.
const MIN_LABEL_GAP = 84;
const Y_TICKS = [0, 25, 50, 75, 100];

// ── Callout ────────────────────────────────────────────────────
// The navy pill pinned above a point (baseline start, latest recorded).
// Clamped so it never runs past the plot edge.
const Callout = ({
    x,
    y,
    title,
    subtitle,
    width,
    plotLeft,
    plotRight,
}: {
    x: number;
    y: number;
    title: string;
    subtitle: string;
    width: number;
    plotLeft: number;
    plotRight: number;
}) => {
    const h = 32;
    const left = Math.min(Math.max(x - width / 2, plotLeft - 30), plotRight - width + 20);
    const top = y - h - 12;
    return (
        <g pointerEvents="none">
            <rect x={left} y={top} width={width} height={h} rx={3} fill={ACTUAL} />
            <path d={`M ${x - 5} ${top + h} L ${x} ${top + h + 6} L ${x + 5} ${top + h} Z`} fill={ACTUAL} />
            <text x={left + width / 2} y={top + 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff" fontFamily="inherit" style={{ fontVariantNumeric: "tabular-nums" }}>
                {title}
            </text>
            <text x={left + width / 2} y={top + 26} textAnchor="middle" fontSize="9" fill="#bfdbfe" fontFamily="inherit">
                {subtitle}
            </text>
        </g>
    );
};

// ── Chart ──────────────────────────────────────────────────────
export const SCurveChart = ({ project, height = 340 }: { project: SCurveProject; height?: number }) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [active, setActive] = useState<number | null>(null);
    const gradId = useId();

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const observer = new ResizeObserver(([entry]) => setWidth(entry?.contentRect.width ?? 0));
        observer.observe(el);
        setWidth(el.clientWidth);
        return () => observer.disconnect();
    }, []);

    const curves = useMemo(() => buildCurves(project), [project]);
    const assessments = project.slippageAssessments;

    const plotW = Math.max(0, width - PAD.left - PAD.right);
    const plotH = Math.max(0, height - PAD.top - PAD.bottom);
    const plotRight = PAD.left + plotW;
    const plotBottom = PAD.top + plotH;

    const allT = [...curves.planned, ...curves.revised, ...curves.actual].map((p) => p.t);
    const tMin = Math.min(...allT);
    const tMax = Math.max(...allT);
    const xOf = (t: number) => (tMax === tMin ? PAD.left + plotW / 2 : PAD.left + ((t - tMin) / (tMax - tMin)) * plotW);
    const yOf = (v: number) => PAD.top + (1 - Math.min(100, Math.max(0, v)) / 100) * plotH;
    const path = (pts: CurvePoint[]) => pts.map((p, i) => `${i ? "L" : "M"} ${xOf(p.t)} ${yOf(p.value)}`).join(" ");
    const area = (pts: CurvePoint[]) =>
        pts.length < 2
            ? ""
            : `${path(pts)} L ${xOf(pts[pts.length - 1]!.t)} ${plotBottom} L ${xOf(pts[0]!.t)} ${plotBottom} Z`;

    // Actual points that are filed assessments (the baseline is not one), with
    // their slippage — these are what hover and keyboard step through.
    const marks = assessments.map((a) => {
        const slippage = computeSlippage(a.target, a.actual);
        return { a, slippage, stage: getSlippageStage(slippage), x: xOf(dayOf(a.date)), y: yOf(a.actual) };
    });
    const latest = marks[marks.length - 1];

    // X labels: the baseline, every assessment and the completion dates, thinned
    // so none overprint. The completion ends are placed first so they always
    // survive — they're the "where is this heading" of the chart.
    const xLabels = (() => {
        type Label = { x: number; text: string; strong?: boolean };
        const ends: Label[] = [];
        if (curves.targetEnd !== null)
            ends.push({ x: xOf(curves.targetEnd), text: `Target (${new Date(curves.targetEnd).getFullYear()})`, strong: true });
        if (curves.revisedEnd !== null)
            ends.push({ x: xOf(curves.revisedEnd), text: `Revised (${new Date(curves.revisedEnd).getFullYear()})`, strong: true });
        const rest: Label[] = [
            ...(curves.baseline ? [{ x: xOf(curves.baseline.t), text: fullDate.format(curves.baseline.t) }] : []),
            ...marks.map((m) => ({ x: m.x, text: fullDate.format(new Date(m.a.date)) })),
        ];
        const kept: Label[] = [];
        for (const l of [...ends, ...rest]) {
            if (kept.every((k) => Math.abs(k.x - l.x) >= MIN_LABEL_GAP)) kept.push(l);
        }
        return kept;
    })();

    const current = active === null ? null : (marks[active] ?? null);
    const baselineX = curves.baseline ? xOf(curves.baseline.t) : null;
    // The baseline callout gives way when the latest one would sit on top of it.
    const showBaselineCallout =
        baselineX !== null && (!latest || Math.abs(latest.x - baselineX) > 170) && current === null;

    return (
        <div ref={wrapRef} className="relative w-full">
            {width > 0 && (
                <svg
                    width={width}
                    height={height}
                    role="img"
                    tabIndex={0}
                    aria-label={`Progress S-curve for ${project.title}: ${marks
                        .map((m) => `${fullDate.format(new Date(m.a.date))} target ${formatPct(m.a.target)}, actual ${formatPct(m.a.actual)}, slippage ${formatSlippage(m.slippage)}%`)
                        .join("; ")}.`}
                    className="touch-none outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                    onPointerMove={(e) => {
                        if (!marks.length) return;
                        const px = e.clientX - e.currentTarget.getBoundingClientRect().left;
                        let best = 0;
                        marks.forEach((m, i) => {
                            if (Math.abs(m.x - px) < Math.abs(marks[best]!.x - px)) best = i;
                        });
                        setActive(best);
                    }}
                    onPointerLeave={() => setActive(null)}
                    onBlur={() => setActive(null)}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                            e.preventDefault();
                            const delta = e.key === "ArrowRight" ? 1 : -1;
                            setActive((a) => Math.min(marks.length - 1, Math.max(0, a === null ? 0 : a + delta)));
                        } else if (e.key === "Escape") {
                            setActive(null);
                        }
                    }}
                >
                    <defs>
                        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={ACTUAL} stopOpacity={0.28} />
                            <stop offset="100%" stopColor={ACTUAL} stopOpacity={0.02} />
                        </linearGradient>
                    </defs>

                    {/* Gridlines + % ticks */}
                    {Y_TICKS.map((tick) => (
                        <g key={tick}>
                            <line
                                x1={PAD.left}
                                x2={plotRight}
                                y1={yOf(tick)}
                                y2={yOf(tick)}
                                stroke={tick === 0 ? "#cbd5e1" : "#e2e8f0"}
                                strokeDasharray={tick === 0 ? undefined : "4 4"}
                            />
                            <text x={PAD.left - 10} y={yOf(tick) + 4} textAnchor="end" fontSize="11" fill="#64748b" fontFamily="inherit">
                                {tick}%
                            </text>
                        </g>
                    ))}

                    {/* Faint wash under the planned curve: the whole road to 100% */}
                    <path d={area(curves.planned)} fill={ACTUAL} opacity={0.05} />
                    {/* Stronger fill under what has actually been done */}
                    <path d={area(curves.actual)} fill={`url(#${gradId})`} />

                    {/* Crosshair */}
                    {current && (
                        <line x1={current.x} x2={current.x} y1={PAD.top} y2={plotBottom} stroke="#cbd5e1" />
                    )}

                    {curves.planned.length > 1 && (
                        <path d={path(curves.planned)} fill="none" stroke={PLANNED} strokeWidth={2} strokeDasharray="6 5" strokeLinejoin="round" />
                    )}
                    {curves.revised.length > 1 && (
                        <path d={path(curves.revised)} fill="none" stroke={REVISED} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                    )}
                    {curves.actual.length > 1 && (
                        <path d={path(curves.actual)} fill="none" stroke={ACTUAL} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
                    )}

                    {/* Planned milestones: hollow, so they read as targets not records */}
                    {[...curves.planned, ...curves.revised].map((p, i) => (
                        <circle
                            key={`p${i}`}
                            cx={xOf(p.t)}
                            cy={yOf(p.value)}
                            r={p.value === 100 ? 4.5 : 4}
                            fill={p.value === 100 ? ACTUAL : "#ffffff"}
                            stroke={p.value === 100 ? "#ffffff" : i < curves.planned.length ? PLANNED : REVISED}
                            strokeWidth={1.5}
                        />
                    ))}

                    {/* Recorded actuals, filled in their slippage stage colour */}
                    {marks.map((m, i) => (
                        <circle
                            key={m.a.id}
                            cx={m.x}
                            cy={m.y}
                            r={i === active ? 7 : m === latest ? 6.5 : 4.5}
                            fill={STAGE_HEX[m.stage]}
                            stroke="#ffffff"
                            strokeWidth={2}
                        />
                    ))}
                    {latest && (
                        <circle cx={latest.x} cy={latest.y} r={9} fill="none" stroke={ACTUAL} strokeWidth={2.5} pointerEvents="none" />
                    )}

                    {/* Baseline start: the hollow ring at 0% */}
                    {baselineX !== null && (
                        <circle cx={baselineX} cy={plotBottom} r={7} fill="#ffffff" stroke={ACTUAL} strokeWidth={3} />
                    )}

                    {showBaselineCallout && curves.baseline && (
                        <Callout
                            x={baselineX}
                            y={plotBottom}
                            title={`${shortDate.format(curves.baseline.t)}: 0.00%`}
                            subtitle="Baseline Start"
                            width={112}
                            plotLeft={PAD.left}
                            plotRight={plotRight}
                        />
                    )}
                    {latest && current === null && (
                        <Callout
                            x={latest.x}
                            y={latest.y}
                            title={`${shortDate.format(new Date(latest.a.date))}: ${formatPct(latest.a.actual)}`}
                            subtitle={`${formatSlippage(latest.slippage)}% Slippage`}
                            width={128}
                            plotLeft={PAD.left}
                            plotRight={plotRight}
                        />
                    )}

                    {/* Date labels */}
                    {xLabels.map((l, i) => (
                        <text
                            key={i}
                            x={Math.min(Math.max(l.x, PAD.left), plotRight)}
                            y={plotBottom + 22}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight={l.strong ? 700 : 500}
                            fill={l.strong ? "#1e293b" : "#475569"}
                            fontFamily="inherit"
                        >
                            {l.text}
                        </text>
                    ))}
                </svg>
            )}

            {current && (
                <div
                    className="pointer-events-none absolute z-10 w-52 rounded-sm border border-slate-200 bg-white p-2.5 shadow-lg"
                    style={{
                        top: PAD.top,
                        left: current.x,
                        transform: current.x > PAD.left + plotW / 2 ? "translateX(calc(-100% - 14px))" : "translateX(14px)",
                    }}
                >
                    <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[10px] text-slate-500">{fullDate.format(new Date(current.a.date))}</span>
                        <span className={`text-[12px] font-extrabold ${SLIPPAGE_STAGE_CONFIG[current.stage].text}`}>
                            {formatSlippage(current.slippage)}%
                        </span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-[9px] font-bold tracking-wide text-slate-600">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: STAGE_HEX[current.stage] }} />
                        {SLIPPAGE_STAGE_CONFIG[current.stage].label.toUpperCase()}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                        {current.a.revision > 0 ? "Revised target" : "Planned"}{" "}
                        <span className="font-bold text-slate-700">{formatPct(current.a.target)}</span>
                        {" · "}Actual <span className="font-bold text-slate-700">{formatPct(current.a.actual)}</span>
                    </p>
                    <p className="text-[9px] text-slate-400">Revision {current.a.revision}</p>
                </div>
            )}
        </div>
    );
};

// ── Legend key ─────────────────────────────────────────────────
const LineLegend = ({ hasRevised }: { hasRevised: boolean }) => (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
        <span className="flex items-center gap-1.5 text-[11.5px] text-slate-600">
            <svg width="20" height="4" aria-hidden><line x1="0" x2="20" y1="2" y2="2" stroke={PLANNED} strokeWidth="2" strokeDasharray="5 3" /></svg>
            Planned (Target)
        </span>
        {hasRevised && (
            <span className="flex items-center gap-1.5 text-[11.5px] text-slate-600">
                <svg width="20" height="4" aria-hidden><line x1="0" x2="20" y1="2" y2="2" stroke={REVISED} strokeWidth="2" /></svg>
                Revised Target
            </span>
        )}
        <span className="flex items-center gap-1.5 text-[11.5px] font-bold text-slate-800">
            <svg width="20" height="4" aria-hidden><line x1="0" x2="20" y1="2" y2="2" stroke={ACTUAL} strokeWidth="3.5" /></svg>
            Actual Recorded
        </span>
    </div>
);

const TrendIcon = () => (
    <svg className="h-5 w-5 shrink-0 text-[#1e3a8a]" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
);

// ── Section ────────────────────────────────────────────────────
// Physical Progress & Slippage Overview: pick a project, read its planned vs.
// actual S-curve. Uses the same query (and so the same cache) as the Slippage
// History tab — only projects with at least one filed assessment are listed.
export const PhysicalProgressSection = ({ budgetYear }: { budgetYear: string }) => {
    const { data, isLoading } = api.project.getSlippageHistory.useQuery(budgetYear ? { budgetYear } : undefined);
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const projects = useMemo(() => {
        const q = search.trim().toLowerCase();
        const all = (data ?? []) as SCurveProject[];
        if (!q) return all;
        return all.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.projectCode.toLowerCase().includes(q) ||
                (p.cityMunicipality ?? "").toLowerCase().includes(q),
        );
    }, [data, search]);

    // Falls back to the first match, so the chart is never empty while there
    // are projects — including after the year or search changes the list.
    const project = projects.find((p) => p.id === selectedId) ?? projects[0] ?? null;
    const latest = project?.slippageAssessments[project.slippageAssessments.length - 1];
    const latestSlippage = latest ? computeSlippage(latest.target, latest.actual) : null;
    const stage = latestSlippage === null ? null : SLIPPAGE_STAGE_CONFIG[getSlippageStage(latestSlippage)];
    const hasRevised = project ? buildCurves(project).revised.length > 1 : false;

    return (
        <div>
            <div className="mb-3 flex items-center gap-2 border-b border-slate-300 pb-3">
                <TrendIcon />
                <p className="text-[16px] font-bold text-slate-800">Physical Progress &amp; Slippage Overview</p>
            </div>

            {/* Stage legend */}
            <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-sm border border-slate-200 bg-white px-4 py-3">
                {SLIPPAGE_STAGE_VALUES.map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: STAGE_HEX[s] }} />
                        <span className="text-[12px] font-semibold text-slate-700">
                            {SLIPPAGE_STAGE_CONFIG[s].range}: {SLIPPAGE_STAGE_CONFIG[s].label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Project picker */}
            <div className="mb-3 flex flex-col gap-2 sm:flex-row">
                <div className="relative w-full sm:w-64">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        aria-hidden
                    />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        aria-label="Search projects"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-sm border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#1e3a4f] focus:outline-none focus:ring-2 focus:ring-[#1e3a4f]/20"
                    />
                </div>
                <select
                    aria-label="Project"
                    value={project?.id ?? ""}
                    onChange={(e) => setSelectedId(e.target.value)}
                    disabled={!projects.length}
                    className="w-full min-w-0 flex-1 rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[#1e3a4f] focus:outline-none focus:ring-2 focus:ring-[#1e3a4f]/20"
                >
                    {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.projectCode} — {p.title}
                        </option>
                    ))}
                </select>
            </div>

            {isLoading ? (
                <ProgressChartSkeleton height={340} />
            ) : !project ? (
                <div className="bg-white rounded-sm border border-slate-200 p-10 text-center text-sm text-slate-400">
                    {search ? "No projects match your search." : "No slippage assessments filed yet."}
                </div>
            ) : (
                <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
                    <div className="p-5">
                        <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                            <div className="flex min-w-0 items-start gap-2">
                                <TrendIcon />
                                <div className="min-w-0">
                                    <p className="text-[16px] font-bold text-slate-900">Progress S-Curve &amp; Timeline Trendline</p>
                                    <p className="text-[12px] text-slate-600">
                                        Comparison of cumulative planned target baseline vs. recorded actual accomplishment
                                    </p>
                                </div>
                            </div>
                            <LineLegend hasRevised={hasRevised} />
                        </div>

                        {/* Which project, and where it stands now */}
                        <div className="mb-1 flex flex-wrap items-center justify-between gap-2 rounded-sm bg-slate-50 px-3 py-2">
                            <div className="min-w-0">
                                <p className="truncate text-xs font-bold text-slate-800" title={project.title}>{project.title}</p>
                                <p className="truncate text-[10.5px] text-slate-500">
                                    <span className="text-blue-500">{project.projectCode}</span>
                                    {project.cityMunicipality ? ` · ${project.cityMunicipality}` : ""}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <FyBadge year={budgetYear} />
                                {stage && latestSlippage !== null && (
                                    <>
                                        <span className={`text-sm font-extrabold ${stage.text}`} style={{ fontVariantNumeric: "tabular-nums" }}>
                                            {formatSlippage(latestSlippage)}%
                                        </span>
                                        <span className={`rounded-full px-2 py-px text-[9px] font-bold ${stage.badge}`}>{stage.label}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <SCurveChart key={project.id} project={project} />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-5 py-3 text-[11.5px]">
                        <p className="text-slate-600">
                            <span className="font-bold text-[#1e3a8a]">Pre-Construction Baseline &amp; Cumulative Progress:</span>{" "}
                            Milestones and slippage plot automatically as progress entries are recorded.
                        </p>
                        <p className="flex items-center gap-1.5 text-slate-600">
                            <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            Verified by Provincial Engineers Office MIS
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
