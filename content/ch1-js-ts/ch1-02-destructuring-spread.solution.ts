// { name: "のりまき", score: 80 } のようなオブジェクトを受け取って、
// score だけを 100 に上書きした新しいオブジェクトを返す関数を実装してください。
//
// クリア条件:
// - 元のオブジェクトを直接書き換えていないこと(新しいオブジェクトを返している)
// - スプレッド構文(...)を使っていること
// - { name: "のりまき", score: 100 } が返ること

type Player = { name: string; score: number };

export const updateScoreTo100 = (player: Player): Player => {
  throw new Error("TODO: 実装してください");
};
