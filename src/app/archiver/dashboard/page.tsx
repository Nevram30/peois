"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";

const ARCHIVAL_WINGS = [
  "Wing A - Ground Floor",
  "Wing B - Ground Floor",
  "Wing C - Second Floor",
  "Wing D - Second Floor",
  "Records Annex",
];

export default function PhysicalArchiveEntryPage() {
  const [projectId, setProjectId] = useState("");
  const [roomLocation, setRoomLocation] = useState("");
  const [cabinetLabel, setCabinetLabel] = useState("");
  const [shelfNumber, setShelfNumber] = useState("");
  const [boxId, setBoxId] = useState("");
  const [folderRange, setFolderRange] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { data: projects, isLoading: projectsLoading } =
    api.archive.listProjects.useQuery();
  const utils = api.useUtils();

  const createArchive = api.archive.create.useMutation({
    onSuccess: () => {
      setSuccess("Archive location saved successfully.");
      setError(null);
      resetForm();
      void utils.archive.getAll.invalidate();
    },
    onError: (err) => {
      setError(err.message || "Failed to save archive location.");
      setSuccess(null);
    },
  });

  const resetForm = () => {
    setProjectId("");
    setRoomLocation("");
    setCabinetLabel("");
    setShelfNumber("");
    setBoxId("");
    setFolderRange("");
  };

  const handleCancel = () => {
    resetForm();
    setError(null);
    setSuccess(null);
  };

  const handleSave = () => {
    setSuccess(null);
    const fail = (msg: string) => {
      setError(msg);
      return;
    };

    if (!projectId) return fail("Please select a project.");
    if (!roomLocation) return fail("Please select a room location.");
    if (!cabinetLabel.trim()) return fail("Cabinet label is required.");
    const shelf = Number(shelfNumber);
    if (!shelfNumber.trim() || !Number.isInteger(shelf) || shelf < 1) {
      return fail("Shelf number must be a whole number (1 or higher).");
    }
    if (!boxId.trim()) return fail("Box ID is required.");
    if (!folderRange.trim()) return fail("Folder number / sequence is required.");

    setError(null);
    createArchive.mutate({
      projectId,
      roomLocation,
      cabinetLabel: cabinetLabel.trim(),
      shelfNumber: shelf,
      boxId: boxId.trim(),
      folderRange: folderRange.trim(),
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        <span>Projects</span>
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-gray-600">Archive Management</span>
      </nav>

      {/* Title */}
      <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
        Physical Archive Entry
      </h1>

      {/* Project selector */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center rounded bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-800">
          Project
        </span>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="min-w-0 max-w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none sm:min-w-[320px]"
        >
          <option value="">
            {projectsLoading ? "Loading projects..." : "Select a project..."}
          </option>
          {projects?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.projectCode} — {p.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Storage Metadata form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6 text-[#1e3a4f]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900">Storage Metadata</h2>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Room Location
                </label>
                <select
                  value={roomLocation}
                  onChange={(e) => setRoomLocation(e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 bg-slate-50 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="">Select Archival Wing...</option>
                  {ARCHIVAL_WINGS.map((wing) => (
                    <option key={wing} value={wing}>
                      {wing}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Cabinet Label
                </label>
                <input
                  type="text"
                  value={cabinetLabel}
                  onChange={(e) => setCabinetLabel(e.target.value)}
                  placeholder="e.g., CAB-PR-01"
                  className="block w-full rounded-lg border border-gray-200 bg-slate-50 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Shelf Number
                </label>
                <input
                  type="number"
                  min={1}
                  value={shelfNumber}
                  onChange={(e) => setShelfNumber(e.target.value)}
                  placeholder="Manual numeric entry"
                  className="block w-full rounded-lg border border-gray-200 bg-slate-50 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Box ID
                </label>
                <input
                  type="text"
                  value={boxId}
                  onChange={(e) => setBoxId(e.target.value)}
                  placeholder="e.g., BOX-2024-88"
                  className="block w-full rounded-lg border border-gray-200 bg-slate-50 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Folder Number / Sequence
                </label>
                <input
                  type="text"
                  value={folderRange}
                  onChange={(e) => setFolderRange(e.target.value)}
                  placeholder="e.g., FLD-001 to FLD-015"
                  className="block w-full rounded-lg border border-gray-200 bg-slate-50 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
                <p className="mt-2 text-xs italic text-gray-400">
                  Specify range if multiple folders are contained within the same box
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
              <button
                onClick={handleSave}
                disabled={createArchive.isPending}
                className="flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#16304f] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {createArchive.isPending ? (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661l-2.41-7.839a2.25 2.25 0 0 0-2.151-1.588H15M9 3.75v2.5A1.75 1.75 0 0 0 10.75 8h2.5A1.75 1.75 0 0 0 15 6.25v-2.5M9 3.75h6" />
                  </svg>
                )}
                {createArchive.isPending ? "Saving..." : "Save Archive Location"}
              </button>
              <button
                onClick={handleCancel}
                disabled={createArchive.isPending}
                className="rounded-lg bg-blue-50 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-[#1e3a4f]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">
                Archiver Guidelines
              </h3>
            </div>

            <ol className="mt-5 space-y-5">
              {[
                {
                  title: "Verify Cabinet Labels",
                  body: "Ensure physical cabinet codes match the MIS registry before assignment.",
                },
                {
                  title: "Shelf Number Accuracy",
                  body: "Shelves are numbered top-to-bottom (01-08). Double-check physical position.",
                },
                {
                  title: "Box & Folder Linking",
                  body: "All digital metadata must correlate precisely with the physical folder index.",
                },
              ].map((item, i) => (
                <li key={item.title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-[#1e3a4f]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="divide-y divide-gray-200 rounded-2xl bg-slate-50 shadow-sm">
            <Link
              href="/archiver/registry"
              className="flex items-center justify-between px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#1e3a4f] transition hover:bg-slate-100"
            >
              View Project Registry
              <svg className="h-4 w-4 text-blue-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <button
              onClick={() => window.print()}
              className="flex w-full items-center justify-between px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#1e3a4f] transition hover:bg-slate-100"
            >
              Print Labels
              <svg className="h-4 w-4 text-blue-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
