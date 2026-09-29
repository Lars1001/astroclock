# LAg en astrologiklokke som viser alle planetene i solsystemet 2d med solen i midten. 
# planetene som visere på en klokke med planetindikator og hover info som går realtime med riktig plassering relativt til solen
Ha en dropdown meny om hvilken planet eller stjerne som skal være senterpunktet i klokken.
Sørg for at alle visere er synlige og går i sin hastighet slik at de stemmer med virkelighetns astrologiske kart og husnummer i forhold til sted/by på jorden som referansepunkt da jorden er senter evt.
# meny med checkbox for å slå av bakgrunn som astrologi husene, nummerert, ascedandt, og andre nyttige funksjoner. 
# en datovelger for å kunne velge planetenes plasering på gitt dato. 
# speed indicator skyvebryter
# sørg for at grafikken er moderne, stilig og imponerende.

<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Astrologiklokke med Stjernetegn</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: radial-gradient(ellipse at center, #0a1628 0%, #020817 100%);
      color: #e2e8f0;
      height: 100vh;
      overflow: hidden;
    }
    
    #app {
      display: grid;
      grid-template-columns: 340px 1fr;
      height: 100vh;
    }
    
    .controls {
      background: rgba(15, 23, 42, 0.95);
      border-right: 1px solid #334155;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .controls h2 {
      color: #f1f5f9;
      font-size: 1.5rem;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 10px;
    }
    
    .control-group {
      background: rgba(30, 41, 59, 0.5);
      padding: 15px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .control-group label {
      color: #94a3b8;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    input[type="datetime-local"],
    select {
      width: 100%;
      padding: 8px 12px;
      background: #1e293b;
      border: 1px solid #475569;
      border-radius: 6px;
      color: #f1f5f9;
      font-size: 0.95rem;
    }
    
    button {
      padding: 10px 16px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    button:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }
    
    button:active {
      transform: translateY(0);
    }
    
    .speed-display {
      text-align: center;
      font-size: 1.1rem;
      color: #60a5fa;
      font-weight: 600;
      padding: 8px;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 6px;
    }
    
    input[type="range"] {
      width: 100%;
      height: 6px;
      background: #334155;
      border-radius: 3px;
      outline: none;
      -webkit-appearance: none;
    }
    
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #3b82f6;
      cursor: pointer;
    }
    
    input[type="range"]::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #3b82f6;
      cursor: pointer;
      border: none;
    }
    
    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
    
    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
    
    .legend {
      background: rgba(30, 41, 59, 0.5);
      padding: 15px;
      border-radius: 8px;
    }
    
    .legend h3 {
      color: #f1f5f9;
      margin-bottom: 12px;
      font-size: 1.1rem;
    }
    
    .legend-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
    }
    
    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      box-shadow: 0 0 4px rgba(0,0,0,0.3);
    }
    
    .stage {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    #canvas {
      max-width: 100%;
      max-height: 100%;
    }
    
    .info-panel {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(15, 23, 42, 0.95);
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #334155;
      min-width: 200px;
    }
    
    .info-panel h3 {
      color: #60a5fa;
      margin-bottom: 10px;
      font-size: 1rem;
    }
    
    .info-line {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 0.9rem;
      color: #cbd5e1;
    }
    
    .info-line strong {
      color: #f1f5f9;
    }
    
    .tooltip {
      position: absolute;
      background: rgba(15, 23, 42, 0.98);
      border: 1px solid #3b82f6;
      border-radius: 6px;
      padding: 8px 12px;
      pointer-events: none;
      z-index: 1000;
      font-size: 0.9rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      display: none;
    }
    
    @media (max-width: 1024px) {
      #app {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
      }
      
      .controls {
        border-right: none;
        border-bottom: 1px solid #334155;
        max-height: 40vh;
      }
      
      .info-panel {
        top: 10px;
        right: 10px;
        font-size: 0.85rem;
      }
    }
  </style>
</head>
<body>
  <div id="app">
    <aside class="controls">
      <h2>🌟 Astrologiklokke</h2>
      
      <div class="control-group">
        <label>Dato og tid</label>
        <input type="datetime-local" id="dateInput" step="1">
        <button id="nowBtn">🕐 Sett til nå</button>
      </div>
      
      <div class="control-group">
        <label>Hastighet</label>
        <input type="range" id="speedSlider" min="-5" max="5" value="0" step="0.1">
        <div class="speed-display" id="speedDisplay">Pause</div>
        <div style="display: flex; gap: 10px;">
          <button id="playPauseBtn">▶️ Start</button>
          <button id="resetSpeedBtn">↺ Normal</button>
        </div>
      </div>
      
      <div class="control-group">
        <label>Visningsalternativer</label>
        <div class="checkbox-group">
          <label>
            <input type="checkbox" id="showHouses" checked>
            <span>Vis hus (12)</span>
          </label>
          <label>
            <input type="checkbox" id="showSigns" checked>
            <span>Vis stjernetegn</span>
          </label>
          <label>
            <input type="checkbox" id="showOrbits" checked>
            <span>Vis baner</span>
          </label>
          <label>
            <input type="checkbox" id="showAspects">
            <span>Vis aspekter</span>
          </label>
        </div>
      </div>
      
      <div class="legend">
        <h3>Planeter</h3>
        <div class="legend-grid" id="planetLegend"></div>
      </div>
    </aside>
    
    <main class="stage">
      <canvas id="canvas"></canvas>
      <div class="info-panel">
        <h3>Posisjoner</h3>
        <div id="positionInfo"></div>
      </div>
      <div class="tooltip" id="tooltip"></div>
    </main>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.min.js"></script>
  <script>
    // Konfigurasjoner
    const ZODIAC_SIGNS = [
      { name: 'Væren', symbol: '♈', start: 0 },
      { name: 'Tyren', symbol: '♉', start: 30 },
      { name: 'Tvillingene', symbol: '♊', start: 60 },
      { name: 'Krepsen', symbol: '♋', start: 90 },
      { name: 'Løven', symbol: '♌', start: 120 },
      { name: 'Jomfruen', symbol: '♍', start: 150 },
      { name: 'Vekten', symbol: '♎', start: 180 },
      { name: 'Skorpionen', symbol: '♏', start: 210 },
      { name: 'Skytten', symbol: '♐', start: 240 },
      { name: 'Steinbukken', symbol: '♑', start: 270 },
      { name: 'Vannmannen', symbol: '♒', start: 300 },
      { name: 'Fiskene', symbol: '♓', start: 330 }
    ];

    const PLANETS = [
      { id: 'Sun', name: 'Solen', symbol: '☉', color: '#FFD700', showOrbit: false },
      { id: 'Moon', name: 'Månen', symbol: '☽', color: '#E6E6FA', showOrbit: true },
      { id: 'Mercury', name: 'Merkur', symbol: '☿', color: '#B0C4DE', showOrbit: true },
      { id: 'Venus', name: 'Venus', symbol: '♀', color: '#FFB6C1', showOrbit: true },
      { id: 'Mars', name: 'Mars', symbol: '♂', color: '#CD5C5C', showOrbit: true },
      { id: 'Jupiter', name: 'Jupiter', symbol: '♃', color: '#DAA520', showOrbit: true },
      { id: 'Saturn', name: 'Saturn', symbol: '♄', color: '#F0E68C', showOrbit: true },
      { id: 'Uranus', name: 'Uranus', symbol: '♅', color: '#40E0D0', showOrbit: true },
      { id: 'Neptune', name: 'Neptun', symbol: '♆', color: '#6495ED', showOrbit: true },
      { id: 'Pluto', name: 'Pluto', symbol: '♇', color: '#DDA0DD', showOrbit: true }
    ];

    // Globale variabler
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('tooltip');
    let virtualTime = new Date();
    let speedMultiplier = 0;
    let isPlaying = false;
    let mouseX = 0, mouseY = 0;
    let hoveredPlanet = null;
    let lastFrameTime = performance.now();

    // Sett canvas størrelse
    function resizeCanvas() {
      const container = canvas.parentElement;
      const size = Math.min(container.clientWidth - 40, container.clientHeight - 40);
      canvas.width = size;
      canvas.height = size;
      canvas.style.width = size + 'px';
      canvas.style.height = size + 'px';
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Hjelpefunksjoner
    function degToRad(deg) {
      return (deg * Math.PI) / 180;
    }

    function getZodiacSign(degrees) {
      const normalized = ((degrees % 360) + 360) % 360;
      for (let i = ZODIAC_SIGNS.length - 1; i >= 0; i--) {
        if (normalized >= ZODIAC_SIGNS[i].start) {
          return ZODIAC_SIGNS[i];
        }
      }
      return ZODIAC_SIGNS[0];
    }

    function formatDegrees(degrees) {
      const normalized = ((degrees % 360) + 360) % 360;
      const sign = getZodiacSign(normalized);
      const degInSign = normalized - sign.start;
      const deg = Math.floor(degInSign);
      const min = Math.floor((degInSign - deg) * 60);
      return `${deg}°${min}' ${sign.symbol}`;
    }

    // Beregn planetposisjoner
    function calculatePlanetPosition(planetId, date) {
      try {
        const time = Astronomy.MakeTime(date);
        
        if (planetId === 'Sun') {
          // Solen er alltid på 0° i geosentrisk system
          return { longitude: 0, distance: 1 };
        } else if (planetId === 'Moon') {
          const moon = Astronomy.EclipticGeoMoon(time);
          return { longitude: moon.elon, distance: moon.dist * 100 }; // Skalert for visning
        } else {
          // For andre planeter, bruk geocentrisk posisjon
          const geo = Astronomy.GeoVector(planetId, time, false);
          const ecliptic = Astronomy.Ecliptic(geo);
          return { longitude: ecliptic.elon, distance: ecliptic.vec.Length() };
        }
      } catch (error) {
        console.error(`Feil ved beregning av ${planetId}:`, error);
        return { longitude: 0, distance: 1 };
      }
    }

    // Tegn scenen
    function draw() {
      const size = canvas.width;
      const center = size / 2;
      const radius = size * 0.4;

      // Tøm canvas
      ctx.fillStyle = '#0a1628';
      ctx.fillRect(0, 0, size, size);

      ctx.save();
      ctx.translate(center, center);

      // Tegn ytre sirkel
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Tegn stjernetegn
      if (document.getElementById('showSigns').checked) {
        ctx.save();
        for (let sign of ZODIAC_SIGNS) {
          const angle = degToRad(sign.start - 90); // -90 for å starte på toppen
          const nextAngle = degToRad(sign.start + 30 - 90);
          
          // Tegn sektor
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, radius, angle, nextAngle);
          ctx.stroke();
          
          // Tegn symbol
          const symbolAngle = angle + degToRad(15);
          const symbolX = Math.cos(symbolAngle) * (radius - 25);
          const symbolY = Math.sin(symbolAngle) * (radius - 25);
          
          ctx.fillStyle = '#64748b';
          ctx.font = '18px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(sign.symbol, symbolX, symbolY);
        }
        ctx.restore();
      }

      // Tegn hus
      if (document.getElementById('showHouses').checked) {
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        for (let i = 0; i < 12; i++) {
          const angle = degToRad(i * 30 - 90);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
          ctx.stroke();
          
          // Husnummer
          const labelAngle = angle + degToRad(15);
          const labelX = Math.cos(labelAngle) * (radius * 0.7);
          const labelY = Math.sin(labelAngle) * (radius * 0.7);
          
          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(i + 1, labelX, labelY);
        }
      }

      // Beregn og tegn planeter
      const planetPositions = [];
      let positionHTML = '';

      for (let planet of PLANETS) {
        const pos = calculatePlanetPosition(planet.id, virtualTime);
        const angle = degToRad(pos.longitude - 90); // -90 for å starte på toppen
        
        // Skalér avstand for visning
        let displayRadius = radius * 0.5;
        if (planet.id === 'Moon') {
          displayRadius = radius * 0.3;
        } else if (planet.id === 'Sun') {
          displayRadius = 0; // Solen i sentrum
        } else {
          // Skalér andre planeter basert på avstand
          displayRadius = radius * (0.4 + Math.min(pos.distance / 10, 0.5));
        }
        
        const x = Math.cos(angle) * displayRadius;
        const y = Math.sin(angle) * displayRadius;
        
        planetPositions.push({ ...planet, x, y, longitude: pos.longitude });
        
        // Tegn bane
        if (document.getElementById('showOrbits').checked && planet.showOrbit && displayRadius > 0) {
          ctx.strokeStyle = planet.color + '30';
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.arc(0, 0, displayRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        
        // Tegn viser
        if (displayRadius > 0) {
          ctx.strokeStyle = planet.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        
        // Tegn planet
        ctx.fillStyle = planet.color;
        ctx.beginPath();
        ctx.arc(x, y, planet.id === 'Sun' ? 12 : 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Tegn symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(planet.symbol, x, y);
        
        // Oppdater info panel
        positionHTML += `
          <div class="info-line">
            <span style="color: ${planet.color}">${planet.symbol} ${planet.name}</span>
            <strong>${formatDegrees(pos.longitude)}</strong>
          </div>
        `;
      }

      // Tegn aspekter hvis aktivert
      if (document.getElementById('showAspects').checked) {
        const aspects = [
          { angle: 0, name: 'Konjunksjon', color: '#22c55e', orb: 8 },
          { angle: 60, name: 'Sekstil', color: '#3b82f6', orb: 4 },
          { angle: 90, name: 'Kvadrat', color: '#ef4444', orb: 8 },
          { angle: 120, name: 'Trigon', color: '#22c55e', orb: 8 },
          { angle: 180, name: 'Opposisjon', color: '#f59e0b', orb: 8 }
        ];
        
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        
        for (let i = 0; i < planetPositions.length; i++) {
          for (let j = i + 1; j < planetPositions.length; j++) {
            const p1 = planetPositions[i];
            const p2 = planetPositions[j];
            const diff = Math.abs(p1.longitude - p2.longitude);
            const normalizedDiff = Math.min(diff, 360 - diff);
            
            for (let aspect of aspects) {
              if (Math.abs(normalizedDiff - aspect.angle) <= aspect.orb) {
                ctx.strokeStyle = aspect.color + '40';
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
                break;
              }
            }
          }
        }
        ctx.setLineDash([]);
      }

      ctx.restore();

      // Oppdater info panel
      document.getElementById('positionInfo').innerHTML = positionHTML;

      // Vis tid
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(virtualTime.toLocaleString('no-NO'), center, size - 20);
    }

    // Animasjonsloop
    function animate(currentTime) {
      const deltaTime = currentTime - lastFrameTime;
      lastFrameTime = currentTime;

      // Oppdater tid basert på hastighet
      if (speedMultiplier !== 0) {
        const deltaSeconds = (deltaTime / 1000) * speedMultiplier;
        virtualTime = new Date(virtualTime.getTime() + deltaSeconds * 1000);
        updateDateInput();
      }

      draw();
      requestAnimationFrame(animate);
    }

    // UI hendelser
    document.getElementById('nowBtn').addEventListener('click', () => {
      virtualTime = new Date();
      updateDateInput();
    });

    document.getElementById('playPauseBtn').addEventListener('click', () => {
      if (speedMultiplier === 0) {
        speedMultiplier = 1;
        document.getElementById('playPauseBtn').textContent = '⏸️ Pause';
        document.getElementById('speedSlider').value = '1';
        updateSpeedDisplay();
      } else {
        speedMultiplier = 0;
        document.getElementById('playPauseBtn').textContent = '▶️ Start';
        document.getElementById('speedSlider').value = '0';
        updateSpeedDisplay();
      }
    });

    document.getElementById('resetSpeedBtn').addEventListener('click', () => {
      speedMultiplier = 1;
      document.getElementById('speedSlider').value = '1';
      document.getElementById('playPauseBtn').textContent = '⏸️ Pause';
      updateSpeedDisplay();
    });

    document.getElementById('speedSlider').addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      if (value === 0) {
        speedMultiplier = 0;
        document.getElementById('playPauseBtn').textContent = '▶️ Start';
      } else {
        speedMultiplier = Math.pow(10, value);
        if (value < 0) speedMultiplier = -speedMultiplier;
        document.getElementById('playPauseBtn').textContent = '⏸️ Pause';
      }
      updateSpeedDisplay();
    });

    document.getElementById('dateInput').addEventListener('change', (e) => {
      const date = new Date(e.target.value);
      if (!isNaN(date.getTime())) {
        virtualTime = date;
      }
    });

    // Hjelpefunksjoner for UI
    function updateDateInput() {
      const year = virtualTime.getFullYear();
      const month = String(virtualTime.getMonth() + 1).padStart(2, '0');
      const day = String(virtualTime.getDate()).padStart(2, '0');
      const hours = String(virtualTime.getHours()).padStart(2, '0');
      const minutes = String(virtualTime.getMinutes()).padStart(2, '0');
      const seconds = String(virtualTime.getSeconds()).padStart(2, '0');
      document.getElementById('dateInput').value = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    function updateSpeedDisplay() {
      const display = document.getElementById('speedDisplay');
      if (speedMultiplier === 0) {
        display.textContent = 'Pause';
      } else if (Math.abs(speedMultiplier) === 1) {
        display.textContent = speedMultiplier < 0 ? '← Normal' : 'Normal →';
      } else {
        const speed = Math.abs(speedMultiplier);
        const direction = speedMultiplier < 0 ? '← ' : '';
        if (speed >= 1000000) {
          display.textContent = `${direction}${(speed/1000000).toFixed(1)}M x`;
        } else if (speed >= 1000) {
          display.textContent = `${direction}${(speed/1000).toFixed(1)}K x`;
        } else if (speed < 1) {
          display.textContent = `${direction}${speed.toFixed(2)} x`;
        } else {
          display.textContent = `${direction}${speed.toFixed(0)} x`;
        }
      }
    }

    // Opprett legende
    function createLegend() {
      const legendGrid = document.getElementById('planetLegend');
      legendGrid.innerHTML = '';
      
      for (let planet of PLANETS) {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
          <div class="legend-color" style="background-color: ${planet.color}"></div>
          <span>${planet.symbol} ${planet.name}</span>
        `;
        legendGrid.appendChild(item);
      }
    }

    // Musehendelser for tooltip
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      
      // Sjekk om musen er over en planet
      hoveredPlanet = null;
      const center = canvas.width / 2;
      
      for (let planet of PLANETS) {
        const pos = calculatePlanetPosition(planet.id, virtualTime);
        const angle = degToRad(pos.longitude - 90);
        const displayRadius = planet.id === 'Sun' ? 0 : 
                            planet.id === 'Moon' ? canvas.width * 0.12 :
                            canvas.width * 0.16;
        const x = center + Math.cos(angle) * displayRadius;
        const y = center + Math.sin(angle) * displayRadius;
        
        const dist = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2));
        if (dist < 15) {
          hoveredPlanet = planet;
          tooltip.style.display = 'block';
          tooltip.style.left = e.clientX + 10 + 'px';
          tooltip.style.top = e.clientY + 10 + 'px';
          tooltip.innerHTML = `
            <strong>${planet.name}</strong><br>
            ${formatDegrees(pos.longitude)}<br>
            ${getZodiacSign(pos.longitude).name}
          `;
          break;
        }
      }
      
      if (!hoveredPlanet) {
        tooltip.style.display = 'none';
      }
    });

    canvas.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
      hoveredPlanet = null;
    });

    // Redraw når checkboxer endres
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', draw);
    });

    // Initialiser
    createLegend();
    updateDateInput();
    updateSpeedDisplay();
    requestAnimationFrame(animate);
  </script>
</body>
</html>