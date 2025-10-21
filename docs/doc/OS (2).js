### index.html

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Mi OS Web — Kit Completo</title>
  <link rel="stylesheet" href="OS.css" />
  <script defer src="OS.js"></script>
</head>
<body>

  <!-- Menú principal (inicio) -->
  <div id="menu-principal" class="ventana grande" data-window style="left:60px;top:60px;">
    <div class="topbar" onmousedown="startDrag(event,'menu-principal')">
      <span>🌟 Menú Principal</span>
      <div class="topbar-controls">
        <button onclick="minimizar('menu-principal')">—</button>
        <button onclick="cerrar('menu-principal')">✖</button>
      </div>
    </div>
    <div class="contenido">
      <h2>Aplicaciones</h2>
      <div class="apps-lista">
        <button onclick="abrir('browser')">🌐 Navegador</button>
        <button onclick="abrir('archivos')">📁 Archivos</button>
        <button onclick="abrir('media')">▶ Reproductor</button>
        <button onclick="abrir('terminal')">⌘ Terminal</button>
        <button onclick="abrir('config')">⚙️ Configuración</button>
        <button onclick="crearVentana('Nota','<textarea style=&quot;width:100%;height:120px;&quot; placeholder=&quot;Escribe...&quot;></textarea>')">📝 Nota</button>
      </div>
    </div>
  </div>

  <!-- Browser -->
  <div id="browser" class="ventana small" data-window style="display:none;left:120px;top:80px;">
    <div class="topbar" onmousedown="startDrag(event,'browser')">
      <span>🌐 Navegador</span>
      <div class="topbar-controls">
        <button onclick="minimizar('browser')">—</button>
        <button onclick="cerrar('browser')">✖</button>
      </div>
    </div>
    <div class="contenido">
      <div class="browser-controls">
        <input id="url-browser" placeholder="URL o búsqueda..." onkeydown="if(event.key==='Enter') cargarSitio()" />
        <button onclick="cargarSitio()">Ir</button>
      </div>
      <iframe id="visor-browser" sandbox="allow-same-origin allow-forms allow-scripts" title="Visor"></iframe>
      <p class="hint">Si un sitio bloquea iframe, verás espacio en blanco. Usa URL que permitan embed.</p>
    </div>
  </div>

  <!-- Archivos -->
  <div id="archivos" class="ventana small" data-window style="display:none;left:180px;top:120px;">
    <div class="topbar" onmousedown="startDrag(event,'archivos')">
      <span>📁 Archivos</span>
      <div class="topbar-controls">
        <button onclick="minimizar('archivos')">—</button>
        <button onclick="cerrar('archivos')">✖</button>
      </div>
    </div>
    <div class="contenido">
      <p>Selecciona archivos o usa acceso directo (si el navegador lo soporta).</p>
      <div class="file-controls">
        <input type="file" id="file-input" multiple onchange="leerArchivos(event)" />
        <button onclick="openDirectory()" title="Abrir carpeta (si está soportado)">📂 Abrir carpeta</button>
      </div>
      <div id="file-list"></div>
    </div>
  </div>

  <!-- Media player -->
  <div id="media" class="ventana small" data-window style="display:none;left:240px;top:160px;">
    <div class="topbar" onmousedown="startDrag(event,'media')">
      <span>▶ Reproductor</span>
      <div class="topbar-controls">
        <button onclick="minimizar('media')">—</button>
        <button onclick="cerrar('media')">✖</button>
      </div>
    </div>
    <div class="contenido">
      <input type="file" id="media-input" accept="audio/*,video/*" multiple onchange="cargarMedia(event)" />
      <div id="playlist"></div>
      <div id="player-area">
        <video id="video-player" controls style="width:100%;display:none;"></video>
        <audio id="audio-player" controls style="width:100%;display:none;"></audio>
      </div>
    </div>
  </div>

  <!-- Terminal -->
  <div id="terminal" class="ventana small" data-window style="display:none;left:300px;top:200px;">
    <div class="topbar" onmousedown="startDrag(event,'terminal')">
      <span>⌘ Terminal</span>
      <div class="topbar-controls">
        <button onclick="minimizar('terminal')">—</button>
        <button onclick="cerrar('terminal')">✖</button>
      </div>
    </div>
    <div class="contenido term-body">
      <div id="term-output" class="term-output"></div>
      <div class="term-input-line">
        <span class="prompt">user@webos:~$</span>
        <input id="term-input" class="term-input" autocomplete="off" />
      </div>
      <div style="margin-top:8px">
        <button onclick="runRemoteExample()">Ejecutar npm (ejemplo)</button>
      </div>
    </div>
  </div>

  <!-- Configuración -->
  <div id="config" class="ventana small" data-window style="display:none;left:360px;top:80px;">
    <div class="topbar" onmousedown="startDrag(event,'config')">
      <span>⚙️ Configuración</span>
      <div class="topbar-controls">
        <button onclick="minimizar('config')">—</button>
        <button onclick="cerrar('config')">✖</button>
      </div>
    </div>
    <div class="contenido">
      <label><input id="persist-state" type="checkbox" /> Guardar posiciones (localStorage)</label>
      <div style="margin-top:8px">
        <label>Tema:
          <select id="theme-select" onchange="applyTheme(this.value)">
            <option value="dark">Oscuro</option>
            <option value="light">Claro</option>
          </select>
        </label>
      </div>
      <div style="margin-top:8px">
        <label><input id="show-fps" type="checkbox" onchange="toggleFPS()" /> Mostrar FPS</label>
      </div>
      <div style="margin-top:8px">
        <button onclick="exportConfig()">Exportar configuración</button>
        <button onclick="importConfig()">Importar configuración</button>
        <button onclick="resetPositions()">Reset posiciones</button>
      </div>
      <div style="margin-top:8px;font-size:13px;color:#aaa">
        Nota: File System Access API tiene soporte variable; en navegadores Chromium está disponible y en otros puede no estarlo.
      </div>
    </div>
  </div>

  <!-- Contenedor para ventanas dinámicas -->
  <div id="windows-container"></div>

  <!-- Taskbar -->
  <div class="barra-inferior" id="taskbar">
    <div class="taskbar-left">
      <button onclick="abrir('menu-principal')" class="inicio">🪟 Inicio</button>
      <input id="buscador" placeholder="Buscar o escribir URL..." onkeydown="if(event.key==='Enter') quickSearch()" />
      <button onclick="quickSearch()">🔍</button>
    </div>
    <div class="taskbar-center" id="taskbar-windows"></div>
    <div class="taskbar-right">
      <button onclick="mostrarEscritorio()" title="Mostrar escritorio">🗔</button>
      <div id="fps" class="reloj" title="FPS y uso"></div>
      <div id="reloj" class="reloj" title="Hora Centro México"></div>
    </div>
  </div>

</body>
</html>
```

---

### OS.css

```css
:root{
  --bg:#111218; --window:#1f2226; --topbar:#2b2f33; --accent:#16a085; --muted:#9aa;
  --text:#eaeef0; --glass:rgba(255,255,255,0.03);
}
*{box-sizing:border-box}
html,body{height:100%;margin:0;font-family:Inter,Segoe UI,Arial,sans-serif;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased}
.ventana{position:absolute;display:block;width:420px;background:var(--window);border-radius:8px;border:1px solid rgba(255,255,255,0.03);box-shadow:0 10px 30px rgba(0,0,0,0.6);overflow:hidden}
.ventana.small{width:420px}
.ventana.grande{width:620px;height:460px}
.topbar{background:linear-gradient(180deg,var(--topbar),#333);padding:8px 10px;display:flex;align-items:center;justify-content:space-between;cursor:move;user-select:none}
.topbar span{font-weight:600}
.topbar-controls{display:flex;gap:6px}
.topbar-controls button{background:transparent;border:none;color:var(--text);padding:4px 8px;border-radius:6px;cursor:pointer}
.contenido{padding:12px;font-size:14px}
.apps-lista{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.apps-lista button{background:#2b2b2b;border:none;padding:8px 10px;border-radius:8px;color:var(--text);cursor:pointer}
.browser-controls{display:flex;gap:8px;align-items:center}
.browser-controls input{flex:1;padding:8px;border-radius:8px;border:none;background:#222;color:var(--text)}
.browser-controls button{padding:8px 12px;border-radius:8px;border:none;background:var(--accent);color:#042;cursor:pointer}
.hint{color:var(--muted);font-size:12px;margin-top:8px}

/* Terminal */
.term-body{font-family:monospace}
.term-output{height:160px;overflow:auto;background:#05060a;padding:8px;border-radius:6px;border:1px solid #0b1720;color:#cfe8d6}
.term-line{white-space:pre-wrap;margin-bottom:6px}
.term-input-line{display:flex;gap:8px;align-items:center;margin-top:8px}
.prompt{color:#66e0a3;font-weight:700}
.term-input{flex:1;background:transparent;border:none;color:inherit;outline:none;font-family:monospace}

/* File list */
#file-list{margin-top:8px;display:flex;flex-direction:column;gap:6px}
.file-item{background:#141618;padding:8px;border-radius:6px;border:1px solid rgba(255,255,255,0.02);display:flex;justify-content:space-between;align-items:center}

/* Player */
#player-area video,#player-area audio{border-radius:6px;background:#000}
#playlist{margin-top:8px;display:flex;flex-direction:column;gap:6px}
.play-item{display:flex;justify-content:space-between;align-items:center;padding:8px;border-radius:6px;background:#141618}

/* Taskbar */
.barra-inferior{position:fixed;left:0;right:0;bottom:0;height:56px;background:#0f1113;display:flex;align-items:center;justify-content:space-between;padding:6px 12px;gap:12px;z-index:9999;box-shadow:0 -8px 24px rgba(0,0,0,0.6)}
.taskbar-left{display:flex;align-items:center;gap:8px}
.taskbar-left input{padding:8px;border-radius:8px;border:none;background:#161718;color:var(--text);width:220px}
.taskbar-left button{background:#222;border:none;padding:8px 10px;border-radius:8px;color:var(--text);cursor:pointer}
.taskbar-center{display:flex;align-items:center;gap:6px;flex:1;justify-content:center;overflow:auto;padding:0 8px}
.task-btn{display:flex;align-items:center;gap:8px;padding:6px 10px;background:#202225;border-radius:8px;color:var(--text);cursor:pointer;border:none;min-width:90px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.task-btn.active{background:linear-gradient(90deg,var(--accent),#16a085);color:#042;box-shadow:0 6px 18px rgba(0,0,0,0.6)}
.taskbar-right{display:flex;align-items:center;gap:8px}
.reloj{min-width:120px;text-align:right;color:var(--muted);font-weight:600}

/* Responsive */
@media (max-width:820px){
  .ventana{width:90%;left:5% !important;top:60px !important}
  .taskbar-left input{width:120px}
  .taskbar-center{display:none}
}
@media (max-width:420px){
  .topbar span{font-size:14px}
  .barra-inferior{height:64px;padding:10px}
  .taskbar-left input{display:none}
}
```

---

### OS.js

```js
// OS.js - sistema principal
let zIndexCounter = 100, windowCount = 0;
const windowsStateKey = 'mi_os_windows_state';
let persistState = false;

// ------- Inicialización -------
document.addEventListener('DOMContentLoaded', () => {
  // reloj y fps
  setInterval(actualizarReloj, 1000);
  actualizarReloj();
  initFPS();

  // persist checkbox
  const chk = document.getElementById('persist-state');
  if (chk) {
    persistState = chk.checked;
    chk.addEventListener('change', () => {
      persistState = chk.checked;
      if (!persistState) localStorage.removeItem(windowsStateKey);
      savePositions();
    });
  }

  // registrar ventanas existentes en taskbar
  document.querySelectorAll('[data-window]').forEach(w => {
    if (!w.id) w.id = 'win-' + Math.random().toString(36).slice(2,8);
    registerWindowForTaskbar(w, { title: w.querySelector('.topbar span')?.textContent || w.id });
  });

  // restaurar posiciones
  const saved = localStorage.getItem(windowsStateKey);
  if (saved) {
    try {
      const obj = JSON.parse(saved);
      Object.keys(obj).forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.left = obj[id].left; el.style.top = obj[id].top; el.style.display = obj[id].display || ''; }
      });
    } catch (e) { console.warn('no se cargo estado', e) }
  }

  // terminal init
  initTerminal();
});

// ---------- Ventanas básicas ----------
function abrir(id){
  const el = document.getElementById(id);
  if (!el) return console.warn('No existe ventana', id);
  el.style.display = 'block';
  bringToFront(el);
  updateTaskActiveState();
}
function cerrar(id){
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'none';
  savePositions();
  updateTaskActiveState();
}
function minimizar(id){
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'none';
  savePositions();
  updateTaskActiveState();
}
function bringToFront(el){ zIndexCounter++; el.style.zIndex = zIndexCounter; setActiveWindow(el.id); savePositions(); }

// ---------- Drag ----------
let dragData = null;
function startDrag(e,id){
  const el = document.getElementById(id); if(!el) return;
  bringToFront(el);
  const rect = el.getBoundingClientRect();
  dragData = { el, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top };
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  e.preventDefault();
}
function onDrag(e){ if(!dragData) return; const {el,offsetX,offsetY} = dragData; el.style.left = (e.clientX - offsetX) + 'px'; el.style.top = (e.clientY - offsetY) + 'px'; }
function stopDrag(){ if(!dragData) return; document.removeEventListener('mousemove', onDrag); document.removeEventListener('mouseup', stopDrag); dragData = null; savePositions(); }
window.startDrag = startDrag;

// ---------- Dinámicas ----------
function crearVentana(titulo, htmlContenido){
  windowCount++;
  const id = 'vent-' + windowCount;
  const win = document.createElement('div'); win.className = 'ventana small'; win.id = id; win.setAttribute('data-window',''); win.style.display='block';
  win.style.left = (100 + windowCount*18) + 'px'; win.style.top = (100 + windowCount*18) + 'px'; win.style.zIndex = ++zIndexCounter;
  const top = document.createElement('div'); top.className='topbar'; top.onmousedown = e => startDrag(e,id);
  const span = document.createElement('span'); span.textContent = titulo;
  const ctr = document.createElement('div'); ctr.className='topbar-controls';
  const bMin = document.createElement('button'); bMin.textContent='—'; bMin.onclick = () => { win.style.display='none'; savePositions(); };
  const bClose = document.createElement('button'); bClose.textContent='✖'; bClose.onclick = () => { win.remove(); removeTaskButton(id); savePositions(); };
  ctr.append(bMin,bClose); top.append(span,ctr);
  const cont = document.createElement('div'); cont.className='contenido'; cont.innerHTML = htmlContenido;
  win.append(top,cont); document.body.appendChild(win);
  registerWindowForTaskbar(win,{title});
  savePositions();
  return id;
}
window.crearVentana = crearVentana;

// ---------- Taskbar ----------
const taskbarContainer = () => document.getElementById('taskbar-windows');
function registerWindowForTaskbar(winEl, opts = {}) {
  if (!winEl || !winEl.id) return;
  if (document.getElementById('task-btn-' + winEl.id)) return;
  const btn = document.createElement('button'); btn.className='task-btn'; btn.id = 'task-btn-' + winEl.id;
  const iconSpan = document.createElement('span'); iconSpan.className='icon'; iconSpan.innerHTML = opts.icon || '▣';
  const label = document.createElement('span'); label.className='label'; label.textContent = opts.title || (winEl.querySelector('.topbar span')?.textContent || winEl.id);
  btn.append(iconSpan,label);
  btn.onclick = () => toggleMinimize(winEl.id);
  btn.oncontextmenu = (e) => { e.preventDefault(); const choice = confirm('Cerrar "'+label.textContent+'"? Aceptar=cerrar, Cancelar=minimizar/restaurar'); if(choice){ cerrar(winEl.id); removeTaskButton(winEl.id);} else toggleMinimize(winEl.id); };
  taskbarContainer().appendChild(btn);
  updateTaskActiveState();
}
function removeTaskButton(winId){ const btn = document.getElementById('task-btn-' + winId); if(btn) btn.remove(); }
function toggleMinimize(winId){ const el=document.getElementById(winId); if(!el) return; if(el.style.display==='none' || getComputedStyle(el).display==='none'){ el.style.display='block'; bringToFront(el); setActiveWindow(winId); } else { el.style.display='none'; clearActiveWindow(winId); } savePositions(); updateTaskActiveState();}
function setActiveWindow(winId){ document.querySelectorAll('.task-btn').forEach(b=>b.classList.remove('active')); const b=document.getElementById('task-btn-'+winId); if(b) b.classList.add('active'); }
function clearActiveWindow(winId){ const b=document.getElementById('task-btn-'+winId); if(b) b.classList.remove('active'); }
function updateTaskActiveState(){ document.querySelectorAll('[data-window]').forEach(w=>{ if(!w.id) return; if(!document.getElementById('task-btn-'+w.id)) registerWindowForTaskbar(w,{title:w.querySelector('.topbar span')?.textContent||w.id}); }); const maxZ = getMaxZIndex(); document.querySelectorAll('[data-window]').forEach(w=>{ if(parseInt(w.style.zIndex||0,10)===maxZ) setActiveWindow(w.id); }); }
function getMaxZIndex(){ let max=0; document.querySelectorAll('[data-window]').forEach(w=>{ const z=parseInt(w.style.zIndex||0,10); if(z>max) max=z; }); return max; }
function mostrarEscritorio(){ const wins = document.querySelectorAll('[data-window]'); let anyVisible=false; wins.forEach(w=>{ if(w.style.display !== 'none' && getComputedStyle(w).display !== 'none') anyVisible=true; }); if(anyVisible){ wins.forEach(w=>{ w.dataset.prevDisplay = w.style.display || ''; w.style.display='none'; }); } else { wins.forEach(w=>{ w.style.display = w.dataset.prevDisplay || 'block'; delete w.dataset.prevDisplay; }); } updateTaskActiveState(); }

// ---------- Save / Restore ----------
function savePositions(){
  const nodes = document.querySelectorAll('[data-window]');
  const obj = {};
  nodes.forEach(n=>{ if(!n.id) return; obj[n.id] = { left: n.style.left || '', top: n.style.top || '', display: n.style.display || '' }; });
  if (persistState) localStorage.setItem(windowsStateKey, JSON.stringify(obj)); else sessionStorage.setItem(windowsStateKey, JSON.stringify(obj));
}

// ---------- Buscador rápido ----------
function quickSearch(){
  const q = document.getElementById('buscador').value.trim(); if(!q) return;
  const isUrl
