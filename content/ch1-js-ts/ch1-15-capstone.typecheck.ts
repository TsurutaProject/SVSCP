// Part BのOrder型の定義自体が正しいかを検証する(Part Aや他のPart Bの
// 関数は実行時テストのみで検証しており、ここではOrder型のみを対象とする)。
import type { Order } from "./solution";

const _order1: Order = {
  customerName: "のりまき",
  cakeKind: "shortcake",
  isCompleted: false,
};

const _order2: Order = {
  customerName: "しばまき",
  cakeKind: "chocolate",
  toppings: ["いちご"],
  isCompleted: true,
};

const _invalidCakeKind: Order = {
  customerName: "x",
  // @ts-expect-error - cakeKindは"shortcake"|"chocolate"以外を許容しないはず
  cakeKind: "vanilla",
  isCompleted: false,
};
