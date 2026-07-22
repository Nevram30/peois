// ── Year Filter (header button) ────────────────────────────────
// Styled to match the dashboard's dark "YEAR" header button, but acts as a
// fiscal-year selector that drives the year-aware cards.
export const YearFilter = ({
    value,
    onChange,
    years,
}: {
    value: string;
    onChange: (value: string) => void;
    years: string[];
}) => {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none cursor-pointer bg-[#1e3a8a] text-white text-[11px] font-bold rounded-md pl-5 pr-8 py-1.5 hover:bg-blue-900 transition-colors focus:outline-none"
            >
                <option value="">ALL YEARS</option>
                {years.map((y) => (
                    <option key={y} value={y}>
                        FY {y}
                    </option>
                ))}
            </select>
            <svg
                className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
        </div>
    );
}