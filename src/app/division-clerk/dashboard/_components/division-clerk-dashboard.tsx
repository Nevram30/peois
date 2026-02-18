"use client";

import { signOut } from "next-auth/react";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
}

export function DivisionClerkDashboard({ user }: { user: User }) {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">PEO-MIS</h1>
            <p className="text-xs text-gray-500">Division Clerk Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user.name ?? user.email}
              </p>
              <p className="text-xs text-yellow-600">Division Clerk</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-6 px-6 py-8">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome, {user.name ?? "Division Clerk"}
          </h2>
          <p className="mt-2 text-gray-500">
            Provincial Engineers Office - Division Clerk Panel
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Assigned Tasks</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">—</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Documents</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">—</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Notifications</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">—</p>
          </div>
        </div>
      </div>
    </main>
  );
}
