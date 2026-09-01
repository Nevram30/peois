# PEO-IMS

Provincial Engineering Office — Information Management System.

Built on the [T3 Stack](https://create.t3.gg/): Next.js 15 (App Router), tRPC v11,
Prisma 6 + PostgreSQL, NextAuth v5 (credentials), Tailwind v4, Serwist PWA.

---

## Local development

```bash
git clone <repo-url> peois
cd peois
npm install                 # postinstall runs `prisma generate`
cp .env.example .env        # then fill in AUTH_SECRET and DATABASE_URL
npx auth secret             # generates AUTH_SECRET

npm run db:migrate          # apply migrations
npm run db:seed             # first time only — creates the super admin
npm run dev                 # http://localhost:3000
```

`./start-database.sh` will spin up a local PostgreSQL container if you don't
have one (macOS/Linux, or Windows via WSL).

Useful checks: `npm run check` (lint + typecheck), `npm run db:studio`.

---

## Production deployment (on-premise Windows Server)

The app runs as a Windows Service behind IIS, against a local PostgreSQL, with
uploaded files on the server's own disk. Nothing leaves the building.

Supporting files live in [`deploy/windows/`](deploy/windows/).

### Layout

| Path | Holds |
|---|---|
| `D:\apps\peois\` | Application source and build |
| `D:\peois-data\uploads\` | Uploaded photos and documents (`UPLOAD_DIR`) |
| `D:\peois-data\logs\` | Service stdout/stderr |
| `D:\peois-data\backups\` | Database dumps and the upload mirror |

Uploads and backups sit **outside** the app folder so a redeploy — or a
delete-and-reclone — can never destroy office data.

### 1. Prerequisites

- Node.js 22 LTS (x64 MSI)
- PostgreSQL 17, listening on `localhost` only
- Git for Windows
- [NSSM](https://nssm.cc) on `PATH`
- IIS + [URL Rewrite 2.1](https://www.iis.net/downloads/microsoft/url-rewrite) +
  [ARR 3.0](https://www.iis.net/downloads/microsoft/application-request-routing)

Create a dedicated database role rather than reusing `postgres`, then restrict
`pg_hba.conf` to `127.0.0.1`. The database should be reachable only by the app.

```sql
CREATE ROLE peois_app LOGIN PASSWORD '<strong-password>';
CREATE DATABASE peois OWNER peois_app;
```

### 2. Configure

```powershell
cd D:\apps\peois
copy .env.example .env
```

```ini
NODE_ENV=production
DATABASE_URL="postgresql://peois_app:<password>@localhost:5432/peois"
AUTH_SECRET="<npx auth secret — generate a NEW one, never reuse the dev value>"
UPLOAD_DIR="D:\\peois-data\\uploads"
PORT=3000
```

### 3. Build

```powershell
npm ci                 # postinstall generates the Windows Prisma engine
npm run db:migrate     # prisma migrate deploy
npm run db:seed        # FIRST INSTALL ONLY
npm run build
```

Use `db:migrate` on a server. Never `db:push`, `db:generate`, `db:setup`, or
`db:reset` — those are development commands and `db:reset` **drops all data**.

> After seeding, sign in as `SA-00001` and change the password immediately. The
> seeded default is hardcoded in `prisma/seed.ts` and is in version control.

### 4. Run as a service

```powershell
.\deploy\windows\install-service.ps1 -AppDirectory "D:\apps\peois"
```

Node binds to `127.0.0.1:3000` — IIS is the only thing that should reach it.

**Run one instance only.** Task notifications use an in-memory `EventEmitter`
(see `TASK.md`), so a clustered setup silently breaks real-time delivery.

### 5. HTTPS via IIS

1. Get a certificate for the app's hostname (e.g. `peois.peo.local`) — from AD
   Certificate Services if the server is domain-joined, otherwise self-signed
   with the root pushed to clients by GPO. Add a matching DNS A record.
2. Create an IIS site bound to `https://<hostname>:443`, plus a port-80 site
   that redirects to it. Copy [`deploy/windows/web.config`](deploy/windows/web.config)
   into the site's physical path and follow the prerequisites in its header.
3. In *ARR → Server Proxy Settings*: **response buffer threshold = 0**
   (otherwise SSE notifications arrive in batches or never), **preserve host
   header = on**, and raise the proxy timeout to 120s for large uploads.
4. Firewall: allow 443 and 80. Never open 3000.

Without a *trusted* certificate the service worker will not register, so the
PWA install and offline fallback silently stop working.

### 6. Backups

```powershell
schtasks /create /tn "PEOIMS Backup" /sc daily /st 22:00 /ru SYSTEM ^
  /tr "powershell -ExecutionPolicy Bypass -File D:\apps\peois\deploy\windows\backup.ps1"
```

[`backup.ps1`](deploy/windows/backup.ps1) dumps the database and mirrors
`UPLOAD_DIR` together — restoring one without the other leaves broken links.
Test a restore into a scratch database once; an untested backup is not a backup.

Copy `D:\peois-data\backups` off the machine regularly, and put the server on
a UPS. A single on-premise box has no redundancy.

---

## Redeploying

```powershell
cd D:\apps\peois
git pull
npm ci
npm run db:migrate
npm run build
nssm restart PEOIMS
```

A few seconds of downtime. Uploads and the database are untouched.

---

## File storage

Uploads are written to `UPLOAD_DIR` by `POST /api/upload` and read back through
`GET /api/files/[...path]`, which checks the session first.

Files are deliberately **not** stored under `public/`: Next serves everything
there with no authentication, and these are official project documents. Names
on disk are random UUIDs foldered by year and month; the original file name is
kept in the database as a display label only, never as a path.

`src/lib/uploadthing.ts` keeps its old module path and export names
(`uploadFiles`, `useUploadThing`) as a shim over the local endpoint, so the
forms written against the previously-hosted service work unchanged.

### Migrating off UploadThing

If the database still holds `*.ufs.sh` / `utfs.io` URLs from before the switch,
run this **while the server still has internet**, after taking a backup:

```powershell
npm run uploads:migrate -- --dry-run   # report what would move
npm run uploads:migrate                # download and rewrite
```

It is idempotent and safe to re-run. Verify nothing remains before going
offline:

```sql
SELECT count(*) FROM "Project"     WHERE "imageUrl" LIKE '%ufs%';
SELECT count(*) FROM "ProjectFile" WHERE "fileUrl"  LIKE '%ufs%';
```

---

## Notes

- **Sessions expire after 5 minutes idle** (`src/lib/auth-constants.ts`). This
  is aggressive for office use; 30 minutes is more typical. One constant, but a
  policy decision.
- `generated/` is gitignored and rebuilt by `postinstall`, so each machine gets
  a Prisma engine matching its own OS.
