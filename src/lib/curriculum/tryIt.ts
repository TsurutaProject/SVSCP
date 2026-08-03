import fs from "node:fs";
import path from "node:path";
import { chapters } from "@/lib/curriculum/chapters";
import type { PlaygroundKind } from "@/lib/curriculum/playgrounds";

// このファイルは node:fs を使うため、Server Component からのみ import すること。
//
// 教材本文(/lessons/{exercise_id})の「一緒にやってみる」セクションに埋め込む、
// その場で書いて動かせるエディタ用のコード。採点はしない。
//
// 演習の答えが漏れないよう、題材は演習(.solution.*)とは別のものにすること。

// 拡張子で種類を判別する。プレイグラウンド(playgrounds.ts)と同じ区分。
const EXTENSION_KINDS: Array<{ ext: string; kind: PlaygroundKind }> = [
  { ext: "tryit.html", kind: "html" },
  { ext: "tryit.tsx", kind: "react" },
  { ext: "tryit.ts", kind: "ts" },
];

export type TryItFiles = {
  kind: PlaygroundKind;
  starter: string;
};

export function loadTryItFiles(exerciseId: string): TryItFiles | null {
  const chapter = chapters.find((c) => c.exercises.some((e) => e.id === exerciseId));
  if (!chapter) return null;

  const dir = path.join(process.cwd(), "content", chapter.contentDir);

  for (const { ext, kind } of EXTENSION_KINDS) {
    const filePath = path.join(dir, `${exerciseId}.${ext}`);
    if (fs.existsSync(filePath)) {
      return { kind, starter: fs.readFileSync(filePath, "utf-8") };
    }
  }

  return null;
}
