```ts
const packageJson = {
  name: "svs-app",
  scripts: {
    dev: "next dev",
    build: "next build",
    start: "next start",
    lint: "eslint",
    typecheck: "tsc --noEmit",
  },
};
```

実際の `package.json` では、次のように書き足します(JSONなのでキーも文字列、末尾のカンマは付けられません)。

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit"
  }
}
```

**ポイント**

- **`--noEmit` は「型チェックだけして、JSファイルは出力しない」**という指定。ビルドはNext.jsがやってくれるので、ここでは型が合っているかの確認だけができれば十分です。
- **`scripts` に登録すると `npm run typecheck` で呼べます**。長いコマンドを毎回打たずに済むうえ、**チーム全員が同じコマンドで同じ確認をできる**のが本当の狙いです。
- `dev` / `build` / `start` / `test` は特別扱いで `npm run` を省略できますが、それ以外は `npm run <名前>` が必要です。`npm typecheck` では動きません。
- `npm run` とだけ打つと、使えるスクリプトの一覧が出ます。知らないプロジェクトに入ったとき、最初に打つと全体像が掴めます。
