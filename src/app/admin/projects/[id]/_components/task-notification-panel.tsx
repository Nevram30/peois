"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";
import { divisionLabel, groupByDivision } from "~/lib/divisions";

const PRIORITY_CONFIG = {
  HIGH: { pill: "High", bg: "bg-red-50", border: "border-red-200", text: "text-red-700", dot: "bg-red-500", activeBg: "bg-red-500" },
  MEDIUM: { pill: "Medium", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-400", activeBg: "bg-amber-500" },
  LOW: { pill: "Low", bg: "bg-green-50", border: "border-green-200", text: "text-green-700", dot: "bg-green-500", activeBg: "bg-green-600" },
  URGENT: { pill: "Urgent", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", dot: "bg-purple-500", activeBg: "bg-purple-600" },
} as const;

type Priority = keyof typeof PRIORITY_CONFIG;

const PRIORITY_HINT: Record<Priority, string> = {
  URGENT: "Acknowledge & respond immediately",
  HIGH: "Acknowledge & respond within 4 hours",
  MEDIUM: "Acknowledge & respond within 24 hours",
  LOW: "Acknowledge & respond within 48 hours",
};

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{children}</p>
);

export const TaskNotificationPanel = ({ projectId }: { projectId: string }) => {
  const [notifyUserId, setNotifyUserId] = useState("");
  const [notifyPriority, setNotifyPriority] = useState<Priority>("MEDIUM");
  const [taskDescription, setTaskDescription] = useState("");
  const [showNotifSuccess, setShowNotifSuccess] = useState(false);

  const { data: usersForSelect } = api.user.getForSelect.useQuery();
  const groupedUsers = useMemo(
    () => groupByDivision(usersForSelect ?? []),
    [usersForSelect],
  );
  const selectedUser = usersForSelect?.find((u) => u.id === notifyUserId);

  const sendNotification = api.project.sendTaskNotification.useMutation({
    onSuccess: () => {
      setTaskDescription("");
      setNotifyUserId("");
      setNotifyPriority("MEDIUM");
      setShowNotifSuccess(true);
    },
  });

  const handleSendNotification = () => {
    if (!notifyUserId || !taskDescription.trim()) return;
    sendNotification.mutate({
      projectId,
      notifyUserId,
      priority: notifyPriority,
      description: taskDescription.trim(),
    });
  };

  return (
    <div className="rounded-sm border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
        <span className="text-blue-500">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-700">Task Notification</span>
      </div>

      <div className="p-4">
        {showNotifSuccess && (
          <div className="mb-4 flex items-center gap-2 rounded-sm border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700">
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Notification sent successfully.
            <button
              type="button"
              onClick={() => setShowNotifSuccess(false)}
              className="ml-auto cursor-pointer text-green-400 hover:text-green-600"
            >
              ✕
            </button>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <FieldLabel>Select User to Notify</FieldLabel>
            <div className="relative">
              <select
                value={notifyUserId}
                onChange={(e) => setNotifyUserId(e.target.value)}
                className="block w-full cursor-pointer appearance-none rounded-sm border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              >
                <option value="">Select a user...</option>
                {/* Grouped by division so recipients are picked by the district
                    they belong to; the list mixes admins and users, so the role
                    is spelled out too — two people otherwise read identically. */}
                {groupedUsers.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.people.map((u) => (
                      <option key={u.id} value={u.id}>
                        {`${u.name ?? "Unnamed"} — ${u.email}${u.employeeId ? ` (${u.employeeId})` : ""} · ${u.role === "ADMIN" ? "Admin" : "User"}`}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            {/* A collapsed select hides the optgroup, so the chosen recipient's
                division is repeated here. */}
            {selectedUser && (
              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                {divisionLabel(selectedUser.division)}
                <span className="text-gray-400">
                  {" · "}
                  {selectedUser.role === "ADMIN" ? "Admin" : "User"}
                </span>
              </p>
            )}
            {usersForSelect?.length === 0 && (
              <p className="mt-1 text-xs text-amber-600">
                No recipients available — a recipient must be an active admin or
                user in your engineering district or an office division.
              </p>
            )}
          </div>

          <div>
            <FieldLabel>Priority Level</FieldLabel>
            {/* Inline pills rather than stacked rows — keeps the priority
                picker to one line so the description box gets the height. */}
            <div className="mt-1 flex flex-wrap gap-2">
              {(["URGENT", "HIGH", "MEDIUM", "LOW"] as const).map((p) => {
                const cfg = PRIORITY_CONFIG[p];
                const isActive = notifyPriority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNotifyPriority(p)}
                    title={PRIORITY_HINT[p]}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition ${isActive ? `${cfg.activeBg} border-transparent text-white` : `${cfg.bg} ${cfg.border} ${cfg.text}`
                      }`}
                  >
                    <span className={`h-2 w-2 shrink-0 rounded-full ${isActive ? "bg-white/80" : cfg.dot}`} />
                    {cfg.pill}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[10px] text-gray-400">{PRIORITY_HINT[notifyPriority]}</p>
          </div>

          <div className="flex flex-col">
            <FieldLabel>Task Description / Instructions</FieldLabel>
            <textarea
              rows={12}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Type instructions or task details here..."
              className="mt-1 flex-1 resize-none rounded-sm border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleSendNotification}
                disabled={sendNotification.isPending || !notifyUserId || !taskDescription.trim()}
                className="flex cursor-pointer items-center gap-2 rounded-sm bg-blue-600 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sendNotification.isPending ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                )}
                {sendNotification.isPending ? "Sending..." : "Send Notification"}
              </button>
            </div>
            {sendNotification.isError && (
              <p className="mt-2 text-right text-xs text-red-600">{sendNotification.error.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
