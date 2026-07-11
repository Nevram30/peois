"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { api } from "~/trpc/react";
import { LiveToast } from "~/app/_components/live-toast";
import { usePollToast } from "~/hooks/use-poll-toast";

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
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: "Projects",
    href: "/admin/dashboard/projects",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m2.25-2.25h-2.25m2.25 0h2.25" />
      </svg>
    ),
  },
  // {
  //   label: "Documents",
  //   href: "/admin/dashboard/documents",
  //   icon: (
  //     <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
  //       <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  //     </svg>
  //   ),
  // },
  // {
  //   label: "Reports",
  //   href: "/admin/dashboard/reports",
  //   icon: (
  //     <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
  //       <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  //     </svg>
  //   ),
  // },
  {
    label: "My Task",
    href: "/admin/dashboard/my-task",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
  },
  {
    label: "Project Access Request",
    href: "/admin/dashboard/project-access-request",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
];

export function AdminShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const { data: me } = api.user.me.useQuery();
  const avatarImage = me?.image ?? user.image;
  const displayName = me?.name ?? user.name;
  const displayEmail = me?.email ?? user.email;
  // Polling fallback: SSE only works when one Node process serves everything
  // (see src/server/api/events.ts), so keep notifications fresh on an interval.
  const { data: adminNotifs } = api.taskNotification.getAdminNotifications.useQuery(undefined, {
    refetchInterval: 10_000,
    refetchOnWindowFocus: true,
  });
  const utils = api.useUtils();
  const [liveToast, setLiveToast] = useState<string | null>(null);
  const dismissToast = useCallback(() => setLiveToast(null), []);
  const pollItems = useMemo(
    () =>
      adminNotifs && [
        ...adminNotifs.replies.map((r) => ({
          id: r.id,
          message: `${r.createdBy.name ?? "User"} replied on a task: ${r.message.slice(0, 80)}`,
        })),
        // "ack:" prefix matches the read-tracking key convention below.
        ...adminNotifs.acknowledgments.map((a) => ({
          id: `ack:${a.id}`,
          message: `${a.notifyUser.name ?? "User"} acknowledged the task: ${a.description.slice(0, 80)}`,
        })),
      ],
    [adminNotifs],
  );
  const { markSeen } = usePollToast(pollItems, setLiveToast);
  api.taskNotification.onReplyCreated.useSubscription(undefined, {
    onData: (e) => {
      markSeen(e.replyId);
      void utils.taskNotification.getAdminNotifications.invalidate();
      void utils.taskNotification.getTasksSentByMe.invalidate();
      setLiveToast(
        `${e.authorName ?? "User"} replied on a task: ${e.message.slice(0, 80)}`,
      );
    },
  });
  api.taskNotification.onTaskAcknowledged.useSubscription(undefined, {
    onData: (e) => {
      markSeen(`ack:${e.taskId}`);
      void utils.taskNotification.getAdminNotifications.invalidate();
      void utils.taskNotification.getTasksSentByMe.invalidate();
      setLiveToast(
        `${e.acknowledgedByName ?? "User"} acknowledged the task: ${e.description.slice(0, 80)}`,
      );
    },
  });
  const { data: pendingAccessCount } = api.projectAccessRequest.pendingCount.useQuery(undefined, {
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
  const [readReplyIds, setReadReplyIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin_read_replies");
      if (stored) setReadReplyIds(new Set(JSON.parse(stored) as string[]));
    } catch {
      // ignore
    }
  }, []);

  const markReplyAsRead = (replyId: string) => {
    setReadReplyIds((prev) => {
      const next = new Set(prev);
      next.add(replyId);
      try {
        localStorage.setItem("admin_read_replies", JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const unreadReplies = adminNotifs?.replies.filter((r) => !readReplyIds.has(r.id)) ?? [];
  // Acknowledgments share the same read-tracking set, keyed as "ack:<taskId>".
  const unreadAcks =
    adminNotifs?.acknowledgments.filter((a) => !readReplyIds.has(`ack:${a.id}`)) ?? [];
  const notifCount = unreadReplies.length + unreadAcks.length;
  const notifFeed = [
    ...unreadReplies.map((r) => ({ kind: "reply" as const, date: r.createdAt, reply: r })),
    ...unreadAcks.map((a) => ({
      kind: "ack" as const,
      date: a.acknowledgedAt ?? new Date(0),
      ack: a,
    })),
  ]
    .sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime())
    .slice(0, 8);

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-gray-50">
        {/* Top Header */}
        <header className="bg-white text-gray-900 border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg overflow-hidden bg-gray-100 sm:h-10 sm:w-10">
                <Image
                  src="/image/logo.jpeg"
                  alt="PEO Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold leading-tight sm:text-lg">
                  PEO - Project Management Information System
                </h1>
                <p className="hidden truncate text-xs text-gray-500 sm:block">
                  Provincial Government of Davao del Norte
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-3 rounded-lg px-1 py-1 transition hover:bg-gray-100 sm:px-2"
                >
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium leading-tight">
                      {displayName ?? displayEmail}
                    </p>
                    <p className="text-xs text-gray-500">{user.designation ?? "Administrator"}</p>
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
                      {(displayName ?? displayEmail ?? "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                    <button
                      onClick={() => { setDropdownOpen(false); setLogoutModalOpen(true); }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <Link
                href="/admin/dashboard/settings"
                title="Settings"
                className={`rounded-full p-1.5 transition hover:bg-gray-100 hover:text-gray-700 ${isActive("/admin/dashboard/settings") ? "text-[#1e3a4f]" : "text-gray-500"
                  }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </Link>

              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen((v) => !v)}
                  className="relative rounded-full p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                  {notifCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                      {notifCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-gray-100 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{notifCount}</span>
                    </div>

                    {notifCount === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500">No notifications yet</p>
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto">
                        {notifFeed.map((item) => {
                          if (item.kind === "ack") {
                            const task = item.ack;
                            const ackUser = task.notifyUser;
                            const ackName = ackUser.name ?? ackUser.email ?? "User";
                            return (
                              <Link
                                key={`ack:${task.id}`}
                                href={`/admin/dashboard/my-task/${task.id}`}
                                onClick={() => {
                                  setNotifOpen(false);
                                  markReplyAsRead(`ack:${task.id}`);
                                }}
                                className="flex items-start gap-3 border-b border-gray-50 px-4 py-3 transition hover:bg-gray-50 last:border-0"
                              >
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                  </svg>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <p className="truncate text-xs font-semibold text-gray-800">
                                      {ackName} acknowledged the task
                                    </p>
                                    <span className="ml-1 shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                                      Acknowledged
                                    </span>
                                  </div>
                                  <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-400">{task.description}</p>
                                  <p className="mt-0.5 text-[10px] text-gray-300">{task.project.title}</p>
                                </div>
                              </Link>
                            );
                          }
                          const reply = item.reply;
                          const user = reply.createdBy;
                          const userName = user.name ?? user.email ?? "User";
                          const initial = userName.charAt(0).toUpperCase();
                          const statusLabel =
                            reply.taskStatus === "in-progress" ? "In Progress" :
                              reply.taskStatus === "action-taken" ? "Action Taken" : null;
                          return (
                            <Link
                              key={reply.id}
                              href={`/admin/dashboard/my-task/${reply.taskNotification.id}`}
                              onClick={() => {
                                setNotifOpen(false);
                                markReplyAsRead(reply.id);
                              }}
                              className="flex items-start gap-3 border-b border-gray-50 px-4 py-3 transition hover:bg-gray-50 last:border-0"
                            >
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                                {initial}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <p className="truncate text-xs font-semibold text-gray-800">
                                    {userName} replied
                                  </p>
                                  {statusLabel && (
                                    <span className="ml-1 shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-700">
                                      {statusLabel}
                                    </span>
                                  )}
                                </div>
                                <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-400">{reply.message}</p>
                                <p className="mt-0.5 text-[10px] text-gray-300">{reply.taskNotification.project.title}</p>
                              </div>
                            </Link>
                          );
                        })}
                        <Link
                          href="/admin/dashboard/my-task"
                          onClick={() => setNotifOpen(false)}
                          className="flex items-center justify-center py-3 text-xs font-semibold text-[#1e3a4f] transition hover:bg-gray-50"
                        >
                          View all tasks →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 overflow-x-auto whitespace-nowrap bg-white px-3 border-b border-gray-200 mt-3 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => {
            const badgeCount =
              item.href === "/admin/dashboard/project-access-request" ? (pendingAccessCount ?? 0) : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`-mb-px flex shrink-0 items-center gap-2 border-b-[3px] px-3 py-2.5 text-sm transition sm:px-4 ${isActive(item.href)
                    ? "border-amber-500 font-medium text-amber-600"
                    : "border-transparent font-normal text-gray-600 hover:border-gray-300 hover:text-gray-900"
                  }`}
              >
                {item.icon}
                {item.label}
                {badgeCount > 0 && (
                  <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold leading-none text-white">
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Page Content */}
      <main>{children}</main>

      {/* Logout Confirmation Modal */}
      {logoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
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
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      <LiveToast message={liveToast} onDismiss={dismissToast} />
    </div>
  );
}
