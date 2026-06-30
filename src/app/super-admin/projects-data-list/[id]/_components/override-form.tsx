"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
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

const STATUS_STYLES: Record<string, string> = {
  ON_GOING: "bg-green-100 text-green-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  SUSPENDED: "bg-red-100 text-red-700",
  NOT_YET_STARTED: "bg-gray-100 text-gray-600",
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
};

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
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
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

export function OverrideForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const utils = api.useUtils();

  const { data: project, isLoading } = api.project.getById.useQuery({ id: projectId });
  const { data: activities } = api.projectActivity.getByProjectId.useQuery({ projectId });
  const { data: disbursementsData, refetch: refetchDisbursements } = api.project.getDisbursements.useQuery({ projectId });
  const { data: users } = api.user.getForSelect.useQuery();

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
    },
  });

  const sendNotification = api.project.sendTaskNotification.useMutation({
    onSuccess: () => {
      setNotifUserId("");
      setNotifPriority("MEDIUM");
      setNotifDesc("");
      setNotifSuccess(true);
      setTimeout(() => setNotifSuccess(false), 3000);
    },
  });

  const [form, setForm] = useState({
    title: "",
    projectCost: 0,
    modeOfImplementation: "BY_CONTRACT" as "BY_ADMINISTRATION" | "BY_CONTRACT",
    locationImplementation: "DISTRICT_I" as "DISTRICT_I" | "DISTRICT_II",
    status: "ON_GOING" as ProjectStatusValue,
    sourceOfFund: "GENERAL_FUND" as SourceOfFundValue,
    subType: "" as string,
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
  const [contractCostDisplay, setContractCostDisplay] = useState("");

  // Disbursement inputs
  const [newDisbAmt, setNewDisbAmt] = useState("");
  const [newDisbRef, setNewDisbRef] = useState("");

  // Task notification
  const [notifUserId, setNotifUserId] = useState("");
  const [notifPriority, setNotifPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
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
    setContractCostDisplay(formatCurrency(project.contractCost));
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
    if (!reason.trim()) return;

    override.mutate({
      id: projectId,
      reason,
      title: form.title,
      projectCost: form.projectCost,
      modeOfImplementation: form.modeOfImplementation,
      locationImplementation: form.locationImplementation,
      status: form.status,
      sourceOfFund: form.sourceOfFund,
      subType: form.subType ? (form.subType as ProjectSubTypeValue) : null,
      budgetYear: form.budgetYear || undefined,
      contractCost: form.contractCost,
      contractorName: form.modeOfImplementation === "BY_CONTRACT" ? form.contractorName || undefined : undefined,
      projectEngineer: form.projectEngineer || undefined,
      dateStarted: form.dateStarted ? new Date(form.dateStarted) : null,
      targetCompletionDate: form.targetCompletionDate ? new Date(form.targetCompletionDate) : null,
      revisedCompletionDate: form.revisedCompletionDate ? new Date(form.revisedCompletionDate) : null,
      numFemale: form.numFemale,
      numMale: form.numMale,
      numManDays: form.numManDays,
      district: form.district ? (form.district as "DISTRICT_I" | "DISTRICT_II") : null,
      cityMunicipality: form.cityMunicipality || undefined,
      barangay: form.barangay || undefined,
      purok: form.purok || undefined,
      sitio: form.sitio || undefined,
      description: form.description || undefined,
    });
  }

  const engineers = form.projectEngineer
    ? form.projectEngineer.split(",").map((e) => e.trim()).filter(Boolean)
    : [];

  const totalDays =
    form.dateStarted && form.targetCompletionDate
      ? Math.ceil(
        (new Date(form.targetCompletionDate).getTime() - new Date(form.dateStarted).getTime()) /
        (1000 * 60 * 60 * 24),
      )
      : (project?.duration ?? 0);

  const disbursements = disbursementsData ?? [];
  const totalDisbursed = disbursements.reduce((sum, d) => sum + d.amount, 0);
  const remainingBalance = form.projectCost - totalDisbursed;

  const overrideActivities = (activities ?? []).filter((a) =>
    a.description.startsWith("[OVERRIDE]"),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <svg className="h-8 w-8 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
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
      <div className="mb-6 flex items-center justify-between">
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
          <h2 className="text-2xl font-bold text-gray-900">Override Management</h2>
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
        <div className="grid grid-cols-2 gap-4">
          {/* PROJECT IDENTITY & STATUS */}
          <SectionCard
            icon={
              <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
            }
            title="Project Identity & Status"
          >
            <div className="flex gap-4 items-stretch">
              {/* Project Image */}
              <div className="shrink-0 flex flex-col w-96">
                {project.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.imageUrl}
                    alt="Project"
                    className="flex-1 w-full rounded-lg object-cover border border-gray-200"
                  />
                ) : (
                  <div className="flex flex-1 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-300">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    <span className="sr-only"># {project.projectCode}</span>
                  </div>
                )}
                <p className="mt-1 text-center text-[10px] text-gray-400 font-mono"># {project.projectCode}</p>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <FieldLabel required>Project Title</FieldLabel>
                  <TextInput value={form.title} onChange={(v) => set("title", v)} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
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
                    <FieldLabel>Track Number</FieldLabel>
                    <TextInput value={project.projectCode} disabled />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel required>Implementation Mode</FieldLabel>
                    <select
                      value={form.modeOfImplementation}
                      onChange={(e) => set("modeOfImplementation", e.target.value as typeof form.modeOfImplementation)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="BY_CONTRACT">By Contract</option>
                      <option value="BY_ADMINISTRATION">By Administration</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel required>Contract Cost</FieldLabel>
                    <div className="flex items-center rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500">
                      <span className="pl-3 text-sm text-gray-400">₱</span>
                      <input
                        type="text"
                        value={contractCostDisplay}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/,/g, "");
                          setContractCostDisplay(raw);
                          set("contractCost", parseFloat(raw) || 0);
                        }}
                        onBlur={() => setContractCostDisplay(formatCurrency(form.contractCost))}
                        className="flex-1 rounded-r-lg py-2 pr-3 text-sm text-gray-800 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
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
                  <div>
                    <FieldLabel>Contractor Name</FieldLabel>
                    <TextInput
                      value={form.contractorName}
                      onChange={(v) => set("contractorName", v)}
                      placeholder="Enter contractor"
                      disabled={form.modeOfImplementation !== "BY_CONTRACT"}
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel>Project Progress</FieldLabel>
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all"
                        style={{ width: `${project.completionPercentage}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs font-semibold text-gray-600">
                      {project.completionPercentage}%
                    </span>
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
              <div className="grid grid-cols-2 gap-3">
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

        {/* FUNDING & DISBURSEMENT TRACKING */}
        <SectionCard
          icon={
            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>
          }
          title="Funding & Disbursement Tracking"
        >
          <div className="grid grid-cols-3 gap-6">
            {/* Left — fund fields */}
            <div className="space-y-3">
              <div>
                <FieldLabel required>Source of Fund</FieldLabel>
                <select
                  value={form.sourceOfFund}
                  onChange={(e) => {
                    const next = e.target.value as SourceOfFundValue;
                    set("sourceOfFund", next);
                    const allowed = SOURCE_TO_SUB_TYPES[next];
                    if (!allowed.includes(form.subType as ProjectSubTypeValue)) {
                      set("subType", "");
                    }
                  }}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SOURCE_OF_FUND_ORDER.map((k) => (
                    <option key={k} value={k}>
                      {SOURCE_OF_FUND_LABEL[k]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Sub-Category</FieldLabel>
                <select
                  value={form.subType}
                  onChange={(e) => set("subType", e.target.value)}
                  disabled={
                    (SOURCE_TO_SUB_TYPES[form.sourceOfFund]?.length ?? 0) === 0
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">
                    {(SOURCE_TO_SUB_TYPES[form.sourceOfFund]?.length ?? 0) === 0
                      ? "No sub-categories available"
                      : "-- None --"}
                  </option>
                  {SOURCE_TO_SUB_TYPES[form.sourceOfFund].map((k) => (
                    <option key={k} value={k}>
                      {PROJECT_SUB_TYPE_LABEL[k]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Budget Year</FieldLabel>
                <input
                  type="text"
                  value={form.budgetYear}
                  onChange={(e) => set("budgetYear", e.target.value)}
                  placeholder="e.g. 2024"
                  maxLength={4}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-500">Remaining Balance</p>
                <p className="mt-1 text-xl font-bold text-blue-700">
                  ₱{formatCurrency(remainingBalance)}
                </p>
                <p className="mt-0.5 text-[10px] text-blue-400">
                  Calculated: Project Cost − Total Disbursements
                </p>
              </div>
            </div>

            {/* Right — Recent Disbursements */}
            <div className="col-span-2">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Recent Disbursements
              </p>
              <div className="overflow-hidden rounded-lg border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">Date</th>
                      <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">Reference / Check #</th>
                      <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">Amount (₱)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {disbursements.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-xs text-gray-400">
                          No disbursements recorded yet.
                        </td>
                      </tr>
                    ) : (
                      disbursements.map((d) => (
                        <tr key={d.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-xs text-gray-600">
                            {new Date(d.date).toLocaleDateString("en-PH", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-3 py-2 font-mono text-xs text-gray-600">
                            {d.referenceNumber ?? "—"}
                          </td>
                          <td className="px-3 py-2 text-right text-xs font-medium text-gray-800">
                            {formatCurrency(d.amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Record new disbursement */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex flex-1 items-center rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="pl-3 text-sm text-gray-400">₱</span>
                  <input
                    type="text"
                    value={newDisbAmt}
                    onChange={(e) => setNewDisbAmt(e.target.value)}
                    placeholder="Amount"
                    className="flex-1 py-2 px-2 text-sm text-gray-800 focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  value={newDisbRef}
                  onChange={(e) => setNewDisbRef(e.target.value)}
                  placeholder="Ref #"
                  className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    });
                  }}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {createDisbursement.isPending ? "..." : "Record"}
                </button>
              </div>

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
          <div className="grid grid-cols-4 gap-4">
            <div>
              <FieldLabel>Date Started</FieldLabel>
              <input
                type="date"
                value={form.dateStarted}
                onChange={(e) => set("dateStarted", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <FieldLabel>Original Target</FieldLabel>
              <input
                type="date"
                value={form.targetCompletionDate}
                onChange={(e) => set("targetCompletionDate", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <FieldLabel>Revised Target Completion</FieldLabel>
              <input
                type="date"
                value={form.revisedCompletionDate}
                onChange={(e) => set("revisedCompletionDate", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <FieldLabel>Duration</FieldLabel>
              <input
                type="text"
                value={totalDays ? `${totalDays} Days` : "—"}
                disabled
                className="w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              />
            </div>
          </div>
        </SectionCard>

        {/* Row — Workforce + Responsibility */}
        <div className="grid grid-cols-2 gap-4">
          {/* WORKFORCE DISTRIBUTION */}
          <SectionCard
            icon={
              <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            }
            title="Workforce Distribution"
            badge={
              <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Live Updates
              </span>
            }
          >
            <div className="grid grid-cols-3 gap-4">
              <div>
                <FieldLabel>Female Personnel</FieldLabel>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-gray-800">{form.numFemale}</span>
                  <input
                    type="number"
                    min={0}
                    value={form.numFemale}
                    onChange={(e) => set("numFemale", parseInt(e.target.value) || 0)}
                    className="mb-0.5 w-16 rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Male Personnel</FieldLabel>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-gray-800">{form.numMale}</span>
                  <input
                    type="number"
                    min={0}
                    value={form.numMale}
                    onChange={(e) => set("numMale", parseInt(e.target.value) || 0)}
                    className="mb-0.5 w-16 rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="rounded-lg bg-blue-600 px-4 py-3 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-200">Total Workforce</p>
                <p className="text-3xl font-bold">{form.numFemale + form.numMale}</p>
              </div>
            </div>
          </SectionCard>

          {/* PROJECT RESPONSIBILITY & SCOPE */}
          <SectionCard
            icon={
              <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
            }
            title="Project Responsibility & Scope"
          >
            <div className="space-y-3">
              <div>
                <FieldLabel>Engineers In-Charge</FieldLabel>
                <div className="min-h-10 w-full rounded-lg border border-gray-200 px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {engineers.map((eng, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
                      >
                        {eng}
                        <button
                          type="button"
                          onClick={() => {
                            const next = engineers.filter((_, j) => j !== i);
                            set("projectEngineer", next.join(", "));
                          }}
                          className="hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="+ Add Engineer"
                      className="min-w-24 flex-1 text-sm text-gray-700 focus:outline-none"
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
                </div>
                <p className="mt-0.5 text-[10px] text-gray-400">Press Enter or comma to add</p>
              </div>
              <div>
                <FieldLabel>Detailed Scope of Work</FieldLabel>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={4}
                  placeholder="Comprehensive description of project scope..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </SectionCard>
        </div>

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
          <div className="grid grid-cols-3 gap-4">
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
                    {u.name ?? u.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel required>Priority Level</FieldLabel>
              <select
                value={notifPriority}
                onChange={(e) => setNotifPriority(e.target.value as typeof notifPriority)}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${PRIORITY_STYLES[notifPriority]} border-gray-200`}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div className="flex flex-col justify-end">
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
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
                {sendNotification.isPending ? "Sending..." : "Send Notification"}
              </button>
            </div>
          </div>
          <div className="mt-3">
            <FieldLabel required>Task Description / Instructions</FieldLabel>
            <textarea
              value={notifDesc}
              onChange={(e) => setNotifDesc(e.target.value)}
              rows={3}
              placeholder="Write task instructions or description for the selected user..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </SectionCard>

        {/* ADMINISTRATIVE AUTHORIZATION */}
        <div className="rounded-xl bg-gray-900 px-6 py-5 shadow-sm">
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
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-800">Administrative Update History Audit Trail</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
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
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-6 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-end gap-3">
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
