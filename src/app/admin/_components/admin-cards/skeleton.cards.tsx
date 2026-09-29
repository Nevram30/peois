// ── Skeletons ──────────────────────────────────────────────────

// Single stat tile placeholder — matches the real tile's
// "label left / icon top right, value below on the left" layout.
const StatTileSkeleton = () => (
    <div className="bg-white rounded-sm shadow-sm p-3 flex flex-col gap-2 animate-pulse">
        <div className="flex items-start justify-between gap-2">
            <div className="h-2.5 w-16 rounded bg-slate-200" />
            <div className="w-6 h-6 rounded-md bg-slate-200" />
        </div>
        <div className="h-6 w-8 rounded bg-slate-200" />
    </div>
);

// The stat card region has two shapes:
//  • Office divisions (SMAD/PDPM/EPM/QACD): eight tiles in a single row.
//  • Engineering-district admins (1ST/2ND ENGR DIST): a tall Budget Year
//    card + seven status tiles in a 4×2 grid beside it.
export const StatCardsSkeleton = ({ districtOnSide = false }: { districtOnSide?: boolean }) => {
    if (districtOnSide) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div className="col-span-2 sm:col-span-1 sm:row-span-2 bg-white rounded-sm shadow-sm flex flex-col items-center justify-center gap-2 p-3 animate-pulse">
                    <div className="h-3 w-20 rounded bg-slate-200" />
                    <div className="h-8 w-14 rounded bg-slate-200" />
                </div>
                {Array.from({ length: 7 }).map((_, i) => (
                    <StatTileSkeleton key={i} />
                ))}
            </div>
        );
    }
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
                <StatTileSkeleton key={i} />
            ))}
        </div>
    );
}

// District status cards: office divisions see both districts (count 2) in a
// grid; engineering-district admins see only their own district (count 1)
// stacked beside the stats.
export const DistrictCardsSkeleton = ({ count = 2, onSide = false }: { count?: number; onSide?: boolean }) => {
    return (
        <div className={onSide ? "flex flex-col gap-4" : "grid grid-cols-1 lg:grid-cols-2 gap-4 items-start"}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white rounded-sm overflow-hidden border border-slate-200">
                    <div className="p-4 animate-pulse">
                        <div className="h-3.5 w-52 rounded bg-slate-200 mb-3" />
                        <div className="flex items-center gap-4">
                            <div className="w-[100px] h-[100px] rounded-full bg-slate-200 shrink-0" />
                            <div className="grid grid-cols-2 gap-x-3 gap-y-2 flex-1">
                                {Array.from({ length: 6 }).map((_, j) => (
                                    <div key={j} className="h-2.5 rounded bg-slate-200" />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="h-9 bg-slate-200" />
                </div>
            ))}
        </div>
    );
}

// Progress line chart placeholder — title, legend row, plot area and the
// footer strip, so the card keeps its height while the query is in flight.
export const ProgressChartSkeleton = ({ height = 280 }: { height?: number }) => {
    return (
        <div className="bg-white rounded-sm overflow-hidden border border-slate-200">
            <div className="p-4 animate-pulse">
                <div className="h-3.5 w-64 rounded bg-slate-200 mb-2" />
                <div className="h-2 w-72 rounded bg-slate-100 mb-3" />
                <div className="flex gap-5 mb-3">
                    <div className="h-2.5 w-36 rounded bg-slate-200" />
                    <div className="h-2.5 w-36 rounded bg-slate-200" />
                </div>
                <div className="rounded-sm bg-slate-100" style={{ height }} />
            </div>
            <div className="h-9 bg-slate-200" />
        </div>
    );
}

export const FinancialCardSkeleton = () => {
    return (
        <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-slate-200">
            <div className="p-5 animate-pulse">
                <div className="h-3 w-56 rounded bg-slate-200 mb-4" />
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">
                    <div className="w-[150px] h-[150px] rounded-full bg-slate-200 shrink-0" />
                    <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-3 rounded bg-slate-200" />
                        ))}
                    </div>
                </div>
            </div>
            <div className="h-12 bg-slate-200" />
        </div>
    );
}
