import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

// 演習ごとのメモ(簡易掲示板)。
// RLSにより「自分が所属するチームのメモ」だけが見える/書けるので、
// クエリ側で team_id を明示的に絞る必要はない(絞ってもよいが二重になる)。

export type ExerciseNote = {
  id: string;
  content: string;
  createdAt: string;
  teamMemberId: string;
  /** 投稿者の表示名。team_membersが引けなかった場合に備えてフォールバックする */
  authorName: string;
};

export async function getExerciseNotes(
  supabase: SupabaseClient<Database>,
  exerciseId: string,
): Promise<ExerciseNote[]> {
  const { data, error } = await supabase
    .from("exercise_notes")
    .select("id, content, created_at, team_member_id, team_members(display_name)")
    .eq("exercise_id", exerciseId)
    // 新しい順(時系列)で表示する
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    content: row.content,
    createdAt: row.created_at,
    teamMemberId: row.team_member_id,
    authorName: row.team_members?.display_name ?? "(不明なメンバー)",
  }));
}

export async function createExerciseNote(
  supabase: SupabaseClient<Database>,
  params: { teamId: string; exerciseId: string; teamMemberId: string; content: string },
): Promise<void> {
  const { error } = await supabase.from("exercise_notes").insert({
    team_id: params.teamId,
    exercise_id: params.exerciseId,
    team_member_id: params.teamMemberId,
    content: params.content,
  });

  if (error) throw error;
}
