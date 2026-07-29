// station というオブジェクト({ name: "東京", platform: { number: 3 } } または
// { name: "新宿" } のように、platformがあったりなかったりする)から、
// ホーム番号があればその番号を、なければ "未定" という文字列を返す関数を、
// ?. と ?? を使って実装してください。
//
// クリア条件:
// - ?.を使ってプロパティに安全にアクセスしていること
// - ??を使ってデフォルト値("未定")を指定していること
// - platformがある場合は番号(例:3)、ない場合は"未定"が返ること

type Station = { name: string; platform?: { number: number } };

export const getPlatformNumber = (station: Station): number | string => {
  throw new Error("TODO: 実装してください");
};
