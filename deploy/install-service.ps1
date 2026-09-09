<#
  Registers PEO-IMS as a Windows Service via NSSM.

  Run from an ELEVATED PowerShell prompt, after `npm run build` has succeeded:

      .\deploy\install-service.ps1

  Why NSSM points at node.exe and not npm.cmd: npm on Windows spawns a child
  shell, and NSSM then loses track of the real process on stop/restart, leaving
  an orphaned node holding port 3000.

  IMPORTANT — the app must run as a SINGLE process. Task notifications use an
  in-memory EventEmitter (see TASK.md), so any clustered setup silently breaks
  real-time notifications. Do not add a second instance or an IIS worker pool.
#>

[CmdletBinding()]
param(
  [string]$ServiceName = "PEOIMS",
  [string]$AppDirectory = "D:\apps\peois",
  [string]$DataDirectory = "D:\peois-data",
  [string]$NodeExe = "C:\Program Files\nodejs\node.exe",
  [int]$Port = 3000,
  # Match what the PostgreSQL installer created: sc query | findstr postgres
  [string]$PostgresService = "postgresql-x64-17"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command nssm -ErrorAction SilentlyContinue)) {
  throw "nssm was not found on PATH. Install NSSM first (https://nssm.cc)."
}
if (-not (Test-Path $NodeExe)) { throw "node.exe not found at $NodeExe" }
if (-not (Test-Path $AppDirectory)) { throw "App directory not found: $AppDirectory" }

$nextBin = Join-Path $AppDirectory "node_modules\next\dist\bin\next"
if (-not (Test-Path $nextBin)) {
  throw "Next.js not installed at $nextBin — run `npm ci` in $AppDirectory first."
}
if (-not (Test-Path (Join-Path $AppDirectory ".next"))) {
  throw "No .next build found — run `npm run build` in $AppDirectory first."
}

$logDirectory = Join-Path $DataDirectory "logs"
New-Item -ItemType Directory -Force -Path $logDirectory | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $DataDirectory "uploads") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $DataDirectory "backups") | Out-Null

if (Get-Service -Name $ServiceName -ErrorAction SilentlyContinue) {
  Write-Host "Service $ServiceName already exists — stopping to reconfigure."
  nssm stop $ServiceName confirm | Out-Null
} else {
  nssm install $ServiceName $NodeExe
}

# -H 127.0.0.1 binds Node to loopback: IIS is the only thing that should reach
# it, and nothing on the LAN should be able to hit port 3000 directly.
nssm set $ServiceName Application $NodeExe
nssm set $ServiceName AppParameters "`"$nextBin`" start -H 127.0.0.1 -p $Port"
nssm set $ServiceName AppDirectory $AppDirectory
nssm set $ServiceName AppEnvironmentExtra NODE_ENV=production

nssm set $ServiceName AppStdout (Join-Path $logDirectory "peois-out.log")
nssm set $ServiceName AppStderr (Join-Path $logDirectory "peois-err.log")
nssm set $ServiceName AppRotateFiles 1
nssm set $ServiceName AppRotateBytes 10485760

nssm set $ServiceName Start SERVICE_AUTO_START
nssm set $ServiceName DisplayName "PEO-IMS"
nssm set $ServiceName Description "Provincial Engineering Office Information Management System"

# Windows starts PostgreSQL before the app on boot.
if (Get-Service -Name $PostgresService -ErrorAction SilentlyContinue) {
  nssm set $ServiceName DependOnService $PostgresService
} else {
  Write-Warning "PostgreSQL service '$PostgresService' not found — set DependOnService manually (sc query | findstr postgres)."
}

nssm start $ServiceName

Start-Sleep -Seconds 5
try {
  $response = Invoke-WebRequest -Uri "http://127.0.0.1:$Port" -UseBasicParsing -TimeoutSec 20
  Write-Host "PEO-IMS responded with HTTP $($response.StatusCode)." -ForegroundColor Green
} catch {
  Write-Warning "No response yet on 127.0.0.1:$Port. Check $logDirectory\peois-err.log."
}

Write-Host "`nNow REBOOT the server and re-run the curl check — that is the real test."
