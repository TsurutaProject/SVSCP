"use client";

import { useFormStatus } from "react-dom";
import { postExerciseNote } from "@/app/actions";
import styles from "./ExerciseNotes.module.css";

// 投稿日時は「サーバーで整形した文字列」を受け取る。
// クライアント側で toLocaleString すると、サーバー(UTC)とブラウザ(日本時間)で
// 出力がズレてハイドレーションエラーになるため。
export type ExerciseNoteView = {
  id: string;
  authorName: string;
  postedAt: string;
  content: string;
  /** 自分の投稿かどうか。team_member_idの比較はサーバー側で済ませておく */
  isMine: boolean;
};

type ExerciseNotesProps = {
  exerciseId: string;
  notes: ExerciseNoteView[];
  maxLength: number;
};

// useFormStatus はフォームの「子」でしか使えないため、ボタンを別コンポーネントにする。
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className={styles.submitButton} type="submit" disabled={pending}>
      {pending ? "投稿中…" : "投稿する"}
    </button>
  );
}

export function ExerciseNotes({ exerciseId, notes, maxLength }: ExerciseNotesProps) {
  return (
    // <details>を使うと開閉の状態管理をブラウザに任せられる。
    // 中身は最初から描画されているので、開いた瞬間の読み込み待ちも起きない。
    <details className={styles.section}>
      <summary className={styles.summary}>
        <span className={styles.summaryLabel}>メモ</span>
        <span className={styles.count}>{notes.length}件</span>
        <span className={styles.summaryHint}>
          詰まったところ・振り返りを、チームで共有できます
        </span>
      </summary>

      <div className={styles.body}>
        {notes.length === 0 ? (
          <p className={styles.empty}>まだメモはありません。</p>
        ) : (
          <ul className={styles.list}>
            {notes.map((note) => (
              // 自分の投稿はアクセント色、他のメンバーは通常色の左ラインで区別する
              <li key={note.id} className={styles.note} data-mine={note.isMine}>
                <div className={styles.noteHeader}>
                  <span className={styles.author}>
                    {note.authorName}
                    {note.isMine && <span className={styles.mineBadge}>自分</span>}
                  </span>
                  <span className={styles.postedAt}>{note.postedAt}</span>
                </div>
                {/* 自由テキストなので、改行をそのまま活かす(CSSのwhite-space) */}
                <p className={styles.content}>{note.content}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Server Actionを直接 action に渡すと、送信完了後にReactが
            未制御のフォームを自動でリセットしてくれる(textareaが空に戻る)。 */}
        <form className={styles.form} action={postExerciseNote}>
          <input type="hidden" name="exerciseId" value={exerciseId} />
          <label className={styles.label} htmlFor="note-content">
            新しいメモ
          </label>
          <textarea
            id="note-content"
            className={styles.textarea}
            name="content"
            rows={4}
            maxLength={maxLength}
            placeholder="詰まったところ、気づいたこと、振り返りなど。書式は自由です。"
            required
          />
          <div className={styles.formFooter}>
            <span className={styles.formHint}>投稿するとチーム全員が読めます</span>
            <SubmitButton />
          </div>
        </form>
      </div>
    </details>
  );
}
