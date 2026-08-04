"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { PlaygroundKind } from "@/lib/curriculum/playgrounds";
import styles from "./TryItEmbed.module.css";

// Sandpack一式はチャンクだけで650KBほどあり、教材ページを開いた瞬間に読むと
// 本文の表示まで待たされる。next/dynamic で切り離し、実際に必要になるまで
// 読み込まない(=最初のHTMLにも初期バンドルにも入らない)ようにする。
const SandpackPlayground = dynamic(
  () => import("./SandpackPlayground").then((m) => m.SandpackPlayground),
  {
    ssr: false,
    loading: () => <Skeleton label="エディタを読み込んでいます…" />,
  },
);

function Skeleton({ label }: { label: string }) {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <p className={styles.skeletonNote}>{label}</p>
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonPane} />
        <div className={styles.skeletonPane} />
      </div>
    </div>
  );
}

type TryItEmbedProps = {
  kind: PlaygroundKind;
  starter: string;
};

export function TryItEmbed({ kind, starter }: TryItEmbedProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  // 「一緒にやってみる」は本文の途中にあるので、開いた直後は画面外にある。
  // 実際にそこまで読み進めて画面に入ったときに初めて読み込む。
  // (IntersectionObserverが無い環境では何も起きないが、その場合は
  //  下のボタンを押せば読み込めるようにしてある)
  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      // 少し手前で読み込み始めて、たどり着いた頃には使える状態にしておく
      { rootMargin: "200px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {shouldLoad ? (
        <SandpackPlayground kind={kind} starter={starter} />
      ) : (
        <button type="button" className={styles.placeholder} onClick={() => setShouldLoad(true)}>
          <Skeleton label="スクロールすると読み込まれます(押してすぐ開くこともできます)" />
        </button>
      )}
    </div>
  );
}
