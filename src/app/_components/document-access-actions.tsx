"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { type Action } from "../types/DocumentTypes";
import { type DocumentProps } from "../types/DocumentTypes";
import { DownloadIcon, EyeIcon } from "../constant/svg-icons";

/**
 * Renders the View / Download icons for a project document. The icons are
 * always visible; clicking one either performs the action (when the admin's
 * access has been approved) or opens an "Access Required" modal where they can
 * submit a request for a super-admin to review.
 */
export const DocumentAccessActions = ({
  projectId,
  fileId,
  fileName,
  fileUrl,
  size = "md",
  requestMode = "confirm",
  projectTitle = "",
  requesterName = "",
  requesterEmployeeId = "",
}: DocumentProps) => {

  const utils = api.useUtils();

  const { data: myRequests } = api.projectAccessRequest.getMyForProject.useQuery({ projectId });
  const requestAccess = api.projectAccessRequest.request.useMutation({
    onSuccess: () => void utils.projectAccessRequest.getMyForProject.invalidate({ projectId }),
  });

  const [modalAction, setModalAction] = useState<Action | null>(null);
  const [modalView, setModalView] = useState<"confirm" | "form">("confirm");
  const [justification, setJustification] = useState("");

  const openModal = (action: Action) => {
    setJustification("");
    setModalAction(action);
    // "form" mode (USER) jumps straight to the form; "confirm" mode (ADMIN)
    // shows the confirm modal first, then opens the form on "Request Access".
    setModalView(requestMode === "form" ? "form" : "confirm");
  };

  const statusFor = (action: Action): "PENDING" | "APPROVED" | "DENIED" | "NONE" => {
    const match = myRequests?.find((r) => r.projectFileId === fileId && r.action === action);
    return match?.status ?? "NONE";
  };

  const performAction = (action: Action) => {
    if (action === "VIEW") {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
      return;
    }
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleClick = (action: Action) => {
    if (statusFor(action) === "APPROVED") {
      performAction(action);
    } else {
      openModal(action);
    }
  };

  const submitRequest = () => {
    if (!modalAction) return;
    requestAccess.mutate(
      {
        projectFileId: fileId,
        action: modalAction,
        note: justification.trim() || undefined,
      },
      { onSuccess: () => setModalAction(null) },
    );
  };

  const iconCls = "h-4 w-4";

  const buttonTone =
    size === "sm" ? "text-gray-400 hover:text-blue-500" : "text-blue-500 hover:text-blue-700";

  const modalStatus = modalAction ? statusFor(modalAction) : "NONE";
  const actionLabel = modalAction === "DOWNLOAD" ? "download" : "view";

  return (
    <>
      <div className={`flex items-center ${size === "sm" ? "justify-center gap-2" : "justify-end gap-3"}`}>
        <button
          type="button"
          onClick={() => handleClick("VIEW")}
          className={`transition ${buttonTone}`}
          title={`View ${fileName}`}
          aria-label={`View ${fileName}`}
        >
          <EyeIcon className={iconCls} />
        </button>
        <button
          type="button"
          onClick={() => handleClick("DOWNLOAD")}
          className={`transition ${buttonTone}`}
          title={`Download ${fileName}`}
          aria-label={`Download ${fileName}`}
        >
          <DownloadIcon className={iconCls} />
        </button>
      </div>

      {modalAction && modalStatus !== "PENDING" && modalView === "form" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setModalAction(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start gap-4 bg-slate-50 px-7 py-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1e3a4f] text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 4.556-3.04 8.4-7.2 9.6a.75.75 0 0 1-.6 0C9.04 20.4 6 16.556 6 12V6.741a.75.75 0 0 1 .53-.717A11.21 11.21 0 0 0 12 3.74a11.21 11.21 0 0 0 5.47 2.284.75.75 0 0 1 .53.717V12Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">Request Access</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Elevate your administrative permissions for the MIS platform.
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-5 px-7 py-6">
              {modalStatus === "DENIED" && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                  Your previous request was denied. You may submit a new request below.
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Full Name</label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2.5">
                    <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <span className="truncate text-sm font-semibold text-gray-800">{requesterName || "—"}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Employee ID</label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2.5">
                    <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                    </svg>
                    <span className="truncate text-sm font-semibold text-gray-800">{requesterEmployeeId || "—"}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Project Title</label>
                <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2.5">
                  <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                  <span className="truncate text-sm font-semibold text-gray-800">{projectTitle || "—"}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Justification / Business Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder="Please provide a detailed explanation for this access request..."
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex gap-3 rounded-lg border-l-4 border-blue-500 bg-blue-50 px-4 py-3 text-xs leading-relaxed text-gray-600">
                <svg className="h-4 w-4 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                <span>
                  Access requests are typically reviewed within 24–48 business hours by the Governance Board. You will
                  receive a notification once a decision is made.
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 px-7 pb-6">
              <button
                type="button"
                onClick={() => setModalAction(null)}
                className="text-sm font-semibold text-[#1e3a4f] transition hover:text-[#152a3a]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={requestAccess.isPending || !justification.trim()}
                onClick={submitRequest}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {requestAccess.isPending ? "Submitting…" : "Submit Request"}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAction && modalStatus !== "PENDING" && modalView === "confirm" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setModalAction(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 4.556-3.04 8.4-7.2 9.6a.75.75 0 0 1-.6 0C9.04 20.4 6 16.556 6 12V6.741a.75.75 0 0 1 .53-.717A11.21 11.21 0 0 0 12 3.74a11.21 11.21 0 0 0 5.47 2.284.75.75 0 0 1 .53.717V12Z" />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">Document Access Required</h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
              {modalStatus === "DENIED" ? (
                <>
                  Your previous request to {actionLabel} <span className="font-medium text-gray-700">{fileName}</span>{" "}
                  was denied. You may submit a new request for a Super Admin to review.
                </>
              ) : (
                <>
                  You need approval to {actionLabel} <span className="font-medium text-gray-700">{fileName}</span>.
                  Submit a request and a Super Admin will review it before granting access.
                </>
              )}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setModalView("form")}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-gray-700 transition hover:bg-gray-50"
              >
                {modalStatus === "DENIED" ? "Request Again" : "Request Access"}
              </button>
              <button
                type="button"
                onClick={() => setModalAction(null)}
                className="flex-1 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-green-700"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAction && modalStatus === "PENDING" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setModalAction(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 4.556-3.04 8.4-7.2 9.6a.75.75 0 0 1-.6 0C9.04 20.4 6 16.556 6 12V6.741a.75.75 0 0 1 .53-.717A11.21 11.21 0 0 0 12 3.74a11.21 11.21 0 0 0 5.47 2.284.75.75 0 0 1 .53.717V12Z" />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">Access Request Pending</h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
              Your request to {actionLabel} <span className="font-medium text-gray-700">{fileName}</span> is
              awaiting Super Admin approval. You&apos;ll be able to {actionLabel} this document once it is approved.
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setModalAction(null)}
                className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-green-700"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
