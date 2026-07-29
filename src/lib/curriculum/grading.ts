import fs from "node:fs";
import path from "node:path";

// このファイルは node:fs を使うため、Server Component からのみ import すること。
// (Client Componentからimportするとビルドエラーになる)

type GradedExercise = {
  chapterDir: string;
  exerciseId: string;
};

// Sandpackでの自動採点に対応済みの演習一覧。
// 対応を追加する際は、ここにエントリを追加した上で
// content/{chapterDir}/{exerciseId}.solution.ts と
// content/{chapterDir}/{exerciseId}.test.ts を用意すること。
const GRADED_EXERCISES: GradedExercise[] = [
  { chapterDir: "ch1-js-ts", exerciseId: "ch1-01-arrow-function" },
];

export function isGraded(exerciseId: string): boolean {
  return GRADED_EXERCISES.some((entry) => entry.exerciseId === exerciseId);
}

export type GradingFiles = {
  solution: string;
  test: string;
};

export function loadGradingFiles(exerciseId: string): GradingFiles | null {
  const entry = GRADED_EXERCISES.find((e) => e.exerciseId === exerciseId);
  if (!entry) return null;

  const dir = path.join(process.cwd(), "content", entry.chapterDir);
  const solution = fs.readFileSync(path.join(dir, `${exerciseId}.solution.ts`), "utf-8");
  const test = fs.readFileSync(path.join(dir, `${exerciseId}.test.ts`), "utf-8");

  return { solution, test };
}
