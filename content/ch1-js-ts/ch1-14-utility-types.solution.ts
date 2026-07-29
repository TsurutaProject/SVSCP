// CakeKind("shortcake" | "chocolate")という型があるとして、Recordを使って、
// それぞれのケーキの在庫数(number)を持つstockというオブジェクトを
// 定義してください。その後、Partial<Record<...>>を使って、
// 「一部のケーキだけ割引率(number)が設定されている」discountsという
// オブジェクトも定義してください(値は自由でOK)。
//
// クリア条件:
// - stockがRecord<CakeKind, number>型で、両方のケーキ種類分のキーが揃っていること
// - discountsがPartial<Record<CakeKind, number>>型で、一部のキーだけでもエラーにならないこと

type CakeKind = "shortcake" | "chocolate";

export const stock: Record<CakeKind, number> = undefined as unknown as Record<
  CakeKind,
  number
>; // TODO: shortcake/chocolate両方のキーを持つオブジェクトに置き換えてください

export const discounts: Partial<Record<CakeKind, number>> = undefined as unknown as Partial<
  Record<CakeKind, number>
>; // TODO: 一部のキーだけを持つオブジェクトに置き換えてください
