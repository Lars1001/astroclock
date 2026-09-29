# Astrologiklokke

2D-visualisering av solsystemet med planeter som visere, aspektlinjer, natalprofiler og transittsammendrag.

## Funksjoner

- Sol- eller jordsentrert klokke med realtime / hastighetsstyring
- Hover-info for planeter og aspekter (orb + kort tolkning)
- Nataler (opptil 3) lagret i `localStorage`, med geokoding og eksport/import
- Analysepanel med topp transitt→natal-aspekter

## Kjør lokalt

Åpne `index.html` via en lokal webserver (anbefalt pga. modul/fetch):

```bash
npx serve .
```

eller

```bash
python -m http.server 8080
```

Deretter åpne `http://localhost:8080` i nettleseren.

## Teknisk

- [Astronomy Engine](https://github.com/cosinekitty/astronomy) (`astronomy.browser.min.js`)
- Ren HTML/CSS/JS – ingen build-steg
