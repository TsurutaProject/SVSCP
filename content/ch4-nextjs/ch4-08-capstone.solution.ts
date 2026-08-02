// 総合演習:ケーキ人気投票ランキング
// 教材の要件1〜3(API Route / ページルーティング / Server Action)は、実際には
// Next.jsのファイル配置が必要なため、このエディタの中だけでは再現できません。
// ここでは中身のロジック(集計・並び替え・投票の反映)を書いて動かせるようにしています。
//
// 練習用のエディタなので採点はされません。console.log の結果が右側に表示されます。

interface Cake {
  id: string;
  name: string;
  votes: number;
}

const cakes: Cake[] = [
  { id: "c1", name: "ショートケーキ", votes: 12 },
  { id: "c2", name: "チョコケーキ", votes: 8 },
  { id: "c3", name: "モンブラン", votes: 15 },
];

// TODO: 人気順(votesの多い順)に並べ替える関数を書いてみましょう
//       元の配列は変更しないこと

// TODO: voteForCake(cakes, cakeId) を書いてみましょう
//       指定したケーキの votes を1増やした新しい配列を返します

console.log("現在の一覧:", cakes);
