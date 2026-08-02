// safeJsonParse(text: string) という関数を作ってください。
// JSON.parse(text) を try/catch で囲み、成功すれば結果を、失敗すれば null を返します。
//
// 練習用のエディタなので採点はされません。console.log の結果が右側に表示されます。

// ここに safeJsonParse を書いてみましょう

// 動かして確認する(正しいJSONと、壊れたJSONの両方を試す)
const valid = '{ "name": "のりまき", "score": 80 }';
const broken = '{ "name": "のりまき", ';

console.log("正しいJSON:", valid);
console.log("壊れたJSON:", broken);
