"use client";

import { useMemo } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useActiveCode,
  useSandpack,
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
//
// autoReload: false が要点。既定(true)だと1文字打つたびに再実行され、
// 書いている途中の壊れたコードでエラーが出たり、動作が重くなったりする。
// falseにするとコード変更では走らなくなり、「実行する」ボタンを押したときだけ
// 反映される(採点ページの「採点する」ボタンと同じ操作感になる)。
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
      autoReload: false,
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
      autoReload: false,
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
      autoReload: false,
    },
  },
};

// autoReload: false にしているため、書いたコードはこのボタンを押すまで反映されない。
// Sandpack内蔵のRunボタンもあるが、ラベルが英語なので採点ページと文言を揃えて自前で置く。
// SandpackProviderの子でないと useSandpack() が使えないので、別コンポーネントにしている。
function RunBar() {
  const { sandpack } = useSandpack();
  const { code } = useActiveCode();

  // autoReload: false のときエディタの変更は state に入るだけで、バンドラーには
  // 送られない(内部の shouldUpdatePreview が false のまま)。
  // updateCurrentFile を既定(true)で呼ぶとこのフラグが立ち、今の内容が反映される。
  // sandpack.runSandpack() はクライアントを作り直すだけで、編集内容は反映されない。
  const handleRun = () => {
    sandpack.updateCurrentFile(code);
  };

  return (
    <div className={styles.runBar}>
      <button className={styles.runButton} type="button" onClick={handleRun}>
        実行する
      </button>
      <span className={styles.runHint}>
        書き換えたら押してください(押すまで結果は変わりません)。
      </span>
    </div>
  );
}

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
            {/* autoReload: false にすると内蔵の英語「Run」ボタンが出るが、
                下に日本語の「実行する」を置いているので重複を避けて隠す。 */}
            <SandpackCodeEditor showLineNumbers showRunButton={false} />
            {/* TSはconsole.logの出力を、HTML/Reactは描画結果を見せる。
                SandpackConsoleはstandaloneを付けないとコードを実行するiframeを
                持たず、ログが何も出ないので必ず指定すること。 */}
            {kind === "ts" ? (
              <SandpackConsole standalone showHeader={false} />
            ) : (
              <SandpackPreview />
            )}
          </SandpackLayout>
          <RunBar />
        </SandpackProvider>
      </div>
    </div>
  );
}
