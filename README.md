# PEO-IMS

Information Management System for the Provincial Engineering Office.

Next.js 15 (App Router) · tRPC v11 · Prisma 6 / PostgreSQL · NextAuth v5 · Serwist PWA.

---

## Development

```bash
npm install          # postinstall runs `prisma generate`
cp .env.example .env # then fill in AUTH_SECRET and DATABASE_URL
npm run db:migrate   # apply migrations
npm run db:seed      # first time only — creates the superadmin + archiver
npm run dev
```

Uploaded files land in `./uploads` unless `UPLOAD_DIR` says otherwise. Both that
folder and `generated/` (the per-platform Prisma client) are gitignored.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm run start` | Production build / serve |
| `npm run check` | Lint + typecheck |
| `npm run db:migrate` | `prisma migrate deploy` — the only safe migration command on a server |
| `npm run db:seed` | Seed the superadmin and archiver accounts |
| `npm run migrate:uploads` | One-off: pull historical UploadThing files onto local disk |

> **Never run `db:push`, `db:generate`, `db:reset` or `db:setup` against the
> production database.** They are development commands; `db:reset` drops all data.

---

# Deploying PEO-IMS on the office Windows Server

The system runs entirely on-premises: PostgreSQL, the application, and every
uploaded document live on one server and stay reachable when the internet is
down. Work through the phases in order.

## A. Production runtime

### A1. Prerequisites

- **Node.js 22 LTS (x64 MSI)** — verify `node -v` and `npm -v` in a *new* terminal.
- **Git for Windows** (or copy the source across with a zip / robocopy).
- **PostgreSQL** — confirm the database exists: `psql -U postgres -c "\l"` lists `peois`.

### A2. Folder layout

```
D:\apps\peois\          application source + build
D:\peois-data\uploads\  uploaded files       <- outside the app folder
D:\peois-data\logs\     service stdout/stderr
D:\peois-data\backups\  pg_dump output
```

Keeping uploads and backups **outside** the application folder is what makes a
redeploy safe: `git pull`, a rebuild, even delete-and-reclone cannot destroy
office data. Grant the service account **Modify** on `D:\peois-data`.

### A3. Database role

Create a dedicated role that owns the database rather than reusing `postgres`:

```sql
CREATE ROLE peois_app LOGIN PASSWORD '<strong-password>';
ALTER DATABASE peois OWNER TO peois_app;
```

Then restrict `pg_hba.conf` to `127.0.0.1` — the database must be reachable by
the application only, never from the LAN.

### A4. Server `.env`

Create `D:\apps\peois\.env`. **Do not copy the development one** — it carries a
development `AUTH_SECRET`.

```ini
NODE_ENV=production
DATABASE_URL="postgresql://peois_app:<strong-password>@localhost:5432/peois"
AUTH_SECRET="<generate fresh: npx auth secret>"
UPLOAD_DIR="D:\\peois-data\\uploads"
PORT=3000
```

`UPLOADTHING_TOKEN` is optional and only needed if you still have cloud files to
migrate (see D).

### A5. Build and seed

```bat
cd /d D:\apps\peois
npm ci                 :: postinstall generates the Windows Prisma engine
npm run db:migrate     :: applies all migrations
npm run db:seed        :: FIRST TIME ONLY
npm run build
npm run start          :: smoke test on http://localhost:3000
```

**Immediately after seeding**, sign in as `superadmin@peomis.gov.ph`
(employee ID `SA-00001`) and change the password — the default is hardcoded in
`prisma/seed.ts` and is in version control.

If any `Document.filePath` rows still point at `/uploads/documents/...`, copy
`public/uploads/documents/` from the development machine now; that folder is
gitignored and does not survive a fresh checkout.

## B. Run as a Windows Service (NSSM)

Install [NSSM](https://nssm.cc), then from an **elevated** PowerShell:

```powershell
.\deploy\install-service.ps1
```

The script binds Node to **loopback only** (`-H 127.0.0.1`), points NSSM at
`node.exe` with Next's bin script (npm.cmd spawns a child shell that NSSM loses
track of on restart), configures log rotation, sets the service to start
automatically, and makes it depend on the PostgreSQL service so Windows starts
the database first on boot.

Adjust the PostgreSQL service name if the installer created a different one:

```powershell
sc query | findstr postgres
.\deploy\install-service.ps1 -PostgresService postgresql-x64-16
```

> **Single process only.** Task notifications use an in-memory `EventEmitter`
> (`TASK.md`), so *any* clustered setup — `pm2 -i max`, an IIS worker pool, a
> second instance — silently breaks real-time notifications. One `node` process
> under NSSM is the correct shape. Scaling out requires moving to Postgres
> `LISTEN/NOTIFY` first.

**Verify by rebooting the server**, signing in to nothing, and confirming
`curl http://127.0.0.1:3000` still answers from the console.

## C. HTTPS on the LAN via IIS reverse proxy

### C1. Install

IIS role + **URL Rewrite 2.1** + **Application Request Routing 3.0**. Then in
IIS Manager → server node → *Application Request Routing Cache* → *Server Proxy
Settings* → tick **Enable proxy**.

### C2. Certificate

- **Domain-joined with AD Certificate Services**: request a Web Server
  certificate for the app's DNS name (e.g. `peois.peo.local`). Domain PCs trust
  it automatically — nothing to install on clients.
- **Otherwise**: `New-SelfSignedCertificate -DnsName peois.peo.local`, then push
  the root to *Trusted Root Certification Authorities* on client PCs by GPO.

Without a trusted certificate browsers show a warning **and the service worker
will not register**, so the PWA and offline fallback silently stop working.

Create a DNS A record for the hostname. Do not rely on the bare IP —
certificates for IP addresses are awkward, and a hostname makes a future server
move painless.

### C3. Site and rewrite rule

Create an IIS site bound to `https://peois.peo.local:443` with the certificate,
plus a port-80 site that redirects to HTTPS. The physical path can be an empty
folder — IIS serves nothing itself. Copy [`deploy/web.config`](deploy/web.config)
into it.

Before the rule will run, allow the forwarded-protocol header:
*URL Rewrite → View Server Variables → Add* `HTTP_X_FORWARDED_PROTO`.

### C4. Three ARR settings that will bite you

| Setting | Value | Why |
| --- | --- | --- |
| Response buffer threshold | `0` | Task notifications stream over SSE. With buffering on they arrive in batches, or never. |
| Preserve host header | `On` | NextAuth runs `trustHost: true` and builds callback URLs from the `Host` header. Wrong host ⇒ sign-in redirect loop. |
| Time-out | `120`s or more | Large document uploads are otherwise cut off mid-transfer. |

### C5. Firewall

Allow inbound **443** (and 80 for the redirect). Never open **3000** — Node is
loopback-bound, so confirm from another PC that `http://<server-ip>:3000` fails
to connect.

## D. File storage

Uploads are written to `UPLOAD_DIR` and served back through
`GET /api/files/<yyyy>/<mm>/<uuid>.<ext>`, which enforces the same session check
as the rest of the app. Files are deliberately **not** placed under `public/`:
Next serves that folder with no authentication at all, and these are official
project documents.

Stored names are UUIDs with an extension derived from the file's *verified*
content, never from the uploaded file name — the original name is kept in the
database (`Document.fileName`, `TaskReplyDocument.fileName`,
`ProjectFile.fileName`). Files are foldered by year and month, because a single
flat directory of tens of thousands of files is slow to browse and back up on
NTFS.

### Migrating historical cloud files

Rows created before this change hold absolute `https://*.ufs.sh` URLs. Run the
migration **while the server still has internet**, and take a dump first:

```bat
pg_dump -U peois_app -F c peois > D:\peois-data\backups\before-upload-migration.dump
npm run migrate:uploads -- --dry-run   :: preview
npm run migrate:uploads
```

It is idempotent — anything already local is skipped, so it is safe to re-run
after a partial failure. Confirm nothing remains before going fully offline:

```sql
SELECT count(*) FROM "Project"           WHERE "imageUrl" LIKE '%ufs%';
SELECT count(*) FROM "User"              WHERE "image"    LIKE '%ufs%';
SELECT count(*) FROM "Document"          WHERE "filePath" LIKE '%ufs%';
SELECT count(*) FROM "ProjectFile"       WHERE "fileUrl"  LIKE '%ufs%';
SELECT count(*) FROM "TaskReplyDocument" WHERE "fileUrl"  LIKE '%ufs%';
```

Once all five return `0`, the UploadThing route (`src/app/api/uploadthing/`) and
the `*.ufs.sh` entries in `next.config.js` can be deleted. They are kept until
then so historical URLs still render, and as a rollback path.

## E. Operations

### Redeploy

```bat
cd /d D:\apps\peois
git pull
npm ci
npm run db:migrate
npm run build
nssm restart PEOIMS
```

A few seconds of downtime; acceptable for an office system. `npm ci` regenerates
the Prisma client for Windows — `generated/` is gitignored precisely so a pull
can never overwrite it with another platform's binaries.

### Backups

[`deploy/backup.ps1`](deploy/backup.ps1) dumps the database and mirrors the
uploads folder. Register it in Task Scheduler to run nightly:

```bat
schtasks /create /tn "PEO-IMS Backup" /sc daily /st 22:00 /ru SYSTEM /tr ^
  "powershell -ExecutionPolicy Bypass -File D:\apps\peois\deploy\backup.ps1 -UploadsMirror \\nas\peois\uploads"
```

The database and the files must be backed up **together** — restoring one
without the other leaves every document link broken. Test a restore into a
scratch database once: an untested backup is not a backup.

### Logs

NSSM rotates `D:\peois-data\logs\peois-{out,err}.log` at 10MB. Read
`peois-err.log` after the first week.

### UPS

A single on-prem server with a local database and local files has no redundancy.
Battery backup is the cheapest meaningful protection.

### Optional — idle logout

`SESSION_MAX_AGE_SECONDS` in `src/lib/auth-constants.ts` is **5 minutes**, which
will frustrate staff who step away from their desks; 30 minutes is more typical
for an internal system. One constant, but a policy decision — confirm with the
office before changing it.

---

## Acceptance checks

Each step depends on the one above it.

**Runtime (A–B)**

1. `npm run build` completes with no env-validation error.
2. `npm run start`, then `curl http://127.0.0.1:3000` returns HTML.
3. Start the service, close all sessions, **reboot**, then `curl` again.
4. `services.msc` shows PEOIMS as *Running / Automatic*.

**Network + TLS (C)**

5. From another office PC, `https://peois.peo.local` loads with a padlock and no warning.
6. `http://<server-ip>:3000` from that PC **fails** to connect.
7. Sign in as each role (SUPER_ADMIN, ADMIN, USER, ARCHIVER) and confirm each
   lands on its own dashboard. A redirect loop here means C4 is misconfigured.
8. DevTools → Application → Service Workers shows `sw.js` **activated**. Kill the
   network and confirm `/~offline` renders.
9. Trigger a task notification from a second browser — it should arrive within a
   second or two. Delayed or absent means ARR response buffering is still on.

**Local storage (D)**

10. Create a project with all 4 photo slots filled; files appear under
    `D:\peois-data\uploads\<yyyy>\<mm>\` and nothing new appears in `public/uploads`.
11. Reload the project — photos render from `/api/files/...`.
12. Sign out completely and paste an `/api/files/...` URL → **401**, not the file.
13. Upload a 16MB PDF as a task reply through IIS. This proves
    `maxAllowedContentLength` and the ARR timeout are right, and is the step most
    likely to fail first.
14. Rename a `.exe` to `.pdf` and upload it → rejected. The server checks the
    file's actual signature, not just the browser-supplied MIME type.
15. Run the migration and confirm the five counts above are `0`.
16. **Unplug the server's internet** (leave the LAN up) and run a full workflow:
    create a project, upload a photo, attach a document, reply to a task.
    Everything must work. This is the acceptance test for the whole migration.

**Operations (E)**

17. Run the backup task manually, restore the dump into a scratch database, and
    confirm the table counts match.
