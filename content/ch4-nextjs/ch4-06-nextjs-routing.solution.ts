// この演習は「App Routerで /profile を作るには、どのパスにどんな名前のファイルを
// 置くべきか」を考える内容です。ファイル配置そのものはこのエディタでは再現できないため、
// ここでは「URLとファイルパスの対応」を自分で書いて確かめる形にしています。
//
// 練習用のエディタなので採点はされません。console.log の結果が右側に表示されます。

// App Routerでは、URLとファイルパスがフォルダ構成でそのまま対応する。
const routes: Record<string, string> = {
  "/": "src/app/page.tsx",
  "/login": "src/app/login/page.tsx",
  "/exercises/[exerciseId]": "src/app/exercises/[exerciseId]/page.tsx",
};

// TODO: /profile を追加してみましょう(ProfilePageTest を表示するページ)
console.log("URLとファイルの対応:");
for (const [url, file] of Object.entries(routes)) {
  console.log(`  ${url}  ->  ${file}`);
}
