"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getTeamMemberByUserId } from "@/lib/supabase/queries/teamMembers";
import {
  upsertExerciseProgress,
  type ExerciseStatus,
} from "@/lib/supabase/queries/exerciseProgress";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

const EXERCISE_STATUSES: ExerciseStatus[] = ["not_started", "in_progress", "cleared"];

export async function updateExerciseStatus(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const teamMember = await getTeamMemberByUserId(supabase, user.id);
  if (!teamMember) {
    redirect("/onboarding");
  }

  const exerciseId = String(formData.get("exerciseId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!exerciseId || !EXERCISE_STATUSES.includes(status as ExerciseStatus)) {
    return;
  }

  await upsertExerciseProgress(supabase, {
    teamMemberId: teamMember.id,
    exerciseId,
    status: status as ExerciseStatus,
  });

  revalidatePath("/");
}
