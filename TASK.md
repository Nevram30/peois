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
