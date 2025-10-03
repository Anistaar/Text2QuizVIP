// Allow parser helpers to accept the project's Question type without strict cross-module mismatch
import './types';

declare module './parser' {
  // keep the original names but accept any for flexibility between modules
  export function parseQuestions(s: string): any[];
  export function isCorrect(q: any, a: any): boolean;
  export function correctText(q: any): string;
  export function countCorrect(q: any): number;
}
