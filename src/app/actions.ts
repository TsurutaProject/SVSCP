"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getTeamMemberByUserId } from "@/lib/supabase/queries/teamMembers";
import {
  upsertExerciseProgress,
  type ExerciseStatus,
} from "@/lib/supabase/queries/exerciseProgress";
import { createExerciseNote } from "@/lib/supabase/queries/exerciseNotes";
import { MAX_NOTE_LENGTH } from "@/lib/notes";
import { loadTypeCheckSource } from "@/lib/curriculum/grading";
import { checkTypes } from "@/lib/curriculum/typeCheckRunner";

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

export async function postExerciseNote(formData: FormData) {
  // 書き込みなので、ヘッダー経由のIDではなく getUser() で検証し直す
  // (updateExerciseStatus / submitGradedExercise と同じ方針)。
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
  const content = String(formData.get("content") ?? "").trim();

  // 空投稿・長すぎる投稿は何もせずに戻す。textarea側にもmaxLengthを付けているが、
  // Server Actionはフォーム経由以外からも呼べるため、サーバー側でも必ず弾く。
  if (!exerciseId || !content || content.length > MAX_NOTE_LENGTH) {
    return;
  }

  await createExerciseNote(supabase, {
    teamId: teamMember.team_id,
    exerciseId,
    teamMemberId: teamMember.id,
    content,
  });

  // 投稿したメモが一覧に出るよう、この演習ページを再生成させる
  revalidatePath(`/exercises/${exerciseId}`);
}

export type SubmitGradedExerciseResult = { ok: true } | { ok: false; errors: string[] };

// Sandpackの実行時テストが全PASSした際に呼び出される。実行時テストだけでは
// 「実行時の値は正しいが型定義そのものは間違っている」ケースを検出できないため、
// 型定義が問われる演習(typecheck.tsが存在するもの)は、ここでサーバー側の
// TypeScriptコンパイラによる型チェックを追加で行ってからクリア済みとして記録する。
export async function submitGradedExercise(formData: FormData): Promise<SubmitGradedExerciseResult> {
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
  const solutionCode = String(formData.get("solutionCode") ?? "");

  if (!exerciseId) {
    return { ok: false, errors: ["exerciseIdが指定されていません"] };
  }

  const typeCheckSource = loadTypeCheckSource(exerciseId);
  if (typeCheckSource) {
    const result = checkTypes(solutionCode, typeCheckSource);
    if (!result.ok) {
      return { ok: false, errors: result.errors };
    }
  }

  await upsertExerciseProgress(supabase, {
    teamMemberId: teamMember.id,
    exerciseId,
    status: "cleared",
  });

  revalidatePath("/");
  return { ok: true };
}
