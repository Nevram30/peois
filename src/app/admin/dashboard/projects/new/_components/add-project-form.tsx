"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useRef } from "react";
import { api } from "~/trpc/react";
import { useUploadThing } from "~/lib/uploadthing";
import {
  SOURCE_OF_FUND_LABEL,
  SOURCE_OF_FUND_ORDER,
  PROJECT_SUB_TYPE_LABEL,
  SOURCE_TO_SUB_TYPES,
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_ORDER,
  type SourceOfFundValue,
  type ProjectSubTypeValue,
  type ProjectStatusValue,
} from "~/lib/fund-constants";
import {
  getMunicipalitiesByDistrict,
  getBarangaysByMunicipality,
} from "~/lib/davao-del-norte-locations";

// ─── Shared styles ────────────────────────────────────────────────────────
const inputClass =
  "block w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none";
const labelClass =
  "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-500";
const cardClass = "rounded-xl border border-gray-200 bg-white shadow-sm";
const errorRingClass =
  "border-red-400 focus:border-red-500 focus:ring-red-500/20";

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

type ProjectFileType = "IMAGE" | "BLUEPRINT" | "REPORT" | "CONTRACT" | "PERMIT" | "OTHER";

type PendingFile = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: ProjectFileType;
  fileSize: number;
  uploadedAt: Date;
};

const FILE_TYPE_LABEL: Record<ProjectFileType, string> = {
  IMAGE: "Image",
  BLUEPRINT: "Blueprint",
  REPORT: "Report",
  CONTRACT: "Contract",
  PERMIT: "Permit",
  OTHER: "Other",
};

function inferFileType(file: File): ProjectFileType {
  if (file.type.startsWith("image/")) return "IMAGE";
  return "OTHER";
}

function fileIconColor(fileType: ProjectFileType, fileName: string) {
  if (fileType === "IMAGE") return { bg: "bg-blue-100", text: "text-blue-600" };
  if (fileName.toLowerCase().endsWith(".pdf"))
    return { bg: "bg-red-100", text: "text-red-600" };
  if (/\.(doc|docx)$/.exec(fileName.toLowerCase()))
    return { bg: "bg-emerald-100", text: "text-emerald-600" };
  return { bg: "bg-gray-100", text: "text-gray-600" };
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

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

function fmtInputDate(d: string) {
  return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function fileTypeBadge(fileType: ProjectFileType, fileName: string) {
  if (fileType === "IMAGE") return "IMAGE";
  if (fileName.toLowerCase().endsWith(".pdf")) return "PDF DOCUMENT";
  if (fileName.toLowerCase().endsWith(".docx")) return "DOCX WORD";
  if (fileName.toLowerCase().endsWith(".doc")) return "DOC WORD";
  return FILE_TYPE_LABEL[fileType].toUpperCase();
}

// ─── Section wrappers ─────────────────────────────────────────────────────
function SectionHeader({
  icon, title, action,
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
      <div className="flex items-center gap-2">
        <span className="text-blue-500">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-700">{title}</span>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

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
const BillIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
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

export function AddProjectForm() {
  const router = useRouter();
  const utils = api.useUtils();

  // ── Project Identity & Status ────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [projectCost, setProjectCost] = useState("0.00");
  // Contract Cost input is hidden from the UI; the value is still submitted.
  const [contractCost] = useState("0.00");
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

  // ── Funding & Disbursement Tracking ──────────────────────────────────
  const [sourceOfFund, setSourceOfFund] = useState<SourceOfFundValue | "">("");
  const [subType, setSubType] = useState("");
  const [budgetYear, setBudgetYear] = useState(String(new Date().getFullYear()));

  // ── Project Timeline ─────────────────────────────────────────────────
  const [dateStarted, setDateStarted] = useState("");
  const [targetCompletionDate, setTargetCompletionDate] = useState("");
  const [adjType, setAdjType] = useState<TimelineAdjType | "">("");
  const [adjJustification, setAdjJustification] = useState("");
  const [adjError, setAdjError] = useState<string | null>(null);
  const [pendingAdjustments, setPendingAdjustments] = useState<PendingAdjustment[]>([]);

  // ── Workforce Distribution ───────────────────────────────────────────
  const [numFemale, setNumFemale] = useState(0);
  const [numMale, setNumMale] = useState(0);

  // ── Responsibility & Scope ───────────────────────────────────────────
  const [engineers, setEngineers] = useState<string[]>([]);
  const [engineerInput, setEngineerInput] = useState("");
  const [description, setDescription] = useState("");

  // ── Project Image ────────────────────────────────────────────────────
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // ── Multi-file Project Documentation ─────────────────────────────────
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [docUploadError, setDocUploadError] = useState<string | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const docInputRef = useRef<HTMLInputElement>(null);

  // ── Validation ───────────────────────────────────────────────────────
  const [showErrors, setShowErrors] = useState(false);

  const { startUpload: startImageUpload, isUploading: isUploadingImage } =
    useUploadThing("imageUploader", {
      onClientUploadComplete: (res) => {
        const url = res[0]?.ufsUrl ?? res[0]?.url;
        if (url) {
          setImageUrl(url);
          setImagePreview(url);
        }
        setImageUploadError(null);
      },
      onUploadError: (err) => setImageUploadError(err.message),
    });

  const { startUpload: startFileUpload } = useUploadThing("projectFileUploader");

  // ── Derived values ───────────────────────────────────────────────────
  const duration = useMemo(() => {
    if (!dateStarted || !targetCompletionDate) return 0;
    const start = new Date(dateStarted);
    const end = new Date(targetCompletionDate);
    return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  }, [dateStarted, targetCompletionDate]);

  const totalWorkforce = numFemale + numMale;

  const availableMunicipalities = useMemo(
    () => getMunicipalitiesByDistrict(district as "DISTRICT_I" | "DISTRICT_II" | ""),
    [district],
  );
  const availableBarangays = useMemo(
    () => getBarangaysByMunicipality(cityMunicipality),
    [cityMunicipality],
  );
  const availableSubTypes = useMemo(
    () => (sourceOfFund ? SOURCE_TO_SUB_TYPES[sourceOfFund] : []),
    [sourceOfFund],
  );

  // ── Handlers ─────────────────────────────────────────────────────────
  const handleCostChange = (
    setter: (v: string) => void,
    value: string,
  ) => {
    const raw = value.replace(/[^0-9.]/g, "");
    setter(raw);
  };

  const handleCostBlur = (value: string, setter: (v: string) => void) => {
    const num = parseFloat(value.replace(/,/g, ""));
    if (!isNaN(num)) {
      setter(num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    } else {
      setter("0.00");
    }
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

  const handleImageChange = async (file: File) => {
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setImageUploadError(null);
    await startImageUpload([file]);
  };

  const handleFilesAdded = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setDocUploadError(null);
    setIsUploadingDoc(true);
    try {
      for (const file of Array.from(files)) {
        const result = await startFileUpload([file]);
        const url = result?.[0]?.ufsUrl ?? result?.[0]?.url;
        if (!url) continue;
        setPendingFiles((prev) => [
          ...prev,
          {
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            fileName: file.name,
            fileUrl: url,
            fileType: inferFileType(file),
            fileSize: file.size,
            uploadedAt: new Date(),
          },
        ]);
      }
    } catch (err) {
      setDocUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const removeFile = (id: string) =>
    setPendingFiles((prev) => prev.filter((f) => f.id !== id));

  const changeFileType = (id: string, fileType: ProjectFileType) =>
    setPendingFiles((prev) => prev.map((f) => (f.id === id ? { ...f, fileType } : f)));

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

  const createProject = api.project.create.useMutation({
    onSuccess: async (project) => {
      // Persist each uploaded document as a ProjectFile record, and each
      // queued timeline adjustment against the newly created project.
      await Promise.all([
        ...pendingFiles.map((f) =>
          createProjectFile.mutateAsync({
            projectId: project.id,
            fileName: f.fileName,
            fileUrl: f.fileUrl,
            fileType: f.fileType,
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
      ]);
      await utils.project.getAll.invalidate();
      router.push("/admin/dashboard/projects");
    },
  });

  // Required fields for a full submission (not draft). Every card is
  // validated except Project Documentation. Each key maps to the error
  // message shown beneath the input.
  const fieldErrors = useMemo(
    () => ({
      title: !title.trim(),
      image: !imageUrl,
      projectCost: !(parseFloat(projectCost.replace(/,/g, "")) > 0),
      trackingNumber: !trackingNumber.trim(),
      modeOfImplementation: !modeOfImplementation,
      contractorName:
        modeOfImplementation === "BY_CONTRACT" && !contractorName.trim(),
      district: !district,
      cityMunicipality: !cityMunicipality,
      barangay: !barangay,
      purok: !purok.trim(),
      sitio: !sitio.trim(),
      sourceOfFund: !sourceOfFund,
      subType: availableSubTypes.length > 0 && !subType,
      budgetYear: !budgetYear,
      dateStarted: !dateStarted,
      targetCompletionDate: !targetCompletionDate,
      dateOrder:
        !!dateStarted &&
        !!targetCompletionDate &&
        new Date(targetCompletionDate) < new Date(dateStarted),
      workforce: totalWorkforce < 1,
      engineers: engineers.length === 0,
      description: !description.trim(),
    }),
    [
      title,
      imageUrl,
      projectCost,
      trackingNumber,
      modeOfImplementation,
      contractorName,
      district,
      cityMunicipality,
      barangay,
      purok,
      sitio,
      sourceOfFund,
      subType,
      availableSubTypes,
      budgetYear,
      dateStarted,
      targetCompletionDate,
      totalWorkforce,
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
    createProject.mutate({
      title,
      subType: subType ? (subType as ProjectSubTypeValue) : null,
      modeOfImplementation: modeOfImplementation as "BY_ADMINISTRATION" | "BY_CONTRACT",
      locationImplementation: district as "DISTRICT_I" | "DISTRICT_II",
      sourceOfFund: sourceOfFund as SourceOfFundValue,
      projectCost: parseFloat(projectCost.replace(/,/g, "")) || 0,
      contractCost: parseFloat(contractCost.replace(/,/g, "")) || 0,
      completionPercentage: Math.max(0, Math.min(100, parseInt(completionPercentage) || 0)),
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
      description: description || undefined,
      status: isDraft ? "NOT_YET_STARTED" : status,
      imageUrl: imageUrl || undefined,
      projectCode: trackingNumber || undefined,
    });
  };

  // The submit button stays enabled even when required fields are empty so
  // that clicking it reveals the inline "This field is required" messages.
  // Validation itself is enforced in handleSubmit / fieldErrors.
  const isBusy =
    createProject.isPending || isUploadingImage || isUploadingDoc;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/admin/dashboard" className="hover:text-gray-700">Dashboard</Link>
        <span>/</span>
        <Link href="/admin/dashboard/projects" className="hover:text-gray-700">Projects</Link>
        <span>/</span>
        <span className="font-medium text-gray-900">Add New</span>
      </nav>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Project</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below to create a new engineering project record.
        </p>
      </div>

      <div className="space-y-6">
        {/* ── Row 1: Identity & Status (2/3) + Location (1/3) ─────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Project Identity & Status */}
          <section className={`${cardClass} lg:col-span-2`}>
            <SectionHeader icon={InfoIcon} title="Project Identity & Status" />
            <div className="flex flex-col gap-5 p-5 sm:flex-row">
              {/* Image uploader (square) */}
              <div className="shrink-0">
                <div
                  onClick={() => imageInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) void handleImageChange(file);
                  }}
                  className="group flex h-64 w-64 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagePreview} alt="Project" className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
                      </svg>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">No Image Uploaded</p>
                      <span className="rounded-md bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600 shadow-sm ring-1 ring-gray-200 group-hover:ring-blue-300">
                        ⬆ Upload Photo
                      </span>
                    </>
                  )}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleImageChange(file);
                    }}
                  />
                </div>
                {trackingNumber && (
                  <div className="mt-2 rounded-md bg-gray-900 px-3 py-1.5 text-center text-[10px] font-bold tracking-wider text-white">
                    #{trackingNumber}
                  </div>
                )}
                {isUploadingImage && (
                  <p className="mt-1 text-center text-[10px] text-blue-500">Uploading...</p>
                )}
                {imageUploadError && (
                  <p className="mt-1 text-center text-[10px] text-red-500">{imageUploadError}</p>
                )}
                {showErrors && fieldErrors.image && (
                  <p className="mt-1 text-center text-xs text-red-500">Project image is required</p>
                )}
              </div>

              {/* Right: fields */}
              <div className="flex-1 space-y-3">
                <div>
                  <label className={labelClass}>Project Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter project title"
                    className={`${inputClass} ${showErrors && fieldErrors.title ? errorRingClass : ""}`}
                  />
                  <FieldError show={showErrors && fieldErrors.title} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Project Cost <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">₱</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={projectCost}
                        onChange={(e) => handleCostChange(setProjectCost, e.target.value)}
                        onFocus={() => setProjectCost(projectCost.replace(/,/g, ""))}
                        onBlur={() => handleCostBlur(projectCost, setProjectCost)}
                        className={`${inputClass} pl-7 ${showErrors && fieldErrors.projectCost ? errorRingClass : ""}`}
                      />
                    </div>
                    <FieldError
                      show={showErrors && fieldErrors.projectCost}
                      message="Project cost must be greater than 0"
                    />
                  </div>
                  {/* Contract Cost field hidden from UI per request — kept in code for state/submission logic */}
                  {/* <div>
                    <label className={labelClass}>Contract Cost</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">₱</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={contractCost}
                        onChange={(e) => handleCostChange(setContractCost, e.target.value)}
                        onFocus={() => setContractCost(contractCost.replace(/,/g, ""))}
                        onBlur={() => handleCostBlur(contractCost, setContractCost)}
                        className={`${inputClass} pl-7`}
                      />
                    </div>
                  </div> */}
                  <div>
                    <label className={labelClass}>Current Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ProjectStatusValue)}
                      className={inputClass}
                    >
                      {PROJECT_STATUS_ORDER.filter((s) => s !== "NOT_YET_STARTED").map((s) => (
                        <option key={s} value={s}>{PROJECT_STATUS_LABEL[s]}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Track Number <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="PEO-2025-XXXXX"
                      className={`${inputClass} ${showErrors && fieldErrors.trackingNumber ? errorRingClass : ""}`}
                    />
                    <FieldError show={showErrors && fieldErrors.trackingNumber} />
                  </div>
                  <div>
                    <label className={labelClass}>Implementation Mode <span className="text-red-500">*</span></label>
                    <select
                      required
                      value={modeOfImplementation}
                      onChange={(e) => {
                        setModeOfImplementation(e.target.value);
                        if (e.target.value !== "BY_CONTRACT") setContractorName("");
                      }}
                      className={`${inputClass} ${showErrors && fieldErrors.modeOfImplementation ? errorRingClass : ""}`}
                    >
                      <option value="">Select Mode</option>
                      <option value="BY_ADMINISTRATION">By Administration</option>
                      <option value="BY_CONTRACT">By Contract</option>
                    </select>
                    <FieldError show={showErrors && fieldErrors.modeOfImplementation} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {modeOfImplementation === "BY_CONTRACT" ? (
                    <div>
                      <label className={labelClass}>Contractor Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={contractorName}
                        onChange={(e) => setContractorName(e.target.value)}
                        placeholder="Enter contractor name"
                        className={`${inputClass} ${showErrors && fieldErrors.contractorName ? errorRingClass : ""}`}
                      />
                      <FieldError show={showErrors && fieldErrors.contractorName} />
                    </div>
                  ) : (
                    <div />
                  )}
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className={labelClass}>Physical Progress</label>
                      <span className="text-xs font-semibold text-gray-400">
                        ({Math.max(0, Math.min(100, parseInt(completionPercentage) || 0))}%)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.max(0, Math.min(100, parseInt(completionPercentage) || 0))}
                      onChange={(e) => setCompletionPercentage(e.target.value)}
                      className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-gray-100 accent-blue-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Project Location */}
          <section className={cardClass}>
            <SectionHeader icon={PinIcon} title="Project Location" />
            <div className="space-y-3 p-5">
              <div>
                <label className={labelClass}>District <span className="text-red-500">*</span></label>
                <select
                  required
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setCityMunicipality("");
                    setBarangay("");
                    setPurok("");
                    setSitio("");
                  }}
                  className={`${inputClass} ${showErrors && fieldErrors.district ? errorRingClass : ""}`}
                >
                  <option value="">Select District</option>
                  <option value="DISTRICT_I">District 1</option>
                  <option value="DISTRICT_II">District 2</option>
                </select>
                <FieldError show={showErrors && fieldErrors.district} />
              </div>
              <div>
                <label className={labelClass}>Municipality / City <span className="text-red-500">*</span></label>
                <select
                  value={cityMunicipality}
                  onChange={(e) => {
                    setCityMunicipality(e.target.value);
                    setBarangay("");
                    setPurok("");
                    setSitio("");
                  }}
                  disabled={!district}
                  className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${showErrors && fieldErrors.cityMunicipality ? errorRingClass : ""}`}
                >
                  <option value="">Select Municipality</option>
                  {availableMunicipalities.map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
                <FieldError show={showErrors && fieldErrors.cityMunicipality} />
              </div>
              <div>
                <label className={labelClass}>Barangay <span className="text-red-500">*</span></label>
                <select
                  value={barangay}
                  onChange={(e) => {
                    setBarangay(e.target.value);
                    setPurok("");
                    setSitio("");
                  }}
                  disabled={!cityMunicipality}
                  className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${showErrors && fieldErrors.barangay ? errorRingClass : ""}`}
                >
                  <option value="">
                    {cityMunicipality ? "Select Barangay" : "Select Municipality first"}
                  </option>
                  {availableBarangays.map((bg) => (
                    <option key={bg.name} value={bg.name}>{bg.name}</option>
                  ))}
                </select>
                <FieldError show={showErrors && fieldErrors.barangay} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Purok <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={purok}
                    onChange={(e) => setPurok(e.target.value)}
                    placeholder="Enter Purok"
                    className={`${inputClass} ${showErrors && fieldErrors.purok ? errorRingClass : ""}`}
                  />
                  <FieldError show={showErrors && fieldErrors.purok} />
                </div>
                <div>
                  <label className={labelClass}>Sitio <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={sitio}
                    onChange={(e) => setSitio(e.target.value)}
                    placeholder="Enter Sitio"
                    className={`${inputClass} ${showErrors && fieldErrors.sitio ? errorRingClass : ""}`}
                  />
                  <FieldError show={showErrors && fieldErrors.sitio} />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── Funding & Disbursement Tracking ───────────────────────── */}
        <section className={cardClass}>
          <SectionHeader icon={BillIcon} title="Funding & Disbursement Tracking" />
          <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-[minmax(0,320px)_1fr]">
            {/* Left column — funding selects */}
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Source of Fund <span className="text-red-500">*</span></label>
                <select
                  required
                  value={sourceOfFund}
                  onChange={(e) => {
                    const next = e.target.value as SourceOfFundValue | "";
                    setSourceOfFund(next);
                    const allowed = next ? SOURCE_TO_SUB_TYPES[next] : [];
                    if (!allowed.includes(subType as ProjectSubTypeValue)) setSubType("");
                  }}
                  className={`${inputClass} ${showErrors && fieldErrors.sourceOfFund ? errorRingClass : ""}`}
                >
                  <option value="">Select Source</option>
                  {SOURCE_OF_FUND_ORDER.map((k) => (
                    <option key={k} value={k}>{SOURCE_OF_FUND_LABEL[k]}</option>
                  ))}
                </select>
                <FieldError show={showErrors && fieldErrors.sourceOfFund} />
              </div>
              <div>
                <label className={labelClass}>Fund Category <span className="text-red-500">*</span></label>
                <select
                  value={subType}
                  onChange={(e) => setSubType(e.target.value)}
                  disabled={!sourceOfFund || availableSubTypes.length === 0}
                  className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${showErrors && fieldErrors.subType ? errorRingClass : ""}`}
                >
                  <option value="">
                    {!sourceOfFund
                      ? "Select Source first"
                      : availableSubTypes.length === 0
                        ? "No sub-categories available"
                        : "Select Sub-Category"}
                  </option>
                  {availableSubTypes.map((k) => (
                    <option key={k} value={k}>{PROJECT_SUB_TYPE_LABEL[k]}</option>
                  ))}
                </select>
                <FieldError show={showErrors && fieldErrors.subType} />
              </div>
              <div>
                <label className={labelClass}>Budget Year <span className="text-red-500">*</span></label>
                <select
                  value={budgetYear}
                  onChange={(e) => setBudgetYear(e.target.value)}
                  className={`${inputClass} ${showErrors && fieldErrors.budgetYear ? errorRingClass : ""}`}
                >
                  <option value="">Select year</option>
                  {Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i)).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <FieldError show={showErrors && fieldErrors.budgetYear} />
              </div>
            </div>

            {/* Right column — tracking placeholders (available after project init) */}
            <div className="space-y-6">
              <div>
                <p className={labelClass}>Recent Disbursements</p>
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-10 text-center">
                  <span className="text-gray-300">{ClipboardClockIcon}</span>
                  <p className="mt-3 text-sm font-semibold text-gray-500">
                    Disbursement tracking will be available after project initialization.
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Awaiting system activation of financial module
                  </p>
                </div>
              </div>
              <div>
                <p className={labelClass}>Revised Contract Cost History</p>
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-10 text-center">
                  <span className="text-gray-300">{WalletIcon}</span>
                  <p className="mt-3 text-sm font-semibold text-gray-500">
                    Revised Contract tracking will be available after project initialization.
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    Awaiting system activation of financial module
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Project Timeline ──────────────────────────────────────── */}
        <section className={cardClass}>
          <SectionHeader icon={CalendarIcon} title="Project Timeline" />
          <div className="p-5">
            <label className={labelClass}>Timeline Adjustment History</label>
            <div className="overflow-y-auto rounded-lg border border-gray-200" style={{ maxHeight: "392px" }}>
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
                <label className={labelClass}>Start Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={dateStarted}
                  onChange={(e) => { setDateStarted(e.target.value); setAdjError(null); }}
                  className={`${inputClass} ${(adjError && !dateStarted) || (showErrors && fieldErrors.dateStarted) ? errorRingClass : ""}`}
                />
                <FieldError show={showErrors && fieldErrors.dateStarted} />
              </div>
              <div className="w-40 shrink-0">
                <label className={labelClass}>End Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={targetCompletionDate}
                  onChange={(e) => { setTargetCompletionDate(e.target.value); setAdjError(null); }}
                  className={`${inputClass} ${(adjError && !targetCompletionDate) || (showErrors && (fieldErrors.targetCompletionDate || fieldErrors.dateOrder)) ? errorRingClass : ""}`}
                />
                <FieldError show={showErrors && fieldErrors.targetCompletionDate} />
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
                className="rounded-lg bg-blue-900 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blue-800"
              >
                Record
              </button>
            </div>
            {adjError && <p className="mt-1 text-xs text-red-500">{adjError}</p>}
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
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5">
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
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5">
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
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3.5">
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
          <SectionHeader icon={FolderIcon} title="Project Documentation" />
          <div className="p-5">
            {/* Upload drop zone */}
            <div
              onClick={() => docInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                void handleFilesAdded(e.dataTransfer.files);
              }}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-6 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
              </svg>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-blue-600">Upload files</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">
                Blueprints, contracts, reports, images (PDF, DOC, DOCX, JPG, PNG)
              </p>
              {isUploadingDoc && <p className="text-xs text-blue-500">Uploading...</p>}
              {docUploadError && <p className="text-xs text-red-500">{docUploadError}</p>}
              <input
                ref={docInputRef}
                type="file"
                multiple
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
                className="hidden"
                onChange={(e) => void handleFilesAdded(e.target.files)}
              />
            </div>

            {/* Uploaded files table */}
            {pendingFiles.length > 0 && (
              <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">File Name</th>
                      <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Type</th>
                      <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Upload Date</th>
                      <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingFiles.map((f) => {
                      const colors = fileIconColor(f.fileType, f.fileName);
                      return (
                        <tr key={f.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`flex h-8 w-8 items-center justify-center rounded ${colors.bg}`}>
                                <svg className={`h-4 w-4 ${colors.text}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-sm text-gray-700">{f.fileName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={f.fileType}
                              onChange={(e) => changeFileType(f.id, e.target.value as ProjectFileType)}
                              className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                              {(Object.keys(FILE_TYPE_LABEL) as ProjectFileType[]).map((t) => (
                                <option key={t} value={t}>
                                  {t === f.fileType ? fileTypeBadge(t, f.fileName) : FILE_TYPE_LABEL[t].toUpperCase()}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{fmtDate(f.uploadedAt)}</td>
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
            )}
          </div>
        </section>

        {/* Error */}
        {showErrors && hasErrors && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Please complete all required fields highlighted above before submitting.
          </div>
        )}
        {createProject.isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {createProject.error.message}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 pb-8">
          <Link
            href="/admin/dashboard/projects"
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Cancel
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isBusy || !title}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isBusy}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
