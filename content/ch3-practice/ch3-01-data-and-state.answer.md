プレイグラウンドは `default export` されたものを表示するので、`DispatchPanel` を `App` から呼び出す形にしています。

```tsx
import { useState } from "react";

interface Train {
  id: string;
  name: string;
  speed: number;
  delayMinutes: number;
}

interface Rail {
  id: string;
  type: "fast" | "normal";
  isPlaced: boolean;
}

function DispatchPanel() {
  const [trains, setTrains] = useState<Train[]>([
    { id: "t1", name: "のぞみ1号", speed: 300, delayMinutes: 0 },
    { id: "t2", name: "ひかり5号", speed: 250, delayMinutes: 3 },
  ]);

  const [rails, setRails] = useState<Rail[]>([
    { id: "r1", type: "fast", isPlaced: false },
    { id: "r2", type: "normal", isPlaced: true },
  ]);

  // 表示は次のレッスンから作っていくので、ここでは件数だけ出しています
  return (
    <div>
      <p>電車: {trains.length}件 / レール: {rails.length}件</p>
    </div>
  );
}

export default function App() {
  return <DispatchPanel />;
}
```

**ポイント**

- **型を先に決めてから `useState` を書く**。`useState<Train[]>([])` の `<>` に何を入れるかで迷わなくなります。
- **`trains` と `rails` を1つのstateにまとめていない**。「電車の運行状況」と「レールの配置状況」は別々の関心事なので、独立した `useState` に分けます。片方だけ更新したいときに、もう片方を書き写す必要がなくなります。
- `setTrains` / `setRails` はこの時点では使いませんが、次のレッスンで使うのでそのまま置いておいて大丈夫です。
