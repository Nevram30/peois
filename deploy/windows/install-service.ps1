<#
.SYNOPSIS
    Registers PEO-IMS as a Windows Service using NSSM.

.DESCRIPTION
    Run from an elevated PowerShell prompt on the Windows Server, after the
    app has been built once (npm ci && npm run build).

    Node is bound to 127.0.0.1 on purpose: IIS is the only thing that should
    reach it, and port 3000 must not be exposed to the LAN.

    NSSM is pointed at node.exe with Next's bin script rather than at npm.cmd,
    because npm on Windows spawns a child shell and NSSM then loses track of
    the real process when stopping or restarting the service.

.EXAMPLE
    .\install-service.ps1 -AppDirectory "D:\apps\peois"
#>
[CmdletBinding()]
param(
    [string] $ServiceName  = "PEOIMS",
    [string] $AppDirectory = "D:\apps\peois",
    [string] $LogDirectory = "D:\peois-data\logs",
    [string] $NodeExe      = "C:\Program Files\nodejs\node.exe",
    [int]    $Port         = 3000,
    # Match the actual PostgreSQL service name: sc query | findstr postgres
    [string] $PostgresService = "postgresql-x64-17"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command nssm -ErrorAction SilentlyContinue)) {
    throw "nssm is not on PATH. Install NSSM (https://nssm.cc) first."
}
if (-not (Test-Path $NodeExe)) { throw "Node not found at $NodeExe" }

$nextBin = Join-Path $AppDirectory "node_modules\next\dist\bin\next"
if (-not (Test-Path $nextBin)) {
    throw "Next not found at $nextBin. Run 'npm ci' in $AppDirectory first."
}
if (-not (Test-Path (Join-Path $AppDirectory ".next"))) {
    throw "No production build found. Run 'npm run build' in $AppDirectory first."
}
if (-not (Test-Path (Join-Path $AppDirectory ".env"))) {
    throw "No .env found in $AppDirectory. Copy .env.example and fill it in."
}

New-Item -ItemType Directory -Force -Path $LogDirectory | Out-Null

if (Get-Service -Name $ServiceName -ErrorAction SilentlyContinue) {
    Write-Host "Service '$ServiceName' exists — stopping and removing it."
    nssm stop   $ServiceName confirm | Out-Null
    nssm remove $ServiceName confirm | Out-Null
    Start-Sleep -Seconds 2
}

Write-Host "Installing service '$ServiceName'..."
nssm install $ServiceName $NodeExe
nssm set $ServiceName AppParameters "`"$nextBin`" start -H 127.0.0.1 -p $Port"
nssm set $ServiceName AppDirectory   $AppDirectory
nssm set $ServiceName AppEnvironmentExtra "NODE_ENV=production"
nssm set $ServiceName DisplayName   "PEO-IMS"
nssm set $ServiceName Description   "Provincial Engineering Office Information Management System"
nssm set $ServiceName Start         SERVICE_AUTO_START

# Start PostgreSQL first on boot, or the app comes up with no database.
if (Get-Service -Name $PostgresService -ErrorAction SilentlyContinue) {
    nssm set $ServiceName DependOnService $PostgresService
} else {
    Write-Warning "PostgreSQL service '$PostgresService' not found — no start dependency set. Fix with: nssm set $ServiceName DependOnService <name>"
}

# Rotate at 10MB so the logs cannot fill the disk over a few years.
nssm set $ServiceName AppStdout      (Join-Path $LogDirectory "peois-out.log")
nssm set $ServiceName AppStderr      (Join-Path $LogDirectory "peois-err.log")
nssm set $ServiceName AppRotateFiles 1
nssm set $ServiceName AppRotateOnline 1
nssm set $ServiceName AppRotateBytes 10485760

# Restart on crash, but back off so a boot-loop does not spin the CPU.
nssm set $ServiceName AppExit Default Restart
nssm set $ServiceName AppRestartDelay 5000

Write-Host "Starting..."
nssm start $ServiceName
Start-Sleep -Seconds 5

$service = Get-Service -Name $ServiceName
Write-Host "Service '$ServiceName' is $($service.Status)."
Write-Host ""
Write-Host "Verify with:  curl http://127.0.0.1:$Port"
Write-Host "Logs:         $LogDirectory"
Write-Host ""
Write-Host "Now reboot the server and check it comes back on its own —"
Write-Host "that is the real test that the service is configured correctly."
