import type { NextConfig } from "next";

// 型チェックが読む .d.ts をサーバー関数へ同梱する設定は、ここには置いていない。
// outputFileTracingIncludes は Next 16 の Turbopack ビルドでは反映されなかったため
// (指定しても .nft.json のファイル一覧が変わらない)。
// 代わりに scripts/copy-ts-libs.mjs で tslib/ へコピーし、プロジェクト配下の
// 普通のファイルとして同梱している。詳細は src/lib/curriculum/typeCheckRunner.ts のコメント。
const nextConfig: NextConfig = {};

export default nextConfig;
