"use client";

import { useOptimistic } from "react";
import Link from "next/link";
import type { ExerciseStatus } from "@/lib/supabase/queries/exerciseProgress";
import { updateExerciseStatus } from "@/app/actions";
import styles from "./MyExerciseProgress.module.css";

const STATUS_LABELS: Record<ExerciseStatus, string> = {
  not_started: "未着手",
  in_progress: "進行中",
  cleared: "クリア済み",
};

const STATUS_ORDER: ExerciseStatus[] = ["not_started", "in_progress", "cleared"];

function nextStatus(current: ExerciseStatus): ExerciseStatus {
  const index = STATUS_ORDER.indexOf(current);
  return STATUS_ORDER[(index + 1) % STATUS_ORDER.length];
}

// isGraded / hasPlayground は node:fs を使うサーバー専用の処理なので、
// クライアント側では判定できない。サーバー側で判定した結果だけを受け取る。
export type ExerciseRow = {
  id: string;
  title: string;
  status: ExerciseStatus;
  /** /exercises/{id} へのリンク文言。リンクを出さない場合は null */
  exerciseLinkLabel: string | null;
};

export type ChapterRows = {
  id: string;
  title: string;
  exercises: ExerciseRow[];
};

type ExerciseProgressListProps = {
  chapters: ChapterRows[];
};

export function ExerciseProgressList({ chapters }: ExerciseProgressListProps) {
  // クリックした瞬間に画面上のステータスを進めておき、保存はその裏で走らせる。
  // Server Action内の revalidatePath("/") でサーバーの値が返ってくると、
  // Reactが自動的に楽観的な値を破棄して本物の値に置き換える。
  const [optimisticChapters, applyOptimisticStatus] = useOptimistic(
    chapters,
    (current: ChapterRows[], updated: { exerciseId: string; status: ExerciseStatus }) =>
      current.map((chapter) => ({
        ...chapter,
        exercises: chapter.exercises.map((exercise) =>
          exercise.id === updated.exerciseId ? { ...exercise, status: updated.status } : exercise,
        ),
      })),
  );

  return (
    <div className={styles.chapters}>
      {optimisticChapters.map((chapter) => (
        <div key={chapter.id}>
          <h3 className={styles.chapterTitle}>{chapter.title}</h3>
          <ul className={styles.list}>
            {chapter.exercises.map((exercise) => {
              const next = nextStatus(exercise.status);

              return (
                <li key={exercise.id} className={styles.item}>
                  <form
                    className={styles.form}
                    action={async (formData: FormData) => {
                      // formAction は transition の中で動くので、ここで
                      // 楽観的更新を行える(先に画面、あとから保存)。
                      applyOptimisticStatus({ exerciseId: exercise.id, status: next });
                      await updateExerciseStatus(formData);
                    }}
                  >
                    <input type="hidden" name="exerciseId" value={exercise.id} />
                    <input type="hidden" name="status" value={next} />
                    <button className={styles.statusButton} type="submit">
                      <span className={styles.exerciseTitle}>{exercise.title}</span>
                      <span className={styles.badge} data-status={exercise.status}>
                        {STATUS_LABELS[exercise.status]}
                      </span>
                    </button>
                  </form>
                  <span className={styles.links}>
                    <Link className={styles.link} href={`/lessons/${exercise.id}`}>
                      教材を読む
                    </Link>
                    {exercise.exerciseLinkLabel && (
                      <Link className={styles.link} href={`/exercises/${exercise.id}`}>
                        {exercise.exerciseLinkLabel}
                      </Link>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
