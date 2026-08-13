import { DonutChartProps, Segment } from "~/app/super-admin/dashboardv2/super.admin.types";
import { type AnnualAllocationCardProps, type DistrictCardItem, type DistrictCardProps, type ProjectStatus, type SourceBreakdownCardProps, STATUS_COLORS, STATUS_LABELS, type StatusCounts } from "~/app/super-admin/dashboardv2/super.adminv2.types";
import { PROJECT_SUB_TYPE_LABEL, type ProjectSubTypeValue, SOURCE_OF_FUND_ORDER } from "~/lib/fund-constants";
import { REM_SOURCE_LABEL, SOURCE_COLORS, SOURCE_SHORT_LABEL } from "../admin-constant/constant";
import { formatPeso } from "~/helper/formatter";

// ── DonutChart ─────────────────────────────────────────────────
export const DonutChart = ({ segments, size = 120, thickness = 28, centerLabel }: DonutChartProps) => {
    const r = (size - thickness) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * r;
    const total = segments.reduce((s, g) => s + g.value, 0);
    let cumulative = 0;
    const arcs = segments.map((seg) => {
        const fraction = seg.value / total;
        const dashLen = fraction * circumference;
        const offset = circumference * (1 - cumulative);
        cumulative += fraction;
        return { ...seg, dashLen, offset };
    });
    return (
        <svg width={size} height={size} className="flex-shrink-0">
            {arcs.map((arc, i) => (
                <circle
                    key={i}
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={arc.color}
                    strokeWidth={thickness}
                    strokeDasharray={`${arc.dashLen} ${circumference - arc.dashLen}`}
                    strokeDashoffset={arc.offset}
                    style={{ transform: `rotate(-90deg)`, transformOrigin: `${cx}px ${cy}px` }}
                />
            ))}
            {centerLabel && (
                <>
                    <text x={cx} y={cy - 6} textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="Inter,sans-serif">
                        TOTAL VALUE
                    </text>
                    <text
                        x={cx}
                        y={cy + 9}
                        textAnchor="middle"
                        // Shrink to fit: full peso amounts are long, so scale the
                        // label down to the donut hole width.
                        fontSize={Math.min(13, ((size - thickness * 2) * 1.6) / Math.max(centerLabel.length, 1))}
                        fontWeight="800"
                        fill="#1e293b"
                        fontFamily="Inter,sans-serif"
                    >
                        {centerLabel}
                    </text>
                </>
            )}
        </svg>
    );
}

// ── transform ───────────────────────────────────────────────────
export const toCardData = (counts: StatusCounts): DistrictCardItem[] => {
    return (Object.keys(STATUS_LABELS) as ProjectStatus[])
        .filter((status) => status !== "NOT_YET_STARTED")
        .map((status) => ({
            key: status,                        // ← add this
            label: STATUS_LABELS[status],
            value: counts[status] ?? 0,
            color: STATUS_COLORS[status],
        }));
}

// ── DistrictCard ─────────────────────────────────────────────────
export const DistrictCard = ({ title, data }: DistrictCardProps) => {
    const total = data.reduce((s, d) => s + d.value, 0);
    return (
        <div className="bg-white rounded-sm overflow-hidden border border-slate-200">
            <div className="p-4">
                <p className="text-[11px] font-extrabold text-[#1e3a8a] tracking-widest uppercase mb-3">
                    {title}
                </p>
                <div className="flex items-center gap-4">
                    {/* thickness = size/2 fills the ring to the center, rendering a solid pie */}
                    <DonutChart
                        segments={data.filter((d) => d.value > 0).map((d) => ({ value: d.value, color: d.color }))}
                        size={100}
                        thickness={50}
                    />
                    <div className="grid grid-cols-2 gap-x-3 gap-y-[3px] flex-1">
                        {data.map((d) => (
                            <div key={d.label} className="flex items-center justify-between gap-1">
                                <div className="flex items-center gap-1">
                                    <span
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ background: d.color }}
                                    />
                                    <span className="text-[10.5px] text-slate-500">{d.label}</span>
                                </div>
                                <span className="text-[10.5px] font-bold text-slate-800">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-white text-black border-t border-slate-300 px-4 py-[9px] flex justify-between items-center text-[11px] font-bold tracking-widest uppercase">
                <span>TOTAL PROJECTS</span>
                <span>{total}</span>
            </div>
        </div>
    );
}

// ── AnnualAllocationCard ─────────────────────────────────────────────────
export const AnnualAllocationCard = ({ bySource, bySubType, variationBySource, variationProjectsBySource, total }: AnnualAllocationCardProps) => {
    // Order known sources first, then append any unmapped sources that have allocations.
    const ordered = [...SOURCE_OF_FUND_ORDER, "CONFIDENTIAL", ...Object.keys(bySource)].filter(
        (src, i, arr) => arr.indexOf(src) === i && (bySource[src] ?? 0) > 0,
    );

    const entries = ordered.map((src) => {
        const amount = bySource[src] ?? 0;
        // Portion of this source's allocation that comes from variation orders,
        // broken down by the tracking number of the project each order belongs to.
        const variationFund = variationBySource[src] ?? 0;
        const variationProjects = Object.entries(variationProjectsBySource[src] ?? {})
            .map(([trackingNumber, voAmount]) => ({ trackingNumber, amount: voAmount }))
            .sort((a, b) => b.amount - a.amount);
        const subTypes = Object.entries(bySubType)
            .filter(([key, v]) => v.sourceOfFund === src && !key.startsWith("__NONE__"))
            .map(([key, v]) => ({
                label: PROJECT_SUB_TYPE_LABEL[key as ProjectSubTypeValue] ?? key,
                amount: v.amount,
            }))
            .sort((a, b) => b.amount - a.amount);
        return {
            src,
            label: SOURCE_SHORT_LABEL[src] ?? src,
            color: SOURCE_COLORS[src] ?? "#94a3b8",
            amount,
            variationFund,
            variationProjects,
            pct: total > 0 ? Math.round((amount / total) * 100) : 0,
            subTypes,
        };
    });

    const segments: Segment[] = entries.map((e) => ({ value: e.amount, color: e.color }));

    return (
        <div className="bg-white rounded-sm shadow-sm overflow-hidden mb-3 border border-slate-200">
            <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[12px] font-extrabold text-slate-800 tracking-widest uppercase">
                        Annual Allocation &amp; Source Breakdown
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">
                    <div className="shrink-0 pt-2">
                        <DonutChart segments={segments} size={150} thickness={34} centerLabel={formatPeso(total)} />
                    </div>

                    <div className="w-full flex-1 columns-1 sm:columns-2 gap-6 sm:gap-12 *:break-inside-avoid">
                        {entries.map((e) => (
                            <div key={e.src} className="mb-2.5">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                                        <span className="text-[11.5px] font-extrabold text-slate-800 tracking-wide truncate">
                                            {e.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-[10px] text-slate-400">{e.pct}%</span>
                                        <span className="text-[12px] font-bold text-slate-800 tabular-nums">
                                            {formatPeso(e.amount)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-1 ml-1 border-l border-slate-200 pl-3 flex flex-col gap-0.5">
                                    {/* Project sub-type breakdown */}
                                    {e.subTypes.map((s) => (
                                        <div key={s.label} className="flex items-center justify-between gap-2">
                                            <span className="text-[10.5px] text-slate-500 truncate">{s.label}</span>
                                            <span className="text-[10.5px] text-slate-500 tabular-nums shrink-0">
                                                {formatPeso(s.amount)}
                                            </span>
                                        </div>
                                    ))}

                                    {/* Variation Fund (variation orders for this source, per project tracking number) */}
                                    {e.variationFund > 0 && (
                                        <>
                                            <span className="text-[10.5px] font-semibold text-amber-600 truncate">Variation Fund</span>
                                            {e.variationProjects.map((vp) => (
                                                <div key={vp.trackingNumber} className="flex items-center justify-between gap-2 pl-2">
                                                    <span className="text-[10.5px] text-slate-500 truncate">{vp.trackingNumber}</span>
                                                    <span className="text-[10.5px] text-slate-500 tabular-nums shrink-0">
                                                        {formatPeso(vp.amount)}
                                                    </span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white text-black border-t border-slate-300 px-6 py-3.5 flex justify-between items-center text-[12px] font-bold tracking-widest uppercase">
                <span>Total Combined Allocation</span>
                <span className="tabular-nums">{formatPeso(total)}</span>
            </div>
        </div>
    );
}

// ── SourceBreakdownCard ─────────────────────────────────────────────────
export const SourceBreakdownCard = ({ title, footerLabel, bySource, bySubType, variationProjectsBySource, total }: SourceBreakdownCardProps) => {
    const ordered = [...SOURCE_OF_FUND_ORDER, "CONFIDENTIAL", ...Object.keys(bySource)].filter(
        (src, i, arr) => arr.indexOf(src) === i && (bySource[src] ?? undefined) !== undefined,
    );

    const entries = ordered.map((src) => {
        const amount = bySource[src] ?? 0;
        const subTypes = Object.entries(bySubType)
            .filter(([key, v]) => v.sourceOfFund === src && !key.startsWith("__NONE__"))
            .map(([key, v]) => ({
                label: PROJECT_SUB_TYPE_LABEL[key as ProjectSubTypeValue] ?? key,
                amount: v.amount,
            }))
            .sort((a, b) => b.amount - a.amount);
        // Variation-order portion for this source, per project tracking number.
        const variationProjects = Object.entries(variationProjectsBySource?.[src] ?? {})
            .map(([trackingNumber, voAmount]) => ({ trackingNumber, amount: voAmount }))
            .sort((a, b) => b.amount - a.amount);
        return {
            src,
            label: REM_SOURCE_LABEL[src] ?? src,
            color: SOURCE_COLORS[src] ?? "#94a3b8",
            amount,
            subTypes,
            variationProjects,
        };
    });

    const segments: Segment[] = entries
        .filter((e) => e.amount > 0)
        .map((e) => ({ value: e.amount, color: e.color }));

    return (
        <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-slate-200">
            <div className="p-4 sm:p-5">
                <p className="text-[12px] font-extrabold text-slate-800 tracking-widest uppercase mb-4">
                    {title}
                </p>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
                    <div className="shrink-0 pt-1">
                        <DonutChart segments={segments} size={120} thickness={60} />
                    </div>

                    <div className="w-full flex-1 columns-1 sm:columns-2 gap-6 *:break-inside-avoid">
                        {entries.map((e) => (
                            <div key={e.src} className="mb-2.5">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                                        <span className="text-[11.5px] font-extrabold text-slate-800 tracking-wide truncate">
                                            {e.label}
                                        </span>
                                    </div>
                                    <span className="text-[12px] font-bold text-slate-800 tabular-nums shrink-0">
                                        {formatPeso(e.amount)}
                                    </span>
                                </div>

                                {(e.subTypes.length > 0 || e.variationProjects.length > 0) && (
                                    <div className="mt-1 ml-1 border-l border-slate-200 pl-3 flex flex-col gap-0.5">
                                        {e.subTypes.map((s) => (
                                            <div key={s.label} className="flex items-center justify-between gap-2">
                                                <span className="text-[10.5px] text-slate-500 truncate">{s.label}</span>
                                                <span className="text-[10.5px] text-slate-500 tabular-nums shrink-0">
                                                    {formatPeso(s.amount)}
                                                </span>
                                            </div>
                                        ))}

                                        {/* Variation-order portion, per project tracking number */}
                                        {e.variationProjects.length > 0 && (
                                            <>
                                                <span className="text-[10.5px] font-semibold text-amber-600 truncate">Variation Order</span>
                                                {e.variationProjects.map((vp) => (
                                                    <div key={vp.trackingNumber} className="flex items-center justify-between gap-2 pl-2">
                                                        <span className="text-[10.5px] text-slate-500 truncate">{vp.trackingNumber}</span>
                                                        <span className="text-[10.5px] text-slate-500 tabular-nums shrink-0">
                                                            {formatPeso(vp.amount)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white text-black border-t border-slate-300 px-6 py-3.5 flex justify-between items-center text-[12px] font-bold tracking-widest uppercase">
                <span>{footerLabel}</span>
                <span className="tabular-nums">{formatPeso(total)}</span>
            </div>
        </div>
    );
}
