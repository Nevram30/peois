"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { api } from "~/trpc/react";
import { SideNav } from "~/app/_components/side-nav";
import { Footer } from "~/app/_components/footer";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
  designation?: string | null;
  image?: string | null;
}

const navItems = [
  {
    label: "Projects",
    href: "/archiver/dashboard",
    exact: true,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
  },
  {
    label: "Project Registry",
    href: "/archiver/registry",
    exact: false,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
      </svg>
    ),
  },
  {
    label: "Archive Boxes",
    href: "/archiver/archive-folders",
    exact: false,
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z" />
      </svg>
    ),
  },
];

export const ArchiverShell = ({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const { data: me } = api.user.me.useQuery();
  const avatarImage = me?.image ?? user.image;
  const displayName = me?.name ?? user.name;
  const displayEmail = me?.email ?? user.email;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Sticky header + nav */}
      <div className="sticky top-0 z-40 bg-gray-50 print:hidden">
        {/* Top Header */}
        <header className="border-b border-gray-200 bg-white text-gray-900 shadow-sm">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src="/image/logo.jpeg"
                  alt="PEO Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-semibold leading-tight sm:text-lg">
                  <span className="sm:hidden">PEO - PMIS</span>
                  <span className="hidden sm:inline">
                    PEO - PMIS
                  </span>
                </h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
              {/* Profile display — logout lives in the sidebar (desktop) and header icon (mobile) */}
              <div className="flex items-center gap-3 px-2 py-1">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium leading-tight">
                    {displayName ?? displayEmail}
                  </p>
                  <div className="flex items-center justify-end gap-2">
                    <span className="inline-flex items-center bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                      Archiver
                    </span>
                  </div>
                </div>
                {avatarImage ? (
                  <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-gray-200">
                    <Image
                      src={avatarImage}
                      alt={displayName ?? "User avatar"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700 transition hover:bg-gray-200">
                    {(displayName ?? displayEmail ?? "A").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <button
                onClick={() => setLogoutModalOpen(true)}
                title="Logout"
                className="rounded-full p-1.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600 lg:hidden"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs — mobile/tablet only; desktop uses the left sidebar */}
        <nav className="mt-3 flex items-center gap-2 overflow-x-auto border-b border-gray-200 bg-white px-4 sm:px-6 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`-mb-px flex shrink-0 items-center gap-2 whitespace-nowrap border-b-[3px] px-4 py-2.5 text-sm transition ${isActive(item.href, item.exact)
                ? "border-amber-500 font-medium text-amber-600"
                : "border-transparent font-normal text-gray-600 hover:border-gray-300 hover:text-gray-900"
                }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Left sidebar (desktop/laptop) + Page Content */}
      <div className="flex">
        <SideNav
          storageKey="archiver-sidenav-open"
          items={navItems.map((item) => ({
            label: item.label,
            href: item.href,
            icon: item.icon,
            active: isActive(item.href, item.exact),
          }))}
          helpHref="/archiver/it-help-desk"
          onLogout={() => setLogoutModalOpen(true)}
        />
        <main className="min-w-0 flex-1 pb-10">{children}</main>
      </div>

      {/* Logout Confirmation Modal */}
      {logoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
            </div>
            <h2 className="text-center text-lg font-semibold text-gray-900">Sign out</h2>
            <p className="mt-1 text-center text-sm text-gray-500">Are you sure you want to sign out of your account?</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setSigningOut(true);
                  await signOut({ callbackUrl: "/login" });
                }}
                disabled={signingOut}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {signingOut && (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
