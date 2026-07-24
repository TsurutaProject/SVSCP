import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTeamMemberByUserId, getTeamMembers } from "@/lib/supabase/queries/teamMembers";
import { getExerciseProgressForTeam } from "@/lib/supabase/queries/exerciseProgress";
import { chapters } from "@/lib/curriculum/chapters";
import { SignOutButton } from "@/components/SignOutButton";
import { ProgressBoard } from "@/components/ProgressBoard";
import { MyExerciseProgress } from "@/components/MyExerciseProgress";

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

  const [teamMembers, progressRows] = await Promise.all([
    getTeamMembers(supabase),
    getExerciseProgressForTeam(supabase),
  ]);

  const myProgressRows = progressRows.filter(
    (progress) => progress.team_member_id === teamMember.id,
  );

  return (
    <main>
      <h1>ようこそ、{teamMember.display_name}さん</h1>
      <SignOutButton />

      <section>
        <h2>進捗ボード</h2>
        <ProgressBoard
          chapters={chapters}
          teamMembers={teamMembers}
          progressRows={progressRows}
          selfTeamMemberId={teamMember.id}
        />
      </section>

      <section>
        <h2>自分の演習進捗</h2>
        <p>クリックでステータスが切り替わります(未着手→進行中→クリア済み→未着手)。</p>
        <MyExerciseProgress chapters={chapters} progressRows={myProgressRows} />
      </section>
    </main>
  );
}
