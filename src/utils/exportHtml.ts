import { PirateLetterItem, WorkbookSettings } from '../data/pirateAlphabet';

/**
 * Generates an entirely self-contained HTML single-page app containing:
 * 1. Printable A4 Pirate Booklet with cover, A-Z letter blocks and Montessori guidelines.
 * 2. Interactive Digital Tracing Canvas (students can draw with finger/mouse and clear).
 * 3. Pirate Mini-game (guess letter / emoji quiz).
 * 4. Printable Captain's Diploma.
 * 
 * When double-clicked or opened in Chrome/Safari/Firefox on phone, tablet or PC:
 * - NO server needed
 * - NO login needed
 * - Works 100% OFFLINE
 * - Can be shared via WhatsApp file, Google Drive, Pendrive, Email, Classroom.
 */
export function generateSelfContainedAppHtml(
  alphabet: PirateLetterItem[],
  settings: WorkbookSettings
): string {
  const alphabetJson = JSON.stringify(alphabet);
  const settingsJson = JSON.stringify(settings);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${settings.bookletTitle || 'El Tesoro de las Letras'} - App Pirata Completa</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Pirata+One&family=Comic+Neue:wght@700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      background-color: #FDF5E6;
      color: #2D1B11;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }
    .font-basic {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      font-weight: 900;
    }
    .font-pirate {
      font-family: 'Pirata One', cursive, serif;
    }

    /* Top Navigation Bar */
    .top-bar {
      background: #2D1B11;
      color: #FDF5E6;
      border-bottom: 4px solid #C62828;
      padding: 10px 16px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-title {
      font-family: 'Pirata One', cursive;
      font-size: 26px;
      color: #FFD54F;
      line-height: 1;
    }
    .brand-sub {
      font-size: 10px;
      color: #D7CCC8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .nav-tabs {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .tab-btn {
      background: #3E2723;
      color: #D7CCC8;
      border: none;
      padding: 8px 14px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tab-btn:hover {
      background: #4E342E;
      color: white;
    }
    .tab-btn.active {
      background: #C62828;
      color: white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
    .print-btn-top {
      background: linear-gradient(to bottom, #FFE082, #FFC107);
      color: #2D1B11;
      border: 1px solid #FFA000;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 900;
      font-size: 13px;
      cursor: pointer;
    }

    /* Container */
    .app-container {
      max-width: 1000px;
      margin: 20px auto;
      padding: 0 16px;
    }

    .tab-panel {
      display: none;
    }
    .tab-panel.active {
      display: block;
    }

    /* Booklet Styles */
    .cover-page {
      background: white;
      border: 8px double #8D6E63;
      border-radius: 24px;
      padding: 50px 20px;
      text-align: center;
      page-break-after: always;
      box-shadow: 0 6px 18px rgba(0,0,0,0.06);
      margin-bottom: 24px;
    }
    .cover-page h1 {
      font-family: 'Pirata One', cursive;
      font-size: 52px;
      color: #C62828;
      margin: 10px 0;
    }
    .cover-student-box {
      border: 3px dashed #8D6E63;
      border-radius: 16px;
      padding: 24px;
      max-width: 450px;
      margin: 24px auto;
      background: #FFF8E1;
      font-weight: bold;
      font-size: 18px;
    }
    .cover-line {
      border-bottom: 3px dashed #C62828;
      min-height: 36px;
      margin-top: 10px;
      color: #C62828;
      font-size: 26px;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .practice-card {
      background: white;
      border: 3px solid #2D1B11;
      border-radius: 16px;
      margin-bottom: 20px;
      overflow: hidden;
      page-break-inside: avoid;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    .practice-header {
      background: #FFE0B2;
      border-bottom: 3px solid #2D1B11;
      display: flex;
      align-items: stretch;
    }
    .target-letter-badge {
      width: 76px;
      background: #D32F2F;
      color: white;
      font-size: 48px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 3px solid #2D1B11;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .ghost-row {
      flex: 1;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 6px 16px;
      font-size: 34px;
      font-weight: 900;
      color: #90A4AE;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .word-body {
      padding: 16px 20px;
      background: #FAFAFA;
    }
    .word-label {
      font-size: 24px;
      font-weight: 900;
      color: #1A237E;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .guideline {
      border-top: 2px solid #8D6E63;
      border-bottom: 2px solid #8D6E63;
      margin: 8px 0;
      padding: 6px 12px;
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 3px;
      background: white;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .guide-dark { color: #78909C; }
    .guide-light { color: #CFD8DC; }
    .guide-empty { height: 42px; }

    /* Interactive Tracing Canvas */
    .tracer-card {
      background: white;
      border: 4px solid #2D1B11;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      text-align: center;
    }
    .canvas-wrapper {
      position: relative;
      width: 100%;
      max-width: 600px;
      height: 380px;
      margin: 16px auto;
      border: 4px solid #8D6E63;
      border-radius: 16px;
      background: #FFFDE7;
      overflow: hidden;
      touch-action: none;
    }
    .canvas-bg-letter {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 220px;
      font-weight: 900;
      color: #CFD8DC;
      user-select: none;
      pointer-events: none;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .canvas-guidelines {
      position: absolute;
      inset: 0;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 25px 0;
    }
    .canvas-guidelines div {
      border-bottom: 2px dashed #BCAAA4;
      width: 100%;
    }
    #drawCanvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      cursor: crosshair;
    }
    .palette-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      cursor: pointer;
    }
    .btn-action {
      background: #C62828;
      color: white;
      border: none;
      padding: 10px 18px;
      font-weight: 900;
      font-size: 14px;
      border-radius: 10px;
      cursor: pointer;
    }
    .btn-secondary {
      background: #E0E0E0;
      color: #2D1B11;
      border: 2px solid #BDBDBD;
      padding: 8px 16px;
      font-weight: 700;
      border-radius: 10px;
      cursor: pointer;
    }

    /* Quiz Game */
    .game-card {
      background: white;
      border: 4px solid #2D1B11;
      border-radius: 20px;
      padding: 30px 20px;
      text-align: center;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      max-width: 650px;
      margin: 0 auto;
    }
    .game-option-btn {
      background: white;
      border: 4px solid #8D6E63;
      border-radius: 16px;
      padding: 16px;
      font-size: 28px;
      font-weight: 900;
      color: #1A237E;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      transition: all 0.15s;
    }
    .game-option-btn:hover {
      border-color: #C62828;
      background: #FFF8E1;
      transform: scale(1.03);
    }

    /* Diploma */
    .diploma-card {
      background: white;
      border: 12px double #8D6E63;
      border-radius: 28px;
      padding: 40px 20px;
      text-align: center;
      max-width: 800px;
      margin: 20px auto;
      box-shadow: 0 8px 30px rgba(0,0,0,0.1);
      page-break-after: always;
    }

    @media print {
      .top-bar, .no-print {
        display: none !important;
      }
      body {
        background: white;
        padding: 0;
      }
      .tab-panel {
        display: none !important;
      }
      #tab-workbook {
        display: block !important;
      }
      .app-container {
        max-width: 100%;
        margin: 0;
        padding: 0;
      }
    }
  </style>
</head>
<body>

  <!-- Top Bar (Se oculta al imprimir) -->
  <header class="top-bar no-print">
    <div class="brand">
      <span style="font-size: 28px;">🏴‍☠️</span>
      <div>
        <div class="brand-title">${settings.bookletTitle || 'El Tesoro de las Letras'}</div>
        <div class="brand-sub">App Pirata Offline • Sin Conexión</div>
      </div>
    </div>

    <nav class="nav-tabs">
      <button class="tab-btn active" onclick="switchTab('workbook')">📄 Cuadernillo A4</button>
      <button class="tab-btn" onclick="switchTab('tracer')">✏️ Pizarra de Trazo</button>
      <button class="tab-btn" onclick="switchTab('game')">🎮 Mini-Juego</button>
      <button class="tab-btn" onclick="switchTab('diploma')">🏆 Diploma</button>
    </nav>

    <div>
      <button class="print-btn-top" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
    </div>
  </header>

  <main class="app-container">

    <!-- TAB 1: CUADERNILLO IMPRIMIBLE A4 -->
    <section id="tab-workbook" class="tab-panel active">
      <!-- Portada -->
      <div class="cover-page">
        <div style="font-size: 55px; margin-bottom: 10px;">🏴‍☠️ ⚓ 💰</div>
        <h1>${settings.bookletTitle || 'EL TESORO DE LAS LETRAS'}</h1>
        <div style="font-size: 20px; font-weight: 800; color: #1A237E; margin-bottom: 24px;">
          ${settings.subtitle || 'Cuadernillo Pirata de Caligrafía (Mayúsculas Básicas)'}
        </div>

        <div class="cover-student-box">
          <div>Nombre del Pirata Aventurero:</div>
          <div class="cover-line">${settings.studentName || '_______________'}</div>
          <div style="margin-top: 14px; font-size: 15px; color: #5D4037;">
            Barco: <b>${settings.shipName || 'La Perla Negra'}</b>
          </div>
        </div>

        <div style="margin-top: 30px; font-size: 13px; color: #8D6E63; font-weight: bold;">
          ¡Aprende a trazar cada letra y encuentra el tesoro de la lectura!
        </div>
      </div>

      <!-- Fichas de Letras -->
      <div id="booklet-cards">
        <!-- Rendered by JS -->
      </div>
    </section>

    <!-- TAB 2: PIZARRA DE TRAZO DIGITAL INTERACTIVA -->
    <section id="tab-tracer" class="tab-panel no-print">
      <div class="tracer-card">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div id="tracerLetterBadge" style="width: 54px; height: 54px; background: #D32F2F; color: white; border-radius: 12px; font-size: 36px; font-weight: 900; display: flex; align-items: center; justify-content: center;">
              A
            </div>
            <div style="text-align: left;">
              <div id="tracerWordText" style="font-size: 24px; font-weight: 900; color: #1A237E;">
                ⚓ ANCLA
              </div>
              <div style="font-size: 12px; color: #5D4037;">
                Traza con tu dedo o ratón siguiendo la letra guía.
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 6px;">
            <button class="btn-secondary" onclick="prevLetter()">◀ Anterior</button>
            <button class="btn-action" onclick="nextLetter()">Siguiente ▶</button>
          </div>
        </div>

        <!-- Canvas -->
        <div class="canvas-wrapper">
          <div class="canvas-guidelines">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="canvas-bg-letter" id="bgLetterGuide">A</div>
          <canvas id="drawCanvas"></canvas>
        </div>

        <!-- Controls -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: 14px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 12px; font-weight: 700;">Color:</span>
            <button class="palette-btn" style="background: #C62828;" onclick="setColor('#C62828')"></button>
            <button class="palette-btn" style="background: #1A237E;" onclick="setColor('#1A237E')"></button>
            <button class="palette-btn" style="background: #2E7D32;" onclick="setColor('#2E7D32')"></button>
            <button class="palette-btn" style="background: #F57F17;" onclick="setColor('#F57F17')"></button>
            <button class="palette-btn" style="background: #2D1B11;" onclick="setColor('#2D1B11')"></button>
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="btn-secondary" onclick="clearCanvas()">🗑️ Borrar</button>
            <button class="btn-action" onclick="downloadCanvasImage()">💾 Guardar Dibujo</button>
          </div>
        </div>
      </div>
    </section>

    <!-- TAB 3: MINI-JUEGO PIRATA -->
    <section id="tab-game" class="tab-panel no-print">
      <div class="game-card">
        <div style="font-size: 40px; margin-bottom: 6px;">🎮 🦜</div>
        <h2 style="font-size: 28px; font-weight: 900; color: #1A237E; margin: 0 0 8px;">
          Desafío Pirata de las Letras
        </h2>
        <p style="font-size: 14px; color: #5D4037; margin-bottom: 20px;" id="gamePrompt">
          ¿Cuál es la primera letra de esta palabra?
        </p>

        <div style="font-size: 60px; margin: 16px 0;" id="gameEmoji">⚓</div>
        <div style="font-size: 32px; font-weight: 900; color: #C62828; margin-bottom: 24px;" id="gameWord">
          _ N C L A
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;" id="gameOptions">
          <!-- Options rendered by JS -->
        </div>

        <div id="gameFeedback" style="margin-top: 20px; font-size: 18px; font-weight: 900; min-height: 28px;"></div>
      </div>
    </section>

    <!-- TAB 4: DIPLOMA -->
    <section id="tab-diploma" class="tab-panel">
      <div class="diploma-card">
        <div style="font-size: 50px;">🏆 📜 ⚓</div>
        <h1 style="font-family: 'Pirata One', cursive; font-size: 48px; color: #C62828; margin: 8px 0;">
          DIPLOMA DE NAVEGANTE DE LAS LETRAS
        </h1>
        <p style="font-size: 18px; color: #1A237E; font-weight: bold;">
          La Gran Flota Pirata otorga con orgullo este reconocimiento a:
        </p>

        <div style="border-bottom: 4px dashed #C62828; max-width: 450px; margin: 24px auto; font-size: 32px; font-weight: 900; color: #C62828; padding-bottom: 6px;">
          ${settings.studentName || 'Capitán de las Letras'}
        </div>

        <p style="font-size: 15px; color: #5D4037; line-height: 1.6; max-width: 550px; margin: 0 auto;">
          Por haber navegado con valentía desde la <b>A hasta la Z</b>, trazando correctamente cada letra y descubriendo el mayor tesoro: <b>el saber leer y escribir</b>.
        </p>

        <div style="margin-top: 40px; display: flex; justify-content: space-around; align-items: flex-end;">
          <div>
            <div style="border-bottom: 2px solid #8D6E63; width: 180px; margin-bottom: 6px;"></div>
            <span style="font-size: 12px; font-weight: bold; color: #8D6E63;">Firma del Docente / Capitán</span>
          </div>
          <div style="font-size: 48px;">🏴‍☠️</div>
          <div>
            <div style="border-bottom: 2px solid #8D6E63; width: 180px; margin-bottom: 6px;"></div>
            <span style="font-size: 12px; font-weight: bold; color: #8D6E63;">Sello de la Corona Pirata</span>
          </div>
        </div>
      </div>
    </section>

  </main>

  <script>
    const alphabet = ${alphabetJson};
    const settings = ${settingsJson};

    let currentIndex = 0;
    let currentColor = '#C62828';
    let isDrawing = false;
    let canvas, ctx;

    function init() {
      renderBooklet();
      initCanvas();
      updateTracer();
      nextGameQuestion();
    }

    function switchTab(tabId) {
      document.querySelectorAll('.tab-panel').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

      const target = document.getElementById('tab-' + tabId);
      if (target) target.classList.add('active');

      const btns = document.querySelectorAll('.tab-btn');
      if (tabId === 'workbook') btns[0].classList.add('active');
      if (tabId === 'tracer') {
        btns[1].classList.add('active');
        setTimeout(resizeCanvas, 50);
      }
      if (tabId === 'game') btns[2].classList.add('active');
      if (tabId === 'diploma') btns[3].classList.add('active');
    }

    function renderBooklet() {
      const container = document.getElementById('booklet-cards');
      if (!container) return;

      container.innerHTML = alphabet.map(item => {
        const rep = item.word.length > 5 ? 3 : 4;
        const repeated = Array.from({ length: rep }, () => item.word).join('   ');
        const ghosts = Array.from({ length: 7 }, () => item.letter).join('   ');

        return \`
          <div class="practice-card">
            <div class="practice-header">
              <div class="target-letter-badge">\${item.letter}</div>
              <div class="ghost-row">\${ghosts}</div>
            </div>
            <div class="word-body">
              <div class="word-label">
                <span>\${item.emoji}</span>
                <span>\${item.word}</span>
              </div>
              <div class="guideline guide-dark">\${repeated}</div>
              <div class="guideline guide-light">\${repeated}</div>
              <div class="guideline guide-empty">&nbsp;</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    /* Interactive Canvas Logic */
    function initCanvas() {
      canvas = document.getElementById('drawCanvas');
      if (!canvas) return;
      ctx = canvas.getContext('2d');

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mousemove', draw);
      window.addEventListener('mouseup', stopDraw);

      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        startDraw(touch);
      }, { passive: false });

      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        draw(touch);
      }, { passive: false });

      window.addEventListener('touchend', stopDraw);
    }

    function resizeCanvas() {
      if (!canvas) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX || e.pageX) - rect.left,
        y: (e.clientY || e.pageY) - rect.top
      };
    }

    function startDraw(e) {
      isDrawing = true;
      const { x, y } = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    function draw(e) {
      if (!isDrawing) return;
      const { x, y } = getCoords(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    function stopDraw() {
      if (!isDrawing) return;
      isDrawing = false;
      ctx.closePath();
    }

    function setColor(color) {
      currentColor = color;
    }

    function clearCanvas() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function updateTracer() {
      const item = alphabet[currentIndex];
      if (!item) return;
      document.getElementById('tracerLetterBadge').innerText = item.letter;
      document.getElementById('tracerWordText').innerText = item.emoji + ' ' + item.word;
      document.getElementById('bgLetterGuide').innerText = item.letter;
      clearCanvas();
    }

    function nextLetter() {
      currentIndex = (currentIndex + 1) % alphabet.length;
      updateTracer();
    }

    function prevLetter() {
      currentIndex = (currentIndex - 1 + alphabet.length) % alphabet.length;
      updateTracer();
    }

    function downloadCanvasImage() {
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = 'trazo_letra_' + alphabet[currentIndex].letter + '.png';
      link.href = canvas.toDataURL();
      link.click();
    }

    /* Mini-Game Logic */
    let currentGameTarget = null;

    function nextGameQuestion() {
      const target = alphabet[Math.floor(Math.random() * alphabet.length)];
      currentGameTarget = target;

      document.getElementById('gameEmoji').innerText = target.emoji;
      document.getElementById('gameWord').innerText = '_' + target.word.slice(1);
      document.getElementById('gameFeedback').innerText = '';

      // Create 3 options (including the correct one)
      const options = [target];
      while (options.length < 3) {
        const rand = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!options.some(o => o.letter === rand.letter)) {
          options.push(rand);
        }
      }
      options.sort(() => Math.random() - 0.5);

      const optsContainer = document.getElementById('gameOptions');
      optsContainer.innerHTML = options.map(opt => \`
        <button class="game-option-btn" onclick="checkAnswer('\${opt.letter}')">
          <span style="font-size: 40px; font-weight: 900; color: #C62828;">\${opt.letter}</span>
          <span style="font-size: 14px; color: #5D4037;">\${opt.word}</span>
        </button>
      \`).join('');
    }

    function checkAnswer(letter) {
      const fb = document.getElementById('gameFeedback');
      if (letter === currentGameTarget.letter) {
        fb.innerHTML = '🎉 ¡CORRECTO! ¡Eres un pirata de verdad!';
        fb.style.color = '#2E7D32';
        document.getElementById('gameWord').innerText = currentGameTarget.word;
        setTimeout(nextGameQuestion, 1600);
      } else {
        fb.innerHTML = '❌ ¡Al agua! Prueba otra vez, grumete...';
        fb.style.color = '#C62828';
      }
    }

    window.onload = init;
  </script>
</body>
</html>`;
}
