import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];

export async function getTeamMemberByUserId(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<TeamMember | null> {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function joinDefaultTeam(
  supabase: SupabaseClient<Database>,
  displayName: string,
): Promise<TeamMember> {
  const { data, error } = await supabase.rpc("join_default_team", {
    p_display_name: displayName,
  });

  if (error) throw error;
  return data;
}
