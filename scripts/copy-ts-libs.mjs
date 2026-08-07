// TypeScriptの標準ライブラリ型定義(lib.*.d.ts)を、1つのJSONに固めて埋め込む。
//
// なぜファイルコピーではなくJSONなのか:
//   採点と練習用エディタの型チェックは、実行時にTypeScriptコンパイラで .d.ts を読む。
//   これらは「実行時にfsで読むだけ」のファイルなので、Next.jsの依存解析には引っかからず、
//   Vercelのサーバー関数に同梱されない。同梱されないと、コード自体は正しくても
//   「Cannot find global type 'Array'」のような組み込み型エラーが大量に出る
//   (ローカルは node_modules が丸ごとあるので気づけず、本番だけ壊れる)。
//
//   next.config.ts の outputFileTracingIncludes は Next 16 の Turbopack ビルドでは
//   反映されず、プロジェクト配下に置くだけでも参照をたどってもらえなかった
//   (静的に解決できる1ファイルしか同梱されない)。
//   JSONにしてimportすれば、通常のモジュールとしてバンドルに含まれるため確実。
//
// build/dev の前に自動で走る(package.json の prebuild / predev)。
// 生成物なのでコミットしない(.gitignore 済み)。
import fs from "node:fs";
import path from "node:path";

const SOURCE_DIR = path.join(process.cwd(), "node_modules", "typescript", "lib");
const OUTPUT_FILE = path.join(process.cwd(), "src", "lib", "curriculum", "generated", "tsLibs.json");

// typeCheckRunner.ts の LIB_FILES と揃えること
const ENTRY_LIBS = ["lib.es2017.d.ts", "lib.dom.d.ts"];

// lib.*.d.ts は `/// <reference lib="..." />` で互いを参照しているので、
// 参照をたどって必要なものをすべて集める。
function collect(name, found = new Set()) {
  if (found.has(name)) return found;

  const filePath = path.join(SOURCE_DIR, name);
  if (!fs.existsSync(filePath)) {
    throw new Error(`型定義が見つかりません: ${filePath}`);
  }

  found.add(name);
  const source = fs.readFileSync(filePath, "utf-8");
  for (const match of source.matchAll(/\/\/\/\s*<reference\s+lib="([^"]+)"\s*\/>/g)) {
    collect(`lib.${match[1]}.d.ts`, found);
  }
  return found;
}

const names = [...ENTRY_LIBS.reduce((acc, lib) => collect(lib, acc), new Set())].sort();
const contents = Object.fromEntries(
  names.map((name) => [name, fs.readFileSync(path.join(SOURCE_DIR, name), "utf-8")]),
);

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(contents), "utf-8");

const mb = (fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2);
console.log(`型定義 ${names.length} 個を ${path.relative(process.cwd(), OUTPUT_FILE)} に埋め込みました (${mb} MB)`);
