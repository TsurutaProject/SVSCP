"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackTests,
  useActiveCode,
  type SandpackOptions,
} from "@codesandbox/sandpack-react";
import { submitGradedExercise } from "@/app/actions";

type SandpackGraderProps = {
  exerciseId: string;
  solutionStarter: string;
  testCode: string;
};

// propsに依存しないため、モジュールレベルの定数として1つの参照に固定する。
const SANDPACK_OPTIONS: SandpackOptions = {
  visibleFiles: ["/solution.ts"],
  activeFile: "/solution.ts",
  initMode: "immediate",
  autorun: true,
};

// @codesandbox/sandpack-react は SandpackTests の onComplete が受け取る
// 型(Spec)を公開exportしていないため、構造的に必要な部分だけをここで定義する。
type TestLikeStatus = "idle" | "running" | "pass" | "fail";
type TestSpecLike = {
  error?: unknown;
  tests: Record<string, { status: TestLikeStatus }>;
  describes: Record<string, TestSpecLike>;
};

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

type GradingStatus = "idle" | "failed" | "submitting" | "cleared" | "type-error";

type GradingRunnerProps = {
  exerciseId: string;
  status: GradingStatus;
  typeErrors: string[];
  onSubmit: (solutionCode: string) => void;
  onFail: () => void;
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
function GradingRunner({ exerciseId, status, typeErrors, onSubmit, onFail }: GradingRunnerProps) {
  const { code } = useActiveCode();
  const codeRef = useRef(code);
  const submittedRef = useRef(false);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    // type-errorに戻ったら、型を直して再テストできるよう送信済みフラグを解除する。
    if (status === "type-error") {
      submittedRef.current = false;
    }
  }, [status]);

  // SandpackTestsのレンダー中にonCompleteが呼ばれるため、setStateは
  // 次のティックにずらす(「Cannot update a component while rendering
  // a different component」を避けるため)。
  const handleComplete = (specs: Record<string, TestSpecLike>) => {
    if (!isAllTestsPassed(specs)) {
      // 実装前(空)・実装途中いずれの失敗も、演習の答えが透けて見える生の
      // Jest出力(テストコードの中身やスタックトレース)は見せず、汎用メッセージに
      // とどめる。型チェック済みで一度PASSした後の型エラーとは区別する。
      setTimeout(() => {
        onFail();
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

  return (
    <>
      {/* 生のJest出力(テストコードの中身やスタックトレース、PASS/FAIL件数の
          サマリー行)は演習の答えが見えてしまうため画面には出さず、代わりに
          下の簡易メッセージ/型エラーメッセージだけを見せる。
          hideTestsAndSupressLogsは個別テストの詳細のみを隠す設定で、
          ヘッダーやサマリー行までは隠せないため、display: noneで丸ごと
          非表示にしつつ、onCompleteによる採点ロジックだけは裏側で動かす。 */}
      <div style={{ display: "none" }}>
        <SandpackTests onComplete={handleComplete} hideTestsAndSupressLogs />
      </div>
      {status === "failed" && (
        <p role="status">まだテストが通っていません。実装を見直してみましょう。</p>
      )}
      {status === "type-error" && (
        <div role="alert">
          <p>
            テストは通りましたが、型定義に問題があります(exercise_id: {exerciseId})。
          </p>
          <ul>
            {typeErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export function SandpackGrader({ exerciseId, solutionStarter, testCode }: SandpackGraderProps) {
  const [status, setStatus] = useState<GradingStatus>("idle");
  const [typeErrors, setTypeErrors] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  // filesをレンダーのたびに新しいオブジェクトとして生成すると、SandpackProviderが
  // 「filesが変わった」と判断してエディタの中身を初期状態にリセットしてしまう。
  // (Server Action内のrevalidatePathにより、このページ自身もサーバー側で
  // 再レンダーされてSandpackGraderが再実行されるため、内容が同じでも
  // 参照を安定させておく必要がある)
  const files = useMemo(
    () => ({
      "/solution.ts": { code: solutionStarter },
      "/add.test.ts": { code: testCode, hidden: true },
    }),
    [solutionStarter, testCode],
  );

  const handleFail = () => {
    setTypeErrors([]);
    setStatus("failed");
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
    <div>
      <SandpackProvider
        template="test-ts"
        // "test-ts" テンプレートのテストランナーは customSetup.entry を無視し、
        // 常に /add.test.ts を実行対象として探すため、実ファイル名は
        // {exercise_id}.test.ts のままでも、Sandpackへ渡す際はこの固定の
        // 仮想パスにマッピングする。
        files={files}
        options={SANDPACK_OPTIONS}
      >
        <SandpackLayout>
          <SandpackCodeEditor showLineNumbers />
          <GradingRunner
            exerciseId={exerciseId}
            status={status}
            typeErrors={typeErrors}
            onSubmit={handleSubmit}
            onFail={handleFail}
          />
        </SandpackLayout>
      </SandpackProvider>

      {status === "cleared" && (
        <p role="status">
          {isPending ? "記録中…" : "🎉 テストに合格しました。クリア済みとして記録しました。"}
        </p>
      )}
    </div>
  );
}
