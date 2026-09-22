"use client";

import Image from "next/image";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

import type { StatCard } from "~/app/super-admin/dashboardv2/super.admin.types";
import { DISTRICT_LABELS, MODE_LABELS, SOURCE_LABELS, STATUS_CONFIG } from "./admin-constant/constant";
import { AllocationRatioCard, AllocationTotalCard, AnnualAllocationCard, DistrictCard, SourceBreakdownCard, toCardData } from "./admin-cards/cards";
import { DistrictCardsSkeleton, FinancialCardSkeleton, StatCardsSkeleton } from "./admin-cards/skeleton.cards";
import { DistrictProgressSection } from "./admin-charts/district-progress-section";
import { LocationBreakdownSection } from "./admin-charts/location-breakdown-section";
import { SlippageHistorySection } from "./admin-charts/slippage-history-section";
import { YearFilter } from "~/helper/year.filter";

// ── Stat Tile ──────────────────────────────────────────────────
// Status name with its icon at the top right, the count below on the left.
// Shared by both stat-card layouts (office divisions and district admins).
// justify-between pins the count to the bottom, so counts stay level across a
// row even when one status name wraps to two lines and its neighbour doesn't.
const StatTile = ({ card }: { card: StatCard }) => (
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
        <p className="text-2xl font-extrabold text-slate-900 leading-none">{card.value}</p>
    </div>
);

// ── Dashboard tabs ─────────────────────────────────────────────
const DASHBOARD_TABS = [
    { id: "status", label: "PROJECT STATUS OVERVIEW" },
    { id: "financial", label: "FINANCIAL ALLOCATION OVERVIEW" },
    { id: "location", label: "PROGRESS & STATUS PER LOCATION OVERVIEW" },
    { id: "slippage", label: "PROJECTS SLIPPAGE HISTORY OVERVIEW" },
] as const;

type DashboardTab = (typeof DASHBOARD_TABS)[number]["id"];

// ── Main Dashboard ─────────────────────────────────────────────
export const AdminDashboardContent = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<DashboardTab>("status");

    // Fiscal year filter shared by the dashboard cards (driven by the header YEAR buttons).
    const [dashboardYear, setDashboardYear] = useState("");
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

    const TotalAllocation = projectAllocationData
        ? Object.values(projectAllocationData.bySource).reduce((s, v) => s + v, 0)
        : 0;

    const statusTiles: StatCard[] = [
        { label: "COMPLETED PROJECTS", value: statsData?.completed ?? "0", borderColor: "border-green-600", iconBg: "bg-green-100", iconColor: "text-green-600", icon: "✅" },
        { label: "ON-GOING PROJECTS", value: statsData?.ongoing ?? "0", borderColor: "border-blue-500", iconBg: "bg-blue-100", iconColor: "text-blue-500", icon: "▷" },
        { label: "FOR IMPLEMENTATION", value: statsData?.forImplementation ?? "0", borderColor: "border-amber-500", iconBg: "bg-amber-100", iconColor: "text-amber-500", icon: "⚠" },
        { label: "SUSPENDED PROJECTS", value: statsData?.suspended ?? "0", borderColor: "border-red-600", iconBg: "bg-red-100", iconColor: "text-red-600", icon: "⊗" },
        { label: "RE-ALIGNED PROJECTS", value: statsData?.reAlignment ?? "0", borderColor: "border-red-500", iconBg: "bg-red-100", iconColor: "text-red-500", icon: "↔" },
        { label: "OTHERS", value: statsData?.others ?? "0", borderColor: "border-slate-400", iconBg: "bg-slate-100", iconColor: "text-slate-500", icon: "⋯" },
    ];

    const budgetYearTile: StatCard = { label: "BUDGET YEAR", value: dashboardYear || "All", borderColor: "border-transparent", iconBg: "bg-blue-100", iconColor: "text-blue-600", icon: "📅" };

    // Office divisions keep the original single-row layout: small Budget Year
    // tile + six status tiles (incl. OTHERS).
    const statCards: StatCard[] = [budgetYearTile, ...statusTiles];

    // ── Recent Project Updates table state ──────────────────────
    const [search, setSearch] = useState("");
    const [fiscalYear, setFiscalYear] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const { data: projects, isLoading } = api.project.getAll.useQuery();
    const { data: budgetYears } = api.project.getBudgetYears.useQuery();

    const filteredProjects = projects?.filter((p) => {
        if (fiscalYear && p.budgetYear !== fiscalYear) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            p.title.toLowerCase().includes(q) ||
            p.projectCode.toLowerCase().includes(q) ||
            (p.barangay ?? "").toLowerCase().includes(q) ||
            (p.cityMunicipality ?? "").toLowerCase().includes(q)
        );
    });

    const totalFiltered = filteredProjects?.length ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
    const paginatedProjects = filteredProjects?.slice(
        (page - 1) * pageSize,
        page * pageSize,
    );

    // Rendered above and below the table so long pages can be paged without
    // scrolling to the bottom; only the divider side differs.
    const renderPagination = (position: "top" | "bottom") => (
        <div className={`flex flex-wrap items-center justify-between gap-3 ${position === "top" ? "border-b" : "border-t"} border-gray-100 px-4 py-4 sm:px-6`}>
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Rows per page:</span>
                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                    }}
                    className="rounded-sm border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a4f]/20"
                >
                    {[10, 20, 50, 100].map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-wrap items-center gap-1">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
                >
                    &lsaquo;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`flex h-8 w-8 items-center justify-center rounded-sm border text-sm font-medium transition ${p === page
                            ? "border-blue-500 bg-white text-blue-600 ring-1 ring-blue-500"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        {p}
                    </button>
                ))}
                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
                >
                    &rsaquo;
                </button>
            </div>
        </div>
    );

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
                    <YearFilter value={dashboardYear} onChange={setDashboardYear} years={budgetYears ?? []} />
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
                <p className="text-[10px] text-slate-500 mb-3">Project Status Information</p>

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
                            // six status tiles (incl. OTHERS) in a 3×2 grid beside it.
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <div className="col-span-2 sm:col-span-1 sm:row-span-2 bg-white rounded-sm shadow-sm flex flex-col items-center justify-center gap-1 p-3 text-center">
                                    <p className="text-sm font-bold text-slate-700 leading-tight">Budget Year</p>
                                    <p className="text-3xl font-extrabold text-slate-900 leading-none">{dashboardYear || "All"}</p>
                                </div>
                                {statusTiles.map((c) => (
                                    <StatTile key={c.label} card={c} />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                                {statCards.map((c) => (
                                    <StatTile key={c.label} card={c} />
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
            </div>

            <div
                role="tabpanel"
                id="dashboard-panel-financial"
                aria-labelledby="dashboard-tab-financial"
                hidden={activeTab !== "financial"}
            >
                <p className="text-[10px] text-slate-500 mb-3">Aggregated project funding sources and allocations</p>

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
                                label="Remaining Balance Percentage"
                                amount={remainingBalanceData?.remaining.total ?? 0}
                                total={TotalAllocation}
                            />
                            <AllocationRatioCard
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
                            <AllocationTotalCard label="Total Combined Allocation" amount={TotalAllocation} />
                            <AllocationTotalCard
                                label="Total Amount of Disbursement"
                                amount={remainingBalanceData?.disbursed.total ?? 0}
                            />
                            <AllocationTotalCard
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
                        budgetYear={projectAllocationData?.budgetYear ?? "2024"}
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
                                title="Remaining Balance from Annual Allocation"
                                footerLabel="Grand Total Balance"
                                bySource={remainingBalanceData?.remaining.bySource ?? {}}
                                bySubType={remainingBalanceData?.remaining.bySubType ?? {}}
                                variationProjectsBySource={remainingBalanceData?.remaining.variationProjectsBySource ?? {}}
                                total={remainingBalanceData?.remaining.total ?? 0}
                            />
                            <SourceBreakdownCard
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
                <p className="text-[10px] text-slate-500 mb-3">Progress percentage and project status per city / municipality</p>
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
                {/* One slippage timeline per project. */}
                <SlippageHistorySection budgetYear={dashboardYear} />
            </div>

            {/* Recent Project Updates — outside the tabs, shown under the
                status tab only; the other tabs carry their own detail */}
            <div
                hidden={activeTab !== "status"}
                className="mt-5 rounded-sm border border-gray-100 bg-white shadow-sm"
            >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
                    <h2 className="text-md font-semibold text-gray-900">
                        Recent Project Updates
                    </h2>

                    {/* Search + Fiscal Year Filter */}
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                        <div className="relative w-full sm:w-72">
                            <svg
                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search projects, documents, or data..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-[#1e3a4f] focus:outline-none focus:ring-2 focus:ring-[#1e3a4f]/20"
                            />
                        </div>
                        <div className="relative w-full sm:w-auto">
                            <svg
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                                />
                            </svg>
                            <select
                                value={fiscalYear}
                                onChange={(e) => {
                                    setFiscalYear(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full appearance-none rounded-sm border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-gray-700 shadow-sm focus:border-[#1e3a4f] focus:outline-none focus:ring-2 focus:ring-[#1e3a4f]/20"
                            >
                                <option value="">All Fiscal Years</option>
                                {budgetYears?.map((y) => (
                                    <option key={y} value={y}>
                                        FY {y}
                                    </option>
                                ))}
                            </select>
                            <svg
                                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Pagination Header */}
                {!isLoading && totalFiltered > 0 && renderPagination("top")}

                {/* Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-10 text-center text-sm text-gray-400">
                            Loading projects...
                        </div>
                    ) : !paginatedProjects?.length ? (
                        <div className="p-10 text-center text-sm text-gray-400">
                            {search
                                ? "No projects match your search."
                                : 'No projects yet. Click "Add Project" to create one.'}
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Project Name
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Location
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Implementation
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        District
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Source of Fund
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Progress
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Involved Users
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedProjects.map((p) => {
                                    const statusCfg = STATUS_CONFIG[p.status] ?? {
                                        label: p.status,
                                        dot: "bg-gray-400",
                                        text: "text-gray-600",
                                        badge: "bg-gray-100 text-gray-600",
                                    };
                                    const location = [p.barangay, p.cityMunicipality]
                                        .filter(Boolean)
                                        .join(", ");

                                    return (
                                        <tr
                                            key={p.id}
                                            className="hover:bg-gray-50/60 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">
                                                    {p.title}
                                                </p>
                                                <p className="text-xs text-blue-500">
                                                    {p.projectCode}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4 text-gray-600">
                                                {location || "—"}
                                            </td>
                                            <td className="px-4 py-4 text-gray-600">
                                                {MODE_LABELS[p.modeOfImplementation] ?? p.modeOfImplementation}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                                                    {DISTRICT_LABELS[p.locationImplementation] ?? p.locationImplementation}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-gray-600">
                                                {SOURCE_LABELS[p.sourceOfFund] ?? p.sourceOfFund}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCfg.badge}`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`}
                                                    />
                                                    {statusCfg.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                                                        <div
                                                            className={`h-full rounded-full ${p.status === "SUSPENDED" ? "bg-red-500" : (p.completionPercentage ?? 0) >= 100 ? "bg-green-500" : "bg-orange-500"}`}
                                                            style={{ width: `${p.completionPercentage ?? 0}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-600">
                                                        {p.completionPercentage ?? 0}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                {(() => {
                                                    const seen = new Set<string>();
                                                    const contributors: { id: string; name: string | null; email: string; image: string | null }[] = [];
                                                    const allUsers = [p.createdBy, ...p.activities.map((a) => a.createdBy)];
                                                    for (const u of allUsers) {
                                                        if (!seen.has(u.id)) {
                                                            seen.add(u.id);
                                                            contributors.push(u);
                                                        }
                                                    }
                                                    const MAX_SHOW = 4;
                                                    const visible = contributors.slice(0, MAX_SHOW);
                                                    const extra = contributors.length - MAX_SHOW;
                                                    return (
                                                        <div className="flex items-center">
                                                            {visible.map((u, i) => {
                                                                const initials = (u.name ?? u.email)
                                                                    .split(" ")
                                                                    .map((w) => w[0])
                                                                    .join("")
                                                                    .slice(0, 2)
                                                                    .toUpperCase();
                                                                const colors = [
                                                                    "bg-blue-500",
                                                                    "bg-emerald-500",
                                                                    "bg-violet-500",
                                                                    "bg-orange-500",
                                                                ];
                                                                return (
                                                                    <div
                                                                        key={u.id}
                                                                        style={{ zIndex: visible.length - i, marginLeft: i === 0 ? 0 : "-8px" }}
                                                                        className={`group relative flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-white text-white text-[10px] font-bold cursor-default ${colors[i % colors.length]}`}
                                                                    >
                                                                        {u.image ? (
                                                                            <Image
                                                                                src={u.image}
                                                                                alt={u.name ?? u.email}
                                                                                width={28}
                                                                                height={28}
                                                                                className="h-full w-full rounded-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            initials
                                                                        )}
                                                                        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[11px] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                                                                            {u.name ?? u.email}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                            {extra > 0 && (
                                                                <div
                                                                    style={{ zIndex: 0, marginLeft: "-8px" }}
                                                                    className="relative flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-white bg-gray-200 text-gray-600 text-[10px] font-bold"
                                                                >
                                                                    +{extra}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() =>
                                                        router.push(`/admin/projects/${p.id}/view`)
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-sm bg-green-500 px-3 py-1.5 text-white transition hover:bg-green-600"
                                                    title="View project"
                                                >
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                        />
                                                    </svg>
                                                    <span className="text-xs font-medium">View</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination Footer */}
                {!isLoading && totalFiltered > 0 && renderPagination("bottom")}
            </div>
        </div>
    );
}
