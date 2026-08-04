import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUserId } from "@/lib/supabase/currentUser";
import { getTeamMemberByUserId } from "@/lib/supabase/queries/teamMembers";
import { loadLesson, findNeighbours } from "@/lib/curriculum/lessons";
import { isGraded } from "@/lib/curriculum/grading";
import { hasPlayground } from "@/lib/curriculum/playgrounds";
import { loadTryItFiles } from "@/lib/curriculum/tryIt";
import { TryItEmbed } from "@/components/TryItEmbed";
import styles from "./lesson.module.css";

type LessonPageProps = {
  params: Promise<{ exerciseId: string }>;
};

// MDX内の表は横に長くなりがちなので、はみ出す時だけスクロールできるように包む。
const baseMdxComponents = {
  table: (props: React.ComponentProps<"table">) => (
    <div className={styles.tableWrapper}>
      <table {...props} />
    </div>
  ),
};

export default async function LessonPage({ params }: LessonPageProps) {
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

  const lesson = loadLesson(exerciseId);
  if (!lesson) {
    notFound();
  }

  // 教材本文に <TryIt /> と書くと、その場で書いて動かせるエディタが差し込まれる。
  // 中身は {exercise_id}.tryit.{ts,tsx,html} から読む(用意がなければ何も描画しない)。
  // 読み込みはサーバー側で済ませ、MDXからはpropsなしで置けるようにしている。
  const tryIt = loadTryItFiles(exerciseId);
  const mdxComponents = {
    ...baseMdxComponents,
    TryIt: () =>
      tryIt ? (
        <div className={styles.tryIt}>
          <TryItEmbed kind={tryIt.kind} starter={tryIt.starter} />
        </div>
      ) : null,
  };

  const { content } = await compileMDX({
    source: lesson.source,
    components: mdxComponents,
    options: {
      // MDXの先頭にあるfrontmatter(exercise_id/title/order)は本文として描画しない
      parseFrontmatter: true,
      // 素のMDXはGitHub Flavored Markdownのテーブル記法を解釈しないため、
      // remark-gfmを入れて表(| 見出し | ... |)を描画できるようにする。
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
  });

  const { prev, next } = findNeighbours(exerciseId);

  // 自動採点に対応している演習は採点ページへ、対応していなくても練習用エディタが
  // ある演習は「試す」ための入口として、同じ /exercises/{id} へ誘導する。
  const exerciseLinkLabel = isGraded(exerciseId)
    ? "この演習の採点にチャレンジ →"
    : hasPlayground(exerciseId)
      ? "この演習のコードを試す →"
      : null;

  return (
    <main className={styles.page}>
      <p className={styles.breadcrumb}>
        <Link href="/">← 進捗ボードに戻る</Link>
      </p>

      <p className={styles.chapterLabel}>{lesson.chapter.title}</p>
      <h1 className={styles.title}>{lesson.exercise.title}</h1>

      {exerciseLinkLabel && (
        <div className={styles.actions}>
          <Link className={styles.actionLink} href={`/exercises/${exerciseId}`}>
            {exerciseLinkLabel}
          </Link>
        </div>
      )}

      <article className={styles.prose}>{content}</article>

      {/* 演習(クリア条件)を読み終えた流れのまま手を動かせるよう、本文の直後にも
          同じリンクを置く。ほぼ全ての教材はクリア条件で終わる構成のため、
          本文の末尾がそのまま「クリア条件の下」になる。 */}
      {exerciseLinkLabel && (
        <div className={styles.cta}>
          <Link className={styles.ctaLink} href={`/exercises/${exerciseId}`}>
            {exerciseLinkLabel}
          </Link>
        </div>
      )}

      <nav className={styles.nav}>
        <span>
          {prev ? <Link href={`/lessons/${prev.id}`}>← {prev.title}</Link> : null}
        </span>
        <span>
          {next ? <Link href={`/lessons/${next.id}`}>{next.title} →</Link> : null}
        </span>
      </nav>
    </main>
  );
}
