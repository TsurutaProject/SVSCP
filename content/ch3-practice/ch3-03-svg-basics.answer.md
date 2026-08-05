```tsx
interface RouteMapProps {
  stations: Station[];
}

function RouteMap({ stations }: RouteMapProps) {
  return (
    <svg viewBox="0 0 220 100" width={220} height={100} style={{ border: "1px solid #ccc" }}>
      {/* 隣り合う駅どうしを線で結ぶ。最後の駅には「次」がないので除く */}
      {stations.slice(0, -1).map((station, index) => {
        const next = stations[index + 1];
        return (
          <line
            key={`${station.id}-${next.id}`}
            x1={station.x}
            y1={station.y}
            x2={next.x}
            y2={next.y}
            stroke="#888"
            strokeWidth={4}
          />
        );
      })}

      {/* 駅の丸と名前。線より後ろに書くと、線の上に重なって描かれる */}
      {stations.map((station) => (
        <g key={station.id}>
          <circle cx={station.x} cy={station.y} r={8} fill="#ef6c00" />
          <text x={station.x} y={station.y - 14} textAnchor="middle" fontSize={10}>
            {station.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function App() {
  return <RouteMap stations={stations} />;
}
```

**ポイント**

- **`viewBox="0 0 220 100"` は「この図の座標系は横220・縦100です」という宣言**。データの `x: 20` などがそのままこの座標として扱われます。`width`/`height` は画面上の表示サイズなので、両者は別物です。
- **SVGは書いた順に描かれます**。線を先、丸を後にすると丸が線の上に乗ります。逆にすると線が丸の上を通ってしまうので、順番も意味を持ちます。
- **`.slice(0, -1)` で最後の1つを除く**のが、「隣り合うペア」を作るときの定番です。3駅なら線は2本なので、最後の駅から始まる線は存在しません。
- **`key` は兄弟の中で一意ならOK**。線には「どの駅とどの駅を結ぶか」を組み合わせた文字列を使っています。`index` を使うのは、並び順が変わったときにReactが取り違えるので避けます。
- **属性名はキャメルケース**(`stroke-width` ではなく `strokeWidth`)。JSXの中ではCSSのプロパティ名と同じ変換ルールが適用されます。
- 複数の要素をまとめたいときは `<g>`(group)で包みます。`key` はこの一番外側に付けます。
