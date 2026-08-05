// cars という配列(各要素は { name: string; speed: number })から、
// 速度が100以上の車両の名前だけを配列にして返す getFastCarNames 関数を、
// .filter() と .map() を組み合わせて実装してください。
//
// テストは import で読み込むため、関数や型には export を付けてください。

// 演習の前提データ。console.log で動きを確かめるのに使ってください。
// (採点はこの cars ではなく、テスト側が用意したデータで行われます)
const cars = [
  { name: "新幹線", speed: 300 },
  { name: "特急", speed: 130 },
  { name: "普通", speed: 80 },
];
