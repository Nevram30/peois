"use client";

import Link from "next/link";
import { DistrictCard } from "./cards";
import { DistrictCardsSkeleton } from "./skeleton.cards";
import {
    PREPARATION_STAGE_COLOR,
    PREPARATION_STAGE_DESCRIPTION,
    PREPARATION_STAGE_LABEL,
    PREPARATION_STATUS_VALUES,
    type PreparationStatusValue,
} from "~/lib/preparation-stage";

type StageCounts = Record<PreparationStatusValue, number>;

type Props = {
    data?: {
        totals: StageCounts;
        byDistrict: { district: string; counts: StageCounts }[];
    };
    isLoading: boolean;
    budgetYear: string;
    /** Engineering-district admins see one district card; office divisions see both side by side. */
    districtOnSide: boolean;
};

const DISTRICT_TITLE: Record<string, string> = {
    DISTRICT_I: "DISTRICT I PREPARATION STAGE",
    DISTRICT_II: "DISTRICT II PREPARATION STAGE",
};

// ── Stage tile ──────────────────────────────────────────────────
// Same shape as the status StatTile, plus the stage's meaning. Each tile opens
// the project list filtered to that status.
const StageTile = ({ stage, count }: { stage: PreparationStatusValue; count: number }) => (
    <Link
        href={`/admin/projects?status=${stage}`}
        className="group flex flex-col justify-between gap-2 rounded-sm bg-white p-3 shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
        <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 text-[11px] font-bold uppercase leading-tight tracking-wide text-slate-500">
                {PREPARATION_STAGE_LABEL[stage]}
            </p>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 transition group-hover:text-blue-600">
                View &rsaquo;
            </span>
        </div>
        <p className="text-2xl font-extrabold leading-none text-slate-900">{count}</p>
        <p className="text-[11px] leading-snug text-slate-500">{PREPARATION_STAGE_DESCRIPTION[stage]}</p>
    </Link>
);

// ── Pipeline bar ────────────────────────────────────────────────
// Each stage's share of the projects that have a stage, left to right in the
// order projects move through them.
const PipelineBar = ({ totals }: { totals: StageCounts }) => {
    const total = PREPARATION_STATUS_VALUES.reduce((s, k) => s + totals[k], 0);
    return (
        <div className="rounded-sm bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-slate-500">
                <span>Preparation pipeline</span>
                <span className="text-slate-800">{total} projects</span>
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                {total > 0 &&
                    PREPARATION_STATUS_VALUES.map((stage) =>
                        totals[stage] > 0 ? (
                            <div
                                key={stage}
                                title={`${PREPARATION_STAGE_LABEL[stage]}: ${totals[stage]}`}
                                style={{
                                    width: `${(totals[stage] / total) * 100}%`,
                                    background: PREPARATION_STAGE_COLOR[stage],
                                }}
                            />
                        ) : null,
                    )}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {PREPARATION_STATUS_VALUES.map((stage) => (
                    <span key={stage} className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="h-2 w-2 rounded-full" style={{ background: PREPARATION_STAGE_COLOR[stage] }} />
                        {PREPARATION_STAGE_LABEL[stage]}
                        <span className="font-bold text-slate-800">
                            {total > 0 ? Math.round((totals[stage] / total) * 100) : 0}%
                        </span>
                    </span>
                ))}
            </div>
        </div>
    );
};

const TileSkeleton = () => (
    <div className="h-[104px] animate-pulse rounded-sm bg-white shadow-sm">
        <div className="m-3 h-3 w-20 rounded bg-slate-200" />
        <div className="mx-3 h-6 w-10 rounded bg-slate-200" />
    </div>
);

// ── Preparation Stage section ───────────────────────────────────
// Top of the dashboard's Preparation Stage Overview tab: counts of projects
// whose current status is For Survey / For Plans / For POW.
export const PreparationStageSection = ({ data, isLoading, budgetYear, districtOnSide }: Props) => (
    <section className="pb-5" aria-labelledby="preparation-stage-heading">
        <h2
            id="preparation-stage-heading"
            className="mb-2 text-[11px] font-extrabold uppercase tracking-widest text-[#1e3a8a]"
        >
            Preparation Stage
        </h2>

        {isLoading || !data ? (
            <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {PREPARATION_STATUS_VALUES.map((stage) => (
                        <TileSkeleton key={stage} />
                    ))}
                </div>
                <DistrictCardsSkeleton onSide={districtOnSide} count={districtOnSide ? 1 : 2} />
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {PREPARATION_STATUS_VALUES.map((stage) => (
                            <StageTile key={stage} stage={stage} count={data.totals[stage]} />
                        ))}
                    </div>
                    <PipelineBar totals={data.totals} />
                </div>

                <div className={districtOnSide ? "flex flex-col gap-4" : "grid grid-cols-1 items-start gap-4 lg:grid-cols-2"}>
                    {data.byDistrict.map((d) => (
                        <DistrictCard
                            key={d.district}
                            budgetYear={budgetYear}
                            title={DISTRICT_TITLE[d.district] ?? `${d.district.replace("_", " ")} PREPARATION STAGE`}
                            data={PREPARATION_STATUS_VALUES.map((stage) => ({
                                label: PREPARATION_STAGE_LABEL[stage].toUpperCase(),
                                value: d.counts[stage],
                                color: PREPARATION_STAGE_COLOR[stage],
                            }))}
                        />
                    ))}
                </div>
            </div>
        )}
    </section>
);
