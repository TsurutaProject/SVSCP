"use client";

import { useMemo } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  type SandpackFiles,
  type SandpackOptions,
  type SandpackPredefinedTemplate,
} from "@codesandbox/sandpack-react";
import type { PlaygroundKind } from "@/lib/curriculum/playgrounds";
import styles from "./SandpackPlayground.module.css";

type SandpackPlaygroundProps = {
  kind: PlaygroundKind;
  starter: string;
};

// 種類ごとに、テンプレートと「生徒が編集するファイル」を切り替える。
// optionsはpropsに依存しないので、レンダーのたびに新しいオブジェクトを渡して
// エディタがリセットされないよう、モジュールレベルの定数に固定しておく。
const CONFIG: Record<
  PlaygroundKind,
  { template: SandpackPredefinedTemplate; entry: string; options: SandpackOptions }
> = {
  html: {
    template: "static",
    entry: "/index.html",
    options: {
      visibleFiles: ["/index.html"],
      activeFile: "/index.html",
      initMode: "immediate",
      autorun: true,
    },
  },
  react: {
    template: "react-ts",
    entry: "/App.tsx",
    options: {
      visibleFiles: ["/App.tsx"],
      activeFile: "/App.tsx",
      initMode: "immediate",
      autorun: true,
    },
  },
  ts: {
    template: "vanilla-ts",
    entry: "/index.ts",
    options: {
      visibleFiles: ["/index.ts"],
      activeFile: "/index.ts",
      initMode: "immediate",
      autorun: true,
    },
  },
};

export function SandpackPlayground({ kind, starter }: SandpackPlaygroundProps) {
  const config = CONFIG[kind];

  // filesを毎レンダー新しいオブジェクトで渡すと、Sandpackが「変わった」と誤認して
  // エディタの中身を初期状態に戻してしまうため、参照を安定させる。
  const files = useMemo<SandpackFiles>(
    () => ({ [config.entry]: { code: starter } }),
    [config.entry, starter],
  );

  return (
    <div className={styles.playground}>
      <p className={styles.note}>
        自由に書き換えて試せる練習用のエディタです(採点はされません)。
      </p>
      <div className={styles.editor}>
        <SandpackProvider template={config.template} files={files} options={config.options}>
          <SandpackLayout>
            <SandpackCodeEditor showLineNumbers />
            {/* TSはconsole.logの出力を、HTML/Reactは描画結果を見せる。
                SandpackConsoleはstandaloneを付けないとコードを実行するiframeを
                持たず、ログが何も出ないので必ず指定すること。 */}
            {kind === "ts" ? (
              <SandpackConsole standalone showHeader={false} />
            ) : (
              <SandpackPreview />
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
}
