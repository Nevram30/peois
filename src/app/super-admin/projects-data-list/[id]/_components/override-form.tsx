"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
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
  allProgramOptions,
  landbankOptions,
  programLabel,
  programOptions,
  projectLabel,
  projectOptions,
  withSelected,
} from "~/lib/funding-options";
import { HardHat } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  ON_GOING: "bg-green-100 text-green-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  SUSPENDED: "bg-red-100 text-red-700",
  NOT_YET_STARTED: "bg-gray-100 text-gray-600",
};

type PriorityValue = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

const PRIORITY_LEVELS: {
  value: PriorityValue;
  label: string;
  days: string;
  selectedCard: string;
  checkBg: string;
  icon: React.ReactNode;
}[] = [
    {
      value: "URGENT",
      label: "Urgent",
      days: "1 Day",
      selectedCard: "border-rose-400 bg-rose-50",
      checkBg: "bg-rose-600",
      icon: (
        <svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      ),
    },
    {
      value: "HIGH",
      label: "High",
      days: "2 Days",
      selectedCard: "border-red-300 bg-red-50",
      checkBg: "bg-red-500",
      icon: (
        <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      ),
    },
    {
      value: "MEDIUM",
      label: "Medium",
      days: "4 Days",
      selectedCard: "border-amber-300 bg-amber-50",
      checkBg: "bg-amber-500",
      icon: (
        <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      ),
    },
    {
      value: "LOW",
      label: "Low",
      days: "6 Days",
      selectedCard: "border-green-300 bg-green-50",
      checkBg: "bg-green-500",
      icon: (
        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      ),
    },
  ];

function formatDate(d: Date | null | undefined): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

function formatCurrency(n: number): string {
  return n.toLocaleString("en-PH", { minimumFractionDigits: 2 });
}

function SectionCard({
  icon,
  title,
  badge,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-sm border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {title}
          </span>
        </div>
        {badge ?? (
          <button type="button" className="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
            </svg>
          </button>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-400">
      {children}
      {required && <span className="ml-0.5 text-red-400">*</span>}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  disabled,
  required,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled
        ? "border-gray-100 bg-gray-50 text-gray-400"
        : "border-gray-200 bg-white text-gray-800"
        }`}
    />
  );
}

// Funding Information / Financial Summary use the heavier blue field labels and
// chevron selects of the admin update-project page, so the two screens read the
// same. The compact grey FieldLabel above stays with the other override cards.
function FundLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-1.5 text-sm font-bold text-blue-900">{children}</p>;
}

function FundSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", ...rest } = props;
  return (
    <div className="relative">
      <select
        {...rest}
        className={`block w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${className}`}
      />
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  );
}

function FundInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 ${className}`}
    />
  );
}

export function OverrideForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const utils = api.useUtils();

  const { data: project, isLoading } = api.project.getById.useQuery({ id: projectId });
  const { data: activities } = api.projectActivity.getByProjectId.useQuery({ projectId });
  const { data: disbursementsData, refetch: refetchDisbursements } = api.project.getDisbursements.useQuery({ projectId });
  const { data: variationOrdersData, refetch: refetchVariationOrders } = api.project.getVariationOrders.useQuery({ projectId });
  const { data: timelineAdjustmentsData, refetch: refetchTimelineAdjustments } = api.project.getTimelineAdjustments.useQuery({ projectId });
  const { data: projectFilesData, refetch: refetchProjectFiles } = api.projectFile.getByProjectId.useQuery({ projectId });
  const { data: users } = api.user.getForSelect.useQuery();
  // Programs / Projects / LBP-TL numbers this super admin (or another) added via
  // the Manual Entry card — merged into the Funding Information dropdowns.
  const { data: customOptions } = api.fundingOption.getAll.useQuery();

  const override = api.project.superAdminOverride.useMutation({
    onSuccess: async () => {
      await utils.project.getById.invalidate({ id: projectId });
      await utils.projectActivity.getByProjectId.invalidate({ projectId });
      setReason("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const createDisbursement = api.project.createDisbursement.useMutation({
    onSuccess: async () => {
      await refetchDisbursements();
      setNewDisbAmt("");
      setNewDisbRef("");
      setNewDisbType("");
      setNewDisbRemarks("");
    },
  });

  // ── Manual Entry: the added option must show up in the selects immediately,
  // so each create invalidates the shared option list.
  const invalidateOptions = async () => {
    await utils.fundingOption.getAll.invalidate();
  };

  const addProgram = api.fundingOption.createProgram.useMutation({
    onSuccess: async () => {
      await invalidateOptions();
      setNewProgramName("");
      setManualError(null);
    },
    onError: (e) => setManualError(e.message),
  });

  const addProjectOption = api.fundingOption.createProject.useMutation({
    onSuccess: async () => {
      await invalidateOptions();
      setNewProjectName("");
      setManualError(null);
    },
    onError: (e) => setManualError(e.message),
  });

  const addLandbankNumber = api.fundingOption.createLandbankNumber.useMutation({
    onSuccess: async () => {
      await invalidateOptions();
      setNewLandbankNumber("");
      setManualError(null);
    },
    onError: (e) => setManualError(e.message),
  });

  const deleteDisbursement = api.project.deleteDisbursement.useMutation({
    onSuccess: async () => {
      await refetchDisbursements();
    },
  });

  const createVariationOrder = api.project.createVariationOrder.useMutation({
    onSuccess: async () => {
      await refetchVariationOrders();
      setNewVoAmt("");
      setNewVoSource("");
    },
  });

  const deleteVariationOrder = api.project.deleteVariationOrder.useMutation({
    onSuccess: async () => {
      await refetchVariationOrders();
    },
  });

  const createTimelineAdjustment = api.project.createTimelineAdjustment.useMutation({
    onSuccess: async () => {
      await refetchTimelineAdjustments();
      setNewTlStart("");
      setNewTlEnd("");
      setNewTlType("");
      setNewTlJustification("");
    },
  });

  const deleteTimelineAdjustment = api.project.deleteTimelineAdjustment.useMutation({
    onSuccess: async () => {
      await refetchTimelineAdjustments();
    },
  });

  const deleteProjectFile = api.projectFile.delete.useMutation({
    onSuccess: async () => {
      await refetchProjectFiles();
    },
  });

  const sendNotification = api.project.sendTaskNotification.useMutation({
    onSuccess: () => {
      setNotifUserId("");
      setNotifPriority("HIGH");
      setNotifDesc("");
      setNotifSuccess(true);
      setTimeout(() => setNotifSuccess(false), 3000);
    },
  });

  const [form, setForm] = useState({
    title: "",
    projectCost: 0,
    modeOfImplementation: "BY_CONTRACT" as
      | "BY_ADMINISTRATION"
      | "BY_CONTRACT"
      | "UNASSIGNED_FOR_DETERMINATION",
    locationImplementation: "DISTRICT_I" as "DISTRICT_I" | "DISTRICT_II",
    status: "ON_GOING" as ProjectStatusValue,
    sourceOfFund: "GENERAL_FUND" as SourceOfFundValue,
    subType: "" as string,
    program: "" as string,
    projectAccount: "" as "" | ProjectAccountValue,
    landbankNumber: "",
    supplementalBudgetYear: "",
    supplementalBudgetNumber: "",
    budgetYear: "",
    contractCost: 0,
    contractorName: "",
    projectEngineer: "",
    dateStarted: "",
    targetCompletionDate: "",
    revisedCompletionDate: "",
    numFemale: 0,
    numMale: 0,
    numManDays: 0,
    district: "" as string,
    cityMunicipality: "",
    barangay: "",
    purok: "",
    sitio: "",
    description: "",
  });

  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState(false);
  const [projectCostDisplay, setProjectCostDisplay] = useState("");

  // Disbursement inputs
  const [newDisbAmt, setNewDisbAmt] = useState("");
  const [newDisbRef, setNewDisbRef] = useState("");
  const [newDisbType, setNewDisbType] = useState<"" | DisbursementTypeValue>("");
  const [newDisbRemarks, setNewDisbRemarks] = useState("");

  // Revised contract cost / variation order inputs
  const [newVoAmt, setNewVoAmt] = useState("");
  const [newVoSource, setNewVoSource] = useState("");
  const [newVoProgram, setNewVoProgram] = useState("");
  const [newVoProject, setNewVoProject] = useState("");

  // Manual Entry (Funding Information) inputs
  const [newProgramName, setNewProgramName] = useState("");
  const [newProgramSource, setNewProgramSource] = useState<"" | SourceOfFundValue>("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectProgram, setNewProjectProgram] = useState("");
  const [newLandbankNumber, setNewLandbankNumber] = useState("");
  const [manualError, setManualError] = useState<string | null>(null);

  // Timeline adjustment inputs
  const [newTlStart, setNewTlStart] = useState("");
  const [newTlEnd, setNewTlEnd] = useState("");
  const [newTlType, setNewTlType] = useState<"" | "EXTENSION" | "SUSPENSION" | "RESUMPTION" | "REVISION">("");
  const [newTlJustification, setNewTlJustification] = useState("");

  // Task notification
  const [notifUserId, setNotifUserId] = useState("");
  const [notifPriority, setNotifPriority] = useState<PriorityValue>("HIGH");
  const [notifDesc, setNotifDesc] = useState("");
  const [notifSuccess, setNotifSuccess] = useState(false);

  // Re-applies the saved project values to the form, discarding any edits.
  const resetForm = useCallback(() => {
    if (!project) return;
    setForm({
      title: project.title,
      projectCost: project.projectCost,
      modeOfImplementation: project.modeOfImplementation,
      locationImplementation: project.locationImplementation,
      status: project.status,
      sourceOfFund: project.sourceOfFund,
      subType: project.subType ?? "",
      program: project.program ?? "",
      projectAccount: (project.projectAccount as ProjectAccountValue | null) ?? "",
      landbankNumber: project.landbankNumber ?? "",
      supplementalBudgetYear: project.supplementalBudgetYear ?? "",
      supplementalBudgetNumber: project.supplementalBudgetNumber ?? "",
      budgetYear: project.budgetYear ?? "",
      contractCost: project.contractCost,
      contractorName: project.contractorName ?? "",
      projectEngineer: project.projectEngineer ?? "",
      dateStarted: formatDate(project.dateStarted),
      targetCompletionDate: formatDate(project.targetCompletionDate),
      revisedCompletionDate: formatDate(project.revisedCompletionDate),
      numFemale: project.numFemale,
      numMale: project.numMale,
      numManDays: project.numManDays,
      district: project.district ?? "",
      cityMunicipality: project.cityMunicipality ?? "",
      barangay: project.barangay ?? "",
      purok: project.purok ?? "",
      sitio: project.sitio ?? "",
      description: project.description ?? "",
    });
    setProjectCostDisplay(formatCurrency(project.projectCost));
    setReason("");
  }, [project]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  function handleCancel() {
    resetForm();
    router.push(`/super-admin/projects-data-list?id=${userId}`);
  }

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!reason.trim() || !project) return;

    // "Commit & Save Updates" persists edits made in the Project Identity &
    // Status, Project Location, Funding Information, Workforce Distribution, and
    // Project In-Charge & Profile cards. Every other field is sent at its saved
    // value so the commit can never alter data owned by the other cards
    // (Financial Summary, Timeline, Documentation, Task Notification), which save
    // through their own record/delete/send actions.
    override.mutate({
      id: projectId,
      reason,
      // Project Identity & Status
      title: form.title,
      projectCost: form.projectCost,
      status: form.status,
      modeOfImplementation: form.modeOfImplementation,
      contractorName: form.modeOfImplementation === "BY_CONTRACT" ? form.contractorName || undefined : undefined,
      // Project Location
      locationImplementation: form.locationImplementation,
      cityMunicipality: form.cityMunicipality || undefined,
      barangay: form.barangay || undefined,
      purok: form.purok || undefined,
      sitio: form.sitio || undefined,
      // Workforce Distribution
      numFemale: form.numFemale,
      numMale: form.numMale,
      // Project In-Charge & Profile
      projectEngineer: form.projectEngineer || undefined,
      description: form.description || undefined,
      // Funding Information
      sourceOfFund: form.sourceOfFund,
      program: form.program || null,
      subType: form.subType || null,
      projectAccount: form.projectAccount || null,
      landbankNumber: form.landbankNumber || null,
      supplementalBudgetYear: form.supplementalBudgetYear || null,
      supplementalBudgetNumber: form.supplementalBudgetNumber || null,
      budgetYear: form.budgetYear || undefined,
      // Preserved (owned by other cards / not editable here)
      contractCost: project.contractCost,
      dateStarted: project.dateStarted ?? null,
      targetCompletionDate: project.targetCompletionDate ?? null,
      revisedCompletionDate: project.revisedCompletionDate ?? null,
      numManDays: project.numManDays,
      district: project.district ?? null,
    });
  }

  const engineers = form.projectEngineer
    ? form.projectEngineer.split(",").map((e) => e.trim()).filter(Boolean)
    : [];

  const disbursements = disbursementsData ?? [];
  const variationOrders = variationOrdersData ?? [];
  const totalDisbursed = disbursements.reduce((sum, d) => sum + d.amount, 0);

  // Balances mirror the drawdown model used across the fund views: disbursements
  // draw down the primary (project cost) fund first, and any excess overflows
  // onto the variation orders. No balance is allowed to go below zero.
  const rawPrimary = form.projectCost - totalDisbursed;
  const primaryBalance = Math.max(0, rawPrimary);
  let voOverflow = Math.max(0, -rawPrimary);
  let variationBalance = 0;
  for (const vo of variationOrders) {
    if (vo.amount <= 0) continue;
    const consumed = Math.min(voOverflow, vo.amount);
    voOverflow -= consumed;
    variationBalance += vo.amount - consumed;
  }
  const totalRemainingBalance = primaryBalance + variationBalance;

  const primaryFundLabel = SOURCE_OF_FUND_LABEL[form.sourceOfFund] ?? form.sourceOfFund;
  const variationFundSource = variationOrders.find((vo) => vo.sourceOfFund)?.sourceOfFund;
  const variationFundLabel = variationFundSource
    ? (SOURCE_OF_FUND_LABEL[variationFundSource] ?? variationFundSource)
    : "Variation Orders";

  const currentYear = new Date().getFullYear();
  const budgetYearOptions = Array.from({ length: 10 }, (_, i) => String(currentYear - i));
  if (form.budgetYear && !budgetYearOptions.includes(form.budgetYear)) {
    budgetYearOptions.unshift(form.budgetYear);
  }

  // Funding Information cascade: Source of Fund → Program → Project, each list
  // being the built-in constants plus the super admin's Manual Entry additions.
  const availablePrograms = withSelected(
    programOptions(form.sourceOfFund, customOptions),
    form.program,
    programLabel,
  );
  const availableProjects = withSelected(
    projectOptions(form.program, customOptions),
    form.subType,
    projectLabel,
  );
  const availableLandbankNumbers = form.landbankNumber
    ? Array.from(new Set([...landbankOptions(customOptions), form.landbankNumber]))
    : landbankOptions(customOptions);
  const manualEntryPrograms = allProgramOptions(customOptions);

  // Same cascade for the Revised Contract Cost record row.
  const voPrograms = programOptions(newVoSource as SourceOfFundValue | "", customOptions);
  const voProjects = projectOptions(newVoProgram, customOptions);

  const isAddingOption =
    addProgram.isPending || addProjectOption.isPending || addLandbankNumber.isPending;
  const canAddOption =
    (!!newProgramName.trim() && !!newProgramSource) ||
    (!!newProjectName.trim() && !!newProjectProgram) ||
    !!newLandbankNumber.trim();

  // One ADD button commits whichever of the three Manual Entry rows were filled.
  function handleManualAdd() {
    setManualError(null);
    let submitted = false;
    if (newProgramName.trim() && newProgramSource) {
      addProgram.mutate({ name: newProgramName.trim(), sourceOfFund: newProgramSource });
      submitted = true;
    }
    if (newProjectName.trim() && newProjectProgram) {
      addProjectOption.mutate({ name: newProjectName.trim(), program: newProjectProgram });
      submitted = true;
    }
    if (newLandbankNumber.trim()) {
      addLandbankNumber.mutate({ number: newLandbankNumber.trim() });
      submitted = true;
    }
    if (!submitted) {
      setManualError(
        "Enter a program with its source, a project with its program, or an LBP-TL number.",
      );
    }
  }

  const timelineAdjustments = timelineAdjustmentsData ?? [];
  const projectFiles = projectFilesData ?? [];
  const newTlDuration =
    newTlStart && newTlEnd
      ? Math.max(
        0,
        Math.ceil(
          (new Date(newTlEnd).getTime() - new Date(newTlStart).getTime()) /
          (1000 * 60 * 60 * 24),
        ),
      )
      : 0;

  const overrideActivities = (activities ?? []).filter((a) =>
    a.description.startsWith("[OVERRIDE]"),
  );

  if (isLoading) {
    return (
      <div className="flex-col place-items-center py-32">
        <div className="relative h-12 w-12">
          <svg className="h-12 w-12 animate-spin text-amber-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <HardHat className="absolute inset-0 m-auto h-6 w-6 text-amber-600" />
        </div>
        <p className="text-sm">Loading Overide Project....</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <p className="text-sm">Project not found.</p>
        <button
          onClick={() => router.push(`/super-admin/projects-data-list?id=${userId}`)}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Back to Projects Management
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <button
              onClick={() => router.push(`/super-admin/projects-data-list?id=${userId}`)}
              className="flex items-center gap-1 text-sm text-gray-400 transition hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              Projects Management
            </button>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Project Override Management</h2>
          <p className="mt-1 text-sm text-gray-500">Manual intervention for project records and workflows.</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs font-medium text-green-700">Active</span>
        </div>
      </div>

      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Override committed successfully. Changes have been logged to the audit trail.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 pb-36">
        {/* Row 1 — Identity & Location */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {/* PROJECT IDENTITY & STATUS */}
          <SectionCard
            icon={
              <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
            }
            title="Project Identity & Status"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
              {/* Project Image with code overlay */}
              <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-lg border border-gray-200 sm:h-auto sm:w-72">
                {project.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.imageUrl}
                    alt="Project"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-56 w-full items-center justify-center bg-gray-900 text-gray-600">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-black/60 py-2 text-center">
                  <span className="font-mono text-xs font-medium text-gray-200"># {project.projectCode}</span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <FieldLabel required>Project Title</FieldLabel>
                  <TextInput value={form.title} onChange={(v) => set("title", v)} required />
                </div>
                {/* Project Cost | Current Status */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <FieldLabel required>Project Cost</FieldLabel>
                    <div className="flex items-center rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500">
                      <span className="pl-3 text-sm text-gray-400">₱</span>
                      <input
                        type="text"
                        value={projectCostDisplay}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/,/g, "");
                          setProjectCostDisplay(raw);
                          set("projectCost", parseFloat(raw) || 0);
                        }}
                        onBlur={() => setProjectCostDisplay(formatCurrency(form.projectCost))}
                        className="flex-1 rounded-r-lg py-2 pr-3 text-sm text-gray-800 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <FieldLabel required>Current Status</FieldLabel>
                    <select
                      value={form.status}
                      onChange={(e) => set("status", e.target.value as typeof form.status)}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${STATUS_STYLES[form.status] ?? "border-gray-200 text-gray-800"} border-gray-200`}
                    >
                      {PROJECT_STATUS_ORDER.map((k) => (
                        <option key={k} value={k}>
                          {PROJECT_STATUS_LABEL[k]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Track Number | Implementation Mode */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <FieldLabel>Track Number</FieldLabel>
                    <TextInput value={project.projectCode} disabled />
                  </div>
                  <div>
                    <FieldLabel required>Implementation Mode</FieldLabel>
                    <select
                      value={form.modeOfImplementation}
                      onChange={(e) => {
                        const mode = e.target.value as typeof form.modeOfImplementation;
                        set("modeOfImplementation", mode);
                        // The disbursement type options depend on the mode, so
                        // drop a selection that is no longer valid.
                        if (newDisbType && !MODE_TO_DISBURSEMENT_TYPES[mode].includes(newDisbType)) {
                          setNewDisbType("");
                        }
                      }}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="BY_CONTRACT">By Contract</option>
                      <option value="BY_ADMINISTRATION">By Administration</option>
                    </select>
                  </div>
                </div>
                {/* Contractor Name | Physical Progress */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <FieldLabel>Contractor Name</FieldLabel>
                    <TextInput
                      value={form.contractorName}
                      onChange={(v) => set("contractorName", v)}
                      placeholder="Enter contractor"
                      disabled={form.modeOfImplementation !== "BY_CONTRACT"}
                    />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Physical Progress
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Real-Time ({project.completionPercentage}%)
                      </span>
                    </div>
                    <div className="flex h-9 items-center">
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-2.5 rounded-full bg-blue-900 transition-all"
                          style={{ width: `${project.completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* PROJECT LOCATION */}
          <SectionCard
            icon={
              <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            }
            title="Project Location"
          >
            <div className="space-y-3">
              <div>
                <FieldLabel required>District</FieldLabel>
                <select
                  value={form.locationImplementation}
                  onChange={(e) => set("locationImplementation", e.target.value as typeof form.locationImplementation)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DISTRICT_I">District 1</option>
                  <option value="DISTRICT_II">District 2</option>
                </select>
              </div>
              <div>
                <FieldLabel required>Municipality</FieldLabel>
                <TextInput value={form.cityMunicipality} onChange={(v) => set("cityMunicipality", v)} placeholder="Enter municipality" />
              </div>
              <div>
                <FieldLabel required>Barangay</FieldLabel>
                <TextInput value={form.barangay} onChange={(v) => set("barangay", v)} placeholder="Enter barangay" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <FieldLabel>Purok</FieldLabel>
                  <TextInput value={form.purok} onChange={(v) => set("purok", v)} placeholder="e.g. Purok 4" />
                </div>
                <div>
                  <FieldLabel>Sitio</FieldLabel>
                  <TextInput value={form.sitio} onChange={(v) => set("sitio", v)} placeholder="N/A" />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* FUNDING INFORMATION */}
        <SectionCard
          icon={
            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
            </svg>
          }
          title="Funding Information"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-3">
            {/* Column 1 — budget & supplemental budget */}
            <div className="space-y-4">
              <div>
                <FundLabel>Budget Year</FundLabel>
                <FundSelect
                  value={form.budgetYear}
                  onChange={(e) => set("budgetYear", e.target.value)}
                >
                  <option value="">Select Year</option>
                  {budgetYearOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </FundSelect>
              </div>
              <div>
                <FundLabel>Source of Fund</FundLabel>
                <FundSelect
                  value={form.sourceOfFund}
                  onChange={(e) => {
                    // Program and Project hang off the source, so a new source
                    // clears both rather than leaving an impossible pairing.
                    set("sourceOfFund", e.target.value as SourceOfFundValue);
                    set("program", "");
                    set("subType", "");
                  }}
                >
                  {SOURCE_OF_FUND_ORDER.map((k) => (
                    <option key={k} value={k}>{SOURCE_OF_FUND_LABEL[k]}</option>
                  ))}
                </FundSelect>
              </div>
              <div>
                <FundLabel>Supplemental Budget Year</FundLabel>
                <FundSelect
                  value={form.supplementalBudgetYear}
                  onChange={(e) => set("supplementalBudgetYear", e.target.value)}
                >
                  <option value="">Select Year</option>
                  {SUPPLEMENTAL_BUDGET_YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </FundSelect>
              </div>
              <div>
                <FundLabel>Supplemental Budget Number</FundLabel>
                <FundSelect
                  value={form.supplementalBudgetNumber}
                  onChange={(e) => set("supplementalBudgetNumber", e.target.value)}
                >
                  <option value="">Select SB No.</option>
                  {SUPPLEMENTAL_BUDGET_NUMBERS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </FundSelect>
              </div>
            </div>

            {/* Column 2 — program cascade, account & LANDBANK reference */}
            <div className="space-y-4">
              <div>
                <FundLabel>Program</FundLabel>
                <FundSelect
                  value={form.program}
                  onChange={(e) => {
                    const next = e.target.value;
                    set("program", next);
                    // Drop a Project that this Program does not offer.
                    const allowed = projectOptions(next, customOptions);
                    if (!allowed.some((o) => o.value === form.subType)) set("subType", "");
                  }}
                  disabled={availablePrograms.length === 0}
                >
                  <option value="">
                    {availablePrograms.length === 0 ? "No programs available" : "Select Program"}
                  </option>
                  {availablePrograms.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}{o.custom ? " (added)" : ""}
                    </option>
                  ))}
                </FundSelect>
              </div>
              <div>
                <FundLabel>Project</FundLabel>
                <FundSelect
                  value={form.subType}
                  onChange={(e) => set("subType", e.target.value)}
                  disabled={!form.program || availableProjects.length === 0}
                >
                  <option value="">
                    {!form.program
                      ? "Select Program first"
                      : availableProjects.length === 0
                        ? "No projects available"
                        : "Select Project"}
                  </option>
                  {availableProjects.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}{o.custom ? " (added)" : ""}
                    </option>
                  ))}
                </FundSelect>
              </div>
              <div>
                <FundLabel>Project Account</FundLabel>
                <FundSelect
                  value={form.projectAccount}
                  onChange={(e) => set("projectAccount", e.target.value as "" | ProjectAccountValue)}
                >
                  <option value="">Select Classification</option>
                  {PROJECT_ACCOUNT_VALUES.map((k) => (
                    <option key={k} value={k}>{PROJECT_ACCOUNT_LABEL[k]}</option>
                  ))}
                </FundSelect>
              </div>
              <div>
                <FundLabel>* LANDBANK [LBP-TL#]</FundLabel>
                <FundSelect
                  value={form.landbankNumber}
                  onChange={(e) => set("landbankNumber", e.target.value)}
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
                </FundSelect>
              </div>
            </div>

            {/* Column 3 — Manual Entry: super admins extend the lists above */}
            <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-4">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Manual Entry
              </p>

              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Add Program
              </p>
              <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <FundInput
                  type="text"
                  value={newProgramName}
                  onChange={(e) => setNewProgramName(e.target.value)}
                  placeholder="Enter program name..."
                />
                <FundSelect
                  value={newProgramSource}
                  onChange={(e) => setNewProgramSource(e.target.value as "" | SourceOfFundValue)}
                >
                  <option value="">Select Source</option>
                  {SOURCE_OF_FUND_ORDER.map((k) => (
                    <option key={k} value={k}>{SOURCE_OF_FUND_LABEL[k]}</option>
                  ))}
                </FundSelect>
              </div>

              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Add Project
              </p>
              <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <FundInput
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name..."
                />
                <FundSelect
                  value={newProjectProgram}
                  onChange={(e) => setNewProjectProgram(e.target.value)}
                >
                  <option value="">Select Program</option>
                  {manualEntryPrograms.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}{o.custom ? " (added)" : ""}
                    </option>
                  ))}
                </FundSelect>
              </div>

              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Add LBP-Term Loan No.
              </p>
              <FundInput
                type="text"
                value={newLandbankNumber}
                onChange={(e) => setNewLandbankNumber(e.target.value)}
                placeholder="e.g. 28"
                className="mb-4 bg-white"
              />

              <button
                type="button"
                onClick={handleManualAdd}
                disabled={isAddingOption || !canAddOption}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blue-800 disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {isAddingOption ? "Adding…" : "Add"}
              </button>
              {manualError && <p className="mt-2 text-xs text-red-500">{manualError}</p>}
              <p className="mt-2 text-[10px] leading-relaxed text-gray-400">
                Added entries appear in the Program, Project and LANDBANK dropdowns
                here and on the admin create/update project forms.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* FINANCIAL SUMMARY */}
        <SectionCard
          icon={
            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
            </svg>
          }
          title="Financial Summary"
        >
          {/* Balance tiles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50/60 px-4 py-3.5">
              <p className="text-sm font-bold text-blue-800">Total Remaining Balance</p>
              <p className={`mt-1 text-xl font-extrabold ${totalRemainingBalance <= 100000 ? "text-red-700" : "text-blue-900"}`}>
                ₱ {formatCurrency(totalRemainingBalance)}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50/60 px-4 py-3.5">
              <p className="text-sm font-bold text-blue-800">Primary Fund Balance</p>
              <p className="mt-1 text-lg font-extrabold text-gray-900">
                ₱ {formatCurrency(primaryBalance)}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50/60 px-4 py-3.5">
              <p className="text-sm font-bold text-blue-800">Variation Order Balance</p>
              <p className="mt-1 text-lg font-extrabold text-gray-900">
                ₱ {formatCurrency(variationBalance)}
              </p>
            </div>
          </div>
          <p className="mt-2 text-[10px] italic uppercase tracking-wide text-gray-400">
            * Calculated from {primaryFundLabel} project cost vs recorded disbursements, plus {variationFundLabel}
          </p>

          {/* Recent Disbursements */}
          <div className="mt-6">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Recent Disbursements
            </p>
            <div className="overflow-auto rounded-lg border border-gray-200" style={{ maxHeight: "268px" }}>
              <table className="w-full min-w-175 border-separate border-spacing-0 text-xs">
                <thead className="sticky top-0 z-10 bg-gray-50">
                  <tr className="[&>th]:border-b [&>th]:border-gray-100">
                    <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Date</th>
                    <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Reference #</th>
                    <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Source of Fund</th>
                    <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Type</th>
                    <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Remarks</th>
                    <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">Amount (₱)</th>
                    <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {disbursements.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-6 text-center text-gray-400">
                        No disbursements recorded yet.
                      </td>
                    </tr>
                  ) : (
                    disbursements.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50/50">
                        <td className="px-3 py-2.5 text-gray-600">
                          {new Date(d.date).toLocaleDateString("en-PH", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-gray-700">{d.referenceNumber ?? "—"}</td>
                        <td className="px-3 py-2.5 text-gray-700">{primaryFundLabel}</td>
                        <td className="px-3 py-2.5 text-gray-700">
                          {d.type ? DISBURSEMENT_TYPE_LABEL[d.type] : "—"}
                        </td>
                        <td className="max-w-50 px-3 py-2.5 text-gray-600">{d.remarks ?? "—"}</td>
                        <td className="px-3 py-2.5 text-right font-semibold text-gray-900">
                          {formatCurrency(d.amount)}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <button
                            type="button"
                            disabled={deleteDisbursement.isPending}
                            onClick={() => deleteDisbursement.mutate({ id: d.id })}
                            className="rounded p-1 text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            aria-label="Delete disbursement"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Record new disbursement */}
            <div className="mt-3 flex flex-wrap gap-2 rounded-lg border border-gray-200 p-3">
              <div className="relative w-full shrink-0 sm:w-36">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₱</span>
                <FundInput
                  type="text"
                  value={newDisbAmt}
                  onChange={(e) => setNewDisbAmt(e.target.value)}
                  placeholder="Amount"
                  className="pl-7"
                />
              </div>
              <FundInput
                type="text"
                value={newDisbRef}
                onChange={(e) => setNewDisbRef(e.target.value)}
                placeholder="Ref #"
                className="w-full shrink-0 sm:w-32"
              />
              <div className="w-full shrink-0 sm:w-52">
                <FundSelect
                  value={newDisbType}
                  onChange={(e) => setNewDisbType(e.target.value as typeof newDisbType)}
                >
                  <option value="">Select Type</option>
                  {MODE_TO_DISBURSEMENT_TYPES[
                    form.modeOfImplementation === "BY_ADMINISTRATION" ? "BY_ADMINISTRATION" : "BY_CONTRACT"
                  ].map((t) => (
                    <option key={t} value={t}>{DISBURSEMENT_TYPE_LABEL[t]}</option>
                  ))}
                </FundSelect>
              </div>
              <FundInput
                type="text"
                value={newDisbRemarks}
                onChange={(e) => setNewDisbRemarks(e.target.value)}
                placeholder="Remarks"
                className="min-w-40 flex-1"
              />
              <button
                type="button"
                disabled={!newDisbAmt || createDisbursement.isPending}
                onClick={() => {
                  const amount = parseFloat(newDisbAmt.replace(/,/g, ""));
                  if (!amount || isNaN(amount)) return;
                  createDisbursement.mutate({
                    projectId,
                    amount,
                    referenceNumber: newDisbRef || undefined,
                    type: newDisbType || undefined,
                    remarks: newDisbRemarks || undefined,
                  });
                }}
                className="rounded-lg bg-blue-900 px-8 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blue-800 disabled:opacity-50"
              >
                {createDisbursement.isPending ? "..." : "Record"}
              </button>
            </div>
          </div>

          {/* Revised Contract Cost History */}
          <div className="mt-6">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Revised Contract Cost History
            </p>
            <div className="overflow-auto rounded-lg border border-gray-200" style={{ maxHeight: "268px" }}>
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
                  {variationOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-3 py-6 text-center text-gray-400">
                        No revised contract cost history yet.
                      </td>
                    </tr>
                  ) : (
                    (() => {
                      // Each order revises the running total, so the "Original Cost"
                      // of a row is the revised total of the row before it.
                      let running = form.projectCost;
                      return variationOrders.map((vo) => {
                        const original = running;
                        running += vo.amount;
                        return (
                          <tr key={vo.id} className="hover:bg-gray-50/50">
                            <td className="px-3 py-2.5 text-gray-600">
                              {new Date(vo.date).toLocaleDateString("en-PH", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-3 py-2.5 text-gray-700">{formatCurrency(original)}</td>
                            <td className="px-3 py-2.5 text-gray-700">
                              {vo.sourceOfFund
                                ? (SOURCE_OF_FUND_LABEL[vo.sourceOfFund] ?? vo.sourceOfFund)
                                : primaryFundLabel}
                            </td>
                            <td className="px-3 py-2.5 text-gray-700">{programLabel(vo.program)}</td>
                            <td className="px-3 py-2.5 text-gray-700">{projectLabel(vo.subType)}</td>
                            <td className="px-3 py-2.5 text-gray-700">{formatCurrency(vo.amount)}</td>
                            <td className="px-3 py-2.5 text-right font-semibold text-gray-900">
                              {formatCurrency(running)}
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              <button
                                type="button"
                                disabled={deleteVariationOrder.isPending}
                                onClick={() => deleteVariationOrder.mutate({ id: vo.id })}
                                className="rounded p-1 text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                aria-label="Delete variation order"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })()
                  )}
                </tbody>
              </table>
            </div>

            {/* Record new variation order */}
            <div className="mt-3 grid grid-cols-1 items-end gap-3 rounded-lg border border-gray-200 p-3 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Source of Fund</p>
                <FundSelect
                  value={newVoSource}
                  onChange={(e) => {
                    setNewVoSource(e.target.value);
                    setNewVoProgram("");
                    setNewVoProject("");
                  }}
                >
                  <option value="">Select Source</option>
                  {SOURCE_OF_FUND_ORDER.map((k) => (
                    <option key={k} value={k}>{SOURCE_OF_FUND_LABEL[k]}</option>
                  ))}
                </FundSelect>
              </div>
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Program</p>
                <FundSelect
                  value={newVoProgram}
                  onChange={(e) => {
                    setNewVoProgram(e.target.value);
                    setNewVoProject("");
                  }}
                  disabled={!newVoSource || voPrograms.length === 0}
                >
                  <option value="">Select Program</option>
                  {voPrograms.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}{o.custom ? " (added)" : ""}
                    </option>
                  ))}
                </FundSelect>
              </div>
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Project</p>
                <FundSelect
                  value={newVoProject}
                  onChange={(e) => setNewVoProject(e.target.value)}
                  disabled={!newVoProgram || voProjects.length === 0}
                >
                  <option value="">Select Project</option>
                  {voProjects.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}{o.custom ? " (added)" : ""}
                    </option>
                  ))}
                </FundSelect>
              </div>
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Amount</p>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₱</span>
                  <FundInput
                    type="text"
                    value={newVoAmt}
                    onChange={(e) => setNewVoAmt(e.target.value)}
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
              </div>
              <button
                type="button"
                disabled={!newVoAmt || createVariationOrder.isPending}
                onClick={() => {
                  const amount = parseFloat(newVoAmt.replace(/,/g, ""));
                  if (!amount || isNaN(amount)) return;
                  createVariationOrder.mutate({
                    projectId,
                    amount,
                    sourceOfFund: newVoSource ? (newVoSource as SourceOfFundValue) : undefined,
                    program: newVoProgram || null,
                    subType: newVoProject || null,
                  });
                }}
                className="h-9.5 rounded-lg bg-blue-900 px-8 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blue-800 disabled:opacity-50"
              >
                {createVariationOrder.isPending ? "..." : "Record"}
              </button>
            </div>
          </div>
        </SectionCard>

        {/* PROJECT TIMELINE */}
        <SectionCard
          icon={
            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          }
          title="Project Timeline"
        >
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Timeline Adjustment History
          </p>
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full min-w-150 text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">Start Date</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">End Date</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">Duration</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">Adjustment Type</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">Justification Record</th>
                  <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {timelineAdjustments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-xs text-gray-400">
                      No timeline adjustments recorded yet.
                    </td>
                  </tr>
                ) : (
                  timelineAdjustments.map((tl) => (
                    <tr key={tl.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {new Date(tl.startDate).toLocaleDateString("en-PH", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {new Date(tl.endDate).toLocaleDateString("en-PH", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-gray-800">
                        {tl.duration} Days
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                          {tl.type}
                        </span>
                      </td>
                      <td className="max-w-md px-4 py-3 text-xs italic text-gray-600">
                        {tl.justification ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          disabled={deleteTimelineAdjustment.isPending}
                          onClick={() => deleteTimelineAdjustment.mutate({ id: tl.id })}
                          className="rounded p-1 text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          aria-label="Delete timeline adjustment"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Record new timeline adjustment */}
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-gray-50 p-3">
            <input
              type="date"
              value={newTlStart}
              onChange={(e) => setNewTlStart(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={newTlEnd}
              onChange={(e) => setNewTlEnd(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex w-28 items-center justify-between rounded-lg border border-gray-200 bg-gray-100 px-3 py-2">
              <span className="text-sm font-semibold text-gray-700">{newTlDuration}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Days</span>
            </div>
            <select
              value={newTlType}
              onChange={(e) => setNewTlType(e.target.value as typeof newTlType)}
              className="w-40 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Type</option>
              <option value="EXTENSION">Extension</option>
              <option value="SUSPENSION">Suspension</option>
              <option value="RESUMPTION">Resumption</option>
              <option value="REVISION">Revision</option>
            </select>
            <input
              type="text"
              value={newTlJustification}
              onChange={(e) => setNewTlJustification(e.target.value)}
              placeholder="Justification / Basis..."
              className="flex-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              disabled={!newTlStart || !newTlEnd || !newTlType || createTimelineAdjustment.isPending}
              onClick={() => {
                if (!newTlStart || !newTlEnd || !newTlType) return;
                createTimelineAdjustment.mutate({
                  projectId,
                  startDate: new Date(newTlStart),
                  endDate: new Date(newTlEnd),
                  duration: newTlDuration,
                  type: newTlType,
                  justification: newTlJustification || undefined,
                });
              }}
              className="rounded-lg bg-blue-900 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-blue-800 disabled:opacity-50"
            >
              {createTimelineAdjustment.isPending ? "..." : "Record"}
            </button>
          </div>
        </SectionCard>

        {/* Row — Workforce + In-Charge */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {/* WORKFORCE DISTRIBUTION */}
          <SectionCard
            icon={
              <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            }
            title="Workforce Distribution"
            badge={
              <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-green-600">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                Live
              </span>
            }
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-sm border border-gray-200 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Female</p>
                <div className="mt-1 flex items-center justify-between">
                  <input
                    type="number"
                    min={0}
                    value={form.numFemale}
                    onChange={(e) => set("numFemale", parseInt(e.target.value) || 0)}
                    className="w-16 bg-transparent text-4xl font-bold text-gray-800 focus:outline-none"
                  />
                  <span className="text-2xl text-gray-300">♀</span>
                </div>
              </div>
              <div className="rounded-sm border border-gray-200 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Male</p>
                <div className="mt-1 flex items-center justify-between">
                  <input
                    type="number"
                    min={0}
                    value={form.numMale}
                    onChange={(e) => set("numMale", parseInt(e.target.value) || 0)}
                    className="w-16 bg-transparent text-4xl font-bold text-gray-800 focus:outline-none"
                  />
                  <span className="text-2xl text-gray-300">♂</span>
                </div>
              </div>
              <div className="rounded-sm border border-gray-200 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Total</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-4xl font-bold text-blue-900">{form.numFemale + form.numMale}</span>
                  <svg className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* PROJECT IN-CHARGE & PROFILE */}
          <SectionCard
            icon={
              <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            }
            title="Project In-Charge & Profile"
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <FieldLabel>Engineers In-Charge</FieldLabel>
                <div className="flex flex-wrap items-center gap-2">
                  {engineers.map((eng, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700"
                    >
                      {eng}
                      <button
                        type="button"
                        onClick={() => {
                          const next = engineers.filter((_, j) => j !== i);
                          set("projectEngineer", next.join(", "));
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="+ Add Engineer"
                    className="w-32 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val) {
                          set("projectEngineer", [...engineers, val].join(", "));
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-gray-400">Press Enter or comma to add</p>
              </div>
              <div>
                <FieldLabel>Project Profile</FieldLabel>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={5}
                  placeholder="Comprehensive description of project scope..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* PROJECT DOCUMENTATION */}
        <SectionCard
          icon={
            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
          }
          title="Project Documentation"
          badge={<></>}
        >
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full min-w-150 text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">File Name</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">Type</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">Upload Date</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">Uploaded By</th>
                  <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {projectFiles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-gray-400">
                      No documents uploaded yet.
                    </td>
                  </tr>
                ) : (
                  projectFiles.map((f) => {
                    const isImage = f.fileType === "IMAGE" || /\.(jpg|jpeg|png|webp|gif)$/i.exec(f.fileName);
                    return (
                      <tr key={f.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded ${isImage ? "bg-blue-50" : "bg-red-50"}`}>
                              {isImage ? (
                                <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M2.25 19.5h19.5M2.25 4.5h19.5" /></svg>
                              ) : (
                                <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                              )}
                            </div>
                            <span className="font-semibold text-gray-800">{f.fileName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                            {f.fileType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {new Date(f.createdAt).toLocaleDateString("en-PH", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {f.createdBy.name ?? f.createdBy.email}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-3">
                            <a href={f.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 transition hover:text-blue-700" title="View">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                            </a>
                            <a href={f.fileUrl} download={f.fileName} className="text-green-600 transition hover:text-green-700" title="Download">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                            </a>
                            <button
                              type="button"
                              disabled={deleteProjectFile.isPending}
                              onClick={() => {
                                if (confirm(`Delete "${f.fileName}"?`)) deleteProjectFile.mutate({ id: f.id });
                              }}
                              className="text-red-500 transition hover:text-red-600 disabled:opacity-50"
                              title="Delete"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* TASK NOTIFICATION */}
        <SectionCard
          icon={
            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          }
          title="Task Notification"
        >
          {notifSuccess && (
            <div className="mb-3 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
              Notification sent successfully.
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left — user + priority */}
            <div className="space-y-4">
              <div>
                <FieldLabel required>Select User to Notify</FieldLabel>
                <select
                  value={notifUserId}
                  onChange={(e) => setNotifUserId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select user --</option>
                  {(users ?? []).map((u) => (
                    <option key={u.id} value={u.id}>
                      {`${u.name ?? "Unnamed"} — ${u.email}${u.employeeId ? ` (${u.employeeId})` : ""}`}
                    </option>
                  ))}
                </select>
                {users?.length === 0 && (
                  <p className="mt-1 text-xs text-amber-600">
                    No active users available — activate users first.
                  </p>
                )}
              </div>
              <div>
                <FieldLabel required>Priority Level</FieldLabel>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PRIORITY_LEVELS.map((p) => {
                    const selected = notifPriority === p.value;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setNotifPriority(p.value)}
                        className={`relative flex flex-col items-center justify-center gap-1 rounded-sm border-2 px-2 py-3 transition ${selected ? p.selectedCard : "border-gray-200 bg-white hover:border-gray-300"}`}
                      >
                        {selected && (
                          <span className={`absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-white ${p.checkBg}`}>
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          </span>
                        )}
                        {p.icon}
                        <span className="text-xs font-bold uppercase tracking-wide text-gray-700">{p.label}</span>
                        <span className="text-[10px] font-medium text-gray-400">{p.days}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right — task description */}
            <div className="flex flex-col">
              <FieldLabel required>Task Description / Instructions</FieldLabel>
              <textarea
                value={notifDesc}
                onChange={(e) => setNotifDesc(e.target.value)}
                placeholder="Type instructions or task details here..."
                className="min-h-40 flex-1 resize-y rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              disabled={!notifUserId || !notifDesc.trim() || sendNotification.isPending}
              onClick={() => {
                if (!notifUserId || !notifDesc.trim()) return;
                sendNotification.mutate({
                  projectId,
                  notifyUserId: notifUserId,
                  priority: notifPriority,
                  description: notifDesc,
                });
              }}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-blue-800 disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
              {sendNotification.isPending ? "Sending..." : "Send Notification"}
            </button>
          </div>
        </SectionCard>

        {/* ADMINISTRATIVE AUTHORIZATION */}
        <div className="rounded-sm bg-gray-900 px-6 py-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 4.556-3.04 8.4-7.2 9.6a.75.75 0 0 1-.6 0C9.04 20.4 6 16.556 6 12V6.741a.75.75 0 0 1 .53-.717A11.21 11.21 0 0 0 12 3.74a11.21 11.21 0 0 0 5.47 2.284.75.75 0 0 1 .53.717V12Z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-200">Administrative Authorization</span>
          </div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Reason for Comprehensive Update <span className="text-red-400">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="State legal or administrative basis for manual data changes..."
            className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-400">
            <svg className="h-3.5 w-3.5 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <span><span className="font-semibold text-gray-300">Mandatory:</span> These changes will be signed and logged in the immutable system audit trail.</span>
          </p>
        </div>

        {/* ADMINISTRATIVE UPDATE HISTORY AUDIT TRAIL */}
        <div className="rounded-sm border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-800">Administrative Update History Audit Trail</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-150 text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Administrator</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Source of Fund</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Justification Record</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Auth Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {overrideActivities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm text-gray-400">
                      No administrative update history yet.
                    </td>
                  </tr>
                ) : (
                  overrideActivities.map((activity) => {
                    const initials = activity.createdBy.name
                      ? activity.createdBy.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                      : (activity.createdBy.email?.[0] ?? "U").toUpperCase();
                    const reasonText = activity.description.replace("[OVERRIDE] ", "");
                    return (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">
                          {new Date(activity.createdAt).toLocaleString("en-PH")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                              {initials}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {activity.createdBy.name ?? activity.createdBy.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {SOURCE_OF_FUND_LABEL[project.sourceOfFund] ?? project.sourceOfFund}
                        </td>
                        <td className="max-w-xs px-4 py-3 text-sm text-gray-600">
                          <span className="line-clamp-2 italic">{reasonText}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Verified
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {overrideActivities.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
              Showing 1 to {overrideActivities.length} of {overrideActivities.length} results
            </div>
          )}
        </div>

        {/* FIXED ACTION BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] sm:px-6">
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={override.isPending}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel Changes
            </button>
            <button
              type="submit"
              disabled={override.isPending || !reason.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {override.isPending ? (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              )}
              {override.isPending ? "Saving…" : "Commit & Save Updates"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
