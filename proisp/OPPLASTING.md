# Opplasting til ProISP (hjemmeområde)

Nettsiden ligger samlet i mappen **`web/`** i GitHub-repoet.  
Last opp **innholdet** av `web/` til ProISP — ikke hele git-repoet.

## Hvor på ProISP?

Typisk webrot:

```text
/home/BRUKERNAVN/public_html/
```

Anbefalt undermappe (egen URL-sti):

```text
public_html/astroclock/
```

Da blir adressen omtrent:

```text
https://DITTDOMENE.no/astroclock/
```

eller (avhengig av ProISP-oppsett):

```text
https://BRUKERNAVN.proisp.no/astroclock/
```

Last opp filene **flat** inn i `astroclock/` (samme nivå som `index.html`).

---

## Hva du laster opp

Fra GitHub-repoet: mappen **`web/`**

```text
web/
  astronomy.browser.min.js
  index.html
  main.js
  prophecies.js
  style.css
```

I FTP: åpne `web/` lokalt / i repoet, marker alle 5 filer, last opp til `public_html/astroclock/`.

**Sortert alfabetisk (kryss av):**

```text
astronomy.browser.min.js
index.html
main.js
prophecies.js
style.css
```

Uten `astronomy.browser.min.js` viser klokken feilmelding om at biblioteket ikke er lastet.

---

## Filer du IKKE laster opp til ProISP

| Fil / mappe | Hvorfor |
|-------------|---------|
| `proisp/` | Kun veiledning |
| `install-kantine.*` | Lokal Windows-kantine |
| `README.md`, `astroclock.md` | Dokumentasjon |
| `astronomy.min.js` | Brukes ikke av siden |
| `.git/` | Versjonskontroll |

---

## Slik laster du opp (kort)

1. Logg inn i ProISP (kontrollpanel eller FTP/SFTP).
2. Lag mappen `public_html/astroclock` om den mangler.
3. Last opp **alle filer fra `web/`** dit.
4. Åpne nettadressen og hard-refresh (`Ctrl+F5`) ved behov.

### FTP-tips

- Binær/auto-modus for `.js`-filer
- Små bokstaver i filnavn (Linux er case-sensitiv)
- `index.html` må ligge i mappen du åpner i nettleseren

---

## Etter opplasting – sjekkliste

- [ ] Siden åpner uten 404
- [ ] Planeter vises på lerretet
- [ ] Ingen feilmelding om Astronomy Engine
- [ ] Profetier og «Lagre fødselshoroskop» virker

### Fødselshoroskop

Lagres i nettleserens `localStorage` hos brukeren — ikke som filer på ProISP.  
Backup: **Eksporter** / **Importer** JSON i appen.

---

## Oppdatere senere

1. Trekk siste kode fra GitHub (`git pull`) eller last ned ZIP.
2. Last opp endrede filer fra `web/` på nytt (ofte `main.js`, `style.css`, `index.html`, `prophecies.js`).

---

## Relatert

- GitHub: https://github.com/Lars1001/astroclock  
- Lokal kantine: `install-kantine.ps1` (serverer mappen `web/`)
