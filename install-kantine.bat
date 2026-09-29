@echo off
REM Engangsinstallasjon av Astrologiklokke på kantine-PC
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-kantine.ps1" %*
if errorlevel 1 pause
