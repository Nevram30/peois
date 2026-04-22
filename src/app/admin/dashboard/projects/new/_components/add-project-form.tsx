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

const inputClass =
  "block w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none";
const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";
const sectionClass =
  "rounded-xl border border-gray-200 bg-white p-6 shadow-sm";

const DISTRICT_CITIES: Record<string, string[]> = {
  DISTRICT_I: [
    "Angeles City",
    "Mabalacat City",
    "Porac",
    "San Fernando City",
  ],
  DISTRICT_II: [
    "Apalit",
    "Bacolor",
    "Candaba",
    "Floridablanca",
    "Guagua",
    "Lubao",
    "Macabebe",
    "Magalang",
    "Masantol",
    "Mexico",
    "Minalin",
    "Sasmuan",
    "Santa Ana",
    "Santo Tomas",
  ],
};

export function AddProjectForm() {
  const router = useRouter();

  // Project Information
  const [title, setTitle] = useState("");
  const [modeOfImplementation, setModeOfImplementation] = useState("");
  const [contractorName, setContractorName] = useState("");
  const [district, setDistrict] = useState(""); // locationImplementation
  const [status, setStatus] = useState("ON_GOING");

  // Funding Information
  const [sourceOfFund, setSourceOfFund] = useState("");
  const [subType, setSubType] = useState("");

  // Project Location
  const [cityMunicipality, setCityMunicipality] = useState("");
  const [barangay, setBarangay] = useState("");

  // Project Data
  const [contractCost, setContractCost] = useState("0.00");
  const [engineers, setEngineers] = useState<string[]>([]);
  const [engineerInput, setEngineerInput] = useState("");
  const [dateStarted, setDateStarted] = useState("");
  const [targetCompletionDate, setTargetCompletionDate] = useState("");
  const [revisedCompletionDate, setRevisedCompletionDate] = useState("");

  // Employment Generated
  const [numFemale, setNumFemale] = useState("0");
  const [numMale, setNumMale] = useState("0");

  // Description
  const [description, setDescription] = useState("");

  // Documentation & Media
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docUrl, setDocUrl] = useState("");
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [docUploadError, setDocUploadError] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
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
      onUploadError: (err) => {
        setImageUploadError(err.message);
      },
    });

  const { startUpload: startDocUpload, isUploading: isUploadingDoc } =
    useUploadThing("documentUploader", {
      onClientUploadComplete: (res) => {
        const url = res[0]?.ufsUrl ?? res[0]?.url;
        if (url) setDocUrl(url);
        setDocUploadError(null);
      },
      onUploadError: (err) => {
        setDocUploadError(err.message);
      },
    });

  // Tracking
  const [trackingNumber, setTrackingNumber] = useState("");

  // Auto-calculated
  const duration = useMemo(() => {
    if (!dateStarted || !targetCompletionDate) return 0;
    const start = new Date(dateStarted);
    const end = new Date(targetCompletionDate);
    return Math.max(
      0,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    );
  }, [dateStarted, targetCompletionDate]);

  const numPersons = useMemo(
    () => (parseInt(numFemale) || 0) + (parseInt(numMale) || 0),
    [numFemale, numMale],
  );

  const availableCities = district
    ? (DISTRICT_CITIES[district] ?? [])
    : [];

  // Engineer tag input
  const addEngineer = () => {
    const name = engineerInput.trim();
    if (name && !engineers.includes(name)) {
      setEngineers([...engineers, name]);
    }
    setEngineerInput("");
  };

  const removeEngineer = (name: string) => {
    setEngineers(engineers.filter((e) => e !== name));
  };

  const handleEngineerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEngineer();
    }
  };
  // Image upload via UploadThing
  const handleImageChange = (file: File) => {
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setImageUploadError(null);
    void startImageUpload([file]);
  };

  // Document upload via UploadThing
  const handleDocChange = (file: File) => {
    if (!file) return;
    setDocFile(file);
    setDocUploadError(null);
    void startDocUpload([file]);
  };

  const createProject = api.project.create.useMutation({
    onSuccess: () => {
      router.push("/admin/dashboard/projects");
    },
  });

  const handleSubmit = (isDraft: boolean) => {
    createProject.mutate({
      title,
      subType: subType ? (subType as ProjectSubTypeValue) : null,
      modeOfImplementation: modeOfImplementation as
        | "BY_ADMINISTRATION"
        | "BY_CONTRACT",
      locationImplementation: district as "DISTRICT_I" | "DISTRICT_II",
      sourceOfFund: sourceOfFund as SourceOfFundValue,
      contractCost: parseFloat(contractCost.replace(/,/g, "")) || 0,
      contractorName: modeOfImplementation === "BY_CONTRACT" ? contractorName || undefined : undefined,
      projectEngineer: engineers.join(", ") || undefined,
      dateStarted: dateStarted ? new Date(dateStarted) : null,
      targetCompletionDate: targetCompletionDate
        ? new Date(targetCompletionDate)
        : null,
      revisedCompletionDate: revisedCompletionDate
        ? new Date(revisedCompletionDate)
        : null,
      dateCompleted: null,
      daysSuspended: 0,
      daysExtended: 0,
      numFemale: parseInt(numFemale) || 0,
      numMale: parseInt(numMale) || 0,
      numManDays: 0,
      district: district ? (district as "DISTRICT_I" | "DISTRICT_II") : null,
      cityMunicipality: cityMunicipality || undefined,
      barangay: barangay || undefined,
      description: description || undefined,
      status: isDraft ? "NOT_YET_STARTED" : (status as ProjectStatusValue),
      imageUrl: imageUrl || undefined,
      documentUrl: docUrl || undefined,
      documentName: docFile?.name ?? undefined,
      projectCode: trackingNumber || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/admin/dashboard" className="hover:text-gray-700">
          Dashboard
        </Link>
        <span>/</span>
        <Link
          href="/admin/dashboard/projects"
          className="hover:text-gray-700"
        >
          Projects
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Add New</span>
      </nav>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Project</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below to create a new engineering project record.
        </p>
      </div>

      <div className="space-y-6">
        {/* === Project Information === */}
        <section className={sectionClass}>
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-4 w-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900">
              Project Information
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter project title"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Tracking Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    #
                  </span>
                  <input type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="PEO-2025-XXXXX"
                    className={`${inputClass} pl-7`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>
                  Mode of Implementation{" "}
                  <span className="text-red-500">*</span>
                </label>
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
                {modeOfImplementation === "BY_CONTRACT" && (
                  <div className="mt-3">
                    <label className={labelClass}>
                      Contractor Name <span className="text-red-500">*</span>
                    </label>
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
              <div>
                <label className={labelClass}>
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setCityMunicipality("");
                    setBarangay("");
                  }}
                  className={inputClass}
                >
                  <option value="">Select District</option>
                  <option value="DISTRICT_I">District I</option>
                  <option value="DISTRICT_II">District II</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputClass}
                >
                  {PROJECT_STATUS_ORDER.map((k) => (
                    <option key={k} value={k}>
                      {PROJECT_STATUS_LABEL[k]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* === Funding Information + Project Location === */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Funding Information */}
          <section className={sectionClass}>
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                <svg
                  className="h-4 w-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                  />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                Funding Information
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  Source of Fund <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={sourceOfFund}
                  onChange={(e) => {
                    const next = e.target.value as SourceOfFundValue | "";
                    setSourceOfFund(next);
                    const allowed = next ? SOURCE_TO_SUB_TYPES[next] : [];
                    if (!allowed.includes(subType as ProjectSubTypeValue)) {
                      setSubType("");
                    }
                  }}
                  className={inputClass}
                >
                  <option value="">Select Source</option>
                  {SOURCE_OF_FUND_ORDER.map((k) => (
                    <option key={k} value={k}>
                      {SOURCE_OF_FUND_LABEL[k]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Sub-Category</label>
                <select
                  value={subType}
                  onChange={(e) => setSubType(e.target.value)}
                  disabled={
                    !sourceOfFund ||
                    (SOURCE_TO_SUB_TYPES[sourceOfFund as SourceOfFundValue]
                      ?.length ?? 0) === 0
                  }
                  className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}
                >
                  <option value="">
                    {!sourceOfFund
                      ? "Select Source first"
                      : (SOURCE_TO_SUB_TYPES[sourceOfFund as SourceOfFundValue]
                            ?.length ?? 0) === 0
                        ? "No sub-categories available"
                        : "Select Sub-Category (Optional)"}
                  </option>
                  {sourceOfFund &&
                    SOURCE_TO_SUB_TYPES[sourceOfFund as SourceOfFundValue].map(
                      (k) => (
                        <option key={k} value={k}>
                          {PROJECT_SUB_TYPE_LABEL[k]}
                        </option>
                      ),
                    )}
                </select>
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Available depending on selected source.
                </p>
              </div>
            </div>
          </section>

          {/* Project Location */}
          <section className={sectionClass}>
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                <svg
                  className="h-4 w-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                Project Location
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  City / Municipality <span className="text-red-500">*</span>
                </label>
                <select
                  value={cityMunicipality}
                  onChange={(e) => {
                    setCityMunicipality(e.target.value);
                    setBarangay("");
                  }}
                  disabled={!district}
                  className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}
                >
                  <option value="">Select City/Municipality</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-400">
                  Filtered by selected District.
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  Barangay <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  disabled={!cityMunicipality}
                  placeholder={
                    cityMunicipality ? "Enter barangay" : "Select Barangay"
                  }
                  className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}
                />
                {!cityMunicipality && (
                  <p className="mt-1 text-xs text-gray-400">
                    Select a City first.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* === Project Data === */}
        <section className={sectionClass}>
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-4 w-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900">
              Project Data
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Contract Cost <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    ₱
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={contractCost}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9.]/g, "");
                      setContractCost(raw);
                    }}
                    onBlur={() => {
                      const num = parseFloat(contractCost.replace(/,/g, ""));
                      if (!isNaN(num)) {
                        setContractCost(
                          num.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }),
                        );
                      } else {
                        setContractCost("0.00");
                      }
                    }}
                    onFocus={() => {
                      setContractCost(contractCost.replace(/,/g, ""));
                    }}
                    className={`${inputClass} pl-7 text-right`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Project Engineers</label>
                <div
                  className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 cursor-text"
                  onClick={() =>
                    document.getElementById("engineer-input")?.focus()
                  }
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
                    placeholder={
                      engineers.length === 0 ? "Add engineers..." : ""
                    }
                    className="min-w-[120px] flex-1 border-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
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
                <label className={labelClass}>Target Completion</label>
                <input
                  type="date"
                  value={targetCompletionDate}
                  onChange={(e) => setTargetCompletionDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Revised Target</label>
                <input
                  type="date"
                  value={revisedCompletionDate}
                  onChange={(e) => setRevisedCompletionDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Duration (Days)</label>
                <input
                  type="text"
                  readOnly
                  value={duration}
                  className={`${inputClass} cursor-not-allowed bg-blue-50 text-center font-semibold text-blue-700`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* === Employment Generated === */}
        <section className={sectionClass}>
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-4 w-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900">
              Employment Generated
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Female</label>
              <input
                type="number"
                min="0"
                value={numFemale}
                onChange={(e) => setNumFemale(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Male</label>
              <input
                type="number"
                min="0"
                value={numMale}
                onChange={(e) => setNumMale(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Total Persons
              </label>
              <input
                type="text"
                readOnly
                value={numPersons}
                className={`${inputClass} cursor-not-allowed bg-blue-50 text-center font-semibold text-blue-700`}
              />
            </div>
          </div>
        </section>

        {/* === Description / Scope of Work === */}
        <section className={sectionClass}>
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-4 w-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900">
              Description / Scope of Work
            </h2>
          </div>

          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter detailed description of the project scope..."
            className={inputClass}
          />
        </section>

        {/* === Project Documentation & Media === */}
        <section className={sectionClass}>
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-4 w-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900">
              Project Documentation &amp; Media
            </h2>
          </div>

          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className={labelClass}>
                Actual Image of Proposed Project
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Upload area */}
                <div
                  onClick={() => imageInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) void handleImageChange(file);
                  }}
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-10 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <svg
                    className="h-10 w-10 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-blue-600">
                      Upload an image
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG or PNG (max. 5MB)
                  </p>
                  {isUploadingImage && (
                    <p className="text-xs text-blue-500">Uploading...</p>
                  )}
                  {imageUploadError && (
                    <p className="text-xs text-red-500">{imageUploadError}</p>
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

                {/* Image preview */}
                <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-10">
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-40 max-w-full rounded object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-300">
                      <svg
                        className="h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z"
                        />
                      </svg>
                      <p className="text-sm">Image preview will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <div
                onClick={() => docInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) void handleDocChange(file);
                }}
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-8 transition hover:border-blue-300 hover:bg-blue-50"
              >
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                  />
                </svg>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-blue-600">
                    Upload a file
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  POW, Plans, NTP, Other Docs (PDF, DOC up to 10MB)
                </p>
                {isUploadingDoc && (
                  <p className="text-xs text-blue-500">Uploading...</p>
                )}
                {docUploadError && (
                  <p className="text-xs text-red-500">{docUploadError}</p>
                )}
                <input
                  ref={docInputRef}
                  type="file"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleDocChange(file);
                  }}
                />
              </div>

              {/* Uploaded file */}
              {docFile && (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-red-100">
                      <svg
                        className="h-4 w-4 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {docFile.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(docFile.size / (1024 * 1024)).toFixed(1)}mb
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDocFile(null);
                      setDocUrl("");
                    }}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
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

            {/* Submit Function */}
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={
                createProject.isPending ||
                isUploadingImage ||
                isUploadingDoc ||
                !title ||
                !modeOfImplementation ||
                !district ||
                !sourceOfFund
              }
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
