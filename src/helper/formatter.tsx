// Convert to PHP currency format
export const formatPeso = (value: number | undefined) => {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(value ?? 0);
};

// Convert to billions (divide by 1,000,000,000)
// Format to 2 decimal places
export const formatToPHPBillions = (value: number): string => {
    const inBillions = value / 1_000_000_000;
    const formattedNumber = inBillions.toFixed(2);

    return `₱${formattedNumber}B`;
};

// Convert to millions (divide by 1,000,000)
// Format to 1 decimal place e.g. "₱ 920.0M"
export const formatToPHPMillions = (value: number | undefined): string => {
    const inMillions = (value ?? 0) / 1_000_000;
    return `₱ ${inMillions.toFixed(1)}M`;
};