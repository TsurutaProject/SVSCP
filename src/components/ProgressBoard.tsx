import type { ChapterMeta } from "@/lib/curriculum/types";
import type { Database } from "@/lib/supabase/database.types";

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
    <table>
      <thead>
        <tr>
          <th>メンバー</th>
          {chapters.map((chapter) => (
            <th key={chapter.id}>{chapter.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {teamMembers.map((member) => (
          <tr key={member.id}>
            <td>
              {member.display_name}
              {member.id === selfTeamMemberId && "(自分)"}
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

              return (
                <td key={chapter.id}>
                  {clearedCount}/{chapter.exercises.length}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
