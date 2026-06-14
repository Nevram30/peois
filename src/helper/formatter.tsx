export const formatPeso = (value: number | undefined) => {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(value ?? 0);
};