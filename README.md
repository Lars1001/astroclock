# Astrologiklokke

2D-visualisering av solsystemet med planeter som visere, aspektlinjer, natalprofiler, profetier og transittsammendrag.

**GitHub:** https://github.com/Lars1001/astroclock

## Mappe `web/` (det du publiserer)

Alle filer som skal på nett ligger i **[`web/`](web/)**:

```text
web/
  index.html
  style.css
  main.js
  prophecies.js
  astronomy.browser.min.js
```

## Hosting på ProISP (hjemmeområde)

Se [`proisp/OPPLASTING.md`](proisp/OPPLASTING.md).

Kort: last opp **innholdet av `web/`** til `public_html/astroclock/`.

## Installasjon på kantine-PC (Windows)

1. Last ned repoet, eller:

```powershell
git clone https://github.com/Lars1001/astroclock.git
cd astroclock
powershell -ExecutionPolicy Bypass -File .\install-kantine.ps1
```

2. Eller dobbeltklikk `install-kantine.bat`.

Scriptet kloner til `%USERPROFILE%\astroclock`, lager snarvei og starter server fra mappen **`web/`** på **http://localhost:8080**.

## Fødselshoroskop – lagring

- **Lagre fødselshoroskop** → huskes i nettleseren etter omstart
- Ved lagring beregnes også planetposisjoner (horoskop-snapshot)
- **Eksporter** / **Importer** JSON for backup

## Kjør lokalt (utvikling)

```bash
cd web
python -m http.server 8080
```

Åpne `http://localhost:8080`.

## Teknisk

- [Astronomy Engine](https://github.com/cosinekitty/astronomy)
- Ren HTML/CSS/JS – ingen build-steg
