// src/main.ts
// Entraînement & Examen avec rattrapage 100%,
// Leitner adaptatif (gravité de l'erreur), priorisation des due,
// bouton Valider piloté par le DOM, thèmes (5e colonne), déduplication, stats par thèmes.

import { parseQuestions, isCorrect, correctText, countCorrect } from './parser';
import { shuffleInPlace } from './shuffle';
import type { Mode, Question, UserAnswer } from './types';

const $ = (sel: string, root: Document | HTMLElement = document) =>
  root.querySelector(sel) as HTMLElement | null;
const $$ = (sel: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll(sel)) as HTMLElement[];

/* =========================
   Auto-découverte des cours
   ========================= */
const COURSE_RAW = import.meta.glob('./cours/*.txt', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

type CourseItem = { file: string; label: string; content: string };
const courses: CourseItem[] = Object.entries(COURSE_RAW)
  .map(([path, content]) => {
    const file = path.split('/').pop()!;
    const base = file.replace(/\.txt$/i, '');
    const label = toTitleCase(base.replace(/[-_]/g, ' '));
    return { file, label, content };
  })
  .sort((a, b) => a.label.localeCompare(b.label));

function toTitleCase(s: string) {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}

/* =========================
   Éléments UI
   ========================= */
const els = {
  selectCours: $('#cours') as HTMLSelectElement,
  selectThemes: $('#themes') as HTMLSelectElement,
  inputNombre: $('#nombre') as HTMLInputElement,
  radiosMode: $$('input[name="mode"]') as HTMLInputElement[],
  btnStart: $('#start') as HTMLButtonElement,
  root: $('#quiz-root') as HTMLDivElement,
  themeToggle: $('#theme-toggle') as HTMLInputElement
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
  allPool: []
};

/* =========================
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
function norm(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}
function keyForQuestion(q: Question): string {
  let key = `${q.type}|${norm(q.question)}`;
  if (q.type === 'VF' && q.vf) key += `|${q.vf}`;
  if ((q.type === 'QCM' || q.type === 'QR') && q.answers) {
    const answers = q.answers
      .map((a) => `${a.correct ? '1' : '0'}:${norm(a.text)}`)
      .sort()
      .join(',');
    key += `|${answers}`;
  }
  return key;
}
function dedupeQuestions(arr: Question[]): Question[] {
  const seen = new Set<string>();
  const out: Question[] = [];
  for (const q of arr) {
    const k = keyForQuestion(q);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(q);
  }
  return out;
}

/* =========================
   Choix cours & thèmes
   ========================= */
populateCourseSelect();
function populateCourseSelect() {
  if (!els.selectCours) return;
  els.selectCours.innerHTML = '';
  for (const c of courses) {
    const opt = document.createElement('option');
    opt.value = c.file;
    opt.textContent = c.label;
    els.selectCours.appendChild(opt);
  }
  if (courses[0]) {
    els.selectCours.value = courses[0].file;
    state.file = courses[0].file;
    loadCourseForThemes(state.file);
  }
}
els.selectCours?.addEventListener('change', () => {
  state.file = els.selectCours.value;
  loadCourseForThemes(state.file);
});

function loadCourseForThemes(filename: string) {
  const course = courses.find((c) => c.file === filename);
  if (!course) { fillThemes([]); return; }
  const parsed = parseQuestions(course.content);
  const unique = dedupeQuestions(parsed);
  const set = new Set<string>();
  unique.forEach((q) => (q.tags ?? []).forEach((t) => set.add(t)));
  fillThemes(Array.from(set).sort((a, b) => a.localeCompare(b)));
}
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

  const course = courses.find((c) => c.file === state.file);
  if (!course) return renderError(`Cours introuvable : ${state.file}`);

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

  if (q.type === 'QR') renderQR(head, q);
  else if (q.type === 'QCM') renderQCM(head, q);
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
    state.userAnswers[state.index] = ua;

    const correct = computeIsCorrect(q, ua);
    const sev = computeSeverity(q, ua); // 0..1

    if (state.mode === 'entrainement') {
      state.lastCorrect = correct;
      state.correctMap[state.index] = correct;
      updateStatAfterAnswer(q, correct, sev); // Leitner adaptatif
      state.corrige = true;
      render();
      mountFloatingNext(true);
    } else {
      state.corrige = false;
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

/* =========================
   Gravité de l'erreur & Leitner adaptatif
   ========================= */
// Gravité ∈ [0,1] : 0 = parfait, 1 = pire
function computeSeverity(q: Question, ua: UserAnswer): number {
  if (q.type === 'VF') {
    return isCorrect(q, { value: ua.kind === 'VF' ? ua.value : null }) ? 0 : 1;
  }
  if (q.type === 'QR') {
    return isCorrect(q, { value: ua.kind === 'QR' ? ua.value : null }) ? 0 : 1;
  }
  if (q.type === 'QCM') {
    const all = q.answers ?? [];
    const correctSet = new Set(all.filter(a => a.correct).map(a => a.text));
    const wrongSet = new Set(all.filter(a => !a.correct).map(a => a.text));
    const chosen = new Set((ua.kind === 'QCM' ? ua.values : []) ?? []);
    let FP = 0, FN = 0;
    for (const v of chosen) if (wrongSet.has(v)) FP++;
    for (const v of correctSet) if (!chosen.has(v)) FN++;
    const N = Math.max(1, all.length);
    return (FP + FN) / N;
  }
  return 1;
}
function bucketizeSeverity(s: number): 'mild' | 'medium' | 'severe' {
  if (s <= 0.25) return 'mild';
  if (s <= 0.6) return 'medium';
  return 'severe';
}

type QStat = {
  box: number;        // 1..5
  streak: number;     // bonnes d'affilée depuis la dernière promotion
  last: number;       // timestamp
  next: number;       // échéance
  required: number;   // nb de bonnes nécessaires pour promouvoir
  lastSeverity?: number;
};
const LS_KEY = 't2q_stats_v2';

function requiredFromSeverityBucket(b: 'mild'|'medium'|'severe'): number {
  if (b === 'mild') return 1;   // petite erreur → montée facile
  if (b === 'medium') return 2; // moyenne → 2 bonnes
  return 3;                     // sévère → 3 bonnes
}

function loadStats(): Record<string, QStat> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
}
function saveStats(stats: Record<string, QStat>) {
  localStorage.setItem(LS_KEY, JSON.stringify(stats));
}
function schedule(box: number): number {
  const days = [0, 1, 3, 7, 14, 30];
  const d = days[Math.min(Math.max(box, 0), days.length - 1)];
  return Date.now() + d * 24 * 60 * 60 * 1000;
}

// Promotion/déclassement variables selon sévérité
function updateStatAfterAnswer(q: Question, correct: boolean, severity: number) {
  const id = keyForQuestion(q);
  const stats = loadStats();
  const cur: QStat = stats[id] || { box: 1, streak: 0, last: 0, next: 0, required: 1, lastSeverity: undefined };

  if (correct) {
    cur.streak += 1;
    const need = Math.max(1, cur.required || 1);
    if (cur.streak >= need) {
      cur.box = Math.min(cur.box + 1, 5);
      cur.streak = 0;     // reset après promotion
      cur.required = 1;   // redevenir "facile" tant qu'aucune grosse erreur
    }
  } else {
    const b = bucketizeSeverity(severity);
    const demotion = (b === 'mild') ? 1 : (b === 'medium' ? 2 : 3);
    cur.box = Math.max(1, cur.box - demotion);
    cur.streak = 0;
    cur.required = requiredFromSeverityBucket(b);
  }

  cur.lastSeverity = severity;
  cur.last = Date.now();
  cur.next = schedule(cur.box);
  stats[id] = cur;
  saveStats(stats);
}

function isDue(q: Question): boolean {
  const st = loadStats()[keyForQuestion(q)];
  return !st || st.next <= Date.now();
}

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
