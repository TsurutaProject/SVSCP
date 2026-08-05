```tsx
function findTrainByName(trains: Train[], name: string): Train | undefined {
  return trains.find((train) => train.name === name);
}

function hasAnyDelayedTrain(trains: Train[]): boolean {
  return trains.some((train) => train.delayMinutes > 0);
}

function sortBySpeedDescending(trains: Train[]): Train[] {
  return [...trains].sort((left, right) => right.speed - left.speed);
}

export default function App() {
  const found = findTrainByName(trains, "ひかり5号");

  return (
    <div>
      <p>検索結果: {found ? `${found.name}(${found.speed}km/h)` : "見つかりませんでした"}</p>
      <p>遅延あり: {hasAnyDelayedTrain(trains) ? "はい" : "いいえ"}</p>
      <p>速い順: {sortBySpeedDescending(trains).map((train) => train.name).join(" → ")}</p>
      <p>元の順番(変わっていないこと): {trains.map((train) => train.name).join(" → ")}</p>
    </div>
  );
}
```

**ポイント**

- **`.find()` は見つからないと `undefined` を返します**。戻り値の型が `Train | undefined` になるので、使う側では `found ? ... : ...` のように「無かった場合」を必ず扱うことになります。いきなり `found.name` と書くとTypeScriptに止められます。
- **`.some()` は「1つでも当てはまるか」を `true`/`false` で返します**。`.filter(...).length > 0` でも同じ結果になりますが、`.some()` は最初の1件が見つかった時点で打ち切るので、意図も効率も素直です。
- **`.sort()` は元の配列を直接並び替えます**。これがこの演習のいちばんの落とし穴です。`[...trains]` でコピーしてから並べ替えれば、元の `trains` は無事なままです。最後の行で元の順番が変わっていないことを確かめてみてください。
- **降順は `right.speed - left.speed`**、昇順はその逆です。「引き算の結果がマイナスなら左が先」と覚えると、どちらの順番か迷いにくくなります。
- 数値の比較関数を省いて `.sort()` だけ呼ぶと、**文字列として比較される**ため `130` が `250` より後ろに来る、といった直感に反する結果になります。数値を並べるときは必ず比較関数を渡してください。
