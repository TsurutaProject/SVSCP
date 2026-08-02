import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/LoginForm";
import styles from "@/components/authForm.module.css";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const params = await searchParams;

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>ログイン</h1>
        <p className={styles.lead}>
          はじめての方は、メールアドレスとパスワードを入力して「新規登録」を押してください。
        </p>
        <LoginForm errorMessage={params.error} infoMessage={params.message} />
      </div>
    </main>
  );
}
