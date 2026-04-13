"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";

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

export default function UserMessagesPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: task, isLoading, refetch } = api.taskNotification.getById.useQuery({ id });
  const replyMutation = api.taskNotification.reply.useMutation({
    onSuccess: () => { setMessage(""); void refetch(); },
  });

  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [task?.replies]);

  function handleSend() {
    if (!message.trim() || replyMutation.isPending) return;
    replyMutation.mutate({ taskId: id, message: message.trim() });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
        <Link href="/user/dashboard/my-task" className="text-sm text-[#1e3a4f] underline">Back</Link>
      </div>
    );
  }

  const { label: priorityLabel, bg: priorityBg } = priorityConfig[task.priority as Priority];
  const assignerName = task.createdBy.name ?? task.createdBy.email ?? "Admin";
  const myName = task.notifyUser.name ?? task.notifyUser.email ?? "You";
  const userId = task.notifyUser.id;

  // Build chronological thread
  type ThreadItem =
    | { kind: "task"; date: Date }
    | { kind: "reply"; id: string; message: string; taskStatus: string | null; senderName: string; senderId: string; date: Date }
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
    });
  }

  if (task.acknowledged && task.acknowledgedAt) {
    thread.push({ kind: "ack", date: new Date(task.acknowledgedAt) });
  }

  thread.sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="flex h-[calc(100vh-112px)] flex-col bg-gray-50">

      {/* ── Header ── */}
      <div className="shrink-0 border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-start justify-between gap-4">
          {/* Breadcrumb + title */}
          <div className="min-w-0">
            <nav className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              <Link href="/user/dashboard/my-task" className="hover:text-gray-600">My Tasks</Link>
              <span className="text-gray-300">&gt;</span>
              <Link href={`/user/dashboard/my-task/${id}`} className="hover:text-gray-600">Task Detail</Link>
              <span className="text-gray-300">&gt;</span>
              <span className="text-gray-500">Messages</span>
            </nav>
            <div className="flex items-center gap-2">
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

          {/* Assigner info */}
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Assigned by</p>
            <p className="text-sm font-semibold text-gray-700">{assignerName}</p>
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
      <div className="flex-1 overflow-y-auto px-6 py-5">
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
                  {/* Initial task message bubble — from admin (left side for user) */}
                  <div className="flex w-full justify-start">
                    <div className="flex max-w-[75%] items-end gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e3a4f] text-xs font-bold text-white">
                        {assignerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-gray-600">{assignerName}</span>
                          <span className="text-[11px] text-gray-400">{timeAgo(item.date)}</span>
                        </div>
                        <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-relaxed text-gray-800 shadow-sm ring-1 ring-gray-200">
                          {task.description}
                        </div>
                        <p className="mt-1 text-[10px] text-gray-400">Task Assignment</p>
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
                    <span className="font-semibold">You acknowledged receipt · {formatDate(item.date)}</span>
                  </div>
                  <div className="h-px flex-1 bg-emerald-100" />
                </div>
              );
            }

            if (item.kind === "reply") {
              const isMe = item.senderId === userId;
              const statusLabel =
                item.taskStatus === "in-progress" ? "In Progress" :
                item.taskStatus === "action-taken" ? "Action Taken" : null;

              if (isMe) {
                // My message — right aligned (dark navy)
                return (
                  <div key={item.id} className="flex w-full justify-end">
                    <div className="flex max-w-[75%] items-end gap-2">
                      <div className="min-w-0">
                        <div className="mb-1 flex items-center justify-end gap-1.5">
                          {statusLabel && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                              {statusLabel}
                            </span>
                          )}
                          <span className="text-[11px] text-gray-400">{timeAgo(item.date)}</span>
                          <span className="text-xs font-semibold text-gray-600">{myName} (You)</span>
                        </div>
                        <div className="rounded-2xl rounded-tr-sm bg-[#1e3a4f] px-4 py-3 text-sm leading-relaxed text-white shadow-sm">
                          {item.message}
                        </div>
                      </div>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e3a4f] text-xs font-bold text-white">
                        {myName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                );
              }

              // Admin message — left aligned
              return (
                <div key={item.id} className="flex w-full justify-start">
                  <div className="flex max-w-[75%] items-end gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-gray-700">
                      {item.senderName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-gray-600">{item.senderName}</span>
                        <span className="text-[11px] text-gray-400">{timeAgo(item.date)}</span>
                      </div>
                      <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-relaxed text-gray-800 shadow-sm ring-1 ring-gray-200">
                        {item.message}
                      </div>
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
      <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-end gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1e3a4f] text-sm font-bold text-white">
            {myName.charAt(0).toUpperCase()}
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
          <button
            onClick={handleSend}
            disabled={!message.trim() || replyMutation.isPending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1e3a4f] text-white transition hover:bg-[#16303f] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {replyMutation.isPending ? (
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
  );
}
