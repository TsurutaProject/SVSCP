import Link from "next/link";
import type { ChapterMeta } from "@/lib/curriculum/types";
import type { Database } from "@/lib/supabase/database.types";
import type { ExerciseStatus } from "@/lib/supabase/queries/exerciseProgress";
import { updateExerciseStatus } from "@/app/actions";
import { isGraded } from "@/lib/curriculum/grading";
import styles from "./MyExerciseProgress.module.css";

type ExerciseProgress = Database["public"]["Tables"]["exercise_progress"]["Row"];

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

type MyExerciseProgressProps = {
  chapters: ChapterMeta[];
  progressRows: ExerciseProgress[];
};

export function MyExerciseProgress({ chapters, progressRows }: MyExerciseProgressProps) {
  return (
    <div className={styles.chapters}>
      {chapters.map((chapter) => (
        <div key={chapter.id}>
          <h3 className={styles.chapterTitle}>{chapter.title}</h3>
          <ul className={styles.list}>
            {chapter.exercises.map((exercise) => {
              const status =
                (progressRows.find((progress) => progress.exercise_id === exercise.id)
                  ?.status as ExerciseStatus | undefined) ?? "not_started";

              return (
                <li key={exercise.id} className={styles.item}>
                  <form action={updateExerciseStatus} className={styles.form}>
                    <input type="hidden" name="exerciseId" value={exercise.id} />
                    <input type="hidden" name="status" value={nextStatus(status)} />
                    <button className={styles.statusButton} type="submit">
                      <span className={styles.exerciseTitle}>{exercise.title}</span>
                      <span className={styles.badge} data-status={status}>
                        {STATUS_LABELS[status]}
                      </span>
                    </button>
                  </form>
                  <span className={styles.links}>
                    <Link className={styles.link} href={`/lessons/${exercise.id}`}>
                      教材を読む
                    </Link>
                    {isGraded(exercise.id) && (
                      <Link className={styles.link} href={`/exercises/${exercise.id}`}>
                        採点にチャレンジ
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
