import fs from "node:fs";
import path from "node:path";

// このファイルは node:fs を使うため、Server Component からのみ import すること。
// (Client Componentからimportするとビルドエラーになる)
//
// ここで扱うのは「自動採点なし」の演習向けの簡易プレイグラウンド。
// 書いたコードをその場で実行して見た目や結果を確かめるだけの仕組みで、
// 正誤判定は行わない(採点は grading.ts 側の別の仕組み)。

// 演習の内容に応じて、使うSandpackテンプレートを変える。
// - html:  HTML/CSSを書いて表示を確かめる(ch0)
// - react: Reactコンポーネントを書いて表示を確かめる(ch2/ch3)
// - ts:    TypeScriptを書いてconsole.logの出力を確かめる(ch1/ch4)
export type PlaygroundKind = "html" | "react" | "ts";

const STARTER_EXTENSION: Record<PlaygroundKind, string> = {
  html: "html",
  react: "tsx",
  ts: "ts",
};

type PlaygroundExercise = {
  chapterDir: string;
  exerciseId: string;
  kind: PlaygroundKind;
};

// 自動採点に対応していない33演習ぶん。採点対応の演習(grading.ts)とは重複しない。
const PLAYGROUND_EXERCISES: PlaygroundExercise[] = [
  // ch0はHTML/CSSを書いて見た目を確かめる
  { chapterDir: "ch0-html-css", exerciseId: "ch0-01-html-basics", kind: "html" },
  { chapterDir: "ch0-html-css", exerciseId: "ch0-02-selectors-and-variables", kind: "html" },
  { chapterDir: "ch0-html-css", exerciseId: "ch0-03-visual-styling", kind: "html" },
  { chapterDir: "ch0-html-css", exerciseId: "ch0-04-spacing-and-sizing", kind: "html" },
  { chapterDir: "ch0-html-css", exerciseId: "ch0-05-flexbox", kind: "html" },
  { chapterDir: "ch0-html-css", exerciseId: "ch0-06-grid", kind: "html" },
  { chapterDir: "ch0-html-css", exerciseId: "ch0-07-position", kind: "html" },
  { chapterDir: "ch0-html-css", exerciseId: "ch0-08-keyframes", kind: "html" },
  { chapterDir: "ch0-html-css", exerciseId: "ch0-09-capstone", kind: "html" },
  { chapterDir: "ch0-html-css", exerciseId: "ch0-10-review-practice", kind: "html" },

  // useStateの型を実際に書いて試せるようにReactにしている
  { chapterDir: "ch1-js-ts", exerciseId: "ch1-13-generics-reading", kind: "react" },

  { chapterDir: "ch2-react", exerciseId: "ch2-03-event-handling", kind: "react" },
  { chapterDir: "ch2-react", exerciseId: "ch2-04-usestate", kind: "react" },
  { chapterDir: "ch2-react", exerciseId: "ch2-05-dom-useref", kind: "react" },
  { chapterDir: "ch2-react", exerciseId: "ch2-08-useeffect", kind: "react" },
  { chapterDir: "ch2-react", exerciseId: "ch2-09-event-types", kind: "react" },
  { chapterDir: "ch2-react", exerciseId: "ch2-10-capstone", kind: "react" },

  { chapterDir: "ch3-practice", exerciseId: "ch3-01-data-and-state", kind: "react" },
  { chapterDir: "ch3-practice", exerciseId: "ch3-02-extract-utils", kind: "react" },
  { chapterDir: "ch3-practice", exerciseId: "ch3-03-svg-basics", kind: "react" },
  { chapterDir: "ch3-practice", exerciseId: "ch3-04-click-to-place", kind: "react" },
  { chapterDir: "ch3-practice", exerciseId: "ch3-05-find-some-sort", kind: "react" },
  { chapterDir: "ch3-practice", exerciseId: "ch3-06-capstone", kind: "react" },
  { chapterDir: "ch3-practice", exerciseId: "ch3-07-review-practice", kind: "react" },

  // ch4はconsole.logの出力で結果を確かめる
  { chapterDir: "ch4-nextjs", exerciseId: "ch4-01-package-json", kind: "ts" },
  { chapterDir: "ch4-nextjs", exerciseId: "ch4-02-process-env", kind: "ts" },
  { chapterDir: "ch4-nextjs", exerciseId: "ch4-03-promise-async-await", kind: "ts" },
  { chapterDir: "ch4-nextjs", exerciseId: "ch4-04-try-catch", kind: "ts" },
  { chapterDir: "ch4-nextjs", exerciseId: "ch4-05-reading-errors", kind: "ts" },
  { chapterDir: "ch4-nextjs", exerciseId: "ch4-06-nextjs-routing", kind: "ts" },
  { chapterDir: "ch4-nextjs", exerciseId: "ch4-07-api-server-actions", kind: "ts" },
  { chapterDir: "ch4-nextjs", exerciseId: "ch4-08-capstone", kind: "ts" },
  { chapterDir: "ch4-nextjs", exerciseId: "ch4-09-review-practice", kind: "ts" },
];

export function hasPlayground(exerciseId: string): boolean {
  return PLAYGROUND_EXERCISES.some((entry) => entry.exerciseId === exerciseId);
}

export type PlaygroundFiles = {
  kind: PlaygroundKind;
  starter: string;
};

export function loadPlaygroundFiles(exerciseId: string): PlaygroundFiles | null {
  const entry = PLAYGROUND_EXERCISES.find((e) => e.exerciseId === exerciseId);
  if (!entry) return null;

  const ext = STARTER_EXTENSION[entry.kind];
  const filePath = path.join(
    process.cwd(),
    "content",
    entry.chapterDir,
    `${exerciseId}.solution.${ext}`,
  );
  if (!fs.existsSync(filePath)) return null;

  return { kind: entry.kind, starter: fs.readFileSync(filePath, "utf-8") };
}
