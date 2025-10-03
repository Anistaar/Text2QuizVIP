import type { Question, UserAnswer } from './types';
import { keyForQuestion as _keyForQuestion } from './utils';

export type QStat = {
  box: number;
  streak: number;
  last: number;
  next: number;
  required: number;
  lastSeverity?: number;
  seen?: number;
  correct?: number;
  strength?: number;
  avgTimeMs?: number;
};

const LS_KEY = 't2q_stats_v2';

function clamp(v: number, a = 0, b = 1) { return Math.max(a, Math.min(b, v)); }
const BASE_INTERVALS_DAYS = [0, 1, 3, 7, 14, 30];

export function loadStats(): Record<string, QStat> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
}
export function saveStats(stats: Record<string, QStat>) {
  localStorage.setItem(LS_KEY, JSON.stringify(stats));
}

function scheduleNext(qstat: QStat): number {
  const now = Date.now();
  const strength = qstat.strength ?? 0;
  if (strength >= 1) {
    const days = 30 * Math.max(1, qstat.box || 1);
    return now + days * 24 * 3600 * 1000;
  }
  const idx = Math.round(clamp(strength, 0, 0.999) * (BASE_INTERVALS_DAYS.length - 1));
  const days = BASE_INTERVALS_DAYS[idx] || 1;
  const severity = qstat.lastSeverity ?? 1;
  const severityFactor = severity > 0.6 ? 0.5 : severity > 0.3 ? 0.75 : 1;
  const nextMs = now + Math.max(0.1, days * severityFactor) * 24 * 3600 * 1000;
  return Math.round(nextMs);
}

export function requiredFromSeverityBucket(b: 'mild'|'medium'|'severe'): number {
  if (b === 'mild') return 1;
  if (b === 'medium') return 2;
  return 3;
}

export function bucketizeSeverity(s: number): 'mild'|'medium'|'severe' {
  if (s <= 0.25) return 'mild';
  if (s <= 0.6) return 'medium';
  return 'severe';
}

export function computeSeverity(q: Question, ua: UserAnswer): number {
  // similar logic as before but localized here
  if (q.type === 'VF') {
    const ok = (ua.kind === 'VF') && ua.value && ua.value === q.vf;
    const timeMs = (ua as any).timeMs || 0;
    const timeFactor = clamp((timeMs - 3000) / 7000, 0, 1) * 0.35;
    return clamp((ok ? 0 : 1) + (ok ? timeFactor * 0.5 : timeFactor));
  }
  if (q.type === 'QR') {
    const ok = (ua.kind === 'QR') && ua.value && isValueEqual(ua.value, q);
    const timeMs = (ua as any).timeMs || 0;
    const timeFactor = clamp((timeMs - 3000) / 7000, 0, 1) * 0.35;
    return clamp((ok ? 0 : 1) + (ok ? timeFactor * 0.5 : timeFactor));
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
    const base = (FP + FN) / N;
    const timeMs = (ua as any).timeMs || 0;
    const timeFactor = clamp((timeMs - 3000) / 7000, 0, 1) * 0.35;
    return clamp(base + (base === 0 ? timeFactor * 0.5 : timeFactor));
  }
  return 1;
}

function isValueEqual(val: string | null | undefined, q: Question) {
  if (!val) return false;
  if (q.type === 'QR' && q.answers) return q.answers.some(a => a.text === val);
  return false;
}

export function updateStatAfterAnswer(q: Question, correct: boolean, severity: number, timeMs?: number) {
  const id = _keyForQuestion(q);
  const stats = loadStats();
  const cur: QStat = stats[id] || { box: 1, streak: 0, last: 0, next: 0, required: 1, lastSeverity: undefined, seen: 0, correct: 0, strength: 0, avgTimeMs: 0 };

  cur.seen = (cur.seen || 0) + 1;
  cur.correct = (cur.correct || 0) + (correct ? 1 : 0);
  if (!correct) cur.correct = Math.max(0, (cur.correct || 0) - 0.5);

  if (typeof timeMs === 'number') {
    const prev = cur.avgTimeMs || 0;
    const alpha = 1 / Math.min(cur.seen, 10);
    cur.avgTimeMs = Math.round(prev * (1 - alpha) + timeMs * alpha);
  }

  if (correct) {
    cur.streak += 1;
    const need = Math.max(1, cur.required || 1);
    if (cur.streak >= need) {
      cur.box = Math.min(cur.box + 1, 5);
      cur.streak = 0;
      cur.required = 1;
    }
  } else {
    const b = bucketizeSeverity(severity);
    const demotion = (b === 'mild') ? 1 : (b === 'medium' ? 2 : 3);
    cur.box = Math.max(1, cur.box - demotion);
    cur.streak = 0;
    cur.required = requiredFromSeverityBucket(b);
  }

  const required = cur.required || 5;
  const baseStrength = clamp((cur.correct || 0) / required);
  const timePenalty = cur.avgTimeMs ? clamp((cur.avgTimeMs - 3000) / 7000, 0, 0.8) : 0;
  cur.strength = clamp(baseStrength * (1 - timePenalty));

  cur.lastSeverity = severity;
  cur.last = Date.now();
  cur.next = scheduleNext(cur);
  stats[id] = cur;
  saveStats(stats);
}

export function isDue(q: Question): boolean {
  const st = loadStats()[_keyForQuestion(q)];
  return !st || st.next <= Date.now();
}
