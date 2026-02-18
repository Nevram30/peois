"use client";

export default function OverrideManagementPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Override Management</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage system overrides and special permissions.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 shadow-sm">
        <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
        <p className="mt-4 text-sm font-medium text-gray-500">No overrides configured yet.</p>
        <p className="mt-1 text-xs text-gray-400">Override settings will appear here.</p>
      </div>
    </>
  );
}
