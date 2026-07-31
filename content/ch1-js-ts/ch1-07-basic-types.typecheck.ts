// 実行時の値だけでなく、宣言した型そのものが正しいかを検証する。
// (Sandpackの実行時テストは型を消してJSとして実行するだけなので、
// このファイルは別途サーバー側でコンパイルチェックされる)
import { price, itemName, inStock } from "./solution";

const _price: number = price;
const _itemName: string = itemName;
const _inStock: boolean = inStock;
