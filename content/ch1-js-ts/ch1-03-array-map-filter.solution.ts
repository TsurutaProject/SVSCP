// cars という配列から、速度が100以上の車両の名前だけを配列にして返す関数を、
// .filter() と .map() を組み合わせて実装してください。
//
// クリア条件:
// - .filter()で速度100以上の車両を絞り込んでいること
// - .map()で名前だけの配列に変換していること
// - 結果が ["新幹線", "特急"] になること

type Car = { name: string; speed: number };

export const getFastCarNames = (cars: Car[]): string[] => {
  throw new Error("TODO: 実装してください");
};
