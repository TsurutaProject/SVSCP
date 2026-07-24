import type { ChapterMeta } from "@/lib/curriculum/types";
import { ch1Exercises } from "../../../content/ch1-js-ts/_index";

// content/ にまだ実データがない章は仮の演習リストを置いている。
// 実際のMDXを追加した章は、その章の content/{章フォルダ}/_index.ts から
// 演習一覧をインポートして置き換える(ch1がその例)。
// 演習を追加・置き換えする際は .claude/skills/add-exercise/SKILL.md の手順に従い、
// exercise_id をMDXのfrontmatterと完全一致させること。
export const chapters: ChapterMeta[] = [
  {
    id: "ch0",
    title: "HTML/CSS",
    exercises: [
      { id: "ch0-01-html-basics", title: "HTMLの基本", order: 1 },
      { id: "ch0-02-css-basics", title: "CSSの基本", order: 2 },
      { id: "ch0-03-flexbox-layout", title: "Flexboxレイアウト", order: 3 },
    ],
  },
  {
    id: "ch1",
    title: "JS/TS基礎",
    exercises: ch1Exercises,
  },
  {
    id: "ch2",
    title: "React基礎",
    exercises: [
      { id: "ch2-01-jsx-basics", title: "JSXの基本", order: 1 },
      { id: "ch2-02-props-and-state", title: "propsとstate", order: 2 },
      { id: "ch2-03-list-rendering", title: "リストレンダリング(key)", order: 3 },
    ],
  },
  {
    id: "ch3",
    title: "実践編",
    exercises: [
      { id: "ch3-01-cake-cut-logic", title: "ケーキカットロジック", order: 1 },
      { id: "ch3-02-score-calculator", title: "スコア計算機", order: 2 },
      { id: "ch3-03-random-quiz-picker", title: "ランダム出題ロジック", order: 3 },
    ],
  },
  {
    id: "ch4",
    title: "非同期+Next.js",
    exercises: [
      { id: "ch4-01-fetch-basics", title: "fetchの基本", order: 1 },
      { id: "ch4-02-app-router-basics", title: "App Routerの基本", order: 2 },
      { id: "ch4-03-server-actions-basics", title: "Server Actionsの基本", order: 3 },
    ],
  },
];
