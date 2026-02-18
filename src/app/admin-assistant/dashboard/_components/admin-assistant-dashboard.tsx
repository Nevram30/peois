"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

export function AdminAssistantDashboardContent() {
  const { data: stats, isLoading } = api.document.getStats.useQuery();

  return (
    <div className="space-y-6 px-6 py-8">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">
          Document Initiator Dashboard
        </h2>
        <p className="mt-2 text-gray-500">
          Manage approved POWs and Purchase Requests
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Documents</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {isLoading ? "..." : (stats?.total ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Drafts</p>
          <p className="mt-1 text-3xl font-bold text-amber-600">
            {isLoading ? "..." : (stats?.draft ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">For Review</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">
            {isLoading ? "..." : (stats?.forReview ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Released</p>
          <p className="mt-1 text-3xl font-bold text-green-600">
            {isLoading ? "..." : (stats?.released ?? 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin-assistant/dashboard/documents/new?type=POW"
          className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-[#1e3a4f] hover:shadow-md"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-[#1e3a4f] transition group-hover:bg-[#1e3a4f] group-hover:text-white">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Upload Approved POW
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload an approved Program of Works document with file attachment
          </p>
        </Link>

        <Link
          href="/admin-assistant/dashboard/documents/new?type=PURCHASE_REQUEST"
          className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-[#1e3a4f] hover:shadow-md"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-[#1e3a4f] transition group-hover:bg-[#1e3a4f] group-hover:text-white">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Create Purchase Request
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Generate a new Purchase Request with amount and purpose details
          </p>
        </Link>
      </div>
    </div>
  );
}
