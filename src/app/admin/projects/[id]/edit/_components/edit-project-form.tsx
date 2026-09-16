"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useMemo } from "react";
import { api } from "~/trpc/react";
import { useUploadThing } from "~/lib/uploadthing";
import {
  SOURCE_OF_FUND_LABEL,
  SOURCE_OF_FUND_ORDER,
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_ORDER,
  DISBURSEMENT_TYPE_LABEL,
  MODE_TO_DISBURSEMENT_TYPES,
  PROJECT_ACCOUNT_LABEL,
  PROJECT_ACCOUNT_VALUES,
  SUPPLEMENTAL_BUDGET_YEARS,
  SUPPLEMENTAL_BUDGET_NUMBERS,
  type SourceOfFundValue,
  type ProjectStatusValue,
  type ProjectAccountValue,
  type DisbursementTypeValue,
} from "~/lib/fund-constants";
import {
  landbankOptions,
  programLabel,
  programOptions,
  projectLabel,
  projectOptions,
  withSelected,
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
import { parseCoord } from "~/lib/geo";
import { handleAmountChange, parseAmount, formatAmountValue } from "~/lib/currency";
import { GeospatialFields } from "~/app/_components/geospatial-fields";
import { UploadDocumentModal } from "~/app/_components/upload-document-modal";
import {
  DOC_CHECKLIST,
  docFileType,
  docLabel,
  fileIconColor,
  inferDocType,
  type DocType,
} from "~/lib/project-documents";
import {
  PROJECT_IMAGE_SLOTS,
  filledImages,
  sameImageSlots,
  toImageSlots,
  type ProjectImageSlots,
} from "~/lib/project-images";
import { ProjectImageUploader } from "~/app/_components/project-image-uploader";

const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  NOT_YET_STARTED: { label: "Not Yet Started", badge: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-400" },
  ON_GOING: { label: "On-going", badge: "bg-amber-50  text-amber-700 border-amber-200", dot: "bg-amber-500" },
  COMPLETED: { label: "Completed", badge: "bg-green-50  text-green-700 border-green-200", dot: "bg-green-500" },
  SUSPENDED: { label: "Suspended", badge: "bg-red-50    text-red-700   border-red-200", dot: "bg-red-500" },
  FOR_IMPLEMENTATION: { label: "For Implementation", badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  RE_ALIGNMENT: { label: "Re-alignment", badge: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" },
  OTHERS: { label: "Others", badge: "bg-slate-50 text-slate-700 border-slate-200", dot: "bg-slate-500" },
};

// `legacy` types are kept so existing records still show their badge, but are
// not offered in the Type dropdowns.
const TIMELINE_ADJ_TYPE_CONFIG: Record<string, { label: string; badge: string; legacy?: boolean }> = {
  EXTENSION: { label: "Extension", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  SUSPENSION: { label: "Suspension", badge: "bg-red-50 text-red-700 border-red-200" },
  RESUMPTION: { label: "Resumption", badge: "bg-green-50 text-green-700 border-green-200" },
  NTP: { label: "NTP", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  ON_SCHEDULE: { label: "On-Schedule", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", legacy: true },
};

const fmt = (d: Date | string | null | undefined) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

const toInputDate = (d: Date | string | null | undefined) => {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

// Today as a `yyyy-mm-dd` value for a date input, in local time — toISOString
// would hand back the UTC day and shift the date for evening entries.
const todayInputDate = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

// ─── Section card wrapper ────────────────────────────────────────────────────
const SectionCard = ({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => {
  return (
    <div className={`rounded-sm border border-gray-200 bg-white shadow-sm ${className}`} style={style}>
      {children}
    </div>
  );
}

// ─── Section header ──────────────────────────────────────────────────────────
const SectionHeader = ({
  icon, title, action,
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-3.5">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-blue-500">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-700">{title}</span>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ─── Field label ─────────────────────────────────────────────────────────────
const FieldLabel = ({ children }: { children: React.ReactNode }) => {
  return <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{children}</p>;
}

// ─── Input ───────────────────────────────────────────────────────────────────
const Input = (props: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) => {
  const { error, className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`block w-full rounded-sm border px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 ${error
        ? "border-red-300 focus:border-red-400 focus:ring-red-400/20"
        : "border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
        } ${className}`}
    />
  );
}

// ─── Select ──────────────────────────────────────────────────────────────────
const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <div className="relative">
      <select
        {...props}
        className={`block w-full appearance-none rounded-sm border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 ${props.className ?? ""}`}
      />
      <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  );
}

// Percentages behave like the coordinates: anything that is not a 0–100 value
// reads as "not entered yet" rather than NaN.
const parsePercent = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) return null;
  return parsed;
};

// Physical accomplishment is stored as a float, so it keeps two decimals and
// stays inside 0–100.
const clampPercent = (value: number) =>
  Math.round(Math.min(100, Math.max(0, value)) * 100) / 100;

// Styling handed to the shared <GeospatialFields> so it matches this form's
// Input / FieldLabel rather than the new-project form's.
const GEO_INPUT_CLASS =
  "block w-full rounded-sm border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20";
const GEO_LABEL_CLASS =
  "mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400";

// ─── Icons ───────────────────────────────────────────────────────────────────
const EditIcon = () => (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export const EditProjectForm = ({ projectId }: { projectId: string }) => {
  const utils = api.useUtils();
  const engineerRef = useRef<HTMLInputElement>(null);

  const { data: project, isLoading } = api.project.getById.useQuery({ id: projectId });
  const { data: activities } = api.projectActivity.getByProjectId.useQuery({ projectId });
  const { data: disbursements, refetch: refetchDisbursements } = api.project.getDisbursements.useQuery({ projectId });
  const { data: variationOrders, refetch: refetchVariationOrders } = api.project.getVariationOrders.useQuery({ projectId });
  const { data: timelineAdjustments, refetch: refetchTimelineAdjustments } = api.project.getTimelineAdjustments.useQuery({ projectId });
  const { data: slippageAssessments, refetch: refetchSlippageAssessments } = api.project.getSlippageAssessments.useQuery({ projectId });
  const { data: projectFiles, refetch: refetchFiles } = api.projectFile.getByProjectId.useQuery({ projectId });
  // Files saved before docType existed fall back to a guess from the file name,
  // so the checklist is not blank on older projects. Correcting a row's Type
  // persists the real key and the guess stops being used for that file.
  const resolveDocType = (f: { docType: string | null; fileName: string }): DocType =>
    (f.docType as DocType | null) ?? inferDocType(f.fileName);
  const satisfiedDocs = useMemo(
    () => new Set((projectFiles ?? []).map(resolveDocType)),
    [projectFiles],
  );
  const satisfiedCount = DOC_CHECKLIST.filter((item) =>
    satisfiedDocs.has(item.key),
  ).length;
  const { startUpload } = useUploadThing("projectFileUploader");
  // Programs / Projects / LBP-TL numbers a super admin registered from the
  // project override page, merged into the Funding Information dropdowns below.
  const { data: customOptions } = api.fundingOption.getAll.useQuery();

  // ─ Identity & Status ───────────────────────────────────────────────────
  const [completion, setCompletion] = useState(0);
  // Raw text of the percentage box, kept apart from `completion` so the field
  // can sit empty while it is being retyped instead of snapping back to 0.
  const [completionText, setCompletionText] = useState("0");
  const [status, setStatus] = useState("ON_GOING");
  const [contractorName, setContractorName] = useState("");
  const [modeOfImplementation, setModeOfImplementation] = useState("BY_CONTRACT");

  // ─ Location ────────────────────────────────────────────────────────────
  const [locDistrict, setLocDistrict] = useState("");
  const [cityMunicipality, setCityMunicipality] = useState("");
  const [barangay, setBarangay] = useState("");
  const [purok, setPurok] = useState("");
  const [sitio, setSitio] = useState("");

  // ─ Geospatial ──────────────────────────────────────────────────────────
  // Coordinates live as strings so a partially typed value survives editing;
  // they are saved with the rest of the form by Save Changes.
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // ─ Slippage ────────────────────────────────────────────────────────────
  // Filed on its own Save, like disbursements and timeline adjustments — the
  // revision counter is advanced server-side.
  const [slippageTargetInput, setSlippageTargetInput] = useState("");
  const [slippageActualInput, setSlippageActualInput] = useState("");
  const [slippageError, setSlippageError] = useState<string | null>(null);
  // Assessment date and remarks travel with the save into the history row.
  // The date may be back-dated, so it is not simply the time of filing.
  const [slippageDate, setSlippageDate] = useState(todayInputDate);
  const [slippageRemarks, setSlippageRemarks] = useState("");
  // Inline editing of a filed history row: the row being edited and its draft.
  const [editingSlippageId, setEditingSlippageId] = useState<string | null>(null);
  const [slippageDraft, setSlippageDraft] = useState({
    date: "",
    target: "",
    actual: "",
    remarks: "",
  });
  const [slippageRowError, setSlippageRowError] = useState<string | null>(null);

  // ─ Funding ─────────────────────────────────────────────────────────────
  const [sourceOfFund, setSourceOfFund] = useState<SourceOfFundValue | "">("");
  const [program, setProgram] = useState("");
  const [subType, setSubType] = useState("");
  const [projectAccount, setProjectAccount] = useState<ProjectAccountValue | "">("");
  const [budgetYear, setBudgetYear] = useState("");
  const [landbankNumber, setLandbankNumber] = useState("");
  const [supplementalBudgetYear, setSupplementalBudgetYear] = useState("");
  const [supplementalBudgetNumber, setSupplementalBudgetNumber] = useState("");

  // ─ Dates ───────────────────────────────────────────────────────────────
  const [dateStarted, setDateStarted] = useState("");
  const [targetCompletion, setTargetCompletion] = useState("");
  const [revisedCompletion, setRevisedCompletion] = useState("");

  // ─ Workforce ───────────────────────────────────────────────────────────
  const [numFemale, setNumFemale] = useState(0);
  const [numMale, setNumMale] = useState(0);

  // ─ Responsibility & Scope ──────────────────────────────────────────────
  const [engineers, setEngineers] = useState<string[]>([]);
  const [engineerInput, setEngineerInput] = useState("");
  const [editingEngineer, setEditingEngineer] = useState<string | null>(null);
  const [editingEngineerValue, setEditingEngineerValue] = useState("");
  const [description, setDescription] = useState("");

  // ─ Project photos ──────────────────────────────────────────────────────
  // Four photos per project, hydrated from the record below. Projects created
  // before the gallery existed come back with only slot 1 filled.
  const [imageSlots, setImageSlots] = useState<ProjectImageSlots>(
    Array.from({ length: PROJECT_IMAGE_SLOTS }, () => null),
  );
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // ─ Document upload ─────────────────────────────────────────────────────
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  // ─ Document upload modal ───────────────────────────────────────────────
  // The modal asks for the requirement before anything is uploaded, so the
  // category is always confirmed rather than guessed from the file name.
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [docModalFiles, setDocModalFiles] = useState<File[]>([]);

  // ─ Activity ────────────────────────────────────────────────────────────
  const [comment, setComment] = useState("");

  // ─ Disbursement ────────────────────────────────────────────────────────
  const [disbAmount, setDisbAmount] = useState("");
  const [disbRef, setDisbRef] = useState("");
  const [disbType, setDisbType] = useState<"" | DisbursementTypeValue>("");
  // The actual date the money moved, which may be back-dated rather than the
  // time of filing — same reasoning as the slippage assessment date.
  const [disbDate, setDisbDate] = useState(todayInputDate);
  const [disbErrors, setDisbErrors] = useState<{ amount?: string; ref?: string; type?: string; date?: string }>({});

  // ─ Timeline Adjustment ──────────────────────────────────────────────────
  const [adjDays, setAdjDays] = useState("");
  const [adjType, setAdjType] = useState<"" | "EXTENSION" | "SUSPENSION" | "RESUMPTION" | "NTP">("");
  // Inline editing of a recorded adjustment: the row being edited and its draft.
  const [editingAdjId, setEditingAdjId] = useState<string | null>(null);
  const [adjDraft, setAdjDraft] = useState({
    startDate: "",
    endDate: "",
    duration: "",
    type: "" as "" | "EXTENSION" | "SUSPENSION" | "RESUMPTION" | "NTP" | "ON_SCHEDULE",
    justification: "",
  });
  const [adjRowError, setAdjRowError] = useState<string | null>(null);
  const [adjJustification, setAdjJustification] = useState("");
  const [adjError, setAdjError] = useState<string | null>(null);

  // ─ Variation Order (backup fund) ────────────────────────────────────────
  const [revisedSourceOfFund, setRevisedSourceOfFund] = useState<SourceOfFundValue | "">("");
  const [revisedProgram, setRevisedProgram] = useState("");
  const [revisedProject, setRevisedProject] = useState("");
  const [revisedVariation, setRevisedVariation] = useState("");
  const [variationError, setVariationError] = useState<string | null>(null);
  const [editingVoId, setEditingVoId] = useState<string | null>(null);

  // ─ UI ──────────────────────────────────────────────────────────────────
  const [showSuccess, setShowSuccess] = useState(false);

  // populate state from project
  useEffect(() => {
    if (!project) return;
    setCompletion(project.completionPercentage);
    setCompletionText(String(project.completionPercentage));
    setStatus(project.status);
    setContractorName(project.contractorName ?? "");
    setModeOfImplementation(project.modeOfImplementation);
    setLocDistrict(project.district ?? project.locationImplementation ?? "");
    setCityMunicipality(project.cityMunicipality ?? "");
    setBarangay(project.barangay ?? "");
    setPurok(project.purok ?? "");
    setSitio(project.sitio ?? "");
    setLatitude(project.latitude !== null ? String(project.latitude) : "");
    setLongitude(project.longitude !== null ? String(project.longitude) : "");
    setSlippageTargetInput(
      project.slippageTarget !== null ? String(project.slippageTarget) : "",
    );
    setSlippageActualInput(
      project.slippageActual !== null ? String(project.slippageActual) : "",
    );
    setSourceOfFund(project.sourceOfFund);
    setProgram(project.program ?? "");
    setSubType(project.subType ?? "");
    setProjectAccount((project.projectAccount as ProjectAccountValue | null) ?? "");
    setBudgetYear(project.budgetYear ?? "");
    setLandbankNumber(project.landbankNumber ?? "");
    setSupplementalBudgetYear(project.supplementalBudgetYear ?? "");
    setSupplementalBudgetNumber(project.supplementalBudgetNumber ?? "");
    setDateStarted(toInputDate(project.dateStarted));
    setTargetCompletion(toInputDate(project.targetCompletionDate));
    setRevisedCompletion(toInputDate(project.revisedCompletionDate));
    setNumFemale(project.numFemale ?? 0);
    setNumMale(project.numMale ?? 0);
    setEngineers(project.projectEngineer ? project.projectEngineer.split(",").map((s) => s.trim()).filter(Boolean) : []);
    setDescription(project.description ?? "");
    setImageSlots(toImageSlots(project));
  }, [project]);

  const setImageSlot = (index: number, url: string | null) =>
    setImageSlots((prev) => prev.map((u, i) => (i === index ? url : u)));

  // Older records only ever had a single cover photo, so the gallery is very
  // often partly empty here. Surfaced as a notice, never as a blocked save.
  const filledImageCount = filledImages(imageSlots).length;

  const totalWorkforce = numFemale + numMale;

  const availableMunicipalities = useMemo(
    () => getMunicipalitiesByDistrict(locDistrict as "DISTRICT_I" | "DISTRICT_II" | ""),
    [locDistrict],
  );
  const availableBarangays = useMemo(
    () => getBarangaysByMunicipality(cityMunicipality),
    [cityMunicipality],
  );

  // ─ Geospatial derived values ───────────────────────────────────────────
  const parsedLat = useMemo(() => parseCoord(latitude, 90), [latitude]);
  const parsedLng = useMemo(() => parseCoord(longitude, 180), [longitude]);
  const hasInvalidLat = latitude.trim() !== "" && parsedLat === null;
  const hasInvalidLng = longitude.trim() !== "" && parsedLng === null;

  // ─ Slippage derived values ─────────────────────────────────────────────
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
  const slippageStage =
    slippage !== null ? getSlippageStageConfig(slippage) : null;

  // The pair currently on file, against which the inputs read as dirty.
  const savedSlippageKey =
    project?.slippageTarget != null && project?.slippageActual != null
      ? `${project.slippageTarget}|${project.slippageActual}`
      : null;
  const slippageKey =
    slippageTarget !== null && slippageActual !== null
      ? `${slippageTarget}|${slippageActual}`
      : null;
  const isSlippageDirty =
    slippageKey !== null && slippageKey !== savedSlippageKey;
  const slippageRevision = project?.slippageRevision ?? 0;
  // ─ Mutations ───────────────────────────────────────────────────────────
  const updateProject = api.project.update.useMutation({
    onSuccess: () => {
      // Invalidate the whole router, not just this project: the projects list
      // and the dashboard read `getAll` and the yearly aggregates, so a
      // getById-only invalidate leaves them showing pre-save figures.
      void utils.project.invalidate();
      setShowSuccess(true);
    },
  });

  const addActivity = api.projectActivity.create.useMutation({
    onSuccess: () => {
      setComment("");
      void utils.projectActivity.getByProjectId.invalidate({ projectId });
    },
  });

  const updateSlippage = api.project.updateSlippage.useMutation({
    onSuccess: (updated) => {
      void utils.project.invalidate();
      void refetchSlippageAssessments();
      setSlippageError(null);
      setSlippageRemarks("");
      addActivity.mutate({
        projectId,
        description: `Filed slippage assessment Rev. ${updated.slippageRevision} — target ${updated.slippageTarget}%, actual ${updated.slippageActual}%.`,
      });
    },
    onError: (error) => setSlippageError(error.message),
  });

  const handleSaveSlippage = () => {
    if (slippageTargetInput.trim() === "" || slippageActualInput.trim() === "") {
      setSlippageError("Enter both the target and actual accomplishment.");
      return;
    }
    if (slippageTarget === null || slippageActual === null) {
      setSlippageError("Target and actual must each be between 0 and 100.");
      return;
    }
    if (!slippageDate) {
      setSlippageError("Enter the assessment date.");
      return;
    }
    if (!isSlippageDirty) return;
    setSlippageError(null);
    updateSlippage.mutate({
      id: projectId,
      slippageTarget,
      slippageActual,
      date: new Date(slippageDate),
      remarks: slippageRemarks.trim() || undefined,
    });
  };

  const updateSlippageAssessment = api.project.updateSlippageAssessment.useMutation({
    onSuccess: () => {
      setEditingSlippageId(null);
      setSlippageRowError(null);
      void refetchSlippageAssessments();
    },
    onError: (error) => setSlippageRowError(error.message),
  });

  const startEditSlippage = (
    entry: NonNullable<typeof slippageAssessments>[number],
  ) => {
    setEditingSlippageId(entry.id);
    setSlippageRowError(null);
    setSlippageDraft({
      date: toInputDate(entry.date),
      target: entry.target.toFixed(2),
      actual: entry.actual.toFixed(2),
      remarks: entry.remarks ?? "",
    });
  };

  const saveEditSlippage = (id: string) => {
    const target = parsePercent(slippageDraft.target);
    const actual = parsePercent(slippageDraft.actual);
    if (!slippageDraft.date) {
      setSlippageRowError("Enter the assessment date.");
      return;
    }
    if (target === null || actual === null) {
      setSlippageRowError("Target and actual must each be between 0 and 100.");
      return;
    }
    setSlippageRowError(null);
    updateSlippageAssessment.mutate({
      id,
      date: new Date(slippageDraft.date),
      target,
      actual,
      remarks: slippageDraft.remarks.trim() || null,
    });
  };

  const deleteSlippageAssessment = api.project.deleteSlippageAssessment.useMutation({
    onSuccess: () => void refetchSlippageAssessments(),
    onError: (error) => setSlippageError(error.message),
  });

  const recordDisbursement = api.project.createDisbursement.useMutation({
    onSuccess: (_data, variables) => {
      setDisbAmount(""); setDisbRef(""); setDisbType(""); setDisbDate(todayInputDate()); setDisbErrors({});
      void refetchDisbursements();
      void utils.project.invalidate();
      const formatted = variables.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 });
      const refPart = variables.referenceNumber ? ` (Ref: ${variables.referenceNumber})` : "";
      const typePart = variables.type ? ` [${DISBURSEMENT_TYPE_LABEL[variables.type]}]` : "";
      const datePart = variables.date ? ` dated ${fmt(variables.date)}` : "";
      addActivity.mutate({
        projectId: variables.projectId,
        description: `Recorded disbursement of ₱${formatted}${datePart}${refPart}${typePart}.`,
      });
    },
  });

  const resetVariationForm = () => {
    setRevisedVariation("");
    setRevisedSourceOfFund("");
    setRevisedProgram("");
    setRevisedProject("");
    setEditingVoId(null);
    setVariationError(null);
  };

  const recordVariationOrder = api.project.createVariationOrder.useMutation({
    onSuccess: (_data, variables) => {
      resetVariationForm();
      void refetchVariationOrders();
      void utils.project.invalidate();
      const formatted = variables.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 });
      const srcPart = variables.sourceOfFund ? ` (${SOURCE_OF_FUND_LABEL[variables.sourceOfFund]})` : "";
      addActivity.mutate({
        projectId: variables.projectId,
        description: `Recorded variation order of ₱${formatted}${srcPart}.`,
      });
    },
  });

  const updateVariationOrder = api.project.updateVariationOrder.useMutation({
    onSuccess: (_data, variables) => {
      resetVariationForm();
      void refetchVariationOrders();
      void utils.project.invalidate();
      const formatted = variables.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 });
      addActivity.mutate({
        projectId,
        description: `Updated variation order to ₱${formatted}.`,
      });
    },
  });

  const updateTimelineAdjustment = api.project.updateTimelineAdjustment.useMutation({
    onSuccess: () => {
      setEditingAdjId(null);
      setAdjRowError(null);
      void refetchTimelineAdjustments();
    },
    onError: (error) => setAdjRowError(error.message),
  });

  const deleteTimelineAdjustment = api.project.deleteTimelineAdjustment.useMutation({
    onSuccess: () => void refetchTimelineAdjustments(),
    onError: (error) => setAdjRowError(error.message),
  });

  const startEditAdjustment = (
    adjustment: NonNullable<typeof timelineAdjustments>[number],
  ) => {
    setEditingAdjId(adjustment.id);
    setAdjRowError(null);
    setAdjDraft({
      startDate: toInputDate(adjustment.startDate),
      endDate: toInputDate(adjustment.endDate),
      duration: String(adjustment.duration),
      type: adjustment.type as "EXTENSION" | "SUSPENSION" | "RESUMPTION" | "NTP" | "ON_SCHEDULE",
      justification: adjustment.justification ?? "",
    });
  };

  const saveEditAdjustment = (id: string) => {
    if (!adjDraft.startDate || !adjDraft.endDate) {
      setAdjRowError("Start and end dates are required.");
      return;
    }
    if (new Date(adjDraft.endDate) < new Date(adjDraft.startDate)) {
      setAdjRowError("The end date cannot come before the start date.");
      return;
    }
    if (!adjDraft.type) {
      setAdjRowError("Adjustment type is required.");
      return;
    }
    const duration = Number(adjDraft.duration);
    if (!Number.isInteger(duration) || duration < 0) {
      setAdjRowError("Duration must be a whole number of days.");
      return;
    }
    setAdjRowError(null);
    updateTimelineAdjustment.mutate({
      id,
      startDate: new Date(adjDraft.startDate),
      endDate: new Date(adjDraft.endDate),
      duration,
      type: adjDraft.type,
      justification: adjDraft.justification.trim() || null,
    });
  };

  const recordTimelineAdjustment = api.project.createTimelineAdjustment.useMutation({
    onSuccess: (_data, variables) => {
      setAdjDays(""); setAdjType(""); setAdjJustification(""); setAdjError(null);
      void refetchTimelineAdjustments();
      void utils.project.invalidate();
      addActivity.mutate({
        projectId: variables.projectId,
        description: `Recorded ${variables.type.toLowerCase()} timeline adjustment of ${variables.duration} day(s).`,
      });
    },
  });

  const createProjectFile = api.projectFile.create.useMutation({
    onSuccess: (_data, variables) => {
      void refetchFiles();
      addActivity.mutate({
        projectId: variables.projectId,
        description: `Uploaded ${(variables.fileType ?? "OTHER").toLowerCase()} document "${variables.fileName}".`,
      });
    },
  });

  const updateProjectFile = api.projectFile.update.useMutation({
    onSuccess: (data) => {
      void refetchFiles();
      addActivity.mutate({
        projectId: data.projectId,
        description: `Re-filed document "${data.fileName}" as ${docLabel((data.docType ?? "OTHER") as DocType)}.`,
      });
    },
  });

  const deleteProjectFile = api.projectFile.delete.useMutation({
    onSuccess: (data) => {
      void refetchFiles();
      setDeleteNotice(`"${data.fileName}" was deleted.`);
      addActivity.mutate({
        projectId: data.projectId,
        description: `Deleted ${(data.fileType ?? "OTHER").toLowerCase()} document "${data.fileName}".`,
      });
    },
    onError: () => setDeleteNotice(null),
  });

  // ─ Handlers ────────────────────────────────────────────────────────────
  // The project photos go through ProjectImageUploader, which owns the upload
  // itself. They are not documentary requirements, so no ProjectFile row is
  // filed for them and they never touch documentUrl / documentName.

  const openDocModal = (files: File[] = []) => {
    setDocModalFiles(files);
    setIsDocModalOpen(true);
  };

  const closeDocModal = () => {
    setDocModalFiles([]);
    setIsDocModalOpen(false);
  };

  // Documentary requirements, filed under the category the modal collected.
  // projectFileUploader is maxFileCount: 1, so each file goes up on its own.
  const handleDocumentsUpload = async (files: File[], docType: DocType) => {
    setIsUploadingDoc(true);
    setUploadError(null);
    try {
      for (const file of files) {
        const result = await startUpload([file]);
        if (!result?.[0]) {
          setUploadError(`Upload failed for "${file.name}". Please try again.`);
          return;
        }
        await createProjectFile.mutateAsync({
          projectId,
          fileName: file.name,
          fileUrl: result[0].ufsUrl,
          fileType: docFileType(docType, file.name),
          docType,
          fileSize: file.size,
        });
      }
      closeDocModal();
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const changeDocType = (
    file: { id: string; fileName: string },
    docType: DocType,
  ) =>
    updateProjectFile.mutate({
      id: file.id,
      docType,
      fileType: docFileType(docType, file.fileName),
    });

  // Compare the current form state against the project as last loaded and return
  // the human-readable names of the cards the user actually changed, so each one
  // can be logged individually in the audit trail.
  const getChangedSections = () => {
    if (!project) return [] as string[];
    const sections: string[] = [];

    const originalEngineers = project.projectEngineer
      ? project.projectEngineer.split(",").map((s) => s.trim()).filter(Boolean).join(", ")
      : "";

    // For Project Identity & Status, name the specific fields that changed so
    // the audit trail shows what was updated, not just the card.
    const identityFields: string[] = [];
    if (status !== project.status) identityFields.push("Current Status");
    if (modeOfImplementation !== project.modeOfImplementation) identityFields.push("Implementation Mode");
    if (contractorName !== (project.contractorName ?? "")) identityFields.push("Contractor Name");
    if (completion !== project.completionPercentage) identityFields.push("Project Progress");
    if (identityFields.length > 0) {
      sections.push(`Project Identity & Status (${identityFields.join(", ")})`);
    }

    const locationFields: string[] = [];
    if (locDistrict !== (project.district ?? project.locationImplementation ?? "")) locationFields.push("District");
    if (cityMunicipality !== (project.cityMunicipality ?? "")) locationFields.push("Municipality / City");
    if (barangay !== (project.barangay ?? "")) locationFields.push("Barangay");
    if (purok !== (project.purok ?? "")) locationFields.push("Purok");
    if (sitio !== (project.sitio ?? "")) locationFields.push("Sitio");
    if (parsedLat !== project.latitude || parsedLng !== project.longitude) {
      locationFields.push("Geospatial Data");
    }
    if (locationFields.length > 0) {
      sections.push(`Project Location (${locationFields.join(", ")})`);
    }

    const fundingFields: string[] = [];
    if (sourceOfFund !== project.sourceOfFund) fundingFields.push("Source of Fund");
    if (program !== (project.program ?? "")) fundingFields.push("Program");
    if (subType !== (project.subType ?? "")) fundingFields.push("Project");
    if (projectAccount !== ((project.projectAccount as ProjectAccountValue | null) ?? "")) fundingFields.push("Project Account");
    if (budgetYear !== (project.budgetYear ?? "")) fundingFields.push("Budget Year");
    if (landbankNumber !== (project.landbankNumber ?? "")) fundingFields.push("LANDBANK [LBP-TL#]");
    if (supplementalBudgetYear !== (project.supplementalBudgetYear ?? "")) fundingFields.push("Supplemental Budget Year");
    if (supplementalBudgetNumber !== (project.supplementalBudgetNumber ?? "")) fundingFields.push("Supplemental Budget Number");
    if (fundingFields.length > 0) {
      sections.push(`Funding Information (${fundingFields.join(", ")})`);
    }

    if (
      dateStarted !== toInputDate(project.dateStarted) ||
      targetCompletion !== toInputDate(project.targetCompletionDate) ||
      revisedCompletion !== toInputDate(project.revisedCompletionDate)
    ) {
      sections.push("Project Timeline");
    }

    const workforceFields: string[] = [];
    if (numFemale !== (project.numFemale ?? 0)) workforceFields.push("Female");
    if (numMale !== (project.numMale ?? 0)) workforceFields.push("Male");
    if (workforceFields.length > 0) {
      sections.push(`Workforce Distribution (${workforceFields.join(", ")})`);
    }

    const inChargeFields: string[] = [];
    if (engineers.join(", ") !== originalEngineers) inChargeFields.push("Engineers In-Charge");
    if (description !== (project.description ?? "")) inChargeFields.push("Project Profile");
    if (inChargeFields.length > 0) {
      sections.push(`Project In-Charge & Profile (${inChargeFields.join(", ")})`);
    }

    if (!sameImageSlots(imageSlots, toImageSlots(project))) {
      sections.push("Project Photos");
    }

    return sections;
  };

  const handleSaveChanges = () => {
    if (!project) return;
    const changedSections = getChangedSections();
    // `imageUrl` mirrors slot 1 so the readers that predate the gallery keep
    // finding a cover photo. The document columns are left alone — they hold
    // documentary requirements, not photos.
    const images = filledImages(imageSlots);
    updateProject.mutate(
      {
        id: projectId,
        title: project.title,
        modeOfImplementation: modeOfImplementation as
          | "BY_ADMINISTRATION"
          | "BY_CONTRACT"
          | "UNASSIGNED_FOR_DETERMINATION",
        locationImplementation: (locDistrict as "DISTRICT_I" | "DISTRICT_II") || project.locationImplementation,
        sourceOfFund: (sourceOfFund || project.sourceOfFund) as Parameters<typeof updateProject.mutate>[0]["sourceOfFund"],
        contractCost: project.contractCost,
        contractorName: contractorName || undefined,
        projectEngineer: engineers.join(", ") || undefined,
        budgetYear: budgetYear || undefined,
        subType: subType || null,
        program: program || null,
        projectAccount: projectAccount || null,
        landbankNumber: landbankNumber.trim() || null,
        supplementalBudgetYear: supplementalBudgetYear || null,
        supplementalBudgetNumber: supplementalBudgetNumber || null,
        dateStarted: dateStarted ? new Date(dateStarted) : null,
        targetCompletionDate: targetCompletion ? new Date(targetCompletion) : null,
        revisedCompletionDate: revisedCompletion ? new Date(revisedCompletion) : null,
        numFemale,
        numMale,
        numManDays: project.numManDays ?? 0,
        daysSuspended: project.daysSuspended ?? 0,
        daysExtended: project.daysExtended ?? 0,
        district: (locDistrict as "DISTRICT_I" | "DISTRICT_II") || null,
        cityMunicipality: cityMunicipality || undefined,
        barangay: barangay || undefined,
        purok: purok || undefined,
        sitio: sitio || undefined,
        latitude: parsedLat,
        longitude: parsedLng,
        description: description || undefined,
        status: status as ProjectStatusValue,
        completionPercentage: completion,
        imageUrl: images[0] ?? null,
        imageUrls: images,
      },
      {
        onSuccess: () => {
          // Log one audit-trail entry per card the user changed. createdById is the
          // current session user — i.e. the user who made this update.
          for (const section of changedSections) {
            addActivity.mutate({
              projectId,
              description: `Updated ${section}.`,
            });
          }
        },
      },
    );
  };

  const handleRecordDisbursement = () => {
    const errors: { amount?: string; ref?: string; type?: string; date?: string } = {};
    const amount = parseAmount(disbAmount);
    if (!disbAmount || isNaN(amount) || amount <= 0) errors.amount = "Amount must be greater than 0.";
    else if (amount > totalRemainingBalance)
      errors.amount = `Insufficient balance. Amount exceeds the total remaining balance of ₱${totalRemainingBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}.`;
    if (!disbDate) errors.date = "Disbursement date is required.";
    if (!disbRef.trim()) errors.ref = "Reference number is required.";
    if (!disbType) errors.type = "Type is required.";
    if (Object.keys(errors).length > 0) { setDisbErrors(errors); return; }
    setDisbErrors({});
    recordDisbursement.mutate({
      projectId,
      amount,
      date: new Date(disbDate),
      referenceNumber: disbRef.trim(),
      type: disbType as DisbursementTypeValue,
    });
  };

  const handleRecordVariationOrder = () => {
    const amount = parseAmount(revisedVariation);
    if (!revisedVariation || isNaN(amount) || amount <= 0) {
      setVariationError("Variation amount must be greater than 0.");
      return;
    }
    setVariationError(null);
    if (editingVoId) {
      updateVariationOrder.mutate({
        id: editingVoId,
        amount,
        sourceOfFund: revisedSourceOfFund || null,
        program: revisedProgram || null,
        subType: revisedProject || null,
      });
    } else {
      recordVariationOrder.mutate({
        projectId,
        amount,
        sourceOfFund: revisedSourceOfFund || undefined,
        program: revisedProgram || null,
        subType: revisedProject || null,
      });
    }
  };

  const startEditVariationOrder = (v: {
    id: string;
    amount: number;
    sourceOfFund: SourceOfFundValue | null;
    program: string | null;
    subType: string | null;
  }) => {
    setEditingVoId(v.id);
    setRevisedVariation(formatAmountValue(v.amount));
    setRevisedSourceOfFund(v.sourceOfFund ?? "");
    setRevisedProgram(v.program ?? "");
    setRevisedProject(v.subType ?? "");
    setVariationError(null);
  };

  const handleRecordTimelineAdjustment = () => {
    if (!dateStarted || !targetCompletion) { setAdjError("Start date and end date are required."); return; }
    if (!adjType) { setAdjError("Adjustment type is required."); return; }
    const days = parseInt(adjDays, 10);
    if (!adjDays || isNaN(days) || days < 0) { setAdjError("Days must be 0 or greater."); return; }
    setAdjError(null);
    recordTimelineAdjustment.mutate({
      projectId,
      startDate: new Date(dateStarted),
      endDate: new Date(targetCompletion),
      duration: days,
      type: adjType,
      justification: adjJustification.trim() || undefined,
    });
  };

  const addEngineer = () => {
    const name = engineerInput.trim();
    if (name && !engineers.includes(name)) setEngineers((prev) => [...prev, name]);
    setEngineerInput("");
  };

  const removeEngineer = (name: string) => setEngineers((prev) => prev.filter((e) => e !== name));

  const startEditEngineer = (name: string) => {
    setEditingEngineer(name);
    setEditingEngineerValue(name);
  };

  const cancelEditEngineer = () => {
    setEditingEngineer(null);
    setEditingEngineerValue("");
  };

  /** Renames the pill in place; renaming onto an existing name merges the two. */
  const commitEditEngineer = () => {
    if (editingEngineer === null) return;
    const original = editingEngineer;
    const name = editingEngineerValue.trim();
    cancelEditEngineer();
    if (!name || name === original) return;
    setEngineers((prev) =>
      prev.some((e) => e !== original && e === name)
        ? prev.filter((e) => e !== original)
        : prev.map((e) => (e === original ? name : e)),
    );
  };

  // ─ Loading / not found ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-sm text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-gray-400">
        <p>Project not found.</p>
        <Link href="/admin/projects" className="text-sm font-medium text-blue-600 hover:underline">Back to Projects</Link>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.ON_GOING!;
  // Disbursements draw down the Project Cost, so the Primary Fund Balance is the
  // Project Cost minus everything already disbursed.
  const totalDisb = disbursements?.reduce((s, d) => s + d.amount, 0) ?? 0;
  // Variation Order Balance (20% DF) is a backup fund the user records when needed
  // (e.g. as the Primary Fund nears 0). It's the sum of all recorded variation orders.
  const totalVariationOrder = variationOrders?.reduce((s, v) => s + v.amount, 0) ?? 0;
  // Disbursements draw down the Project Cost first. Once the Primary Fund is exhausted,
  // any further disbursements are automatically deducted from the Variation Order so
  // neither balance goes negative.
  const rawPrimary = (project.projectCost ?? 0) - totalDisb;
  const primaryFundBalance = Math.max(0, rawPrimary);
  const overflow = Math.max(0, -rawPrimary);
  const variationOrderBalance = Math.max(0, totalVariationOrder - overflow);
  const totalRemainingBalance = primaryFundBalance + variationOrderBalance;
  const currentRevisedTotal = (project.projectCost ?? 0) + totalVariationOrder;

  // Funding Information cascade: Source of Fund → Program → Project. Each list is
  // the built-in constants plus whatever a super admin added via Manual Entry.
  const fundingPrograms = withSelected(
    programOptions(sourceOfFund, customOptions),
    program,
    programLabel,
  );
  const fundingProjects = withSelected(
    projectOptions(program, customOptions),
    subType,
    projectLabel,
  );
  const availableLandbankNumbers = landbankNumber
    ? Array.from(new Set([...landbankOptions(customOptions), landbankNumber]))
    : landbankOptions(customOptions);
  // Same cascade for the variation-order record form
  const voPrograms = programOptions(revisedSourceOfFund, customOptions);
  const voProjects = projectOptions(revisedProgram, customOptions);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Success Modal ── */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm overflow-hidden rounded-sm bg-white shadow-2xl">
            <div className="bg-linear-to-br from-emerald-500 to-teal-600 px-8 py-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Changes Saved!</h3>
              <p className="mt-1 text-sm text-emerald-100">Project updated successfully.</p>
            </div>
            <div className="px-8 py-5">
              <button type="button" onClick={() => setShowSuccess(false)} className="w-full rounded-sm bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-700">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header / Breadcrumb ── */}
      <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <nav className="flex items-center gap-1.5 text-sm text-gray-400">
          <Link href="/admin/dashboard" className="hover:text-gray-600">Dashboard</Link>
          <span>/</span>
          <Link href="/admin/projects" className="hover:text-gray-600">Projects</Link>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          <span className="font-semibold text-gray-700">Update Project</span>
        </nav>
      </div>

      {/* ── Two-column Layout ── */}
      <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 xl:flex-row">

        {/* ════════════════════════════════
            LEFT  —  Main edit sections
        ════════════════════════════════ */}
        <div className="min-w-0 flex-1 space-y-4">

          {/* ── Identity, then Location stacked beneath it ── */}
          <div className="space-y-4">

            {/* PROJECT IDENTITY & STATUS */}
            <SectionCard>
              <SectionHeader
                icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
                title="Project Identity & Status"
                action={<button type="button" className="text-gray-400 hover:text-gray-600"><EditIcon /></button>}
              />
              <div className="flex flex-col sm:flex-row">
                {/* Photo gallery — four slots down the side of the card body */}
                <div className="w-full shrink-0 p-4 sm:w-72">
                  <ProjectImageUploader
                    slots={imageSlots}
                    onChange={setImageSlot}
                    onUploadingChange={setIsUploadingMedia}
                    badge={
                      <span className="absolute top-2 left-2 rounded-md bg-gray-900/90 px-2 py-1 font-mono text-[10px] font-bold tracking-wider text-white">
                        #{project.projectCode}
                      </span>
                    }
                  />
                  {filledImageCount < PROJECT_IMAGE_SLOTS && (
                    <p className="mt-2 rounded-sm border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[10px] text-amber-700">
                      This project has {filledImageCount} of {PROJECT_IMAGE_SLOTS}{" "}
                      photos. Upload the remaining slots when they are available.
                    </p>
                  )}
                </div>

                {/* Fields */}
                <div className="min-w-0 flex-1 space-y-3 p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="min-w-0">
                      <FieldLabel>Project Title</FieldLabel>
                      <p className="truncate text-sm font-semibold text-gray-900">{project.title}</p>
                    </div>
                    <div>
                      <FieldLabel>Project Cost</FieldLabel>
                      <p className="text-sm font-semibold text-gray-900">₱ {project.projectCost?.toLocaleString("en-PH", { minimumFractionDigits: 2 }) ?? "—"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <FieldLabel>Track Number</FieldLabel>
                      <p className="font-mono text-sm text-gray-700">{project.projectCode}</p>
                    </div>
                    <div>
                      <FieldLabel>Current Status</FieldLabel>
                      <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                        {PROJECT_STATUS_ORDER
                          .filter((k) => k !== "NOT_YET_STARTED" || status === "NOT_YET_STARTED")
                          .map((k) => (
                            <option key={k} value={k}>
                              {PROJECT_STATUS_LABEL[k]}
                            </option>
                          ))}
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <FieldLabel>Implementation Mode</FieldLabel>
                      <Select
                        value={modeOfImplementation}
                        onChange={(e) => {
                          setModeOfImplementation(e.target.value);
                          // The disbursement type options depend on the mode, so
                          // drop a selection that is no longer valid.
                          const types =
                            MODE_TO_DISBURSEMENT_TYPES[
                              e.target.value as keyof typeof MODE_TO_DISBURSEMENT_TYPES
                            ] ?? [];
                          if (disbType && !types.includes(disbType)) setDisbType("");
                        }}
                      >
                        <option value="BY_ADMINISTRATION">By Administration</option>
                        <option value="BY_CONTRACT">By Contract</option>
                        <option value="UNASSIGNED_FOR_DETERMINATION">
                          Unassigned - For Determination
                        </option>
                      </Select>
                    </div>
                    <div>
                      <FieldLabel>Contractor Name</FieldLabel>
                      <Input value={contractorName} onChange={(e) => setContractorName(e.target.value)} placeholder="Contractor name" />
                    </div>
                  </div>

                  {/* Progress — sits with the rest of the identity fields */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <FieldLabel>Project Progress</FieldLabel>
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-green-500">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                          Real-time
                        </span>
                      </div>
                      <div className="relative w-24 shrink-0">
                        <input
                          type="number" min={0} max={100} step={0.01} value={completionText}
                          onChange={(e) => {
                            // Keep whatever was typed — including an empty box or a
                            // half-written decimal like "45." — and only mirror it
                            // into `completion` once it parses.
                            const raw = e.target.value;
                            setCompletionText(raw);
                            if (raw === "") return;
                            const parsed = Number(raw);
                            if (Number.isNaN(parsed)) return;
                            setCompletion(clampPercent(parsed));
                          }}
                          onBlur={() => setCompletionText(String(completion))}
                          className="block w-full rounded-sm border border-gray-200 bg-white py-1.5 pl-2.5 pr-6 text-sm font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-blue-400">%</span>
                      </div>
                    </div>
                    <div className="relative flex h-5 w-full items-center">
                      {/* Track */}
                      <div className="absolute inset-x-0 h-2.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-150"
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                      {/* Thumb circle */}
                      <div
                        className="pointer-events-none absolute z-10 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-blue-500 bg-white shadow-md transition-all duration-150"
                        style={{ left: `${completion}%` }}
                      />
                      {/* Draggable range — overlaid transparently. Steps in
                          0.25 so dragging can land on a decimal instead of
                          snapping a typed 45.75 back to a whole number. */}
                      <input
                        type="range" min={0} max={100} step={0.25} value={completion}
                        onChange={(e) => {
                          const next = clampPercent(Number(e.target.value));
                          setCompletion(next);
                          setCompletionText(String(next));
                        }}
                        className="absolute inset-0 h-full w-full cursor-grab appearance-none bg-transparent opacity-0 active:cursor-grabbing"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* PROJECT LOCATION */}
            <SectionCard>
              <SectionHeader
                icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>}
                title="Project Location"
                action={<button type="button" className="text-gray-400 hover:text-gray-600"><EditIcon /></button>}
              />
              <div className="space-y-3 p-4">
                {/* Full-width card, so the administrative levels sit in one row */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <FieldLabel>District</FieldLabel>
                    <Select
                      value={locDistrict}
                      onChange={(e) => {
                        setLocDistrict(e.target.value);
                        setCityMunicipality("");
                        setBarangay("");
                        setPurok("");
                        setSitio("");
                      }}
                    >
                      <option value="">Select district...</option>
                      <option value="DISTRICT_I">District 1</option>
                      <option value="DISTRICT_II">District 2</option>
                    </Select>
                  </div>
                  <div>
                    <FieldLabel>Municipality / City</FieldLabel>
                    <Select
                      value={cityMunicipality}
                      onChange={(e) => {
                        setCityMunicipality(e.target.value);
                        setBarangay("");
                        setPurok("");
                        setSitio("");
                      }}
                      disabled={!locDistrict}
                    >
                      <option value="">
                        {locDistrict ? "Select municipality..." : "Select district first"}
                      </option>
                      {availableMunicipalities.map((m) => (
                        <option key={m.name} value={m.name}>{m.name}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <FieldLabel>Barangay</FieldLabel>
                    <Select
                      value={barangay}
                      onChange={(e) => {
                        setBarangay(e.target.value);
                        setPurok("");
                        setSitio("");
                      }}
                      disabled={!cityMunicipality}
                    >
                      <option value="">
                        {cityMunicipality ? "Select barangay..." : "Select municipality first"}
                      </option>
                      {availableBarangays.map((bg) => (
                        <option key={bg.name} value={bg.name}>{bg.name}</option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <FieldLabel>Purok</FieldLabel>
                    <Input
                      value={purok}
                      onChange={(e) => setPurok(e.target.value)}
                      placeholder="Enter Purok"
                    />
                  </div>
                  <div>
                    <FieldLabel>Sitio</FieldLabel>
                    <Input
                      value={sitio}
                      onChange={(e) => setSitio(e.target.value)}
                      placeholder="Enter Sitio"
                    />
                  </div>
                </div>

                {/* ── Geospatial Data ── */}
                <div className="border-t border-gray-100 pt-4">
                  <GeospatialFields
                    latitude={latitude}
                    longitude={longitude}
                    onLatitudeChange={setLatitude}
                    onLongitudeChange={setLongitude}
                    showLatitudeError={hasInvalidLat}
                    showLongitudeError={hasInvalidLng}
                    inputClassName={GEO_INPUT_CLASS}
                    labelClassName={GEO_LABEL_CLASS}
                    errorClassName="border-red-300 focus:border-red-400 focus:ring-red-400/20"
                  />
                </div>
              </div>
            </SectionCard>
          </div>

          {/* ── Funding Information ── */}
          <SectionCard>
            <SectionHeader
              icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>}
              title="Funding Information"
              action={<button type="button" className="text-gray-400 hover:text-gray-600"><EditIcon /></button>}
            />
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 p-5 lg:grid-cols-2">
              <div>
                <p className="mb-1.5 text-sm font-bold text-blue-900">Budget Year</p>
                <Select value={budgetYear} onChange={(e) => setBudgetYear(e.target.value)}>
                  <option value="">Select Year</option>
                  {Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i)).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </Select>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-bold text-blue-900">Program</p>
                <Select
                  value={program}
                  onChange={(e) => {
                    const next = e.target.value;
                    setProgram(next);
                    const allowed = projectOptions(next, customOptions);
                    if (!allowed.some((o) => o.value === subType)) setSubType("");
                  }}
                  disabled={!sourceOfFund || fundingPrograms.length === 0}
                >
                  <option value="">
                    {!sourceOfFund
                      ? "Select Source first"
                      : fundingPrograms.length === 0
                        ? "No programs available"
                        : "Select Program"}
                  </option>
                  {fundingPrograms.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}{o.custom ? " (added)" : ""}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-bold text-blue-900">Source of Fund</p>
                <Select
                  value={sourceOfFund}
                  onChange={(e) => {
                    const next = e.target.value as SourceOfFundValue | "";
                    setSourceOfFund(next);
                    setProgram("");
                    setSubType("");
                  }}
                >
                  <option value="">Select Source</option>
                  {SOURCE_OF_FUND_ORDER.map((k) => (
                    <option key={k} value={k}>
                      {SOURCE_OF_FUND_LABEL[k]}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-bold text-blue-900">Project</p>
                <Select
                  value={subType}
                  onChange={(e) => setSubType(e.target.value)}
                  disabled={!program || fundingProjects.length === 0}
                >
                  <option value="">
                    {!program
                      ? "Select Program first"
                      : fundingProjects.length === 0
                        ? "No projects available"
                        : "Select Project"}
                  </option>
                  {fundingProjects.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}{o.custom ? " (added)" : ""}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-bold text-blue-900">Supplemental Budget Year</p>
                <Select
                  value={supplementalBudgetYear}
                  onChange={(e) => setSupplementalBudgetYear(e.target.value)}
                >
                  <option value="">Select Year</option>
                  {SUPPLEMENTAL_BUDGET_YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </Select>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-bold text-blue-900">Project Account</p>
                <Select
                  value={projectAccount}
                  onChange={(e) => setProjectAccount(e.target.value as ProjectAccountValue | "")}
                >
                  <option value="">Select Classification</option>
                  {PROJECT_ACCOUNT_VALUES.map((k) => (
                    <option key={k} value={k}>{PROJECT_ACCOUNT_LABEL[k]}</option>
                  ))}
                </Select>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-bold text-blue-900">Supplemental Budget Number</p>
                <Select
                  value={supplementalBudgetNumber}
                  onChange={(e) => setSupplementalBudgetNumber(e.target.value)}
                >
                  <option value="">Select SB No.</option>
                  {SUPPLEMENTAL_BUDGET_NUMBERS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </Select>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-bold text-blue-900">* LANDBANK [LBP-TL#]</p>
                <Select
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
                </Select>
              </div>
            </div>
          </SectionCard>

          {/* ── Financial Summary ── */}
          <SectionCard>
            <SectionHeader
              icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" /></svg>}
              title="Financial Summary"
              action={<button type="button" className="text-gray-400 hover:text-gray-600"><EditIcon /></button>}
            />
            <div className="p-5">
              {/* Balance tiles */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-sm border border-gray-200 bg-gray-50/60 px-4 py-3.5">
                  <p className="text-sm font-bold text-blue-800">Total Remaining Balance</p>
                  <p className={`mt-1 text-xl font-extrabold ${totalRemainingBalance <= 100000 ? "text-red-700" : "text-blue-900"}`}>
                    ₱ {totalRemainingBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="rounded-sm border border-gray-200 bg-gray-50/60 px-4 py-3.5">
                  <p className="text-sm font-bold text-blue-800">Primary Fund Balance</p>
                  <p className="mt-1 text-lg font-extrabold text-gray-900">
                    ₱ {primaryFundBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="rounded-sm border border-gray-200 bg-gray-50/60 px-4 py-3.5">
                  <p className="text-sm font-bold text-blue-800">Variation Order Balance</p>
                  <p className="mt-1 text-lg font-extrabold text-gray-900">
                    ₱ {variationOrderBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Recent Disbursements */}
              <div className="mt-6">
                <FieldLabel>Recent Disbursements</FieldLabel>
                <div
                  className="overflow-auto rounded-sm border border-gray-200"
                  style={{ maxHeight: "268px" }}
                >
                  <table className="w-full min-w-150 border-separate border-spacing-0 text-xs">
                    <thead className="sticky top-0 z-10 bg-gray-50">
                      <tr className="[&>th]:border-b [&>th]:border-gray-100">
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Date</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Reference #</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Source of Fund</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Type</th>
                        <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">Amount (₱)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {disbursements && disbursements.length > 0 ? disbursements.map((d) => (
                        <tr key={d.id} className="hover:bg-gray-50/50">
                          <td className="px-3 py-2.5 text-gray-600">{fmt(d.date)}</td>
                          <td className="px-3 py-2.5 font-mono text-gray-700">{d.referenceNumber ?? "—"}</td>
                          <td className="px-3 py-2.5 text-gray-700">
                            {sourceOfFund ? SOURCE_OF_FUND_LABEL[sourceOfFund] : "—"}
                          </td>
                          <td className="px-3 py-2.5 text-gray-700">
                            {d.type ? DISBURSEMENT_TYPE_LABEL[d.type] : "—"}
                          </td>
                          <td className="px-3 py-2.5 text-right font-semibold text-gray-900">
                            {d.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-400">No disbursements recorded yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Record form */}
                <div className="mt-3 flex flex-wrap gap-2 rounded-sm border border-gray-200 p-3">
                  <div className="relative w-full shrink-0 sm:w-36">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₱</span>
                    <Input
                      type="text" inputMode="decimal" placeholder="Amount *"
                      value={disbAmount}
                      onChange={(e) => { handleAmountChange(e.target, setDisbAmount); setDisbErrors((p) => ({ ...p, amount: undefined })); }}
                      error={!!disbErrors.amount}
                      className="pl-7"
                    />
                  </div>
                  <div className="w-full shrink-0 sm:w-40">
                    <Input
                      type="date"
                      title="Disbursement date"
                      value={disbDate}
                      onChange={(e) => { setDisbDate(e.target.value); setDisbErrors((p) => ({ ...p, date: undefined })); }}
                      error={!!disbErrors.date}
                    />
                  </div>
                  <Input
                    type="text" placeholder="Ref # *"
                    value={disbRef}
                    onChange={(e) => { setDisbRef(e.target.value); setDisbErrors((p) => ({ ...p, ref: undefined })); }}
                    error={!!disbErrors.ref}
                    className="min-w-40 flex-1"
                  />
                  <div className="w-full shrink-0 sm:w-52">
                    <Select
                      value={disbType}
                      onChange={(e) => {
                        setDisbType(e.target.value as "" | DisbursementTypeValue);
                        setDisbErrors((p) => ({ ...p, type: undefined }));
                      }}
                      className={disbErrors.type ? "border-red-300" : ""}
                    >
                      <option value="">Select Type</option>
                      {(
                        MODE_TO_DISBURSEMENT_TYPES[
                          modeOfImplementation as keyof typeof MODE_TO_DISBURSEMENT_TYPES
                        ] ?? []
                      ).map((t) => (
                        <option key={t} value={t}>{DISBURSEMENT_TYPE_LABEL[t]}</option>
                      ))}
                    </Select>
                  </div>
                  <button
                    type="button" onClick={handleRecordDisbursement}
                    disabled={recordDisbursement.isPending}
                    className="rounded-sm bg-blue-900 px-8 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blue-800 disabled:opacity-50"
                  >
                    {recordDisbursement.isPending ? "..." : "Record"}
                  </button>
                </div>
                {(disbErrors.amount ?? disbErrors.date ?? disbErrors.ref ?? disbErrors.type) && (
                  <div className="mt-1 space-y-0.5">
                    {disbErrors.amount && <p className="text-xs text-red-500">{disbErrors.amount}</p>}
                    {disbErrors.date && <p className="text-xs text-red-500">{disbErrors.date}</p>}
                    {disbErrors.ref && <p className="text-xs text-red-500">{disbErrors.ref}</p>}
                    {disbErrors.type && <p className="text-xs text-red-500">{disbErrors.type}</p>}
                  </div>
                )}
              </div>

              {/* Revised Contract Cost History */}
              <div className="mt-6">
                <FieldLabel>Revised Contract Cost History</FieldLabel>
                <div
                  className="overflow-auto rounded-sm border border-gray-200"
                  style={{ maxHeight: "268px" }}
                >
                  <table className="w-full min-w-200 border-separate border-spacing-0 text-xs">
                    <thead className="sticky top-0 z-10 bg-gray-50">
                      <tr className="[&>th]:border-b [&>th]:border-gray-100">
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Date</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Original Cost</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Source of Fund</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Program</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Project</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Variation Order</th>
                        <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">Revised Total</th>
                        <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {variationOrders && variationOrders.length > 0 ? (() => {
                        let running = project.projectCost ?? 0;
                        return variationOrders.map((v) => {
                          const original = running;
                          running += v.amount;
                          return (
                            <tr key={v.id} className="hover:bg-gray-50/50">
                              <td className="px-3 py-2.5 text-gray-600">{fmt(v.date)}</td>
                              <td className="px-3 py-2.5 text-gray-700">{original.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
                              <td className="px-3 py-2.5 text-gray-700">{v.sourceOfFund ? SOURCE_OF_FUND_LABEL[v.sourceOfFund] : "—"}</td>
                              <td className="px-3 py-2.5 text-gray-700">
                                {programLabel(v.program)}
                              </td>
                              <td className="px-3 py-2.5 text-gray-700">
                                {projectLabel(v.subType)}
                              </td>
                              <td className="px-3 py-2.5 text-gray-700">{v.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
                              <td className="px-3 py-2.5 text-right font-semibold text-gray-900">{running.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
                              <td className="px-3 py-2.5 text-right">
                                <button
                                  type="button"
                                  onClick={() =>
                                    startEditVariationOrder({
                                      id: v.id,
                                      amount: v.amount,
                                      sourceOfFund: (v.sourceOfFund as SourceOfFundValue | null) ?? null,
                                      program: v.program,
                                      subType: v.subType,
                                    })
                                  }
                                  className="text-gray-400 transition hover:text-blue-600"
                                  aria-label="Edit variation order"
                                >
                                  <EditIcon />
                                </button>
                              </td>
                            </tr>
                          );
                        });
                      })() : (
                        <tr><td colSpan={8} className="px-3 py-6 text-center text-gray-400">No variation orders recorded yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Record / edit form */}
                <div className="mt-3 flex flex-wrap gap-2 rounded-sm border border-gray-200 p-3">
                  <div className="relative w-full shrink-0 sm:w-36">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₱</span>
                    <Input
                      type="text"
                      disabled
                      value={currentRevisedTotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                      aria-label="Contract Cost"
                      className="pl-7 disabled:bg-gray-50 disabled:text-gray-400"
                    />
                  </div>
                  <div className="w-full shrink-0 sm:w-40">
                    <Select
                      value={revisedSourceOfFund}
                      onChange={(e) => {
                        setRevisedSourceOfFund(e.target.value as SourceOfFundValue | "");
                        setRevisedProgram("");
                        setRevisedProject("");
                      }}
                    >
                      <option value="">Source of Fund</option>
                      {SOURCE_OF_FUND_ORDER.map((k) => (
                        <option key={k} value={k}>
                          {SOURCE_OF_FUND_LABEL[k]}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="w-full shrink-0 sm:w-40">
                    <Select
                      value={revisedProgram}
                      onChange={(e) => {
                        setRevisedProgram(e.target.value);
                        setRevisedProject("");
                      }}
                      disabled={!revisedSourceOfFund || voPrograms.length === 0}
                    >
                      <option value="">Select Program</option>
                      {voPrograms.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}{o.custom ? " (added)" : ""}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="w-full shrink-0 sm:w-40">
                    <Select
                      value={revisedProject}
                      onChange={(e) => setRevisedProject(e.target.value)}
                      disabled={!revisedProgram || voProjects.length === 0}
                    >
                      <option value="">Select Project</option>
                      {voProjects.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}{o.custom ? " (added)" : ""}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="relative min-w-32 flex-1">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₱</span>
                    <Input
                      type="text" inputMode="decimal" placeholder="Variation"
                      value={revisedVariation}
                      onChange={(e) => { handleAmountChange(e.target, setRevisedVariation); setVariationError(null); }}
                      error={!!variationError}
                      className="pl-7"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRecordVariationOrder}
                    disabled={recordVariationOrder.isPending || updateVariationOrder.isPending}
                    className="rounded-sm bg-blue-900 px-8 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blue-800 disabled:opacity-50"
                  >
                    {recordVariationOrder.isPending || updateVariationOrder.isPending
                      ? "..."
                      : editingVoId
                        ? "Update"
                        : "Record"}
                  </button>
                  {editingVoId && (
                    <button
                      type="button"
                      onClick={resetVariationForm}
                      className="rounded-sm border border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                {variationError && <p className="mt-1 text-xs text-red-500">{variationError}</p>}
              </div>
            </div>
          </SectionCard>

          {/* ── Project Timeline ── */}
          <SectionCard>
            <SectionHeader
              icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>}
              title="Project Timeline"
              action={<button type="button" className="text-gray-400 hover:text-gray-600"><EditIcon /></button>}
            />
            <div className="p-4">
              <FieldLabel>Timeline Adjustment History</FieldLabel>
              <div
                className="overflow-auto rounded-sm border border-gray-200"
                style={{ maxHeight: "392px" }}
              >
                <table className="w-full min-w-160 border-separate border-spacing-0 text-xs">
                  <thead className="sticky top-0 z-10 bg-gray-50">
                    <tr className="[&>th]:border-b [&>th]:border-gray-100">
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Start Date</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">End Date</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Duration</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Adjustment Type</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Justification Record</th>
                      <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {timelineAdjustments && timelineAdjustments.length > 0 ? timelineAdjustments.map((a) => {
                      const cfg = TIMELINE_ADJ_TYPE_CONFIG[a.type] ?? { label: a.type, badge: "bg-gray-50 text-gray-600 border-gray-200" };
                      const isEditing = editingAdjId === a.id;
                      const isSaving = isEditing && updateTimelineAdjustment.isPending;
                      return (
                        <tr key={a.id} className={isEditing ? "bg-blue-50/40" : "hover:bg-gray-50/50"}>
                          <td className="px-3 py-2.5 text-gray-600">
                            {isEditing ? (
                              <Input
                                type="date"
                                value={adjDraft.startDate}
                                onChange={(e) => setAdjDraft((d) => ({ ...d, startDate: e.target.value }))}
                                className="w-36"
                                error={!adjDraft.startDate}
                              />
                            ) : (
                              fmt(a.startDate)
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-gray-600">
                            {isEditing ? (
                              <Input
                                type="date"
                                value={adjDraft.endDate}
                                onChange={(e) => setAdjDraft((d) => ({ ...d, endDate: e.target.value }))}
                                className="w-36"
                                error={!adjDraft.endDate}
                              />
                            ) : (
                              fmt(a.endDate)
                            )}
                          </td>
                          <td className="px-3 py-2.5 font-semibold text-gray-800">
                            {isEditing ? (
                              <Input
                                type="number"
                                min={0}
                                value={adjDraft.duration}
                                onChange={(e) => setAdjDraft((d) => ({ ...d, duration: e.target.value }))}
                                placeholder="0"
                                className="w-20"
                                error={adjDraft.duration.trim() === ""}
                              />
                            ) : (
                              `${a.duration} Days`
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            {isEditing ? (
                              <Select
                                value={adjDraft.type}
                                onChange={(e) =>
                                  setAdjDraft((d) => ({ ...d, type: e.target.value as typeof d.type }))
                                }
                                className={`w-36 ${!adjDraft.type ? "border-red-300" : ""}`}
                              >
                                <option value="">Type</option>
                                {/* A legacy type stays listed only on the row that already has it. */}
                                {Object.entries(TIMELINE_ADJ_TYPE_CONFIG)
                                  .filter(([value, { legacy }]) => !legacy || value === a.type)
                                  .map(([value, { label }]) => (
                                    <option key={value} value={value}>{label}</option>
                                  ))}
                              </Select>
                            ) : (
                              <span className={`inline-flex rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}>{cfg.label}</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 italic text-gray-600">
                            {isEditing ? (
                              <Input
                                type="text"
                                value={adjDraft.justification}
                                onChange={(e) => setAdjDraft((d) => ({ ...d, justification: e.target.value }))}
                                placeholder="Justification / Basis..."
                              />
                            ) : (
                              a.justification ?? "—"
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center justify-end gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => saveEditAdjustment(a.id)}
                                    disabled={isSaving}
                                    className="rounded-sm bg-blue-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {isSaving ? "Saving..." : "Save"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingAdjId(null);
                                      setAdjRowError(null);
                                    }}
                                    disabled={isSaving}
                                    className="rounded-sm border border-gray-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 transition hover:bg-gray-50 disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => startEditAdjustment(a)}
                                    disabled={editingAdjId !== null}
                                    className="text-gray-300 transition hover:text-blue-600 disabled:opacity-50"
                                    aria-label="Edit timeline adjustment"
                                  >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteTimelineAdjustment.mutate({ id: a.id })}
                                    disabled={deleteTimelineAdjustment.isPending || editingAdjId !== null}
                                    className="text-gray-300 transition hover:text-red-500 disabled:opacity-50"
                                    aria-label="Remove timeline adjustment"
                                  >
                                    ×
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-400">No timeline adjustments recorded yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              {adjRowError && <p className="mt-2 text-xs text-red-500">{adjRowError}</p>}

              {/* Record form — with labels */}
              <div className="mt-3 flex flex-wrap items-end gap-2">
                <div className="w-full shrink-0 sm:w-40">
                  <FieldLabel>Start Date</FieldLabel>
                  <Input type="date" value={dateStarted} onChange={(e) => { setDateStarted(e.target.value); setAdjError(null); }} error={!!adjError && !dateStarted} />
                </div>
                <div className="w-full shrink-0 sm:w-40">
                  <FieldLabel>End Date</FieldLabel>
                  <Input type="date" value={targetCompletion} onChange={(e) => { setTargetCompletion(e.target.value); setAdjError(null); }} error={!!adjError && !targetCompletion} />
                </div>
                <div className="w-full shrink-0 sm:w-40">
                  <FieldLabel>Revised Target Completion</FieldLabel>
                  <Input type="date" value={revisedCompletion} onChange={(e) => setRevisedCompletion(e.target.value)} />
                </div>
                <div className="w-full shrink-0 sm:w-24">
                  <FieldLabel>Duration</FieldLabel>
                  <Input type="number" min={0} placeholder="0" value={adjDays} onChange={(e) => { setAdjDays(e.target.value); setAdjError(null); }} error={!!adjError && !adjDays} />
                </div>
                <div className="w-full shrink-0 sm:w-40">
                  <FieldLabel>Type</FieldLabel>
                  <Select
                    value={adjType}
                    onChange={(e) => { setAdjType(e.target.value as typeof adjType); setAdjError(null); }}
                    className={adjError && !adjType ? "border-red-300" : ""}
                  >
                    <option value="">Type</option>
                    {Object.entries(TIMELINE_ADJ_TYPE_CONFIG)
                      .filter(([, { legacy }]) => !legacy)
                      .map(([value, { label }]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                  </Select>
                </div>
                <div className="min-w-full flex-1 sm:min-w-48">
                  <FieldLabel>Justification / Basis</FieldLabel>
                  <Input type="text" placeholder="Justification / Basis..." value={adjJustification} onChange={(e) => setAdjJustification(e.target.value)} />
                </div>
                <button
                  type="button"
                  onClick={handleRecordTimelineAdjustment}
                  disabled={recordTimelineAdjustment.isPending}
                  className="rounded-sm bg-blue-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blue-800 disabled:opacity-50"
                >
                  {recordTimelineAdjustment.isPending ? "..." : "Record"}
                </button>
              </div>
              {adjError && <p className="mt-1 text-xs text-red-500">{adjError}</p>}
            </div>
          </SectionCard>

          {/* ── Slippage ── */}
          <SectionCard>
            <SectionHeader
              icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" /></svg>}
              title="Slippage"
            />
            <div className="p-4">
              <div className="flex flex-wrap items-end gap-4">
                {/* Live readout — actual minus target, with its stage */}
                <div
                  className={`flex min-w-70 flex-1 items-center justify-between gap-4 rounded-sm border px-4 py-3 ${slippageStage ? slippageStage.tile : "border-gray-200 bg-gray-50"
                    }`}
                >
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${slippageStage ? slippageStage.text : "text-gray-400"}`}>
                      Slippage
                    </p>
                    <p className={`mt-0.5 text-3xl font-extrabold ${slippageStage ? slippageStage.text : "text-gray-300"}`}>
                      {slippage !== null ? formatSlippage(slippage) : "—"}
                      <span className="ml-0.5 text-base font-bold">%</span>
                    </p>
                  </div>
                  {slippageStage && (
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${slippageStage.badge}`}>
                      {slippageStage.label}
                    </span>
                  )}
                </div>

                <div className="w-full shrink-0 sm:w-40">
                  <FieldLabel>Assessment Date</FieldLabel>
                  <Input
                    type="date"
                    value={slippageDate}
                    onChange={(e) => { setSlippageDate(e.target.value); setSlippageError(null); }}
                    error={!!slippageError && !slippageDate}
                  />
                </div>

                <div className="w-full shrink-0 sm:w-40">
                  <FieldLabel>Target %</FieldLabel>
                  <div className="relative">
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={slippageTargetInput}
                      onChange={(e) => { setSlippageTargetInput(e.target.value); setSlippageError(null); }}
                      placeholder="0.00"
                      className="pr-8"
                      error={slippageTargetInput.trim() !== "" && slippageTarget === null}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-400">%</span>
                  </div>
                </div>

                <div className="w-full shrink-0 sm:w-40">
                  <FieldLabel>Actual %</FieldLabel>
                  <div className="relative">
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={slippageActualInput}
                      onChange={(e) => { setSlippageActualInput(e.target.value); setSlippageError(null); }}
                      placeholder="0.00"
                      className="pr-8"
                      error={slippageActualInput.trim() !== "" && slippageActual === null}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-400">%</span>
                  </div>
                </div>

                {/* Revision counter — advanced by Save, never typed */}
                <div className="w-full shrink-0 sm:w-32">
                  <FieldLabel>Revision</FieldLabel>
                  <div className="rounded-sm border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                    Rev. {isSlippageDirty && savedSlippageKey !== null ? slippageRevision + 1 : slippageRevision}
                  </div>
                </div>

                <div className="min-w-full flex-1 sm:min-w-48">
                  <FieldLabel>Remarks</FieldLabel>
                  <Input
                    type="text"
                    value={slippageRemarks}
                    onChange={(e) => setSlippageRemarks(e.target.value)}
                    placeholder="Remarks / basis of assessment..."
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveSlippage}
                  disabled={!isSlippageDirty || updateSlippage.isPending}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-sm bg-blue-900 px-6 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updateSlippage.isPending ? "Saving..." : "Save"}
                </button>
              </div>

              {slippageError && <p className="mt-2 text-xs text-red-500">{slippageError}</p>}

              {/* Prescribed action for the current stage / save state */}
              {slippageStage && (
                <p className="mt-3 text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">{slippageStage.label}:</span>{" "}
                  {slippageStage.action}
                  {savedSlippageKey !== null && !isSlippageDirty && (
                    <span className="ml-1 text-gray-400">— filed as Rev. {slippageRevision}.</span>
                  )}
                </p>
              )}

              {/* Slippage history — one row per assessment filed on this project */}
              <div className="mt-5">
                <FieldLabel>Slippage History</FieldLabel>
                <div
                  className="overflow-auto rounded-sm border border-gray-200"
                  style={{ maxHeight: "392px" }}
                >
                  <table className="w-full min-w-160 border-separate border-spacing-0 text-xs">
                    <thead className="sticky top-0 z-10 bg-gray-50">
                      <tr className="[&>th]:border-b [&>th]:border-gray-100">
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Date</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Target %</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Actual %</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Slippage (%)</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Remarks</th>
                        <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {slippageAssessments && slippageAssessments.length > 0 ? slippageAssessments.map((entry) => {
                        const isEditing = editingSlippageId === entry.id;
                        // An edited row previews its own draft figures.
                        const target = isEditing ? parsePercent(slippageDraft.target) : entry.target;
                        const actual = isEditing ? parsePercent(slippageDraft.actual) : entry.actual;
                        const value =
                          target !== null && actual !== null ? computeSlippage(target, actual) : null;
                        const cfg = value !== null ? getSlippageStageConfig(value) : null;
                        const isSaving = isEditing && updateSlippageAssessment.isPending;
                        return (
                          <tr key={entry.id} className={isEditing ? "bg-blue-50/40" : "hover:bg-gray-50/50"}>
                            <td className="px-3 py-2.5 text-gray-600">
                              {isEditing ? (
                                <Input
                                  type="date"
                                  value={slippageDraft.date}
                                  onChange={(e) => setSlippageDraft((d) => ({ ...d, date: e.target.value }))}
                                  className="w-36"
                                  error={!slippageDraft.date}
                                />
                              ) : (
                                fmt(entry.date)
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-gray-600">
                              {isEditing ? (
                                <Input
                                  type="text"
                                  inputMode="decimal"
                                  value={slippageDraft.target}
                                  onChange={(e) => setSlippageDraft((d) => ({ ...d, target: e.target.value }))}
                                  placeholder="0.00"
                                  className="w-20"
                                  error={target === null}
                                />
                              ) : (
                                `${entry.target.toFixed(2)}%`
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-gray-600">
                              {isEditing ? (
                                <Input
                                  type="text"
                                  inputMode="decimal"
                                  value={slippageDraft.actual}
                                  onChange={(e) => setSlippageDraft((d) => ({ ...d, actual: e.target.value }))}
                                  placeholder="0.00"
                                  className="w-20"
                                  error={actual === null}
                                />
                              ) : (
                                `${entry.actual.toFixed(2)}%`
                              )}
                            </td>
                            <td className={`px-3 py-2.5 font-bold ${cfg ? cfg.text : "text-gray-300"}`}>
                              {value !== null ? `${formatSlippage(value)}%` : "—"}
                            </td>
                            <td className="px-3 py-2.5 text-gray-600">
                              {isEditing ? (
                                <Input
                                  type="text"
                                  value={slippageDraft.remarks}
                                  onChange={(e) => setSlippageDraft((d) => ({ ...d, remarks: e.target.value }))}
                                  placeholder="Remarks / basis of assessment..."
                                />
                              ) : (
                                entry.remarks ?? "—"
                              )}
                            </td>
                            <td className="px-3 py-2.5">
                              <div className="flex items-center justify-end gap-2">
                                {isEditing ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => saveEditSlippage(entry.id)}
                                      disabled={isSaving}
                                      className="rounded-sm bg-blue-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {isSaving ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingSlippageId(null);
                                        setSlippageRowError(null);
                                      }}
                                      disabled={isSaving}
                                      className="rounded-sm border border-gray-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 transition hover:bg-gray-50 disabled:opacity-50"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => startEditSlippage(entry)}
                                      disabled={editingSlippageId !== null}
                                      className="text-gray-300 transition hover:text-blue-600 disabled:opacity-50"
                                      aria-label="Edit slippage assessment"
                                    >
                                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
                                      </svg>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => deleteSlippageAssessment.mutate({ id: entry.id })}
                                      disabled={deleteSlippageAssessment.isPending || editingSlippageId !== null}
                                      className="text-gray-300 transition hover:text-red-500 disabled:opacity-50"
                                      aria-label="Remove slippage assessment"
                                    >
                                      ×
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      }) : (
                        <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-400">No slippage assessment has been filed yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {slippageRowError && (
                  <p className="mt-2 text-xs text-red-500">{slippageRowError}</p>
                )}
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
          </SectionCard>

          {/* ── Workforce Distribution + Project In-Charge & Profile ── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Workforce Distribution */}
            <SectionCard className="lg:col-span-2">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-700">Workforce Distribution</span>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-500">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                  </span>
                  Live
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3">
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
            </SectionCard>

            {/* Project In-Charge & Profile */}
            <SectionCard className="lg:col-span-3">
              <SectionHeader
                icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>}
                title="Project In-Charge & Profile"
              />
              <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
                {/* Engineers */}
                <div>
                  <FieldLabel>Engineers In-Charge</FieldLabel>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {engineers.map((eng) =>
                      editingEngineer === eng ? (
                        <span key={eng} className="flex items-center gap-1.5 rounded-full border border-blue-400 bg-white px-3 py-1 text-xs font-semibold text-blue-700 ring-2 ring-blue-400/20">
                          <input
                            autoFocus
                            type="text"
                            value={editingEngineerValue}
                            onChange={(e) => setEditingEngineerValue(e.target.value)}
                            onBlur={commitEditEngineer}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") { e.preventDefault(); commitEditEngineer(); }
                              if (e.key === "Escape") { e.preventDefault(); cancelEditEngineer(); }
                            }}
                            aria-label={`Rename ${eng}`}
                            style={{ width: `${Math.max(6, editingEngineerValue.length + 1)}ch` }}
                            className="bg-transparent text-xs font-semibold text-blue-700 focus:outline-none"
                          />
                          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={commitEditEngineer} title="Save" className="text-blue-400 hover:text-blue-600">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          </button>
                        </span>
                      ) : (
                        <span key={eng} className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          <button type="button" onClick={() => startEditEngineer(eng)} title="Click to edit" className="hover:underline">
                            {eng}
                          </button>
                          <button type="button" onClick={() => startEditEngineer(eng)} title="Edit engineer" className="text-blue-400 hover:text-blue-600">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                            </svg>
                          </button>
                          <button type="button" onClick={() => removeEngineer(eng)} title="Remove engineer" className="text-blue-400 hover:text-blue-600">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ),
                    )}
                    <div className="flex gap-1.5">
                      <input
                        ref={engineerRef}
                        type="text"
                        value={engineerInput}
                        onChange={(e) => setEngineerInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addEngineer(); } }}
                        placeholder="Add engineer..."
                        className="w-32 rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs text-gray-600 placeholder:text-gray-300 focus:border-blue-400 focus:outline-none"
                      />
                      <button
                        type="button" onClick={addEngineer}
                        className="rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs font-semibold text-gray-500 hover:border-blue-400 hover:text-blue-600"
                      >
                        + Add Engineer
                      </button>
                    </div>
                  </div>
                </div>
                {/* Project Profile */}
                <div>
                  <FieldLabel>Project Profile</FieldLabel>
                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the scope of work, deliverables, and methodology..."
                    className="mt-1 block w-full resize-none rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  />
                </div>
              </div>
            </SectionCard>
          </div>

          {/* ── Project Documentation ── */}
          <SectionCard>
            <SectionHeader
              icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>}
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
            <div className="p-4 sm:p-5">
              {uploadError && !isDocModalOpen && (
                <div className="mb-3 flex items-center gap-2 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                  {uploadError}
                  <button type="button" onClick={() => setUploadError(null)} className="ml-auto">✕</button>
                </div>
              )}
              {deleteNotice && (
                <div className="mb-3 flex items-center gap-2 rounded-sm border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                  <svg className="h-4 w-4 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  {deleteNotice}
                  <button type="button" onClick={() => setDeleteNotice(null)} className="ml-auto text-green-400 hover:text-green-600">✕</button>
                </div>
              )}
              <div className="grid gap-5 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
                {/* Document checklist — ticked by the category each file is filed under */}
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
                          <span className={`text-sm leading-snug ${done ? "font-semibold text-gray-900" : "text-gray-600"}`}>
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
                    {!projectFiles?.length && (
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
                    {projectFiles?.map((f) => {
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
                              <a href={f.fileUrl} target="_blank" rel="noopener noreferrer" className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600" aria-label="Preview">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                              </a>
                              <a href={f.fileUrl} download={f.fileName} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600" aria-label="Download">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                              </a>
                              <button
                                type="button"
                                onClick={() => { if (confirm(`Delete "${f.fileName}"?`)) deleteProjectFile.mutate({ id: f.id }); }}
                                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                                aria-label="Delete"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                              </button>
                            </div>
                          </div>
                          <select
                            value={resolveDocType(f)}
                            onChange={(e) => changeDocType(f, e.target.value as DocType)}
                            aria-label={`Document type for ${f.fileName}`}
                            className="w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          >
                            {DOC_CHECKLIST.map((item) => (
                              <option key={item.key} value={item.key}>{item.label}</option>
                            ))}
                            <option value="OTHER">Other</option>
                          </select>
                          <p className="text-xs text-gray-500">
                            {fmt(f.createdAt)} &middot; {f.createdBy.name ?? f.createdBy.email}
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
                        {!projectFiles?.length && (
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
                        {projectFiles?.map((f) => {
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
                                  value={resolveDocType(f)}
                                  onChange={(e) => changeDocType(f, e.target.value as DocType)}
                                  aria-label={`Document type for ${f.fileName}`}
                                  className="max-w-45 truncate rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                  {DOC_CHECKLIST.map((item) => (
                                    <option key={item.key} value={item.key}>{item.label}</option>
                                  ))}
                                  <option value="OTHER">Other</option>
                                </select>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-600">{fmt(f.createdAt)}</td>
                              <td className="px-4 py-3 text-gray-600">{f.createdBy.name ?? f.createdBy.email}</td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <a href={f.fileUrl} target="_blank" rel="noopener noreferrer" className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600" aria-label="Preview">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                                  </a>
                                  <a href={f.fileUrl} download={f.fileName} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600" aria-label="Download">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => { if (confirm(`Delete "${f.fileName}"?`)) deleteProjectFile.mutate({ id: f.id }); }}
                                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                                    aria-label="Delete"
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
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
            </div>

            <UploadDocumentModal
              open={isDocModalOpen}
              onClose={closeDocModal}
              onSubmit={handleDocumentsUpload}
              isUploading={isUploadingDoc}
              initialFiles={docModalFiles}
              uploadError={uploadError}
            />
          </SectionCard>

        </div>

        {/* ════════════════════════════════
            RIGHT  —  Activity Log (sticky)
        ════════════════════════════════ */}
        <div className="w-full shrink-0 xl:w-lg">
          <div className="space-y-3 xl:sticky xl:top-5">
            {/* Status badge */}
            <div className={`flex items-center gap-2 rounded-sm border px-4 py-3 ${statusCfg.badge}`}>
              <span className={`h-2 w-2 rounded-full ${statusCfg.dot}`} />
              <span className="text-xs font-bold">{statusCfg.label}</span>
              <span className="ml-auto font-mono text-[10px] text-gray-400">{project.projectCode}</span>
            </div>
            <SectionCard style={{ maxHeight: "calc(100vh - 6rem)" } as React.CSSProperties}>
              <SectionHeader
                icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
                title="Project History & Activity Log"
                action={activities?.length ? (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600">{activities.length}</span>
                ) : undefined}
              />

              <div className="flex flex-col" style={{ maxHeight: "calc(100vh - 10rem)" }}>
                {/* New comment */}
                <div className="shrink-0 border-b border-gray-100 p-4">
                  <FieldLabel>Add Activity / Comment</FieldLabel>
                  <textarea
                    rows={3} value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Log a site visit, milestone, or note..."
                    className="mt-1 block w-full resize-none rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  />
                  <button
                    type="button" onClick={() => { if (comment.trim()) addActivity.mutate({ projectId, description: comment.trim() }); }}
                    disabled={addActivity.isPending || !comment.trim()}
                    className="mt-2 w-full rounded-sm bg-gray-900 py-2 text-xs font-bold                                                                                                                                                                                           uppercase tracking-widest text-white transition hover:bg-gray-700 disabled:opacity-40"
                  >
                    {addActivity.isPending ? "Posting..." : "Post Comment"}
                  </button>
                </div>

                {/* Activity list */}
                <div className="flex-1 overflow-y-auto p-4">
                  {activities && activities.length > 0 ? (
                    <div className="space-y-3">
                      {activities.map((a, idx) => {
                        const displayName = a.createdBy.name ?? a.createdBy.email ?? "Unknown";
                        const initial = displayName.charAt(0).toUpperCase();
                        return (
                          <div key={a.id} className={`rounded-sm p-3 ${idx === 0 ? "bg-blue-50 ring-1 ring-blue-100" : "bg-gray-50"}`}>
                            <div className="flex items-start gap-2.5">
                              {a.createdBy.image ? (
                                <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
                                  <Image src={a.createdBy.image} alt={displayName} fill className="object-cover" />
                                </div>
                              ) : (
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">{initial}</div>
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-semibold text-blue-700">{displayName}</span>
                                  {idx === 0 && <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">Latest</span>}
                                </div>
                                <p className="mt-1 text-xs leading-relaxed text-gray-700">{a.description}</p>
                                <p className="mt-1.5 text-[10px] text-gray-400">
                                  {new Date(a.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}{" "}
                                  · {new Date(a.createdAt).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit", hour12: true })}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      </div>
                      <p className="mt-2 text-xs font-medium text-gray-500">No activity yet</p>
                      <p className="mt-1 text-[10px] text-gray-400">Add the first comment above</p>
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

      </div>

      {/* ── Fixed bottom action bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] sm:px-8">
        <div className="flex flex-wrap items-center justify-end gap-3">
          {updateProject.isError && (
            <p className="w-full text-xs text-red-600 sm:mr-auto sm:w-auto">{updateProject.error.message}</p>
          )}
          <Link
            href={`/admin/projects/${projectId}`}
            className="shrink-0 whitespace-nowrap rounded-sm border border-gray-200 bg-white px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-gray-600 transition hover:bg-gray-50 sm:px-6 sm:tracking-widest"
          >
            Cancel Changes
          </Link>
          <button
            type="button"
            onClick={handleSaveChanges}
            // Saving mid-upload would persist the gallery without the photo
            // that is still in flight.
            disabled={updateProject.isPending || isUploadingMedia}
            className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-blue-600 px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 sm:flex-initial sm:px-6 sm:tracking-widest"
          >
            {updateProject.isPending ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            )}
            Commit &amp; Save Changes
          </button>
        </div>
      </div>

      {/* spacer so content isn't hidden behind fixed bar */}
      <div className="h-16" />
    </div>
  );
}
