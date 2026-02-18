"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";

const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1e3a4f] focus:outline-none focus:ring-1 focus:ring-[#1e3a4f]";

export function AddDocumentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docType = searchParams.get("type") === "PURCHASE_REQUEST" ? "PURCHASE_REQUEST" : "POW";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [district, setDistrict] = useState<"DISTRICT_I" | "DISTRICT_II">("DISTRICT_I");
  const [projectRef, setProjectRef] = useState("");

  // POW fields
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // PR fields
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");

  const [error, setError] = useState("");

  const createDocument = api.document.create.useMutation({
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
    if (droppedFile) setFile(droppedFile);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    let filePath: string | undefined;
    let fileName: string | undefined;
    let fileSize: number | undefined;

    if (docType === "POW" && file) {
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

    createDocument.mutate({
      type: docType,
      title: title.trim(),
      description: description.trim() || undefined,
      district,
      filePath,
      fileName,
      fileSize,
      projectRef: projectRef.trim() || undefined,
      amount: docType === "PURCHASE_REQUEST" && amount ? parseFloat(amount) : undefined,
      purpose: docType === "PURCHASE_REQUEST" && purpose.trim() ? purpose.trim() : undefined,
    });
  };

  const isPending = uploading || createDocument.isPending;

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
            {docType === "POW" ? "Upload Approved POW" : "Create Purchase Request"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {docType === "POW"
              ? "Upload an approved Program of Works document"
              : "Generate a new Purchase Request"}
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
              placeholder={docType === "POW" ? "e.g. Rehabilitation of Barangay Road" : "e.g. Office Supplies for Q1 2026"}
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
              placeholder="Optional description..."
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
          {docType === "POW" && (
            <div>
              <label className={labelClass}>Document File</label>
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
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* PR: Amount and Purpose */}
          {docType === "PURCHASE_REQUEST" && (
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
                  placeholder="Describe the purpose of this purchase request..."
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
                  : "Creating..."
                : docType === "POW"
                  ? "Upload & Create"
                  : "Create Purchase Request"}
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
