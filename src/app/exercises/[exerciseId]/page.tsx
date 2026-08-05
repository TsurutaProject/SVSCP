import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUserId } from "@/lib/supabase/currentUser";
import { getTeamMemberByUserId } from "@/lib/supabase/queries/teamMembers";
import { getExerciseNotes } from "@/lib/supabase/queries/exerciseNotes";
import { findExerciseById } from "@/lib/curriculum/chapters";
import { loadLesson, extractClearConditions } from "@/lib/curriculum/lessons";
import { loadAnswer } from "@/lib/curriculum/answers";
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

  // 教材の「クリア条件」を演習ページにも出す。
  // 雛形コードのコメントだけでは、何を満たせばよいかが分かりにくいため。
  const lesson = loadLesson(exerciseId);
  const clearConditions = lesson ? extractClearConditions(lesson.source) : null;
  const clearConditionsContent = clearConditions
    ? (
        await compileMDX({
          source: clearConditions,
          // 教材本文と同じくGFM(表など)を解釈できるようにしておく
          options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
        })
      ).content
    : null;

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

      {/* コードエディタの前に置く。「何を満たせばクリアか」を先に読んでから
          手を動かせるようにするため。 */}
      {clearConditionsContent && (
        <section className={styles.clearConditions}>
          <h2 className={styles.clearConditionsTitle}>クリア条件</h2>
          <div className={styles.clearConditionsBody}>{clearConditionsContent}</div>
        </section>
      )}

      {isGraded(exerciseId) ? (
        <SandpackGraderSection exerciseId={exerciseId} />
      ) : hasPlayground(exerciseId) ? (
        <>
          <PlaygroundSection exerciseId={exerciseId} />
          {/* 自動採点がない演習は正誤を確かめる手段がないので、
              自分で書いたあとに答え合わせできるよう解答例を置く。
              採点対応の演習には置かない(テストで分かるうえ、採点の意味がなくなるため)。 */}
          <AnswerSection exerciseId={exerciseId} />
        </>
      ) : (
        <p className={styles.notice}>この演習の自動採点機能はまだ対応していません。</p>
      )}

      {/* 採点結果の下に、チーム共有のメモ欄を置く */}
      <ExerciseNotes exerciseId={exerciseId} notes={noteViews} maxLength={MAX_NOTE_LENGTH} />
    </main>
  );
}

// 解答例。<details>なので開くまでは目に入らず、先に自分で書く流れを崩さない。
// 解答例(.answer.md)が用意されていない演習では何も描画しない。
async function AnswerSection({ exerciseId }: { exerciseId: string }) {
  const answer = loadAnswer(exerciseId);
  if (!answer) return null;

  const { content } = await compileMDX({
    source: answer,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });

  return (
    <details className={styles.answer}>
      <summary className={styles.answerSummary}>
        <span className={styles.answerLabel}>解答例を見る</span>
        <span className={styles.answerHint}>
          まずは自分で書いてみてから開くのがおすすめです
        </span>
      </summary>
      <div className={styles.answerBody}>{content}</div>
    </details>
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
