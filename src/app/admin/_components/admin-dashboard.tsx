"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

import type { StatCard } from "~/app/super-admin/dashboardv2/super.admin.types";
import { AllocationRatioCard, AllocationTotalCard, AnnualAllocationCard, DistrictCard, SourceBreakdownCard, toCardData } from "./admin-cards/cards";
import { DistrictCardsSkeleton, FinancialCardSkeleton, StatCardsSkeleton } from "./admin-cards/skeleton.cards";
import { DistrictProgressSection } from "./admin-charts/district-progress-section";
import { LocationBreakdownSection } from "./admin-charts/location-breakdown-section";
import { SlippageHistorySection } from "./admin-charts/slippage-history-section";
import { SourceProgressSection } from "./admin-charts/source-progress-section";
import { ActualProgressSection } from "./admin-charts/actual-progress-section";
import { YearFilter } from "~/helper/year.filter";
import { PreparationStageSection } from "./admin-cards/preparation-stage-section";
import { PreparationStageTable } from "./admin-cards/preparation-stage-table";
import { StatusProgressModal } from "./admin-charts/status-progress-modal";
import { PhysicalProgressSection } from "./admin-charts/physical-progress-section";
import { OriginalIpSection } from "./admin-charts/original-ip-section";

// ── Stat Tile ──────────────────────────────────────────────────
// Status name with its icon at the top right, the count below on the left.
// Shared by both stat-card layouts (office divisions and district admins).
// justify-between pins the count to the bottom, so counts stay level across a
// row even when one status name wraps to two lines and its neighbour doesn't.
// Status tiles carry the ProjectStatus they count, so VIEW can open that
// status's progress chart. The Budget Year and Completed tiles get no button
// (completed projects all sit at 100%, a flat line with nothing to read).
type StatusTileCard = StatCard & { status: string };

const StatTile = ({ card, onView }: { card: StatCard; onView?: () => void }) => (
    <div className="bg-white rounded-sm shadow-sm p-3 flex flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-2">
            {/* min-w-0 lets the name wrap beside the icon instead of pushing it past
                the tile edge. break-words splits a word only when it can't fit on a
                line by itself — which happens to "IMPLEMENTATION" on the narrow
                1024–1279px district tiles — and hyphens-auto lets browsers with
                hyphenation dictionaries mark that split with a hyphen. (Soft hyphens
                were tried and dropped: browsers use them even where the whole word
                fits on the next line, e.g. "COMPLETED PRO-JECTS" at 1280px.) */}
            <p className="min-w-0 break-words hyphens-auto text-[11px] font-bold text-slate-500 leading-tight tracking-wide">{card.label}</p>
            <div className={`w-6 h-6 shrink-0 rounded-sm ${card.iconBg} ${card.iconColor} flex items-center justify-center text-xs`}>
                {card.icon}
            </div>
        </div>
        <div className="flex items-end justify-between gap-2">
            <p className="text-2xl font-extrabold text-slate-900 leading-none">{card.value}</p>
            {onView && (
                <button
                    type="button"
                    onClick={onView}
                    aria-label={`View ${card.label.toLowerCase()} progress chart`}
                    className="shrink-0 rounded-sm border border-slate-200 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#1e3a8a] transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                >
                    VIEW
                </button>
            )}
        </div>
    </div>
);

// ── Panel heading ──────────────────────────────────────────────
// Every tab's content is scoped to the header's calendar year, so each panel
// states that year above its subtitle: the figures below are never left to be
// read as "all projects", and the badge stays in view when the header filter
// has scrolled away. The year and subtitle stack on the right, level with the
// panel's optional section label on the left.
const PanelHeading = ({ subtitle, year, label }: { subtitle: string; year: string; label?: string }) => (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        {label ? (
            <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-[#1e3a8a]">{label}</h2>
        ) : (
            <span />
        )}
        <div className="flex flex-col items-end gap-1 text-right">
            <span className="rounded-sm bg-blue-50 px-2.5 py-1 text-sm font-extrabold uppercase tracking-widest text-[#1e3a8a]">
                {year ? `CY ${year}` : "NO CALENDAR YEAR"}
            </span>
            <p className="text-[11px] font-semibold text-slate-500">{subtitle}</p>
        </div>
    </div>
);

// ── Dashboard tabs ─────────────────────────────────────────────
const DASHBOARD_TABS = [
    { id: "status", label: "PROJECT STATUS OVERVIEW" },
    { id: "stage", label: "PREPARATION STAGE OVERVIEW" },
    { id: "financial", label: "FINANCIAL ALLOCATION OVERVIEW" },
    { id: "location", label: "PROGRESS & STATUS PER LOCATION OVERVIEW" },
    { id: "slippage", label: "PROJECTS SLIPPAGE HISTORY OVERVIEW" },
    { id: "physical", label: "PHYSICAL PROGRESS & SLIPPAGE OVERVIEW" },
] as const;

type DashboardTab = (typeof DASHBOARD_TABS)[number]["id"];

// ── Main Dashboard ─────────────────────────────────────────────
export const AdminDashboardContent = () => {
    const [activeTab, setActiveTab] = useState<DashboardTab>("status");
    // The status tile whose VIEW button opened the progress chart popup.
    const [viewTile, setViewTile] = useState<StatusTileCard | null>(null);

    // Calendar year filter shared by the dashboard cards (driven by the header
    // YEAR button). The years come back newest first, and the newest is the
    // default: the dashboard opens on the year being worked on, and follows the
    // data by itself once 2027 rows exist. null means "not chosen yet", which is
    // distinct from the empty string the ALL YEARS option sets — resolving it at
    // read time rather than in an effect means the cards never load the
    // all-years figures first and then swap.
    const { data: budgetYears } = api.project.getBudgetYears.useQuery();
    const [yearChoice, setYearChoice] = useState<string | null>(null);
    const dashboardYear = yearChoice ?? budgetYears?.[0] ?? "";
    const yearInput = dashboardYear ? { budgetYear: dashboardYear } : undefined;

    const { data: statsData, isLoading: statsLoading } = api.project.getStats.useQuery(yearInput);
    const { data: districtScope, isLoading: scopeLoading } = api.project.getMyDistrictScope.useQuery();

    // Engineering-district admins (1ST/2ND ENGR DIST) keep the district status
    // card beside the stat cards; office divisions (SMAD/PDPM/EPM/QACD) see
    // both district cards below the stat cards instead. Only meaningful once
    // the scope query has resolved (guarded by scopeLoading below).
    const districtOnSide = districtScope != null;
    const { data: projectAllocationData, isLoading: allocationLoading } = api.project.getFinancialOverview.useQuery(yearInput);
    const { data: districtData, isLoading: districtLoading } = api.project.getDistrictData.useQuery(yearInput);
    const { data: remainingBalanceData, isLoading: remainingLoading } = api.project.getRemainingBalance.useQuery(yearInput);
    const { data: stageData, isLoading: stageLoading } = api.project.getPreparationStageStats.useQuery(yearInput);

    const TotalAllocation = projectAllocationData
        ? Object.values(projectAllocationData.bySource).reduce((s, v) => s + v, 0)
        : 0;

    const statusTiles: StatusTileCard[] = [
        { status: "COMPLETED", label: "COMPLETED PROJECTS", value: statsData?.completed ?? "0", borderColor: "border-green-600", iconBg: "bg-green-100", iconColor: "text-green-600", icon: "✅" },
        { status: "ON_GOING", label: "ON-GOING PROJECTS", value: statsData?.ongoing ?? "0", borderColor: "border-blue-500", iconBg: "bg-blue-100", iconColor: "text-blue-500", icon: "▷" },
        { status: "IN_PROCUREMENT", label: "IN PROCUREMENT", value: statsData?.inProcurement ?? "0", borderColor: "border-teal-500", iconBg: "bg-teal-100", iconColor: "text-teal-600", icon: "⧖" },
        { status: "FOR_IMPLEMENTATION", label: "FOR IMPLEMENTATION", value: statsData?.forImplementation ?? "0", borderColor: "border-amber-500", iconBg: "bg-amber-100", iconColor: "text-amber-500", icon: "⚠" },
        { status: "SUSPENDED", label: "SUSPENDED PROJECTS", value: statsData?.suspended ?? "0", borderColor: "border-red-600", iconBg: "bg-red-100", iconColor: "text-red-600", icon: "⊗" },
        { status: "RE_ALIGNMENT", label: "RE-ALIGNED PROJECTS", value: statsData?.reAlignment ?? "0", borderColor: "border-red-500", iconBg: "bg-red-100", iconColor: "text-red-500", icon: "↔" },
        { status: "OTHERS", label: "OTHERS", value: statsData?.others ?? "0", borderColor: "border-slate-400", iconBg: "bg-slate-100", iconColor: "text-slate-500", icon: "⋯" },
    ];

    const budgetYearTile: StatCard = { label: "BUDGET YEAR", value: dashboardYear || "All", borderColor: "border-transparent", iconBg: "bg-blue-100", iconColor: "text-blue-600", icon: "📅" };

    // All projects, listed in the Preparation Stage tab's table.
    const { data: projects, isLoading } = api.project.getAll.useQuery();

    return (
        <div className="bg-slate-100 min-h-screen p-4 font-sans text-slate-800">
            {/* Section tabs. The YEAR filter sits in the tab bar because both sections
                share the one year setting — it used to be repeated in each header. */}
            {/* On phones the filter goes above the tabs (flex-col-reverse), so the
                active tab's underline still sits on the bar's bottom border. */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-end justify-between gap-x-4 gap-y-2 border-b border-slate-300 mb-3">
                <div
                    role="tablist"
                    aria-label="Dashboard sections"
                    className="flex min-w-0"
                    onKeyDown={(e) => {
                        // Arrow keys / Home / End move between tabs, per the WAI-ARIA tabs pattern.
                        const ids = DASHBOARD_TABS.map((t) => t.id);
                        const current = ids.indexOf(activeTab);
                        const next =
                            e.key === "ArrowRight" ? ids[(current + 1) % ids.length]
                                : e.key === "ArrowLeft" ? ids[(current - 1 + ids.length) % ids.length]
                                    : e.key === "Home" ? ids[0]
                                        : e.key === "End" ? ids[ids.length - 1]
                                            : undefined;
                        if (!next) return;
                        e.preventDefault();
                        setActiveTab(next);
                        document.getElementById(`dashboard-tab-${next}`)?.focus();
                    }}
                >
                    {DASHBOARD_TABS.map((t) => {
                        const selected = activeTab === t.id;
                        return (
                            <button
                                key={t.id}
                                id={`dashboard-tab-${t.id}`}
                                type="button"
                                role="tab"
                                aria-selected={selected}
                                aria-controls={`dashboard-panel-${t.id}`}
                                tabIndex={selected ? 0 : -1}
                                onClick={() => setActiveTab(t.id)}
                                className={`-mb-px border-b-[3px] px-3 py-2 text-left text-[9px] sm:text-[11px] font-extrabold leading-tight tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${selected
                                    ? "border-blue-900 text-blue-900"
                                    : "border-transparent text-slate-400 hover:text-slate-600"
                                    }`}
                            >
                                {t.label}
                            </button>
                        );
                    })}
                </div>
                <div className="self-end sm:mb-2">
                    <YearFilter value={dashboardYear} onChange={setYearChoice} years={budgetYears ?? []} />
                </div>
            </div>

            {/* Both panels stay mounted and are only hidden: switching back is
                instant (no skeleton flash) and the progress chart keeps its
                combined/separate choice. */}
            <div
                role="tabpanel"
                id="dashboard-panel-status"
                aria-labelledby="dashboard-tab-status"
                hidden={activeTab !== "status"}
            >
                {/* "Project Status" section label on the left, the year and
                    subtitle level with it on the right. */}
                <PanelHeading label="Project Status" subtitle="Project Status Information" year={dashboardYear} />

                {/* Stat cards + district project status (beside for ENGR DIST divisions, below otherwise).
                    While the scope query is in flight we can't yet know which layout
                    applies, so show a neutral full-width skeleton to avoid a layout jump. */}
                {scopeLoading ? (
                    <div className="grid grid-cols-1 gap-4 pb-5">
                        <StatCardsSkeleton />
                        <DistrictCardsSkeleton />
                    </div>
                ) : (
                    <div className={`grid grid-cols-1 ${districtOnSide ? "lg:grid-cols-2" : ""} gap-4 pb-5`}>
                        {statsLoading ? (
                            <StatCardsSkeleton districtOnSide={districtOnSide} />
                        ) : districtOnSide ? (
                            // District admins: big Budget Year card spanning both rows,
                            // seven status tiles (incl. OTHERS) in a 4×2 grid beside it.
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                <div className="col-span-2 sm:col-span-1 sm:row-span-2 bg-white rounded-sm shadow-sm flex flex-col items-center justify-center gap-1 p-3 text-center">
                                    <p className="text-sm font-bold text-slate-700 leading-tight">Budget Year</p>
                                    <p className="text-3xl font-extrabold text-slate-900 leading-none">{dashboardYear || "All"}</p>
                                </div>
                                {statusTiles.map((c) => (
                                    <StatTile key={c.label} card={c} onView={c.status === "COMPLETED" ? undefined : () => setViewTile(c)} />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                                {/* Office divisions keep the original single-row layout: small
                                    Budget Year tile + seven status tiles (incl. OTHERS). */}
                                <StatTile card={budgetYearTile} />
                                {statusTiles.map((c) => (
                                    <StatTile key={c.label} card={c} onView={c.status === "COMPLETED" ? undefined : () => setViewTile(c)} />
                                ))}
                            </div>
                        )}

                        {districtLoading ? (
                            <DistrictCardsSkeleton onSide={districtOnSide} count={districtOnSide ? 1 : 2} />
                        ) : (
                            <div className={districtOnSide ? "flex flex-col gap-4" : "grid grid-cols-1 lg:grid-cols-2 gap-4 items-start"}>
                                {districtData?.map((d) => (
                                    <DistrictCard
                                        key={d.district}
                                        budgetYear={dashboardYear}
                                        title={`${d.district.replace('_', ' ')} PROJECT STATUS`}
                                        data={toCardData(d.counts)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Project progress line chart(s). Office divisions
                    (SMAD/PDPM/EPM/QACD) get both districts with a combined/separate
                    toggle; engineering-district admins get their own district only.
                    Scoped by the same YEAR filter as the cards above. */}
                <DistrictProgressSection budgetYear={dashboardYear} />

                {/* 2ND ENGR DIST only: its original projects under the IP. */}
                {districtScope === "DISTRICT_II" && <OriginalIpSection />}

                {/* The same curve from the recorded Actual % (Physical Progress &
                    Slippage entries), filtered by the month they were recorded. */}
                <ActualProgressSection budgetYear={dashboardYear} />

                {/* The same progress line chart, cut by source of fund and
                    sub-type. Same YEAR filter and district scope. */}
                <SourceProgressSection budgetYear={dashboardYear} />
            </div>

            {/* Preparation stage (For Survey / For Plans / For POW) has its own
                tab: it is tracked apart from status. Same YEAR filter and
                district layout as the status tab. */}
            <div
                role="tabpanel"
                id="dashboard-panel-stage"
                aria-labelledby="dashboard-tab-stage"
                hidden={activeTab !== "stage"}
            >
                <PanelHeading subtitle="Surveying, preparation of plans, and POW preparation" year={dashboardYear} />
                {!scopeLoading && (
                    <PreparationStageSection
                        data={stageData}
                        isLoading={stageLoading}
                        budgetYear={dashboardYear}
                        districtOnSide={districtOnSide}
                    />
                )}
                <PreparationStageTable projects={projects} isLoading={isLoading} budgetYear={dashboardYear} />
            </div>

            <div
                role="tabpanel"
                id="dashboard-panel-financial"
                aria-labelledby="dashboard-tab-financial"
                hidden={activeTab !== "financial"}
            >
                <PanelHeading subtitle="Aggregated project funding sources and allocations" year={dashboardYear} />

                {/* Utilisation of the annual allocation: what is left and what
                    has gone out, each as a share of the same total. Above the
                    allocation card, as the headline reading of this tab. */}
                <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {remainingLoading || allocationLoading ? (
                        <>
                            <FinancialCardSkeleton />
                            <FinancialCardSkeleton />
                        </>
                    ) : (
                        <>
                            <AllocationRatioCard
                                budgetYear={dashboardYear}
                                label="Remaining Balance Percentage"
                                amount={remainingBalanceData?.remaining.total ?? 0}
                                total={TotalAllocation}
                            />
                            <AllocationRatioCard
                                budgetYear={dashboardYear}
                                label="Disbursement Percentage"
                                amount={remainingBalanceData?.disbursed.total ?? 0}
                                total={TotalAllocation}
                            />
                        </>
                    )}
                </div>

                {/* The same three figures as amounts: the allocation the two
                    percentages are measured against, and each of its parts. */}
                <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {remainingLoading || allocationLoading ? (
                        <>
                            <FinancialCardSkeleton />
                            <FinancialCardSkeleton />
                            <FinancialCardSkeleton />
                        </>
                    ) : (
                        <>
                            <AllocationTotalCard label="Total Combined Allocation" amount={TotalAllocation} budgetYear={dashboardYear} />
                            <AllocationTotalCard
                                budgetYear={dashboardYear}
                                label="Total Amount of Disbursement"
                                amount={remainingBalanceData?.disbursed.total ?? 0}
                            />
                            <AllocationTotalCard
                                budgetYear={dashboardYear}
                                label="Total Amount of Remaining Balance"
                                amount={remainingBalanceData?.remaining.total ?? 0}
                            />
                        </>
                    )}
                </div>

                {/* Annual Allocation & Source Breakdown */}
                {allocationLoading ? (
                    <div className="mb-3">
                        <FinancialCardSkeleton />
                    </div>
                ) : (
                    <AnnualAllocationCard
                        bySource={projectAllocationData?.bySource ?? {}}
                        bySubType={projectAllocationData?.bySubType ?? {}}
                        variationBySource={projectAllocationData?.variationBySource ?? {}}
                        variationProjectsBySource={projectAllocationData?.variationProjectsBySource ?? {}}
                        total={TotalAllocation}
                        budgetYear={dashboardYear}
                    />
                )}

                {/* Remaining Balance & Disbursement Summary */}
                <div className="grid grid-cols-1 gap-3">
                    {remainingLoading ? (
                        <>
                            <FinancialCardSkeleton />
                            <FinancialCardSkeleton />
                        </>
                    ) : (
                        <>
                            <SourceBreakdownCard
                                budgetYear={dashboardYear}
                                title="Remaining Balance from Annual Allocation"
                                footerLabel="Grand Total Balance"
                                bySource={remainingBalanceData?.remaining.bySource ?? {}}
                                bySubType={remainingBalanceData?.remaining.bySubType ?? {}}
                                variationProjectsBySource={remainingBalanceData?.remaining.variationProjectsBySource ?? {}}
                                total={remainingBalanceData?.remaining.total ?? 0}
                            />
                            <SourceBreakdownCard
                                budgetYear={dashboardYear}
                                title="Disbursement Summary"
                                footerLabel="Total Disbursement"
                                bySource={remainingBalanceData?.disbursed.bySource ?? {}}
                                bySubType={remainingBalanceData?.disbursed.bySubType ?? {}}
                                variationProjectsBySource={remainingBalanceData?.disbursed.variationProjectsBySource ?? {}}
                                total={remainingBalanceData?.disbursed.total ?? 0}
                            />
                        </>
                    )}
                </div>
            </div>

            <div
                role="tabpanel"
                id="dashboard-panel-location"
                aria-labelledby="dashboard-tab-location"
                hidden={activeTab !== "location"}
            >
                <PanelHeading subtitle="Progress percentage and project status per city / municipality" year={dashboardYear} />
                {/* Office divisions (SMAD/PDPM/EPM/QACD) get a card per district;
                    engineering-district admins get their own district only. */}
                <LocationBreakdownSection budgetYear={dashboardYear} />
            </div>

            <div
                role="tabpanel"
                id="dashboard-panel-slippage"
                aria-labelledby="dashboard-tab-slippage"
                hidden={activeTab !== "slippage"}
            >
                <PanelHeading
                    subtitle="Filed slippage assessments per project"
                    year={dashboardYear}
                />
                {/* One slippage timeline per project. */}
                <SlippageHistorySection budgetYear={dashboardYear} />
            </div>

            <div
                role="tabpanel"
                id="dashboard-panel-physical"
                aria-labelledby="dashboard-tab-physical"
                hidden={activeTab !== "physical"}
            >
                <PanelHeading
                    subtitle="Planned vs. actual physical accomplishment per project"
                    year={dashboardYear}
                />
                {/* One project's S-curve at a time, picked from the list. */}
                <PhysicalProgressSection budgetYear={dashboardYear} />
            </div>

            {viewTile && (
                <StatusProgressModal
                    status={viewTile.status}
                    label={viewTile.label}
                    budgetYear={dashboardYear}
                    onClose={() => setViewTile(null)}
                />
            )}
        </div>
    );
}
