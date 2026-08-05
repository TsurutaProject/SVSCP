**エラーの読み方**

```
TypeError: Cannot read properties of null (reading 'toUpperCase')
    at formatName (utils/nameUtils.ts:12:34)
    at Component (components/Profile.tsx:8:20)
```

- **1行目が「何が起きたか」**。「`null` のプロパティを読もうとした。読もうとしたのは `toUpperCase`」と書いてあります。つまり **`null` に対して `.toUpperCase()` を呼んだ**ということです。
- **2行目が「どこで起きたか」**。`utils/nameUtils.ts` の**12行目34文字目**、`formatName` 関数の中。まずここを開きます。
- **3行目以降は「どこから呼ばれたか」**。`components/Profile.tsx` の8行目が `formatName` を呼んでいます。**12行目を見ても原因が分からないときは、こちらを見て「なぜ `null` が渡ってきたのか」を追います**。

**直し方**

原因は「`null` かもしれない値のチェックが抜けている」ことなので、`?.` やnullチェックを足します。

```ts
function formatName(name: string | null) {
  return name?.toUpperCase() ?? "(名前未設定)";
}
```

**ポイント**

- **スタックトレースは上から下へ「起きた場所 → 呼んだ場所」の順**に並びます。いちばん上の、自分が書いたファイルの行がまず見るべき場所です。
- **`Cannot read properties of null (reading 'X')` は「`.X` の直前にあるものが `null` だった」**という意味。`a.b.c` のような式なら、`c` を読もうとして落ちたなら `a.b` が `null` です。どこが `null` なのかを、この読み方で特定できます。
- **`undefined` 版のメッセージもほぼ同じ形**で出ます(`Cannot read properties of undefined`)。原因の探し方も同じです。
- **本当の対処は2択**です。(1) `?.` で `null` でも落ちないようにする、(2) そもそも `null` が渡らないよう呼び出し元を直す。どちらが正しいかは「その値が `null` になるのは正常なことか」で決まります。正常なら(1)、異常なら(2)です。
