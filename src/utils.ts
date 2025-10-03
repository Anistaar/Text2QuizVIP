// Utilities shared across the app
import type { Question } from './types';

export function toTitleCase(s: string) {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}

export function norm(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function keyForQuestion(q: Question): string {
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

export function dedupeQuestions(arr: Question[]): Question[] {
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
