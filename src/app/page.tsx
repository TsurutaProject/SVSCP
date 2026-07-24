import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTeamMemberByUserId } from "@/lib/supabase/queries/teamMembers";
import { SignOutButton } from "@/components/SignOutButton";

export default async function Home() {
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

  return (
    <main>
      <h1>ようこそ、{teamMember.display_name}さん</h1>
      <SignOutButton />
    </main>
  );
}
