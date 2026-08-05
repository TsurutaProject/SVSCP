**コード例1:`await` の付け忘れ**

`fetch(...)` と `response.json()` の**どちらにも `await` がありません**。`await` なしだと `response` には結果ではなく Promise そのものが入り、`.json()` も呼べません。

```ts
async function getCakeRanking() {
  const response = await fetch("/api/cakes/popularity");
  const data = await response.json();
  return data;
}
```

`.json()` も非同期処理である点を見落としがちです。`async` 関数の中では、**非同期の呼び出しごとに `await` が要る**と考えてください。

---

**コード例2:Server Actionで入力を検証していない**

`cakeKind` を検証せず、そのままDB処理に渡しています。Server Actionは**ブラウザから直接呼び出せる**ので、届く値は信頼できません。

```ts
"use server";

const VALID_CAKE_KINDS = ["shortcake", "chocolate"];

export async function voteForCake(cakeKind: string) {
  if (!VALID_CAKE_KINDS.includes(cakeKind)) {
    return;
  }

  await db.incrementVote(cakeKind);
  revalidatePath("/cakes/ranking");
}
```

このプロジェクトの `actions.ts` にある `updateExerciseStatus` が、ステータス文字列を `includes` で確かめてから進んでいるのと同じ形です。**関数を呼んでいるだけに見えても、実態はネットワーク越しの入り口**だと考えてください。

---

**コード例3:失敗を考慮していない**

`fetch` もDBへの問い合わせも、自分のコードが正しくても失敗します。`try`/`catch` が無いと、利用者には真っ白な画面が出るだけになります。

```tsx
async function RankingPage() {
  try {
    const response = await fetch("/api/cakes/popularity");
    const data = await response.json();

    return (
      <ul>
        {data.map((item) => (
          <li key={item.cakeKind}>
            {item.cakeKind}: {item.votes}票
          </li>
        ))}
      </ul>
    );
  } catch {
    return <p>ランキングを取得できませんでした。</p>;
  }
}
```

---

**ポイント**

3つとも、**「外の世界」と接する場所で起きる問題**です。通信の完了を待つ(1)、外から来る値を疑う(2)、外が失敗することを見込む(3)。自分のコードの中だけで完結する処理とは、気をつける観点が変わります。ここが4章全体の要点でもあります。
