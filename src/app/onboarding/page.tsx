import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTeamMemberByUserId } from "@/lib/supabase/queries/teamMembers";
import { OnboardingForm } from "@/components/OnboardingForm";
import styles from "@/components/authForm.module.css";

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
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>ようこそ</h1>
        <p className={styles.lead}>
          進捗ボードに表示される名前を入力してください(いまのところ、あとから変更する画面はありません)。
        </p>
        <OnboardingForm errorMessage={params.error} />
      </div>
    </main>
  );
}
