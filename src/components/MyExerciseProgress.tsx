import type { ChapterMeta } from "@/lib/curriculum/types";
import type { Database } from "@/lib/supabase/database.types";
import type { ExerciseStatus } from "@/lib/supabase/queries/exerciseProgress";
import { isGraded } from "@/lib/curriculum/grading";
import { hasPlayground } from "@/lib/curriculum/playgrounds";
import { ExerciseProgressList, type ChapterRows } from "./ExerciseProgressList";

type ExerciseProgress = Database["public"]["Tables"]["exercise_progress"]["Row"];

type MyExerciseProgressProps = {
  chapters: ChapterMeta[];
  progressRows: ExerciseProgress[];
};

// isGraded / hasPlayground は node:fs を使うサーバー専用の処理なので、
// ここ(Server Component)で判定を済ませ、クライアント側へは
// 表示に必要な値だけを渡す。一覧の描画と楽観的更新はクライアント側が担当する。
export function MyExerciseProgress({ chapters, progressRows }: MyExerciseProgressProps) {
  const rows: ChapterRows[] = chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    exercises: chapter.exercises.map((exercise) => ({
      id: exercise.id,
      title: exercise.title,
      status:
        (progressRows.find((progress) => progress.exercise_id === exercise.id)?.status as
          | ExerciseStatus
          | undefined) ?? "not_started",
      // 自動採点に対応していない演習でも、練習用エディタがあれば入口を出す
      // (遷移先はどちらも同じ /exercises/{id})。
      exerciseLinkLabel: isGraded(exercise.id)
        ? "採点にチャレンジ"
        : hasPlayground(exercise.id)
          ? "コードを試す"
          : null,
    })),
  }));

  return <ExerciseProgressList chapters={rows} />;
}
