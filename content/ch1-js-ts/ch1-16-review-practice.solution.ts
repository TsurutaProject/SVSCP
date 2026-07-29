// 3つのコード例には、それぞれ問題が1つずつ潜んでいます。
// 何が問題かを考えて、修正したコードに書き換えてください。

// --- コード例1: ミューテーション ---
interface Order {
  customerName: string;
  isCompleted: boolean;
}

export const completeOrder = (order: Order): Order => {
  order.isCompleted = true; // TODO: 元のオブジェクトを直接書き換えず、新しいオブジェクトを返すようにしてください
  return order;
};

// --- コード例2: any型 ---
// TODO: cakeの型がanyになっている問題を修正してください(interfaceを定義する)
export const getCakePrice = (cake: any): number => {
  return cake.price;
};

// --- コード例3: 分岐漏れ ---
export type CakeKind = "shortcake" | "chocolate";

export const getCakeLabel = (kind: CakeKind): string => {
  if (kind === "shortcake") {
    return "ショートケーキ";
  }
  throw new Error("TODO: chocolateの場合の分岐を実装してください");
};
