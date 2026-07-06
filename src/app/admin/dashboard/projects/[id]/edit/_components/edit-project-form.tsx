"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useMemo } from "react";
import { api } from "~/trpc/react";
import { useUploadThing } from "~/lib/uploadthing";
import {
  SOURCE_OF_FUND_LABEL,
  SOURCE_OF_FUND_ORDER,
  PROJECT_SUB_TYPE_LABEL,
  SOURCE_TO_SUB_TYPES,
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_ORDER,
  DISBURSEMENT_TYPE_LABEL,
  MODE_TO_DISBURSEMENT_TYPES,
  type SourceOfFundValue,
  type ProjectStatusValue,
  type DisbursementTypeValue,
} from "~/lib/fund-constants";
import {
  getMunicipalitiesByDistrict,
  getBarangaysByMunicipality,
} from "~/lib/davao-del-norte-locations";

const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  NOT_YET_STARTED: { label: "Not Yet Started", badge: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-400" },
  ON_GOING: { label: "On-going", badge: "bg-amber-50  text-amber-700 border-amber-200", dot: "bg-amber-500" },
  COMPLETED: { label: "Completed", badge: "bg-green-50  text-green-700 border-green-200", dot: "bg-green-500" },
  SUSPENDED: { label: "Suspended", badge: "bg-red-50    text-red-700   border-red-200", dot: "bg-red-500" },
  FOR_IMPLEMENTATION: { label: "For Implementation", badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  RE_ALIGNMENT: { label: "Re-alignment", badge: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" },
  OTHERS: { label: "Others", badge: "bg-slate-50 text-slate-700 border-slate-200", dot: "bg-slate-500" },
};

const PRIORITY_CONFIG = {
  HIGH: { label: "HIGH PRIORITY", bg: "bg-red-50", border: "border-red-200", text: "text-red-700", dot: "bg-red-500", activeBg: "bg-red-500", activeText: "text-white" },
  MEDIUM: { label: "MEDIUM PRIORITY", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-400", activeBg: "bg-amber-500", activeText: "text-white" },
  LOW: { label: "LOW PRIORITY", bg: "bg-green-50", border: "border-green-200", text: "text-green-700", dot: "bg-green-500", activeBg: "bg-green-600", activeText: "text-white" },
  URGENT: { label: "URGENT", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", dot: "bg-purple-500", activeBg: "bg-purple-600", activeText: "text-white" },
} as const;

const TIMELINE_ADJ_TYPE_CONFIG: Record<string, { label: string; badge: string }> = {
  EXTENSION: { label: "Extension", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  SUSPENSION: { label: "Suspension", badge: "bg-red-50 text-red-700 border-red-200" },
  RESUMPTION: { label: "Resumption", badge: "bg-green-50 text-green-700 border-green-200" },
};

function fmt(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function toInputDate(d: Date | string | null | undefined) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

// ─── Section card wrapper ────────────────────────────────────────────────────
function SectionCard({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`} style={style}>
      {children}
    </div>
  );
}

// ─── Section header ──────────────────────────────────────────────────────────
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

// ─── Field label ─────────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{children}</p>;
}

// ─── Input ───────────────────────────────────────────────────────────────────
function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  const { error, className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`block w-full rounded-lg border px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 ${error
        ? "border-red-300 focus:border-red-400 focus:ring-red-400/20"
        : "border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
        } ${className}`}
    />
  );
}

// ─── Select ──────────────────────────────────────────────────────────────────
function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`block w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 ${props.className ?? ""}`}
      />
      <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const EditIcon = () => (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export function EditProjectForm({ projectId }: { projectId: string }) {
  const utils = api.useUtils();
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const engineerRef = useRef<HTMLInputElement>(null);

  const { data: project, isLoading } = api.project.getById.useQuery({ id: projectId });
  const { data: activities } = api.projectActivity.getByProjectId.useQuery({ projectId });
  const { data: disbursements, refetch: refetchDisbursements } = api.project.getDisbursements.useQuery({ projectId });
  const { data: variationOrders, refetch: refetchVariationOrders } = api.project.getVariationOrders.useQuery({ projectId });
  const { data: timelineAdjustments, refetch: refetchTimelineAdjustments } = api.project.getTimelineAdjustments.useQuery({ projectId });
  const { data: projectFiles, refetch: refetchFiles } = api.projectFile.getByProjectId.useQuery({ projectId });
  const { startUpload } = useUploadThing("projectFileUploader");
  const { data: usersForSelect } = api.user.getForSelect.useQuery();

  // ─ Identity & Status ───────────────────────────────────────────────────
  const [completion, setCompletion] = useState(0);
  const [status, setStatus] = useState("ON_GOING");
  const [contractorName, setContractorName] = useState("");
  const [modeOfImplementation, setModeOfImplementation] = useState("BY_CONTRACT");

  // ─ Location ────────────────────────────────────────────────────────────
  const [locDistrict, setLocDistrict] = useState("");
  const [cityMunicipality, setCityMunicipality] = useState("");
  const [barangay, setBarangay] = useState("");
  const [purok, setPurok] = useState("");
  const [sitio, setSitio] = useState("");

  // ─ Funding ─────────────────────────────────────────────────────────────
  const [sourceOfFund, setSourceOfFund] = useState<SourceOfFundValue | "">("");
  const [subType, setSubType] = useState("");
  const [budgetYear, setBudgetYear] = useState("");

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
  const [description, setDescription] = useState("");

  // ─ Media / upload ──────────────────────────────────────────────────────
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaName, setMediaName] = useState("");
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [pendingFileType, setPendingFileType] = useState<"IMAGE" | "BLUEPRINT" | "REPORT" | "CONTRACT" | "PERMIT" | "OTHER">("OTHER");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  // ─ Activity ────────────────────────────────────────────────────────────
  const [comment, setComment] = useState("");

  // ─ Disbursement ────────────────────────────────────────────────────────
  const [disbAmount, setDisbAmount] = useState("");
  const [disbRef, setDisbRef] = useState("");
  const [disbType, setDisbType] = useState<"" | DisbursementTypeValue>("");
  const [disbErrors, setDisbErrors] = useState<{ amount?: string; ref?: string; type?: string }>({});

  // ─ Timeline Adjustment ──────────────────────────────────────────────────
  const [adjDays, setAdjDays] = useState("");
  const [adjType, setAdjType] = useState<"" | "EXTENSION" | "SUSPENSION" | "RESUMPTION">("");
  const [adjJustification, setAdjJustification] = useState("");
  const [adjError, setAdjError] = useState<string | null>(null);

  // ─ Variation Order (backup fund) ────────────────────────────────────────
  const [revisedSourceOfFund, setRevisedSourceOfFund] = useState<SourceOfFundValue | "">("");
  const [revisedVariation, setRevisedVariation] = useState("");
  const [variationError, setVariationError] = useState<string | null>(null);

  // ─ Task notification ───────────────────────────────────────────────────
  const [notifyUserId, setNotifyUserId] = useState("");
  const [notifyPriority, setNotifyPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [taskDescription, setTaskDescription] = useState("");
  const [showNotifSuccess, setShowNotifSuccess] = useState(false);

  // ─ UI ──────────────────────────────────────────────────────────────────
  const [showSuccess, setShowSuccess] = useState(false);

  // populate state from project
  useEffect(() => {
    if (!project) return;
    setCompletion(project.completionPercentage);
    setStatus(project.status);
    setContractorName(project.contractorName ?? "");
    setModeOfImplementation(project.modeOfImplementation);
    setLocDistrict(project.district ?? project.locationImplementation ?? "");
    setCityMunicipality(project.cityMunicipality ?? "");
    setBarangay(project.barangay ?? "");
    setPurok(project.purok ?? "");
    setSitio(project.sitio ?? "");
    setSourceOfFund(project.sourceOfFund);
    setSubType(project.subType ?? "");
    setBudgetYear(project.budgetYear ?? "");
    setDateStarted(toInputDate(project.dateStarted));
    setTargetCompletion(toInputDate(project.targetCompletionDate));
    setRevisedCompletion(toInputDate(project.revisedCompletionDate));
    setNumFemale(project.numFemale ?? 0);
    setNumMale(project.numMale ?? 0);
    setEngineers(project.projectEngineer ? project.projectEngineer.split(",").map((s) => s.trim()).filter(Boolean) : []);
    setDescription(project.description ?? "");
    setMediaUrl(project.imageUrl ?? "");
    setMediaName(project.documentName ?? "");
  }, [project]);

  const totalWorkforce = numFemale + numMale;

  const availableMunicipalities = useMemo(
    () => getMunicipalitiesByDistrict(locDistrict as "DISTRICT_I" | "DISTRICT_II" | ""),
    [locDistrict],
  );
  const availableBarangays = useMemo(
    () => getBarangaysByMunicipality(cityMunicipality),
    [cityMunicipality],
  );
  // ─ Mutations ───────────────────────────────────────────────────────────
  const updateProject = api.project.update.useMutation({
    onSuccess: () => {
      void utils.project.getById.invalidate({ id: projectId });
      setShowSuccess(true);
    },
  });

  const addActivity = api.projectActivity.create.useMutation({
    onSuccess: () => {
      setComment("");
      void utils.projectActivity.getByProjectId.invalidate({ projectId });
    },
  });

  const recordDisbursement = api.project.createDisbursement.useMutation({
    onSuccess: (_data, variables) => {
      setDisbAmount(""); setDisbRef(""); setDisbType(""); setDisbErrors({});
      void refetchDisbursements();
      const formatted = variables.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 });
      const refPart = variables.referenceNumber ? ` (Ref: ${variables.referenceNumber})` : "";
      const typePart = variables.type ? ` [${DISBURSEMENT_TYPE_LABEL[variables.type]}]` : "";
      addActivity.mutate({
        projectId: variables.projectId,
        description: `Recorded disbursement of ₱${formatted}${refPart}${typePart}.`,
      });
    },
  });

  const recordVariationOrder = api.project.createVariationOrder.useMutation({
    onSuccess: (_data, variables) => {
      setRevisedVariation(""); setRevisedSourceOfFund(""); setVariationError(null);
      void refetchVariationOrders();
      const formatted = variables.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 });
      const srcPart = variables.sourceOfFund ? ` (${SOURCE_OF_FUND_LABEL[variables.sourceOfFund]})` : "";
      addActivity.mutate({
        projectId: variables.projectId,
        description: `Recorded variation order of ₱${formatted}${srcPart}.`,
      });
    },
  });

  const recordTimelineAdjustment = api.project.createTimelineAdjustment.useMutation({
    onSuccess: (_data, variables) => {
      setAdjDays(""); setAdjType(""); setAdjJustification(""); setAdjError(null);
      void refetchTimelineAdjustments();
      addActivity.mutate({
        projectId: variables.projectId,
        description: `Recorded ${variables.type.toLowerCase()} timeline adjustment of ${variables.duration} day(s).`,
      });
    },
  });

  const sendNotification = api.project.sendTaskNotification.useMutation({
    onSuccess: () => {
      setTaskDescription(""); setNotifyUserId(""); setNotifyPriority("MEDIUM");
      setShowNotifSuccess(true);
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
  const handleDocUpload = async (file: File) => {
    setIsUploadingMedia(true);
    setUploadError(null);
    try {
      const result = await startUpload([file]);
      if (!result?.[0]) { setUploadError("Upload failed. Please try again."); return; }
      const uploaded = result[0];
      setMediaUrl(uploaded.ufsUrl);
      setMediaName(file.name);
      createProjectFile.mutate({
        projectId,
        fileName: file.name,
        fileUrl: uploaded.ufsUrl,
        fileType: pendingFileType,
        fileSize: file.size,
      });
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setIsUploadingMedia(false);
    }
  };

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
    if (locationFields.length > 0) {
      sections.push(`Project Location (${locationFields.join(", ")})`);
    }

    const fundingFields: string[] = [];
    if (sourceOfFund !== project.sourceOfFund) fundingFields.push("Source of Fund");
    if (subType !== (project.subType ?? "")) fundingFields.push("Sub-Category");
    if (budgetYear !== (project.budgetYear ?? "")) fundingFields.push("Budget Year");
    if (fundingFields.length > 0) {
      sections.push(`Funding & Disbursement Tracking (${fundingFields.join(", ")})`);
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

    if (
      mediaUrl !== (project.imageUrl ?? "") ||
      mediaName !== (project.documentName ?? "")
    ) {
      sections.push("Project Documentation");
    }

    return sections;
  };

  const handleSaveChanges = () => {
    if (!project) return;
    const changedSections = getChangedSections();
    updateProject.mutate(
      {
        id: projectId,
        title: project.title,
        modeOfImplementation: modeOfImplementation as "BY_ADMINISTRATION" | "BY_CONTRACT",
        locationImplementation: (locDistrict as "DISTRICT_I" | "DISTRICT_II") || project.locationImplementation,
        sourceOfFund: (sourceOfFund || project.sourceOfFund) as Parameters<typeof updateProject.mutate>[0]["sourceOfFund"],
        contractCost: project.contractCost,
        contractorName: contractorName || undefined,
        projectEngineer: engineers.join(", ") || undefined,
        budgetYear: budgetYear || undefined,
        subType: (subType || null) as Parameters<typeof updateProject.mutate>[0]["subType"],
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
        description: description || undefined,
        status: status as ProjectStatusValue,
        completionPercentage: completion,
        imageUrl: mediaUrl || undefined,
        documentUrl: mediaUrl || undefined,
        documentName: mediaName || undefined,
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
    const errors: { amount?: string; ref?: string; type?: string } = {};
    const amount = parseFloat(disbAmount);
    if (!disbAmount || isNaN(amount) || amount <= 0) errors.amount = "Amount must be greater than 0.";
    else if (amount > totalRemainingBalance)
      errors.amount = `Insufficient balance. Amount exceeds the total remaining balance of ₱${totalRemainingBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}.`;
    if (!disbRef.trim()) errors.ref = "Reference number is required.";
    if (!disbType) errors.type = "Type is required.";
    if (Object.keys(errors).length > 0) { setDisbErrors(errors); return; }
    setDisbErrors({});
    recordDisbursement.mutate({
      projectId,
      amount,
      referenceNumber: disbRef.trim(),
      type: disbType as DisbursementTypeValue,
    });
  };

  const handleRecordVariationOrder = () => {
    const amount = parseFloat(revisedVariation);
    if (!revisedVariation || isNaN(amount) || amount <= 0) {
      setVariationError("Variation amount must be greater than 0.");
      return;
    }
    setVariationError(null);
    recordVariationOrder.mutate({
      projectId,
      amount,
      sourceOfFund: revisedSourceOfFund || undefined,
    });
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

  const handleSendNotification = () => {
    if (!notifyUserId || !taskDescription.trim()) return;
    sendNotification.mutate({ projectId, notifyUserId, priority: notifyPriority, description: taskDescription.trim() });
  };

  const addEngineer = () => {
    const name = engineerInput.trim();
    if (name && !engineers.includes(name)) setEngineers((prev) => [...prev, name]);
    setEngineerInput("");
  };

  const removeEngineer = (name: string) => setEngineers((prev) => prev.filter((e) => e !== name));

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
        <Link href="/admin/dashboard/projects" className="text-sm font-medium text-blue-600 hover:underline">Back to Projects</Link>
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

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Success Modal ── */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
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
              <button type="button" onClick={() => setShowSuccess(false)} className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-700">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header / Breadcrumb ── */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <nav className="flex items-center gap-1.5 text-sm text-gray-400">
          <Link href="/admin/dashboard/projects" className="hover:text-gray-600">Projects</Link>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          <span className="font-semibold text-gray-700">Update Project</span>
        </nav>
      </div>

      {/* ── Two-column Layout ── */}
      <div className="flex gap-5 px-6 py-5">

        {/* ════════════════════════════════
            LEFT  —  Main edit sections
        ════════════════════════════════ */}
        <div className="min-w-0 flex-1 space-y-4">

          {/* ── Row 1: Identity + Location ── */}
          <div className="grid grid-cols-5 gap-4">

            {/* PROJECT IDENTITY & STATUS */}
            <SectionCard className="col-span-3">
              <SectionHeader
                icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
                title="Project Identity & Status"
                action={<button type="button" className="text-gray-400 hover:text-gray-600"><EditIcon /></button>}
              />
              <div className="flex">
                {/* Thumbnail — full height of the card body */}
                <div
                  onClick={() => mediaInputRef.current?.click()}
                  className="group relative w-64 shrink-0 cursor-pointer overflow-hidden rounded-bl-xl bg-gray-100"
                >
                  {project.imageUrl ? (
                    <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full min-h-48 w-full items-center justify-center">
                      <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                    <svg className="h-6 w-6 text-white opacity-0 transition group-hover:opacity-100" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                    </svg>
                  </div>
                  <input ref={mediaInputRef} type="file" accept="image/jpeg,image/png,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleDocUpload(f); }} />
                </div>

                {/* Fields */}
                <div className="min-w-0 flex-1 space-y-3 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="min-w-0">
                      <FieldLabel>Project Title</FieldLabel>
                      <p className="truncate text-sm font-semibold text-gray-900">{project.title}</p>
                    </div>
                    <div>
                      <FieldLabel>Project Cost</FieldLabel>
                      <p className="text-sm font-semibold text-gray-900">₱ {project.projectCost?.toLocaleString("en-PH", { minimumFractionDigits: 2 }) ?? "—"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>Implementation Mode</FieldLabel>
                      <Select
                        value={modeOfImplementation}
                        onChange={(e) => {
                          setModeOfImplementation(e.target.value);
                          // The disbursement type options depend on the mode, so
                          // drop a selection that is no longer valid.
                          const types = MODE_TO_DISBURSEMENT_TYPES[
                            e.target.value === "BY_ADMINISTRATION" ? "BY_ADMINISTRATION" : "BY_CONTRACT"
                          ];
                          if (disbType && !types.includes(disbType)) setDisbType("");
                        }}
                      >
                        <option value="BY_ADMINISTRATION">By Administration</option>
                        <option value="BY_CONTRACT">By Contract</option>
                      </Select>
                    </div>
                    <div>
                      <FieldLabel>Contraction Name</FieldLabel>
                      <Input value={contractorName} onChange={(e) => setContractorName(e.target.value)} placeholder="Contractor name" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="border-t border-gray-100 px-4 py-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FieldLabel>Project Progress</FieldLabel>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-green-500">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                      Real-time
                    </span>
                  </div>
                  <div className="relative w-24 shrink-0">
                    <input
                      type="number" min={0} max={100} value={completion}
                      onChange={(e) => setCompletion(Math.min(100, Math.max(0, Number(e.target.value))))}
                      className="block w-full rounded-lg border-0 bg-transparent py-2 pl-3 pr-7 text-sm font-bold text-blue-600 focus:outline-none"
                    />
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-sm font-bold text-blue-400">%</span>
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
                  {/* Draggable range — overlaid transparently */}
                  <input
                    type="range" min={0} max={100} value={completion}
                    onChange={(e) => setCompletion(Number(e.target.value))}
                    className="absolute inset-0 h-full w-full cursor-grab appearance-none bg-transparent opacity-0 active:cursor-grabbing"
                  />
                </div>
              </div>
            </SectionCard>

            {/* PROJECT LOCATION */}
            <SectionCard className="col-span-2">
              <SectionHeader
                icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>}
                title="Project Location"
                action={<button type="button" className="text-gray-400 hover:text-gray-600"><EditIcon /></button>}
              />
              <div className="space-y-3 p-4">
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
                <div className="grid grid-cols-2 gap-3">
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
              </div>
            </SectionCard>
          </div>

          {/* ── Funding & Disbursement ── */}
          <SectionCard>
            <SectionHeader
              icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>}
              title="Funding & Disbursement Tracking"
              action={<button type="button" className="text-gray-400 hover:text-gray-600"><EditIcon /></button>}
            />
            <div className="grid grid-cols-5 gap-0 divide-x divide-gray-100">
              {/* Left: fund fields */}
              <div className="col-span-2 space-y-3 p-4">
                <div>
                  <FieldLabel>Source of Fund</FieldLabel>
                  <Select
                    value={sourceOfFund}
                    onChange={(e) => {
                      const next = e.target.value as SourceOfFundValue | "";
                      setSourceOfFund(next);
                      const allowed = next ? SOURCE_TO_SUB_TYPES[next] : [];
                      if (!allowed.includes(subType as never)) setSubType("");
                    }}
                  >
                    <option value="">Select source...</option>
                    {SOURCE_OF_FUND_ORDER.map((k) => (
                      <option key={k} value={k}>
                        {SOURCE_OF_FUND_LABEL[k]}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <FieldLabel>Sub-Category</FieldLabel>
                  <Select
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                    disabled={!sourceOfFund || (SOURCE_TO_SUB_TYPES[sourceOfFund]?.length ?? 0) === 0}
                  >
                    <option value="">
                      {!sourceOfFund
                        ? "Select source first..."
                        : (SOURCE_TO_SUB_TYPES[sourceOfFund]?.length ?? 0) === 0
                          ? "No sub-categories available"
                          : "Select sub-category..."}
                    </option>
                    {sourceOfFund &&
                      SOURCE_TO_SUB_TYPES[sourceOfFund].map((k) => (
                        <option key={k} value={k}>
                          {PROJECT_SUB_TYPE_LABEL[k]}
                        </option>
                      ))}
                  </Select>
                </div>
                <div>
                  <FieldLabel>Budget Year</FieldLabel>
                  <Select value={budgetYear} onChange={(e) => setBudgetYear(e.target.value)}>
                    <option value="">Select year...</option>
                    {Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i)).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </Select>
                </div>
                <div className={`rounded-lg border px-3 py-3 ${totalRemainingBalance <= 100000 ? "border-red-100 bg-red-50" : "border-green-100 bg-green-50"}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${totalRemainingBalance <= 100000 ? "text-red-500" : "text-green-600"}`}>Total Remaining Balance</p>
                  <p className={`mt-1 text-lg font-extrabold ${totalRemainingBalance <= 100000 ? "text-red-700" : "text-green-700"}`}>
                    ₱ {totalRemainingBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Primary Fund Balance (General Fund)</p>
                  <p className="mt-0.5 text-sm font-bold text-gray-800">
                    ₱ {primaryFundBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Variation Order Balance (20% DF)</p>
                  <p className="mt-0.5 text-sm font-bold text-gray-800">
                    ₱ {variationOrderBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <p className="text-[10px] text-blue-400">*Calculated based on Total Cost vs Recorded Disbursements + Variation Order</p>
              </div>

              {/* Right: disbursements table + record */}
              <div className="col-span-3 flex flex-col p-4">
                <FieldLabel>Recent Disbursements</FieldLabel>
                <div
                  className="flex-1 overflow-y-auto rounded-lg border border-gray-200"
                  style={{ maxHeight: "212px" }}
                >
                  <table className="w-full border-separate border-spacing-0 text-xs">
                    <thead className="sticky top-0 z-10 bg-gray-50">
                      <tr className="[&>th]:border-b [&>th]:border-gray-100">
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Date</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Reference / Check #</th>
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
                            {d.type ? DISBURSEMENT_TYPE_LABEL[d.type] : "—"}
                          </td>
                          <td className="px-3 py-2.5 text-right font-semibold text-gray-900">
                            {d.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} className="px-3 py-6 text-center text-gray-400">No disbursements recorded yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Record form */}
                <div className="mt-3 flex gap-2">
                  <div className="relative w-36 shrink-0">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₱</span>
                    <Input
                      type="number" min={0} placeholder="Amount *"
                      value={disbAmount}
                      onChange={(e) => { setDisbAmount(e.target.value); setDisbErrors((p) => ({ ...p, amount: undefined })); }}
                      error={!!disbErrors.amount}
                      className="pl-7"
                    />
                  </div>
                  <Input
                    type="text" placeholder="Ref # *"
                    value={disbRef}
                    onChange={(e) => { setDisbRef(e.target.value); setDisbErrors((p) => ({ ...p, ref: undefined })); }}
                    error={!!disbErrors.ref}
                    className="flex-1"
                  />
                  <div className="w-36 shrink-0">
                    <Select
                      value={disbType}
                      onChange={(e) => {
                        setDisbType(e.target.value as "" | DisbursementTypeValue);
                        setDisbErrors((p) => ({ ...p, type: undefined }));
                      }}
                      className={disbErrors.type ? "border-red-300" : ""}
                    >
                      <option value="">Type *</option>
                      {MODE_TO_DISBURSEMENT_TYPES[
                        modeOfImplementation === "BY_ADMINISTRATION" ? "BY_ADMINISTRATION" : "BY_CONTRACT"
                      ].map((t) => (
                        <option key={t} value={t}>{DISBURSEMENT_TYPE_LABEL[t]}</option>
                      ))}
                    </Select>
                  </div>
                  <button
                    type="button" onClick={handleRecordDisbursement}
                    disabled={recordDisbursement.isPending}
                    className="rounded-lg bg-blue-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blue-800 disabled:opacity-50"
                  >
                    {recordDisbursement.isPending ? "..." : "Record"}
                  </button>
                </div>
                {(disbErrors.amount ?? disbErrors.ref ?? disbErrors.type) && (
                  <div className="mt-1 space-y-0.5">
                    {disbErrors.amount && <p className="text-xs text-red-500">{disbErrors.amount}</p>}
                    {disbErrors.ref && <p className="text-xs text-red-500">{disbErrors.ref}</p>}
                    {disbErrors.type && <p className="text-xs text-red-500">{disbErrors.type}</p>}
                  </div>
                )}

                {/* Revised Contract Cost History */}
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <FieldLabel>Revised Contract Cost History</FieldLabel>
                  <div
                    className="overflow-y-auto rounded-lg border border-gray-200"
                    style={{ maxHeight: "212px" }}
                  >
                    <table className="w-full border-separate border-spacing-0 text-xs">
                      <thead className="sticky top-0 z-10 bg-gray-50">
                        <tr className="[&>th]:border-b [&>th]:border-gray-100">
                          <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Date</th>
                          <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Original Cost</th>
                          <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Source of Fund</th>
                          <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Variation Order</th>
                          <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">Revised Total</th>
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
                                <td className="px-3 py-2.5 text-gray-700">{v.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
                                <td className="px-3 py-2.5 text-right font-semibold text-gray-900">{running.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
                              </tr>
                            );
                          });
                        })() : (
                          <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-400">No variation orders recorded yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Record form — Source of Fund + Variation + Record only */}
                  <div className="mt-3 flex gap-2">
                    <div className="w-44 shrink-0">
                      <Select
                        value={revisedSourceOfFund}
                        onChange={(e) => setRevisedSourceOfFund(e.target.value as SourceOfFundValue | "")}
                      >
                        <option value="">Source of Fund</option>
                        {SOURCE_OF_FUND_ORDER.map((k) => (
                          <option key={k} value={k}>
                            {SOURCE_OF_FUND_LABEL[k]}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="relative flex-1">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₱</span>
                      <Input
                        type="number" min={0} placeholder="Variation"
                        value={revisedVariation}
                        onChange={(e) => { setRevisedVariation(e.target.value); setVariationError(null); }}
                        error={!!variationError}
                        className="pl-7"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRecordVariationOrder}
                      disabled={recordVariationOrder.isPending}
                      className="rounded-lg bg-blue-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blue-800 disabled:opacity-50"
                    >
                      {recordVariationOrder.isPending ? "..." : "Record"}
                    </button>
                  </div>
                  {variationError && <p className="mt-1 text-xs text-red-500">{variationError}</p>}
                </div>

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
                className="overflow-y-auto rounded-lg border border-gray-200"
                style={{ maxHeight: "392px" }}
              >
                <table className="w-full border-separate border-spacing-0 text-xs">
                  <thead className="sticky top-0 z-10 bg-gray-50">
                    <tr className="[&>th]:border-b [&>th]:border-gray-100">
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Start Date</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">End Date</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Duration</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Adjustment Type</th>
                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Justification Record</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {timelineAdjustments && timelineAdjustments.length > 0 ? timelineAdjustments.map((a) => {
                      const cfg = TIMELINE_ADJ_TYPE_CONFIG[a.type] ?? { label: a.type, badge: "bg-gray-50 text-gray-600 border-gray-200" };
                      return (
                        <tr key={a.id} className="hover:bg-gray-50/50">
                          <td className="px-3 py-2.5 text-gray-600">{fmt(a.startDate)}</td>
                          <td className="px-3 py-2.5 text-gray-600">{fmt(a.endDate)}</td>
                          <td className="px-3 py-2.5 font-semibold text-gray-800">{a.duration} Days</td>
                          <td className="px-3 py-2.5">
                            <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}>{cfg.label}</span>
                          </td>
                          <td className="px-3 py-2.5 italic text-gray-600">{a.justification ?? "—"}</td>
                        </tr>
                      );
                    }) : (
                      <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-400">No timeline adjustments recorded yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Record form — with labels */}
              <div className="mt-3 flex items-end gap-2">
                <div className="w-40 shrink-0">
                  <FieldLabel>Start Date</FieldLabel>
                  <Input type="date" value={dateStarted} onChange={(e) => { setDateStarted(e.target.value); setAdjError(null); }} error={!!adjError && !dateStarted} />
                </div>
                <div className="w-40 shrink-0">
                  <FieldLabel>End Date</FieldLabel>
                  <Input type="date" value={targetCompletion} onChange={(e) => { setTargetCompletion(e.target.value); setAdjError(null); }} error={!!adjError && !targetCompletion} />
                </div>
                <div className="w-40 shrink-0">
                  <FieldLabel>Revised Target Completion</FieldLabel>
                  <Input type="date" value={revisedCompletion} onChange={(e) => setRevisedCompletion(e.target.value)} />
                </div>
                <div className="w-24 shrink-0">
                  <FieldLabel>Duration</FieldLabel>
                  <Input type="number" min={0} placeholder="0" value={adjDays} onChange={(e) => { setAdjDays(e.target.value); setAdjError(null); }} error={!!adjError && !adjDays} />
                </div>
                <div className="w-40 shrink-0">
                  <FieldLabel>Type</FieldLabel>
                  <Select
                    value={adjType}
                    onChange={(e) => { setAdjType(e.target.value as typeof adjType); setAdjError(null); }}
                    className={adjError && !adjType ? "border-red-300" : ""}
                  >
                    <option value="">Type</option>
                    {Object.entries(TIMELINE_ADJ_TYPE_CONFIG).map(([value, { label }]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Select>
                </div>
                <div className="flex-1">
                  <FieldLabel>Justification / Basis</FieldLabel>
                  <Input type="text" placeholder="Justification / Basis..." value={adjJustification} onChange={(e) => setAdjJustification(e.target.value)} />
                </div>
                <button
                  type="button"
                  onClick={handleRecordTimelineAdjustment}
                  disabled={recordTimelineAdjustment.isPending}
                  className="rounded-lg bg-blue-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blue-800 disabled:opacity-50"
                >
                  {recordTimelineAdjustment.isPending ? "..." : "Record"}
                </button>
              </div>
              {adjError && <p className="mt-1 text-xs text-red-500">{adjError}</p>}
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
                    className="mt-1 block w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
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
                <div className="flex items-center gap-2">
                  {/* File type selector */}
                  <select
                    value={pendingFileType}
                    onChange={(e) => setPendingFileType(e.target.value as typeof pendingFileType)}
                    className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 focus:outline-none"
                  >
                    <option value="OTHER">Other</option>
                    <option value="IMAGE">Image</option>
                    <option value="BLUEPRINT">Blueprint</option>
                    <option value="REPORT">Report</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="PERMIT">Permit</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => docInputRef.current?.click()}
                    disabled={isUploadingMedia}
                    className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {isUploadingMedia ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                    ) : (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                      </svg>
                    )}
                    {isUploadingMedia ? "Uploading..." : "Upload File"}
                  </button>
                  <input
                    ref={docInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleDocUpload(f); e.target.value = ""; }}
                  />
                </div>
              }
            />
            <div className="p-4">
              {uploadError && (
                <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                  {uploadError}
                  <button type="button" onClick={() => setUploadError(null)} className="ml-auto">✕</button>
                </div>
              )}
              {deleteNotice && (
                <div className="mb-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                  <svg className="h-4 w-4 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  {deleteNotice}
                  <button type="button" onClick={() => setDeleteNotice(null)} className="ml-auto text-green-400 hover:text-green-600">✕</button>
                </div>
              )}
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">File Name</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Type</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Upload Date</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Uploaded By</th>
                    <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projectFiles && projectFiles.length > 0 ? projectFiles.map((f) => {
                    const isImage = f.fileType === "IMAGE" || /\.(jpg|jpeg|png|webp)$/i.exec(f.fileName);
                    const typeColors: Record<string, string> = {
                      IMAGE: "bg-purple-50 text-purple-600",
                      BLUEPRINT: "bg-blue-50   text-blue-600",
                      REPORT: "bg-amber-50  text-amber-600",
                      CONTRACT: "bg-green-50  text-green-600",
                      PERMIT: "bg-teal-50   text-teal-600",
                      OTHER: "bg-gray-100  text-gray-600",
                    };
                    return (
                      <tr key={f.id} className="hover:bg-gray-50/50">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded ${isImage ? "bg-purple-50" : "bg-red-50"}`}>
                              {isImage ? (
                                <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M2.25 19.5h19.5M2.25 4.5h19.5" /></svg>
                              ) : (
                                <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                              )}
                            </div>
                            <span className="max-w-45 truncate font-medium text-gray-700">{f.fileName}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${typeColors[f.fileType] ?? "bg-gray-100 text-gray-600"}`}>
                            {f.fileType}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-gray-500">{fmt(f.createdAt)}</td>
                        <td className="px-3 py-3 text-gray-500">{f.createdBy.name ?? f.createdBy.email}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <a href={f.fileUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500" title="View">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                            </a>
                            <a href={f.fileUrl} download={f.fileName} className="text-gray-400 hover:text-blue-500" title="Download">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                            </a>
                            <button
                              type="button"
                              onClick={() => { if (confirm(`Delete "${f.fileName}"?`)) deleteProjectFile.mutate({ id: f.id }); }}
                              className="text-gray-400 hover:text-red-500" title="Delete"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center text-gray-400">
                        No files uploaded yet. Select a file type above and click <strong>Upload File</strong>.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* ── Task Notification ── */}
          <SectionCard>
            <SectionHeader
              icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>}
              title="Task Notification"
            />
            <div className="p-4">
              {showNotifSuccess && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  Notification sent successfully.
                  <button type="button" onClick={() => setShowNotifSuccess(false)} className="ml-auto text-green-400 hover:text-green-600">✕</button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-6">
                {/* Left */}
                <div className="space-y-4">
                  <div>
                    <FieldLabel>Select User to Notify</FieldLabel>
                    <Select value={notifyUserId} onChange={(e) => setNotifyUserId(e.target.value)}>
                      <option value="">Select a user...</option>
                      {usersForSelect?.map((u) => (
                        <option key={u.id} value={u.id}>
                          {`${u.name ?? "Unnamed"} — ${u.email}${u.employeeId ? ` (${u.employeeId})` : ""}`}
                        </option>
                      ))}
                    </Select>
                    {usersForSelect?.length === 0 && (
                      <p className="mt-1 text-xs text-amber-600">
                        No active users available — activate users first.
                      </p>
                    )}
                  </div>

                  <div>
                    <FieldLabel>Priority Level</FieldLabel>
                    <div className="mt-2 space-y-2">
                      {(["HIGH", "MEDIUM", "LOW"] as const).map((p) => {
                        const cfg = PRIORITY_CONFIG[p];
                        const isActive = notifyPriority === p;
                        return (
                          <button
                            key={p} type="button"
                            onClick={() => setNotifyPriority(p)}
                            className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition ${isActive ? `${cfg.activeBg} border-transparent text-white` : `${cfg.bg} ${cfg.border}`
                              }`}
                          >
                            <span className={`mt-0.5 h-3 w-3 shrink-0 rounded-full ${isActive ? "bg-white/80" : cfg.dot}`} />
                            <div>
                              <p className={`text-xs font-bold uppercase tracking-widest ${isActive ? "text-white" : cfg.text}`}>{cfg.label}</p>
                              <p className={`mt-0.5 text-[10px] ${isActive ? "text-white/80" : "text-gray-400"}`}>
                                {p === "HIGH" ? "Acknowledge & respond within 4 hours" : p === "MEDIUM" ? "Acknowledge & respond within 24 hours" : "Acknowledge & respond within 48 hours"}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col">
                  <FieldLabel>Task Description / Instructions</FieldLabel>
                  <textarea
                    rows={8}
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Type instructions or task details here..."
                    className="mt-1 flex-1 resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSendNotification}
                      disabled={sendNotification.isPending || !notifyUserId || !taskDescription.trim()}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-40"
                    >
                      {sendNotification.isPending ? (
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                      )}
                      {sendNotification.isPending ? "Sending..." : "Send Notification"}
                    </button>
                  </div>
                  {sendNotification.isError && (
                    <p className="mt-2 text-right text-xs text-red-600">{sendNotification.error.message}</p>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>

        </div>

        {/* ════════════════════════════════
            RIGHT  —  Activity Log (sticky)
        ════════════════════════════════ */}
        <div className="w-lg shrink-0">
          <div className="sticky top-5 space-y-3">
            {/* Status badge */}
            <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 ${statusCfg.badge}`}>
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
                    className="mt-1 block w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  />
                  <button
                    type="button" onClick={() => { if (comment.trim()) addActivity.mutate({ projectId, description: comment.trim() }); }}
                    disabled={addActivity.isPending || !comment.trim()}
                    className="mt-2 w-full rounded-lg bg-gray-900 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-gray-700 disabled:opacity-40"
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
                          <div key={a.id} className={`rounded-lg p-3 ${idx === 0 ? "bg-blue-50 ring-1 ring-blue-100" : "bg-gray-50"}`}>
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
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white px-8 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-end gap-3">
          {updateProject.isError && (
            <p className="mr-auto text-xs text-red-600">{updateProject.error.message}</p>
          )}
          <Link
            href={`/admin/dashboard/projects/${projectId}`}
            className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-600 transition hover:bg-gray-50"
          >
            Cancel Changes
          </Link>
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={updateProject.isPending}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
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
