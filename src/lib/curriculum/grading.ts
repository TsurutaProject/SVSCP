import fs from "node:fs";
import path from "node:path";

// このファイルは node:fs を使うため、Server Component からのみ import すること。
// (Client Componentからimportするとビルドエラーになる)

type GradedExercise = {
  chapterDir: string;
  exerciseId: string;
  // Reactコンポーネントを書く演習(ch2以降)は、JSXを含むため拡張子が .tsx になり、
  // Sandpack側にもreact/react-domの依存を渡す必要がある。
  //
  // なおSandpackのテストランナー(parcel/testsモード)では、react-dom本体(DOM版)を
  // importするとテストが実行されず固まる。RTL・素のReactDOM.render・createRoot・
  // create-react-app環境への差し替えまで一通り試したがすべて同じ症状だった。
  // そのためテストは react-dom/server の renderToStaticMarkup で
  // 「描画結果のHTML文字列」を検証する方式に統一している。
  react?: boolean;
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
  // ch2は「静的な描画結果の比較」で判定できる演習だけを対象にしている。
  // 残り(ch2-03, 04, 05, 08, 09, 10)はクリック操作や状態変化の検証が必要で、
  // 現在の採点基盤では対応できないため対象外(CLAUDE.mdの「今後の拡張候補」参照)。
  { chapterDir: "ch2-react", exerciseId: "ch2-01-components-jsx", react: true },
  { chapterDir: "ch2-react", exerciseId: "ch2-02-props", react: true },
  { chapterDir: "ch2-react", exerciseId: "ch2-06-conditional-rendering", react: true },
  { chapterDir: "ch2-react", exerciseId: "ch2-07-list-rendering-key", react: true },
  { chapterDir: "ch2-react", exerciseId: "ch2-11-review-practice", react: true },
];

export function isGraded(exerciseId: string): boolean {
  return GRADED_EXERCISES.some((entry) => entry.exerciseId === exerciseId);
}

export type GradingFiles = {
  solution: string;
  test: string;
  isReact: boolean;
  preview: string | null;
};

export function loadGradingFiles(exerciseId: string): GradingFiles | null {
  const entry = GRADED_EXERCISES.find((e) => e.exerciseId === exerciseId);
  if (!entry) return null;

  const isReact = entry.react === true;
  const ext = isReact ? "tsx" : "ts";

  const dir = path.join(process.cwd(), "content", entry.chapterDir);
  const solution = fs.readFileSync(path.join(dir, `${exerciseId}.solution.${ext}`), "utf-8");
  const test = fs.readFileSync(path.join(dir, `${exerciseId}.test.${ext}`), "utf-8");

  // Reactの演習で、生徒が書いたコンポーネントの見た目をその場で確認できるように
  // するためのプレビュー用エントリ({exercise_id}.preview.tsx)。
  // 描画するコンポーネント名や渡すpropsは演習ごとに違うため、共通のエントリでは
  // 書けず、演習ごとにこのファイルを用意する。存在しない場合はプレビューなし。
  const previewPath = path.join(dir, `${exerciseId}.preview.tsx`);
  const preview = isReact && fs.existsSync(previewPath)
    ? fs.readFileSync(previewPath, "utf-8")
    : null;

  return { solution, test, isReact, preview };
}

// 型定義そのものの正しさが問われる演習にだけ用意する、任意のコンパイルチェック用
// ファイル({exercise_id}.typecheck.ts)。存在しない演習ではnullを返す
// (Sandpackの実行時テストのみで採点する)。
export function loadTypeCheckSource(exerciseId: string): string | null {
  const entry = GRADED_EXERCISES.find((e) => e.exerciseId === exerciseId);
  if (!entry) return null;

  const dir = path.join(process.cwd(), "content", entry.chapterDir);
  const typeCheckPath = path.join(dir, `${exerciseId}.typecheck.ts`);
  if (!fs.existsSync(typeCheckPath)) return null;

  return fs.readFileSync(typeCheckPath, "utf-8");
}
