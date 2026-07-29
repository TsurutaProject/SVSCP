import type { ChapterMeta } from "@/lib/curriculum/types";
import { ch1Exercises } from "../../../content/ch1-js-ts/_index";
import { ch2Exercises } from "../../../content/ch2-react/_index";
import { ch3Exercises } from "../../../content/ch3-practice/_index";
import { ch4Exercises } from "../../../content/ch4-nextjs/_index";

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
    exercises: ch2Exercises,
  },
  {
    id: "ch3",
    title: "実践編",
    exercises: ch3Exercises,
  },
  {
    id: "ch4",
    title: "非同期+Next.js",
    exercises: ch4Exercises,
  },
];
