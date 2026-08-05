import fs from "node:fs";
import path from "node:path";
import { chapters } from "@/lib/curriculum/chapters";

// このファイルは node:fs を使うため、Server Component からのみ import すること。
//
// 自動採点に対応していない演習(プレイグラウンド版)向けの解答例。
// 採点がないぶん「自分の書いたもので合っているのか」を確かめる手段がないため、
// 演習ページに折りたたみで置いて、自分で書いたあとに答え合わせできるようにする。
//
// ファイルは content/{章フォルダ}/{exercise_id}.answer.md。
// コードだけでなく「なぜそう書くか」の説明も入れたいのでMarkdownにしている。
//
// 採点対応の演習(grading.ts)にはこのファイルを置かないこと。
// あちらはテストで正誤が分かるうえ、答えを置くと採点の意味がなくなる。

export function loadAnswer(exerciseId: string): string | null {
  const chapter = chapters.find((c) => c.exercises.some((e) => e.id === exerciseId));
  if (!chapter) return null;

  const filePath = path.join(
    process.cwd(),
    "content",
    chapter.contentDir,
    `${exerciseId}.answer.md`,
  );
  if (!fs.existsSync(filePath)) return null;

  return fs.readFileSync(filePath, "utf-8");
}
