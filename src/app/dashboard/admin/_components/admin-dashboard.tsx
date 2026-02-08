"use client";

import { api } from "~/trpc/react";

export function AdminDashboardContent() {
  const { data: stats } = api.project.getStats.useQuery();

  return (
    <div className="space-y-6 px-6 py-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-gray-500">
          Overview of projects and activities
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Projects</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {stats?.total ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">On-going</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {stats?.ongoing ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {stats?.completed ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}
