"use client";

import { api } from "~/trpc/react";

export default function DashboardPage() {
  const { data: statsData } = api.user.getStats.useQuery();
  const { data: divisions } = api.user.getDivisions.useQuery();

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          Overview of system activity and statistics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{statsData?.total ?? 0}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500">Active Users</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{statsData?.active ?? 0}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500">Inactive Users</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{statsData?.inactive ?? 0}</p>
            <p className="mt-0.5 text-xs text-gray-400">Accounts disabled</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{statsData?.pending ?? 0}</p>
            {(statsData?.pending ?? 0) > 0 && (
              <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-red-600">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Requires action
              </p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
            <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Divisions breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Users by Division</h3>
          {divisions && divisions.length > 0 ? (
            <div className="space-y-3">
              {divisions.map((d) => (
                <div key={d} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{d}</span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {d}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No divisions found.</p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Quick Actions</h3>
          <div className="space-y-2">
            <a
              href="/super-admin/user-management"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Manage Users</p>
                <p className="text-xs text-gray-500">Add, edit, or deactivate user accounts</p>
              </div>
            </a>
            <a
              href="/super-admin/override-management"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Override Management</p>
                <p className="text-xs text-gray-500">Configure system overrides and permissions</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
