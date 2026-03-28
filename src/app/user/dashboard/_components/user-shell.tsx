"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
  designation?: string | null;
}

const DESIGNATION_CONFIG: Record<string, { label: string; color: string }> = {
  "Admin Assistant": { label: "Admin Assistant", color: "bg-blue-100 text-blue-700" },
  "Division Clerk": { label: "Division Clerk", color: "bg-green-100 text-green-700" },
  "Division Head": { label: "Division Head", color: "bg-purple-100 text-purple-700" },
  "Section Head": { label: "Section Head", color: "bg-orange-100 text-orange-700" },
  "Provincial Engr.": { label: "Provincial Engineer", color: "bg-red-100 text-red-700" },
};

const navItems = [
  { label: "Dashboard", href: "/user/dashboard" },
  { label: "Projects", href: "/user/dashboard/projects" },
  { label: "Documents", href: "/user/dashboard/documents" },
  { label: "Reports", href: "/user/dashboard/reports" },
];

export function UserShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/user/dashboard") return pathname === "/user/dashboard";
    return pathname.startsWith(href);
  };

  const designationInfo = user.designation
    ? DESIGNATION_CONFIG[user.designation] ?? { label: user.designation, color: "bg-gray-100 text-gray-700" }
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-[#1e3a4f] text-white">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">
                PEO - Project Management Information System
              </h1>
              <p className="text-xs text-white/60">
                Provincial Government of Davao del Norte
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium leading-tight">
                  {user.name ?? user.email}
                </p>
                <div className="flex items-center justify-end gap-2">
                  {designationInfo && (
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${designationInfo.color}`}>
                      {designationInfo.label}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="flex gap-0 px-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
                isActive(item.href)
                  ? "border-[#1e3a4f] text-[#1e3a4f]"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
}
