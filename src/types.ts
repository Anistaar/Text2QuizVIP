export type Mode = 'entrainement' | 'examen';
export type QuestionType = 'QCM' | 'QR' | 'VF' | 'DragMatch';

export type Answer = { text: string; correct: boolean };

export type DragPair = { item: string; match: string };

export type Question = {
  type: QuestionType;
  question: string;
  answers?: Answer[];   // QCM/QR
  vf?: 'V' | 'F';       // VF
  pairs?: DragPair[];   // DragMatch
  explication?: string | null;
  tags?: string[];      // <-- nouveau
};

export type UserAnswer =
  | { kind: 'QCM'; values: string[] }
  | { kind: 'QR'; value: string | null }
  | { kind: 'VF'; value: 'V' | 'F' | null }
  | { kind: 'DragMatch'; matches: Record<string, string> };
