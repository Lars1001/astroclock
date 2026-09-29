/*
  Astrologiklokke 2D – forenklet visualisering
  - Bruker Astronomy Engine for solsystem-posisjoner (geosentrisk ekliptisk lengde)
  - Viser planeter som visere på en sirkel med Solen i midten
  - Meny: hus, husnummer, ascendant (forenklet), dato-velger, hastighet
*/

// Konfigurasjon
const BODIES = [
  { key: 'Sun', name: 'Solen', color: '#ffd27f' },
  { key: 'Mercury', name: 'Merkur', color: '#b4e0ff' },
  { key: 'Venus', name: 'Venus', color: '#ffd6a6' },
  { key: 'Earth', name: 'Jorden', color: '#8fd0ff' },
  { key: 'Mars', name: 'Mars', color: '#ff6b6b' },
  { key: 'Jupiter', name: 'Jupiter', color: '#ffd27f' },
  { key: 'Saturn', name: 'Saturn', color: '#ffe4a6' },
  { key: 'Uranus', name: 'Uranus', color: '#a7f0ff' },
  { key: 'Neptune', name: 'Neptun', color: '#88b3ff' },
  { key: 'Pluto', name: 'Pluto', color: '#c8b1ff' }
];

const RING_CONFIG = {
  outerPadding: 20,
  planetRadius: 8,
  houseTickLength: 14,
  houseNumberOffset: 26
};

// DOM elementer
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const tooltip = document.getElementById('tooltip');
const dateInput = document.getElementById('dateInput');
const nowBtn = document.getElementById('nowBtn');
const speedRange = document.getElementById('speedRange');
const speedLabel = document.getElementById('speedLabel');
const toggleHouses = document.getElementById('toggleHouses');
const toggleHouseNumbers = document.getElementById('toggleHouseNumbers');
const toggleAsc = document.getElementById('toggleAsc');
const playPauseBtn = document.getElementById('playPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const planetLegend = document.getElementById('planetLegend');
const centerSelect = document.getElementById('centerSelect');
const logContainer = document.getElementById('logContainer');
const clearLogBtn = document.getElementById('clearLogBtn');
const toggleZodiac = document.getElementById('toggleZodiac');
const toggleZodiacSymbols = document.getElementById('toggleZodiacSymbols');
const toggleAspects = document.getElementById('toggleAspects');
const eventListEl = document.getElementById('eventList');
const profileSelect = document.getElementById('profileSelect');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const deleteProfileBtn = document.getElementById('deleteProfileBtn');
const profName = document.getElementById('profName');
const profDob = document.getElementById('profDob');
const profLat = document.getElementById('profLat');
const profLon = document.getElementById('profLon');
// Natal skjema
const natalEls = [0,1,2].map(i => ({
  name: document.getElementById(`n${i}_name`),
  date: document.getElementById(`n${i}_date`),
  time: document.getElementById(`n${i}_time`),
  unknown: document.getElementById(`n${i}_unknown`),
  place: document.getElementById(`n${i}_place`),
  geocodeBtn: document.getElementById(`n${i}_geocode`),
  results: document.getElementById(`n${i}_results`),
  lat: document.getElementById(`n${i}_lat`),
  lon: document.getElementById(`n${i}_lon`),
  tz: document.getElementById(`n${i}_tz`)
}));
const intervalSelect = document.getElementById('intervalSelect');
const customInterval = document.getElementById('customInterval');
const customStart = document.getElementById('customStart');
const customEnd = document.getElementById('customEnd');
const liveNow = document.getElementById('liveNow');
const viewSummary = document.getElementById('viewSummary');
const viewEvents = document.getElementById('viewEvents');
const analysisPanel = document.getElementById('analysisPanel');
const saveNatalsBtn = document.getElementById('saveNatalsBtn');
const clearNatalsBtn = document.getElementById('clearNatalsBtn');
const exportNatalsBtn = document.getElementById('exportNatalsBtn');
const importNatalsBtn = document.getElementById('importNatalsBtn');
const importNatalsFile = document.getElementById('importNatalsFile');

// ----------------- Transit/natal helpers -----------------
const TRANSIT_BODIES = [
  { id: 'Sun', name: 'Solen' },
  { id: 'Moon', name: 'Månen' },
  { id: 'Mercury', name: 'Merkur' },
  { id: 'Venus', name: 'Venus' },
  { id: 'Mars', name: 'Mars' },
  { id: 'Jupiter', name: 'Jupiter' },
  { id: 'Saturn', name: 'Saturn' },
  { id: 'Uranus', name: 'Uranus' },
  { id: 'Neptune', name: 'Neptun' },
  { id: 'Pluto', name: 'Pluto' }
];

function getGeoEclipticLongitude(date, bodyId) {
  const time = Astronomy.MakeTime(date);
  if (bodyId === 'Moon' && Astronomy.EclipticGeoMoon) {
    const m = Astronomy.EclipticGeoMoon(time);
    return normalizeAngleDegrees(m.elon);
  }
  try {
    const gv = Astronomy.GeoVector(bodyId, time, false);
    const ecl = Astronomy.Ecliptic(gv);
    return normalizeAngleDegrees(ecl.elon);
  } catch (e) {
    // Fallback: 0°
    return 0;
  }
}

function computeGeoLongitudesForBodies(date) {
  const result = {};
  for (const b of TRANSIT_BODIES) {
    result[b.id] = getGeoEclipticLongitude(date, b.id);
  }
  return result;
}

function parseNatalDateTime(n) {
  // Bygg Date fra felter. Dersom tid ukjent → bruk 12:00 lokal.
  if (!n || !n.date) return null;
  const timePart = n.unknown || !n.time ? '12:00' : n.time;
  // Ignorer tz-streng i denne første versjonen; antas lokal tid
  const iso = `${n.date}T${timePart}:00`;
  const dt = new Date(iso);
  if (isNaN(dt.getTime())) return null;
  return dt;
}

function computeNatalLongitudes(n) {
  const dt = parseNatalDateTime(n);
  if (!dt) return null;
  const longs = computeGeoLongitudesForBodies(dt);
  return longs;
}

const ASPECTS_DEF = [
  { angle: 0, name: 'Konjunksjon', key: 'conj', orb: 8, color: '#22c55e' },
  { angle: 60, name: 'Sekstil', key: 'sextile', orb: 4, color: '#3b82f6' },
  { angle: 90, name: 'Kvadrat', key: 'square', orb: 6, color: '#ef4444' },
  { angle: 120, name: 'Trigon', key: 'trine', orb: 6, color: '#22c55e' },
  { angle: 180, name: 'Opposisjon', key: 'opp', orb: 8, color: '#f59e0b' }
];

const ASPECT_MEANINGS = {
  conj: 'Kraftig fokus; sammensmelting av energier.',
  sextile: 'Mulighet og flyt; lett å samarbeide.',
  square: 'Spenningsfelt; behov for handling.',
  trine: 'Harmoni og støtte; ting glir lettere.',
  opp: 'Polaritet; bevisstgjøring og balanse.'
};

const PLANET_MEANINGS = {
  Sun: 'Identitet, vitalitet og livskraft.',
  Moon: 'Følelser, instinkt og døgnrytme.',
  Mercury: 'Tenkning, kommunikasjon og bevegelse.',
  Venus: 'Verdier, tiltrekning og harmoni.',
  Mars: 'Drive, vilje og konflikthåndtering.',
  Jupiter: 'Vekst, mening og ekspansjon.',
  Saturn: 'Struktur, grenser og ansvar.',
  Uranus: 'Brudd, nyskapning og frihet.',
  Neptune: 'Intuisjon, drømmer og oppløsning.',
  Pluto: 'Transformasjon, makt og dyp fornyelse.',
  Earth: 'Jordisk perspektiv og forankring.'
};

const PLANET_SYMBOLS = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇', Earth: '♁'
};

/** Aktive aspekter denne rammen – brukes for dedupe av hendelseslogg */
const activeAspectKeys = new Set();
let hoverAspect = null;

function smallestAngleDiff(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function findAspectBetweenAngles(a1, a2) {
  const adiff = smallestAngleDiff(a1, a2);
  for (const asp of ASPECTS_DEF) {
    const delta = Math.abs(adiff - asp.angle);
    if (delta <= asp.orb) {
      return { aspect: asp, orb: delta, strength: asp.orb - delta };
    }
  }
  return null;
}

function collectPlanetAspects(planetScreenPositions) {
  const found = [];
  for (let i = 0; i < planetScreenPositions.length; i++) {
    for (let j = i + 1; j < planetScreenPositions.length; j++) {
      const hit = findAspectBetweenAngles(
        planetScreenPositions[i].angle,
        planetScreenPositions[j].angle
      );
      if (!hit) continue;
      found.push({
        i, j,
        a: planetScreenPositions[i],
        b: planetScreenPositions[j],
        ...hit
      });
    }
  }
  return found;
}

function findTransitAspects(transitLongs, natalLongs, natalName) {
  const results = [];
  for (const tb of TRANSIT_BODIES) {
    const tLon = transitLongs[tb.id];
    if (typeof tLon !== 'number') continue;
    for (const nb of TRANSIT_BODIES) { // samme sett for natal
      const nLon = natalLongs[nb.id];
      if (typeof nLon !== 'number') continue;
      const diff = smallestAngleDiff(tLon, nLon);
      for (const asp of ASPECTS_DEF) {
        const delta = Math.abs(diff - asp.angle);
        if (delta <= asp.orb) {
          const strength = asp.orb - delta; // høyere er sterkere
          results.push({
            natalName,
            transBody: tb.id,
            natalBody: nb.id,
            aspect: asp,
            orb: delta,
            strength,
            tLon,
            nLon
          });
        }
      }
    }
  }
  return results;
}

let lastSummaryComputeMs = 0;

const ZODIAC = [
  { name: 'Væren', symbol: '♈︎' },
  { name: 'Tyren', symbol: '♉︎' },
  { name: 'Tvillingene', symbol: '♊︎' },
  { name: 'Krepsen', symbol: '♋︎' },
  { name: 'Løven', symbol: '♌︎' },
  { name: 'Jomfruen', symbol: '♍︎' },
  { name: 'Vekten', symbol: '♎︎' },
  { name: 'Skorpionen', symbol: '♏︎' },
  { name: 'Skytten', symbol: '♐︎' },
  { name: 'Steinbukken', symbol: '♑︎' },
  { name: 'Vannmannen', symbol: '♒︎' },
  { name: 'Fiskene', symbol: '♓︎' }
];

// Tilstand
let isRunning = true;
let virtualTime = new Date();
let speedMultiplier = 1; // 1x realtime (styres av log10-slider -4..4)
let devicePixelRatioCache = window.devicePixelRatio || 1;
let hoverPlanet = null;
let mouseX = 0;
let mouseY = 0;
let centerBody = 'Sun'; // 'Sun' eller 'Earth'
const lastEventAngles = {};

function crossedSign(prev, curr) {
  const p = normalizeAngleDegrees(prev);
  const c = normalizeAngleDegrees(curr);
  const pSign = Math.floor(p / 30);
  const cSign = Math.floor(c / 30);
  return pSign !== cSign;
}

// Enkel logger til UI
const LOG_MAX_LINES = 300;
const DEBUG_LOG = false; // sett true ved feilsøking
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function log(message, level = 'info') {
  if (!logContainer) return;
  const line = document.createElement('div');
  line.className = `log-line ${level}`;
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const ts = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  line.innerHTML = `<span class="ts">[${ts}]</span> ${escapeHtml(message)}`;
  logContainer.appendChild(line);
  while (logContainer.children.length > LOG_MAX_LINES) {
    logContainer.removeChild(logContainer.firstChild);
  }
  logContainer.scrollTop = logContainer.scrollHeight;
}

function debugLog(message) {
  if (DEBUG_LOG) log(message, 'info');
}

function logError(err, context = '') {
  const msg = err && err.stack ? err.stack : (err && err.message ? err.message : String(err));
  log(`${context ? context + ': ' : ''}${msg}`.slice(0, 2000), 'error');
}

// Hendelser (astrologiske)
function addEvent(message, tag = '') {
  if (!eventListEl) return;
  const line = document.createElement('div');
  line.className = 'event-item';
  const now = new Date(virtualTime.getTime());
  const pad = (n) => String(n).padStart(2, '0');
  const ts = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  line.innerHTML = `<span class="ts">[${ts}]</span> ${escapeHtml(message)}${tag ? ` <span class="tag">${escapeHtml(tag)}</span>` : ''}`;
  eventListEl.appendChild(line);
  eventListEl.scrollTop = eventListEl.scrollHeight;
  // Speil viktige hendelser i analysepanel om aktivert
  if (viewEvents && viewEvents.checked && analysisPanel) {
    const clone = line.cloneNode(true);
    analysisPanel.appendChild(clone);
    analysisPanel.scrollTop = analysisPanel.scrollHeight;
  }
}

if (clearLogBtn) {
  clearLogBtn.addEventListener('click', () => {
    if (logContainer) logContainer.innerHTML = '';
  });
}

// Global feillogging
window.addEventListener('error', (ev) => {
  logError(ev.error || ev.message || 'Ukjent feil', 'Ubehandlet feil');
});
window.addEventListener('unhandledrejection', (ev) => {
  logError(ev.reason || 'Ukjent avvist promise', 'Ubehandlet promise');
});

// Laster bibliotek med fallback-CDNer ved behov
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = false; // Synkron lasting for bedre feilhåndtering
    s.onload = () => {
      // Vent litt for at biblioteket skal initialisere
      setTimeout(() => {
        if (typeof Astronomy !== 'undefined') {
          resolve(src);
        } else {
          reject(new Error(`Astronomy ikke tilgjengelig etter lasting fra: ${src}`));
        }
      }, 100);
    };
    s.onerror = () => reject(new Error(`Kunne ikke laste: ${src}`));
    document.head.appendChild(s);
  });
}

async function ensureAstronomyLoaded() {
  if (typeof Astronomy !== 'undefined') return 'eksisterende';
  
  // Prøv først lokal fil med en annen tilnærming
  try {
    log('Prøver å laste lokal astronomy.browser.min.js', 'info');
    const response = await fetch('./astronomy.browser.min.js');
    if (response.ok) {
      const scriptText = await response.text();
      const script = document.createElement('script');
      script.textContent = scriptText;
      document.head.appendChild(script);
      if (typeof Astronomy !== 'undefined') {
        log('Lokal astronomy.min.js lastet', 'info');
        return 'lokal fil';
      }
    }
  } catch (err) {
    logError(err, 'Lokal lasting feilet');
  }
  
  // Fallback til CDNer
  const sources = [
    'https://unpkg.com/astronomy-engine@2.1.18/astronomy.min.js',
    'https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.18/astronomy.min.js'
  ];
  let lastErr = null;
  for (const src of sources) {
    try {
      log(`Laster Astronomy Engine fra ${src}`, 'info');
      await loadScript(src);
      return src;
    } catch (err) {
      lastErr = err;
      logError(err, 'CDN lasting feilet');
    }
  }
  throw lastErr || new Error('Fant ingen fungerende kilde for Astronomy Engine');
}

function setCanvasSize() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}

function layout() {
  // Fyll hele hovedområdet
  const main = document.querySelector('main.stage');
  const { width, height } = main.getBoundingClientRect();
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  setCanvasSize();
}

window.addEventListener('resize', layout);
layout();

// Legg til legende
function getVisibleBodies() {
  return BODIES.filter((b) => b.key !== centerBody);
}

function renderLegend() {
  planetLegend.innerHTML = '';
  getVisibleBodies().forEach((p) => {
    const li = document.createElement('li');
    const sw = document.createElement('span');
    sw.className = 'swatch';
    sw.style.background = p.color;
    const label = document.createElement('span');
    label.textContent = p.name;
    li.appendChild(sw);
    li.appendChild(label);
    planetLegend.appendChild(li);
  });
}
renderLegend();

// Hjelpefunksjoner
function degToRad(deg) { return (deg * Math.PI) / 180; }
function radToDeg(rad) { return (rad * 180) / Math.PI; }

function normalizeAngleDegrees(angle) {
  let a = angle % 360;
  if (a < 0) a += 360;
  return a;
}

function formatTime(dt) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
}

// Forenklet ascendant: vi bruker lokal siderisk vinkel ~ GMST + lengdegrad, og ekliptisk helling.
// Dette er en grov tilnærming og ikke egnet for nøyaktig astrologi.
function computeApproxAscendantDegrees(date, latitudeDeg = 59.9139, longitudeDeg = 10.7522) { // Oslo default
  const tt = Astronomy.MakeTime(date);
  const gmstHours = Astronomy.SiderealTime(tt); // timer
  const gmstDeg = gmstHours * 15.0; // 15° per time
  const lst = normalizeAngleDegrees(gmstDeg + longitudeDeg);
  const obliq = 23.44; // fast verdi (unngår API-avhengighet)
  // Ascendant tilnærming: tan(lambda) = 1/(cos(epsilon)) * ( -cos(LST) / (sin(LST) * cos(phi) + tan(delta) * sin(phi) ) )
  // Vi forenkler kraftig: anta deklinasjon ~ 0 og få lambda ~ arctan2( -cos(LST), sin(LST)*cos(phi) ) transformert til ekliptisk lengde.
  const phi = degToRad(latitudeDeg);
  const lstRad = degToRad(lst);
  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(phi);
  let lambda = Math.atan2(y, x); // i ekvatorial projeksjon
  let ascDeg = normalizeAngleDegrees(radToDeg(lambda));
  ascDeg = normalizeAngleDegrees(ascDeg - (obliq - 23.44) * 0.5);
  return ascDeg;
}

function getAngleAndDistance(date, bodyKey) {
  const time = Astronomy.MakeTime(date);

  if (centerBody === 'Earth') {
    // Geosentrisk ekliptisk vektor direkte
    if (Astronomy.EclipticGeoVector) {
    const v = Astronomy.EclipticGeoVector(bodyKey, time); // AU, ekliptisk
    const angle = normalizeAngleDegrees(radToDeg(Math.atan2(v.y, v.x)));
      const dist = Math.hypot(v.x, v.y, v.z);
      return { angle, dist };
    }
    // Fallback: differanse av heliovektorer (planet - Earth) i ekvatorial plan
    const vp = Astronomy.HelioVector(bodyKey, time);
    const ve = Astronomy.HelioVector('Earth', time);
    const dx = vp.x - ve.x;
    const dy = vp.y - ve.y;
    const dz = vp.z - ve.z;
    const angle = normalizeAngleDegrees(radToDeg(Math.atan2(dy, dx)));
    const dist = Math.hypot(dx, dy, dz);
    return { angle, dist };
  } else {
    // Sol i sentrum: heliosentrisk vektor
    const v = Astronomy.HelioVector(bodyKey, time);
    const angle = normalizeAngleDegrees(radToDeg(Math.atan2(v.y, v.x)));
    const dist = Math.hypot(v.x, v.y, v.z);
    return { angle, dist };
  }
}

function computePlanetData(date) {
  const data = [];
  debugLog(`Beregner planeter for ${formatTime(date)}`);
  for (const p of getVisibleBodies()) {
    try {
      const { angle, dist } = getAngleAndDistance(date, p.key);
      data.push({ key: p.key, name: p.name, color: p.color, angle, dist });
      debugLog(`${p.name}: ${angle.toFixed(1)}°, dist: ${dist.toFixed(3)} AU`);
    } catch (err) {
      console.warn('Feil ved beregning for', p, err);
      logError(err, `Feil ved beregning for ${p.key}`);
    }
  }
  debugLog(`Beregnet ${data.length} planeter`);
  // Enkle hendelser: tegnskifte (hver 30°)
  // Bare oppdag hendelser når animasjonen faktisk går
  if (isRunning && Math.abs(speedMultiplier) > 1e-9) {
    try {
      for (const p of data) {
        const prevAngle = lastEventAngles[p.key];
        if (typeof prevAngle === 'number') {
          const crossed = crossedSign(prevAngle, p.angle);
          if (crossed) {
            const signIndex = Math.floor(normalizeAngleDegrees(p.angle) / 30) % 12;
            addEvent(`${p.name} inn i ${ZODIAC[signIndex].name}`, 'Tegnskifte');
          }
        }
        lastEventAngles[p.key] = p.angle;
      }
    } catch (e) {
      // Ignorer event-feil
    }
  }
  return data;
}

// Tegning
function drawScene(date) {
  // Hvis Astronomy ikke er lastet, vis melding
  if (typeof Astronomy === 'undefined') {
    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.fillStyle = '#ff9090';
    ctx.font = '14px system-ui, Segoe UI, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Astronomy Engine ble ikke lastet.', 0, 0);
    ctx.fillStyle = '#cfe0ff';
    ctx.fillText('Sjekk nett/localhost og konsoll.', 0, 22);
    ctx.restore();
    return;
  }
  const { width, height } = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(cx, cy) - RING_CONFIG.outerPadding;

  // Bakgrunnsirkel
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = '#2a3f67';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Hus (12 like sektorer, 30° hver)
  if (toggleHouses.checked) {
    ctx.strokeStyle = '#1f2f52';
    ctx.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      const a = degToRad(i * 30);
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(x, y);
      ctx.stroke();
      // tick
      const tx1 = Math.cos(a) * (radius - RING_CONFIG.houseTickLength);
      const ty1 = Math.sin(a) * (radius - RING_CONFIG.houseTickLength);
      ctx.beginPath();
      ctx.moveTo(tx1, ty1);
      ctx.lineTo(x, y);
      ctx.stroke();

      if (toggleHouseNumbers.checked) {
        const labelAngle = a + degToRad(15);
        const lx = Math.cos(labelAngle) * (radius - RING_CONFIG.houseNumberOffset);
        const ly = Math.sin(labelAngle) * (radius - RING_CONFIG.houseNumberOffset);
        ctx.fillStyle = '#9fb7e7';
        ctx.font = '12px system-ui, Segoe UI, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(i + 1), lx, ly);
      }
    }
  }

  // Stjernetegn (12 à 30°)
  if (toggleZodiac && toggleZodiac.checked) {
    ctx.save();
    ctx.fillStyle = '#bcd1ff';
    ctx.font = '12px system-ui, Segoe UI, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < 12; i++) {
      const mid = degToRad(i * 30 + 15);
      const rLabel = radius - (RING_CONFIG.houseNumberOffset + 6);
      const lx = Math.cos(mid) * rLabel;
      const ly = Math.sin(mid) * rLabel;
      const text = toggleZodiacSymbols && toggleZodiacSymbols.checked ? ZODIAC[i].symbol : ZODIAC[i].name;
      ctx.fillText(text, lx, ly);
    }
    ctx.restore();
  }

  // Forenklet ascendant
  if (toggleAsc.checked) {
    const asc = computeApproxAscendantDegrees(date);
    ctx.save();
    ctx.rotate(degToRad(asc));
    ctx.strokeStyle = '#58ffa1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(radius, 0);
    ctx.stroke();
    ctx.restore();
  }

  // Stjernetegn rundt ringen
  if (toggleZodiac.checked) {
    ctx.save();
    ctx.strokeStyle = '#244064';
    ctx.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      const a = degToRad(i * 30);
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Planeter
  const planetData = computePlanetData(date);

  // Radial plassering basert på relativ avstand (AU) -> skjermradius
  let minD = Infinity, maxD = -Infinity;
  for (const p of planetData) {
    if (p.dist < minD) minD = p.dist;
    if (p.dist > maxD) maxD = p.dist;
  }
  if (!isFinite(minD) || !isFinite(maxD) || minD === maxD) {
    minD = 0; maxD = 1; // fallback
  }
  const innerR = Math.max(20, radius * 0.35);
  const outerR = radius * 0.90; // litt margin så markører ikke havner utenfor

  // Hover-deteksjon
  hoverPlanet = null;
  hoverAspect = null;
  const planetScreenPositions = [];
  const mx = mouseX - cx;
  const my = mouseY - cy;

  for (const p of planetData) {
    const angleRad = degToRad(p.angle);
    const t = (p.dist - minD) / (maxD - minD);
    const pr = Math.min(outerR, innerR + t * (outerR - innerR));
    const px = Math.cos(angleRad) * pr;
    const py = Math.sin(angleRad) * pr;
    // Viktig: behold posisjoner i lokale koordinater (rundt 0,0) etter translate
    const len = Math.hypot(px, py) || 1;
    const markerLen = Math.min(len, outerR - RING_CONFIG.planetRadius - 1);
    const markerX = (px / len) * markerLen;
    const markerY = (py / len) * markerLen;
    planetScreenPositions.push({ ...p, r: pr, x: px, y: py, markerX, markerY });
  }

  const frameAspects = collectPlanetAspects(planetScreenPositions);
  const seenKeys = new Set();

  // Hit-test planeter først (før aspekter, så highlight fungerer)
  let bestPlanetDist = Infinity;
  for (const pos of planetScreenPositions) {
    const dx = mx - pos.markerX;
    const dy = my - pos.markerY;
    const d2 = dx * dx + dy * dy;
    const hitR = RING_CONFIG.planetRadius + 6;
    if (d2 <= hitR * hitR && d2 < bestPlanetDist) {
      bestPlanetDist = d2;
      hoverPlanet = pos;
    }
  }

  // Tegn aspekter (også når pauset) – logg kun når aspektet oppstår på nytt
  if (toggleAspects && toggleAspects.checked) {
    let bestLineDist = 6;
    ctx.save();
    for (const fa of frameAspects) {
      const key = [fa.a.key, fa.b.key, fa.aspect.key].sort().join('|');
      seenKeys.add(key);
      const involved =
        hoverPlanet && (hoverPlanet.key === fa.a.key || hoverPlanet.key === fa.b.key);
      const distToLine = distanceToSegment(mx, my, fa.a.markerX, fa.a.markerY, fa.b.markerX, fa.b.markerY);
      if (!hoverPlanet && distToLine < bestLineDist) {
        bestLineDist = distToLine;
        hoverAspect = fa;
      }

      const highlight = involved || hoverAspect === fa;
      ctx.lineWidth = highlight ? 2.5 : 1;
      ctx.strokeStyle = fa.aspect.color + (highlight ? 'cc' : '55');
      ctx.beginPath();
      ctx.moveTo(fa.a.markerX, fa.a.markerY);
      ctx.lineTo(fa.b.markerX, fa.b.markerY);
      ctx.stroke();

      // Logg kun første gang aspektet er innenfor orb (ikke hvert frame)
      if (isRunning && Math.abs(speedMultiplier) > 1e-9 && !activeAspectKeys.has(key)) {
        addEvent(
          `${fa.a.name} – ${fa.b.name}: ${fa.aspect.name} (orb ${fa.orb.toFixed(1)}°)`,
          'Aspekt'
        );
      }
    }
    ctx.restore();
  }

  // Oppdater aktive aspekter for dedupe (også når pause, så vi ikke spam-logger ved play)
  activeAspectKeys.clear();
  for (const k of seenKeys) activeAspectKeys.add(k);

  // Tegn visere og punkter
  for (const pos of planetScreenPositions) {
    const isHovered = hoverPlanet && hoverPlanet.key === pos.key;
    const linked = frameAspects.some(
      (fa) => hoverPlanet && (fa.a.key === hoverPlanet.key || fa.b.key === hoverPlanet.key) &&
        (fa.a.key === pos.key || fa.b.key === pos.key)
    );

    // viser
    ctx.save();
    ctx.strokeStyle = pos.color;
    ctx.globalAlpha = hoverPlanet && !isHovered && !linked ? 0.35 : 1;
    ctx.lineWidth = isHovered ? 3 : 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const vecLen = Math.hypot(pos.x, pos.y) || 1;
    const scaleToRadius = radius / vecLen;
    const clampedX = pos.x * Math.min(1, scaleToRadius);
    const clampedY = pos.y * Math.min(1, scaleToRadius);
    ctx.lineTo(clampedX, clampedY);
    ctx.stroke();
    ctx.restore();

    // planetmarkør
    ctx.save();
    ctx.globalAlpha = hoverPlanet && !isHovered && !linked ? 0.35 : 1;
    ctx.fillStyle = pos.color;
    ctx.shadowColor = pos.color;
    ctx.shadowBlur = isHovered ? 18 : 12;
    ctx.beginPath();
    const markerX = pos.markerX;
    const markerY = pos.markerY;
    const pr = RING_CONFIG.planetRadius + (isHovered ? 2 : 0);
    ctx.arc(markerX, markerY, pr, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = isHovered ? 2 : 1.5;
    ctx.strokeStyle = isHovered ? '#ffffff' : '#0a101c';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(PLANET_SYMBOLS[pos.key] || '•', markerX, markerY);
    ctx.restore();
  }

  // Senterlegeme markør
  ctx.save();
  if (centerBody === 'Sun') {
    ctx.fillStyle = '#ffd27f';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffb74a';
    ctx.stroke();
  } else {
    ctx.fillStyle = '#8fd0ff';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#5aa8ff';
    ctx.stroke();
  }
  ctx.restore();

  // Tittel
  ctx.fillStyle = '#cfe0ff';
  ctx.font = '13px system-ui, Segoe UI, Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`Tid: ${formatTime(date)}`, 0, radius + 24);

  ctx.restore();

  // Tooltip – rik planet-/aspektinfo
  updateTooltip(frameAspects);
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function updateTooltip(frameAspects) {
  if (!tooltip) return;

  if (hoverPlanet) {
    const angle = normalizeAngleDegrees(hoverPlanet.angle);
    const signIndex = Math.floor(angle / 30) % 12;
    const zod = ZODIAC[signIndex];
    const sym = PLANET_SYMBOLS[hoverPlanet.key] || '';
    const meaning = PLANET_MEANINGS[hoverPlanet.key] || '';
    const related = frameAspects
      .filter((fa) => fa.a.key === hoverPlanet.key || fa.b.key === hoverPlanet.key)
      .sort((a, b) => a.orb - b.orb);

    let aspectHtml = '';
    if (related.length) {
      aspectHtml = `<div class="tt-section"><div class="tt-label">Aspekter nå</div>` +
        related.map((fa) => {
          const other = fa.a.key === hoverPlanet.key ? fa.b : fa.a;
          const m = ASPECT_MEANINGS[fa.aspect.key] || '';
          return `<div class="tt-aspect" style="border-left-color:${fa.aspect.color}">
            <strong>${escapeHtml(fa.aspect.name)}</strong> → ${escapeHtml(other.name)}
            <span class="tt-orb">orb ${fa.orb.toFixed(1)}°</span>
            <div class="tt-meaning">${escapeHtml(m)}</div>
          </div>`;
        }).join('') + `</div>`;
    } else {
      aspectHtml = `<div class="tt-section tt-muted">Ingen aspekter innenfor orb</div>`;
    }

    tooltip.style.display = 'block';
    tooltip.classList.add('rich');
    tooltip.innerHTML = `
      <div class="tt-title">${sym} ${escapeHtml(hoverPlanet.name)}</div>
      <div class="tt-meta">${angle.toFixed(2)}° · ${escapeHtml(zod.name)} ${zod.symbol}</div>
      <div class="tt-meta">Avstand: ${hoverPlanet.dist.toFixed(3)} AU</div>
      <div class="tt-meaning">${escapeHtml(meaning)}</div>
      ${aspectHtml}
    `;
    positionTooltip(mouseX, mouseY);
    return;
  }

  if (hoverAspect) {
    const m = ASPECT_MEANINGS[hoverAspect.aspect.key] || '';
    tooltip.style.display = 'block';
    tooltip.classList.add('rich');
    tooltip.innerHTML = `
      <div class="tt-title" style="color:${hoverAspect.aspect.color}">${escapeHtml(hoverAspect.aspect.name)}</div>
      <div class="tt-meta">${escapeHtml(hoverAspect.a.name)} – ${escapeHtml(hoverAspect.b.name)}</div>
      <div class="tt-meta">Orb ${hoverAspect.orb.toFixed(1)}° (maks ${hoverAspect.aspect.orb}°)</div>
      <div class="tt-meaning">${escapeHtml(m)}</div>
    `;
    positionTooltip(mouseX, mouseY);
    return;
  }

  tooltip.style.display = 'none';
  tooltip.classList.remove('rich');
}

function positionTooltip(x, y) {
  const pad = 14;
  const stage = document.querySelector('main.stage');
  const sw = stage ? stage.clientWidth : window.innerWidth;
  const sh = stage ? stage.clientHeight : window.innerHeight;
  tooltip.style.left = '0px';
  tooltip.style.top = '0px';
  const tw = tooltip.offsetWidth || 220;
  const th = tooltip.offsetHeight || 80;
  let left = x + pad;
  let top = y + pad;
  if (left + tw > sw - 8) left = x - tw - pad;
  if (top + th > sh - 8) top = y - th - pad;
  if (left < 8) left = 8;
  if (top < 8) top = 8;
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

// Tidsstyring
let lastRealTimeMs = performance.now();
let accumulatorMs = 0; // for jevn simulering

function update(dtMs) {
  // Oppdater hastighetsfaktor først
  const sliderVal = parseFloat(speedRange.value);
  const sign = sliderVal < 0 ? -1 : 1;
  const magnitude = Math.abs(sliderVal); // 0..10
  // Mykere eksponentiell kurve for finjustering i lavere område
  const scale = sliderVal === 0 ? 1 : Math.pow(10, magnitude * 0.8);
  speedMultiplier = sliderVal === 0 ? 1 : sign * scale;

  // Pause stopper alltid tid, uansett hastighet
  if (!isRunning) return;

  // Akkumuler tid og simuler i små faste steg for å unngå hakkete bevegelser
  accumulatorMs += dtMs;
  const stepMs = 16; // ~60 Hz
  let advanced = false;
  while (accumulatorMs >= stepMs) {
    const deltaSeconds = stepMs / 1000;
  const virtualDeltaMs = deltaSeconds * 1000 * speedMultiplier;
  virtualTime = new Date(virtualTime.getTime() + virtualDeltaMs);
    accumulatorMs -= stepMs;
    advanced = true;
  }
  if (advanced) {
    dateInput.value = toLocalDateTimeInputValue(virtualTime);
    generateSummary();
  }
}

function loop(now) {
  const dt = now - lastRealTimeMs;
  lastRealTimeMs = now;
  // Kjør alltid update – den håndterer selv evt. tidlig retur
    update(dt);
  try {
    drawScene(virtualTime);
  } catch (err) {
    logError(err, 'Tegnefeil');
  }
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

// UI hendelser
nowBtn.addEventListener('click', () => {
  virtualTime = new Date();
  dateInput.value = toLocalDateTimeInputValue(virtualTime);
  log('Tid satt til nå', 'info');
});

// Profiler lagring (localStorage)
function loadProfiles() {
  const raw = localStorage.getItem('astro_profiles');
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveProfiles(list) {
  localStorage.setItem('astro_profiles', JSON.stringify(list));
}
function refreshProfileSelect() {
  const list = loadProfiles();
  profileSelect.innerHTML = '';
  const opt = document.createElement('option');
  opt.value = '';
  opt.textContent = '— Ny profil —';
  profileSelect.appendChild(opt);
  list.forEach((p, idx) => {
    const o = document.createElement('option');
    o.value = String(idx);
    o.textContent = `${p.name || 'Uten navn'} (${p.dob || '?'})`;
    profileSelect.appendChild(o);
  });
}
refreshProfileSelect();

saveProfileBtn.addEventListener('click', () => {
  const list = loadProfiles();
  const profile = {
    name: profName.value.trim(),
    dob: profDob.value,
    lat: parseFloat(profLat.value || '59.9139'),
    lon: parseFloat(profLon.value || '10.7522')
  };
  const sel = profileSelect.value;
  if (sel) list[Number(sel)] = profile; else list.push(profile);
  saveProfiles(list);
  refreshProfileSelect();
  addEvent(`Profil lagret: ${profile.name || 'Uten navn'}`,'Profil');
});

deleteProfileBtn.addEventListener('click', () => {
  const sel = profileSelect.value;
  if (!sel) return;
  const list = loadProfiles();
  const removed = list.splice(Number(sel), 1);
  saveProfiles(list);
  refreshProfileSelect();
  addEvent(`Profil slettet: ${(removed[0] && removed[0].name) || 'Uten navn'}`,'Profil');
});

profileSelect.addEventListener('change', () => {
  const sel = profileSelect.value;
  if (!sel) { profName.value=''; profDob.value=''; profLat.value=''; profLon.value=''; return; }
  const list = loadProfiles();
  const p = list[Number(sel)];
  if (!p) return;
  profName.value = p.name || '';
  profDob.value = p.dob || '';
  profLat.value = (p.lat ?? '').toString();
  profLon.value = (p.lon ?? '').toString();
  addEvent(`Profil aktiv: ${p.name || 'Uten navn'}`,'Profil');
});

// Nataler lagring/lasting
function loadNatals() {
  try { return JSON.parse(localStorage.getItem('astro_natals')||'[]'); } catch { return []; }
}
function saveNatals(list) { localStorage.setItem('astro_natals', JSON.stringify(list)); }
function packNatal(i) {
  return {
    name: natalEls[i].name.value.trim(),
    date: natalEls[i].date.value || '',
    time: natalEls[i].unknown.checked ? null : (natalEls[i].time.value || null),
    unknown: natalEls[i].unknown.checked,
    place: natalEls[i].place.value.trim(),
    lat: natalEls[i].lat.value ? parseFloat(natalEls[i].lat.value) : null,
    lon: natalEls[i].lon.value ? parseFloat(natalEls[i].lon.value) : null,
    tz: natalEls[i].tz.value.trim() || null
  };
}
function unpackNatal(i, n) {
  natalEls[i].name.value = n.name || '';
  natalEls[i].date.value = n.date || '';
  natalEls[i].time.value = n.time || '';
  natalEls[i].unknown.checked = !!n.unknown;
  natalEls[i].place.value = n.place || '';
  natalEls[i].lat.value = n.lat ?? '';
  natalEls[i].lon.value = n.lon ?? '';
  natalEls[i].tz.value = n.tz || '';
}
function refreshNatalsForm() {
  const list = loadNatals();
  for (let i=0;i<3;i++) unpackNatal(i, list[i] || {});
}
refreshNatalsForm();

saveNatalsBtn.addEventListener('click', () => {
  const list = [];
  for (let i=0;i<3;i++) list.push(packNatal(i));
  // Enkel validering
  for (const n of list) {
    if (!n.name && !n.date && !n.place) continue; // tillat tomme rader
    if (n.date && !/^\d{4}-\d{2}-\d{2}$/.test(n.date)) { addEvent(`Ugyldig dato: ${n.date}`, 'Validering'); return; }
    if (n.time && !/^\d{2}:\d{2}$/.test(n.time)) { addEvent(`Ugyldig tid: ${n.time}`, 'Validering'); return; }
    if ((n.lat!=null) !== (n.lon!=null)) { addEvent('Lat/Lon må angis sammen.', 'Validering'); return; }
  }
  saveNatals(list);
  addEvent('Nataler lagret', 'Natal');
  generateSummary();
});

clearNatalsBtn.addEventListener('click', () => {
  saveNatals([]);
  refreshNatalsForm();
  addEvent('Nataler tømt', 'Natal');
  generateSummary();
});

exportNatalsBtn.addEventListener('click', () => {
  const data = loadNatals();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'astro_natals.json';
  a.click();
  URL.revokeObjectURL(url);
});

importNatalsBtn.addEventListener('click', () => {
  importNatalsFile.click();
});

importNatalsFile.addEventListener('change', async () => {
  const file = importNatalsFile.files && importNatalsFile.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error('Ugyldig fil');
    saveNatals(parsed);
    refreshNatalsForm();
    addEvent('Nataler importert', 'Natal');
    generateSummary();
  } catch (e) {
    addEvent('Import feilet', 'Natal');
  } finally {
    importNatalsFile.value = '';
  }
});

intervalSelect.addEventListener('change', () => {
  customInterval.style.display = intervalSelect.value === 'custom' ? 'grid' : 'none';
  generateSummary();
});
[customStart, customEnd, liveNow, viewSummary, viewEvents].forEach(el => el && el.addEventListener('change', generateSummary));

// Enkel geokoding via Nominatim (uten nøkkel). Merk: rate-limits kan gjelde.
async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'no' } });
  if (!res.ok) throw new Error('Geokoding feilet');
  return res.json();
}
for (let i=0;i<3;i++) {
  const iStr = String(i);
  natalEls[i].geocodeBtn.addEventListener('click', async () => {
    try {
      natalEls[i].results.innerHTML='';
      const items = await geocode(natalEls[i].place.value);
      items.slice(0,8).forEach((it) => {
        const opt = document.createElement('option');
        opt.value = `${it.lat},${it.lon}`;
        opt.textContent = it.display_name;
        natalEls[i].results.appendChild(opt);
      });
      addEvent('Geokoding OK', 'Natal');
    } catch (e) {
      addEvent('Geokoding feilet', 'Natal');
    }
  });
  natalEls[i].results.addEventListener('change', () => {
    const v = natalEls[i].results.value.split(',');
    if (v.length===2) {
      natalEls[i].lat.value = parseFloat(v[0]).toFixed(4);
      natalEls[i].lon.value = parseFloat(v[1]).toFixed(4);
    }
  });
}

// Stub: enkel tidssone-hjelp (krever evt. ekstern API for historisk DST)
function inferTimezoneFromLatLon(lat, lon) {
  // For nå: default til Europe/Oslo hvis ikke satt
  return 'Europe/Oslo';
}

function generateSummary() {
  if (!analysisPanel || !viewSummary.checked) return;
  const nowMs = performance.now();
  if (nowMs - lastSummaryComputeMs < 500) return; // ikke spam
  lastSummaryComputeMs = nowMs;

  const natals = loadNatals().filter(n => n && (n.name||n.date));
  const parts = [];
  parts.push(`Intervall: ${intervalSelect.value}${intervalSelect.value==='custom' ? ` ${customStart.value} -> ${customEnd.value}`:''}`);
  if (liveNow.checked) parts.push('Live nå aktiv');

  // Beregn transitter nå
  let transitLongs;
  try { transitLongs = computeGeoLongitudesForBodies(virtualTime); } catch {}
  if (!transitLongs) { analysisPanel.innerHTML = '<div class="log-line warn">Kunne ikke beregne transitter nå.</div>'; return; }

  const allResults = [];
  for (const n of natals) {
    const natalLongs = computeNatalLongitudes(n);
    if (!natalLongs) continue;
    const aspects = findTransitAspects(transitLongs, natalLongs, n.name || 'Uten navn');
    allResults.push(...aspects);
  }

  if (allResults.length === 0) {
    analysisPanel.innerHTML = '<div class="log-line info">Ingen aspekter funnet for lagrede nataler.</div>';
    return;
  }

  // Ranger etter styrke (lav orb → høy styrke). Ta topp 3–5.
  allResults.sort((a,b) => b.strength - a.strength);
  const topN = allResults.slice(0, 5);
  const lines = topN.map(res => {
    const tName = TRANSIT_BODIES.find(b=>b.id===res.transBody)?.name || res.transBody;
    const nName = TRANSIT_BODIES.find(b=>b.id===res.natalBody)?.name || res.natalBody;
    const meaning = ASPECT_MEANINGS[res.aspect.key] || '';
    return `<div class="log-line info"><strong>${tName}</strong> ${res.aspect.name} <strong>${nName}</strong> (orb ${res.orb.toFixed(1)}°) – ${escapeHtml(res.natalName)}<br/><span style="color:#94a3b8">${escapeHtml(meaning)}</span></div>`;
  });
  analysisPanel.innerHTML = lines.join('');
}
generateSummary();

playPauseBtn.addEventListener('click', () => {
  isRunning = !isRunning;
  playPauseBtn.textContent = isRunning ? 'Pause' : 'Spill av';
  log(isRunning ? 'Animasjon startet' : 'Animasjon satt på pause', 'info');
});

resetBtn.addEventListener('click', () => {
  toggleHouses.checked = true;
  toggleHouseNumbers.checked = true;
  toggleAsc.checked = false;
  speedRange.value = '0';
  speedLabel.textContent = '1x (realtime)';
  isRunning = true;
  playPauseBtn.textContent = 'Pause';
  log('Nullstill visning', 'info');
});

speedRange.addEventListener('input', () => {
  const val = parseFloat(speedRange.value);
  if (val === 0) {
    speedLabel.textContent = '1x (realtime)';
  } else {
    const sign = val < 0 ? '-' : '';
    const magnitude = Math.abs(val);
    const scale = Math.pow(10, magnitude * 0.8);
    let display;
    if (scale >= 1e9) display = (scale / 1e9).toFixed(2) + 'B';
    else if (scale >= 1e6) display = (scale / 1e6).toFixed(2) + 'M';
    else if (scale >= 1e3) display = (scale / 1e3).toFixed(2) + 'K';
    else if (scale >= 100) display = scale.toFixed(0);
    else display = scale.toFixed(2);
    speedLabel.textContent = `${sign}${display}x`;
  }
  log(`Hastighet endret til ${speedLabel.textContent}`, 'info');
});

canvas.addEventListener('mousemove', (ev) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = ev.clientX - rect.left;
  mouseY = ev.clientY - rect.top;
});

canvas.addEventListener('mouseleave', () => {
  hoverPlanet = null;
  hoverAspect = null;
  if (tooltip) {
    tooltip.style.display = 'none';
    tooltip.classList.remove('rich');
  }
});

dateInput.addEventListener('change', () => {
  const dt = fromLocalDateTimeInputValue(dateInput.value);
  if (dt) {
    virtualTime = dt;
    log(`Tid endret til ${formatTime(virtualTime)}`, 'info');
  }
});

centerSelect.addEventListener('change', () => {
  centerBody = centerSelect.value;
  renderLegend();
  log(`Senterlegeme: ${centerBody === 'Sun' ? 'Solen' : 'Jorden'}`, 'info');
});

// Logg når toggler endres
toggleHouses.addEventListener('change', () => {
  log(`Astrologihus ${toggleHouses.checked ? 'på' : 'av'}`, 'info');
});
toggleHouseNumbers.addEventListener('change', () => {
  log(`Husnummer ${toggleHouseNumbers.checked ? 'på' : 'av'}`, 'info');
});
toggleAsc.addEventListener('change', () => {
  log(`Forenklet ascendant ${toggleAsc.checked ? 'på' : 'av'}`, 'info');
});
toggleZodiac.addEventListener('change', () => {
  log(`Stjernetegn rundt ringen ${toggleZodiac.checked ? 'på' : 'av'}`, 'info');
});
toggleZodiacSymbols.addEventListener('change', () => {
  log(`Stjernetegn med symboler ${toggleZodiacSymbols.checked ? 'på' : 'av'}`, 'info');
});

function toLocalDateTimeInputValue(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
}

function fromLocalDateTimeInputValue(val) {
  if (!val) return null;
  // Sikre at sekunder er inkludert
  const normalized = val.length === 16 ? `${val}:00` : val;
  const dt = new Date(normalized);
  return isNaN(dt.getTime()) ? null : dt;
}

// Init verdier
dateInput.value = toLocalDateTimeInputValue(virtualTime);

// Init-logg og sjekk Astronomy Engine
log('App startet', 'info');
log(`Astronomy Engine lastet: ${typeof Astronomy !== 'undefined' ? 'ja' : 'nei'}`, typeof Astronomy !== 'undefined' ? 'info' : 'warn');

// Hvis Astronomy ikke er lastet, prøv å laste den lokale filen
if (typeof Astronomy === 'undefined') {
  log('Prøver å laste lokal astronomy.browser.min.js', 'info');
  fetch('./astronomy.browser.min.js')
    .then(response => response.text())
    .then(scriptText => {
      const script = document.createElement('script');
      script.textContent = scriptText;
      document.head.appendChild(script);
      log('Lokal astronomy.browser.min.js lastet', 'info');
    })
    .catch(err => {
      logError(err, 'Klarte ikke å laste lokal fil');
    });
} else {
  log('Astronomy Engine allerede lastet', 'info');
}

log(`Senterlegeme: ${centerBody === 'Sun' ? 'Solen' : 'Jorden'}`, 'info');
