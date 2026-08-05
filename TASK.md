## PEO-IMS
_________________________________________________________________

## SUPER ADMIN

    - FRONT END

# Module 1: Super admin Dashboard
        - Redesign super admin dashboard
            - add project status cards
            - add user monitoring cards
            - add a filter year then when filter year function is used base on the year it will filter also the 
                - FINANCIAL OVERVIEW:
                    - Annual allocation and Source Breakdown Card
                        - add format billions function.                                     [Done]
                        - add segments real data.                                           [Done]
                    - Remaining Balance From Annual Allocation
                        - is the total amount of Project Annual alocation - Disbursement.   [Done]
                    - Disbursement Summary                                                  [Done]

# Module 2: User Management
# Module 3: Project Manaagement
# Module 4: Project Activity Log

## TO BE FINALIZE MODULES

# Module 5: Project Monitoring  
# Module 6: User Monitoring

    - BACKEND
        - FINANCIAL OVERVIEW:
            - 

## NOTE:
        - bySource and byType is the same or not?
        - 
________________________________________________________________

## ADMIN

- FRONT END UPDATES
    - Admin Dashboard
        - Redesign super admin dashboard
    - Projects
        - Add New Project
            - Project Identity & Status
                - Change the Card Design of Project Identity & Status.                          [Done]
            - Funding & Disbursement Tracking Card
                - Change the Card Design of Funding & Disbursement Tracking.                    [Done]
                - Add Revised Contract Cost History Table and Input field for Variation Order.  [Done]
            - Project Timeline Card
                - Add new Data fields ( Adjustment Types and Justification Description).        [Done]

- BACKEND
    - 

_________________________________________________________________

## USER

- FRONT END
    - Redesign super admin dashboard

- BACKEND
    - 


# Fix: User doesn't receive admin-created tasks + add real-time SSE notifications

## Context

Admin creates a task for a user via the project edit form (`project.sendTaskNotification`, [src/server/api/routers/project.ts:381-400](src/server/api/routers/project.ts#L381-L400)), and the user should be notified and be able to chat on that task. Reported symptom: **the user sees nothing, even after refresh**.

### Diagnosis (code paths verified)

- The read path is correct: `taskNotification.getMyTasks` filters `notifyUserId = session.user.id` ([taskNotification.ts:6-18](src/server/api/routers/taskNotification.ts#L6-L18)), session id is populated correctly from the JWT, router is registered, and the My Tasks page/bell render it. The reply/chat feature (`TaskReply`) also works.
- **Root cause of "nothing even after refresh": the task was almost certainly saved with the wrong `notifyUserId`.** The recipient dropdown (`user.getForSelect`, [user.ts:97-103](src/server/api/routers/user.ts#L97-L103)) lists **all ACTIVE users of any role (admins included)**, labeled **by name only** ([edit-project-form.tsx:1455](src/app/admin/dashboard/projects/[id]/edit/_components/edit-project-form.tsx#L1455)). New users default to status `PENDING`, so the intended user may not appear at all, and the admin picks a similarly-named/wrong account. A diagnostic DB query (step 1) will confirm which existing rows are misassigned.
- **Secondary gap: there is no notification delivery at all** — no SSE/websocket/email/polling. A row is written and only appears on page reload / window refocus (30s staleTime in [query-client.ts:26](src/trpc/query-client.ts#L26)). User chose **SSE** for real-time delivery.
- Security gaps found along the way: `sendTaskNotification` is not admin-gated; `getById`/`acknowledge`/`reply` have no participant/ownership checks.

Stack: Next.js 15 App Router, tRPC **11.9.0** (stable `httpSubscriptionLink`/`useSubscription`), TanStack Query v5, Prisma 6 + Neon. `adminProcedure` already exists at [trpc.ts:144](src/server/api/trpc.ts#L144). No toast lib installed → inline mini-toast. Use Node `EventEmitter` (no new deps).

---

## Part A — Fix wrong/missing recipient (root cause)

**A1. Diagnostics (read-only, run first).** Note: direct psql access to the Neon DB was denied in planning; run with user's OK during implementation (or via Neon console / `npx prisma studio`):
```sql
-- tasks assigned to non-USER or non-ACTIVE accounts (misassignments)
SELECT tn.id, tn."createdAt", LEFT(tn.description,60) descr, u.name, u.email, u.role, u.status
FROM "TaskNotification" tn JOIN "User" u ON u.id = tn."notifyUserId"
WHERE u.role <> 'USER' OR u.status <> 'ACTIVE' ORDER BY tn."createdAt" DESC;
-- duplicate names that explain wrong picks
SELECT name, COUNT(*), array_agg(email), array_agg(role::text) FROM "User" GROUP BY name HAVING COUNT(*) > 1;
-- intended recipients stuck in PENDING
SELECT id,name,email,status FROM "User" WHERE role='USER' AND status <> 'ACTIVE';
```
Remediate confirmed rows with `UPDATE "TaskNotification" SET "notifyUserId"='<correct>' WHERE id='<task>'` (with user confirmation), and activate PENDING users via existing admin flow.

**A2. Scope dropdown query** — [src/server/api/routers/user.ts:97-103](src/server/api/routers/user.ts#L97-L103) `getForSelect` (only consumed by the two task forms): change to `adminProcedure`, filter `where: { role: "USER", status: "ACTIVE" }`, add `employeeId` to select.

**A3. Disambiguate labels** — option label `Name — email (employeeId)` in [edit-project-form.tsx:1455](src/app/admin/dashboard/projects/[id]/edit/_components/edit-project-form.tsx#L1455) and the same Select in `src/app/super-admin/projects-data-list/[id]/_components/override-form.tsx`. Empty-list hint: "No active users available — activate users first."

## Part B — Real-time SSE notifications (tRPC v11 subscriptions)

**B1. New `src/server/api/events.ts`** — typed `EventEmitter` cached on `globalThis` (same HMR pattern as `src/server/db.ts`), `setMaxListeners(0)`. Events: `task.created` `{ taskId, projectId, projectTitle, notifyUserId, priority, description, createdByName }` and `reply.created` `{ replyId, taskId, recipientId, authorId, authorName, message }`. Header comment: in-memory emitter requires a single Node process (`next start`); on serverless, upgrade path is Postgres LISTEN/NOTIFY or Redis behind the same interface — window-focus refetch stays as fallback.

**B2. Subscription procedures** in [taskNotification.ts](src/server/api/routers/taskNotification.ts): `onTaskCreated` and `onReplyCreated` as `protectedProcedure.subscription(async function* ({ ctx, signal }) { for await (const [e] of on(emitter, "...", { signal })) if (e.<recipient> === ctx.session.user.id) yield e; })` — abort signal auto-removes listeners on disconnect.

**B3. Emit points**: in `sendTaskNotification` after create → emit `task.created`; in `reply` after create → `recipientId = me === task.createdById ? task.notifyUserId : task.createdById`, emit `reply.created` (reuses the task fetched for C2's check).

**B4. Client links** — [src/trpc/react.tsx:55-65](src/trpc/react.tsx#L55-L65): wrap terminating link in `splitLink({ condition: (op) => op.type === "subscription", true: httpSubscriptionLink({ transformer: SuperJSON, url: getBaseUrl() + "/api/trpc" }), false: <existing httpBatchStreamLink> })`. EventSource sends cookies same-origin, so NextAuth JWT works unchanged.

**B5. Route handler** — `src/app/api/trpc/[trpc]/route.ts`: add `export const dynamic = "force-dynamic"` and enable SSE pings in `fetchRequestHandler` options (`sse: { ping: { enabled: true, intervalMs: 15_000 } }`).

**B6. Consume in shells**:
- [user-shell.tsx](src/app/user/dashboard/_components/user-shell.tsx) (~line 100): `onTaskCreated.useSubscription` → invalidate `getMyTasks` (drives bell badge) + inline toast ("New HIGH task from …"); `onReplyCreated` → invalidate `taskNotification` queries.
- [admin-shell.tsx](src/app/admin/dashboard/_components/admin-shell.tsx) (~line 95): `onReplyCreated.useSubscription` → invalidate `getAdminNotifications` + `getTasksSentByMe` + toast.
- Toast: ~15-line inline fixed bottom-right component, auto-hide ~5s, in each shell. Keep existing window-focus refetch as fallback.

## Part C — Harden endpoints

- **C1** [project.ts:381](src/server/api/routers/project.ts#L381) `sendTaskNotification`: `protectedProcedure` → `adminProcedure`; validate recipient (`role === "USER" && status === "ACTIVE"`, else `BAD_REQUEST`) — makes the Part A bug impossible at the API layer.
- **C2** [taskNotification.ts](src/server/api/routers/taskNotification.ts): shared `assertParticipant(task, userId)` helper (NOT_FOUND / FORBIDDEN). `getById`: check participant (allow SUPER_ADMIN). `acknowledge`: `updateMany({ where: { id, notifyUserId: me } })`, NOT_FOUND if count 0. `reply`: fetch task, assert participant, then create.

## Implementation order
1. A2/A3 + Part C (root-cause fix, small)
2. A1 diagnostics + data remediation (ask user before UPDATE)
3. Part B server (events, subscriptions, emits) → client (links, route, shells)
4. `npm run check` after each part

## Verification (two browser sessions)
1. `npm run dev`; Browser 1 = ADMIN, Browser 2 (incognito) = ACTIVE role-USER.
2. Dropdown shows only ACTIVE role-USER accounts labeled `Name — email (employeeId)`.
3. Browser 2 Network tab: pending GET `/api/trpc/taskNotification.onTaskCreated` with `text/event-stream`.
4. Admin sends task → within ~1s Browser 2 shows toast + bell badge increments **without refresh/focus**; task appears in My Tasks and DB row's `notifyUserId` matches.
5. User replies from task messages page → Admin bell increments + toast live.
6. Fallback: restart dev server, send task, focus user window → badge updates via refocus; EventSource auto-reconnects.
7. Hardening: role-USER crafted call to `sendTaskNotification` → FORBIDDEN; uninvolved user hitting `getById`/`acknowledge`/`reply` → NOT_FOUND/FORBIDDEN; sending to an admin id → BAD_REQUEST.
8. `npm run build && npm run start` smoke test (production single-process shape for the emitter).

#####

SUPERADMIN
      {/* Financial Overview */}
      {(() => {
        const totalAllocation = financial?.totalAllocation ?? 0;
        const bySource = financial?.bySource ?? {};
        const bySubType = financial?.bySubType ?? {};
        const executionRate = financial?.executionRate ?? 0;

        type SubEntry = {
          key: string;
          label: string;
          value: number;
          color: string;
          sourceOfFund: string;
        };

        const subEntries: SubEntry[] = Object.entries(bySubType)
          .filter(([, v]) => v.amount > 0)
          .map(([key, v]) => {
            const isNone = key.startsWith("__NONE__:");
            const label = isNone
              ? "Uncategorized"
              : (PROJECT_SUB_TYPE_LABEL[key as ProjectSubTypeValue] ?? key);
            const color = isNone
              ? (FUND_SOURCE_COLORS[v.sourceOfFund] ?? "#94a3b8")
              : (SUB_TYPE_COLORS[key as ProjectSubTypeValue] ?? "#94a3b8");
            return {
              key,
              label,
              value: v.amount,
              color,
              sourceOfFund: v.sourceOfFund,
            };
          });

        const orderedSources = SOURCE_OF_FUND_ORDER.filter(
          (s) => (bySource[s] ?? 0) > 0,
        );

        const segments = orderedSources
          .map((sourceKey) => ({
            label: FUND_SOURCE_LABELS[sourceKey] ?? sourceKey,
            value: bySource[sourceKey] ?? 0,
            color: FUND_SOURCE_COLORS[sourceKey] ?? "#94a3b8",
          }))
          .sort((a, b) => b.value - a.value);

        const groupedBreakdown = orderedSources.map((sourceKey) => {
          const sourceAmount = bySource[sourceKey] ?? 0;
          const subs = subEntries
            .filter((e) => e.sourceOfFund === sourceKey)
            .sort((a, b) => b.value - a.value);
          return { sourceKey, sourceAmount, subs };
        });

        return (
          <div className="mb-8 rounded-sm border border-gray-100 bg-white shadow-sm">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Financial Overview
                </p>
                <p className="text-xs text-gray-400">
                  Source of funds broken down by sub-category
                </p>
              </div>
              <button
                onClick={() => {
                  const rows: string[][] = [
                    ["Source of Fund", "Sub-Category", "Amount (PHP)", "Percentage"],
                  ];
                  for (const g of groupedBreakdown) {
                    for (const s of g.subs) {
                      const pct = totalAllocation > 0 ? ((s.value / totalAllocation) * 100).toFixed(1) : "0.0";
                      rows.push([
                        FUND_SOURCE_LABELS[g.sourceKey] ?? g.sourceKey,
                        s.label,
                        s.value.toFixed(2),
                        `${pct}%`,
                      ]);
                    }
                  }
                  rows.push(["Grand Total", "", totalAllocation.toFixed(2), "100%"]);
                  const csv = rows.map((r) => r.join(",")).join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `fiscal-report-${financial?.budgetYear ?? ""}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Export Fiscal Report
              </button>
            </div>

            <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
              {/* Left: Donut Chart */}
              <div className="flex flex-col items-center justify-center gap-4 border-b border-gray-100 px-6 py-6 lg:border-b-0 lg:border-r">
                <p className="self-start text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total Annual Allocation
                </p>
                <DonutChart segments={segments} total={totalAllocation} />
                {/* Legend (by Source of Fund) */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                  {groupedBreakdown.slice(0, 8).map((g) => (
                    <span key={g.sourceKey} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: FUND_SOURCE_COLORS[g.sourceKey] ?? "#94a3b8" }}
                      />
                      {FUND_SOURCE_LABELS[g.sourceKey] ?? g.sourceKey}
                    </span>
                  ))}
                  {groupedBreakdown.length > 8 && (
                    <span className="text-xs text-gray-400">
                      +{groupedBreakdown.length - 8} more
                    </span>
                  )}
                  {groupedBreakdown.length === 0 && (
                    <span className="text-xs text-gray-400">No allocation data for {financial?.budgetYear ?? new Date().getFullYear()}</span>
                  )}
                </div>

                {/* Execution Rate */}
                <div className="w-full rounded-lg bg-gray-50 px-3 py-2.5">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <div className="flex flex-col">
                      <span className="font-semibold uppercase tracking-wider text-gray-500">
                        Execution Rate
                      </span>
                      <span className="text-[10px] font-normal normal-case text-gray-400">
                        Average progress across all projects
                      </span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      {Math.min(100, Math.max(0, executionRate)).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, executionRate))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Source of Funds Breakdown (grouped by sub-category) */}
              <div className="px-6 py-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Source of Funds Breakdown
                </p>
                {groupedBreakdown.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-400">
                    No fund allocation data found for {financial?.budgetYear ?? new Date().getFullYear()}.
                  </p>
                ) : (
                  <div className="flex max-h-80 flex-col gap-3 overflow-y-auto pr-1">
                    {groupedBreakdown.map(({ sourceKey, sourceAmount, subs }) => {
                      const sourcePct = totalAllocation > 0
                        ? ((sourceAmount / totalAllocation) * 100).toFixed(1)
                        : "0.0";
                      return (
                        <div
                          key={sourceKey}
                          className="rounded-lg border border-gray-100 bg-gray-50/50 p-3"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: FUND_SOURCE_COLORS[sourceKey] ?? "#94a3b8" }}
                              />
                              <span className="text-xs font-semibold text-gray-700">
                                {FUND_SOURCE_LABELS[sourceKey] ?? sourceKey}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-gray-900">
                                {formatPeso(sourceAmount)}
                              </p>
                              <p className="text-[10px] text-gray-400">{sourcePct}%</p>
                            </div>
                          </div>
                          {subs.length > 0 && (
                            <div className="flex flex-col gap-1 pl-4">
                              {subs.map((s) => {
                                const pct = totalAllocation > 0
                                  ? ((s.value / totalAllocation) * 100).toFixed(1)
                                  : "0.0";
                                return (
                                  <div
                                    key={s.key}
                                    className="flex items-center justify-between gap-2"
                                  >
                                    <div className="flex min-w-0 items-center gap-1.5">
                                      <span
                                        className="inline-block h-2 w-2 shrink-0 rounded-full"
                                        style={{ backgroundColor: s.color }}
                                      />
                                      <span className="truncate text-[11px] text-gray-600">
                                        {s.label}
                                      </span>
                                    </div>
                                    <div className="shrink-0 text-right">
                                      <span className="text-[11px] font-semibold text-gray-800">
                                        {formatPeso(s.value)}
                                      </span>
                                      <span className="ml-1.5 text-[10px] text-gray-400">
                                        {pct}%
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Grand Total */}
                {groupedBreakdown.length > 0 && (
                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        Grand Total Combined Allocation
                      </span>
                      <span className="text-sm font-extrabold text-blue-600">
                        {formatPeso(totalAllocation)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Project Cards Year Filter */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-gray-200 bg-white px-5 py-3 shadow-sm">
        {/* <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Project Cards Overview</p>
            <p className="text-xs text-gray-500">
              {cardYearFilter
                ? `Showing statistics for ${cardYearFilter}`
                : "Showing statistics across all years"}
            </p>
          </div>
        </div> */}

        {/* <div className="flex items-center gap-2">
          <label htmlFor="card-year-filter" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Filter by Budget Year
          </label>
          <div className="relative">
            <select
              id="card-year-filter"
              value={cardYearFilter}
              onChange={(e) => { setCardYearFilter(e.target.value); resetPage(); }}
              className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-9 text-sm font-medium text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Years</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
          {cardYearFilter && (
            <button
              onClick={() => setCardYearFilter("")}
              className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div> */}
      </div>

      {/* Colored Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 xl:grid-cols-8">
        {/* Budget Year */}
        {/* <div className="flex flex-col rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Budget Year
            </span>
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none text-gray-900">
            {financial?.budgetYear ?? new Date().getFullYear()}
          </p>
        </div> */}

        {/* Number of Projects */}
        {/* <div className="flex flex-col rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">No. of Projects</span>
            <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none text-gray-900">{stats?.total ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">Projects</p>
        </div> */}

        {/* Completed */}
        {/* <div className="flex flex-col rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Completed</span>
            <svg className="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none text-gray-900">{stats?.completed ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">Projects</p>
        </div> */}

        {/* Suspended */}
        {/* <div className="flex flex-col rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Suspended</span>
            <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none text-gray-900">{stats?.suspended ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">Projects</p>
        </div>

        {/* For Implementation */}
        {/* <div className="flex flex-col rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">For Implementation</span>
            <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none text-gray-900">{stats?.forImplementation ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">Projects</p>
        </div> */}

        {/* On-Going */}
        {/* <div className="flex flex-col rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">On-going</span>
            <svg className="h-4 w-4 text-orange-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none text-gray-900">{stats?.ongoing ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">Projects</p>
        </div> */}

        {/* Re-alignment */}
        {/* <div className="flex flex-col rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Re-alignment</span>
            <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none text-gray-900">{stats?.reAlignment ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">Projects</p>
        </div> */}

        {/* Others */}
        {/* <div className="flex flex-col rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Others</span>
            <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
          <p className="text-3xl font-extrabold leading-none text-gray-900">{stats?.others ?? 0}</p>
          <p className="mt-1 text-xs text-gray-400">Projects</p>
        </div> */}

      </div>