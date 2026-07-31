import ts from "typescript";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// このファイルは node:fs/typescript を使うため、Server Action からのみ呼び出すこと。
//
// Sandpackの"test-ts"環境は型を消してJSとして実行するだけで、意味的な型チェック
// (コンパイルエラーの検出)を一切行わない。そのため、間違った型定義でも実行時の
// 値さえ正しければテストがPASSしてしまう(interfaceのプロパティの型を変えても
// 実際の値の型が合っていればPASSする、など)。
// これを補うため、テストPASS後にサーバー側で実際にTypeScriptコンパイラを走らせ、
// 型定義そのものの正しさを検証する。

const COMPILER_OPTIONS: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2017,
  module: ts.ModuleKind.CommonJS,
  strict: true,
  esModuleInterop: true,
  skipLibCheck: true,
  noEmit: true,
};

export type TypeCheckResult = {
  ok: boolean;
  errors: string[];
};

export function checkTypes(solutionCode: string, typeCheckCode: string): TypeCheckResult {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "svscp-typecheck-"));
  const solutionPath = path.join(dir, "solution.ts");
  const typeCheckPath = path.join(dir, "typecheck.ts");

  try {
    fs.writeFileSync(solutionPath, solutionCode, "utf-8");
    fs.writeFileSync(typeCheckPath, typeCheckCode, "utf-8");

    const program = ts.createProgram([solutionPath, typeCheckPath], COMPILER_OPTIONS);
    const diagnostics = ts.getPreEmitDiagnostics(program);

    const errors = diagnostics.map((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      if (diagnostic.file && diagnostic.start !== undefined) {
        const { line } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const fileName = path.basename(diagnostic.file.fileName);
        return `${fileName}:${line + 1} - ${message}`;
      }
      return message;
    });

    return { ok: errors.length === 0, errors };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
