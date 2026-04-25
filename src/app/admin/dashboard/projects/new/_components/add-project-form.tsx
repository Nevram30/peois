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
  getPuroksByBarangay,
  getSitiosByBarangay,
} from "~/lib/davao-del-norte-locations";

// ─── Shared styles ────────────────────────────────────────────────────────
const inputClass =
  "block w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none";
const labelClass =
  "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-500";
const cardClass = "rounded-xl border border-gray-200 bg-white shadow-sm";

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
  const [contractCost, setContractCost] = useState("0.00");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [modeOfImplementation, setModeOfImplementation] = useState("");
  const [contractorName, setContractorName] = useState("");
  const [status, setStatus] = useState<ProjectStatusValue>("FOR_IMPLEMENTATION");

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
  const [revisedCompletionDate, setRevisedCompletionDate] = useState("");

  // ── Workforce Distribution ───────────────────────────────────────────
  const [numFemale, setNumFemale] = useState("0");
  const [numMale, setNumMale] = useState("0");

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

  const totalWorkforce = useMemo(
    () => (parseInt(numFemale) || 0) + (parseInt(numMale) || 0),
    [numFemale, numMale],
  );

  const availableMunicipalities = useMemo(
    () => getMunicipalitiesByDistrict(district as "DISTRICT_I" | "DISTRICT_II" | ""),
    [district],
  );
  const availableBarangays = useMemo(
    () => getBarangaysByMunicipality(cityMunicipality),
    [cityMunicipality],
  );
  const availablePuroks = useMemo(
    () => getPuroksByBarangay(cityMunicipality, barangay),
    [cityMunicipality, barangay],
  );
  const availableSitios = useMemo(
    () => getSitiosByBarangay(cityMunicipality, barangay),
    [cityMunicipality, barangay],
  );
  const availableSubTypes = sourceOfFund ? SOURCE_TO_SUB_TYPES[sourceOfFund] : [];

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

  const createProjectFile = api.projectFile.create.useMutation();
  const createProject = api.project.create.useMutation({
    onSuccess: async (project) => {
      // Persist each uploaded document as a ProjectFile record.
      await Promise.all(
        pendingFiles.map((f) =>
          createProjectFile.mutateAsync({
            projectId: project.id,
            fileName: f.fileName,
            fileUrl: f.fileUrl,
            fileType: f.fileType,
            fileSize: f.fileSize,
          }),
        ),
      );
      await utils.project.getAll.invalidate();
      router.push("/admin/dashboard/projects");
    },
  });

  const handleSubmit = (isDraft: boolean) => {
    createProject.mutate({
      title,
      subType: subType ? (subType as ProjectSubTypeValue) : null,
      modeOfImplementation: modeOfImplementation as "BY_ADMINISTRATION" | "BY_CONTRACT",
      locationImplementation: district as "DISTRICT_I" | "DISTRICT_II",
      sourceOfFund: sourceOfFund as SourceOfFundValue,
      projectCost: parseFloat(projectCost.replace(/,/g, "")) || 0,
      contractCost: parseFloat(contractCost.replace(/,/g, "")) || 0,
      contractorName:
        modeOfImplementation === "BY_CONTRACT" ? contractorName || undefined : undefined,
      projectEngineer: engineers.join(", ") || undefined,
      budgetYear: budgetYear || undefined,
      dateStarted: dateStarted ? new Date(dateStarted) : null,
      targetCompletionDate: targetCompletionDate ? new Date(targetCompletionDate) : null,
      revisedCompletionDate: revisedCompletionDate ? new Date(revisedCompletionDate) : null,
      dateCompleted: null,
      daysSuspended: 0,
      daysExtended: 0,
      numFemale: parseInt(numFemale) || 0,
      numMale: parseInt(numMale) || 0,
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

  const canSubmit =
    !!title &&
    !!modeOfImplementation &&
    !!district &&
    !!sourceOfFund &&
    !createProject.isPending &&
    !isUploadingImage &&
    !isUploadingDoc;

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
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Project Cost</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">₱</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={projectCost}
                        onChange={(e) => handleCostChange(setProjectCost, e.target.value)}
                        onFocus={() => setProjectCost(projectCost.replace(/,/g, ""))}
                        onBlur={() => handleCostBlur(projectCost, setProjectCost)}
                        className={`${inputClass} pl-7`}
                      />
                    </div>
                  </div>
                  <div>
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
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Track Number</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="PEO-2025-XXXXX"
                      className={inputClass}
                    />
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
                      className={inputClass}
                    >
                      <option value="">Select Mode</option>
                      <option value="BY_ADMINISTRATION">By Administration</option>
                      <option value="BY_CONTRACT">By Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
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
                {modeOfImplementation === "BY_CONTRACT" && (
                  <div>
                    <label className={labelClass}>Contractor Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={contractorName}
                      onChange={(e) => setContractorName(e.target.value)}
                      placeholder="Enter contractor name"
                      className={inputClass}
                    />
                  </div>
                )}
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
                  className={inputClass}
                >
                  <option value="">Select District</option>
                  <option value="DISTRICT_I">District 1</option>
                  <option value="DISTRICT_II">District 2</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Municipality / City</label>
                <select
                  value={cityMunicipality}
                  onChange={(e) => {
                    setCityMunicipality(e.target.value);
                    setBarangay("");
                    setPurok("");
                    setSitio("");
                  }}
                  disabled={!district}
                  className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}
                >
                  <option value="">Select Municipality</option>
                  {availableMunicipalities.map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Barangay</label>
                <select
                  value={barangay}
                  onChange={(e) => {
                    setBarangay(e.target.value);
                    setPurok("");
                    setSitio("");
                  }}
                  disabled={!cityMunicipality}
                  className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}
                >
                  <option value="">
                    {cityMunicipality ? "Select Barangay" : "Select Municipality first"}
                  </option>
                  {availableBarangays.map((bg) => (
                    <option key={bg.name} value={bg.name}>{bg.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Purok</label>
                  <select
                    value={purok}
                    onChange={(e) => setPurok(e.target.value)}
                    disabled={!barangay}
                    className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}
                  >
                    <option value="">
                      {barangay ? "Select Purok" : "Select Barangay"}
                    </option>
                    {availablePuroks.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Sitio</label>
                  <select
                    value={sitio}
                    onChange={(e) => setSitio(e.target.value)}
                    disabled={!barangay}
                    className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}
                  >
                    <option value="">
                      {barangay ? "Select Sitio" : "Select Barangay"}
                    </option>
                    {availableSitios.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── Funding & Disbursement Tracking ───────────────────────── */}
        <section className={cardClass}>
          <SectionHeader icon={BillIcon} title="Funding & Disbursement Tracking" />
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
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
                className={inputClass}
              >
                <option value="">Select Source</option>
                {SOURCE_OF_FUND_ORDER.map((k) => (
                  <option key={k} value={k}>{SOURCE_OF_FUND_LABEL[k]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Fund Category</label>
              <select
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
                disabled={!sourceOfFund || availableSubTypes.length === 0}
                className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}
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
            </div>
            <div>
              <label className={labelClass}>Budget Year</label>
              <select
                value={budgetYear}
                onChange={(e) => setBudgetYear(e.target.value)}
                className={inputClass}
              >
                <option value="">Select year</option>
                {Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i)).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ── Project Timeline ──────────────────────────────────────── */}
        <section className={cardClass}>
          <SectionHeader icon={CalendarIcon} title="Project Timeline" />
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-4">
            <div>
              <label className={labelClass}>Date Started</label>
              <input
                type="date"
                value={dateStarted}
                onChange={(e) => setDateStarted(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Original Target</label>
              <input
                type="date"
                value={targetCompletionDate}
                onChange={(e) => setTargetCompletionDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Revised Target Completion</label>
              <input
                type="date"
                value={revisedCompletionDate}
                onChange={(e) => setRevisedCompletionDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Total Days</label>
              <input
                type="text"
                readOnly
                value={`${duration} Days`}
                className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-600`}
              />
            </div>
          </div>
        </section>

        {/* ── Workforce Distribution ────────────────────────────────── */}
        <section className={cardClass}>
          <SectionHeader icon={PeopleIcon} title="Workforce Distribution" />
          <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="flex items-center justify-between p-5">
              <div>
                <p className={labelClass}>Female Personnel</p>
                <input
                  type="number"
                  min="0"
                  value={numFemale}
                  onChange={(e) => setNumFemale(e.target.value)}
                  className="mt-1 w-20 rounded-md border border-gray-200 px-2 py-1 text-2xl font-extrabold text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <span className="text-gray-300">♀</span>
            </div>
            <div className="flex items-center justify-between p-5">
              <div>
                <p className={labelClass}>Male Personnel</p>
                <input
                  type="number"
                  min="0"
                  value={numMale}
                  onChange={(e) => setNumMale(e.target.value)}
                  className="mt-1 w-20 rounded-md border border-gray-200 px-2 py-1 text-2xl font-extrabold text-gray-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <span className="text-gray-300">♂</span>
            </div>
            <div className="flex items-center justify-between p-5">
              <div>
                <p className={labelClass}>Total Workforce</p>
                <p className="mt-1 text-2xl font-extrabold text-gray-900">{totalWorkforce}</p>
              </div>
              <span className="text-gray-300">👥</span>
            </div>
          </div>
        </section>

        {/* ── Project Responsibility & Scope ────────────────────────── */}
        <section className={cardClass}>
          <SectionHeader icon={PersonCheckIcon} title="Project Responsibility & Scope" />
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Engineers In-Charge</label>
              <div
                className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
                onClick={() => document.getElementById("engineer-input")?.focus()}
              >
                {engineers.map((eng) => (
                  <span
                    key={eng}
                    className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                  >
                    {eng}
                    <button
                      type="button"
                      onClick={() => removeEngineer(eng)}
                      className="ml-0.5 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  id="engineer-input"
                  type="text"
                  value={engineerInput}
                  onChange={(e) => setEngineerInput(e.target.value)}
                  onKeyDown={handleEngineerKeyDown}
                  onBlur={addEngineer}
                  placeholder={engineers.length === 0 ? "Add engineers..." : ""}
                  className="min-w-[120px] flex-1 border-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Detailed Scope of Work</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter detailed description of the project scope..."
                className={inputClass}
              />
            </div>
          </div>
        </section>

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
              disabled={createProject.isPending || isUploadingImage || isUploadingDoc || !title}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={!canSubmit}
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
