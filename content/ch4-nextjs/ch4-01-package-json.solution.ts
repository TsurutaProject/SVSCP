// この演習は package.json というファイルそのものを編集する内容のため、
// このエディタの中で「実際に npm run typecheck を動かす」ことはできません。
// ここでは package.json の中身をオブジェクトとして扱い、scripts に
// typecheck を追加する形で、構造を確かめる練習にしています。
//
// 練習用のエディタなので採点はされません。console.log の結果が右側に表示されます。

const packageJson = {
  name: "svs-app",
  scripts: {
    dev: "next dev",
    build: "next build",
    start: "next start",
    lint: "eslint",
  },
};

// TODO: scripts に "typecheck": "tsc --noEmit" を追加してみましょう

console.log("scriptsの一覧:", Object.keys(packageJson.scripts));
console.log("typecheckの中身:", packageJson.scripts);
