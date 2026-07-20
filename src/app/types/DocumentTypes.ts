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