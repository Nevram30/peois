<#
  Nightly backup for PEO-IMS: the database and the uploaded files together.

  They MUST be backed up as a pair — restoring a database whose rows point at
  files that were not copied leaves every document link broken.

  Register with Task Scheduler, running as a user that can read D:\peois-data:

      schtasks /create /tn "PEO-IMS Backup" /tr ^
        "powershell -ExecutionPolicy Bypass -File D:\apps\peois\deploy\backup.ps1" ^
        /sc daily /st 22:00 /ru SYSTEM

  Set PGPASSWORD (or configure %APPDATA%\postgresql\pgpass.conf) so pg_dump can
  authenticate non-interactively.
#>

[CmdletBinding()]
param(
  [string]$DataDirectory = "D:\peois-data",
  [string]$Database = "peois",
  [string]$DbUser = "peois_app",
  [string]$PgDump = "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe",
  # Network share for off-server copies. Leave empty to keep backups local only
  # — which protects against a bad migration, but not against losing the server.
  [string]$UploadsMirror = "",
  [int]$RetentionDays = 30
)

$ErrorActionPreference = "Stop"

$backupDirectory = Join-Path $DataDirectory "backups"
$uploadsDirectory = Join-Path $DataDirectory "uploads"
New-Item -ItemType Directory -Force -Path $backupDirectory | Out-Null

$stamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$dumpFile = Join-Path $backupDirectory "peois-$stamp.dump"

if (-not (Test-Path $PgDump)) { throw "pg_dump not found at $PgDump" }

Write-Host "Dumping $Database -> $dumpFile"
# -F c is the custom format, which pg_restore can read selectively.
& $PgDump -U $DbUser -F c -f $dumpFile $Database
if ($LASTEXITCODE -ne 0) { throw "pg_dump failed with exit code $LASTEXITCODE" }

$sizeMb = [math]::Round((Get-Item $dumpFile).Length / 1MB, 1)
Write-Host "Wrote $sizeMb MB."
if ($sizeMb -eq 0) { throw "Dump file is empty — investigate before trusting this backup." }

if ($UploadsMirror) {
  Write-Host "Mirroring uploads -> $UploadsMirror"
  # /MIR makes the destination match the source exactly, deletions included.
  robocopy $uploadsDirectory $UploadsMirror /MIR /R:2 /W:5 /NP /NDL | Out-Null
  # robocopy exit codes below 8 are success ("files copied", "extra files").
  if ($LASTEXITCODE -ge 8) { throw "robocopy failed with exit code $LASTEXITCODE" }
  $global:LASTEXITCODE = 0
} else {
  Write-Warning "UploadsMirror not set — uploaded files are NOT being copied off this server."
}

Write-Host "Pruning dumps older than $RetentionDays days."
Get-ChildItem -Path $backupDirectory -Filter "peois-*.dump" |
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$RetentionDays) } |
  Remove-Item -Force

Write-Host "Backup complete." -ForegroundColor Green
Write-Host @"

Reminder: an untested backup is not a backup. Once, restore into a scratch
database and compare table counts against production:

  createdb -U postgres peois_restore_test
  pg_restore -U postgres -d peois_restore_test "$dumpFile"
  psql -U postgres -d peois_restore_test -c "SELECT count(*) FROM \"Project\";"
"@
