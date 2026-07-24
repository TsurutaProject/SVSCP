import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type ExerciseProgress = Database["public"]["Tables"]["exercise_progress"]["Row"];
export type ExerciseStatus = "not_started" | "in_progress" | "cleared";

export async function getExerciseProgressForTeam(
  supabase: SupabaseClient<Database>,
): Promise<ExerciseProgress[]> {
  const { data, error } = await supabase.from("exercise_progress").select("*");

  if (error) throw error;
  return data;
}

export async function upsertExerciseProgress(
  supabase: SupabaseClient<Database>,
  params: { teamMemberId: string; exerciseId: string; status: ExerciseStatus },
): Promise<void> {
  const { error } = await supabase.from("exercise_progress").upsert(
    {
      team_member_id: params.teamMemberId,
      exercise_id: params.exerciseId,
      status: params.status,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "team_member_id,exercise_id" },
  );

  if (error) throw error;
}
