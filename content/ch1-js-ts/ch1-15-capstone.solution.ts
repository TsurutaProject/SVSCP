// 総合演習:電車の運行管理 & ケーキの注文管理
// Part A・Part Bのすべての関数(と型)を実装してください。

// ============================================================
// Part A:電車の運行管理ミニ関数群(JS)
// ============================================================

export type Train = { name: string; speed: number; delayMinutes: number };

// 1. 遅延してる(delayMinutesが0より大きい)電車だけを抽出した配列を返す。.filter()を使うこと。
export const getDelayedTrains = (trains: Train[]): Train[] => {
  throw new Error("TODO: 実装してください");
};

// 2. 1つの電車オブジェクトを受け取り、"◯◯:3分遅延" または "◯◯:定刻" という文字列を返す。
//    分割代入・テンプレートリテラル・三項演算子を組み合わせて書くこと。
export const formatDelayReport = (train: Train): string => {
  throw new Error("TODO: 実装してください");
};

// 3. 電車オブジェクトと新しい遅延分数を受け取り、delayMinutesだけを更新した
//    新しいオブジェクトを返す(元のtrainオブジェクトは変更しないこと)。スプレッド構文を使うこと。
export const updateDelay = (train: Train, newDelay: number): Train => {
  throw new Error("TODO: 実装してください");
};

// 4. 電車の配列を受け取り、遅延してる電車だけについてformatDelayReportと
//    同じ形式の文字列の配列を返す。.filter()と.map()を組み合わせて書くこと。
export const getDelaySummary = (trains: Train[]): string[] => {
  throw new Error("TODO: 実装してください");
};

// 5. 電車の配列を受け取り、先頭の電車の名前を返す。trainsがundefinedや
//    空配列の場合でもエラーにならず、"該当なし"を返すこと。?.と??を使うこと。
export const getFirstTrainName = (trains?: Train[]): string => {
  throw new Error("TODO: 実装してください");
};

// ============================================================
// Part B:ケーキの注文管理(TypeScript)
// ============================================================

// 1. Order型を定義する
export interface Order {
  customerName: string;
  cakeKind: "shortcake" | "chocolate";
  toppings?: string[];
  isCompleted: boolean;
}

// 2. 注文を受け取り、isCompletedをtrueにした新しいオブジェクトを返す
//    (元のオブジェクトは変更しないこと)。スプレッド構文を使うこと。
export const completeOrder = (order: Order): Order => {
  throw new Error("TODO: 実装してください");
};

// 3. 注文の配列を受け取り、isCompletedがfalseの注文だけを抽出した配列を返す。
export const getPendingOrders = (orders: Order[]): Order[] => {
  throw new Error("TODO: 実装してください");
};

// 4. 注文を受け取り、"のりまきさん:ショートケーキ(トッピング:いちご、生クリーム)"
//    (トッピングなしの場合は "のりまきさん:ショートケーキ") という文字列を返す。
//    cakeKindが"shortcake"なら"ショートケーキ"、"chocolate"なら"チョコケーキ"と表示すること。
export const formatOrderSummary = (order: Order): string => {
  throw new Error("TODO: 実装してください");
};

// 5. トッピングの種類("strawberry" | "cream" | "banana")ごとの在庫数(number)を
//    表す型を、Recordを使って定義し、そのサンプル値をexportすること(値は自由でOK)。
export type ToppingKind = "strawberry" | "cream" | "banana";
export type ToppingStock = Record<ToppingKind, number>;

export const sampleToppingStock: ToppingStock = undefined as unknown as ToppingStock; // TODO: 3種類すべてのキーを持つオブジェクトに置き換えてください
