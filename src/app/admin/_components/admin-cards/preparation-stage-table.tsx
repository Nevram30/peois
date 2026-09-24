"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { RouterOutputs } from "~/trpc/react";
import { PreparationStageBadge } from "~/app/_components/preparation-stage-badge";
import { DISTRICT_LABELS, STATUS_CONFIG } from "../admin-constant/constant";
import {
    PREPARATION_STAGE_LABEL,
    PREPARATION_STAGE_VALUES,
    type PreparationStageValue,
} from "~/lib/preparation-stage";

type ProjectRow = RouterOutputs["project"]["getAll"][number];

const PAGE_SIZE = 10;

// ── Projects per preparation stage ──────────────────────────────
// The projects behind the counts above: only those that have a stage, scoped
// to the dashboard's calendar year. Kept to a few columns, with the stage last.
export const PreparationStageTable = ({
    projects,
    isLoading,
    budgetYear,
}: {
    projects?: ProjectRow[];
    isLoading: boolean;
    budgetYear: string;
}) => {
    const [stage, setStage] = useState<PreparationStageValue | "">("");
    const [page, setPage] = useState(1);

    const staged = useMemo(
        () =>
            (projects ?? []).filter(
                (p) => p.preparationStage && (!budgetYear || p.budgetYear === budgetYear),
            ),
        [projects, budgetYear],
    );
    const rows = stage ? staged.filter((p) => p.preparationStage === stage) : staged;
    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const current = Math.min(page, totalPages);
    const visible = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

    const filters: { value: PreparationStageValue | ""; label: string; count: number }[] = [
        { value: "", label: "All", count: staged.length },
        ...PREPARATION_STAGE_VALUES.map((s) => ({
            value: s,
            label: PREPARATION_STAGE_LABEL[s],
            count: staged.filter((p) => p.preparationStage === s).length,
        })),
    ];

    return (
        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                <p className="text-[15px] font-extrabold uppercase tracking-widest text-[#1e3a8a]">
                    Projects by Preparation Stage
                </p>
                <div role="group" aria-label="Filter by preparation stage" className="flex flex-wrap gap-1">
                    {filters.map((f) => {
                        const active = stage === f.value;
                        return (
                            <button
                                key={f.value || "all"}
                                type="button"
                                aria-pressed={active}
                                onClick={() => {
                                    setStage(f.value);
                                    setPage(1);
                                }}
                                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${active
                                    ? "border-blue-900 bg-blue-900 text-white"
                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                {f.label} <span className={active ? "text-blue-100" : "text-slate-400"}>{f.count}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-400">
                            <th className="px-4 py-3">Project</th>
                            <th className="px-4 py-3">District</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Preparation Stage</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            Array.from({ length: 4 }, (_, i) => (
                                <tr key={i}>
                                    <td colSpan={4} className="px-4 py-3">
                                        <div className="h-4 animate-pulse rounded bg-slate-100" />
                                    </td>
                                </tr>
                            ))
                        ) : visible.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">
                                    No projects {stage ? `at ${PREPARATION_STAGE_LABEL[stage]}` : "with a preparation stage"}
                                    {budgetYear ? ` for CY ${budgetYear}` : ""}.
                                </td>
                            </tr>
                        ) : (
                            visible.map((p) => {
                                const status = STATUS_CONFIG[p.status];
                                return (
                                    <tr key={p.id} className="transition-colors hover:bg-gray-50/60">
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/admin/projects/${p.id}/view`}
                                                className="font-semibold text-gray-900 hover:text-blue-700 hover:underline"
                                            >
                                                {p.title}
                                            </Link>
                                            <p className="text-xs text-blue-500">{p.projectCode}</p>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {DISTRICT_LABELS[p.locationImplementation] ?? p.locationImplementation}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status?.badge ?? "bg-gray-100 text-gray-600"}`}
                                            >
                                                <span className={`h-1.5 w-1.5 rounded-full ${status?.dot ?? "bg-gray-400"}`} />
                                                {status?.label ?? p.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <PreparationStageBadge stage={p.preparationStage} />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {rows.length > PAGE_SIZE && (
                <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-500">
                    <span>
                        {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, rows.length)} of {rows.length}
                    </span>
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={() => setPage(current - 1)}
                            disabled={current === 1}
                            aria-label="Previous page"
                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-200 transition hover:bg-gray-50 disabled:opacity-40"
                        >
                            &lsaquo;
                        </button>
                        <button
                            type="button"
                            onClick={() => setPage(current + 1)}
                            disabled={current === totalPages}
                            aria-label="Next page"
                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-200 transition hover:bg-gray-50 disabled:opacity-40"
                        >
                            &rsaquo;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
