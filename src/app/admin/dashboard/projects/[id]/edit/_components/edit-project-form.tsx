"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { api } from "~/trpc/react";

const SOURCE_FUND_LABEL: Record<string, string> = {
  GENERAL_FUND: "General Fund",
  SEF: "SEF",
  TRUST_FUND: "Trust Fund",
  TWENTY_PERCENT_DEV_FUND: "20% Dev Fund",
  AID: "AID",
  LOAN: "Loan",
  OTHERS: "Others",
};

const SUB_TYPE_LABEL: Record<string, string> = {
  WATER_SYSTEMS: "Water Systems",
  GOVERNMENT_BUILDINGS: "Government Buildings",
  ELECTRIFICATION: "Electrification",
  RESPONSE_CAMP_MGMT: "Response Camp Mgmt",
  SUPPLEMENTAL_BUDGET_2: "Supplemental Budget 2",
  PARK_AND_DEVELOPMENT: "Park & Development",
  DOH: "DOH",
  PROVINCIAL_GOVT_OFFICE: "Provincial Govt Office",
};

const STATUS_BADGE: Record<string, string> = {
  NOT_YET_STARTED: "bg-gray-500 text-white",
  ON_GOING: "bg-orange-500 text-white",
  COMPLETED: "bg-green-500 text-white",
  SUSPENDED: "bg-red-500 text-white",
};

const STATUS_LABEL: Record<string, string> = {
  NOT_YET_STARTED: "Not Yet Started",
  ON_GOING: "On-going",
  COMPLETED: "Completed",
  SUSPENDED: "Suspended",
};

function timeAgo(d: Date | string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

function fmt(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
  });
}

const card = "rounded-xl border border-gray-200 bg-white p-6 shadow-sm";

export function EditProjectForm({ projectId }: { projectId: string }) {
  const utils = api.useUtils();
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const { data: project, isLoading } = api.project.getById.useQuery({ id: projectId });
  const { data: activities } = api.projectActivity.getByProjectId.useQuery({ projectId });
  const { data: disbursements, refetch: refetchDisbursements } = api.project.getDisbursements.useQuery({ projectId });
  const { data: usersForSelect } = api.user.getForSelect.useQuery();

  const [completion, setCompletion] = useState(0);
  const [status, setStatus] = useState("ON_GOING");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaName, setMediaName] = useState("");
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Disbursement state
  const [disbAmount, setDisbAmount] = useState("");
  const [disbRef, setDisbRef] = useState("");

  // Task notification state
  const [notifyUserId, setNotifyUserId] = useState("");
  const [notifyPriority, setNotifyPriority] = useState<"MEDIUM" | "URGENT">("MEDIUM");
  const [taskDescription, setTaskDescription] = useState("");
  const [showNotifSuccess, setShowNotifSuccess] = useState(false);

  useEffect(() => {
    if (!project) return;
    setCompletion(project.completionPercentage);
    setStatus(project.status);
    setMediaUrl(project.imageUrl ?? "");
    setMediaName(project.documentName ?? "");
  }, [project]);

  const updateProject = api.project.updateProgress.useMutation({
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
    onSuccess: () => {
      setDisbAmount("");
      setDisbRef("");
      void refetchDisbursements();
    },
  });

  const sendNotification = api.project.sendTaskNotification.useMutation({
    onSuccess: () => {
      setTaskDescription("");
      setNotifyUserId("");
      setNotifyPriority("MEDIUM");
      setShowNotifSuccess(true);
    },
  });

  const handleMediaUpload = async (file: File) => {
    setIsUploadingMedia(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { filePath?: string };
      if (data.filePath) { setMediaUrl(data.filePath); setMediaName(file.name); }
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleSaveChanges = () => {
    if (!project) return;
    updateProject.mutate({
      id: projectId,
      status: status as "NOT_YET_STARTED" | "ON_GOING" | "COMPLETED" | "SUSPENDED",
      completionPercentage: completion,
      imageUrl: mediaUrl || undefined,
      documentUrl: mediaUrl || undefined,
      documentName: mediaName || undefined,
    });
  };

  const handlePostComment = () => {
    if (!comment.trim()) return;
    addActivity.mutate({ projectId, description: comment.trim() });
  };

  const handleRecordDisbursement = () => {
    const amount = parseFloat(disbAmount);
    if (!disbAmount || isNaN(amount) || amount <= 0) return;
    recordDisbursement.mutate({
      projectId,
      amount,
      referenceNumber: disbRef.trim() || undefined,
    });
  };

  const handleSendNotification = () => {
    if (!notifyUserId || !taskDescription.trim()) return;
    sendNotification.mutate({
      projectId,
      notifyUserId,
      priority: notifyPriority,
      description: taskDescription.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center text-gray-400">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-75 flex-col items-center justify-center gap-3 text-gray-400">
        <p>Project not found.</p>
        <Link href="/admin/dashboard/projects" className="text-sm font-medium text-blue-600 hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  const badgeClass = STATUS_BADGE[project.status] ?? "bg-gray-500 text-white";
  const statusLabel = STATUS_LABEL[project.status] ?? project.status;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Changes Saved Successfully!</h3>
            <p className="mb-6 text-sm text-gray-500">The project details have been updated in the system.</p>
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/admin/dashboard/projects" className="hover:text-gray-700">Projects</Link>
        <span>/</span>
        <span className="font-medium text-gray-900">Project Details</span>
      </nav>

      {/* ── Two-column layout ── */}
      <div className="flex gap-6 items-start">

        {/* ── Left column ── */}
        <div className="min-w-0 flex-1 space-y-6">

          {/* ── Hero Card ── */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative h-64 w-full shrink-0 sm:h-auto sm:w-72">
                {project.imageUrl ? (
                  <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full min-h-64 w-full items-center justify-center bg-gray-200">
                    <svg className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
                    </svg>
                  </div>
                )}
                <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest shadow ${badgeClass}`}>
                  {statusLabel}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between p-7">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Active Project</span>
                    <span className="text-xs text-gray-400">Last updated: {timeAgo(project.updatedAt)}</span>
                  </div>
                  <h1 className="mt-1 text-2xl font-extrabold leading-snug text-gray-900">{project.title}</h1>
                </div>

                {/* 4 info boxes */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tracking Number</p>
                      <p className="mt-0.5 font-mono text-sm font-bold text-gray-900">{project.projectCode}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Project Cost</p>
                      <p className="mt-0.5 text-sm font-bold text-gray-900">
                        ₱ {project.contractCost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Implementer</p>
                      <p className="mt-0.5 text-sm font-bold text-gray-900">
                        {project.modeOfImplementation === "BY_ADMINISTRATION" ? "By Administration" : "By Contract"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Target Completion</p>
                      <p className="mt-0.5 text-sm font-bold text-gray-900">{fmt(project.targetCompletionDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Progress + Media ── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* Update Project Progress */}
            <section className={card}>
              <div className="mb-5 flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                </svg>
                <h2 className="text-base font-semibold text-gray-900">Update Project Progress</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Current Completion Status</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="range" min={0} max={100} value={completion}
                      onChange={(e) => setCompletion(Number(e.target.value))}
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-blue-600"
                    />
                    <div className="flex w-20 items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5">
                      <span className="text-lg font-bold text-blue-600">{completion}</span>
                      <span className="text-sm font-medium text-blue-400">%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Project Status</p>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="block w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="NOT_YET_STARTED">Not Yet Started</option>
                      <option value="ON_GOING">On-going</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </section>

            {/* Update Documentation & Media */}
            <section className={card}>
              <div className="mb-5 flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <h2 className="text-base font-semibold text-gray-900">Update Documentation &amp; Media</h2>
              </div>
              <div
                onClick={() => mediaInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) void handleMediaUpload(f); }}
                className="flex h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 px-6 transition hover:border-blue-300 hover:bg-blue-50"
              >
                {isUploadingMedia ? (
                  <p className="text-sm text-blue-500">Uploading...</p>
                ) : mediaName ? (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{mediaName}</p>
                    <p className="text-xs text-gray-400">Click to replace</p>
                  </>
                ) : (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">New project photos, site reports, or blueprints (PDF, PNG, JPG)</p>
                  </>
                )}
                <input
                  ref={mediaInputRef} type="file" accept="image/jpeg,image/png,application/pdf"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleMediaUpload(f); }}
                />
              </div>
            </section>
          </div>

          {/* ── Funding & Disbursement Tracking ── */}
          {(() => {
            const totalDisb = disbursements?.reduce((sum, d) => sum + d.amount, 0) ?? 0;
            const remaining = (project.contractCost ?? 0) - totalDisb;
            const sourceLabel = SOURCE_FUND_LABEL[project.sourceOfFund] ?? project.sourceOfFund;
            const subTypeLabel = project.subType ? (SUB_TYPE_LABEL[project.subType] ?? project.subType) : "—";
            return (
              <section className={card}>
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                    </svg>
                    <h2 className="text-base font-semibold uppercase tracking-wider text-gray-900">Funding &amp; Disbursement Tracking</h2>
                  </div>
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  {/* Left: fund info + remaining balance */}
                  <div className="space-y-4">
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Source of Fund</p>
                      <div className="rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-medium text-gray-900">
                        {sourceLabel}
                      </div>
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Fund Category</p>
                      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900">
                        <span>{subTypeLabel}</span>
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Budget Year</p>
                      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900">
                        <span>{project.budgetYear ?? "—"}</span>
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Remaining Balance</p>
                      <p className="mt-1 text-2xl font-extrabold text-blue-700">
                        ₱ {remaining.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="mt-0.5 text-xs text-blue-500">Calculated: Project Cost − Total Disbursements</p>
                    </div>
                  </div>

                  {/* Right: disbursements table + record input */}
                  <div className="flex flex-col">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Recent Disbursements</p>
                    <div className="flex-1 overflow-hidden rounded-lg border border-gray-200">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Date</th>
                            <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Reference / Check #</th>
                            <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Amount (₱)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {disbursements && disbursements.length > 0 ? (
                            disbursements.map((d) => (
                              <tr key={d.id}>
                                <td className="px-3 py-2.5 text-gray-700">
                                  {new Date(d.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                                </td>
                                <td className="px-3 py-2.5 font-mono text-gray-700">{d.referenceNumber ?? "—"}</td>
                                <td className="px-3 py-2.5 text-right font-semibold text-gray-900">
                                  {d.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="px-3 py-6 text-center text-xs text-gray-400">No disbursements recorded yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {/* Record new disbursement */}
                    <div className="mt-3 flex gap-2">
                      <div className="relative flex-1">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₱</span>
                        <input
                          type="number" min={0} placeholder="Amount"
                          value={disbAmount}
                          onChange={(e) => setDisbAmount(e.target.value)}
                          className="block w-full rounded-lg border border-gray-200 py-2.5 pl-7 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <input
                        type="text" placeholder="Ref #"
                        value={disbRef}
                        onChange={(e) => setDisbRef(e.target.value)}
                        className="w-28 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <button
                        type="button"
                        onClick={handleRecordDisbursement}
                        disabled={recordDisbursement.isPending || !disbAmount}
                        className="rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
                      >
                        {recordDisbursement.isPending ? "..." : "RECORD"}
                      </button>
                    </div>
                    {recordDisbursement.isError && (
                      <p className="mt-2 text-xs text-red-600">{recordDisbursement.error.message}</p>
                    )}
                  </div>
                </div>
              </section>
            );
          })()}

          {/* ── Task Notification ── */}
          <section className={card}>
            {showNotifSuccess && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Notification sent successfully.
                <button type="button" onClick={() => setShowNotifSuccess(false)} className="ml-auto text-green-500 hover:text-green-700">✕</button>
              </div>
            )}
            <div className="mb-5 flex items-center gap-2">
              <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
              <h2 className="text-base font-semibold uppercase tracking-wider text-gray-900">Task Notification</h2>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {/* Left: user + priority */}
              <div className="space-y-4">
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Select User to Notify</p>
                  <div className="relative">
                    <select
                      value={notifyUserId}
                      onChange={(e) => setNotifyUserId(e.target.value)}
                      className="block w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 pr-10 text-sm font-medium text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Select a user...</option>
                      {usersForSelect?.map((u) => (
                        <option key={u.id} value={u.id}>{u.name ?? u.email}</option>
                      ))}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Priority Level</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setNotifyPriority("MEDIUM")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition ${
                        notifyPriority === "MEDIUM"
                          ? "border-gray-400 bg-gray-100 text-gray-700"
                          : "border-gray-200 bg-white text-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${notifyPriority === "MEDIUM" ? "bg-gray-500" : "bg-gray-300"}`} />
                      STANDARD
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifyPriority("URGENT")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition ${
                        notifyPriority === "URGENT"
                          ? "border-red-400 bg-red-50 text-red-600"
                          : "border-gray-200 bg-white text-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${notifyPriority === "URGENT" ? "bg-red-500" : "bg-gray-300"}`} />
                      URGENT
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: description + send button */}
              <div className="flex flex-col">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Task Description / Instructions</p>
                <textarea
                  rows={5}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Type instructions or task details here..."
                  className="flex-1 resize-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSendNotification}
                    disabled={sendNotification.isPending || !notifyUserId || !taskDescription.trim()}
                    className="flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    {sendNotification.isPending ? "Sending..." : "SEND NOTIFICATION"}
                  </button>
                </div>
                {sendNotification.isError && (
                  <p className="mt-2 text-right text-xs text-red-600">{sendNotification.error.message}</p>
                )}
              </div>
            </div>
          </section>

        </div>

        {/* ── Right column: Project History & Activity Log ── */}
        <div className="box w-125 shrink-0 sticky top-6 self-start">
          <section className={`${card} flex flex-col`} style={{ maxHeight: "calc(100vh - 6rem)" }}>
            <div className="mb-5 flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <h2 className="text-base font-semibold text-gray-900">Project History &amp; Activity Log</h2>
            </div>

            {/* Comment input */}
            <div className="mb-4 shrink-0">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Add New Activity / Comment</p>
              <textarea
                rows={3} value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter details about the latest site visit or project milestone..."
                className="block w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="button" onClick={handlePostComment}
                  disabled={addActivity.isPending || !comment.trim()}
                  className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {addActivity.isPending ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>

            {/* Activity table — scrollable */}
            {activities && activities.length > 0 ? (
              <div className="border-t border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <span>Date &amp; Description</span>
                  <span>User</span>
                </div>
                {/* Rows — max 3 visible, then scroll */}
                <div className="max-h-52 divide-y divide-gray-100 overflow-y-auto">
                  {activities.map((a) => {
                    const displayName = a.createdBy.name ?? a.createdBy.email ?? "U";
                    const initial = displayName.charAt(0).toUpperCase();
                    return (
                      <div key={a.id} className="py-3">
                        <div className="flex items-center gap-2">
                          {a.createdBy.image ? (
                            <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
                              <Image
                                src={a.createdBy.image}
                                alt={displayName}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                              {initial}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-xs font-medium text-blue-600">{displayName}</span>
                              <span className="shrink-0 text-xs text-gray-400">
                                {new Date(a.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}{" "}
                                {new Date(a.createdAt).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit", hour12: true })}
                              </span>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-800">{a.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-gray-400">No activity logged yet.</p>
            )}
          </section>

          {/* ── Footer buttons ── */}
          {updateProject.isError && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {updateProject.error.message}
            </div>
          )}
          <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-200 pt-4 pb-2">
            <Link
              href={`/admin/dashboard/projects/${projectId}`}
              className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="button" onClick={handleSaveChanges}
              disabled={updateProject.isPending}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
            >
              {updateProject.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
