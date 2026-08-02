import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTeamMemberByUserId } from "@/lib/supabase/queries/teamMembers";
import { findExerciseById } from "@/lib/curriculum/chapters";
import { isGraded, loadGradingFiles } from "@/lib/curriculum/grading";
import { SandpackGrader } from "@/components/SandpackGrader";
import styles from "./exercise.module.css";

type ExercisePageProps = {
  params: Promise<{ exerciseId: string }>;
};

export default async function ExercisePage({ params }: ExercisePageProps) {
  const { exerciseId } = await params;

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

  const exercise = findExerciseById(exerciseId);
  if (!exercise) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <p className={styles.breadcrumb}>
        <Link className={styles.breadcrumbLink} href="/">
          ← 進捗ボードに戻る
        </Link>
        <span className={styles.separator}>|</span>
        <Link className={styles.breadcrumbLink} href={`/lessons/${exerciseId}`}>
          教材を読む
        </Link>
      </p>
      <h1 className={styles.title}>{exercise.title}</h1>

      {isGraded(exerciseId) ? (
        <SandpackGraderSection exerciseId={exerciseId} />
      ) : (
        <p className={styles.notice}>この演習の自動採点機能はまだ対応していません。</p>
      )}
    </main>
  );
}

function SandpackGraderSection({ exerciseId }: { exerciseId: string }) {
  const files = loadGradingFiles(exerciseId);
  if (!files) {
    return <p className={styles.notice}>採点用ファイルの読み込みに失敗しました。</p>;
  }

  return (
    <SandpackGrader
      exerciseId={exerciseId}
      solutionStarter={files.solution}
      testCode={files.test}
      isReact={files.isReact}
      previewCode={files.preview}
    />
  );
}
