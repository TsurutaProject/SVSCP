```ts
async function incrementCounter(currentCount: number): Promise<number> {
  return currentCount + 1;
}

// 動かして確認する
incrementCounter(3).then((next) => console.log("次の値:", next));
```

実際のNext.jsでは、ファイルの先頭に `"use server"` を書いて `export` します。

```ts
"use server";

export async function incrementCounter(currentCount: number): Promise<number> {
  return currentCount + 1;
}
```

**ポイント**

- **`"use server"` はファイルの先頭(またはやりたい関数の先頭)に書く目印**です。これがあると、Next.jsは「この関数はサーバーでだけ実行する」と判断し、ブラウザ側には**関数の中身を配りません**。呼び出しはネットワーク越しに行われます。
- **だからServer Actionは必ず `async`** です。ブラウザから見れば通信なので、結果は `Promise` でしか受け取れません。同期関数として書くことはできません。
- **中身がブラウザに渡らない = 秘密の値を扱える**ということ。DBのキーやサービスロールキーを使う処理は、この中でしか書けません。逆に言うと、**引数として渡ってくる値は利用者が自由に細工できる**ので、必ずサーバー側で検証する必要があります(このプロジェクトの `actions.ts` が、毎回 `getUser()` で本人確認をやり直しているのはそのためです)。
- **`"use server"` のあるファイルは、非同期関数以外をexportできません**。定数を共有したいときは別ファイルに置きます。
