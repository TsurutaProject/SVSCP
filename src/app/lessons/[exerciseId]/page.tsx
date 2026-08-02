import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/server";
import { getTeamMemberByUserId } from "@/lib/supabase/queries/teamMembers";
import { loadLesson, findNeighbours } from "@/lib/curriculum/lessons";
import { isGraded } from "@/lib/curriculum/grading";
import styles from "./lesson.module.css";

type LessonPageProps = {
  params: Promise<{ exerciseId: string }>;
};

// MDX内の表は横に長くなりがちなので、はみ出す時だけスクロールできるように包む。
const mdxComponents = {
  table: (props: React.ComponentProps<"table">) => (
    <div className={styles.tableWrapper}>
      <table {...props} />
    </div>
  ),
};

export default async function LessonPage({ params }: LessonPageProps) {
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

  const lesson = loadLesson(exerciseId);
  if (!lesson) {
    notFound();
  }

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

  return (
    <main className={styles.page}>
      <p className={styles.breadcrumb}>
        <Link href="/">← 進捗ボードに戻る</Link>
      </p>

      <p className={styles.chapterLabel}>{lesson.chapter.title}</p>
      <h1 className={styles.title}>{lesson.exercise.title}</h1>

      {isGraded(exerciseId) && (
        <div className={styles.actions}>
          <Link className={styles.actionLink} href={`/exercises/${exerciseId}`}>
            この演習の採点にチャレンジ →
          </Link>
        </div>
      )}

      <article className={styles.prose}>{content}</article>

      {/* 演習(クリア条件)を読み終えた流れのまま採点に進めるよう、本文の直後にも
          同じリンクを置く。ほぼ全ての教材はクリア条件で終わる構成のため、
          本文の末尾がそのまま「クリア条件の下」になる。 */}
      {isGraded(exerciseId) && (
        <div className={styles.cta}>
          <Link className={styles.ctaLink} href={`/exercises/${exerciseId}`}>
            この演習の採点にチャレンジ →
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
