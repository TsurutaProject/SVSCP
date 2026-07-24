import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTeamMemberByUserId } from "@/lib/supabase/queries/teamMembers";
import { OnboardingForm } from "@/components/OnboardingForm";

type OnboardingPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const teamMember = await getTeamMemberByUserId(supabase, user.id);
  if (teamMember) {
    redirect("/");
  }

  const params = await searchParams;

  return (
    <main>
      <h1>ようこそ</h1>
      <p>表示名を入力してください。</p>
      <OnboardingForm errorMessage={params.error} />
    </main>
  );
}
