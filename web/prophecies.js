/**
 * Kuratert oversikt over omtalte profetier / syn.
 * Merk: Mange Vanga- og Nostradamus-tilskrivelser er usikre eller etterpåkloke.
 * Valdres-stoffet bygger på Emanuel Minos' egen gjenfortelling av møtet med Gunhilda Smelhus (1968).
 */
const PROPHECY_SOURCES = [
  { id: 'all', label: 'Alle kilder' },
  { id: 'minos', label: 'Minos / Valdres' },
  { id: 'vanga', label: 'Baba Vanga' },
  { id: 'nostradamus', label: 'Nostradamus' }
];

const PROPHECIES = [
  // ——— Emanuel Minos / Gunhilda Smelhus (Valdres) ———
  {
    id: 'minos-meeting-1968',
    source: 'minos',
    title: 'Møtet i Bruflat / Etnedal (Valdres)',
    date: '1968-06-01',
    dateLabel: 'juni 1968 (ca.)',
    kind: 'documented',
    summary:
      'Pinsepredikanten Emanuel Minos møter den ca. 92 år gamle enken Gunhilda Smelhus etter et møte i Valdres. Hun ber ham skrive ned et syn om tiden før Jesu gjenkomst og en tredje verdenskrig. Minos legger notatet bort i mange år.',
    detail:
      'Ifølge Minos selv fant han papiret igjen rundt 1993 og begynte da å omtale synet offentlig fordi flere punkter etter hans syn allerede så ut til å stemme. Synet beskrives ofte i fire «bølger».',
    tags: ['dokumentert møte', 'Norge', '1968']
  },
  {
    id: 'minos-wave-peace',
    source: 'minos',
    title: '1. bølge: Fred og nedrustning',
    date: '1989-11-09',
    dateLabel: 'fra slutten av Den kalde krigen (ca.)',
    kind: 'claimed',
    summary:
      'Synet: lang fredsperiode mellom stormaktene, langsiktige planer, nedrustning — Norge «uforberedt som 9. april 1940».',
    detail:
      'Ofte knyttet til glasnost/Berlinmurens fall og etterkrigstidens avspenningsfortelling. Åpen for tolkning; ikke en nøyaktig datert spådom.',
    tags: ['fred', 'nedrustning', 'påstått oppfylt']
  },
  {
    id: 'minos-wave-faith',
    source: 'minos',
    title: '2. bølge: Frafall fra kristen tro',
    date: '1990-01-01',
    dateLabel: 'pågående (fra ca. 1970–)',
    kind: 'claimed',
    summary:
      'Synet: stort frafall fra «sann og ekte kristendom», lunkenhet, lite interesse for synd, nåde og evangelium.',
    detail:
      'Brukes ofte som beskrivelse av sekularisering i Skandinavia. Status: «påstått delvis oppfylt» i Minos-tradisjonen.',
    tags: ['tro', 'frafall', 'påstått oppfylt']
  },
  {
    id: 'minos-wave-moral',
    source: 'minos',
    title: '3. bølge: Moralsk forfall og media',
    date: '2000-01-01',
    dateLabel: 'pågående (TV/internett-alderen)',
    kind: 'claimed',
    summary:
      'Synet: grovt moralsk forfall, vold og seksualitet synlig i media slik at «det som var skjult blir åpent».',
    detail:
      'Typisk knyttet til TV, pornoindustri og senere internett. Vurderes subjektivt.',
    tags: ['moral', 'media', 'påstått oppfylt']
  },
  {
    id: 'minos-wave-migration',
    source: 'minos',
    title: '4. bølge: Folkevandring, hardhet — deretter krig',
    date: '2015-09-01',
    dateLabel: 'åpen / fremtidig klimaks',
    kind: 'open',
    summary:
      'Synet: mennesker fra fattige land strømmer til Europa/Skandinavia/Norge; etter hvert hardhet mot dem. Når «målet er fullt» bryter en kort, intens krig ut (inkl. atomvåpen og forgiftet luft/vann).',
    detail:
      'Minos skal ha protestert mot flyktningpunktet i 1968 fordi det virket utenkelig. Klimaks (3. verdenskrig) beskrives som fremtidig og er ikke datert. Behandles her som åpen/uavklart.',
    tags: ['migrasjon', 'krig', 'åpen']
  },
  {
    id: 'minos-rediscovery-1993',
    source: 'minos',
    title: 'Minos gjenfinner notatet',
    date: '1993-01-01',
    dateLabel: 'ca. 1993',
    kind: 'documented',
    summary:
      'Etter flere tiår i skuffen leser Minos synet på nytt og begynner å fortelle om det i møter (bl.a. omtalt i Sverige/Norge).',
    detail:
      'Dette er et historisk vendepunkt for spredningen av Valdres-profetien — ikke selve synet.',
    tags: ['dokumentert', 'formidling']
  },

  // ——— Baba Vanga (Bulgaria) ———
  {
    id: 'vanga-life',
    source: 'vanga',
    title: 'Baba Vanga (Vangelija Gušterova)',
    date: '1911-10-03',
    dateLabel: '1911–1996',
    endDate: '1996-08-11',
    kind: 'documented',
    summary:
      'Bulgarsk seer/healerske, blind fra ungdommen, knyttet til Rupite. Ingen sikre samtidige skriftlige protokollsamlinger av «årlige» spådommer.',
    detail:
      'Mange «Vanga-profetier» på nett er etter-konstruerte. Nære kilder har også benektet flere katastrofe-påstander. Brukes her med forbehold.',
    tags: ['biografi', 'Bulgaria']
  },
  {
    id: 'vanga-attr-ww2',
    source: 'vanga',
    title: 'Tilskrevet: 2. verdenskrig',
    date: '1939-09-01',
    dateLabel: '1939',
    kind: 'attributed',
    summary: 'Følgere hevder hun forutså krigens utbrudd; vanskelig å verifisere som samtidig dokumentert spådom.',
    tags: ['tilskrevet', 'krig']
  },
  {
    id: 'vanga-attr-ussr',
    source: 'vanga',
    title: 'Tilskrevet: Sovjetunionens oppløsning',
    date: '1991-12-26',
    dateLabel: '1991',
    kind: 'attributed',
    summary: 'Ofte listet blant «oppfylte» Vanga-påstander i populærkultur.',
    tags: ['tilskrevet', 'geopolitikk']
  },
  {
    id: 'vanga-attr-kursk',
    source: 'vanga',
    title: 'Tilskrevet: Kursk-ubåten',
    date: '2000-08-12',
    dateLabel: '2000',
    kind: 'attributed',
    summary: 'Russisk populærfortelling kobler Vanga til forlis av Kursk (etter hennes død i 1996).',
    tags: ['tilskrevet', 'Russland']
  },
  {
    id: 'vanga-attr-911',
    source: 'vanga',
    title: 'Tilskrevet: 11. september 2001',
    date: '2001-09-11',
    dateLabel: '2001',
    kind: 'attributed',
    summary: 'Utbredt nettpåstand; mangler pålitelig forhåndsdokumentasjon.',
    tags: ['tilskrevet', 'USA']
  },
  {
    id: 'vanga-attr-obama',
    source: 'vanga',
    title: 'Tilskrevet: afroamerikansk US-president',
    date: '2008-11-04',
    dateLabel: '2008',
    kind: 'attributed',
    summary: 'Ofte knyttet til Obama. En variant om «siste president» ble motbevist.',
    tags: ['tilskrevet', 'USA']
  },
  {
    id: 'vanga-false-nuke',
    source: 'vanga',
    title: 'Tilskrevet (motbevist): atomkrig 2010–2016',
    date: '2010-01-01',
    dateLabel: '2010–2016',
    endDate: '2016-12-31',
    kind: 'false',
    summary: 'Nettpåstander om atomkrig og «Europa forlatt» i denne perioden slo ikke til.',
    tags: ['motbevist', 'krig']
  },
  {
    id: 'vanga-open-future',
    source: 'vanga',
    title: 'Åpne / spekulative fremtidstilskrivninger',
    date: '2026-01-01',
    dateLabel: '2020-tallet →',
    kind: 'open',
    summary:
      'Løpende tabloid-/sosiale-medier-påstander (krig, klima, «kontakt», osv.) uten solid kildegrunnlag.',
    detail:
      'Behandles som spekulasjon. Appen viser dem for å skille dokumentert historie fra rykter.',
    tags: ['spekulativt', 'åpen']
  },

  // ——— Nostradamus ———
  {
    id: 'nost-life',
    source: 'nostradamus',
    title: 'Michel de Nostredame',
    date: '1503-12-14',
    dateLabel: '1503–1566',
    endDate: '1566-07-02',
    kind: 'documented',
    summary:
      'Fransk astrolog/lege; Les Prophéties (centurier med kvad). Tekstene er kryptiske og åpne for mange tolkninger.',
    tags: ['biografi', 'Frankrike']
  },
  {
    id: 'nost-london-1666',
    source: 'nostradamus',
    title: 'Tolkning: Londons store brann',
    date: '1666-09-02',
    dateLabel: '1666',
    kind: 'interpretation',
    summary:
      'Populær lesning av kvad om «brenning» / «tre ganger tyve og seks» knyttet til Great Fire of London.',
    detail: 'Klassisk etterpå-tolkning; ikke en eksplisitt datert spådom i moderne forstand.',
    tags: ['tolkning', 'London']
  },
  {
    id: 'nost-revolution-1789',
    source: 'nostradamus',
    title: 'Tolkning: Den franske revolusjon',
    date: '1789-07-14',
    dateLabel: '1789',
    kind: 'interpretation',
    summary: 'Kvad om kaos i Frankrike/konge ofte knyttet til revolusjonen.',
    tags: ['tolkning', 'Frankrike']
  },
  {
    id: 'nost-napoleon',
    source: 'nostradamus',
    title: 'Tolkning: Napoleon',
    date: '1804-12-02',
    dateLabel: 'ca. 1799–1815',
    kind: 'interpretation',
    summary: '«Italiensk» keiser / europeisk erobrer — hyppig tolket som Napoleon.',
    tags: ['tolkning', 'Napoleon']
  },
  {
    id: 'nost-hister',
    source: 'nostradamus',
    title: 'Tolkning: «Hister» / 2. verdenskrig',
    date: '1939-09-01',
    dateLabel: '1939–1945',
    endDate: '1945-05-08',
    kind: 'interpretation',
    summary:
      'Ordet «Hister» (ofte elv/Donau-kontekst) er populært knyttet til Hitler — omstridt filologisk.',
    tags: ['tolkning', 'krig']
  },
  {
    id: 'nost-open',
    source: 'nostradamus',
    title: 'Åpne kvad / moderne spekulasjoner',
    date: '2030-01-01',
    dateLabel: 'uavklart fremtid',
    kind: 'open',
    summary:
      'Uendelige moderne «oppfyllelser» (terror, klima, ledere) lages fortsatt. Appen behandler dem som spekulasjon.',
    tags: ['spekulativt', 'åpen']
  }
];

const PROPHECY_KIND_LABEL = {
  documented: 'Dokumentert',
  claimed: 'Påstått oppfylt',
  attributed: 'Tilskrevet',
  interpretation: 'Tolkning',
  false: 'Motbevist',
  open: 'Åpen / fremtid'
};
