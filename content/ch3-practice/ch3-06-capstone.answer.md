3-1〜3-5の部品を1つにまとめた例です。**関数を上、コンポーネントを下**という並びにしています。

型(`Train` / `Rail` / `Station`)とサンプルデータは、雛形コードに最初から入っています。ここでは`Rail`と`Station`を説明のために再掲していますが、雛形の上に書き足す場合は、型の定義を二重に書かないでください。

```tsx
import { useState } from "react";
import type { ChangeEvent } from "react";

interface Rail {
  id: string;
  type: "fast" | "normal";
  fromX: number;
  toX: number;
  y: number;
  isPlaced: boolean;
}

interface Station {
  id: string;
  name: string;
  x: number;
  y: number;
}

// --- ここが本来の utils/trainUtils.ts(3-2, 3-5) ---
function countDelayedTrains(trains: Train[]): number {
  return trains.filter((train) => train.delayMinutes > 0).length;
}

function getAverageSpeed(trains: Train[]): number {
  if (trains.length === 0) return 0;
  return trains.reduce((sum, train) => sum + train.speed, 0) / trains.length;
}

function findTrainByName(trains: Train[], name: string): Train | undefined {
  return trains.find((train) => train.name === name);
}

function hasAnyDelayedTrain(trains: Train[]): boolean {
  return trains.some((train) => train.delayMinutes > 0);
}

function sortBySpeedDescending(trains: Train[]): Train[] {
  return [...trains].sort((left, right) => right.speed - left.speed);
}

// --- ここから画面(3-3, 3-4 + 2章の復習) ---
// stations / initialRails は雛形コードに入っているものをそのまま使う

function DispatchPanel() {
  const [trains, setTrains] = useState<Train[]>(initialTrains);
  const [rails, setRails] = useState<Rail[]>(initialRails);
  const [keyword, setKeyword] = useState("");

  const toggleRail = (railId: string) => {
    setRails((previousRails) =>
      previousRails.map((rail) =>
        rail.id === railId ? { ...rail, isPlaced: !rail.isPlaced } : rail,
      ),
    );
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const found = keyword === "" ? undefined : findTrainByName(trains, keyword);

  return (
    <div>
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

      {hasAnyDelayedTrain(trains) && <p>⚠ 遅延している電車があります</p>}

      <p>
        遅延{countDelayedTrains(trains)}本 / 平均速度{getAverageSpeed(trains)}km/h
      </p>

      <input value={keyword} onChange={handleSearchChange} placeholder="電車名で検索" />
      <p>検索結果: {found ? `${found.name}(${found.speed}km/h)` : "該当なし"}</p>

      <button onClick={() => setTrains((prev) => sortBySpeedDescending(prev))}>
        速度順に並び替え
      </button>

      <ul>
        {trains.map((train) => (
          <li key={train.id}>
            {train.name} — {train.speed}km/h
            {train.delayMinutes > 0 ? `(${train.delayMinutes}分遅れ)` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  return <DispatchPanel />;
}
```

**ポイント**

- **計算する関数と、画面を作るコンポーネントを、はっきり分けている**のがこの演習の中心です。上半分はReactを一切知らない普通の関数で、単体で正しさを確かめられます。
- **`sortBySpeedDescending` は `[...trains]` でコピーしてから並び替える**ので、`setTrains((prev) => sortBySpeedDescending(prev))` と書いても元のstateを壊しません。関数側で守っているので、呼び出し側は気を遣わずに済みます。
- **`hasAnyDelayedTrain(trains) && ...` が条件付きレンダリング**。「出すか出さないか」だけなので `&&` を使います。
- **検索は「入力が空なら検索しない」を先に判定**しています。空文字で `.find()` すると常に該当なしになるだけですが、意図を明示しておくと読みやすくなります。
- **レールの更新は関数型更新**(`(previousRails) => ...`)。3-4と同じ理由です。
- 1ファイルに詰め込んでいますが、実際のプロジェクトでは `utils/trainUtils.ts` と `components/DispatchPanel.tsx` に分けます。**分ける境界がどこかは、この並びのまま**です。
