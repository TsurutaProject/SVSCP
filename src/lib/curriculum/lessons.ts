import fs from "node:fs";
import path from "node:path";
import { chapters } from "@/lib/curriculum/chapters";
import type { ChapterMeta, ExerciseMeta } from "@/lib/curriculum/types";

// このファイルは node:fs を使うため、Server Component からのみ import すること。
// (Client Componentからimportするとビルドエラーになる)

export type Lesson = {
  exercise: ExerciseMeta;
  chapter: ChapterMeta;
  /** MDXファイルの中身(frontmatter込み。描画時にparseFrontmatterで取り除く) */
  source: string;
};

function findChapterOf(exerciseId: string): ChapterMeta | null {
  return chapters.find((chapter) => chapter.exercises.some((e) => e.id === exerciseId)) ?? null;
}

// content/{章フォルダ}/{exercise_id}.mdx を読み込む。
// exercise_id とMDXのファイル名は完全一致させる規約(CLAUDE.md参照)なので、
// ここでもその前提でパスを組み立てている。
export function loadLesson(exerciseId: string): Lesson | null {
  const chapter = findChapterOf(exerciseId);
  if (!chapter) return null;

  const exercise = chapter.exercises.find((e) => e.id === exerciseId);
  if (!exercise) return null;

  const filePath = path.join(process.cwd(), "content", chapter.contentDir, `${exerciseId}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  return {
    exercise,
    chapter,
    source: fs.readFileSync(filePath, "utf-8"),
  };
}

/** 同じ章の中での前後の演習(教材を続けて読めるようにするため) */
export function findNeighbours(exerciseId: string): {
  prev: ExerciseMeta | null;
  next: ExerciseMeta | null;
} {
  const chapter = findChapterOf(exerciseId);
  if (!chapter) return { prev: null, next: null };

  const ordered = [...chapter.exercises].sort((a, b) => a.order - b.order);
  const index = ordered.findIndex((e) => e.id === exerciseId);
  if (index === -1) return { prev: null, next: null };

  return {
    prev: ordered[index - 1] ?? null,
    next: ordered[index + 1] ?? null,
  };
}
