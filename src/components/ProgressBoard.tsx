import type { ChapterMeta } from "@/lib/curriculum/types";
import type { Database } from "@/lib/supabase/database.types";
import styles from "./ProgressBoard.module.css";

type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];
type ExerciseProgress = Database["public"]["Tables"]["exercise_progress"]["Row"];

type ProgressBoardProps = {
  chapters: ChapterMeta[];
  teamMembers: TeamMember[];
  progressRows: ExerciseProgress[];
  selfTeamMemberId: string;
};

export function ProgressBoard({
  chapters,
  teamMembers,
  progressRows,
  selfTeamMemberId,
}: ProgressBoardProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>メンバー</th>
            {chapters.map((chapter) => (
              <th key={chapter.id}>{chapter.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teamMembers.map((member) => {
            const isSelf = member.id === selfTeamMemberId;

            return (
              <tr key={member.id} className={isSelf ? styles.selfRow : undefined}>
                <td className={styles.memberCell}>
                  {member.display_name}
                  {isSelf && <span className={styles.selfLabel}>(自分)</span>}
                </td>
                {chapters.map((chapter) => {
                  const clearedCount = chapter.exercises.filter((exercise) =>
                    progressRows.some(
                      (progress) =>
                        progress.team_member_id === member.id &&
                        progress.exercise_id === exercise.id &&
                        progress.status === "cleared",
                    ),
                  ).length;

                  const isComplete =
                    chapter.exercises.length > 0 && clearedCount === chapter.exercises.length;

                  return (
                    <td
                      key={chapter.id}
                      className={`${styles.count} ${isComplete ? styles.countComplete : ""}`}
                    >
                      {clearedCount}/{chapter.exercises.length}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
