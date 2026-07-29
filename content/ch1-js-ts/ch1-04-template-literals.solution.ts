// stationName(駅名)と delayMinutes(遅延分数)から、
// delayMinutesが0より大きい場合は「◯◯駅でX分遅延しています」、
// 0の場合は「◯◯駅は定刻通りです」という文字列を返す関数を、
// テンプレートリテラルと三項演算子を使って実装してください。
//
// クリア条件:
// - テンプレートリテラル(`と${})を使っていること
// - ${}の中で三項演算子を使い、条件によって文言を出し分けていること
// - formatDelayMessage("東京", 5) が "東京駅で5分遅延しています" を、
//   formatDelayMessage("東京", 0) が "東京駅は定刻通りです" を返すこと

export const formatDelayMessage = (stationName: string, delayMinutes: number): string => {
  throw new Error("TODO: 実装してください");
};
