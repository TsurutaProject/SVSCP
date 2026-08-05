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

// 演習ページ(/exercises/{id})の先頭に出す「クリア条件」を、MDXから抜き出す。
//
// 演習ページには雛形コードのコメントしか出ておらず、「何を満たせばよいか」を
// 確かめるのに教材ページへ戻る必要があったため、ここだけを持ってきて表示する。
//
// 見出しの書き方が2通りある(教材によって "## クリア条件" と "### クリア条件")。
// さらに総合演習には "### クリア条件(Part A)" のようにPart別のものもあるので、
// 「クリア条件」で始まる見出しをすべて拾い、同じレベル以上の次の見出しまでを取る。
export function extractClearConditions(source: string): string | null {
  const body = source.replace(/^---\n[\s\S]*?\n---\n/, "");
  const headings = [...body.matchAll(/^(#{2,3}) (.+)$/gm)];

  const parts: string[] = [];

  for (let i = 0; i < headings.length; i += 1) {
    const [, hashes, title] = headings[i];
    if (!title.trim().startsWith("クリア条件")) continue;

    const level = hashes.length;
    const start = headings[i].index ?? 0;

    // 同じ深さ以上(=より上位)の見出しが来たらそこで終わり。
    // Part Aの次にPart Bが来る場合も、それぞれ別のまとまりとして取れる。
    let end = body.length;
    for (let j = i + 1; j < headings.length; j += 1) {
      if (headings[j][1].length <= level) {
        end = headings[j].index ?? body.length;
        break;
      }
    }

    parts.push(body.slice(start, end).trim());
  }

  if (parts.length === 0) return null;

  // 演習ページ側では見出しの文言を自前で出すため、MDXの見出し行は落とす。
  // (Part別のものは「クリア条件(Part A)」という情報が要るので残す)
  const text = parts
    .map((part) =>
      parts.length === 1
        ? part.replace(/^#{2,3} クリア条件\s*\n/, "")
        : part.replace(/^#{2,3} (クリア条件.*)$/m, "**$1**"),
    )
    .join("\n\n")
    .trim();

  return text.length > 0 ? text : null;
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
