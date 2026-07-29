export type ReportProject = {
    projectCode: string;
    title: string;
    subType: string | null;
    program: string | null;
    modeOfImplementation: string;
    locationImplementation: string;
    sourceOfFund: string;
    projectCost: number;
    contractCost: number;
    contractorName: string | null;
    projectEngineer: string | null;
    budgetYear: string | null;
    dateStarted: Date | string | null;
    targetCompletionDate: Date | string | null;
    dateCompleted: Date | string | null;
    duration: number;
    cityMunicipality: string | null;
    barangay: string | null;
    status: string;
    completionPercentage: number | null;
    disbursements?: { amount: number }[];
};

export type ReportFormat = "csv" | "xlsx" | "pdf";

export type ColumnDef = {
    key: string;
    label: string;
    // Shorter checkbox label in the modal; exports keep `label` as the header.
    displayLabel?: string;
    value: (p: ReportProject) => string;
};