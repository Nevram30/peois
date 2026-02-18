"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { api } from "~/trpc/react";

const inputClass =
  "mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#1e3a4f] focus:bg-white focus:ring-2 focus:ring-[#1e3a4f]/20 focus:outline-none";
const labelClass = "block text-sm font-semibold text-gray-700";
const sectionTitleClass = "text-lg font-semibold text-[#1e3a4f]";

export function AddProjectForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subType, setSubType] = useState("");
  const [modeOfImplementation, setModeOfImplementation] = useState("");
  const [locationImplementation, setLocationImplementation] = useState("");
  const [sourceOfFund, setSourceOfFund] = useState("");
  const [contractCost, setContractCost] = useState("0.00");
  const [projectEngineer, setProjectEngineer] = useState("");
  const [dateStarted, setDateStarted] = useState("");
  const [targetCompletionDate, setTargetCompletionDate] = useState("");
  const [revisedCompletionDate, setRevisedCompletionDate] = useState("");
  const [dateCompleted, setDateCompleted] = useState("");
  const [daysSuspended, setDaysSuspended] = useState("0");
  const [daysExtended, setDaysExtended] = useState("0");
  const [numFemale, setNumFemale] = useState("0");
  const [numMale, setNumMale] = useState("0");
  const [numManDays, setNumManDays] = useState("0");
  const [district, setDistrict] = useState("");
  const [cityMunicipality, setCityMunicipality] = useState("");
  const [barangay, setBarangay] = useState("");
  const [sitio, setSitio] = useState("");
  const [description, setDescription] = useState("");

  // Auto-calculated fields
  const duration = useMemo(() => {
    if (!dateStarted || !targetCompletionDate) return 0;
    const start = new Date(dateStarted);
    const end = new Date(targetCompletionDate);
    return Math.max(
      0,
      Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );
  }, [dateStarted, targetCompletionDate]);

  const numPersons = useMemo(() => {
    return (parseInt(numFemale) || 0) + (parseInt(numMale) || 0);
  }, [numFemale, numMale]);

  const createProject = api.project.create.useMutation({
    onSuccess: () => {
      router.push("/admin/dashboard/projects");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProject.mutate({
      title,
      subType: subType
        ? (subType as
            | "WATER_SYSTEMS"
            | "GOVERNMENT_BUILDINGS"
            | "ELECTRIFICATION"
            | "RESPONSE_CAMP_MGMT"
            | "SUPPLEMENTAL_BUDGET_2"
            | "PARK_AND_DEVELOPMENT"
            | "DOH"
            | "PROVINCIAL_GOVT_OFFICE")
        : null,
      modeOfImplementation: modeOfImplementation as
        | "BY_ADMINISTRATION"
        | "BY_CONTRACT",
      locationImplementation: locationImplementation as
        | "DISTRICT_I"
        | "DISTRICT_II",
      sourceOfFund: sourceOfFund as
        | "GENERAL_FUND"
        | "SEF"
        | "TRUST_FUND"
        | "TWENTY_PERCENT_DEV_FUND"
        | "AID"
        | "LOAN"
        | "OTHERS",
      contractCost: parseFloat(contractCost) || 0,
      projectEngineer: projectEngineer || undefined,
      dateStarted: dateStarted ? new Date(dateStarted) : null,
      targetCompletionDate: targetCompletionDate
        ? new Date(targetCompletionDate)
        : null,
      revisedCompletionDate: revisedCompletionDate
        ? new Date(revisedCompletionDate)
        : null,
      dateCompleted: dateCompleted ? new Date(dateCompleted) : null,
      daysSuspended: parseInt(daysSuspended) || 0,
      daysExtended: parseInt(daysExtended) || 0,
      numFemale: parseInt(numFemale) || 0,
      numMale: parseInt(numMale) || 0,
      numManDays: parseInt(numManDays) || 0,
      district: district
        ? (district as "DISTRICT_I" | "DISTRICT_II")
        : null,
      cityMunicipality: cityMunicipality || undefined,
      barangay: barangay || undefined,
      sitio: sitio || undefined,
      description: description || undefined,
    });
  };

  return (
    <div className="px-6 py-8">
      {/* Back link */}
      <Link
        href="/admin/dashboard/projects"
        className="inline-flex items-center gap-1 text-sm text-[#1e3a4f] hover:underline"
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
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
        Back to Projects
      </Link>

      <h2 className="mt-2 text-2xl font-bold text-gray-900">
        Add New Project/Document
      </h2>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="space-y-10 p-8">
            {/* === Basic Information === */}
            <section>
              <h3 className={sectionTitleClass}>Basic Information</h3>
              <hr className="mt-2 mb-6 border-gray-200" />

              <div className="space-y-5">
                <div>
                  <label className={labelClass}>
                    Project Title/Document Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Sub-Type</label>
                  <select
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select sub-type</option>
                    <option value="WATER_SYSTEMS">Water Systems</option>
                    <option value="GOVERNMENT_BUILDINGS">
                      Government Buildings
                    </option>
                    <option value="ELECTRIFICATION">Electrification</option>
                    <option value="RESPONSE_CAMP_MGMT">
                      Response (Camp Mgmt)
                    </option>
                    <option value="SUPPLEMENTAL_BUDGET_2">
                      Supplemental Budget #2
                    </option>
                    <option value="PARK_AND_DEVELOPMENT">
                      Park and Development
                    </option>
                    <option value="DOH">DOH</option>
                    <option value="PROVINCIAL_GOVT_OFFICE">
                      Provincial Govt Office
                    </option>
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Mode of Implementation *
                    </label>
                    <select
                      required
                      value={modeOfImplementation}
                      onChange={(e) =>
                        setModeOfImplementation(e.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">Select mode</option>
                      <option value="BY_ADMINISTRATION">
                        By Administration
                      </option>
                      <option value="BY_CONTRACT">By Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>
                      Location Implementation *
                    </label>
                    <select
                      required
                      value={locationImplementation}
                      onChange={(e) =>
                        setLocationImplementation(e.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">Select district</option>
                      <option value="DISTRICT_I">District I</option>
                      <option value="DISTRICT_II">District II</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* === Source of Fund === */}
            <section>
              <h3 className={sectionTitleClass}>Source of Fund</h3>
              <hr className="mt-2 mb-6 border-gray-200" />

              <div>
                <label className={labelClass}>Source of Fund *</label>
                <select
                  required
                  value={sourceOfFund}
                  onChange={(e) => setSourceOfFund(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select source</option>
                  <option value="GENERAL_FUND">General Fund</option>
                  <option value="SEF">SEF</option>
                  <option value="TRUST_FUND">Trust Fund</option>
                  <option value="TWENTY_PERCENT_DEV_FUND">
                    20% Development Fund
                  </option>
                  <option value="AID">Aid</option>
                  <option value="LOAN">Loan</option>
                  <option value="OTHERS">Others</option>
                </select>
              </div>
            </section>

            {/* === Project Data === */}
            <section>
              <h3 className={sectionTitleClass}>Project Data</h3>
              <hr className="mt-2 mb-6 border-gray-200" />

              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Contract Cost</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={contractCost}
                      onChange={(e) => setContractCost(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Project Engineer</label>
                    <input
                      type="text"
                      value={projectEngineer}
                      onChange={(e) => setProjectEngineer(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
                    <label className={labelClass}>
                      Target Completion Date
                    </label>
                    <input
                      type="date"
                      value={targetCompletionDate}
                      onChange={(e) =>
                        setTargetCompletionDate(e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Duration (Auto-calculated)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={`${duration} days`}
                      className={`${inputClass} cursor-not-allowed bg-gray-100 text-gray-500`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Revised Completion Date
                    </label>
                    <input
                      type="date"
                      value={revisedCompletionDate}
                      onChange={(e) =>
                        setRevisedCompletionDate(e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Date Completed</label>
                    <input
                      type="date"
                      value={dateCompleted}
                      onChange={(e) => setDateCompleted(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Number of Days Suspended
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={daysSuspended}
                      onChange={(e) => setDaysSuspended(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Number of Days Extended
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={daysExtended}
                      onChange={(e) => setDaysExtended(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* === Employment Generated === */}
            <section>
              <h3 className={sectionTitleClass}>Employment Generated</h3>
              <hr className="mt-2 mb-6 border-gray-200" />

              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Number of Female</label>
                    <input
                      type="number"
                      min="0"
                      value={numFemale}
                      onChange={(e) => setNumFemale(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Number of Male</label>
                    <input
                      type="number"
                      min="0"
                      value={numMale}
                      onChange={(e) => setNumMale(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Number of Persons (Auto-calculated)
                    </label>
                    <input
                      type="number"
                      readOnly
                      value={numPersons}
                      className={`${inputClass} cursor-not-allowed bg-gray-100 text-gray-500`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Number of Man-days</label>
                    <input
                      type="number"
                      min="0"
                      value={numManDays}
                      onChange={(e) => setNumManDays(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* === Location of the Project === */}
            <section>
              <h3 className={sectionTitleClass}>Location of the Project</h3>
              <hr className="mt-2 mb-6 border-gray-200" />

              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      District I or District II
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select district</option>
                      <option value="DISTRICT_I">District I</option>
                      <option value="DISTRICT_II">District II</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>City or Municipality</label>
                    <input
                      type="text"
                      value={cityMunicipality}
                      onChange={(e) => setCityMunicipality(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Barangay</label>
                    <input
                      type="text"
                      value={barangay}
                      onChange={(e) => setBarangay(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Sitio</label>
                    <input
                      type="text"
                      value={sitio}
                      onChange={(e) => setSitio(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter detailed location description..."
                    className={inputClass}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-8 py-5">
            <Link
              href="/admin/dashboard/projects"
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createProject.isPending}
              className="rounded-lg bg-[#1e3a4f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2a4d66] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createProject.isPending ? "Saving..." : "Save Project"}
            </button>
          </div>
        </div>

        {createProject.isError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {createProject.error.message}
          </div>
        )}
      </form>
    </div>
  );
}
