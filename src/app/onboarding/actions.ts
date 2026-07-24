"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { joinDefaultTeam } from "@/lib/supabase/queries/teamMembers";

export async function completeOnboarding(formData: FormData) {
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (!displayName) {
    redirect(`/onboarding?error=${encodeURIComponent("表示名を入力してください")}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  try {
    await joinDefaultTeam(supabase, displayName);
  } catch (e) {
    const message = e instanceof Error ? e.message : "登録に失敗しました";
    redirect(`/onboarding?error=${encodeURIComponent(message)}`);
  }

  redirect("/");
}
