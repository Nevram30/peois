// The project's current actual accomplishment: the Actual % of its latest
// Physical Progress & Slippage entry, with the date it was recorded. Shown
// beside (not instead of) the Physical Progress field on the project pages
// and in the All Projects table.

type Entry = { actual: number; date: Date | string };

const fullDate = new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" });

// A `yyyy-mm-dd` string is a local calendar day (see progress-slippage-panel).
const toDate = (d: Date | string) => {
    if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
        const [y, m, day] = d.split("-").map(Number);
        return new Date(y!, m! - 1, day);
    }
    return new Date(d);
};

/** Latest entry by date. On a tie the earlier item wins, so pass the list
 *  newest-filed first (the order getSlippageAssessments returns). */
export const latestEntry = <T extends Entry>(entries: readonly T[] | null | undefined): T | null =>
    (entries ?? []).reduce<T | null>(
        (latest, e) => (!latest || toDate(e.date).getTime() > toDate(latest.date).getTime() ? e : latest),
        null,
    );

export const formatAsOf = (d: Date | string) => fullDate.format(toDate(d));

/** Label + value block for the Project Identity & Status cards. */
export const LatestActualField = ({ entry }: { entry: Entry | null }) => (
    <div className="flex items-center justify-between gap-3 rounded-sm border border-slate-200 bg-slate-50 px-3 py-2">
        <div className="min-w-0">
            <p className="text-sm font-bold text-gray-600">Actual %</p>
            <p className="text-[11px] text-gray-400">Latest Physical Progress &amp; Slippage entry</p>
        </div>
        {entry ? (
            <div className="shrink-0 text-right">
                <p className="text-lg font-extrabold leading-tight text-[#1e3a8a] tabular-nums">{entry.actual.toFixed(2)}%</p>
                <p className="text-[11px] font-semibold text-gray-500">as of {formatAsOf(entry.date)}</p>
            </div>
        ) : (
            <p className="shrink-0 text-sm text-gray-400">Not recorded yet</p>
        )}
    </div>
);

/** Compact cell for the All Projects table. */
export const LatestActualCell = ({ entry }: { entry: Entry | null | undefined }) =>
    entry ? (
        <div className="whitespace-nowrap">
            <p className="font-bold text-[#1e3a8a] tabular-nums">{entry.actual.toFixed(2)}%</p>
            <p className="text-[11px] text-gray-500">{formatAsOf(entry.date)}</p>
        </div>
    ) : (
        <span className="text-gray-400">—</span>
    );
