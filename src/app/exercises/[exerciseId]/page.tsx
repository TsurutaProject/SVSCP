import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUserId } from "@/lib/supabase/currentUser";
import { getTeamMemberByUserId } from "@/lib/supabase/queries/teamMembers";
import { getExerciseNotes } from "@/lib/supabase/queries/exerciseNotes";
import { findExerciseById } from "@/lib/curriculum/chapters";
import { isGraded, loadGradingFiles } from "@/lib/curriculum/grading";
import { hasPlayground, loadPlaygroundFiles } from "@/lib/curriculum/playgrounds";
import { SandpackGrader } from "@/components/SandpackGrader";
import { SandpackPlayground } from "@/components/SandpackPlayground";
import { ExerciseNotes, type ExerciseNoteView } from "@/components/ExerciseNotes";
import { MAX_NOTE_LENGTH } from "@/lib/notes";
import styles from "./exercise.module.css";

// 投稿日時はサーバー側で日本時間に整形してから渡す。
// クライアントで整形すると、サーバー(UTC)との差でハイドレーションエラーになる。
const POSTED_AT_FORMATTER = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

type ExercisePageProps = {
  params: Promise<{ exerciseId: string }>;
};

export default async function ExercisePage({ params }: ExercisePageProps) {
  const { exerciseId } = await params;

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

  const exercise = findExerciseById(exerciseId);
  if (!exercise) {
    notFound();
  }

  // RLSにより、自分が所属するチームのメモだけが返る
  const notes = await getExerciseNotes(supabase, exerciseId);
  const noteViews: ExerciseNoteView[] = notes.map((note) => ({
    id: note.id,
    authorName: note.authorName,
    postedAt: POSTED_AT_FORMATTER.format(new Date(note.createdAt)),
    content: note.content,
    isMine: note.teamMemberId === teamMember.id,
  }));

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
      ) : hasPlayground(exerciseId) ? (
        <PlaygroundSection exerciseId={exerciseId} />
      ) : (
        <p className={styles.notice}>この演習の自動採点機能はまだ対応していません。</p>
      )}

      {/* 採点結果の下に、チーム共有のメモ欄を置く */}
      <ExerciseNotes exerciseId={exerciseId} notes={noteViews} maxLength={MAX_NOTE_LENGTH} />
    </main>
  );
}

// 自動採点はないが、書いたコードをその場で試せるようにするだけの簡易エディタ。
function PlaygroundSection({ exerciseId }: { exerciseId: string }) {
  const files = loadPlaygroundFiles(exerciseId);
  if (!files) {
    return <p className={styles.notice}>練習用エディタの読み込みに失敗しました。</p>;
  }

  return <SandpackPlayground kind={files.kind} starter={files.starter} />;
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
