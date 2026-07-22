// ── Skeletons ──────────────────────────────────────────────────
export const StatCardsSkeleton = () => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 content-start">
            {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-3 flex flex-col gap-1 border-t-[3px] border-slate-200 animate-pulse">
                    <div className="w-6 h-6 rounded-md bg-slate-200 mb-1" />
                    <div className="h-2.5 w-16 rounded bg-slate-200" />
                    <div className="h-6 w-10 rounded bg-slate-200 mt-1" />
                </div>
            ))}
        </div>
    );
}

export const DistrictCardsSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-slate-200">
                    <div className="p-4 animate-pulse">
                        <div className="h-2.5 w-40 rounded bg-slate-200 mb-3" />
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

export const FinancialCardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
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
