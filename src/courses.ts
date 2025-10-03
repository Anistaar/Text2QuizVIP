import { parseQuestions } from './parser';
import { dedupeQuestions, toTitleCase } from './utils';
type CourseItem = { path: string; file: string; label: string; content: string; folder: string };

// discover courses from filesystem via Vite import.meta.glob
const COURSE_RAW = (import.meta as any).glob('./cours/**/*.txt', {
  query: '?raw', import: 'default', eager: true
}) as Record<string, string>;

export const courses: CourseItem[] = Object.entries(COURSE_RAW)
  .map(([path, content]) => {
    const parts = path.split('/');
    const file = parts.pop()!;
    const folder = parts.pop() ?? '(Sans matière)';
    const base = file.replace(/\.txt$/i, '');
    const label = toTitleCase(base.replace(/[-_]/g, ' '));
    return { path, file, label, content, folder };
  })
  .sort((a, b) => a.label.localeCompare(b.label));

export function getThemesForCourse(path: string): string[] {
  const course = courses.find(c => c.path === path || c.file === path);
  if (!course) return [];
  const parsed = parseQuestions(course.content);
  const unique = dedupeQuestions(parsed);
  const set = new Set<string>();
  unique.forEach(q => (q.tags ?? []).forEach(t => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
