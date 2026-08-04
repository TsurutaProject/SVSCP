import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUserId } from "@/lib/supabase/currentUser";
import { getTeamMemberByUserId, getTeamMembers } from "@/lib/supabase/queries/teamMembers";
import { getExerciseProgressForTeam } from "@/lib/supabase/queries/exerciseProgress";
import { chapters } from "@/lib/curriculum/chapters";
import { SignOutButton } from "@/components/SignOutButton";
import { ProgressBoard } from "@/components/ProgressBoard";
import { MyExerciseProgress } from "@/components/MyExerciseProgress";
import styles from "./page.module.css";

export default async function Home() {
  // 認証はproxy側で済んでいるので、ここでは検証済みのIDを受け取るだけにする
  // (getUser()を呼ぶとSupabaseへの往復がもう1回増える)
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    redirect("/login");
  }

  const supabase = await createClient();
  const teamMember = await getTeamMemberByUserId(supabase, userId);
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
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>ようこそ、{teamMember.display_name}さん</h1>
        <SignOutButton />
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>進捗ボード</h2>
        <ProgressBoard
          chapters={chapters}
          teamMembers={teamMembers}
          progressRows={progressRows}
          selfTeamMemberId={teamMember.id}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>自分の演習進捗</h2>
        <p className={styles.sectionNote}>
          クリックでステータスが切り替わります(未着手→進行中→クリア済み→未着手)。
        </p>
        <MyExerciseProgress chapters={chapters} progressRows={myProgressRows} />
      </section>
    </main>
  );
}
