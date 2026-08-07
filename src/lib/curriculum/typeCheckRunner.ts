import ts from "typescript";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import tsLibs from "./generated/tsLibs.json";

// このファイルは node:fs/typescript を使うため、Server Action からのみ呼び出すこと。
//
// Sandpackの"test-ts"環境は型を消してJSとして実行するだけで、意味的な型チェック
// (コンパイルエラーの検出)を一切行わない。そのため、間違った型定義でも実行時の
// 値さえ正しければテストがPASSしてしまう(interfaceのプロパティの型を変えても
// 実際の値の型が合っていればPASSする、など)。
// これを補うため、テストPASS後にサーバー側で実際にTypeScriptコンパイラを走らせ、
// 型定義そのものの正しさを検証する。

// 使う標準ライブラリの型定義。scripts/copy-ts-libs.mjs の ENTRY_LIBS と揃えること。
const LIB_FILES = ["lib.es2017.d.ts", "lib.dom.d.ts"];

// 標準ライブラリの型定義(lib.*.d.ts)は、JSONに埋め込んだものを使う。
//
// **node_modules/typescript/lib を直接読ませてはいけない。**
// TypeScriptはこれらを実行時にfsで読むだけなので、Next.jsの依存解析には引っかからず、
// Vercelのサーバー関数に同梱されない。その結果、コード自体は正しくても
// 「Cannot find global type 'Array'」のような組み込み型エラーが大量に出る
// (ローカルは node_modules が丸ごとあるので気づけず、本番だけ壊れる)。
//
// next.config.ts の outputFileTracingIncludes、プロジェクト配下へのファイルコピー、
// どちらも試したが同梱できなかった(前者はTurbopackビルドで反映されず、後者は
// 静的に解決できる1ファイルしか含まれない)。JSONにしてimportすれば通常の
// モジュールとしてバンドルされるため確実。生成は scripts/copy-ts-libs.mjs。
const LIB_DIR = "/svscp-lib";

// lib.*.d.ts の中身をJSONから返すコンパイラホスト。
// `/// <reference lib="..." />` の解決も getDefaultLibLocation を見るため、
// 併せて差し替える必要がある。
function createHost(options: ts.CompilerOptions): ts.CompilerHost {
  const host = ts.createCompilerHost(options);
  const libs = tsLibs as Record<string, string>;
  const libOf = (fileName: string) => libs[path.basename(fileName)];

  const originalReadFile = host.readFile.bind(host);
  const originalFileExists = host.fileExists.bind(host);

  host.getDefaultLibLocation = () => LIB_DIR;
  host.getDefaultLibFileName = () => path.join(LIB_DIR, LIB_FILES[0]);
  host.readFile = (fileName) => libOf(fileName) ?? originalReadFile(fileName);
  host.fileExists = (fileName) => libOf(fileName) !== undefined || originalFileExists(fileName);

  return host;
}

const COMPILER_OPTIONS: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2017,
  module: ts.ModuleKind.CommonJS,
  strict: true,
  esModuleInterop: true,
  skipLibCheck: true,
  noEmit: true,
  lib: LIB_FILES,
};

export type TypeCheckResult = {
  ok: boolean;
  errors: string[];
};

// 練習用エディタ(SandpackPlayground / 一緒にやってみる)用の型チェック。
//
// 採点用の checkTypes と違い、比べる相手(typecheck.ts)は無く、
// 生徒が書いたコード1枚をそのままコンパイルして、型エラーが出るかどうかだけを見る。
//
// これが無いと「型注釈と違う値を代入してもエラーにならない」状態になり、
// 1章の型まわりの演習(`const x: number = "文字列"` を試してみよう、など)が
// 意図した体験にならない。Sandpackは型を消してJSとして実行するだけのため。
export type PlaygroundLanguage = "ts" | "react";

// Reactの演習(.tsx)は "react" を import するため、その型定義の場所を教える必要がある。
// 一時ファイルは /tmp に置く(Vercelではプロジェクト配下が読み取り専用のため)ので、
// 通常のnode解決ではプロジェクトの node_modules までたどり着けない。
// そこで paths で @types/react の .d.ts を直接指す。
function reactTypePaths(): ts.MapLike<string[]> {
  const types = path.join(process.cwd(), "node_modules", "@types", "react");
  return {
    react: [path.join(types, "index.d.ts")],
    "react/jsx-runtime": [path.join(types, "jsx-runtime.d.ts")],
  };
}

// 4章の教材は process.env を読ませるが、Sandpackはブラウザ環境なので
// @types/node は入れていない。型チェックだけのために @types/node 全体を
// 抱えると重いので、教材が使う範囲だけをここで宣言しておく。
// これが無いと「Cannot find name 'process'」が出て、演習の主題(NEXT_PUBLIC_の
// 有無で値が読めるかどうか)とは関係のないエラーで画面が埋まる。
const AMBIENT_DECLARATIONS = `declare const process: { env: Record<string, string | undefined> };
`;

export function checkPlaygroundTypes(
  code: string,
  language: PlaygroundLanguage = "ts",
): TypeCheckResult {
  const isReact = language === "react";
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "svscp-playground-typecheck-"));
  const filePath = path.join(dir, isReact ? "playground.tsx" : "playground.ts");
  const ambientPath = path.join(dir, "ambient.d.ts");

  try {
    fs.writeFileSync(filePath, code, "utf-8");
    fs.writeFileSync(ambientPath, AMBIENT_DECLARATIONS, "utf-8");

    const options: ts.CompilerOptions = {
      ...COMPILER_OPTIONS,
      ...(isReact ? { jsx: ts.JsxEmit.ReactJSX, paths: reactTypePaths() } : {}),
    };
    const program = ts.createProgram([filePath, ambientPath], options, createHost(options));
    const diagnostics = ts.getPreEmitDiagnostics(program);

    const errors = diagnostics.map((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      if (diagnostic.file && diagnostic.start !== undefined) {
        const { line } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        // 生徒から見えるのは1ファイルだけなので、ファイル名は出さず行番号だけ添える
        return `${line + 1}行目: ${message}`;
      }
      return message;
    });

    return { ok: errors.length === 0, errors };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

export function checkTypes(solutionCode: string, typeCheckCode: string): TypeCheckResult {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "svscp-typecheck-"));
  const solutionPath = path.join(dir, "solution.ts");
  const typeCheckPath = path.join(dir, "typecheck.ts");

  try {
    fs.writeFileSync(solutionPath, solutionCode, "utf-8");
    fs.writeFileSync(typeCheckPath, typeCheckCode, "utf-8");

    const program = ts.createProgram(
      [solutionPath, typeCheckPath],
      COMPILER_OPTIONS,
      createHost(COMPILER_OPTIONS),
    );
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
