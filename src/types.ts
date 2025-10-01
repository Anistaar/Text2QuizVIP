export type Mode = 'entrainement' | 'examen';
export type QuestionType = 'QCM' | 'QR' | 'VF';

export type Answer = { text: string; correct: boolean };

export type Question = {
  type: QuestionType;
  question: string;
  answers?: Answer[];   // QCM/QR
  vf?: 'V' | 'F';       // VF
  explication?: string | null;
  tags?: string[];      // <-- nouveau
};

export type UserAnswer =
  | { kind: 'QCM'; values: string[] }
  | { kind: 'QR'; value: string | null }
  | { kind: 'VF'; value: 'V' | 'F' | null };
