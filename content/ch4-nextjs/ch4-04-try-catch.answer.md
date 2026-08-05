```ts
function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// 動かして確認する
console.log("正しいJSON:", safeJsonParse(valid));
console.log("壊れたJSON:", safeJsonParse(broken));
```

**ポイント**

- **`JSON.parse` は失敗すると例外を投げます**。`null` を返してくれるわけではないので、`try`/`catch` で受け止めない限り、そこでプログラムが止まります。
- **`catch` で握りつぶすのは「代わりの値を返せる」場合だけ**にしてください。ここでは「パースできなければ `null`」という扱いが呼び出し側にとって自然なので成り立ちます。何でも `catch` して無視すると、本当の不具合が見えなくなります。
- **エラーの中身を使わないなら `catch { }` と書けます**(引数を省略できます)。中身を見たい場合は `catch (error)` にして、`String(error)` などで出力します。
- **戻り値の型は `unknown` が安全**です。`JSON.parse` は何が返るか分からないので、使う側で形を確かめてから扱うことになります。`any` にすると、その確認をTypeScriptが求めてくれなくなります。
- 呼び出し側では `const data = safeJsonParse(text); if (data === null) { ... }` のように、失敗した場合の分岐を書くことになります。**失敗を「戻り値」で表現すると、扱いを忘れにくくなる**のがこの形の良いところです。
