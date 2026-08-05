```ts
async function getUserProfile(userId: string): Promise<string> {
  const user = await fetchUser(userId);
  return user.name;
}

// 動かして確認する
getUserProfile("u1").then((name) => console.log("名前だけ:", name));
```

**ポイント**

- **`await` は `async` 関数の中でしか使えません**。関数の頭に `async` を付け忘れると、その時点で構文エラーになります。
- **`await` を書き忘れると、`user` には `Promise` オブジェクトそのものが入ります**。`user.name` は `undefined` になり、エラーは出ないまま結果だけがおかしくなるので気づきにくい間違いです。
- **`async` 関数の戻り値は必ず `Promise` に包まれます**。`return user.name` と文字列を返していても、関数の型は `Promise<string>` です。だから呼び出し側でも `await` するか `.then()` が必要になります。
- **`await` は「終わるまで待つ」ように書けるだけで、実際にページが固まるわけではありません**。待っている間、他の処理は普通に進みます。`.then()` のネストが深くなりがちな処理を、上から下に読める形で書けるのが `async`/`await` の利点です。
- `setTimeout` を `Promise` で包んでいるのは、時間のかかる通信を待つ状況を再現するためです。実際は `fetch()` などがここに入ります。
