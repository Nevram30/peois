"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { api } from "~/trpc/react";
import { useUploadThing } from "~/lib/uploadthing";
import {
  SOURCE_OF_FUND_LABEL,
  SOURCE_OF_FUND_SELECTABLE,
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_ORDER,
  PROJECT_ACCOUNT_VALUES,
  PROJECT_ACCOUNT_LABEL,
  SUPPLEMENTAL_BUDGET_YEARS,
  SUPPLEMENTAL_BUDGET_NUMBERS,
  type SourceOfFundValue,
  type ProjectStatusValue,
  type ProjectAccountValue,
} from "~/lib/fund-constants";
import {
  landbankOptions,
  programOptions,
  projectOptions,
} from "~/lib/funding-options";
import {
  getMunicipalitiesByDistrict,
  getBarangaysByMunicipality,
} from "~/lib/davao-del-norte-locations";
import {
  SLIPPAGE_STAGE_VALUES,
  SLIPPAGE_STAGE_CONFIG,
  computeSlippage,
  formatSlippage,
  getSlippageStageConfig,
} from "~/lib/slippage";
import {
  DOC_CHECKLIST,
  docFileType,
  fileIconColor,
  type DocType,
  type ProjectFileType,
} from "~/lib/project-documents";
import {
  PROJECT_IMAGE_SLOTS,
  filledImages,
  type ProjectImageSlots,
} from "~/lib/project-images";
import { UploadDocumentModal } from "~/app/_components/upload-document-modal";
import { ProjectImageUploader } from "~/app/_components/project-image-uploader";
import { GeospatialFields } from "~/app/_components/geospatial-fields";
import { parseCoord, type LocationTypeValue } from "~/lib/geo";
import { handleAmountChange, parseAmount, formatAmountValue } from "~/lib/currency";

// ─── Shared styles ────────────────────────────────────────────────────────
const inputClass =
  "block w-full rounded-sm border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none";
const labelClass =
  "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-500";
// Larger sentence-case labels used by the Slippage card.
const fieldLabelClass = "mb-1.5 block text-sm font-bold text-gray-600";
const cardClass = "rounded-sm border border-gray-200 bg-white shadow-sm";
const errorRingClass =
  "border-red-400 focus:border-red-500 focus:ring-red-500/20";
// Identity & Status and Project Location use a softer, elevated look: filled
// inputs with an inset shadow, raised selects, and sentence-case labels.
const elevatedCardClass = "rounded-lg border border-gray-100 bg-white shadow-md";
const cardLabelClass = "mb-2 block text-sm font-medium text-gray-700";
const filledInputClass =
  "block w-full rounded-md border border-gray-100 bg-gray-100 px-4 py-3 text-sm text-gray-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-500";
const selectClass =
  "block w-full cursor-pointer appearance-none rounded-md border border-gray-100 bg-slate-50 px-4 py-3 pr-10 text-sm text-gray-900 shadow-md transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none";

function FieldError({
  show,
  message = "This field is required",
}: {
  show: boolean;
  message?: string;
}) {
  if (!show) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

// Native select with a single chevron marker, for the elevated cards.
function SelectField({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={`${selectClass} ${className}`}>
        {children}
      </select>
      <svg
        className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-slate-700"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  );
}

type PendingFile = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: ProjectFileType;
  docType: DocType;
  fileSize: number;
  uploadedAt: Date;
};

const fmtDate = (d: Date) => {
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

// ─── Timeline adjustments (queued locally, saved after project create) ────
type TimelineAdjType = "EXTENSION" | "SUSPENSION" | "RESUMPTION";

const TIMELINE_ADJ_TYPE_CONFIG: Record<TimelineAdjType, { label: string; badge: string }> = {
  EXTENSION: { label: "Extension", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  SUSPENSION: { label: "Suspension", badge: "bg-red-50 text-red-700 border-red-200" },
  RESUMPTION: { label: "Resumption", badge: "bg-green-50 text-green-700 border-green-200" },
};

type PendingAdjustment = {
  id: string;
  startDate: string;
  endDate: string;
  duration: number;
  type: TimelineAdjType;
  justification: string;
};

const fmtInputDate = (d: string) => {
  return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
};

// Today as a `yyyy-mm-dd` value for a date input, in local time — toISOString
// would hand back the UTC day and shift the date for evening entries.
const todayInputDate = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

// ─── Slippage history (filed locally, one row per saved assessment) ───────
type SlippageEntry = {
  id: string;
  /** Assessment date, `yyyy-mm-dd`. Back-dating an assessment is allowed. */
  date: string;
  target: number;
  actual: number;
  /** Revision this row was filed as; Rev. 0 is the first assessment. */
  revision: number;
  remarks: string;
};

// ─── Section wrappers ─────────────────────────────────────────────────────
const SectionHeader = ({
  icon, title, action, variant = "caps",
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
  /** `title`: larger sentence-case heading used by the elevated cards. */
  variant?: "caps" | "title";
}) => {
  if (variant === "title") {
    return (
      <div className="mx-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 py-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="text-blue-900 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-3.5">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-blue-500">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-700">{title}</span>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

// Column headers of a tracking table whose rows can only be recorded once the
// project exists; the body carries the "available after initialization" note.
const PendingTrackingTable = ({
  title, columns, icon, message,
}: {
  title: string;
  columns: string[];
  icon: React.ReactNode;
  message: string;
}) => {
  return (
    <div className="space-y-4">
      <span className="inline-flex rounded-md border border-gray-200 bg-slate-100 px-5 py-2.5 text-sm font-semibold text-blue-900">
        {title}
      </span>
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="w-full min-w-[720px] text-left">
          <thead className="border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-6 py-4 text-xs font-semibold tracking-widest text-gray-700 uppercase"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-6 py-10">
                <div className="flex flex-col items-center text-center">
                  <span className="text-gray-300">{icon}</span>
                  <p className="mt-3 text-sm font-semibold text-gray-500">{message}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Awaiting system activation of financial module
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Icons ────────────────────────────────────────────────────────────────
const InfoIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>
);
const PinIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);
const BanknotesIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
  </svg>
);
const WalletSmallIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
  </svg>
);
const ClipboardClockIcon = (
  <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h.008m-3.008 9h11.25a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125H9.75M8.25 8.25h6.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75v2.25l1.5 1.5m4.5-1.5a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />
  </svg>
);
const WalletIcon = (
  <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
  </svg>
);
const CalendarIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
);
const PeopleIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);
const PersonCheckIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);
const FolderIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
  </svg>
);
const TrendDownIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
  </svg>
);
const SaveIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6.75A2.25 2.25 0 0 1 5.25 4.5h9.129c.597 0 1.17.237 1.591.659l2.871 2.871c.422.422.659.994.659 1.591v9.129A2.25 2.25 0 0 1 17.25 21H5.25A2.25 2.25 0 0 1 3 18.75V6.75Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 4.5v4.125c0 .621.504 1.125 1.125 1.125h4.5c.621 0 1.125-.504 1.125-1.125V4.5M7.5 21v-5.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);
// Same idea for the slippage inputs: anything that is not a 0–100 percentage
// reads as "not entered yet" rather than NaN.
const parsePercent = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) return null;
  return parsed;
};

export const AddProjectForm = () => {
  const router = useRouter();
  const utils = api.useUtils();

  // ── Project Identity & Status ────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [projectCost, setProjectCost] = useState("");
  const [contractCost, setContractCost] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [modeOfImplementation, setModeOfImplementation] = useState("");
  const [contractorName, setContractorName] = useState("");
  const [status, setStatus] = useState<ProjectStatusValue>("FOR_IMPLEMENTATION");
  const [completionPercentage, setCompletionPercentage] = useState("0");

  // ── Project Location ─────────────────────────────────────────────────
  const [district, setDistrict] = useState("");
  const [cityMunicipality, setCityMunicipality] = useState("");
  const [barangay, setBarangay] = useState("");
  const [purok, setPurok] = useState("");
  const [sitio, setSitio] = useState("");

  // ── Geospatial Data ──────────────────────────────────────────────────
  // Coordinates live as strings so a partially typed value survives editing.
  // Everything else about the pin — search, device location, the draggable
  // map — belongs to <GeospatialFields>.
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  // Building = one point. Road = latitude/longitude as its start plus an end.
  const [locationType, setLocationType] = useState<LocationTypeValue>("BUILDING");
  const [endLatitude, setEndLatitude] = useState("");
  const [endLongitude, setEndLongitude] = useState("");

  // ── Funding Information ──────────────────────────────────────────────
  const [sourceOfFund, setSourceOfFund] = useState<SourceOfFundValue | "">("");
  const [program, setProgram] = useState("");
  const [subType, setSubType] = useState("");
  const [projectAccount, setProjectAccount] = useState<ProjectAccountValue | "">("");
  const [budgetYear, setBudgetYear] = useState(String(new Date().getFullYear()));
  const [landbankNumber, setLandbankNumber] = useState("");
  const [supplementalBudgetYear, setSupplementalBudgetYear] = useState("");
  const [supplementalBudgetNumber, setSupplementalBudgetNumber] = useState("");

  // ── Project Timeline ─────────────────────────────────────────────────
  const [dateStarted, setDateStarted] = useState("");
  const [targetCompletionDate, setTargetCompletionDate] = useState("");
  const [adjType, setAdjType] = useState<TimelineAdjType | "">("");
  const [adjJustification, setAdjJustification] = useState("");
  const [adjError, setAdjError] = useState<string | null>(null);
  const [pendingAdjustments, setPendingAdjustments] = useState<PendingAdjustment[]>([]);

  // ── Slippage ─────────────────────────────────────────────────────────
  // Percentages live as strings so a half-typed value survives editing.
  // `slippageRevision` is the revision the current figures will be filed as;
  // saving files them and the next edit rolls the counter forward.
  const [slippageTargetInput, setSlippageTargetInput] = useState("");
  const [slippageActualInput, setSlippageActualInput] = useState("");
  const [slippageRevision, setSlippageRevision] = useState(0);
  const [savedSlippage, setSavedSlippage] = useState<string | null>(null);
  // Each save also files a row in the history table below the card.
  const [slippageDate, setSlippageDate] = useState(todayInputDate);
  const [slippageRemarks, setSlippageRemarks] = useState("");
  const [slippageHistory, setSlippageHistory] = useState<SlippageEntry[]>([]);

  // ── Workforce Distribution ───────────────────────────────────────────
  const [numFemale, setNumFemale] = useState(0);
  const [numMale, setNumMale] = useState(0);

  // ── Responsibility & Scope ───────────────────────────────────────────
  const [engineers, setEngineers] = useState<string[]>([]);
  const [engineerInput, setEngineerInput] = useState("");
  const [description, setDescription] = useState("");

  // ── Project Images ───────────────────────────────────────────────────
  // Four photos per project. The uploader owns the per-slot upload state; the
  // form only keeps the resulting URLs and whether any slot is still in flight.
  const [imageSlots, setImageSlots] = useState<ProjectImageSlots>(
    Array.from({ length: PROJECT_IMAGE_SLOTS }, () => null),
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // ── Multi-file Project Documentation ─────────────────────────────────
  // Documents go in through the upload modal, which asks for the requirement
  // outright instead of inferring it from the file name after the fact.
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [docUploadError, setDocUploadError] = useState<string | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  // Files dropped on the documents table, handed to the modal so the category
  // can still be picked before they are uploaded.
  const [stagedDropFiles, setStagedDropFiles] = useState<File[]>([]);

  // ── Validation ───────────────────────────────────────────────────────
  const [showErrors, setShowErrors] = useState(false);

  const setImageSlot = (index: number, url: string | null) =>
    setImageSlots((prev) => prev.map((u, i) => (i === index ? url : u)));

  const { startUpload: startFileUpload } = useUploadThing("projectFileUploader");

  const { data: me } = api.user.getMe.useQuery();

  // ── Derived values ───────────────────────────────────────────────────
  // A requirement is satisfied the moment a file is filed against it.
  const satisfiedDocs = useMemo(
    () => new Set(pendingFiles.map((f) => f.docType)),
    [pendingFiles],
  );
  const satisfiedCount = DOC_CHECKLIST.filter((item) =>
    satisfiedDocs.has(item.key),
  ).length;

  const duration = useMemo(() => {
    if (!dateStarted || !targetCompletionDate) return 0;
    const start = new Date(dateStarted);
    const end = new Date(targetCompletionDate);
    return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  }, [dateStarted, targetCompletionDate]);

  const totalWorkforce = numFemale + numMale;

  // Physical accomplishment is a float (e.g. 45.75%), kept to two decimals.
  const progressValue =
    Math.round(
      Math.max(0, Math.min(100, parseFloat(completionPercentage) || 0)) * 100,
    ) / 100;

  // ── Slippage derived values ──────────────────────────────────────────
  const slippageTarget = useMemo(
    () => parsePercent(slippageTargetInput),
    [slippageTargetInput],
  );
  const slippageActual = useMemo(
    () => parsePercent(slippageActualInput),
    [slippageActualInput],
  );
  const slippage =
    slippageTarget !== null && slippageActual !== null
      ? computeSlippage(slippageTarget, slippageActual)
      : null;
  const slippageStage = slippage !== null ? getSlippageStageConfig(slippage) : null;
  // Identity of the figures currently on screen, compared against the last
  // saved pair to tell a filed revision from an edited one.
  const slippageKey =
    slippage !== null ? `${slippageTarget}|${slippageActual}` : null;
  const isSlippageDirty = slippageKey !== null && slippageKey !== savedSlippage;
  const canFileSlippage = isSlippageDirty && slippageDate !== "";

  // Newest assessment first, matching how the history reads on the detail page.
  // The sort is stable, so same-day entries keep the order they were filed in.
  const slippageHistoryRows = useMemo(
    () => [...slippageHistory].sort((a, b) => b.date.localeCompare(a.date)),
    [slippageHistory],
  );

  const handleSaveSlippage = () => {
    if (slippageTarget === null || slippageActual === null) return;
    if (!canFileSlippage) return;
    // The first save files Rev. 0; every later change files the next revision.
    const filedRevision =
      savedSlippage !== null ? slippageRevision + 1 : slippageRevision;
    if (savedSlippage !== null) setSlippageRevision(filedRevision);
    setSavedSlippage(slippageKey);
    setSlippageHistory((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        date: slippageDate,
        target: slippageTarget,
        actual: slippageActual,
        revision: filedRevision,
        remarks: slippageRemarks.trim(),
      },
      ...prev,
    ]);
    setSlippageRemarks("");
  };

  const removeSlippageEntry = (id: string) =>
    setSlippageHistory((prev) => prev.filter((e) => e.id !== id));

  const availableMunicipalities = useMemo(
    () => getMunicipalitiesByDistrict(district as "DISTRICT_I" | "DISTRICT_II" | ""),
    [district],
  );
  const availableBarangays = useMemo(
    () => getBarangaysByMunicipality(cityMunicipality),
    [cityMunicipality],
  );

  // ── Geospatial derived values ────────────────────────────────────────
  const parsedLat = useMemo(() => parseCoord(latitude, 90), [latitude]);
  const parsedLng = useMemo(() => parseCoord(longitude, 180), [longitude]);
  const parsedEndLat = useMemo(() => parseCoord(endLatitude, 90), [endLatitude]);
  const parsedEndLng = useMemo(() => parseCoord(endLongitude, 180), [endLongitude]);
  const isRoad = locationType === "ROAD";

  // Programs / Projects / LBP-TL numbers registered by a super admin.
  const { data: customOptions } = api.fundingOption.getAll.useQuery();
  // Cascade: Source of Fund → Program → Project. Both lists are the built-in
  // constants plus the entries a super admin added from the override page.
  const availablePrograms = useMemo(
    () => programOptions(sourceOfFund, customOptions),
    [sourceOfFund, customOptions],
  );
  const availableSubTypes = useMemo(
    () => projectOptions(program, customOptions),
    [program, customOptions],
  );
  const availableLandbankNumbers = useMemo(
    () => landbankOptions(customOptions),
    [customOptions],
  );

  // ── Handlers ─────────────────────────────────────────────────────────
  const handleCostChange = (
    setter: (v: string) => void,
    input: HTMLInputElement,
  ) => {
    handleAmountChange(input, setter);
  };

  // Settle the field on 2 decimals when the user leaves it; an untouched field
  // stays empty so the placeholder (and the required-field error) still show.
  const handleCostBlur = (value: string, setter: (v: string) => void) => {
    const num = parseAmount(value);
    if (!isNaN(num)) setter(formatAmountValue(num));
    else if (value !== "") setter("");
  };

  const addEngineer = () => {
    const name = engineerInput.trim();
    if (name && !engineers.includes(name)) setEngineers([...engineers, name]);
    setEngineerInput("");
  };
  const removeEngineer = (name: string) =>
    setEngineers(engineers.filter((e) => e !== name));
  const handleEngineerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEngineer();
    }
  };

  const openDocModal = (dropped: File[] = []) => {
    setStagedDropFiles(dropped);
    setDocUploadError(null);
    setIsDocModalOpen(true);
  };

  const closeDocModal = () => {
    setIsDocModalOpen(false);
    setStagedDropFiles([]);
  };

  // Submitted from the upload modal: every file in the batch is filed against
  // the category the uploader chose, which is what ticks the checklist row.
  const handleDocUpload = async (files: File[], docType: DocType) => {
    setDocUploadError(null);
    setIsUploadingDoc(true);
    try {
      for (const file of files) {
        const result = await startFileUpload([file]);
        const url = result?.[0]?.ufsUrl ?? result?.[0]?.url;
        if (!url) throw new Error(`"${file.name}" could not be uploaded.`);
        setPendingFiles((prev) => [
          ...prev,
          {
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            fileName: file.name,
            fileUrl: url,
            fileType: docFileType(docType, file.name),
            docType,
            fileSize: file.size,
            uploadedAt: new Date(),
          },
        ]);
      }
      closeDocModal();
    } catch (err) {
      // The modal stays open with the message so the batch can be retried.
      setDocUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const removeFile = (id: string) =>
    setPendingFiles((prev) => prev.filter((f) => f.id !== id));

  // Correcting the type re-points the file at another checklist row, so the
  // ticks follow the correction.
  const changeDocType = (id: string, docType: DocType) =>
    setPendingFiles((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, docType, fileType: docFileType(docType, f.fileName) }
          : f,
      ),
    );

  const handleRecordAdjustment = () => {
    if (!dateStarted || !targetCompletionDate) {
      setAdjError("Start and end dates are required.");
      return;
    }
    if (!adjType) {
      setAdjError("Adjustment type is required.");
      return;
    }
    setPendingAdjustments((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        startDate: dateStarted,
        endDate: targetCompletionDate,
        duration,
        type: adjType,
        justification: adjJustification.trim(),
      },
    ]);
    setAdjType("");
    setAdjJustification("");
    setAdjError(null);
  };

  const removeAdjustment = (id: string) =>
    setPendingAdjustments((prev) => prev.filter((a) => a.id !== id));

  const createProjectFile = api.projectFile.create.useMutation();
  const createTimelineAdjustment = api.project.createTimelineAdjustment.useMutation();
  const createSlippageAssessment = api.project.createSlippageAssessment.useMutation();

  const createProject = api.project.create.useMutation({
    onSuccess: async (project) => {
      // Persist each uploaded document as a ProjectFile record, and each
      // queued timeline adjustment and slippage assessment against the newly
      // created project.
      await Promise.all([
        ...pendingFiles.map((f) =>
          createProjectFile.mutateAsync({
            projectId: project.id,
            fileName: f.fileName,
            fileUrl: f.fileUrl,
            fileType: f.fileType,
            docType: f.docType,
            fileSize: f.fileSize,
          }),
        ),
        ...pendingAdjustments.map((a) =>
          createTimelineAdjustment.mutateAsync({
            projectId: project.id,
            startDate: new Date(a.startDate),
            endDate: new Date(a.endDate),
            duration: a.duration,
            type: a.type,
            justification: a.justification || undefined,
          }),
        ),
        ...slippageHistory.map((entry) =>
          createSlippageAssessment.mutateAsync({
            projectId: project.id,
            date: new Date(entry.date),
            target: entry.target,
            actual: entry.actual,
            revision: entry.revision,
            remarks: entry.remarks || undefined,
          }),
        ),
      ]);
      await utils.project.invalidate();
      router.push("/admin/projects");
    },
  });

  // Required fields for a full submission (not draft). Every card is
  // validated except Project Documentation. Each key maps to the error
  // message shown beneath the input.
  const fieldErrors = useMemo(
    () => ({
      title: !title.trim(),
      // All four photo slots must be filled for a full submission.
      image: imageSlots.some((url) => !url),
      projectCost: !(parseAmount(projectCost) > 0),
      // trackingNumber: !trackingNumber.trim(),
      modeOfImplementation: !modeOfImplementation,
      // contractorName:
      //   modeOfImplementation === "BY_CONTRACT" && !contractorName.trim(),
      district: !district,
      cityMunicipality: !cityMunicipality,
      barangay: !barangay,
      // purok: !purok.trim(),
      // sitio: !sitio.trim(),
      // The pin itself is optional, but a typed-in coordinate must be valid.
      latitude: latitude.trim() !== "" && parsedLat === null,
      longitude: longitude.trim() !== "" && parsedLng === null,
      endLatitude: isRoad && endLatitude.trim() !== "" && parsedEndLat === null,
      endLongitude: isRoad && endLongitude.trim() !== "" && parsedEndLng === null,
      sourceOfFund: !sourceOfFund,
      program: availablePrograms.length > 0 && !program,
      subType: availableSubTypes.length > 0 && !subType,
      projectAccount: !projectAccount,
      budgetYear: !budgetYear,
      // dateStarted: !dateStarted,
      // targetCompletionDate: !targetCompletionDate,
      dateOrder:
        !!dateStarted &&
        !!targetCompletionDate &&
        new Date(targetCompletionDate) < new Date(dateStarted),
      workforce: totalWorkforce < 1,
      // The slippage assessment is optional, but a typed-in percentage must
      // be a valid 0–100 figure.
      slippageTarget: slippageTargetInput.trim() !== "" && slippageTarget === null,
      slippageActual: slippageActualInput.trim() !== "" && slippageActual === null,
      engineers: engineers.length === 0,
      description: !description.trim(),
    }),
    [
      title,
      imageSlots,
      projectCost,
      // trackingNumber,
      modeOfImplementation,
      // contractorName,
      district,
      cityMunicipality,
      barangay,
      // purok,
      // sitio,
      latitude,
      parsedLat,
      longitude,
      parsedLng,
      isRoad,
      endLatitude,
      parsedEndLat,
      endLongitude,
      parsedEndLng,
      sourceOfFund,
      program,
      availablePrograms,
      subType,
      availableSubTypes,
      projectAccount,
      budgetYear,
      dateStarted,
      targetCompletionDate,
      totalWorkforce,
      slippageTargetInput,
      slippageTarget,
      slippageActualInput,
      slippageActual,
      engineers,
      description,
    ],
  );

  const hasErrors = Object.values(fieldErrors).some(Boolean);

  const handleSubmit = (isDraft: boolean) => {
    // Drafts only require a title; a full submission requires every starred
    // field. Block submission and surface inline errors when invalid.
    if (!isDraft && hasErrors) {
      setShowErrors(true);
      return;
    }

    // `imageUrl` mirrors slot 1 so the readers that predate the gallery — the
    // project list, updateProgress — still find a cover photo.
    const images = filledImages(imageSlots);

    createProject.mutate({
      title,
      subType: subType || null,
      program: program || null,
      projectAccount: projectAccount || null,
      landbankNumber: landbankNumber.trim() || null,
      supplementalBudgetYear: supplementalBudgetYear || null,
      supplementalBudgetNumber: supplementalBudgetNumber || null,
      modeOfImplementation: modeOfImplementation as
        | "BY_ADMINISTRATION"
        | "BY_CONTRACT"
        | "UNASSIGNED_FOR_DETERMINATION",
      locationImplementation: district as "DISTRICT_I" | "DISTRICT_II",
      sourceOfFund: sourceOfFund as SourceOfFundValue,
      projectCost: parseAmount(projectCost) || 0,
      contractCost: parseAmount(contractCost) || 0,
      completionPercentage: progressValue,
      contractorName:
        modeOfImplementation === "BY_CONTRACT" ? contractorName || undefined : undefined,
      projectEngineer: engineers.join(", ") || undefined,
      budgetYear: budgetYear || undefined,
      dateStarted: dateStarted ? new Date(dateStarted) : null,
      targetCompletionDate: targetCompletionDate ? new Date(targetCompletionDate) : null,
      revisedCompletionDate: null,
      dateCompleted: null,
      daysSuspended: 0,
      daysExtended: 0,
      numFemale,
      numMale,
      numManDays: 0,
      district: district ? (district as "DISTRICT_I" | "DISTRICT_II") : null,
      cityMunicipality: cityMunicipality || undefined,
      barangay: barangay || undefined,
      purok: purok || undefined,
      sitio: sitio || undefined,
      latitude: parsedLat,
      longitude: parsedLng,
      locationType,
      endLatitude: isRoad ? parsedEndLat : null,
      endLongitude: isRoad ? parsedEndLng : null,
      description: description || undefined,
      // Sent whether or not the card was saved, so a filled-in assessment is
      // never dropped; the revision counter only moves on an explicit save.
      slippageTarget,
      slippageActual,
      slippageRevision,
      status: isDraft ? "NOT_YET_STARTED" : status,
      imageUrl: images[0],
      imageUrls: images,
      projectCode: trackingNumber || undefined,
    });
  };

  // The submit button stays enabled even when required fields are empty so
  // that clicking it reveals the inline "This field is required" messages.
  // Validation itself is enforced in handleSubmit / fieldErrors.
  const isBusy =
    createProject.isPending || isUploadingImage || isUploadingDoc;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <nav className="flex items-center gap-1.5 text-sm text-gray-500">
          <Link href="/admin/dashboard" className="hover:text-gray-700">Dashboard</Link>
          <span>/</span>
          <Link href="/admin/projects" className="hover:text-gray-700">Projects</Link>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          <span className="font-medium text-gray-900">Add New</span>
        </nav>
      </div>

      <div className="space-y-6 px-6 py-5 lg:px-8 lg:py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Project</h1>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the details below to create a new engineering project record.
          </p>
        </div>

        {/* ── Row 1: Identity & Status (2/3) + Location (1/3) ─────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Project Identity & Status */}
          <section className={`${elevatedCardClass} lg:col-span-2`}>
            <SectionHeader icon={InfoIcon} title="Project Identity & Status" variant="title" />
            <div className="space-y-5 p-6">
              {/* Project photos — every slot is required */}
              <div>
                <ProjectImageUploader
                  variant="tiles"
                  slots={imageSlots}
                  onChange={setImageSlot}
                  onUploadingChange={setIsUploadingImage}
                  badge={
                    trackingNumber ? (
                      <span className="absolute top-3 left-3 rounded-md bg-gray-900/90 px-3 py-1.5 text-[10px] font-bold tracking-wider text-white">
                        #{trackingNumber}
                      </span>
                    ) : undefined
                  }
                />
                {showErrors && fieldErrors.image && (
                  <p className="mt-1.5 text-xs text-red-500">
                    All {PROJECT_IMAGE_SLOTS} project photos are required
                  </p>
                )}
              </div>

              {/* Physical Progress */}
              <div className="rounded-md border border-gray-200 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-gray-900">Physical Progress</span>
                  <span className="text-base font-bold text-blue-800">{progressValue}%</span>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    // Steps in 0.25 so dragging can land on a decimal instead of
                    // snapping a typed 45.75 back to a whole number.
                    step={0.25}
                    value={progressValue}
                    onChange={(e) => setCompletionPercentage(e.target.value)}
                    aria-label="Physical progress"
                    style={{
                      background: `linear-gradient(to right, var(--color-blue-600) ${progressValue}%, var(--color-blue-200) ${progressValue}%)`,
                    }}
                    className="h-2.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-700 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-700 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm"
                  />
                  {/* Typeable percentage — the raw string is kept so the box can
                      sit empty, or hold a half-written decimal like "45.", while
                      it is being retyped instead of snapping back to a number. */}
                  <div className="relative w-28 shrink-0 sm:w-36">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.01}
                      value={completionPercentage}
                      onChange={(e) => setCompletionPercentage(e.target.value)}
                      onBlur={() => setCompletionPercentage(String(progressValue))}
                      aria-label="Physical progress percentage"
                      className="block w-full rounded-md border border-gray-400 bg-white py-2.5 pr-9 pl-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    />
                    <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gray-700">%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className={cardLabelClass}>Project Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter project title"
                  className={`${filledInputClass} ${showErrors && fieldErrors.title ? errorRingClass : ""}`}
                />
                <FieldError show={showErrors && fieldErrors.title} />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <label className={cardLabelClass}>Project Cost <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-gray-600">₱</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={projectCost}
                      onChange={(e) => handleCostChange(setProjectCost, e.target)}
                      onBlur={() => handleCostBlur(projectCost, setProjectCost)}
                      className={`${filledInputClass} pl-9 ${showErrors && fieldErrors.projectCost ? errorRingClass : ""}`}
                    />
                  </div>
                  <FieldError
                    show={showErrors && fieldErrors.projectCost}
                    message="Project cost must be greater than 0"
                  />
                </div>
                <div>
                  <label className={cardLabelClass}>Contract Cost</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-gray-600">₱</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={contractCost}
                      onChange={(e) => handleCostChange(setContractCost, e.target)}
                      onBlur={() => handleCostBlur(contractCost, setContractCost)}
                      className={`${filledInputClass} pl-9`}
                    />
                  </div>
                </div>
                {/* Revised contract costs are recorded as variation orders once
                    the project exists, so this is a read-only placeholder here. */}
                <div>
                  <label className={cardLabelClass}>Revised Contract Cost</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-gray-400">₱</span>
                    <input
                      type="text"
                      placeholder="0.00"
                      disabled
                      title="Revised contract cost can be recorded after the project is created."
                      className={`${filledInputClass} pl-9`}
                    />
                  </div>
                </div>

                <div>
                  <label className={cardLabelClass}>Project I.D.</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="PEO-2025-XXXXX"
                    className={filledInputClass}
                  />
                  {/* <FieldError show={showErrors && fieldErrors.trackingNumber} /> */}
                </div>
                {/* As Per Plan mirrors the Target Completion Date entered in the
                    Project Timeline card; read-only so there is one source. */}
                <div>
                  <label className={cardLabelClass}>As Per Plan</label>
                  <div className={filledInputClass}>
                    <span
                      className={`block truncate ${targetCompletionDate ? "text-gray-900" : "text-gray-400"}`}
                    >
                      {targetCompletionDate
                        ? fmtInputDate(targetCompletionDate)
                        : "Set in Project Timeline"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className={cardLabelClass}>Current Status</label>
                  <SelectField
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatusValue)}
                  >
                    {PROJECT_STATUS_ORDER.filter((s) => s !== "NOT_YET_STARTED").map((s) => (
                      <option key={s} value={s}>{PROJECT_STATUS_LABEL[s]}</option>
                    ))}
                  </SelectField>
                </div>

                <div>
                  <label className={cardLabelClass}>Implementation Mode <span className="text-red-500">*</span></label>
                  <SelectField
                    required
                    value={modeOfImplementation}
                    onChange={(e) => {
                      setModeOfImplementation(e.target.value);
                      if (e.target.value !== "BY_CONTRACT") setContractorName("");
                    }}
                    className={showErrors && fieldErrors.modeOfImplementation ? errorRingClass : ""}
                  >
                    <option value="">Select Mode</option>
                    <option value="BY_ADMINISTRATION">By Administration</option>
                    <option value="BY_CONTRACT">By Contract</option>
                    <option value="UNASSIGNED_FOR_DETERMINATION">
                      Unassigned - For Determination
                    </option>
                  </SelectField>
                  <FieldError show={showErrors && fieldErrors.modeOfImplementation} />
                </div>
                {/* Contractor Name keeps its slot next to the mode and is only
                    enabled for By Contract projects. */}
                <div className="sm:col-span-2">
                  <label className={cardLabelClass}>Contractor Name</label>
                  <input
                    type="text"
                    value={contractorName}
                    onChange={(e) => setContractorName(e.target.value)}
                    disabled={modeOfImplementation !== "BY_CONTRACT"}
                    placeholder={
                      modeOfImplementation === "BY_CONTRACT"
                        ? "Enter contractor name"
                        : "For By Contract projects only"
                    }
                    className={filledInputClass}
                  />
                  {/* <FieldError show={showErrors && fieldErrors.contractorName} /> */}
                </div>
              </div>
            </div>
          </section>

          {/* Project Location */}
          <section className={elevatedCardClass}>
            <SectionHeader icon={PinIcon} title="Project Location" variant="title" />
            <div className="space-y-4 p-6">
              <div>
                <label className={cardLabelClass}>District <span className="text-red-500">*</span></label>
                <SelectField
                  required
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setCityMunicipality("");
                    setBarangay("");
                    setPurok("");
                    setSitio("");
                  }}
                  className={showErrors && fieldErrors.district ? errorRingClass : ""}
                >
                  <option value="">Select District</option>
                  <option value="DISTRICT_I">District 1</option>
                  <option value="DISTRICT_II">District 2</option>
                </SelectField>
                <FieldError show={showErrors && fieldErrors.district} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="min-w-0">
                  <label className={cardLabelClass}>City / Municipality <span className="text-red-500">*</span></label>
                  <SelectField
                    value={cityMunicipality}
                    onChange={(e) => {
                      setCityMunicipality(e.target.value);
                      setBarangay("");
                      setPurok("");
                      setSitio("");
                    }}
                    disabled={!district}
                    className={showErrors && fieldErrors.cityMunicipality ? errorRingClass : ""}
                  >
                    <option value="">Select City</option>
                    {availableMunicipalities.map((m) => (
                      <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                  </SelectField>
                  <FieldError show={showErrors && fieldErrors.cityMunicipality} />
                </div>
                <div className="min-w-0">
                  <label className={cardLabelClass}>Barangay <span className="text-red-500">*</span></label>
                  <SelectField
                    value={barangay}
                    onChange={(e) => {
                      setBarangay(e.target.value);
                      setPurok("");
                      setSitio("");
                    }}
                    disabled={!cityMunicipality}
                    className={showErrors && fieldErrors.barangay ? errorRingClass : ""}
                  >
                    <option value="">
                      {cityMunicipality ? "Select Barangay" : "Select City first"}
                    </option>
                    {availableBarangays.map((bg) => (
                      <option key={bg.name} value={bg.name}>{bg.name}</option>
                    ))}
                  </SelectField>
                  <FieldError show={showErrors && fieldErrors.barangay} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="min-w-0">
                  <label className={cardLabelClass}>Purok</label>
                  <input
                    type="text"
                    value={purok}
                    onChange={(e) => setPurok(e.target.value)}
                    placeholder="e.g. 4"
                    className={filledInputClass}
                  />
                  {/* <FieldError show={showErrors && fieldErrors.purok} /> */}
                </div>
                <div className="min-w-0">
                  <label className={cardLabelClass}>Sitio</label>
                  <input
                    type="text"
                    value={sitio}
                    onChange={(e) => setSitio(e.target.value)}
                    placeholder="N/A"
                    className={filledInputClass}
                  />
                  {/* <FieldError show={showErrors && fieldErrors.sitio} /> */}
                </div>
              </div>

              {/* ── Geospatial Data ──────────────────────────────────── */}
              <div className="border-t border-gray-200 pt-5">
                <GeospatialFields
                  variant="compact"
                  latitude={latitude}
                  longitude={longitude}
                  onLatitudeChange={setLatitude}
                  onLongitudeChange={setLongitude}
                  locationType={locationType}
                  onLocationTypeChange={(type) => {
                    setLocationType(type);
                    // A building has no end point; drop any the road had.
                    if (type !== "ROAD") {
                      setEndLatitude("");
                      setEndLongitude("");
                    }
                  }}
                  endLatitude={endLatitude}
                  endLongitude={endLongitude}
                  onEndLatitudeChange={setEndLatitude}
                  onEndLongitudeChange={setEndLongitude}
                  showEndLatitudeError={showErrors && fieldErrors.endLatitude}
                  showEndLongitudeError={showErrors && fieldErrors.endLongitude}
                  showLatitudeError={showErrors && fieldErrors.latitude}
                  showLongitudeError={showErrors && fieldErrors.longitude}
                  inputClassName={filledInputClass}
                  labelClassName={cardLabelClass}
                  errorClassName={errorRingClass}
                  mapClassName="h-60"
                />
              </div>
            </div>
          </section>
        </div>

        {/* ── Funding Information ───────────────────────────────────── */}
        {/* Fields are listed column by column (each column is a related pair),
            so wide screens fill a 4 × 2 grid down the columns while narrow
            screens keep the cascade order: Source → Program → Project. */}
        <section className={elevatedCardClass}>
          <SectionHeader icon={BanknotesIcon} title="Funding Information" variant="title" />
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 p-6 sm:grid-cols-2 xl:grid-flow-col xl:grid-cols-4 xl:grid-rows-2">
            <div className="min-w-0">
              <label className={cardLabelClass}>Budget Year <span className="text-red-500">*</span></label>
              <SelectField
                value={budgetYear}
                onChange={(e) => setBudgetYear(e.target.value)}
                className={showErrors && fieldErrors.budgetYear ? errorRingClass : ""}
              >
                <option value="">Select Year</option>
                {Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i)).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </SelectField>
              <FieldError show={showErrors && fieldErrors.budgetYear} />
            </div>
            <div className="min-w-0">
              <label className={cardLabelClass}>Source of Fund <span className="text-red-500">*</span></label>
              <SelectField
                required
                value={sourceOfFund}
                onChange={(e) => {
                  const next = e.target.value as SourceOfFundValue | "";
                  setSourceOfFund(next);
                  setProgram("");
                  setSubType("");
                }}
                className={showErrors && fieldErrors.sourceOfFund ? errorRingClass : ""}
              >
                <option value="">Select Source</option>
                {SOURCE_OF_FUND_SELECTABLE.map((k) => (
                  <option key={k} value={k}>{SOURCE_OF_FUND_LABEL[k]}</option>
                ))}
              </SelectField>
              <FieldError show={showErrors && fieldErrors.sourceOfFund} />
            </div>

            <div className="min-w-0">
              <label className={cardLabelClass}>Program <span className="text-red-500">*</span></label>
              <SelectField
                value={program}
                onChange={(e) => {
                  const next = e.target.value;
                  setProgram(next);
                  const allowed = projectOptions(next, customOptions);
                  if (!allowed.some((o) => o.value === subType)) setSubType("");
                }}
                disabled={!sourceOfFund || availablePrograms.length === 0}
                className={showErrors && fieldErrors.program ? errorRingClass : ""}
              >
                <option value="">
                  {!sourceOfFund
                    ? "Select Source first"
                    : availablePrograms.length === 0
                      ? "No programs available"
                      : "Select Program"}
                </option>
                {availablePrograms.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}{o.custom ? " (added)" : ""}
                  </option>
                ))}
              </SelectField>
              <FieldError show={showErrors && fieldErrors.program} />
            </div>
            <div className="min-w-0">
              <label className={cardLabelClass}>Project <span className="text-red-500">*</span></label>
              <SelectField
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
                disabled={!program || availableSubTypes.length === 0}
                className={showErrors && fieldErrors.subType ? errorRingClass : ""}
              >
                <option value="">
                  {!program
                    ? "Select Program first"
                    : availableSubTypes.length === 0
                      ? "No projects available"
                      : "Select Project"}
                </option>
                {availableSubTypes.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}{o.custom ? " (added)" : ""}
                  </option>
                ))}
              </SelectField>
              <FieldError show={showErrors && fieldErrors.subType} />
            </div>

            <div className="min-w-0">
              <label className={cardLabelClass}>Project Account <span className="text-red-500">*</span></label>
              <SelectField
                value={projectAccount}
                onChange={(e) => setProjectAccount(e.target.value as ProjectAccountValue | "")}
                className={showErrors && fieldErrors.projectAccount ? errorRingClass : ""}
              >
                <option value="">Select Classification</option>
                {PROJECT_ACCOUNT_VALUES.map((k) => (
                  <option key={k} value={k}>{PROJECT_ACCOUNT_LABEL[k]}</option>
                ))}
              </SelectField>
              <FieldError show={showErrors && fieldErrors.projectAccount} />
            </div>
            <div className="min-w-0">
              <label className={cardLabelClass}>* LANDBANK [LBP-TL#]</label>
              <SelectField
                value={landbankNumber}
                onChange={(e) => setLandbankNumber(e.target.value)}
                disabled={availableLandbankNumbers.length === 0}
              >
                <option value="">
                  {availableLandbankNumbers.length === 0
                    ? "No LBP-TL numbers yet"
                    : "Select Reference"}
                </option>
                {availableLandbankNumbers.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </SelectField>
            </div>

            <div className="min-w-0">
              <label className={cardLabelClass}>Supplemental Budget Year</label>
              <SelectField
                value={supplementalBudgetYear}
                onChange={(e) => setSupplementalBudgetYear(e.target.value)}
              >
                <option value="">Select Year</option>
                {SUPPLEMENTAL_BUDGET_YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </SelectField>
            </div>
            <div className="min-w-0">
              <label className={cardLabelClass}>Supplemental Budget Number</label>
              <SelectField
                value={supplementalBudgetNumber}
                onChange={(e) => setSupplementalBudgetNumber(e.target.value)}
              >
                <option value="">Select SB No.</option>
                {SUPPLEMENTAL_BUDGET_NUMBERS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </SelectField>
            </div>
          </div>
        </section>

        {/* ── Financial Summary ─────────────────────────────────────── */}
        <section className={elevatedCardClass}>
          <SectionHeader icon={WalletSmallIcon} title="Financial Summary" variant="title" />
          <div className="space-y-8 p-6">
            {/* Balance tiles — nothing has been disbursed before the project exists */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {["Total Remaining Balance", "Primary Fund Balance", "Variation Order Balance"].map(
                (label, i) => (
                  <div
                    key={label}
                    className="rounded-md border border-gray-200 bg-white px-6 py-5 shadow-md"
                  >
                    <p className="text-xs font-semibold tracking-widest text-gray-700 uppercase">
                      {label}
                    </p>
                    <p className={`mt-2 font-bold text-blue-950 ${i === 0 ? "text-3xl" : "text-2xl"}`}>
                      ₱ 0.00
                    </p>
                  </div>
                ),
              )}
            </div>

            {/* Tracking tables — rows can only be recorded after project init */}
            <PendingTrackingTable
              title="Recent Disbursements"
              columns={[
                "Date",
                "Disbursement Date",
                "Reference #",
                "Source of Fund",
                "Type",
                "Amount (₱)",
                "Remarks",
                "Actions",
              ]}
              icon={ClipboardClockIcon}
              message="Disbursement tracking will be available after project initialization."
            />
            <PendingTrackingTable
              title="Revised Contract Cost History"
              columns={[
                "Date",
                "Original Cost",
                "Source of Fund",
                "Program",
                "Project",
                "Variation Order",
                "Revised Total",
                "Actions",
              ]}
              icon={WalletIcon}
              message="Revised Contract tracking will be available after project initialization."
            />
          </div>
        </section>

        {/* ── Project Timeline ──────────────────────────────────────── */}
        <section className={cardClass}>
          <SectionHeader icon={CalendarIcon} title="Project Timeline" />
          <div className="p-5">
            <label className={labelClass}>Timeline Adjustment History</label>
            <div className="overflow-y-auto rounded-sm border border-gray-200" style={{ maxHeight: "392px" }}>
              <table className="w-full border-separate border-spacing-0 text-xs">
                <thead className="sticky top-0 z-10 bg-gray-50">
                  <tr className="[&>th]:border-b [&>th]:border-gray-100">
                    <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Start Date</th>
                    <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">End Date</th>
                    <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Duration</th>
                    <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Adjustment Type</th>
                    <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Justification Record</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendingAdjustments.length > 0 ? pendingAdjustments.map((a) => {
                    const cfg = TIMELINE_ADJ_TYPE_CONFIG[a.type];
                    return (
                      <tr key={a.id} className="hover:bg-gray-50/50">
                        <td className="px-3 py-2.5 text-gray-600">{fmtInputDate(a.startDate)}</td>
                        <td className="px-3 py-2.5 text-gray-600">{fmtInputDate(a.endDate)}</td>
                        <td className="px-3 py-2.5 font-semibold text-gray-800">{a.duration} Days</td>
                        <td className="px-3 py-2.5">
                          <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}>{cfg.label}</span>
                        </td>
                        <td className="px-3 py-2.5 italic text-gray-600">{a.justification || "—"}</td>
                        <td className="px-3 py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => removeAdjustment(a.id)}
                            className="text-gray-300 hover:text-red-500"
                            aria-label="Remove adjustment"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-400">No timeline adjustments recorded yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Record row — no Revised Target Completion here; that field only exists on the update page */}
            <div className="mt-3 flex flex-wrap items-end gap-2">
              <div className="w-40 shrink-0">
                <label className={labelClass}>Start Date</label>
                <input
                  type="date"
                  value={dateStarted}
                  onChange={(e) => { setDateStarted(e.target.value); setAdjError(null); }}
                  className={`${inputClass} ${adjError && !dateStarted ? errorRingClass : ""}`}
                />
                {/* <FieldError show={showErrors && fieldErrors.dateStarted} /> */}
              </div>
              <div className="w-40 shrink-0">
                <label className={labelClass}>End Date</label>
                <input
                  type="date"
                  value={targetCompletionDate}
                  onChange={(e) => { setTargetCompletionDate(e.target.value); setAdjError(null); }}
                  className={`${inputClass} ${(adjError && !targetCompletionDate) || (showErrors && fieldErrors.dateOrder) ? errorRingClass : ""}`}
                />
                {/* <FieldError show={showErrors && fieldErrors.targetCompletionDate} /> */}
                <FieldError
                  show={showErrors && fieldErrors.dateOrder}
                  message="End date must be on or after start date"
                />
              </div>
              <div className="w-24 shrink-0">
                <label className={labelClass}>Duration</label>
                <input
                  type="text"
                  readOnly
                  value={duration || ""}
                  placeholder="0"
                  className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-600`}
                />
              </div>
              <div className="w-40 shrink-0">
                <label className={labelClass}>Type</label>
                <select
                  value={adjType}
                  onChange={(e) => { setAdjType(e.target.value as TimelineAdjType | ""); setAdjError(null); }}
                  className={`${inputClass} ${adjError && !adjType ? errorRingClass : ""}`}
                >
                  <option value="">Type</option>
                  {(Object.keys(TIMELINE_ADJ_TYPE_CONFIG) as TimelineAdjType[]).map((t) => (
                    <option key={t} value={t}>{TIMELINE_ADJ_TYPE_CONFIG[t].label}</option>
                  ))}
                </select>
              </div>
              <div className="min-w-50 flex-1">
                <label className={labelClass}>Justification / Basis</label>
                <input
                  type="text"
                  placeholder="Justification / Basis..."
                  value={adjJustification}
                  onChange={(e) => setAdjJustification(e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={handleRecordAdjustment}
                className="rounded-sm bg-blue-900 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blue-800"
              >
                Record
              </button>
            </div>
            {adjError && <p className="mt-1 text-xs text-red-500">{adjError}</p>}
          </div>
        </section>

        {/* ── Slippage ──────────────────────────────────────────────── */}
        <section className={cardClass}>
          <SectionHeader icon={TrendDownIcon} title="Slippage" />
          <div className="p-5">
            <div className="flex flex-wrap items-end gap-4">
              {/* Live readout — actual minus target, with its stage */}
              <div
                className={`flex min-w-70 flex-1 items-center justify-between gap-4 rounded-sm border px-4 py-3 ${slippageStage ? slippageStage.tile : "border-gray-200 bg-gray-50"
                  }`}
              >
                <div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-widest ${slippageStage ? slippageStage.text : "text-gray-400"
                      }`}
                  >
                    Slippage
                  </p>
                  <p
                    className={`mt-0.5 text-3xl font-extrabold ${slippageStage ? slippageStage.text : "text-gray-300"
                      }`}
                  >
                    {slippage !== null ? formatSlippage(slippage) : "—"}
                    <span className="ml-0.5 text-base font-bold">%</span>
                  </p>
                </div>
                {slippageStage && (
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${slippageStage.badge}`}
                  >
                    {slippageStage.label}
                  </span>
                )}
              </div>

              <div className="w-45 shrink-0">
                <label className={fieldLabelClass}>Assessment Date</label>
                <input
                  type="date"
                  value={slippageDate}
                  onChange={(e) => setSlippageDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="w-45 shrink-0">
                <label className={fieldLabelClass}>Target %</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={slippageTargetInput}
                    onChange={(e) => setSlippageTargetInput(e.target.value)}
                    placeholder="0.00"
                    className={`${inputClass} pr-8 ${showErrors && fieldErrors.slippageTarget ? errorRingClass : ""}`}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-400">%</span>
                </div>
                <FieldError
                  show={showErrors && fieldErrors.slippageTarget}
                  message="Enter a value between 0 and 100"
                />
              </div>

              <div className="w-45 shrink-0">
                <label className={fieldLabelClass}>Actual %</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={slippageActualInput}
                    onChange={(e) => setSlippageActualInput(e.target.value)}
                    placeholder="0.00"
                    className={`${inputClass} pr-8 ${showErrors && fieldErrors.slippageActual ? errorRingClass : ""}`}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-400">%</span>
                </div>
                <FieldError
                  show={showErrors && fieldErrors.slippageActual}
                  message="Enter a value between 0 and 100"
                />
              </div>

              {/* Revision counter — advanced by Save, never typed */}
              <div className="w-35 shrink-0">
                <label className={fieldLabelClass}>Revision</label>
                <div className={`${inputClass} bg-gray-50 text-gray-600`}>
                  Rev. {isSlippageDirty && savedSlippage !== null ? slippageRevision + 1 : slippageRevision}
                </div>
              </div>

              <div className="min-w-50 flex-1">
                <label className={fieldLabelClass}>Remarks</label>
                <input
                  type="text"
                  value={slippageRemarks}
                  onChange={(e) => setSlippageRemarks(e.target.value)}
                  placeholder="Remarks / basis of assessment..."
                  className={inputClass}
                />
              </div>

              <button
                type="button"
                onClick={handleSaveSlippage}
                disabled={!canFileSlippage}
                className="flex h-10.5 shrink-0 items-center justify-center gap-2 rounded-sm bg-blue-600 px-6 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {SaveIcon}
                Save
              </button>
            </div>

            {/* Prescribed action for the current stage / save state */}
            {slippageStage && (
              <p className="mt-3 text-xs text-gray-500">
                <span className="font-semibold text-gray-700">{slippageStage.label}:</span>{" "}
                {slippageStage.action}
                {savedSlippage !== null && !isSlippageDirty && (
                  <span className="ml-1 text-gray-400">
                    — filed as Rev. {slippageRevision}.
                  </span>
                )}
              </p>
            )}

            {/* Slippage history — one row per filed assessment */}
            <div className="mt-5">
              <label className={labelClass}>Slippage History</label>
              <div className="overflow-y-auto rounded-sm border border-gray-200" style={{ maxHeight: "392px" }}>
                <table className="w-full border-separate border-spacing-0 text-xs">
                  <thead className="sticky top-0 z-10 bg-gray-50">
                    <tr className="[&>th]:border-b [&>th]:border-gray-100">
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Date</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Target %</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Actual %</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Slippage (%)</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Remarks</th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {slippageHistoryRows.length > 0 ? slippageHistoryRows.map((entry) => {
                      const value = computeSlippage(entry.target, entry.actual);
                      const cfg = getSlippageStageConfig(value);
                      return (
                        <tr key={entry.id} className="hover:bg-gray-50/50">
                          <td className="px-3 py-2.5 text-gray-600">{fmtInputDate(entry.date)}</td>
                          <td className="px-3 py-2.5 text-gray-600">{entry.target.toFixed(2)}%</td>
                          <td className="px-3 py-2.5 text-gray-600">{entry.actual.toFixed(2)}%</td>
                          <td className={`px-3 py-2.5 font-bold ${cfg.text}`}>
                            {formatSlippage(value)}%
                          </td>
                          <td className="px-3 py-2.5 text-gray-600">{entry.remarks || "—"}</td>
                          <td className="px-3 py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => removeSlippageEntry(entry.id)}
                              className="text-gray-300 hover:text-red-500"
                              aria-label="Remove slippage assessment"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-400">No slippage assessment has been filed yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stage legend */}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gray-100 pt-4">
              {SLIPPAGE_STAGE_VALUES.map((stage) => {
                const cfg = SLIPPAGE_STAGE_CONFIG[stage];
                return (
                  <span key={stage} className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      {cfg.range}: {cfg.label}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Workforce Distribution + Project In-Charge & Profile ──── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Workforce Distribution */}
          <section className={`${cardClass} lg:col-span-2`}>
            <SectionHeader
              icon={PeopleIcon}
              title="Workforce Distribution"
              action={
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-500">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                  </span>
                  Live
                </span>
              }
            />
            <div className="grid grid-cols-3 gap-3 p-5">
              {/* Female */}
              <div className="rounded-sm border border-gray-200 bg-gray-50 p-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Female</p>
                  <span className="text-sm text-pink-400">♀</span>
                </div>
                <p className="mt-1.5 text-3xl font-extrabold text-gray-900">{numFemale}</p>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <button type="button" onClick={() => setNumFemale((n) => Math.max(0, n - 1))} className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg>
                  </button>
                  <button type="button" onClick={() => setNumFemale((n) => n + 1)} className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  </button>
                </div>
              </div>
              {/* Male */}
              <div className="rounded-sm border border-gray-200 bg-gray-50 p-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Male</p>
                  <span className="text-sm text-blue-400">♂</span>
                </div>
                <p className="mt-1.5 text-3xl font-extrabold text-gray-900">{numMale}</p>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <button type="button" onClick={() => setNumMale((n) => Math.max(0, n - 1))} className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg>
                  </button>
                  <button type="button" onClick={() => setNumMale((n) => n + 1)} className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  </button>
                </div>
              </div>
              {/* Total */}
              <div className="rounded-sm border border-blue-200 bg-blue-50 p-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Total</p>
                  <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                </div>
                <p className="mt-1.5 text-3xl font-extrabold text-blue-700">{totalWorkforce}</p>
              </div>
            </div>
            {showErrors && fieldErrors.workforce && (
              <p className="px-5 pb-4 text-xs text-red-500">At least one personnel is required</p>
            )}
          </section>

          {/* Project In-Charge & Profile */}
          <section className={`${cardClass} lg:col-span-3`}>
            <SectionHeader icon={PersonCheckIcon} title="Project In-Charge & Profile" />
            <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
              {/* Engineers */}
              <div>
                <label className={labelClass}>Engineers In-Charge <span className="text-red-500">*</span></label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {engineers.map((eng) => (
                    <span key={eng} className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {eng}
                      <button type="button" onClick={() => removeEngineer(eng)} className="text-blue-400 hover:text-blue-600">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={engineerInput}
                      onChange={(e) => setEngineerInput(e.target.value)}
                      onKeyDown={handleEngineerKeyDown}
                      placeholder="Add engineer..."
                      className="w-32 rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs text-gray-600 placeholder:text-gray-300 focus:border-blue-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addEngineer}
                      className="rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs font-semibold text-gray-500 hover:border-blue-400 hover:text-blue-600"
                    >
                      + Add Engineer
                    </button>
                  </div>
                </div>
                <FieldError
                  show={showErrors && fieldErrors.engineers}
                  message="At least one engineer is required"
                />
              </div>
              {/* Project Profile */}
              <div>
                <label className={labelClass}>Project Profile <span className="text-red-500">*</span></label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the scope of work, deliverables, and methodology..."
                  className={`${inputClass} resize-none ${showErrors && fieldErrors.description ? errorRingClass : ""}`}
                />
                <FieldError show={showErrors && fieldErrors.description} />
              </div>
            </div>
          </section>
        </div>

        {/* ── Project Documentation ─────────────────────────────────── */}
        <section className={cardClass}>
          <SectionHeader
            icon={FolderIcon}
            title="Project Documentation"
            action={
              <button
                type="button"
                onClick={() => openDocModal()}
                disabled={isUploadingDoc}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-sm bg-blue-600 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3m9-6.75V18a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18V6a2.25 2.25 0 0 1 2.25-2.25h6.879a1.5 1.5 0 0 1 1.06.44l3.622 3.62a1.5 1.5 0 0 1 .439 1.061Z" />
                </svg>
                {isUploadingDoc ? "Uploading..." : "Upload Document"}
              </button>
            }
          />
          <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
            {/* Document checklist — ticked by the category each upload is filed under */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Document Checklist
                </span>
                <span className="text-[10px] font-bold tracking-wider text-gray-400">
                  {satisfiedCount}/{DOC_CHECKLIST.length}
                </span>
              </div>
              <ul className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-1">
                {DOC_CHECKLIST.map((item) => {
                  const done = satisfiedDocs.has(item.key);
                  return (
                    <li
                      key={item.key}
                      role="checkbox"
                      aria-checked={done}
                      aria-readonly
                      className="flex items-start gap-3"
                    >
                      <span
                        className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${done
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-200 bg-white"
                          }`}
                      >
                        {done && (
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        )}
                      </span>
                      <span
                        className={`text-sm leading-snug ${done ? "font-semibold text-gray-900" : "text-gray-600"
                          }`}
                      >
                        {item.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Uploaded files */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const dropped = Array.from(e.dataTransfer.files);
                // Dropping here opens the modal with the files staged so the
                // category is still chosen before anything is uploaded.
                if (dropped.length > 0) openDocModal(dropped);
              }}
            >
              {/* Mobile / tablet card list */}
              <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 lg:hidden">
                {pendingFiles.length === 0 && (
                  <button
                    type="button"
                    onClick={() => openDocModal()}
                    className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 px-4 py-16 text-center transition hover:bg-gray-50/70"
                  >
                    <svg className="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-8.6-1.9M2.25 15a4.5 4.5 0 0 1 4.5-4.5M3 3l18 18" />
                    </svg>
                    <span className="text-sm text-gray-400">
                      No documents uploaded yet.
                    </span>
                  </button>
                )}
                {pendingFiles.map((f) => {
                  const colors = fileIconColor(f.fileType, f.fileName);
                  return (
                    <div key={f.id} className="space-y-3 p-4">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded ${colors.bg}`}>
                          <svg className={`h-4 w-4 ${colors.text}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="min-w-0 flex-1 truncate text-sm text-gray-700" title={f.fileName}>
                          {f.fileName}
                        </span>
                        <div className="flex shrink-0 gap-2">
                          <a
                            href={f.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                            aria-label="Preview"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                          </a>
                          <button
                            type="button"
                            onClick={() => removeFile(f.id)}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                            aria-label="Remove"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <select
                        value={f.docType}
                        onChange={(e) => changeDocType(f.id, e.target.value as DocType)}
                        aria-label={`Document type for ${f.fileName}`}
                        className="w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        {DOC_CHECKLIST.map((item) => (
                          <option key={item.key} value={item.key}>
                            {item.label}
                          </option>
                        ))}
                        <option value="OTHER">Other</option>
                      </select>
                      <p className="text-xs text-gray-500">
                        {fmtDate(f.uploadedAt)} &middot; {me?.name ?? me?.email ?? "—"}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto rounded-xl border border-gray-200 lg:block">
                <table className="w-full min-w-160 text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">File Name</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Type</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Upload Date</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Uploaded By</th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingFiles.length === 0 && (
                      <tr>
                        <td colSpan={5}>
                          <button
                            type="button"
                            onClick={() => openDocModal()}
                            className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 px-4 py-16 text-center transition hover:bg-gray-50/70"
                          >
                            <svg className="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-8.6-1.9M2.25 15a4.5 4.5 0 0 1 4.5-4.5M3 3l18 18" />
                            </svg>
                            <span className="text-sm text-gray-400">
                              No documents uploaded yet.
                            </span>
                          </button>
                        </td>
                      </tr>
                    )}
                    {pendingFiles.map((f) => {
                      const colors = fileIconColor(f.fileType, f.fileName);
                      return (
                        <tr key={f.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3">
                            <div className="flex min-w-0 items-center gap-2">
                              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded ${colors.bg}`}>
                                <svg className={`h-4 w-4 ${colors.text}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="block max-w-80 truncate text-sm text-gray-700" title={f.fileName}>
                                {f.fileName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={f.docType}
                              onChange={(e) => changeDocType(f.id, e.target.value as DocType)}
                              aria-label={`Document type for ${f.fileName}`}
                              className="max-w-45 truncate rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                              {DOC_CHECKLIST.map((item) => (
                                <option key={item.key} value={item.key}>
                                  {item.label}
                                </option>
                              ))}
                              <option value="OTHER">Other</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-600">{fmtDate(f.uploadedAt)}</td>
                          <td className="px-4 py-3 text-gray-600">{me?.name ?? me?.email ?? "—"}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <a
                                href={f.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                                aria-label="Preview"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                              </a>
                              <button
                                type="button"
                                onClick={() => removeFile(f.id)}
                                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                                aria-label="Remove"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Drag and drop here or use Upload Document — both open the upload
                form, where the requirement the document satisfies is chosen.
                Correct the Type column if one lands on the wrong row.
              </p>
            </div>
          </div>
        </section>

        <UploadDocumentModal
          open={isDocModalOpen}
          onClose={closeDocModal}
          onSubmit={handleDocUpload}
          isUploading={isUploadingDoc}
          uploadError={docUploadError}
          initialFiles={stagedDropFiles}
        />

        {/* Error */}
        {showErrors && hasErrors && (
          <div className="rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Please complete all required fields highlighted above before submitting.
          </div>
        )}
        {createProject.isError && (
          <div className="rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {createProject.error.message}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 pb-8">
          <Link
            href="/admin/projects"
            className="rounded-sm border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Cancel
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isBusy || !title}
              className="rounded-sm border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isBusy}
              className="rounded-sm bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createProject.isPending
                ? "Submitting..."
                : isUploadingImage || isUploadingDoc
                  ? "Uploading..."
                  : "Submit Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProjectForm;