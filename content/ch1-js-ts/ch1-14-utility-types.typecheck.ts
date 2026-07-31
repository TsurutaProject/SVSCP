// 実行時の値だけでなく、宣言した型そのものが正しいかを検証する。
import { stock, discounts } from "./solution";

type CakeKind = "shortcake" | "chocolate";

const _stock: Record<CakeKind, number> = stock;
const _discounts: Partial<Record<CakeKind, number>> = discounts;
