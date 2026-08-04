"use client";

import { useEffect, useRef, useState } from "react";
import {
  DOC_ACCEPT,
  DOC_CHECKLIST,
  formatBytes,
  inferDocType,
  maxBytesFor,
  type DocType,
} from "~/lib/project-documents";

type Props = {
  open: boolean;
  onClose: () => void;
  // Resolves once the files have been uploaded and filed; rejects on failure so
  // the modal can stay open with the error showing.
  onSubmit: (files: File[], docType: DocType) => Promise<void>;
  isUploading: boolean;
  uploadError: string | null;
  // Files dropped onto the documents table, staged for this modal.
  initialFiles?: File[];
};

export function UploadDocumentModal({
  open,
  onClose,
  onSubmit,
  isUploading,
  uploadError,
  initialFiles,
}: Props) {
  const [docType, setDocType] = useState<DocType | "">("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Every opening starts clean, apart from files handed over by a drop on the
  // documents table.
  useEffect(() => {
    if (!open) return;
    const staged = initialFiles ?? [];
    setFiles(staged);
    setDocType(staged[0] ? inferDocType(staged[0].name) : "");
    setIsDragging(false);
    setShowErrors(false);
    setFileError(null);
  }, [open, initialFiles]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isUploading) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, isUploading, onClose]);

  if (!open) return null;

  const addFiles = (incoming: FileList | File[] | null) => {
    const list = Array.from(incoming ?? []);
    if (list.length === 0) return;

    const tooBig = list.find((f) => f.size > maxBytesFor(f));
    if (tooBig) {
      setFileError(
        `"${tooBig.name}" is ${formatBytes(tooBig.size)} — over the ${formatBytes(maxBytesFor(tooBig))} limit.`,
      );
      return;
    }

    setFileError(null);
    setFiles((prev) => [
      ...prev,
      // Re-picking the same file should not queue it twice.
      ...list.filter(
        (f) => !prev.some((p) => p.name === f.name && p.size === f.size),
      ),
    ]);
    // The file name only suggests a category; an explicit choice wins.
    if (!docType && list[0]) setDocType(inferDocType(list[0].name));
  };

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!docType || files.length === 0) {
      setShowErrors(true);
      return;
    }
    await onSubmit(files, docType);
  };

  const missingCategory = showErrors && !docType;
  const missingFiles = showErrors && files.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50"
        onClick={() => !isUploading && onClose()}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-document-title"
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-sm bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-8 pb-5 pt-7">
          <div>
            <h3
              id="upload-document-title"
              className="text-2xl font-extrabold text-[#1e2a63]"
            >
              Upload Project Document
            </h3>
            <p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
              Secure File Submission
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            aria-label="Close"
            className="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-7">
          {/* Document category */}
          <div className="mb-7">
            <label
              htmlFor="upload-doc-category"
              className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-500"
            >
              Document Category <span className="text-red-500">*</span>
            </label>
            <select
              id="upload-doc-category"
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocType)}
              disabled={isUploading}
              className={`block w-full rounded-sm border bg-gray-50 px-3.5 py-3 text-base font-semibold text-gray-900 shadow-sm transition focus:ring-2 focus:outline-none disabled:opacity-60 ${
                missingCategory
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            >
              <option value="">Select an official document type...</option>
              {DOC_CHECKLIST.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
              <option value="OTHER">Other Supporting Document</option>
            </select>
            {missingCategory && (
              <p className="mt-1 text-xs text-red-500">
                Choose the requirement this document satisfies.
              </p>
            )}
          </div>

          {/* File attachment */}
          <div>
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-500">
              File Attachment <span className="text-red-500">*</span>
            </span>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (!isUploading) addFiles(e.dataTransfer.files);
              }}
              className={`rounded-xl border-2 border-dashed px-6 py-12 text-center transition ${
                isDragging
                  ? "border-blue-500 bg-blue-50/70"
                  : missingFiles
                    ? "border-red-300 bg-red-50/40"
                    : "border-gray-200 bg-gray-50/70"
              }`}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
                <svg className="h-7 w-7 text-blue-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3m9-6.75V18a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18V6a2.25 2.25 0 0 1 2.25-2.25h6.879a1.5 1.5 0 0 1 1.06.44l3.622 3.62a1.5 1.5 0 0 1 .439 1.061Z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-[#1e2a63]">
                Drag &amp; drop files here
              </p>
              <p className="mt-1 text-sm text-gray-500">
                or{" "}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={isUploading}
                  className="font-bold text-blue-600 underline-offset-2 transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  browse files
                </button>
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {["PDF", "DOC", "JPG", "PNG", "MAX 16MB"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept={DOC_ACCEPT}
                className="hidden"
                onChange={(e) => {
                  addFiles(e.target.files);
                  // Allow re-picking a file that was removed from the queue.
                  e.target.value = "";
                }}
              />
            </div>
            {missingFiles && (
              <p className="mt-1 text-xs text-red-500">
                Attach at least one file.
              </p>
            )}

            {/* Staged files */}
            {files.length > 0 && (
              <ul className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${file.size}-${index}`}
                    className="flex items-center gap-3 rounded-sm border border-gray-200 bg-white px-3 py-2.5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-blue-100">
                      <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="min-w-0 flex-1 truncate text-sm text-gray-700">
                      {file.name}
                    </span>
                    <span className="shrink-0 text-xs text-gray-400">
                      {formatBytes(file.size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                      aria-label={`Remove ${file.name}`}
                      className="shrink-0 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {(fileError ?? uploadError) && (
              <p className="mt-3 text-xs text-red-500">
                {fileError ?? uploadError}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/70 px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="rounded-sm px-5 py-3 text-sm font-bold text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-sm bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload Document"}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
