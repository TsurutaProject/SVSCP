// レビュー演習:3つのコード例には、それぞれ問題が1つずつ潜んでいます。
// 何が問題かを考えて、修正したコードに書き換えてください。
// 教材の「解答を見る」と照らし合わせながら確かめられます。
//
// コード例2・3はNext.js固有のため、このエディタでは実際には動かせません。
// ここでは主にコード例1(awaitの付け忘れ)を実際に動かして確かめられます。
//
// 練習用のエディタなので採点はされません。console.log の結果が右側に表示されます。

// fetch の代わりに、同じ形で動くダミーを用意しています
const fakeFetch = (_url: string) =>
  new Promise<{ json: () => Promise<{ cakeKind: string; votes: number }[]> }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          json: async () => [
            { cakeKind: "ショートケーキ", votes: 12 },
            { cakeKind: "チョコケーキ", votes: 8 },
          ],
        }),
      300,
    ),
  );

// --- コード例1: await が足りていない ---
async function getCakeRanking() {
  const response = fakeFetch("/api/cakes/popularity");
  const data = response.json();
  return data;
}

getCakeRanking().then((data) => console.log("取得できた中身:", data));

// --- コード例2: Server Action。revalidatePath は足りている? 何が抜けている? ---
// "use server";
// export async function voteForCake(cakeKind: string) {
//   await db.incrementVote(cakeKind);
//   revalidatePath("/cakes/ranking");
// }

// --- コード例3: Server ComponentからAPI Routeを相対パスで呼んでいる ---
// async function RankingPage() {
//   const response = await fetch("/api/cakes/popularity");
//   const data = await response.json();
//   ...
// }
