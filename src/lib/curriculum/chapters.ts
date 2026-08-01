import type { ChapterMeta, ExerciseMeta } from "@/lib/curriculum/types";
import { ch0Exercises } from "../../../content/ch0-html-css/_index";
import { ch1Exercises } from "../../../content/ch1-js-ts/_index";
import { ch2Exercises } from "../../../content/ch2-react/_index";
import { ch3Exercises } from "../../../content/ch3-practice/_index";
import { ch4Exercises } from "../../../content/ch4-nextjs/_index";

// 各章の演習一覧は、その章の content/{章フォルダ}/_index.ts からインポートしている。
// 演習を追加・変更する際は .claude/skills/add-exercise/SKILL.md の手順に従い、
// exercise_id をMDXのfrontmatterと完全一致させること。
export const chapters: ChapterMeta[] = [
  {
    id: "ch0",
    title: "HTML/CSS",
    contentDir: "ch0-html-css",
    exercises: ch0Exercises,
  },
  {
    id: "ch1",
    title: "JS/TS基礎",
    contentDir: "ch1-js-ts",
    exercises: ch1Exercises,
  },
  {
    id: "ch2",
    title: "React基礎",
    contentDir: "ch2-react",
    exercises: ch2Exercises,
  },
  {
    id: "ch3",
    title: "実践編",
    contentDir: "ch3-practice",
    exercises: ch3Exercises,
  },
  {
    id: "ch4",
    title: "非同期+Next.js",
    contentDir: "ch4-nextjs",
    exercises: ch4Exercises,
  },
];

export function findExerciseById(exerciseId: string): ExerciseMeta | null {
  for (const chapter of chapters) {
    const exercise = chapter.exercises.find((e) => e.id === exerciseId);
    if (exercise) return exercise;
  }
  return null;
}
