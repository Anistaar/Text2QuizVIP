// src/parser.ts
// Parseur robuste pour text2quiz (+ thèmes)
// Sources des thèmes prises en charge :
//  - Colonne 5 "|| Theme1, Theme2"
//  - Tags inline dans la question : [#Theme]
//  - Entête de section : @themes: Theme1, Theme2
//  - Ajout ponctuel   : @add-theme: ThemeX

export type Mode = 'entrainement' | 'examen';

export type Answer = { text: string; correct: boolean };
export type Question =
  | { type: 'VF'; question: string; vf: 'V' | 'F'; explication?: string; topics?: string[] }
  | { type: 'QR'; question: string; answers: Answer[]; explication?: string; topics?: string[] }
  | { type: 'QCM'; question: string; answers: Answer[]; explication?: string; topics?: string[] };

export type UserAnswer =
  | { kind: 'VF'; value: 'V' | 'F' }
  | { kind: 'QR'; value: string | null }
  | { kind: 'QCM'; values: string[] };

const SEP_COL = '||';
const SEP_OPT = '|';
const CORR_PREFIX = /^V:/i;

function clean(s: string | undefined | null): string {
  return (s ?? '')
    .replace(/\u00A0/g, ' ') // nbsp -> space
    .trim();
}
function splitCols(line: string): string[] {
  // conserve colonnes vides éventuelles
  return line.split(SEP_COL).map((s) => s.trim());
}
function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function parseTopicList(raw: string): string[] {
  const t = clean(raw);
  if (!t) return [];
  return t
    .split(/[;,]/)
    .map((x) => x.trim())
    .filter(Boolean);
}
function extractInlineTags(question: string): string[] {
  // [#Macro] [#Consommation avancée]
  const out: string[] = [];
  const re = /\[#([^\]]+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(question))) {
    const tag = clean(m[1]);
    if (tag) out.push(tag);
  }
  return out;
}
function parseAnswers(raw: string): Answer[] {
  return clean(raw)
    .split(SEP_OPT)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((opt) => {
      const correct = CORR_PREFIX.test(opt);
      const text = opt.replace(CORR_PREFIX, '').trim();
      return { text, correct };
    });
}

export function parseQuestions(content: string): Question[] {
  const out: Question[] = [];
  if (!content) return out;

  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#') && !/^\/\//.test(l));

  // Thèmes "courants" via @themes:
  let currentThemes: string[] = [];

  for (const line of lines) {
    // Entêtes de section pour thèmes
    const mSet = line.match(/^@themes?\s*:\s*(.+)$/i);
    if (mSet) {
      currentThemes = parseTopicList(mSet[1]);
      continue;
    }
    const mAdd = line.match(/^@add-?theme\s*:\s*(.+)$/i);
    if (mAdd) {
      currentThemes = uniq([...currentThemes, ...parseTopicList(mAdd[1])]);
      continue;
    }

    const cols = splitCols(line);
    const kind = clean(cols[0]).toUpperCase();

    // ----- VF -----
    if (kind === 'VF' && cols.length >= 3) {
      const question = clean(cols[1]);
      const vfVal: 'V' | 'F' = clean(cols[2]).toUpperCase() === 'V' ? 'V' : 'F';
      const explication = clean(cols[3]);
      const topics = uniq([
        ...currentThemes,
        ...parseTopicList(cols[4]),
        ...extractInlineTags(question)
      ]);
      out.push({ type: 'VF', question, vf: vfVal, explication, topics });
      continue;
    }

    // ----- QR (1 bonne) -----
    if (kind === 'QR' && cols.length >= 3) {
      const question = clean(cols[1]);
      const answers = parseAnswers(cols[2]);
      const explication = clean(cols[3]);
      const topics = uniq([
        ...currentThemes,
        ...parseTopicList(cols[4]),
        ...extractInlineTags(question)
      ]);
      // sécurités : au moins 1 bonne ; au plus 1 bonne
      const nbGood = answers.filter((a) => a.correct).length;
      if (nbGood === 0) continue;
      if (nbGood > 1) {
        let keepOne = false;
        for (const a of answers) {
          if (a.correct && !keepOne) { keepOne = true; }
          else { a.correct = false; }
        }
      }
      out.push({ type: 'QR', question, answers, explication, topics });
      continue;
    }

    // ----- QCM (≥1 bonnes) -----
    if (kind === 'QCM' && cols.length >= 3) {
      const question = clean(cols[1]);
      const answers = parseAnswers(cols[2]);
      const explication = clean(cols[3]);
      const topics = uniq([
        ...currentThemes,
        ...parseTopicList(cols[4]),
        ...extractInlineTags(question)
      ]);
      if (answers.every((a) => !a.correct)) continue; // invalide
      out.push({ type: 'QCM', question, answers, explication, topics });
      continue;
    }

    // autres types ignorés
  }

  return out;
}

/* ===== Correction & aides ===== */

export function isCorrect(q: Question, ua: { value?: any; values?: string[] }): boolean {
  if (q.type === 'VF') return ua.value === q.vf;

  if (q.type === 'QR') {
    const v = (ua.value ?? '') as string;
    const good = q.answers.find((a) => a.correct);
    return !!good && v === (good.text ?? '');
  }

  if (q.type === 'QCM') {
    const chosen = new Set<string>((ua.values ?? []) as string[]);
    const goods = q.answers.filter((a) => a.correct).map((a) => a.text);
    const bads  = q.answers.filter((a) => !a.correct).map((a) => a.text);
    const allGoodChecked = goods.every((g) => chosen.has(g));
    const noBadChecked   = bads.every((b) => !chosen.has(b));
    return chosen.size > 0 && allGoodChecked && noBadChecked;
  }

  return false;
}

export function correctText(q: Question): string {
  if (q.type === 'VF') return q.vf === 'V' ? 'Vrai' : 'Faux';
  if (q.type === 'QR') return q.answers.find((a) => a.correct)?.text ?? '';
  if (q.type === 'QCM') return q.answers.filter((a) => a.correct).map((a) => a.text).join(' | ');
  return '';
}

export function countCorrect(q: Question): number {
  if (q.type === 'VF') return 1;
  if (q.type === 'QR') return 1;
  if (q.type === 'QCM') return q.answers.filter((a) => a.correct).length;
  return 0;
}
