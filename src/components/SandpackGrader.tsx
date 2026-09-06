"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackConsole,
  SandpackPreview,
  SandpackTests,
  useActiveCode,
  useSandpack,
  type SandpackFiles,
  type SandpackOptions,
} from "@codesandbox/sandpack-react";
import { submitGradedExercise } from "@/app/actions";
import styles from "./SandpackGrader.module.css";

type SandpackGraderProps = {
  exerciseId: string;
  solutionStarter: string;
  testCode: string;
  // Reactコンポーネントの演習(ch2以降)かどうか。trueなら .tsx 扱いになり、
  // react/react-domの依存をSandpackに渡す。
  isReact?: boolean;
  // プレビュー用エントリ({exercise_id}.preview.tsx)の中身。
  // 渡された場合だけ、エディタの隣に実際の描画結果を表示する。
  previewCode?: string | null;
};

// プレビュー用のHTML。プレビューエントリはこの #root に描画する。
const PREVIEW_HTML = `<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

// propsに依存しないため、モジュールレベルの定数として1つの参照に固定する。
// (レンダーのたびに新しいオブジェクトを渡すとSandpackがエディタをリセットするため)
// autoReload: false が要点。既定(true)だと、一度テストを走らせたあとは
// 1文字打つたびにバンドルし直され、書きかけの壊れたコードの
// コンパイルエラー(Cannot assign to read only property 'message' など)が
// コンソールに流れ込んでしまう。falseにすると「採点する」を押したときだけ動く。
// (代わりに、押したときは自分でバンドラーへ最新のコードを送る必要がある。
//  GradingRunner の handleRun / listen を参照)
const SANDPACK_OPTIONS: SandpackOptions = {
  visibleFiles: ["/solution.ts"],
  activeFile: "/solution.ts",
  initMode: "immediate",
  autorun: true,
  autoReload: false,
};

const SANDPACK_OPTIONS_REACT: SandpackOptions = {
  visibleFiles: ["/solution.tsx"],
  activeFile: "/solution.tsx",
  initMode: "immediate",
  autorun: true,
  autoReload: false,
};

// Reactの演習でSandpackに追加インストールさせる依存。
// テストは react-dom/server の renderToStaticMarkup を使う(理由はgrading.tsのコメント参照)。
const REACT_SETUP = {
  dependencies: {
    react: "^18.2.0",
    "react-dom": "^18.2.0",
  },
};

// SandpackConsoleについて:
// ここでは standalone を「付けない」のが正しい。SandpackConsoleは
// standalone を付けると自前の実行用iframeを作り、そのクライアントのログだけを
// 見るようになる。ここで見たいのは「テスト実行中に生徒のコードが出したログ」
// (生徒はデバッグのためformatPriceなどの関数の中にconsole.logを書く。それが
// 実際に呼ばれるのはテスト実行時)なので、自前のiframeを持ってしまうと
// テスト側のログが一切拾えない。
// standaloneを付けない場合、clientIdがundefinedになり、Sandpackの
// グローバルリスナーとして「全クライアント」のログを受け取れる(採点用の
// 隠しテストのクライアントや、Reactのプレビューのクライアントを含む)。
//
// 逆に、練習用エディタ(SandpackPlayground)のTS版はテストもプレビューも無く、
// コードを実行するクライアントが1つも存在しないため、あちらではstandaloneが必須。
// 「常にstandaloneを付ける/付けない」ではなく、コードを走らせるクライアントが
// 他にあるかどうかで決まる。
//
// なお隠しテストに渡している hideTestsAndSupressLogs は、テストパネル内の
// 表示を抑えるだけで、クライアントからのconsoleメッセージ送出は止めない。

// プレビューを出す場合は、バンドラーのエントリをプレビュー用ファイルに向ける。
// (テストの検出はファイル名の正規表現で行われるため、entryを変えても影響しない)
const REACT_SETUP_WITH_PREVIEW = {
  ...REACT_SETUP,
  entry: "/index.tsx",
};

// @codesandbox/sandpack-react は SandpackTests の onComplete が受け取る
// 型(Spec)を公開exportしていないため、構造的に必要な部分だけをここで定義する。
type TestLikeStatus = "idle" | "running" | "pass" | "fail";

// Jestは expect() の失敗にだけ matcherResult を付ける。これが
// 「答えが分かってしまう不正解」と「実行前に落ちた技術的なエラー」を分ける目印になる。
type TestErrorLike = {
  name?: string;
  message?: string;
  matcherResult?: unknown;
};

type TestLike = {
  status: TestLikeStatus;
  errors?: TestErrorLike[];
};

type TestSpecLike = {
  error?: TestErrorLike;
  tests: Record<string, TestLike>;
  describes: Record<string, TestSpecLike>;
};

// 「期待値と実際の値が違う」というロジック上の不正解(matcherResultあり)は、
// メッセージに期待値がそのまま含まれるため生徒に見せない。
// 一方 export の付け忘れや実行時例外のような技術的なエラー(matcherResultなし)は、
// 見せたほうが自力で直せるので、そのまま表示する。
function collectTechnicalErrors(spec: TestSpecLike): string[] {
  const messages: string[] = [];

  const pushIfTechnical = (error: TestErrorLike | undefined) => {
    if (!error || error.matcherResult) return;
    const message = error.message?.trim();
    if (!message) return;
    messages.push(error.name && error.name !== "Error" ? `${error.name}: ${message}` : message);
  };

  // スペック単位のエラー(テストファイル自体が読み込めなかった場合など)
  pushIfTechnical(spec.error);

  for (const test of Object.values(spec.tests ?? {})) {
    for (const error of test.errors ?? []) pushIfTechnical(error);
  }

  for (const child of Object.values(spec.describes ?? {})) {
    messages.push(...collectTechnicalErrors(child));
  }

  return messages;
}

function collectAllTechnicalErrors(specs: Record<string, TestSpecLike>): string[] {
  const all = Object.values(specs).flatMap(collectTechnicalErrors);
  // 同じエラーが複数のテストから何度も出るので重複を潰す
  return [...new Set(all)];
}

function collectTestCounts(spec: TestSpecLike): { pass: number; fail: number } {
  let pass = 0;
  let fail = 0;

  if (spec.error) fail += 1;

  // onCompleteはテスト実行の途中経過でも呼ばれることがあり、その場合
  // tests/describesが未生成(undefined)なことがあるためフェイルセーフする。
  for (const test of Object.values(spec.tests ?? {})) {
    // idle/running/fail はすべて未合格扱い(フェイルセーフ)
    if (test.status === "pass") pass += 1;
    else fail += 1;
  }

  for (const child of Object.values(spec.describes ?? {})) {
    const childCounts = collectTestCounts(child);
    pass += childCounts.pass;
    fail += childCounts.fail;
  }

  return { pass, fail };
}

function isAllTestsPassed(specs: Record<string, TestSpecLike>): boolean {
  const specValues = Object.values(specs);
  if (specValues.length === 0) return false;

  const totals = specValues.reduce(
    (acc, spec) => {
      const counts = collectTestCounts(spec);
      return { pass: acc.pass + counts.pass, fail: acc.fail + counts.fail };
    },
    { pass: 0, fail: 0 },
  );

  return totals.fail === 0 && totals.pass > 0;
}

type GradingStatus = "idle" | "running" | "failed" | "submitting" | "cleared" | "type-error";

type GradingRunnerProps = {
  status: GradingStatus;
  onSubmit: (solutionCode: string) => void;
  onFail: (technicalErrors: string[]) => void;
  onRunRequest: () => void;
};

// SandpackProviderの子として描画し、useActiveCode()でエディタの「今の」中身を
// 読み取れるようにする(親側だと同じcontextにアクセスできないため)。
//
// sandpack.files["/solution.ts"].code はキーストロークのたびには更新されず、
// 古い(初期テンプレートの)内容を保持し続けることがあり、それを送信すると
// サーバー側のコンパイルが「exportが存在しないファイル」を相手にしてしまい
// 常に同じ"is not a module"エラーになっていた。useActiveCode()はアクティブな
// ファイルの生きた内容を返す公式のフックなので、そちらを使い、かつrefで
// 直近の値を確実に参照できるようにする。
//
// SandpackTestsのonCompleteは、渡すコールバックを再レンダーのたびに
// 差し替えても内部で古い参照を呼び続けることがある(デバッグ用の再現ページで
// 確認済み: statusがsubmitting/clearedに変わった後もonCompleteの中では
// ずっと初回マウント時のstatus="idle"が見え続けていた)。そのためstatusを
// クロージャ経由(props)ではなくrefで読み、送信済みかどうかもrefで
// 管理することで、古いクロージャから呼ばれても正しくガードできるようにする。
function GradingRunner({ status, onSubmit, onFail, onRunRequest }: GradingRunnerProps) {
  const { code } = useActiveCode();
  const { sandpack, dispatch, listen } = useSandpack();
  const codeRef = useRef(code);
  const submittedRef = useRef(false);
  // 「採点する」が押されて、バンドルの完了を待っている最中かどうか
  const pendingRunRef = useRef(false);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  // autoReload: false にしているので、コードを書き換えても自動では何も走らない。
  // 「採点する」で最新のコードをバンドラーへ送り、その完了(done)を受けてから
  // テストを実行する。ここで待たずに run-all-tests を投げると、
  // 1つ前のバンドル(=書き換える前のコード)が採点されてしまう。
  useEffect(() => {
    const unsubscribe = listen((message) => {
      if (message.type !== "done" || !pendingRunRef.current) return;
      pendingRunRef.current = false;
      dispatch({ type: "run-all-tests" });
    });

    return unsubscribe;
  }, [listen, dispatch]);

  useEffect(() => {
    // type-errorに戻ったら、型を直して再テストできるよう送信済みフラグを解除する。
    if (status === "type-error") {
      submittedRef.current = false;
    }
  }, [status]);

  // 「採点する」ボタン。SandpackTestsのwatchModeを切り、autoReloadも切ってあるので、
  // テストはここから明示的に指示したときだけ走る。
  //
  // updateCurrentFile で今の内容をバンドラーへ送ると、完了時に done が飛んでくる。
  // 実際の run-all-tests は、上の listen 側でそれを受けてから投げる。
  const handleRun = () => {
    submittedRef.current = false;
    pendingRunRef.current = true;
    onRunRequest();
    sandpack.updateCurrentFile(codeRef.current);
  };

  // SandpackTestsのレンダー中にonCompleteが呼ばれるため、setStateは
  // 次のティックにずらす(「Cannot update a component while rendering
  // a different component」を避けるため)。
  const handleComplete = (specs: Record<string, TestSpecLike>) => {
    if (!isAllTestsPassed(specs)) {
      // ロジック上の不正解は、期待値が見えてしまうため汎用メッセージにとどめる。
      // exportの付け忘れや実行時例外のような技術的なエラーだけは具体的に見せる。
      const technicalErrors = collectAllTechnicalErrors(specs);
      setTimeout(() => {
        onFail(technicalErrors);
      }, 0);
      return;
    }

    // 二重送信防止・完了後の再送信防止(古いクロージャから呼ばれても機能する)。
    if (submittedRef.current) return;
    submittedRef.current = true;
    const solutionCode = codeRef.current;

    setTimeout(() => {
      onSubmit(solutionCode);
    }, 0);
  };

  // 生のJest出力(テストコードの中身やスタックトレース、PASS/FAIL件数の
  // サマリー行)は演習の答えが見えてしまうため画面には出さず、代わりに
  // 親側の判定メッセージだけを見せる。
  // hideTestsAndSupressLogsは個別テストの詳細のみを隠す設定で、
  // ヘッダーやサマリー行までは隠せないため、display: noneで丸ごと
  // 非表示にしつつ、onCompleteによる採点ロジックだけは裏側で動かす。
  //
  // なお判定メッセージをここ(SandpackLayoutの中)で描画すると、
  // Sandpackのflexレイアウトの子要素になってエディタの横に細長く出てしまうため、
  // 表示は親側(SandpackProviderの外)に置いている。
  //
  // watchMode={false} にしているのが要点。既定(true)だとコードを変えるたびに
  // 自動でテストが走るため、「今どの状態で判定されたのか」が生徒に分かりにくい。
  // ボタンを押したときだけ走らせることで、判定のタイミングを明示する。
  return (
    <>
      <div style={{ display: "none" }}>
        <SandpackTests onComplete={handleComplete} hideTestsAndSupressLogs watchMode={false} />
      </div>
      <div className={styles.runBar}>
        <button
          className={styles.runButton}
          type="button"
          onClick={handleRun}
          disabled={status === "running" || status === "submitting"}
        >
          {status === "running" ? "採点中…" : "採点する"}
        </button>
        <span className={styles.runHint}>
          コードを書いたら押してください(押すまで判定は変わりません)。
        </span>
      </div>
    </>
  );
}

export function SandpackGrader({
  exerciseId,
  solutionStarter,
  testCode,
  isReact = false,
  previewCode = null,
}: SandpackGraderProps) {
  const [status, setStatus] = useState<GradingStatus>("idle");
  const [typeErrors, setTypeErrors] = useState<string[]>([]);
  // テスト実行中に出た技術的なエラー(exportの付け忘れ・実行時例外など)
  const [runtimeErrors, setRuntimeErrors] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  // filesをレンダーのたびに新しいオブジェクトとして生成すると、SandpackProviderが
  // 「filesが変わった」と判断してエディタの中身を初期状態にリセットしてしまう。
  // (Server Action内のrevalidatePathにより、このページ自身もサーバー側で
  // 再レンダーされてSandpackGraderが再実行されるため、内容が同じでも
  // 参照を安定させておく必要がある)
  const files = useMemo<SandpackFiles>(() => {
    if (isReact) {
      const reactFiles: SandpackFiles = {
        "/solution.tsx": { code: solutionStarter },
        "/add.test.tsx": { code: testCode, hidden: true },
        // test-tsテンプレートに最初から入っている /add.test.ts をそのままにすると、
        // テンプレート付属のテスト(add関数のテスト)まで実行されてPASS件数に
        // 混入するため、中身を空のモジュールで上書きして無害化する。
        "/add.test.ts": { code: "export {};\n", hidden: true },
      };

      if (previewCode) {
        reactFiles["/index.tsx"] = { code: previewCode, hidden: true };
        reactFiles["/index.html"] = { code: PREVIEW_HTML, hidden: true };
      }

      return reactFiles;
    }

    const tsFiles: SandpackFiles = {
      "/solution.ts": { code: solutionStarter },
      "/add.test.ts": { code: testCode, hidden: true },
    };
    return tsFiles;
  }, [solutionStarter, testCode, isReact, previewCode]);

  const showPreview = isReact && previewCode !== null;

  const handleFail = (errors: string[]) => {
    setTypeErrors([]);
    setRuntimeErrors(errors);
    setStatus("failed");
  };

  // 「採点する」が押されたら、前回の結果を消して実行中の状態にする。
  const handleRunRequest = () => {
    setTypeErrors([]);
    setRuntimeErrors([]);
    setStatus("running");
  };

  const handleSubmit = (solutionCode: string) => {
    setStatus("submitting");
    startTransition(async () => {
      const formData = new FormData();
      formData.set("exerciseId", exerciseId);
      formData.set("solutionCode", solutionCode);
      const result = await submitGradedExercise(formData);

      if (result.ok) {
        setTypeErrors([]);
        setStatus("cleared");
      } else {
        setTypeErrors(result.errors);
        setStatus("type-error");
      }
    });
  };

  return (
    <div className={styles.grader}>
      <div className={styles.editor}>
        {/* theme="auto" はSandpackが描画時に window.matchMedia を読むため、
            サーバー側(light)とクライアント側(dark)で出力がズレて
            ハイドレーションエラーになる。エディタはSandpack既定のテーマのままにする。 */}
        <SandpackProvider
          template="test-ts"
          // "test-ts" テンプレートのテストランナーは customSetup.entry を無視し、
          // 常に /add.test.ts を実行対象として探すため、実ファイル名は
          // {exercise_id}.test.ts のままでも、Sandpackへ渡す際はこの固定の
          // 仮想パスにマッピングする。
          files={files}
          options={isReact ? SANDPACK_OPTIONS_REACT : SANDPACK_OPTIONS}
          {...(isReact
            ? { customSetup: showPreview ? REACT_SETUP_WITH_PREVIEW : REACT_SETUP }
            : {})}
        >
          <SandpackLayout>
            {/* autoReload: false にすると内蔵の英語「Run」ボタンが出るが、
                下に日本語の「採点する」を置いているので重複を避けて隠す。 */}
            <SandpackCodeEditor showLineNumbers showRunButton={false} />
            {showPreview ? <SandpackPreview /> : <SandpackConsole />}
          </SandpackLayout>

          {/* プレビューがある場合(Reactの演習)は、エディタ・プレビューと3列に
              並べると窮屈になるため、コンソールだけ下の段に置く。
              未実装のうちはReactの警告が大量に出るため、高さを固定して
              下の判定メッセージが画面外に押し出されないようにしている。 */}
          {showPreview && (
            <div className={styles.consoleRow}>
              <SandpackLayout>
                <SandpackConsole resetOnPreviewRestart />
              </SandpackLayout>
            </div>
          )}

          {/* 隠しテストと「採点する」ボタン。SandpackLayoutの中に置くと
              ボタンがレイアウトの1列として横に並んでしまうため、外に出している。 */}
          <GradingRunner
            status={status}
            onSubmit={handleSubmit}
            onFail={handleFail}
            onRunRequest={handleRunRequest}
          />
        </SandpackProvider>
      </div>

      {/* 技術的なエラー(exportの付け忘れ・実行時例外など)は、そもそもコードが
          動いていないので具体的に見せる。答えが漏れる心配もない。 */}
      {status === "failed" && runtimeErrors.length > 0 && (
        <div role="alert" className={`${styles.message} ${styles.messageError}`}>
          <p>コードの実行中にエラーが起きました。</p>
          <ul className={styles.errorList}>
            {runtimeErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
          <p className={styles.hint}>
            ヒント: 関数や型に <code>export</code> を付け忘れていませんか?
            テストは <code>import</code> で読み込むため、<code>export</code> がないと
            見つけられません。
          </p>
        </div>
      )}

      {/* 逆に、コードは動いたうえで「期待値と違った」だけの場合は、
          エラーメッセージに期待値がそのまま含まれており答えが分かってしまうため、
          汎用メッセージにとどめる。この場合はexportも構文も問題ないので
          上のヒントも出さない。 */}
      {status === "failed" && runtimeErrors.length === 0 && (
        <p role="status" className={`${styles.message} ${styles.messageInfo}`}>
          まだテストが通っていません。実装を見直してみましょう。
        </p>
      )}

      {status === "type-error" && (
        <div role="alert" className={`${styles.message} ${styles.messageError}`}>
          <p>テストは通りましたが、型定義に問題があります(exercise_id: {exerciseId})。</p>
          <ul className={styles.errorList}>
            {typeErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {status === "cleared" && (
        <p role="status" className={`${styles.message} ${styles.messageSuccess}`}>
          {isPending ? "記録中…" : "🎉 テストに合格しました。クリア済みとして記録しました。"}
        </p>
      )}
    </div>
  );
}
