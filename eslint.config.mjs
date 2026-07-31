import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Sandpackの採点用に生成した演習ファイル。Sandpack側の独立した環境で
    // 実行される想定のため、このプロジェクトのlint対象外にする。
    "content/**/*.solution.ts",
    "content/**/*.test.ts",
    "content/**/*.typecheck.ts",
  ]),
]);

export default eslintConfig;
