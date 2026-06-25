// Convert to PHP currency format
export const formatPeso = (value: number | undefined) => {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(value ?? 0);
};

// Adaptive: shows the actual peso amount below 1M, then scales to
// millions (₱920.0M) and billions (₱1.20B) as the value grows.
export const formatToPHPBillions = (value: number | undefined): string => {
    const v = value ?? 0;
    const abs = Math.abs(v);
    if (abs >= 1_000_000_000) return `₱${(v / 1_000_000_000).toFixed(2)}B`;
    if (abs >= 1_000_000) return `₱${(v / 1_000_000).toFixed(1)}M`;
    return formatPeso(v);
};

// Adaptive: shows the actual peso amount below 1M, then scales to
// millions (₱920.0M) and billions (₱1.20B) as the value grows.
export const formatToPHPMillions = (value: number | undefined): string => {
    const v = value ?? 0;
    const abs = Math.abs(v);
    if (abs >= 1_000_000_000) return `₱${(v / 1_000_000_000).toFixed(2)}B`;
    if (abs >= 1_000_000) return `₱ ${(v / 1_000_000).toFixed(1)}M`;
    return formatPeso(v);
};