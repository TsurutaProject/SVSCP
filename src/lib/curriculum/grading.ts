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
// ch1-13-generics-reading は「実際に動かす必要はなく、考えて答えを出すだけ」の
// 設計(実行可能なコードを書く演習ではない)ため、自動採点の対象外。
const GRADED_EXERCISES: GradedExercise[] = [
  { chapterDir: "ch1-js-ts", exerciseId: "ch1-01-arrow-function" },
  { chapterDir: "ch1-js-ts", exerciseId: "ch1-02-destructuring-spread" },
  { chapterDir: "ch1-js-ts", exerciseId: "ch1-03-array-map-filter" },
  { chapterDir: "ch1-js-ts", exerciseId: "ch1-04-template-literals" },
  { chapterDir: "ch1-js-ts", exerciseId: "ch1-05-optional-chaining" },
  { chapterDir: "ch1-js-ts", exerciseId: "ch1-06-modules" },
  { chapterDir: "ch1-js-ts", exerciseId: "ch1-07-basic-types" },
  { chapterDir: "ch1-js-ts", exerciseId: "ch1-08-function-types" },
  { chapterDir: "ch1-js-ts", exerciseId: "ch1-09-interface" },
  { chapterDir: "ch1-js-ts", exerciseId: "ch1-10-union-types" },
  { chapterDir: "ch1-js-ts", exerciseId: "ch1-11-optional-null" },
  { chapterDir: "ch1-js-ts", exerciseId: "ch1-12-nested-types" },
  { chapterDir: "ch1-js-ts", exerciseId: "ch1-14-utility-types" },
  { chapterDir: "ch1-js-ts", exerciseId: "ch1-15-capstone" },
  { chapterDir: "ch1-js-ts", exerciseId: "ch1-16-review-practice" },
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
