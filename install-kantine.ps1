# Astrologiklokke – installasjon på kantine-PC (Windows)
#
# Kjør én gang (høyreklikk → «Kjør med PowerShell», eller fra CMD):
#   powershell -ExecutionPolicy Bypass -File .\install-kantine.ps1
#
# Etterpå: dobbeltklikk start-kantine.bat eller kjør start-kantine.ps1

param(
  [string]$InstallDir = "$env:USERPROFILE\astroclock",
  [string]$RepoUrl = "https://github.com/Lars1001/astroclock.git",
  [int]$Port = 8080,
  [switch]$SkipStart
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== Astrologiklokke – kantine-installasjon ===" -ForegroundColor Cyan
Write-Host "Mappe: $InstallDir"
Write-Host "Repo:  $RepoUrl"
Write-Host "Port:  $Port"
Write-Host ""

function Test-Command($name) {
  return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

# --- Git ---
if (-not (Test-Command "git")) {
  Write-Host "Git mangler. Prøver å installere via winget..." -ForegroundColor Yellow
  if (Test-Command "winget") {
    winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
  } else {
    throw "Installer Git manuelt: https://git-scm.com/download/win  – kjør deretter dette scriptet på nytt."
  }
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
              [System.Environment]::GetEnvironmentVariable("Path", "User")
  if (-not (Test-Command "git")) {
    throw "Git er fortsatt ikke tilgjengelig. Åpne et nytt PowerShell-vindu og prøv igjen."
  }
}

# --- Hent / oppdater kode ---
if (Test-Path (Join-Path $InstallDir ".git")) {
  Write-Host "Oppdaterer eksisterende installasjon..." -ForegroundColor Green
  Push-Location $InstallDir
  git fetch origin
  git checkout master 2>$null
  git pull --ff-only origin master
  Pop-Location
} elseif (Test-Path $InstallDir) {
  Write-Host "Mappen finnes uten git – kloner til midlertidig mappe og erstatter..." -ForegroundColor Yellow
  $tmp = Join-Path $env:TEMP ("astroclock-" + [guid]::NewGuid().ToString("N"))
  git clone $RepoUrl $tmp
  Remove-Item -Recurse -Force $InstallDir
  Move-Item $tmp $InstallDir
} else {
  Write-Host "Kloner fra GitHub..." -ForegroundColor Green
  git clone $RepoUrl $InstallDir
}

# --- Finn webserver (Python foretrekkes, ellers Node npx) ---
$serverKind = $null
if (Test-Command "python") { $serverKind = "python" }
elseif (Test-Command "py") { $serverKind = "py" }
elseif (Test-Command "npx") { $serverKind = "npx" }
else {
  Write-Host "Verken Python eller Node (npx) funnet. Prøver winget for Python..." -ForegroundColor Yellow
  if (Test-Command "winget") {
    winget install --id Python.Python.3.12 -e --source winget --accept-package-agreements --accept-source-agreements
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
                [System.Environment]::GetEnvironmentVariable("Path", "User")
  }
  if (Test-Command "python") { $serverKind = "python" }
  elseif (Test-Command "py") { $serverKind = "py" }
  else {
    throw "Installer Python 3 fra https://www.python.org/downloads/ (huk av «Add to PATH») og kjør scriptet på nytt."
  }
}

# --- Skriv start-skript ---
$startPs1 = Join-Path $InstallDir "start-kantine.ps1"
$startBat = Join-Path $InstallDir "start-kantine.bat"

@"
# Starter Astrologiklokke lokalt
`$ErrorActionPreference = 'Stop'
Set-Location -Path '$InstallDir'
`$port = $Port
Write-Host "Starter Astrologiklokke på http://localhost:`$port" -ForegroundColor Cyan
Write-Host "Fødselshoroskop lagres i nettleseren (localStorage). Bruk Eksporter for JSON-backup."
Write-Host "Trykk Ctrl+C for å stoppe."
Start-Process "http://localhost:`$port"
if ('$serverKind' -eq 'python') {
  python -m http.server `$port
} elseif ('$serverKind' -eq 'py') {
  py -m http.server `$port
} else {
  npx --yes serve -l `$port .
}
"@ | Set-Content -Path $startPs1 -Encoding UTF8

@"
@echo off
cd /d "$InstallDir"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-kantine.ps1"
pause
"@ | Set-Content -Path $startBat -Encoding ASCII

# Snarvei på skrivebordet
try {
  $desktop = [Environment]::GetFolderPath("Desktop")
  $lnkPath = Join-Path $desktop "Astrologiklokke.lnk"
  $wsh = New-Object -ComObject WScript.Shell
  $lnk = $wsh.CreateShortcut($lnkPath)
  $lnk.TargetPath = $startBat
  $lnk.WorkingDirectory = $InstallDir
  $lnk.Description = "Start Astrologiklokke (kantine)"
  $lnk.Save()
  Write-Host "Skrivebordssnarvei: $lnkPath" -ForegroundColor Green
} catch {
  Write-Host "Kunne ikke lage snarvei (ok å starte manuelt via start-kantine.bat)." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Installasjon ferdig." -ForegroundColor Green
Write-Host "  Mappe:     $InstallDir"
Write-Host "  Start:     $startBat"
Write-Host "  Nettadresse: http://localhost:$Port"
Write-Host ""
Write-Host "Tips: Fødselshoroskop lagres automatisk i nettleseren når du trykker «Lagre fødselshoroskop»."
Write-Host "      Eksporter JSON hvis flere brukere deler PC og du vil ta backup."
Write-Host ""

if (-not $SkipStart) {
  Write-Host "Starter server..." -ForegroundColor Cyan
  Set-Location $InstallDir
  & $startPs1
}
