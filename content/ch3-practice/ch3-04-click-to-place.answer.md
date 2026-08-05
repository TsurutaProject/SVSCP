```tsx
import { useState } from "react";

function RouteMap() {
  const [rails, setRails] = useState<Rail[]>(initialRails);

  const toggleRail = (railId: string) => {
    setRails((previousRails) =>
      previousRails.map((rail) =>
        rail.id === railId ? { ...rail, isPlaced: !rail.isPlaced } : rail,
      ),
    );
  };

  return (
    <svg viewBox="0 0 220 100" width={220} height={100} style={{ border: "1px solid #ccc" }}>
      {rails.map((rail) => (
        <line
          key={rail.id}
          x1={rail.fromX}
          y1={rail.y}
          x2={rail.toX}
          y2={rail.y}
          stroke={rail.isPlaced ? "#ef6c00" : "#ccc"}
          strokeWidth={8}
          style={{ cursor: "pointer" }}
          onClick={() => toggleRail(rail.id)}
        />
      ))}

      {stations.map((station) => (
        <circle key={station.id} cx={station.x} cy={station.y} r={8} fill="#555" />
      ))}
    </svg>
  );
}

export default function App() {
  return <RouteMap />;
}
```

**ポイント**

- **`.map()` で「該当する1件だけ差し替えた新しい配列」を返す**のが、配列stateの更新の基本形です。`previousRails[0].isPlaced = true` のように直接書き換えると、配列の中身は変わってもReactは「同じ配列だ」と判断して再描画してくれません。
- **`{ ...rail, isPlaced: !rail.isPlaced }` も新しいオブジェクトを作っています**。配列だけでなく、中のオブジェクトも作り直すのがポイントです(1章のスプレッド構文がそのまま効いてきます)。
- **関数型更新 `(previousRails) => ...` を使う理由**は、常に最新のstateから計算できるからです。`setRails(rails.map(...))` と書くと、その描画時点の古い `rails` を参照するため、素早く連続でクリックしたときに更新が取りこぼされることがあります。
- **`onClick` はSVGの要素にもそのまま付けられます**。`<line>` は細いのでクリックしづらいときは、`strokeWidth` を太くすると当たり判定も広がります。
- `cursor: "pointer"` は動作には関係ありませんが、押せる場所だと分かるので付けておくと親切です。
