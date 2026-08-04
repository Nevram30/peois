// ─── Document checklist ───────────────────────────────────────────────────
// The documentary requirements the office expects on file. The upload modal
// asks for the requirement outright; the file name is only used to pre-select
// the category, which the uploader confirms or corrects before submitting.

export type ProjectFileType =
  | "IMAGE"
  | "BLUEPRINT"
  | "REPORT"
  | "CONTRACT"
  | "PERMIT"
  | "OTHER";

export type DocKey =
  | "CDR"
  | "NTP"
  | "SCURVE"
  | "ABC"
  | "PPMP"
  | "POW"
  | "PLAN"
  | "ARO"
  | "BILLBOARD"
  | "MANPOWER"
  | "EQUIPMENT"
  | "QCP";

export type DocType = DocKey | "OTHER";

export type DocChecklistItem = {
  key: DocKey;
  label: string;
  fileType: ProjectFileType;
  patterns: RegExp[];
  // "Plan" alone matches file names that belong to a more specific row
  // (Quality Control Plan, Procurement Management Plan), so it is tried last.
  matchLast?: boolean;
};

export const DOC_CHECKLIST: DocChecklistItem[] = [
  {
    key: "CDR",
    label: "Checklist of Documentary Requirements",
    fileType: "REPORT",
    patterns: [/checklist/, /documentary requirement/, /\bcdr\b/],
  },
  {
    key: "NTP",
    label: "Notice to Proceed - Request",
    fileType: "PERMIT",
    patterns: [/notice to proceed/, /\bntp\b/],
  },
  {
    key: "SCURVE",
    label: "Bar Chart / S-Curve",
    fileType: "REPORT",
    patterns: [/bar ?chart/, /\bs ?curve\b/, /gantt/],
  },
  {
    key: "ABC",
    label: "Approve Budget Contract (ABC)",
    fileType: "CONTRACT",
    patterns: [/approved? budget/, /\babc\b/],
  },
  {
    key: "PPMP",
    label: "Project Procurement Management Plan",
    fileType: "REPORT",
    patterns: [/procurement management/, /\bppmp\b/],
  },
  {
    key: "POW",
    label: "Program of Works",
    fileType: "REPORT",
    patterns: [/program of works?/, /\bpow\b/],
  },
  {
    key: "PLAN",
    label: "Plan",
    fileType: "BLUEPRINT",
    patterns: [/\bplans?\b/, /\bdrawings?\b/, /blueprint/, /layout/],
    matchLast: true,
  },
  {
    key: "ARO",
    label: "Allotment Release Order",
    fileType: "PERMIT",
    patterns: [/allotment release/, /\bs?aro\b/],
  },
  {
    key: "BILLBOARD",
    label: "Billboard Photo",
    fileType: "IMAGE",
    patterns: [/bill ?board/, /tarpaulin/, /signage/],
  },
  {
    key: "MANPOWER",
    label: "Manpower Schedule",
    fileType: "REPORT",
    patterns: [/man ?power/],
  },
  {
    key: "EQUIPMENT",
    label: "Equipment Schedule",
    fileType: "REPORT",
    patterns: [/equipment/],
  },
  {
    key: "QCP",
    label: "Quality Control Plan",
    fileType: "REPORT",
    patterns: [/quality control/, /\bqcp\b/],
  },
];

// Display order is the order above; matching defers the catch-all rows.
const DOC_MATCH_ORDER = [...DOC_CHECKLIST].sort(
  (a, b) => Number(a.matchLast ?? false) - Number(b.matchLast ?? false),
);

export const docItem = (docType: DocType) =>
  DOC_CHECKLIST.find((item) => item.key === docType);

export const docLabel = (docType: DocType) =>
  docItem(docType)?.label ?? "Other Supporting Document";

export const isImageName = (fileName: string) =>
  /\.(jpe?g|png|gif|webp|heic)$/i.test(fileName);

// Reads the requirement out of the file name — separators are normalised so
// "notice-to-proceed_v2.pdf" and "Notice To Proceed.pdf" land on the same row.
// Only a suggestion: the modal still requires the category to be confirmed.
export const inferDocType = (fileName: string): DocType => {
  const name = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_\-.]+/g, " ")
    .toLowerCase();
  return (
    DOC_MATCH_ORDER.find((item) => item.patterns.some((p) => p.test(name)))
      ?.key ?? "OTHER"
  );
};

export const docFileType = (
  docType: DocType,
  fileName: string,
): ProjectFileType =>
  docItem(docType)?.fileType ?? (isImageName(fileName) ? "IMAGE" : "OTHER");

// ─── Upload constraints ───────────────────────────────────────────────────
// Mirrors the `projectFileUploader` route in src/app/api/uploadthing/core.ts so
// an oversized file is rejected here with a readable message instead of
// failing mid-upload.
export const DOC_ACCEPT =
  "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png";

const MB = 1024 * 1024;
export const MAX_IMAGE_BYTES = 8 * MB;
export const MAX_DOCUMENT_BYTES = 16 * MB;

export const maxBytesFor = (file: File) =>
  file.type.startsWith("image/") || isImageName(file.name)
    ? MAX_IMAGE_BYTES
    : MAX_DOCUMENT_BYTES;

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < MB) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / MB).toFixed(1)} MB`;
};
