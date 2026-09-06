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

// 演習ページ(/exercises/{id})の先頭に出す「問題文 + クリア条件」を、MDXから抜き出す。
//
// 演習ページには雛形コードのコメントしか出ておらず、何をすればよいかを確かめるのに
// 教材ページへ戻る必要があったため、この2つだけを持ってきて表示する。
//
// 教材によって構成が違うので、「クリア条件」の見出しを起点にして、
// その手前にある問題文のセクションを遡って探す形にしている。実際にある構成は6通り:
//   - "## 演習" → "### クリア条件"                         (43演習。大半はこれ)
//   - "## 要件" → "### クリア条件"                         (ch3-06)
//   - "## 要件" → "### 1..5" → "## クリア条件"             (ch0-09, ch4-08)
//   - "## Part A:..." → "### クリア条件(Part A)"          (ch1-15, ch2-10。Part B も同様)
//   - "## この演習について" → "### コード例1..3" → "## まとめ" → "### クリア条件"
//                                                          (レビュー演習5件)

/** 問題文の始まりとみなす見出し(この見出しから クリア条件 の直前までが問題文) */
const STATEMENT_HEADINGS = ["演習", "要件", "この演習について", "Part"];

function isStatementHeading(title: string): boolean {
  return STATEMENT_HEADINGS.some((name) => title.startsWith(name));
}

// 問題文とクリア条件は別々に返す。演習ページ側でクリア条件だけを
// 折りたたみにするため(先に条件を見せると「なぜそうするか」を考えずに
// 条件を満たすことが目的になってしまうので、開くかどうかを選べるようにしている)。
export type ExerciseBrief = {
  /** 問題文(Markdown)。見つからなければ null */
  statement: string | null;
  /** クリア条件(Markdown。見出し行は含まない) */
  clearConditions: string | null;
  /** 折りたたみの見出しに出す文言。総合演習は「クリア条件(Part A)」のようになる */
  clearConditionsLabel: string;
};

export function extractExerciseBrief(source: string): ExerciseBrief[] {
  const body = source.replace(/^---\n[\s\S]*?\n---\n/, "");
  const headings = [...body.matchAll(/^(#{2,3}) (.+)$/gm)];

  const blocks: ExerciseBrief[] = [];

  for (let i = 0; i < headings.length; i += 1) {
    const level = headings[i][1].length;
    const title = headings[i][2].trim();
    if (!title.startsWith("クリア条件")) continue;

    const clearStart = headings[i].index ?? 0;

    // 同じ深さ以上の見出しが来たら、そのクリア条件は終わり。
    // Part Aの次にPart Bが続く場合も、それぞれ別のまとまりとして取れる。
    let clearEnd = body.length;
    for (let j = i + 1; j < headings.length; j += 1) {
      if (headings[j][1].length <= level) {
        clearEnd = headings[j].index ?? body.length;
        break;
      }
    }

    // 手前に遡って、問題文の始まりになる見出しを探す。
    let statementIndex = -1;
    for (let j = i - 1; j >= 0; j -= 1) {
      if (isStatementHeading(headings[j][2].trim())) {
        statementIndex = j;
        break;
      }
    }

    let statement = "";
    if (statementIndex !== -1) {
      // 問題文の終わりは「クリア条件の直前」か「同じ深さ以上の次の見出し」の早いほう。
      // レビュー演習の "## まとめ"(クリア条件より前にある締めの文章)を
      // 問題文に含めないための条件でもある。
      const statementLevel = headings[statementIndex][1].length;
      let statementEnd = clearStart;
      for (let j = statementIndex + 1; j < headings.length; j += 1) {
        if (headings[j][1].length <= statementLevel) {
          statementEnd = Math.min(clearStart, headings[j].index ?? clearStart);
          break;
        }
      }

      statement = body.slice(headings[statementIndex].index ?? 0, statementEnd).trim();

      // "## 演習" はカードの見出し(「この演習でやること」)と役割が重なるので落とす。
      // "要件" や "Part A:..." は、どの部分の話かを示すので残す。
      statement = statement.replace(/^#{2,3} 演習\s*\n/, "").trim();
    }

    // 見出しの文言は折りたたみの summary 側で出すので、本文からは落とす。
    const clear = body
      .slice(clearStart, clearEnd)
      .trim()
      .replace(/^#{2,3} クリア条件.*$/m, "")
      .trim();

    blocks.push({
      statement: toNullable(sanitizeBrief(statement)),
      clearConditions: toNullable(sanitizeBrief(clear)),
      clearConditionsLabel: title,
    });
  }

  return blocks.filter((block) => block.statement !== null || block.clearConditions !== null);
}

function toNullable(text: string): string | null {
  return text.length > 0 ? text : null;
}

// 演習ページに出すにあたって、そのままでは都合の悪いものを取り除く。
function sanitizeBrief(text: string): string {
  return (
    text
      // レビュー演習のコード例に付いている <details>解答を見る</details> は、
      // 答えそのもの。演習ページには別途「解答例を見る」を用意しているので、
      // 問題文の側に混ぜない。
      .replace(/<details>[\s\S]*?<\/details>/g, "")
      // <TryIt /> は教材ページ専用のコンポーネント。演習ページ側の
      // compileMDX には渡していないため、残すと未知の要素として描画されてしまう。
      .replace(/<TryIt\s*\/>/g, "")
      // 上の削除でできた空行の連続をたたむ
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
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
