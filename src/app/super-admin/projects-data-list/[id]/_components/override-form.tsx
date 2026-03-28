"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";

const STATUS_LABELS: Record<string, string> = {
  ON_GOING: "Active",
  COMPLETED: "Completed",
  SUSPENDED: "Suspended",
  NOT_YET_STARTED: "Not Yet Started",
};

const STATUS_STYLES: Record<string, string> = {
  ON_GOING: "bg-green-100 text-green-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  SUSPENDED: "bg-red-100 text-red-700",
  NOT_YET_STARTED: "bg-gray-100 text-gray-600",
};

function formatDate(d: Date | null | undefined): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export function OverrideForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const utils = api.useUtils();

  const { data: project, isLoading } = api.project.getById.useQuery({ id: projectId });
  const { data: activities } = api.projectActivity.getByProjectId.useQuery({ projectId });

  const override = api.project.superAdminOverride.useMutation({
    onSuccess: async () => {
      await utils.projectActivity.getByProjectId.invalidate({ projectId });
      setReason("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const [form, setForm] = useState({
    title: "",
    modeOfImplementation: "BY_CONTRACT" as "BY_ADMINISTRATION" | "BY_CONTRACT",
    locationImplementation: "DISTRICT_I" as "DISTRICT_I" | "DISTRICT_II",
    status: "ON_GOING" as "NOT_YET_STARTED" | "ON_GOING" | "COMPLETED" | "SUSPENDED",
    sourceOfFund: "GENERAL_FUND" as
      | "GENERAL_FUND"
      | "SEF"
      | "TRUST_FUND"
      | "TWENTY_PERCENT_DEV_FUND"
      | "AID"
      | "LOAN"
      | "OTHERS",
    subType: "" as string,
    contractCost: 0,
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
    sitio: "",
    description: "",
  });

  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title,
        modeOfImplementation: project.modeOfImplementation,
        locationImplementation: project.locationImplementation,
        status: project.status,
        sourceOfFund: project.sourceOfFund,
        subType: project.subType ?? "",
        contractCost: project.contractCost,
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
        sitio: project.sitio ?? "",
        description: project.description ?? "",
      });
    }
  }, [project]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) return;

    override.mutate({
      id: projectId,
      reason,
      title: form.title,
      modeOfImplementation: form.modeOfImplementation,
      locationImplementation: form.locationImplementation,
      status: form.status,
      sourceOfFund: form.sourceOfFund,
      subType: form.subType
        ? (form.subType as
            | "WATER_SYSTEMS"
            | "GOVERNMENT_BUILDINGS"
            | "ELECTRIFICATION"
            | "RESPONSE_CAMP_MGMT"
            | "SUPPLEMENTAL_BUDGET_2"
            | "PARK_AND_DEVELOPMENT"
            | "DOH"
            | "PROVINCIAL_GOVT_OFFICE")
        : null,
      contractCost: form.contractCost,
      projectEngineer: form.projectEngineer || undefined,
      dateStarted: form.dateStarted ? new Date(form.dateStarted) : null,
      targetCompletionDate: form.targetCompletionDate
        ? new Date(form.targetCompletionDate)
        : null,
      revisedCompletionDate: form.revisedCompletionDate
        ? new Date(form.revisedCompletionDate)
        : null,
      numFemale: form.numFemale,
      numMale: form.numMale,
      numManDays: form.numManDays,
      district: form.district
        ? (form.district as "DISTRICT_I" | "DISTRICT_II")
        : null,
      cityMunicipality: form.cityMunicipality || undefined,
      barangay: form.barangay || undefined,
      sitio: form.sitio || undefined,
      description: form.description || undefined,
    });
  }

  const engineers = form.projectEngineer
    ? form.projectEngineer.split(",").map((e) => e.trim()).filter(Boolean)
    : [];

  const duration =
    form.dateStarted && form.targetCompletionDate
      ? Math.ceil(
          (new Date(form.targetCompletionDate).getTime() -
            new Date(form.dateStarted).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : project?.duration ?? 0;

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
          Back to Projects Data List
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
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              Projects Data List
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

      {/* Current Project Context */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Current Project Context
        </p>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-gray-400">Project ID</p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-gray-800">
              {project.projectCode}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Project Name</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-800 line-clamp-2">
              {project.title}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Contract Cost</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-800">
              ₱{project.contractCost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Status</p>
            <span
              className={`mt-0.5 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[project.status] ?? "bg-gray-100 text-gray-600"}`}
            >
              {STATUS_LABELS[project.status] ?? project.status}
            </span>
          </div>
        </div>
      </div>

      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Override committed successfully. Changes have been logged to the audit trail.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Comprehensive Data Override */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-800">Comprehensive Data Override</h3>
            </div>
            <p className="mt-0.5 text-xs text-gray-400">
              Update any field within the project record. All changes are logged.
            </p>
          </div>

          <div className="space-y-6 p-6">
            {/* Project Information */}
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-700">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-xs">i</span>
                Project Information
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={project.projectCode}
                    disabled
                    className="w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Mode of Implementation <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.modeOfImplementation}
                    onChange={(e) =>
                      set("modeOfImplementation", e.target.value as typeof form.modeOfImplementation)
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BY_CONTRACT">By Contract</option>
                    <option value="BY_ADMINISTRATION">By Administration</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.locationImplementation}
                    onChange={(e) =>
                      set("locationImplementation", e.target.value as typeof form.locationImplementation)
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DISTRICT_I">District 1</option>
                    <option value="DISTRICT_II">District 2</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => set("status", e.target.value as typeof form.status)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="NOT_YET_STARTED">Not Yet Started</option>
                    <option value="ON_GOING">Active</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Funding + Location */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-700">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-xs">$</span>
                  Funding Information
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      Source of Fund <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.sourceOfFund}
                      onChange={(e) => set("sourceOfFund", e.target.value as typeof form.sourceOfFund)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="GENERAL_FUND">General Fund</option>
                      <option value="SEF">SEF</option>
                      <option value="TRUST_FUND">Trust Fund</option>
                      <option value="TWENTY_PERCENT_DEV_FUND">20% Dev Fund</option>
                      <option value="AID">Aid</option>
                      <option value="LOAN">Loan</option>
                      <option value="OTHERS">Others</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      Sub-Category
                    </label>
                    <select
                      value={form.subType}
                      onChange={(e) => set("subType", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- None --</option>
                      <option value="WATER_SYSTEMS">Water Systems</option>
                      <option value="GOVERNMENT_BUILDINGS">Government Buildings</option>
                      <option value="ELECTRIFICATION">Electrification</option>
                      <option value="RESPONSE_CAMP_MGMT">Response / Camp Management</option>
                      <option value="SUPPLEMENTAL_BUDGET_2">Supplemental Budget 2</option>
                      <option value="PARK_AND_DEVELOPMENT">Park and Development</option>
                      <option value="DOH">DOH</option>
                      <option value="PROVINCIAL_GOVT_OFFICE">Provincial Govt Office</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-700">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-xs">📍</span>
                  Project Location
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      City / Municipality <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.cityMunicipality}
                      onChange={(e) => set("cityMunicipality", e.target.value)}
                      placeholder="Enter municipality"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Barangay <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.barangay}
                        onChange={(e) => set("barangay", e.target.value)}
                        placeholder="Enter barangay"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Sitio</label>
                      <input
                        type="text"
                        value={form.sitio}
                        onChange={(e) => set("sitio", e.target.value)}
                        placeholder="Enter Sitio"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Data */}
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-700">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-xs">≡</span>
                Project Data
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Contract Cost <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500">
                    <span className="px-3 text-sm text-gray-400">₱</span>
                    <input
                      type="number"
                      min={0}
                      value={form.contractCost}
                      onChange={(e) => set("contractCost", parseFloat(e.target.value) || 0)}
                      className="flex-1 rounded-r-lg py-2 pr-3 text-sm text-gray-800 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Project Engineers
                  </label>
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
                        placeholder="Add engineers..."
                        className="min-w-24 flex-1 text-sm text-gray-700 focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) {
                              set(
                                "projectEngineer",
                                [...engineers, val].join(", "),
                              );
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-400">Press Enter or comma to add</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Date Started</label>
                  <input
                    type="date"
                    value={form.dateStarted}
                    onChange={(e) => set("dateStarted", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Target Completion</label>
                  <input
                    type="date"
                    value={form.targetCompletionDate}
                    onChange={(e) => set("targetCompletionDate", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Revised Target</label>
                  <input
                    type="date"
                    value={form.revisedCompletionDate}
                    onChange={(e) => set("revisedCompletionDate", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Duration (Days)</label>
                  <input
                    type="number"
                    value={duration}
                    disabled
                    className="w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Employment Generated */}
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-700">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-xs">👥</span>
                Employment Generated
              </p>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Female</label>
                  <input
                    type="number"
                    min={0}
                    value={form.numFemale}
                    onChange={(e) => set("numFemale", parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Male</label>
                  <input
                    type="number"
                    min={0}
                    value={form.numMale}
                    onChange={(e) => set("numMale", parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Total Persons</label>
                  <input
                    type="number"
                    value={form.numFemale + form.numMale}
                    disabled
                    className="w-full rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Total Man-days</label>
                  <input
                    type="number"
                    min={0}
                    value={form.numManDays}
                    onChange={(e) => set("numManDays", parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-700">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-xs">📄</span>
                Description / Scope of Work
              </p>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={4}
                placeholder="Enter detailed description of the project scope..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Commit bar */}
          <div className="rounded-b-xl border-t border-gray-800 bg-gray-900 px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-300">
                  Reason for Comprehensive Override <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  placeholder="Detailed explanation for these changes..."
                  className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  type="submit"
                  disabled={override.isPending || !reason.trim()}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:opacity-50"
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
                  Commit All Changes
                </button>
                <p className="text-xs text-gray-500">This action is permanent and recorded in the audit trail.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Override History Audit Trail */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-800">Override History Audit Trail</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Administrator</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Reason for Change</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {overrideActivities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-sm text-gray-400">
                      No override history yet.
                    </td>
                  </tr>
                ) : (
                  overrideActivities.map((activity) => {
                    const initials = activity.createdBy.name
                      ? activity.createdBy.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
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
                        <td className="max-w-xs px-4 py-3 text-sm text-gray-600">
                          <span className="line-clamp-2">{reasonText}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold text-green-600">VERIFIED</span>
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
      </form>
    </>
  );
}
