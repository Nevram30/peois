"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useUploadThing } from "~/lib/uploadthing";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

const priorityConfig: Record<Priority, { label: string; bg: string }> = {
  URGENT: { label: "URGENT", bg: "bg-red-600" },
  HIGH:   { label: "HIGH",   bg: "bg-orange-500" },
  MEDIUM: { label: "MEDIUM", bg: "bg-yellow-500" },
  LOW:    { label: "LOW",    bg: "bg-green-500" },
};

function timeAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminMessagesPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: task, isLoading, refetch } = api.taskNotification.getById.useQuery({ id });
  const replyMutation = api.taskNotification.reply.useMutation({
    onSuccess: () => { setMessage(""); void refetch(); },
  });

  const [message, setMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("taskReplyUploader");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [task?.replies]);

  async function handleSend() {
    if ((!message.trim() && attachedFiles.length === 0) || replyMutation.isPending || uploading) return;

    let documents: { fileName: string; fileUrl: string; fileSize: number; fileType: string }[] = [];

    if (attachedFiles.length > 0) {
      setUploading(true);
      try {
        const uploaded = await startUpload(attachedFiles);
        if (uploaded) {
          documents = uploaded.map((f, i) => ({
            fileName: attachedFiles[i]?.name ?? f.name,
            fileUrl: f.ufsUrl,
            fileSize: attachedFiles[i]?.size ?? 0,
            fileType: attachedFiles[i]?.type ?? "",
          }));
        }
      } finally {
        setUploading(false);
      }
    }

    replyMutation.mutate({
      taskId: id,
      message: message.trim() || "📎 Sent attachment(s)",
      documents: documents.length > 0 ? documents : undefined,
    });
    setAttachedFiles([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setAttachedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    e.target.value = "";
  }

  function removeAttachment(index: number) {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col bg-gray-50">
        <div className="space-y-3 p-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white border border-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <p className="text-sm text-gray-500">Task not found</p>
        <Link href="/admin/dashboard/my-task" className="text-sm text-[#1e3a4f] underline">Back</Link>
      </div>
    );
  }

  const { label: priorityLabel, bg: priorityBg } = priorityConfig[task.priority as Priority];
  const recipient = task.notifyUser;
  const recipientName = recipient.name ?? recipient.email ?? "User";
  const adminName = task.createdBy.name ?? task.createdBy.email ?? "Admin";

  // Build chronological thread: task creation + replies + acknowledgment
  type ReplyDocument = { id: string; fileName: string; fileUrl: string; fileSize: number | null; fileType: string | null };
  type ThreadItem =
    | { kind: "task"; date: Date }
    | { kind: "reply"; id: string; message: string; taskStatus: string | null; senderName: string; senderId: string; date: Date; documents: ReplyDocument[] }
    | { kind: "ack"; date: Date };

  const thread: ThreadItem[] = [
    { kind: "task", date: new Date(task.createdAt) },
  ];

  for (const r of task.replies) {
    thread.push({
      kind: "reply",
      id: r.id,
      message: r.message,
      taskStatus: r.taskStatus ?? null,
      senderName: r.createdBy.name ?? r.createdBy.email ?? "Unknown",
      senderId: r.createdById,
      date: new Date(r.createdAt),
      documents: r.documents ?? [],
    });
  }

  if (task.acknowledged && task.acknowledgedAt) {
    thread.push({ kind: "ack", date: new Date(task.acknowledgedAt) });
  }

  thread.sort((a, b) => a.date.getTime() - b.date.getTime());

  const adminId = task.createdBy.id;

  return (
    <div className="flex h-[calc(100vh-112px)] flex-col bg-gray-50">

      {/* ── Header ── */}
      <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-4 shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-3xl items-start justify-between gap-4">
          {/* Breadcrumb + title */}
          <div className="min-w-0">
            <nav className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              <Link href="/admin/dashboard/my-task" className="hover:text-gray-600">My Tasks</Link>
              <span className="text-gray-300">&gt;</span>
              <Link href={`/admin/dashboard/my-task/${id}`} className="hover:text-gray-600">Task Detail</Link>
              <span className="text-gray-300">&gt;</span>
              <span className="text-gray-500">Messages</span>
            </nav>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base font-bold text-gray-900">Task Messages</h1>
              <span className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-widest text-white ${priorityBg}`}>
                {priorityLabel}
              </span>
              {task.acknowledged && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  ✓ Acknowledged
                </span>
              )}
            </div>
          </div>

          {/* Recipient info */}
          <div className="hidden shrink-0 text-right sm:block">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Assigned to</p>
            <p className="text-sm font-semibold text-gray-700">{recipientName}</p>
          </div>
        </div>

        {/* Task summary strip */}
        <div className="mx-auto mt-3 max-w-3xl rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5">
          <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">{task.description}</p>
          <div className="mt-1.5 flex items-center gap-3 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
              {task.project.title} ({task.project.projectCode})
            </span>
          </div>
        </div>
      </div>

      {/* ── Message Thread ── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-3xl flex flex-col gap-4">

          {thread.map((item) => {
            if (item.kind === "task") {
              return (
                <div key="task-created" className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <div className="h-px w-16 bg-gray-200" />
                    <span>Task created · {formatDate(item.date)}</span>
                    <div className="h-px w-16 bg-gray-200" />
                  </div>
                  {/* Initial task message bubble — from admin (right side) */}
                  <div className="flex w-full justify-end">
                    <div className="flex max-w-[85%] items-end gap-2 sm:max-w-[75%]">
                      <div className="min-w-0">
                        <div className="mb-1 flex items-center justify-end gap-1.5">
                          <span className="text-[11px] text-gray-400">{timeAgo(item.date)}</span>
                          <span className="text-xs font-semibold text-gray-600">{adminName} (You)</span>
                        </div>
                        <div className="rounded-2xl rounded-tr-sm bg-[#1e3a4f] px-4 py-3 text-sm leading-relaxed text-white shadow-sm">
                          {task.description}
                        </div>
                        <p className="mt-1 text-right text-[10px] text-gray-400">Task Assignment</p>
                      </div>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e3a4f] text-xs font-bold text-white">
                        {adminName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (item.kind === "ack") {
              return (
                <div key="ack" className="flex items-center gap-2 text-[11px] text-emerald-500">
                  <div className="h-px flex-1 bg-emerald-100" />
                  <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="font-semibold">{recipientName} acknowledged receipt · {formatDate(item.date)}</span>
                  </div>
                  <div className="h-px flex-1 bg-emerald-100" />
                </div>
              );
            }

            if (item.kind === "reply") {
              const isAdmin = item.senderId === adminId;
              const statusLabel =
                item.taskStatus === "in-progress" ? "In Progress" :
                item.taskStatus === "action-taken" ? "Action Taken" : null;

              if (isAdmin) {
                // Admin message — right aligned
                return (
                  <div key={item.id} className="flex w-full justify-end">
                    <div className="flex max-w-[85%] items-end gap-2 sm:max-w-[75%]">
                      <div className="min-w-0">
                        <div className="mb-1 flex items-center justify-end gap-1.5">
                          <span className="text-[11px] text-gray-400">{timeAgo(item.date)}</span>
                          <span className="text-xs font-semibold text-gray-600">{item.senderName} (You)</span>
                        </div>
                        <div className="rounded-2xl rounded-tr-sm bg-[#1e3a4f] px-4 py-3 text-sm leading-relaxed text-white shadow-sm">
                          {item.message}
                        </div>
                        {item.documents.length > 0 && (
                          <div className="mt-2 flex flex-col gap-1.5">
                            {item.documents.map((doc) => (
                              <a
                                key={doc.id}
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-xl border border-[#1e3a4f]/20 bg-[#1e3a4f]/10 px-3 py-2 transition hover:bg-[#1e3a4f]/20"
                              >
                                <svg className="h-4 w-4 shrink-0 text-[#1e3a4f]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                <span className="min-w-0 flex-1 truncate text-xs font-medium text-[#1e3a4f]">{doc.fileName}</span>
                                <svg className="h-3.5 w-3.5 shrink-0 text-[#1e3a4f]/60" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e3a4f] text-xs font-bold text-white">
                        {item.senderName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                );
              }

              // User message — left aligned
              return (
                <div key={item.id} className="flex w-full justify-start">
                  <div className="flex max-w-[85%] items-end gap-2 sm:max-w-[75%]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-gray-700">
                      {item.senderName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-gray-600">{item.senderName}</span>
                        {statusLabel && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                            {statusLabel}
                          </span>
                        )}
                        <span className="text-[11px] text-gray-400">{timeAgo(item.date)}</span>
                      </div>
                      <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-relaxed text-gray-800 shadow-sm ring-1 ring-gray-200">
                        {item.message}
                      </div>
                      {item.documents.length > 0 && (
                        <div className="mt-2 flex flex-col gap-1.5">
                          {item.documents.map((doc) => (
                            <a
                              key={doc.id}
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition hover:bg-gray-100"
                            >
                              <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                              <span className="min-w-0 flex-1 truncate text-xs font-medium text-gray-700">{doc.fileName}</span>
                              <svg className="h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input Bar ── */}
      <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {/* Attached files preview */}
          {attachedFiles.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {attachedFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5">
                  <svg className="h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <span className="max-w-35 truncate text-xs font-medium text-gray-700">{file.name}</span>
                  <span className="text-[10px] text-gray-400">{formatBytes(file.size)}</span>
                  <button onClick={() => removeAttachment(i)} className="ml-0.5 text-gray-400 hover:text-red-500">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2 sm:gap-3">
            <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1e3a4f] text-sm font-bold text-white sm:flex">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus-within:border-[#1e3a4f] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#1e3a4f] transition">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
                rows={1}
                className="w-full resize-none bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                style={{ maxHeight: "120px" }}
                onInput={(e) => {
                  const t = e.currentTarget;
                  t.style.height = "auto";
                  t.style.height = `${Math.min(t.scrollHeight, 120)}px`;
                }}
              />
            </div>
            {/* Attach file */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition hover:border-[#1e3a4f] hover:text-[#1e3a4f]"
              title="Attach file"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
              </svg>
            </button>
            <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden" onChange={handleFileChange} />
            {/* Send */}
            <button
              onClick={() => void handleSend()}
              disabled={(!message.trim() && attachedFiles.length === 0) || replyMutation.isPending || uploading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1e3a4f] text-white transition hover:bg-[#16303f] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {replyMutation.isPending || uploading ? (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
