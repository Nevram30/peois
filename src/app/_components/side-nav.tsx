"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export interface SideNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  active: boolean;
  badge?: number;
}

/**
 * Desktop/laptop-only left sidebar navigation (hidden below `lg`).
 * Collapsible via a toggle button; open state persists in localStorage.
 * Mobile and tablet keep the existing horizontal tab navigation.
 */

export const SideNav = ({
  items,
  storageKey = "sidenav-open",
  helpHref,
  onLogout,
}: {
  items: SideNavItem[];
  storageKey?: string;
  helpHref?: string;
  onLogout?: () => void;
}) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) setOpen(stored === "1");
  }, [storageKey]);

  const toggle = () =>
    setOpen((v) => {
      try {
        localStorage.setItem(storageKey, v ? "0" : "1");
      } catch {
        // ignore
      }
      return !v;
    });

  return (
    <aside
      className={`sticky top-16.25 hidden h-[calc(100vh-65px)] shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white transition-all duration-200 print:hidden lg:flex ${open ? "w-64" : "w-14"
        }`}
    >
      <div
        className={`flex items-center border-b border-gray-100 px-3 py-3 ${open ? "justify-between" : "justify-center"
          }`}
      >
        {open && (
          <span className="text-xs font-semibold tracking-wide text-gray-400">
            Main Navigation
          </span>
        )}
        <button
          onClick={toggle}
          title={open ? "Hide navigation" : "Show navigation"}
          aria-label={open ? "Hide navigation" : "Show navigation"}
          className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
        >
          {open ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          )}
        </button>
      </div>

      <nav className={`flex-1 space-y-1 overflow-y-auto ${open ? "p-3" : "p-2"}`}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={open ? undefined : item.label}
            className={`relative flex items-center rounded-lg text-sm transition ${open ? "gap-3 px-3 py-2.5" : "justify-center py-2.5"
              } ${item.active
                ? "bg-amber-50 font-medium text-amber-600"
                : "font-normal text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            <span className="shrink-0">{item.icon}</span>
            {open && <span className="truncate">{item.label}</span>}
            {(item.badge ?? 0) > 0 &&
              (open ? (
                <span className="ml-auto inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold leading-none text-white">
                  {item.badge! > 99 ? "99+" : item.badge}
                </span>
              ) : (
                <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white">
                  {item.badge! > 99 ? "99+" : item.badge}
                </span>
              ))}
          </Link>
        ))}
      </nav>

      {/* IT Help Desk box — sits below the navigation, just above logout */}
      {helpHref &&
        (open ? (
          <div className="px-3 pb-2">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
                <span className="text-xs font-semibold text-blue-900">IT Help Desk</span>
              </div>
              <p className="mt-1 text-[11px] leading-snug text-blue-700">
                Having trouble with the system? Reach out to the IT support team.
              </p>
              <Link
                href={helpHref}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
              >
                Get help
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-2">
            <Link
              href={helpHref}
              title="IT Help Desk"
              className="flex justify-center rounded-lg py-2.5 text-blue-600 transition hover:bg-blue-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
            </Link>
          </div>
        ))}

      {onLogout && (
        <div className={`border-t border-gray-100 ${open ? "p-3" : "p-2"}`}>
          <button
            onClick={onLogout}
            title={open ? undefined : "Logout"}
            className={`flex w-full items-center rounded-lg bg-red-100 text-sm font-medium text-red-600 transition hover:bg-red-200 ${open ? "gap-3 px-3 py-2.5" : "justify-center py-2.5"
              }`}
          >
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            {open && "Logout"}
          </button>
        </div>
      )}
    </aside>
  );
}
