# Astrologiklokke

2D-visualisering av solsystemet med planeter som visere, aspektlinjer, natalprofiler, profetier og transittsammendrag.

**GitHub:** https://github.com/Lars1001/astroclock

## Funksjoner

- Sol- eller jordsentrert klokke med realtime / hastighetsstyring
- Hover-info for planeter og aspekter (orb + kort tolkning)
- Fødselshoroskop (opptil 3) lagret i nettleseren (`localStorage`), med geokoding, eksport/import
- Analysepanel med topp transitt→natal-aspekter
- Profeti-seksjon (Minos/Valdres, Vanga, Nostradamus) med aspekt-sammenligning

## Installasjon på kantine-PC (Windows)

1. Last ned repoet, eller åpne PowerShell og kjør:

```powershell
git clone https://github.com/Lars1001/astroclock.git
cd astroclock
powershell -ExecutionPolicy Bypass -File .\install-kantine.ps1
```

2. Eller dobbeltklikk `install-kantine.bat` etter at mappen er lastet ned.

Scriptet:

- kloner/oppdaterer fra GitHub til `%USERPROFILE%\astroclock`
- sjekker Git + Python (installerer via winget om mulig)
- lager `start-kantine.bat` og snarvei på skrivebordet
- starter server på **http://localhost:8080**

Senere: dobbeltklikk **Astrologiklokke** på skrivebordet, eller `start-kantine.bat`.

Oppdater til nyeste kode:

```powershell
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\astroclock\install-kantine.ps1" -SkipStart
```

## Fødselshoroskop – lagring

- Trykk **Lagre fødselshoroskop** – data huskes etter omstart (samme nettleser/bruker på PCen).
- Ved lagring beregnes også planetposisjoner (horoskop-snapshot) og lagres sammen med navn/dato/sted.
- **Eksporter** lager en JSON-fil (anbefalt backup på delt kantine-PC).
- **Importer** leser JSON tilbake.

## Kjør lokalt (utvikling)

```bash
python -m http.server 8080
```

eller

```bash
npx serve .
```

Åpne `http://localhost:8080`.

## Teknisk

- [Astronomy Engine](https://github.com/cosinekitty/astronomy) (`astronomy.browser.min.js`)
- Ren HTML/CSS/JS – ingen build-steg
