<#
.SYNOPSIS
    Nightly backup of the PEO-IMS database and uploaded files.

.DESCRIPTION
    Register with Task Scheduler to run daily as a user that can read
    UPLOAD_DIR and run pg_dump:

      schtasks /create /tn "PEOIMS Backup" /sc daily /st 22:00 /ru SYSTEM ^
        /tr "powershell -ExecutionPolicy Bypass -File D:\apps\peois\deploy\windows\backup.ps1"

    The database dump and the uploads are taken together and kept for the same
    number of days on purpose: restoring one without the other leaves rows
    pointing at files that do not exist, or files nothing references.

    Set PGPASSWORD via a machine environment variable, or use a pgpass file,
    so no password is stored in this script.
#>
[CmdletBinding()]
param(
    [string] $Database   = "peois",
    [string] $DbUser     = "peois_app",
    [string] $UploadDir  = "D:\peois-data\uploads",
    [string] $BackupRoot = "D:\peois-data\backups",
    [string] $PgDump     = "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe",
    [int]    $RetainDays = 30
)

$ErrorActionPreference = "Stop"
$stamp = Get-Date -Format "yyyy-MM-dd"

New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null

# ── Database ────────────────────────────────────────────────────────────────
# Custom format (-F c), which restores with pg_restore and compresses well.
$dumpFile = Join-Path $BackupRoot "peois-$stamp.dump"
Write-Host "Dumping database to $dumpFile"
& $PgDump -U $DbUser -F c -f $dumpFile $Database
if ($LASTEXITCODE -ne 0) { throw "pg_dump failed with exit code $LASTEXITCODE" }

# ── Uploaded files ──────────────────────────────────────────────────────────
# /MIR mirrors, so deletions propagate; the dated database dumps are what
# protect against an accidental mass delete being mirrored away.
$uploadMirror = Join-Path $BackupRoot "uploads"
Write-Host "Mirroring $UploadDir to $uploadMirror"
robocopy $UploadDir $uploadMirror /MIR /R:2 /W:5 /NP /NDL | Out-Null
# robocopy uses exit codes 0-7 for success; 8+ is a real failure.
if ($LASTEXITCODE -ge 8) { throw "robocopy failed with exit code $LASTEXITCODE" }

# ── Retention ───────────────────────────────────────────────────────────────
Get-ChildItem -Path $BackupRoot -Filter "peois-*.dump" |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$RetainDays) } |
    ForEach-Object {
        Write-Host "Removing expired backup $($_.Name)"
        Remove-Item $_.FullName -Force
    }

Write-Host "Backup complete: $stamp"
Write-Host ""
Write-Host "Copy $BackupRoot to another machine — a backup on the same disk as"
Write-Host "the data protects against mistakes, not against losing the disk."
