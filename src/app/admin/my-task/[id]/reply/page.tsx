"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useUploadThing } from "~/lib/uploadthing";

type TaskStatus = "in-progress" | "action-taken";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type TimelineEventType = "created" | "acknowledged" | "in-progress" | "action-taken" | "reply";
type TimelineEvent = {
  id: string;
  label: string;
  sublabel?: string;
  date: Date;
  eventType: TimelineEventType;
};

const priorityConfig: Record<Priority, { label: string; bg: string }> = {
  URGENT: { label: "URGENT", bg: "bg-red-600" },
  HIGH:   { label: "HIGH",   bg: "bg-orange-500" },
  MEDIUM: { label: "MEDIUM", bg: "bg-yellow-500" },
  LOW:    { label: "LOW",    bg: "bg-green-500" },
};

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReplyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: task, isLoading } = api.taskNotification.getById.useQuery({ id });

  const [message, setMessage] = useState("");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("action-taken");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("taskReplyUploader");

  const replyMutation = api.taskNotification.reply.useMutation({
    onSuccess: () => router.push(`/admin/my-task/${id}`),
    onError: () => setSubmitting(false),
  });

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const picked = Array.from(e.target.files);
    e.target.value = "";
    setFiles((prev) => [...prev, ...picked]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  async function handleSubmit() {
    if (!message.trim()) return;
    setSubmitting(true);

    let documents: { fileName: string; fileUrl: string; fileSize: number; fileType: string }[] = [];

    if (files.length > 0) {
      const uploaded = await startUpload(files);
      if (uploaded) {
        documents = uploaded.map((f, i) => ({
          fileName: files[i]?.name ?? f.name,
          fileUrl: f.ufsUrl,
          fileSize: files[i]?.size ?? 0,
          fileType: files[i]?.type ?? "",
        }));
      }
    }

    replyMutation.mutate({
      taskId: id,
      message,
      taskStatus,
      documents: documents.length > 0 ? documents : undefined,
    });
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="h-4 w-64 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-80 animate-pulse rounded bg-gray-200" />
          <div className="h-96 animate-pulse rounded-xl bg-white border border-gray-200" />
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-lg font-semibold text-gray-700">Task not found</p>
        <Link href="/admin/my-task" className="text-sm text-[#1e3a4f] underline underline-offset-2">
          Back to My Tasks
        </Link>
      </div>
    );
  }

  const priority = priorityConfig[task.priority as Priority];
  const assignerName = task.createdBy.name ?? task.createdBy.email;
  const shortId = task.id.slice(0, 12).toUpperCase();
  const recipientName = task.notifyUser.name ?? task.notifyUser.email;

  // Build timeline events from real task data
  const timelineEvents: TimelineEvent[] = [
    {
      id: "created",
      label: "Task Created",
      sublabel: `by You`,
      date: new Date(task.createdAt),
      eventType: "created",
    },
  ];
  if (task.acknowledged && task.acknowledgedAt) {
    timelineEvents.push({
      id: "ack",
      label: `Acknowledged by ${recipientName}`,
      date: new Date(task.acknowledgedAt),
      eventType: "acknowledged",
    });
  }
  for (const reply of task.replies) {
    const eventType: TimelineEventType =
      reply.taskStatus === "in-progress" ? "in-progress"
      : reply.taskStatus === "action-taken" ? "action-taken"
      : "reply";
    timelineEvents.push({
      id: reply.id,
      label: `Reply by ${reply.createdBy.name ?? reply.createdBy.email}`,
      date: new Date(reply.createdAt),
      eventType,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main content area */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

        {/* Breadcrumb */}
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          <Link href="/admin/dashboard" className="transition hover:text-gray-600">Dashboard</Link>
          <span className="text-gray-300">&gt;</span>
          <Link href="/admin/my-task" className="transition hover:text-gray-600">My Tasks</Link>
          <span className="text-gray-300">&gt;</span>
          <Link href={`/admin/my-task/${id}`} className="transition hover:text-gray-600">Task Details</Link>
          <span className="text-gray-300">&gt;</span>
          <span className="text-gray-500">Reply</span>
        </nav>

        {/* Page heading */}
        <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Reply to Task Assignment</h1>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">System ID</p>
            <p className={`mt-0.5 rounded px-2 py-0.5 text-xs font-bold text-white ${priority.bg}`}>
              #{shortId}
            </p>
          </div>
        </div>
        <p className="mb-6 text-sm text-gray-500">
          Formulate and submit your formal response regarding the assigned engineering task.
          Ensure all technical documentation is attached for review.
        </p>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-4 lg:col-span-2">

            {/* Active Reference card */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-l-4 border-[#1e3a4f] p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Active Reference
                </p>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1e3a4f]">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 leading-snug">
                      {task.project.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        {formatDate(task.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        Assigned by {assignerName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Response Message */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="p-4">
                <div className="mb-3 flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                  <p className="text-xs font-bold text-gray-600">Official Response Message</p>
                </div>

                {/* Toolbar */}
                <div className="mb-2 flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5">
                  {[
                    { icon: "B", title: "Bold", style: "font-bold" },
                    { icon: "I", title: "Italic", style: "italic" },
                  ].map((btn) => (
                    <button
                      key={btn.title}
                      title={btn.title}
                      className={`flex h-7 w-7 items-center justify-center rounded text-xs text-gray-600 transition hover:bg-white hover:shadow-sm ${btn.style}`}
                    >
                      {btn.icon}
                    </button>
                  ))}
                  <button title="Bullet list" className="flex h-7 w-7 items-center justify-center rounded text-gray-600 transition hover:bg-white hover:shadow-sm">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </button>
                  <button title="Attach file" className="flex h-7 w-7 items-center justify-center rounded text-gray-600 transition hover:bg-white hover:shadow-sm">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                    </svg>
                  </button>
                </div>

                {/* Textarea */}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your detailed report or response here..."
                  rows={7}
                  className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#1e3a4f] focus:ring-1 focus:ring-[#1e3a4f]"
                />
              </div>
            </div>

            {/* Supporting Documents */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="p-4">
                <div className="mb-3 flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                  <p className="text-xs font-bold text-gray-600">Supporting Documents</p>
                </div>

                {/* Drop Zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-10 transition ${
                    isDragOver
                      ? "border-[#1e3a4f] bg-[#1e3a4f]/5"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1e3a4f]/10">
                    <svg className="h-6 w-6 text-[#1e3a4f]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Drag and drop files here</p>
                  <p className="mt-1 text-xs text-gray-400">PDF, JPG, or PNG up to 25MB total</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Browse Local Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                          </svg>
                          <span className="truncate text-xs font-medium text-gray-700">{file.name}</span>
                          <span className="shrink-0 text-xs text-gray-400">{formatBytes(file.size)}</span>
                        </div>
                        <button
                          onClick={() => removeFile(i)}
                          className="ml-2 shrink-0 text-gray-400 transition hover:text-red-500"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-4">

            {/* Task Status Update */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="p-4">
                <div className="mb-1 flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Task Status Update
                  </p>
                </div>
                <p className="mb-4 text-xs text-gray-400">
                  You may optionally update the task status upon sending this reply.
                </p>

                <div className="flex flex-col gap-2">
                  {/* In Progress */}
                  <button
                    onClick={() => setTaskStatus("in-progress")}
                    className={`flex items-start gap-3 rounded-lg border p-3 text-left transition ${
                      taskStatus === "in-progress"
                        ? "border-[#1e3a4f] bg-[#1e3a4f]/5"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition ${
                      taskStatus === "in-progress"
                        ? "border-[#1e3a4f] bg-[#1e3a4f]"
                        : "border-gray-300"
                    }`}>
                      {taskStatus === "in-progress" && (
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Mark as &quot;In Progress&quot;</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        User is currently acting on this
                      </p>
                    </div>
                  </button>

                  {/* Action Taken */}
                  <button
                    onClick={() => setTaskStatus("action-taken")}
                    className={`flex items-start gap-3 rounded-lg border p-3 text-left transition ${
                      taskStatus === "action-taken"
                        ? "border-[#1e3a4f] bg-[#1e3a4f]/5"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition ${
                      taskStatus === "action-taken"
                        ? "border-[#1e3a4f] bg-[#1e3a4f]"
                        : "border-gray-300"
                    }`}>
                      {taskStatus === "action-taken" && (
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Mark as &quot;Action Taken&quot;</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Response submitted for approval
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Submission Guidelines */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="p-4">
                <div className="mb-3 flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-[#1e3a4f]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Submission Guidelines
                  </p>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {[
                    "Be specific with technical data and project references.",
                    "Ensure all relevant blueprints or receipts are attached.",
                    "This message will be logged in the permanent project history.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1e3a4f]/10">
                        <svg className="h-2.5 w-2.5 text-[#1e3a4f]" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </div>
                      <p className="text-xs leading-relaxed text-gray-500">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Task Timeline */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Task Timeline
                  </p>
                  {timelineEvents.length > 3 && (
                    <span className="text-[10px] font-semibold text-gray-400">{timelineEvents.length} events</span>
                  )}
                </div>
                <div className="relative flex flex-col overflow-y-auto pl-4 pr-1" style={{ maxHeight: "216px" }}>
                  <div className="absolute left-1.5 top-2 h-[calc(100%-16px)] w-px bg-gray-200" />
                  {timelineEvents.map((event, i) => (
                    <div key={event.id} className={`relative flex items-start gap-3 ${i < timelineEvents.length - 1 ? "pb-4" : ""}`}>
                      <div className={`absolute -left-px mt-1 h-3 w-3 rounded-full border-2 ${
                        event.eventType === "created"      ? "border-[#1e3a4f] bg-white"
                        : event.eventType === "acknowledged" ? "border-green-500 bg-green-500"
                        : event.eventType === "in-progress"  ? "border-amber-500 bg-amber-500"
                        : event.eventType === "action-taken" ? "border-emerald-600 bg-emerald-600"
                        : "border-gray-400 bg-gray-400"
                      }`} />
                      <div className="pl-4">
                        <p className="text-xs font-semibold text-gray-800">{event.label}</p>
                        {event.sublabel && (
                          <p className="text-[10px] text-gray-400">{event.sublabel}</p>
                        )}
                        {(event.eventType === "in-progress" || event.eventType === "action-taken") && (
                          <span className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                            event.eventType === "in-progress"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {event.eventType === "in-progress" ? "In Progress" : "Action Taken"}
                          </span>
                        )}
                        {event.eventType === "acknowledged" && (
                          <span className="mt-0.5 inline-block rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-green-100 text-green-700">
                            Acknowledged
                          </span>
                        )}
                        <p className="text-[11px] text-gray-400">{formatDate(event.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-4 shadow-md sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <Link
            href={`/admin/my-task/${id}`}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            Cancel Reply
          </Link>
          <button
            onClick={() => void handleSubmit()}
            disabled={!message.trim() || submitting}
            className="flex items-center gap-2 rounded-lg bg-[#1e3a4f] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#16303f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
                Send Official Reply
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
