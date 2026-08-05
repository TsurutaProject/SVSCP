本来は `utils/trainUtils.ts` に切り出して `import` しますが、この練習用エディタは1ファイル構成なので、ファイル上部にまとめる形にしています。**「コンポーネントの中にロジックを書かない」という要点は同じ**です。

```tsx
// ここが本来の utils/trainUtils.ts にあたる部分
function countDelayedTrains(trains: Train[]): number {
  return trains.filter((train) => train.delayMinutes > 0).length;
}

function getAverageSpeed(trains: Train[]): number {
  if (trains.length === 0) return 0;

  const total = trains.reduce((sum, train) => sum + train.speed, 0);
  return total / trains.length;
}

export default function App() {
  return (
    <div>
      <p>遅延している本数: {countDelayedTrains(trains)}本</p>
      <p>平均速度: {getAverageSpeed(trains)}km/h</p>
    </div>
  );
}
```

**ポイント**

- **コンポーネント側は「呼ぶだけ」になっているのが要点**です。`{trains.filter(...).length}` のようにJSXの中で計算を書き始めると、コンポーネントがどんどん読みにくくなります。
- **切り出した関数は、Reactを一切知らない普通の関数**です。だからこそ、コンポーネントを描画しなくても単体でテストでき、他の画面からも使い回せます。「Reactの外に出せるものは外に出す」というのが、この演習のねらいです。
- **`getAverageSpeed` の `if (trains.length === 0) return 0;` を忘れない**。空配列だと `0 / 0` で `NaN` になり、画面に「NaN」と表示されてしまいます。関数を切り出すと、こうした端のケースを関数側で引き受けられるようになります。
- `.reduce()` は「配列を1つの値にまとめる」メソッドで、合計を出すときの定番です。第2引数の `0` が初期値で、これも空配列対策になります。
