"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1e3a4f] focus:outline-none focus:ring-1 focus:ring-[#1e3a4f]";

export function EditDocumentForm({ documentId }: { documentId: string }) {
  const router = useRouter();

  const { data: doc, isLoading } = api.document.getById.useQuery({ id: documentId });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [district, setDistrict] = useState<"DISTRICT_I" | "DISTRICT_II">("DISTRICT_I");
  const [projectRef, setProjectRef] = useState("");

  // POW fields
  const [file, setFile] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState<{ path: string; name: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // PR fields
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (doc) {
      setTitle(doc.title);
      setDescription(doc.description ?? "");
      setDistrict(doc.district as "DISTRICT_I" | "DISTRICT_II");
      setProjectRef(doc.projectRef ?? "");
      if (doc.filePath && doc.fileName) {
        setExistingFile({ path: doc.filePath, name: doc.fileName });
      }
      setAmount(doc.amount?.toString() ?? "");
      setPurpose(doc.purpose ?? "");
    }
  }, [doc]);

  const updateDocument = api.document.update.useMutation({
    onSuccess: () => {
      router.push("/admin-assistant/dashboard/documents");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setExistingFile(null);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setExistingFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    let filePath: string | null | undefined = undefined;
    let fileName: string | null | undefined = undefined;
    let fileSize: number | null | undefined = undefined;

    if (doc?.type === "POW" && file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const body = await res.json() as { error?: string };
          throw new Error(body.error ?? "Upload failed");
        }
        const data = await res.json() as { filePath: string; fileName: string; fileSize: number };
        filePath = data.filePath;
        fileName = data.fileName;
        fileSize = data.fileSize;
      } catch (err) {
        setError(err instanceof Error ? err.message : "File upload failed");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    updateDocument.mutate({
      id: documentId,
      title: title.trim(),
      description: description.trim() || null,
      district,
      filePath: filePath ?? existingFile?.path ?? null,
      fileName: fileName ?? existingFile?.name ?? null,
      fileSize: fileSize ?? doc?.fileSize ?? null,
      projectRef: projectRef.trim() || null,
      amount: doc?.type === "PURCHASE_REQUEST" && amount ? parseFloat(amount) : null,
      purpose: doc?.type === "PURCHASE_REQUEST" && purpose.trim() ? purpose.trim() : null,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading document...</p>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm font-medium text-gray-900">Document not found</p>
        <button
          onClick={() => router.back()}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  if (doc.status !== "DRAFT" && doc.status !== "REVISION") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm font-medium text-gray-900">
          This document cannot be edited (status: {doc.status})
        </p>
        <button
          onClick={() => router.back()}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const isPending = uploading || updateDocument.isPending;

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 transition hover:text-gray-700"
          >
            &larr; Back to Documents
          </button>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            Edit Document
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {doc.documentCode} &middot;{" "}
            {doc.type === "POW" ? "Program of Works" : "Purchase Request"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Title */}
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              rows={3}
            />
          </div>

          {/* District */}
          <div>
            <label className={labelClass}>District *</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value as "DISTRICT_I" | "DISTRICT_II")}
              className={inputClass}
            >
              <option value="DISTRICT_I">District I</option>
              <option value="DISTRICT_II">District II</option>
            </select>
          </div>

          {/* Project Reference */}
          <div>
            <label className={labelClass}>Project Reference</label>
            <input
              type="text"
              value={projectRef}
              onChange={(e) => setProjectRef(e.target.value)}
              className={inputClass}
              placeholder="e.g. PEO-2026-00001 (optional)"
            />
          </div>

          {/* POW: File Upload */}
          {doc.type === "POW" && (
            <div>
              <label className={labelClass}>Document File</label>
              {existingFile && !file ? (
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <span className="text-sm text-gray-700">{existingFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => document.getElementById("file-input")?.click()}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed p-6 transition ${
                    dragOver
                      ? "border-[#1e3a4f] bg-teal-50"
                      : "border-gray-300 bg-gray-50 hover:border-gray-400"
                  }`}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  {file ? (
                    <>
                      <svg className="mb-2 h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="mt-2 text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <svg className="mb-2 h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                      </svg>
                      <p className="text-sm text-gray-600">
                        Drag & drop a file here, or click to browse
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        PDF, JPEG, PNG, or WebP (max 10MB)
                      </p>
                    </>
                  )}
                </div>
              )}
              <input
                id="file-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* PR: Amount and Purpose */}
          {doc.type === "PURCHASE_REQUEST" && (
            <>
              <div>
                <label className={labelClass}>Amount (PHP) *</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={inputClass}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className={labelClass}>Purpose *</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className={inputClass}
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-[#1e3a4f] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#2a4d66] disabled:opacity-50"
            >
              {isPending
                ? uploading
                  ? "Uploading..."
                  : "Saving..."
                : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
