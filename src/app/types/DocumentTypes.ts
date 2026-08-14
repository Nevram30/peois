export type Action = "VIEW" | "DOWNLOAD";

export type DocumentProps = {
    projectId: string;
    fileId: string;
    fileName: string;
    fileUrl: string;
    /** Controls icon color / spacing to match the surrounding table. */
    size?: "sm" | "md";
    /**
     * "confirm" (default) shows a simple confirm modal; "form" shows a full
     * request-access form with auto-filled identity fields + a justification.
     */
    requestMode?: "confirm" | "form";
    /** Auto-fill values used in the "form" request mode. */
    projectTitle?: string;
    requesterName?: string;
    requesterEmployeeId?: string;
}

/** An admin the request can be addressed to, as listed in the dropdown. */
export type ProjectInChargeOption = {
    id: string;
    name: string | null;
    email: string;
    employeeId: string | null;
    designation: string | null;
    /** True when the admin is an Engineer In-Charge or the project's creator. */
    isInCharge: boolean;
}