**コード例1:`.sort()` が元の配列を壊している**

`.sort()` は**元の配列を直接並び替える破壊的メソッド**です。新しい配列を返しているように見えて、実際は引数で受け取った `trains` そのものを変えてしまっています。

```ts
function sortBySpeedDescending(trains: Train[]): Train[] {
  return [...trains].sort((a, b) => b.speed - a.speed);
}
```

---

**コード例2:`.find()` の結果を確かめずに使っている**

`.find()` は見つからないと `undefined` を返します。`train.speed` にそのままアクセスすると、該当する電車がない場合に実行時エラーになります。

```ts
function getTrainSpeed(trains: Train[], name: string): number | undefined {
  const train = trains.find((t) => t.name === name);
  return train?.speed;
}
```

**戻り値の型も `number | undefined` に直す**のがセットです。「見つからないことがある」という事実を、型の上でも正直に書いておきます。

---

**コード例3:関数型更新になっていない**

`setRails(rails.map(...))` は、その描画時点の古い `rails` を参照します。`toggleRail("r1")` を連続で呼ぶと、2回目も1回目の前の状態から計算されるため、2回反転させたつもりが1回分しか反映されません。

```tsx
const toggleRail = (railId: string) => {
  setRails((previousRails) =>
    previousRails.map((rail) =>
      rail.id === railId ? { ...rail, isPlaced: !rail.isPlaced } : rail,
    ),
  );
};
```

---

**ポイント**

3つに共通するのは、**「今この瞬間は動いて見えるが、条件が揃うと壊れる」**という点です。1は呼び出し元が元の順序を使ったとき、2は検索が空振りしたとき、3は続けて呼ばれたときに初めて表面化します。どれも普段の操作では気づきにくいぶん、書く時点で気をつけておく価値があります。
