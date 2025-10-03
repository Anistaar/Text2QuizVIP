// src/main.ts
// Entraînement & Examen avec rattrapage 100%,
// Leitner adaptatif (gravité de l'erreur), priorisation des due,
// bouton Valider piloté par le DOM, thèmes (5e colonne), déduplication, stats par thèmes.

import { parseQuestions, isCorrect, correctText, countCorrect } from './parser';
import { shuffleInPlace } from './shuffle';
import type { Mode, Question, UserAnswer } from './types';
import { toTitleCase, norm, keyForQuestion, dedupeQuestions } from './utils';
import { courses, getThemesForCourse } from './courses';
import { loadStats, saveStats, updateStatAfterAnswer, computeSeverity, isDue } from './scheduling';

const $ = (sel: string, root: Document | HTMLElement = document) =>
  root.querySelector(sel) as HTMLElement | null;
const $$ = (sel: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll(sel)) as HTMLElement[];

/* course discovery & helpers moved to src/courses.ts and src/utils.ts */

/* =========================
   Éléments UI
   ========================= */
const els = {
  selectMatiere: $('#matiere') as HTMLSelectElement | null,
  selectCours: $('#cours') as HTMLSelectElement,
  selectThemes: $('#themes') as HTMLSelectElement,
  inputNombre: $('#nombre') as HTMLInputElement,
  radiosMode: $$('input[name="mode"]') as HTMLInputElement[],
  btnStart: $('#start') as HTMLButtonElement,
  root: $('#quiz-root') as HTMLDivElement,
  themeToggle: $('#theme-toggle') as HTMLInputElement
};

const elsExtra = {
  btnExplorer: $('#btn-explorer') as HTMLButtonElement | null,
  fileBrowser: $('#file-browser') as HTMLDivElement | null,
  fbFolders: $('#fb-folders') as HTMLDivElement | null,
  fbFiles: $('#fb-files') as HTMLDivElement | null,
  fbClose: $('#fb-close') as HTMLButtonElement | null,
  qcmView: $('#qcm-view') as HTMLDivElement | null,
  qcmRoot: $('#qcm-root') as HTMLDivElement | null,
  qcmClose: $('#qcm-close') as HTMLButtonElement | null
};

/* =========================
   State
   ========================= */
type State = {
  mode: Mode;
  file: string;
  n: number;

  questions: Question[];
  userAnswers: UserAnswer[];
  correctMap: (boolean | null)[];

  index: number;
  corrige: boolean;
  lastCorrect: boolean;

  selectedThemes: string[];

  round: number;
  allPool: Question[];
  // timestamp when current question was shown (performance.now())
  questionStart?: number | null;
};

const state: State = {
  mode: 'entrainement',
  file: '',
  n: 10,
  questions: [],
  userAnswers: [],
  correctMap: [],
  index: 0,
  corrige: false,
  lastCorrect: false,
  selectedThemes: [],
  round: 1,
  allPool: [],
  questionStart: null,
};

/* =========================2
   Thème sombre / clair
   ========================= */
initTheme();
function initTheme() {
  const prefersDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem('t2q-theme');
  const isDark = saved ? saved === 'dark' : prefersDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  if (els.themeToggle) els.themeToggle.checked = isDark;
  els.themeToggle?.addEventListener('change', () => {
    const dark = !!els.themeToggle.checked;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('t2q-theme', dark ? 'dark' : 'light');
  });
}

/* =========================
   Déduplication
   ========================= */
// ...utils (norm/keyForQuestion/dedupeQuestions) moved to src/utils.ts

/* =========================
   Choix cours & thèmes
   ========================= */
populateMatiereAndCourseSelects();
function populateMatiereAndCourseSelects() {
  // Remplir la liste des matières (dossiers)
  const folders = Array.from(new Set(courses.map((c) => c.folder))).sort((a, b) => a.localeCompare(b));
  if (els.selectMatiere) {
    els.selectMatiere.innerHTML = '';
    const optAll = document.createElement('option');
    optAll.value = '';
    optAll.textContent = '— Toutes les matières —';
    els.selectMatiere.appendChild(optAll);
    for (const f of folders) {
      const opt = document.createElement('option');
      opt.value = f;
      opt.textContent = f;
      els.selectMatiere.appendChild(opt);
    }
    // on change, remplir les cours
    els.selectMatiere.addEventListener('change', () => populateCourseSelect(els.selectMatiere!.value));
  }

  // remplir les cours (toutes au départ)
  populateCourseSelect('');
}

function populateCourseSelect(folderFilter: string) {
  if (!els.selectCours) return;
  els.selectCours.innerHTML = '';
  const filtered = folderFilter ? courses.filter((c) => c.folder === folderFilter) : courses;
  if (filtered.length === 0) {
    const opt = document.createElement('option');
    opt.disabled = true;
    opt.textContent = '— Aucun cours —';
    els.selectCours.appendChild(opt);
    return;
  }
  for (const c of filtered) {
    const opt = document.createElement('option');
    // Use the full path as the value so it's unique across folders
    opt.value = c.path;
    opt.textContent = `${c.label}${folderFilter ? '' : ` (${c.folder})`}`;
    els.selectCours.appendChild(opt);
  }
  // sélection par défaut première entrée
  els.selectCours.value = filtered[0].path;
  state.file = filtered[0].path;
  loadCourseForThemes(state.file);
}

els.selectCours?.addEventListener('change', () => {
  state.file = els.selectCours.value;
  loadCourseForThemes(state.file);
});

function loadCourseForThemes(filename: string) {
  const course = courses.find((c) => c.path === filename || c.file === filename);
  if (!course) {
    fillThemes([]);
    return;
  }
  const parsed = parseQuestions(course.content);
  const unique = dedupeQuestions(parsed);
  const set = new Set<string>();
  unique.forEach((q) => (q.tags ?? []).forEach((t) => set.add(t)));
  fillThemes(Array.from(set).sort((a, b) => a.localeCompare(b)));
}

// ---- File browser modal ----
function openFileBrowser() {
  if (!elsExtra.fileBrowser || !elsExtra.fbFiles || !elsExtra.fbFolders) return;
  elsExtra.fbFiles.innerHTML = '';
  elsExtra.fbFolders.innerHTML = '';
  // toolbar with category filter
  const toolbar = document.createElement('div');
  toolbar.className = 'fb-toolbar';
  const sel = document.createElement('select');
  sel.innerHTML = `<option value="">Tous les thèmes</option><option value="classique">Classique</option><option value="marginaliste">Marginaliste</option><option value="autre">Autre</option>`;
  toolbar.appendChild(sel);
  elsExtra.fbFiles.appendChild(toolbar);
  // group courses by folder
  const map = new Map<string, typeof courses>();
  for (const c of courses) {
    const arr = map.get(c.folder) || [];
    arr.push(c);
    map.set(c.folder, arr);
  }
  // render folders (left)
  for (const [folder, list] of map) {
    const f = document.createElement('div');
    f.className = 'fb-folder';
    f.style.padding = '6px';
    f.style.cursor = 'pointer';
    f.textContent = folder;
  f.addEventListener('click', () => {
      // highlight selection
      Array.from(elsExtra.fbFolders!.children).forEach(ch => ch.classList.remove('active'));
      f.classList.add('active');
      // render files as draggable grid
      renderFilesGridForFolder(folder, list);
    });
    elsExtra.fbFolders.appendChild(f);
  }
  elsExtra.fileBrowser.style.display = 'block';
}
function closeFileBrowser() { if (elsExtra.fileBrowser) elsExtra.fileBrowser.style.display = 'none'; }
elsExtra.btnExplorer?.addEventListener('click', openFileBrowser);
elsExtra.fbClose?.addEventListener('click', closeFileBrowser);

// Layout persistence helpers
function layoutKeyFor(folder: string) { return `t2q_layout_${folder.replace(/[^a-z0-9]/gi, '_')}`; }
function saveLayout(folder: string, layout: string[][]) { localStorage.setItem(layoutKeyFor(folder), JSON.stringify(layout)); }
function loadLayout(folder: string): string[][] | null {
  try { return JSON.parse(localStorage.getItem(layoutKeyFor(folder)) || 'null'); } catch { return null; }
}

// Render files as draggable grid with rows (layout = array of rows, each row array of file paths)
function renderFilesGridForFolder(folder: string, list: typeof courses) {
  if (!elsExtra.fbFiles) return;
  elsExtra.fbFiles.innerHTML = '';
  const existingLayout = loadLayout(folder);
  let layout: string[][];
  if (existingLayout) {
    layout = existingLayout;
  } else {
    // default: single row with all files
    layout = [list.map(c => c.path)];
  }

  const grid = document.createElement('div');
  grid.style.display = 'flex';
  grid.style.flexDirection = 'column';
  grid.style.gap = '8px';

  // helper to create a row container
  function makeRow(rowIdx: number, rowFiles: string[]) {
    const row = document.createElement('div');
    row.className = 'fb-row';
    row.style.display = 'flex';
    row.style.gap = '8px';
    row.style.alignItems = 'stretch';
    row.style.minHeight = '48px';
    row.style.border = '1px dashed var(--brd)';
    row.style.padding = '6px';
    row.dataset.row = String(rowIdx);

    // adjust card width to fill row based on count
    const count = Math.max(1, rowFiles.length);
    const cardWidth = `calc(${Math.floor(100 / count)}% - ${8 * (count - 1) / count}px)`;

    for (const p of rowFiles) {
      const c = list.find(x => x.path === p);
      if (!c) continue;
      const card = document.createElement('div');
      card.className = 'fb-card';
      card.draggable = true;
      card.style.flex = `0 0 ${cardWidth}`;
      card.style.border = '1px solid var(--brd)';
      card.style.padding = '8px';
      card.style.borderRadius = '6px';
      card.style.background = 'transparent';
      card.textContent = c.label;
      card.dataset.path = c.path;

      card.addEventListener('dragstart', (e) => {
        (e.dataTransfer as any).setData('text/plain', c.path);
        card.classList.add('dragging');
      });
      card.addEventListener('dragend', () => { card.classList.remove('dragging'); });

      // click behavior: open and start directly
      card.addEventListener('click', async () => {
        state.file = c.path;
        if (els.selectMatiere) els.selectMatiere.value = c.folder;
        populateCourseSelect(c.folder);
        els.selectCours.value = c.path;
        await start();
        openQcmView();
        closeFileBrowser();
      });

      row.appendChild(card);
    }

    // allow drop on row
    row.addEventListener('dragover', (e) => { e.preventDefault(); row.classList.add('drag-over'); });
    row.addEventListener('dragleave', () => { row.classList.remove('drag-over'); });
    row.addEventListener('drop', (e) => {
      e.preventDefault(); row.classList.remove('drag-over');
      const path = (e.dataTransfer as any).getData('text/plain');
      if (!path) return;
      // remove from old row
      for (const r of layout) { const idx = r.indexOf(path); if (idx !== -1) { r.splice(idx, 1); break; } }
      // insert into this row at end
      layout[rowIdx].push(path);
      // cleanup empty rows
      layout = layout.filter(r => r.length > 0);
      saveLayout(folder, layout);
      // re-render
      renderFilesGridForFolder(folder, list);
    });

    return row;
  }

  // build rows
  layout.forEach((rowFiles, i) => grid.appendChild(makeRow(i, rowFiles)));

  // control to add a new empty row
  const addRowBtn = document.createElement('button');
  addRowBtn.className = 'secondary';
  addRowBtn.textContent = 'Ajouter une ligne';
  addRowBtn.addEventListener('click', () => {
    layout.push([]);
    saveLayout(folder, layout);
    renderFilesGridForFolder(folder, list);
  });

  elsExtra.fbFiles.appendChild(grid);
  elsExtra.fbFiles.appendChild(addRowBtn);
}

function openQcmView() {
// ---- QCM full-page viewer ----
  if (!elsExtra.qcmView || !elsExtra.qcmRoot) return;
  const q = state.questions[state.index];
  if (!q) return;
  // render a big version of current question
  elsExtra.qcmRoot.innerHTML = `
    <div class="card--q">
      <h3>Question ${state.index + 1}</h3>
      <div class="block">${escapeHtml(q.question)}</div>
      <div class="options">${(q.answers ?? []).map(a => `
        <label class="opt"><input type="radio" name="qcm-view" value="${escapeAttr(a.text)}"/> <span class="label">${escapeHtml(a.text)}</span></label>`).join('')}</div>
      <div style="margin-top:12px"><button id="qcm-validate" class="primary">Valider</button></div>
    </div>
  `;
  elsExtra.qcmView.style.display = 'block';
  // wire validate
  setTimeout(() => {
    $('#qcm-validate')?.addEventListener('click', () => {
      // copy selection into the regular DOM and trigger validation
      const v = (document.querySelector('input[name="qcm-view"]:checked') as HTMLInputElement | null)?.value ?? null;
      if (!v) return;
      // if original question is QCM, set the checkbox with same value
      // create a temporary selection in the regular DOM
      // Here we simulate choosing the same option by finding its checkbox in the main UI
      const boxes = Array.from(document.querySelectorAll('.options input[type="checkbox"]')) as HTMLInputElement[];
      boxes.forEach(b => { b.checked = (b.value === v); });
      // trigger validation if available
      ($('#btn-valider') as HTMLButtonElement | null)?.click();
      closeQcmView();
    });
  }, 0);
}
function closeQcmView() { if (elsExtra.qcmView) elsExtra.qcmView.style.display = 'none'; }
elsExtra.qcmClose?.addEventListener('click', closeQcmView);

// Add a small button to open QCM view when rendering QCMs
const origRenderQCM = renderQCM;
function renderQCM_wrap(head: string, q: Question) {
  origRenderQCM(head, q);
  const btn = document.createElement('button');
  btn.className = 'secondary';
  btn.style.marginLeft = '8px';
  btn.textContent = 'Ouvrir en page';
  setTimeout(() => {
    const actions = document.querySelector('.block.actions');
    if (actions) actions.appendChild(btn);
    btn.addEventListener('click', openQcmView);
  }, 0);
}
// replace the function used by render
(window as any).renderQCM = renderQCM_wrap;
function fillThemes(topics: string[]) {
  if (!els.selectThemes) return;
  els.selectThemes.innerHTML = '';
  if (topics.length === 0) {
    const opt = document.createElement('option');
    opt.disabled = true;
    opt.textContent = '— Aucun thème détecté —';
    els.selectThemes.appendChild(opt);
    return;
  }
  for (const t of topics) {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    els.selectThemes.appendChild(opt);
  }
}
function getSelectedThemes(): string[] {
  const opts = Array.from(els.selectThemes?.selectedOptions ?? []);
  return opts.map((o) => o.value).filter(Boolean);
}

/* =========================
   Lancement série
   ========================= */
function readMode(): Mode {
  const r = els.radiosMode.find((r) => (r as HTMLInputElement).checked) as HTMLInputElement;
  return (r?.value as Mode) ?? 'entrainement';
}
els.btnStart?.addEventListener('click', start);

async function start() {
  state.mode = readMode();
  state.n = Math.max(1, parseInt(els.inputNombre.value || '10', 10));
  state.selectedThemes = getSelectedThemes();

  const normalizePath = (s: string) => s.replace(/\\/g, '/');
  const want = normalizePath(state.file || '');
  let course = courses.find((c) => normalizePath(c.path) === want || normalizePath(c.file) === want);
  if (!course) {
    // try fuzzy match: endsWith
    course = courses.find((c) => normalizePath(c.path).endsWith(want) || want.endsWith(normalizePath(c.file)));
  }
  if (!course) {
    console.warn('Available course paths:', courses.map(c => c.path));
    return renderError(`Cours introuvable : ${state.file}`);
  }

  // Parse, dédup, filtre thèmes
  let pool = dedupeQuestions(parseQuestions(course.content));
  if (state.selectedThemes.length > 0) {
    pool = pool.filter((q) => (q.tags ?? []).some((t) => state.selectedThemes.includes(t)));
    pool = dedupeQuestions(pool);
  }
  if (pool.length === 0) return renderError('Aucune question ne correspond aux thèmes sélectionnés.');

  // Priorité aux cartes "dûes" (Leitner)
  const due = pool.filter(isDue);
  const fresh = pool.filter((q) => !isDue(q));
  shuffleInPlace(due);
  shuffleInPlace(fresh);

  const chosen: Question[] = [];
  for (const arr of [due, fresh]) {
    for (const q of arr) {
      if (chosen.length < state.n) chosen.push(q);
      else break;
    }
    if (chosen.length >= state.n) break;
  }

  state.allPool = pool.slice();
  state.questions = chosen;

  // Randomiser options & normaliser
  for (const q of state.questions) {
    normalizeAnswersInPlace(q);
    if ((q.type === 'QCM' || q.type === 'QR') && q.answers) shuffleInPlace(q.answers);
  }

  // Reset tour
  state.round = 1;
  resetRoundState(state.questions.length);

  render();
}

function resetRoundState(len: number) {
  state.index = 0;
  state.corrige = false;
  state.lastCorrect = false;
  state.userAnswers = new Array(len).fill(null) as any;
  state.correctMap = new Array(len).fill(null);
}

/* =========================
   Rendu UI
   ========================= */
function renderError(msg: string) {
  els.root.innerHTML = `<div class="card"><strong>Erreur :</strong> ${escapeHtml(msg)}</div>`;
  mountFloatingNext(false);
}

function progressBar(): string {
  const total = state.questions.length || 1;
  const cur = Math.min(state.index, total);
  const percent = Math.floor((cur / total) * 100);
  return `<div class="progress"><div class="progress__bar" style="width:${percent}%"></div></div>`;
}

function render() {
  const fin = state.index >= state.questions.length;

  const head = `
    <div class="head">
      <div><span class="badge">${escapeHtml(state.file)}</span></div>
      <div>Mode : <strong>${state.mode === 'entrainement' ? 'Entraînement' : 'Examen'}</strong></div>
      <div>Tour : <strong>${state.round}</strong></div>
      <div>Progression : <strong>${Math.min(state.index + 1, state.questions.length)} / ${state.questions.length}</strong></div>
    </div>
    ${progressBar()}
  `;

  if (fin) {
    mountFloatingNext(false);
    return handleEndOfRound(head);
  }

  const q = state.questions[state.index];
  normalizeAnswersInPlace(q);

  // démarrer le chrono pour la question affichée (si écran question)
  if (state.index < state.questions.length && !state.corrige) {
    try { state.questionStart = performance.now(); } catch { state.questionStart = Date.now(); }
  } else {
    state.questionStart = null;
  }

  if (q.type === 'QR') renderQR(head, q);
  else if (q.type === 'QCM') (window as any).renderQCM ? (window as any).renderQCM(head, q) : renderQCM(head, q);
  else if (q.type === 'VF') renderVF(head, q);
}

function helperText(q: Question): string {
  if (q.type === 'VF') return 'Choisis Vrai ou Faux.';
  const nb = countCorrect(q);
  if (q.type === 'QR') return 'Sélectionne la bonne réponse.';
  if (q.type === 'QCM') return nb > 1
    ? 'Plusieurs réponses possibles — coche toutes les bonnes.'
    : 'Une ou plusieurs réponses possibles.';
  return '';
}

/* ---------- écrans questions ---------- */
function renderQR(head: string, q: Question) {
  const opts = (q.answers ?? [])
    .map((a) => {
      let cls = 'opt';
      if (state.corrige) {
        const chosen = (state.userAnswers[state.index] as any)?.value === a.text;
        if (a.correct) cls += ' good';
        if (!a.correct && chosen) cls += ' bad';
      }
      return `
      <label class="${cls}">
        <input type="radio" name="qr" value="${escapeAttr(a.text)}" ${state.corrige ? 'disabled' : ''}/>
        <span class="label">${escapeHtml(a.text)}</span>
        ${state.corrige ? markIcon(a.correct, (state.userAnswers[state.index] as any)?.value === a.text) : ''}
      </label>`;
    })
    .join('');

  els.root.innerHTML = `
    ${head}
    <div class="card--q" id="qcard">
      <div class="qtitle">Question ${state.index + 1}</div>
      <div class="block">${escapeHtml(q.question)}</div>
      <div class="hint"><small class="muted">${helperText(q)}</small></div>
      <div class="options">${opts}</div>
      <div class="block actions">${renderActionButtons(q)}</div>
    </div>
  `;

  $$('input[name="qr"]').forEach((el) => el.addEventListener('change', updateButtonsFromDOM));
  bindValidateAndNext(q);
  updateButtonsFromDOM();
  document.getElementById('qcard')?.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderQCM(head: string, q: Question) {
  const existing = state.userAnswers[state.index]?.kind === 'QCM' ? (state.userAnswers[state.index] as any).values : [];
  const opts = (q.answers ?? [])
    .map((a) => {
      const checked = existing?.includes(a.text) ? 'checked' : '';
      let cls = 'opt';
      if (state.corrige) {
        if (a.correct) cls += ' good';
        if (!a.correct && existing?.includes(a.text)) cls += ' bad';
      }
      return `
      <label class="${cls}">
        <input type="checkbox" value="${escapeAttr(a.text)}" ${state.corrige ? 'disabled' : ''} ${checked}/>
        <span class="label">${escapeHtml(a.text)}</span>
        ${state.corrige ? markIcon(a.correct, existing?.includes(a.text)) : ''}
      </label>`;
    })
    .join('');

  els.root.innerHTML = `
    ${head}
    <div class="card--q" id="qcard">
      <div class="qtitle">Question ${state.index + 1}</div>
      <div class="block">${escapeHtml(q.question)}</div>
      <div class="hint"><small class="muted">${helperText(q)}</small></div>
      <div class="options">${opts}</div>
      <div class="block actions">${renderActionButtons(q)}</div>
    </div>
  `;

  $$('.options input[type="checkbox"]').forEach((el: any) =>
    el.addEventListener('change', updateButtonsFromDOM)
  );

  bindValidateAndNext(q);
  updateButtonsFromDOM();
  document.getElementById('qcard')?.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderVF(head: string, q: Question) {
  els.root.innerHTML = `
    ${head}
    <div class="card--q" id="qcard">
      <div class="qtitle">Question ${state.index + 1}</div>
      <div class="block">${escapeHtml(q.question)}</div>
      <div class="hint"><small class="muted">${helperText(q)}</small></div>
      <div class="options options--inline">
        <label class="opt">
          <input type="radio" name="vf" value="V" ${state.corrige ? 'disabled' : ''}/>
          <span>Vrai</span>
          ${state.corrige ? markIcon(q.vf === 'V', (state.userAnswers[state.index] as any)?.value === 'V') : ''}
        </label>
        <label class="opt">
          <input type="radio" name="vf" value="F" ${state.corrige ? 'disabled' : ''}/>
          <span>Faux</span>
          ${state.corrige ? markIcon(q.vf === 'F', (state.userAnswers[state.index] as any)?.value === 'F') : ''}
        </label>
      </div>
      <div class="block actions">${renderActionButtons(q)}</div>
    </div>
  `;

  $$('input[name="vf"]').forEach((el) => el.addEventListener('change', updateButtonsFromDOM));
  bindValidateAndNext(q);
  updateButtonsFromDOM();
  document.getElementById('qcard')?.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- boutons / feedback ---------- */
function renderActionButtons(q: Question): string {
  if (state.mode === 'entrainement') {
    return !state.corrige
      ? `<button class="primary" id="btn-valider" disabled>Valider</button>`
      : feedbackBlock(q, state.lastCorrect, q.type === 'QCM');
  }
  return `<button class="primary" id="btn-valider" disabled>Valider</button>`;
}

function bindValidateAndNext(q: Question) {
  const btn = $('#btn-valider') as HTMLButtonElement | null;
  btn?.addEventListener('click', () => {
    const { ok, ua } = getDOMAnswer(q);
    if (!ok || !ua) return;
    // mesurer le temps passé sur la question (ms)
    const start = state.questionStart ?? (performance.now ? performance.now() : Date.now());
    const elapsedMs = Math.max(0, Math.round((performance.now ? performance.now() : Date.now()) - start));
    // stocker la réponse
    (ua as any).timeMs = elapsedMs;
    state.userAnswers[state.index] = ua;

    const correct = computeIsCorrect(q, ua);
    const sev = computeSeverity(q, ua); // 0..1

    if (state.mode === 'entrainement') {
      state.lastCorrect = correct;
      state.correctMap[state.index] = correct;
      updateStatAfterAnswer(q, correct, sev, (ua as any).timeMs); // Leitner adaptatif + time
      state.corrige = true;
      render();
      mountFloatingNext(true);
    } else {
      state.corrige = false;
      // in examen mode, still record stats with time if present
      updateStatAfterAnswer(q, correct, sev, (ua as any).timeMs);
      suivant();
    }
  });

  mountFloatingNext(state.mode === 'entrainement' && state.corrige);
}

// Raccourcis clavier
let keyHandlerInstalled = false;
if (!keyHandlerInstalled) {
  document.addEventListener('keydown', (e) => {
    const btnVal = document.getElementById('btn-valider') as HTMLButtonElement | null;
    const fab = document.getElementById('fab-next') as HTMLButtonElement | null;
    if (e.key === 'Enter' && btnVal && !btnVal.disabled) {
      btnVal.click(); e.preventDefault();
    } else if ((e.key.toLowerCase() === 'n' || e.key === ' ') && fab && !fab.disabled && fab.style.display !== 'none') {
      fab.click(); e.preventDefault();
    }
  });
  keyHandlerInstalled = true;
}

function markIcon(isGood: boolean, wasChosen: boolean): string {
  if (isGood) return `<span class="mark mark--good" title="Bonne réponse">✓</span>`;
  if (wasChosen) return `<span class="mark mark--bad" title="Mauvais choix">✗</span>`;
  return '';
}

function feedbackBlock(q: Question, ok: boolean, multi = false): string {
  const title = ok ? 'Correct !' : 'Incorrect.';
  const good = `${multi ? 'Bonne(s) réponse(s)' : 'Bonne réponse'} : ${escapeHtml(correctText(q))}`;
  const hasExp = !!q.explication && q.explication.trim().length > 0;
  const nextBtn = `<button class="secondary" id="btn-suivant">Suivant</button>`;

  setTimeout(() => { $('#btn-suivant')?.addEventListener('click', suivant); }, 0);

  if (!hasExp) {
    return `
      <div class="feedback ${ok ? 'ok' : 'ko'}">
        <strong>${title}</strong>
        <div class="block"><strong>${good}</strong></div>
        ${nextBtn}
      </div>
    `;
  }
  return `
    <details class="feedback ${ok ? 'ok' : 'ko'}" open>
      <summary>${title} — <strong>${good}</strong></summary>
      <div class="block"><small class="muted">${escapeHtml(q.explication!)}</small></div>
      ${nextBtn}
    </details>
  `;
}

function mountFloatingNext(enabled: boolean) {
  let btn = document.getElementById('fab-next') as HTMLButtonElement | null;
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'fab-next';
    btn.className = 'fab-next';
    btn.textContent = 'Suivant';
    document.body.appendChild(btn);
    btn.addEventListener('click', suivant);
  }
  btn.disabled = !enabled;
  btn.style.display = enabled ? 'inline-flex' : 'none';
}

function suivant() {
  if (state.mode === 'entrainement' && !state.corrige) return;
  state.corrige = false;
  state.lastCorrect = false;
  state.index += 1;
  render();
}

/* =========================
   Fin de tour & rattrapage
   ========================= */
function handleEndOfRound(head: string) {
  const wrong: Question[] = [];

  if (state.mode === 'entrainement') {
    state.questions.forEach((q, i) => {
      if (state.correctMap[i] === false) wrong.push(q);
    });
  } else {
    state.questions.forEach((q, i) => {
      const ua = state.userAnswers[i];
      let correct = false, sev = 1;
      if (ua) {
        if (q.type === 'QR') correct = isCorrect(q, { value: ua.kind === 'QR' ? ua.value : null });
        else if (q.type === 'QCM') correct = isCorrect(q, { values: ua.kind === 'QCM' ? ua.values : [] });
        else if (q.type === 'VF') correct = isCorrect(q, { value: ua.kind === 'VF' ? ua.value : null });
        sev = computeSeverity(q, ua);
      }
      if (!correct) wrong.push(q);
      updateStatAfterAnswer(q, correct, sev);
    });
  }

  if (wrong.length > 0) {
    shuffleInPlace(wrong);
    for (const q of wrong) {
      normalizeAnswersInPlace(q);
      if ((q.type === 'QCM' || q.type === 'QR') && q.answers) shuffleInPlace(q.answers);
    }
    state.questions = wrong;
    state.round += 1;
    resetRoundState(wrong.length);

    els.root.innerHTML = `
      ${head}
      <div class="card">
        <h2>Rattrapage</h2>
        <p>Tu dois corriger ${wrong.length} question(s) avant de poursuivre.</p>
        <button class="primary" id="btn-continue">Reprendre</button>
      </div>
    `;
    $('#btn-continue')?.addEventListener('click', render);
    return;
  }

  return renderResultats(head);
}

/* =========================
   Résultats finaux + Stats par thèmes
   ========================= */
type ThemeStat = { theme: string; total: number; correct: number; accuracy: number; wrongIdx: number[] };

function themeKeyList(q: Question): string[] {
  const t = (q.tags ?? []).map(s => s.trim()).filter(Boolean);
  return (t.length > 0 ? t : ['(Sans thème)']);
}

function buildThemeStats(questions: Question[], userAnswers: UserAnswer[]): ThemeStat[] {
  const map = new Map<string, ThemeStat>();
  questions.forEach((q, i) => {
    const ua = userAnswers[i];
    let ok = false;
    if (ua) {
      if (q.type === 'QR') ok = isCorrect(q, { value: ua.kind === 'QR' ? ua.value : null });
      else if (q.type === 'QCM') ok = isCorrect(q, { values: ua.kind === 'QCM' ? ua.values : [] });
      else if (q.type === 'VF') ok = isCorrect(q, { value: ua.kind === 'VF' ? ua.value : null });
    }
    for (const th of themeKeyList(q)) {
      const cur = map.get(th) || { theme: th, total: 0, correct: 0, accuracy: 0, wrongIdx: [] };
      cur.total += 1;
      if (ok) cur.correct += 1; else cur.wrongIdx.push(i);
      map.set(th, cur);
    }
  });
  const arr = Array.from(map.values()).map(s => ({ ...s, accuracy: s.total ? s.correct / s.total : 0 }));
  arr.sort((a, b) => a.accuracy - b.accuracy); // prioriser les lacunes
  return arr;
}

function renderThemeStatsCard(stats: ThemeStat[]): string {
  if (stats.length === 0) return '';
  const rows = stats.map(s => `
    <tr>
      <td>${escapeHtml(s.theme)}</td>
      <td style="text-align:center">${s.correct} / ${s.total}</td>
      <td style="text-align:right">${Math.round(s.accuracy * 100)}%</td>
    </tr>
  `).join('');
  return `
    <div class="card">
      <h3>À approfondir par thèmes</h3>
      <p class="subtitle">Classement du plus faible taux de réussite au plus élevé.</p>
      <div style="overflow:auto">
        <table style="width:100%; border-collapse:collapse; font-size:14px">
          <thead>
            <tr>
              <th style="text-align:left; border-bottom:1px solid var(--brd); padding-bottom:6px">Thème</th>
              <th style="text-align:center; border-bottom:1px solid var(--brd)">Score</th>
              <th style="text-align:right; border-bottom:1px solid var(--brd)">Réussite</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <small class="muted">Astuce : relance une série en sélectionnant le(s) thème(s) du haut pour cibler les lacunes.</small>
    </div>
  `;
}

function renderResultats(head: string) {
  let score = 0;
  const items = state.questions
    .map((q, i) => {
      const ua = state.userAnswers[i];
      const ok =
        ua &&
        (q.type === 'QR'
          ? isCorrect(q, { value: ua.kind === 'QR' ? ua.value : null })
          : q.type === 'QCM'
          ? isCorrect(q, { values: ua.kind === 'QCM' ? ua.values : [] })
          : q.type === 'VF'
          ? isCorrect(q, { value: ua.kind === 'VF' ? ua.value : null })
          : false);
      if (ok) score++;

      const userText = (() => {
        if (!ua) return '(aucune réponse)';
        if (q.type === 'VF')
          return ua.kind === 'VF' ? (ua.value === 'V' ? 'Vrai' : 'Faux') : '(aucune réponse)';
        if (q.type === 'QR')
          return ua.kind === 'QR' ? (ua.value ?? '(aucune réponse)') : '(aucune réponse)';
        if (q.type === 'QCM')
          return ua.kind === 'QCM' ? ((ua.values ?? []).join(' | ') || '(aucune réponse)') : '(aucune réponse)';
        return '(aucune réponse)';
      })();

      return `
        <li class="${ok ? 'ok' : 'ko'}">
          <div class="qtitle">${i + 1}. ${escapeHtml(q.question)}</div>
          <div><strong>Ta réponse :</strong> ${escapeHtml(userText)}</div>
          <div><strong>Bonne réponse :</strong> ${escapeHtml(correctText(q))}</div>
          ${q.explication ? `<div class="block"><small class="muted">${escapeHtml(q.explication)}</small></div>` : ''}
        </li>
      `;
    })
    .join('');

  const themeStats = buildThemeStats(state.questions, state.userAnswers);
  const themeCard = renderThemeStatsCard(themeStats);

  els.root.innerHTML = `
    ${head}
    <div class="card">
      <h2>Série validée 🎉</h2>
      <p>Score du dernier tour : <strong>${score} / ${state.questions.length}</strong></p>
      <a class="primary" href="/">Revenir</a>
    </div>
    ${themeCard}
    <ol class="list">${items}</ol>
  `;

  mountFloatingNext(false);
}

/* =========================
   Helpers validation DOM
   ========================= */
function getDOMAnswer(q: Question): { ok: boolean; ua: UserAnswer | null } {
  if (q.type === 'VF') {
    const v = (document.querySelector('input[name="vf"]:checked') as HTMLInputElement | null)?.value as 'V'|'F'|undefined;
    return v ? { ok: true, ua: { kind: 'VF', value: v } } : { ok: false, ua: null };
  }
  if (q.type === 'QR') {
    const v = (document.querySelector('input[name="qr"]:checked') as HTMLInputElement | null)?.value ?? null;
    return v ? { ok: true, ua: { kind: 'QR', value: v } } : { ok: false, ua: null };
  }
  if (q.type === 'QCM') {
    const boxes = Array.from(document.querySelectorAll('.options input[type="checkbox"]')) as HTMLInputElement[];
    const values = boxes.filter(b => b.checked).map(b => b.value);
    return values.length > 0 ? { ok: true, ua: { kind: 'QCM', values } } : { ok: false, ua: null };
  }
  return { ok: false, ua: null };
}

function normalizeAnswersInPlace(q: Question) {
  if ((q.type === 'QCM' || q.type === 'QR') && q.answers) {
    q.answers = q.answers
      .map(a => ({ ...a, text: (a.text ?? '').trim() }))
      .filter(a => a.text.length > 0);
  }
}

function updateButtonsFromDOM() {
  const btn = document.getElementById('btn-valider') as HTMLButtonElement | null;
  if (!btn) return;
  const q = state.questions[state.index];
  const { ok } = getDOMAnswer(q);
  btn.disabled = !ok;
}

// scheduling functions moved to src/scheduling.ts

/* =========================
   Utils
   ========================= */
function computeIsCorrect(q: Question, ua: UserAnswer): boolean {
  if (q.type === 'QR') return isCorrect(q, { value: ua.kind === 'QR' ? ua.value : null });
  if (q.type === 'QCM') return isCorrect(q, { values: ua.kind === 'QCM' ? ua.values : [] });
  if (q.type === 'VF') return isCorrect(q, { value: ua.kind === 'VF' ? ua.value : null });
  return false;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
function escapeAttr(s: string): string {
  return s.replace(/"/g, '&quot;');
}

// Expose debug
(Object.assign(window as any, { t2q: { state } }));
