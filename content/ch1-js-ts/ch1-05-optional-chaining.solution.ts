// station というオブジェクト({ name: "東京", platform: { number: 3 } } または
// { name: "新宿" } のように、platformがあったりなかったりする)から、
// ホーム番号があればその番号を、なければ "未定" という文字列を返す
// getPlatformNumber 関数を、?. と ?? を使って実装してください。
//
// テストは import で読み込むため、関数や型には export を付けてください。

// 演習の前提データ。console.log で動きを確かめるのに使ってください。
// (採点はこの2つではなく、テスト側が用意したデータで行われます)
const station = { name: "東京", platform: { number: 3 } };
const stationWithoutPlatform = { name: "新宿" };
