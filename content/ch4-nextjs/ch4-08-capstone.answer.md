このエディタでは、要件の中心にあたる**ロジック(並び替えと投票の反映)**を書いて確かめられます。

```ts
// 人気順(votesの多い順)。元の配列は変更しない
function sortByVotesDescending(list: Cake[]): Cake[] {
  return [...list].sort((left, right) => right.votes - left.votes);
}

// 指定したケーキの votes を1増やした「新しい配列」を返す
function voteForCake(list: Cake[], cakeId: string): Cake[] {
  return list.map((cake) => (cake.id === cakeId ? { ...cake, votes: cake.votes + 1 } : cake));
}

// 動かして確認する
console.log("人気順:", sortByVotesDescending(cakes).map((cake) => cake.name));

const afterVote = voteForCake(cakes, "c2");
console.log("投票後のチョコケーキ:", afterVote.find((cake) => cake.id === "c2")?.votes);
console.log("元の配列は無事:", cakes.find((cake) => cake.id === "c2")?.votes);
```

**実際のNext.jsでの形**

```ts
// src/app/api/cakes/popularity/route.ts
export async function GET() {
  return Response.json([
    { cakeKind: "shortcake", votes: 12 },
    { cakeKind: "chocolate", votes: 8 },
  ]);
}
```

```tsx
// src/app/cakes/ranking/page.tsx
export default async function RankingPage() {
  try {
    const response = await fetch("http://localhost:3000/api/cakes/popularity", {
      cache: "no-store",
    });
    const cakes: CakePopularity[] = await response.json();
    const ranked = [...cakes].sort((left, right) => right.votes - left.votes);

    return (
      <ul>
        {ranked.map((cake) => (
          <li key={cake.cakeKind}>
            {cake.cakeKind}: {cake.votes}票
          </li>
        ))}
      </ul>
    );
  } catch {
    return <p>ランキングを取得できませんでした</p>;
  }
}
```

```ts
// src/app/cakes/actions.ts
"use server";

import { revalidatePath } from "next/cache";

const VALID_CAKE_KINDS = ["shortcake", "chocolate"];

export async function voteForCake(cakeKind: string) {
  if (!VALID_CAKE_KINDS.includes(cakeKind)) {
    return;
  }

  console.log("投票:", cakeKind);

  revalidatePath("/cakes/ranking");
}
```

**ポイント**

- **並び替えは `[...list]` でコピーしてから**。3章と同じで、`.sort()` は元の配列を壊します。最後の `console.log` で、元の配列が無事なことを確かめてみてください。
- **投票も `.map()` で新しい配列を返す**形。`cake.votes++` と直接書き換えると、Reactのstateとして持っているときに再描画されません。
- **`voteForCake` の早期リターンが要件の中心**です。引数はブラウザから送られてくる = 自由に細工できる値なので、**サーバー側で必ず確かめてから処理する**必要があります。`actions.ts` の `updateExerciseStatus` がステータス文字列を検証しているのと同じ形です。
- **`revalidatePath` は「このページのキャッシュを捨てて作り直して」という指示**。これを呼ばないと、投票しても表示が古いままになります。
- **`try`/`catch` で囲むのは、`fetch` がネットワークの都合で失敗しうるから**です。自分のコードが正しくても失敗する種類の処理なので、必ず失敗時の表示を用意します。
