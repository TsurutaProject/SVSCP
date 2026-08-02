// この演習は「NEXT_PUBLIC_ をつけ忘れた環境変数をブラウザ側で読もうとしたらどうなるか」を
// 予想して説明する内容です。ここでは実際に読んでみて、予想と合っているか確かめられます。
//
// 練習用のエディタなので採点はされません。console.log の結果が右側に表示されます。

// ブラウザ側で動くコードから環境変数を読もうとすると、どうなるでしょうか?
console.log("NEXT_PUBLIC_ 付き:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("NEXT_PUBLIC_ なし:", process.env.SUPABASE_SERVICE_ROLE_KEY);

// TODO: 上の2つの結果の違い(と、なぜそうなるか)を自分の言葉で説明してみましょう。
// なお、このエディタはNext.jsではないので、どちらも undefined になります。
// 「サーバー側にしか無い値は、ブラウザに配られるコードからは見えない」という
// 感覚をつかむのが目的です。
