"use client";

import { useState, useTransition } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackTests,
} from "@codesandbox/sandpack-react";
import { updateExerciseStatus } from "@/app/actions";

type SandpackGraderProps = {
  exerciseId: string;
  solutionStarter: string;
  testCode: string;
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

  for (const test of Object.values(spec.tests)) {
    // idle/running/fail はすべて未合格扱い(フェイルセーフ)
    if (test.status === "pass") pass += 1;
    else fail += 1;
  }

  for (const child of Object.values(spec.describes)) {
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

export function SandpackGrader({ exerciseId, solutionStarter, testCode }: SandpackGraderProps) {
  const [cleared, setCleared] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleComplete = (specs: Record<string, TestSpecLike>) => {
    if (cleared) return;
    if (!isAllTestsPassed(specs)) return;

    // SandpackTestsのレンダー中にonCompleteが呼ばれるため、setStateは
    // 次のティックにずらす(「Cannot update a component while rendering
    // a different component」を避けるため)。
    setTimeout(() => {
      setCleared(true);
      startTransition(async () => {
        const formData = new FormData();
        formData.set("exerciseId", exerciseId);
        formData.set("status", "cleared");
        await updateExerciseStatus(formData);
      });
    }, 0);
  };

  return (
    <div>
      <SandpackProvider
        template="test-ts"
        // "test-ts" テンプレートのテストランナーは customSetup.entry を無視し、
        // 常に /add.test.ts を実行対象として探すため、実ファイル名は
        // {exercise_id}.test.ts のままでも、Sandpackへ渡す際はこの固定の
        // 仮想パスにマッピングする。
        files={{
          "/solution.ts": { code: solutionStarter },
          "/add.test.ts": { code: testCode, hidden: true },
        }}
        options={{
          visibleFiles: ["/solution.ts"],
          activeFile: "/solution.ts",
          initMode: "immediate",
          autorun: true,
        }}
      >
        <SandpackLayout>
          <SandpackCodeEditor showLineNumbers />
          <SandpackTests onComplete={handleComplete} />
        </SandpackLayout>
      </SandpackProvider>

      {cleared && (
        <p role="status">
          {isPending ? "記録中…" : "🎉 テストに合格しました。クリア済みとして記録しました。"}
        </p>
      )}
    </div>
  );
}
