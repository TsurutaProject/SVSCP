Part A・Part Bを1ファイルにまとめた例です。長いので、まずは自分の書いたものと見比べたい方だけ読んでください。

3つのブロックに分けていますが、**中身は1つのファイル**です。`import` はファイルの先頭に1回だけ書くので、Part Aのブロックにまとめてあります。

**Part A:電車の速度表示パネル**

```tsx
// import はファイルの先頭に1回だけ(Part B で使うものもここにまとめている)
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

interface Rail {
  id: string;
  type: "fast" | "normal";
}

interface RailPanelProps {
  rails: Rail[];
}

function RailPanel({ rails }: RailPanelProps) {
  const [showSpeed, setShowSpeed] = useState(false);
  const [filter, setFilter] = useState<"all" | "fast" | "normal">("all");

  const fastCount = rails.filter((rail) => rail.type === "fast").length;
  const visibleRails = filter === "all" ? rails : rails.filter((rail) => rail.type === filter);

  const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value as "all" | "fast" | "normal");
  };

  return (
    <div>
      <button onClick={() => setShowSpeed((prev) => !prev)}>速度表示を切り替える</button>
      {showSpeed && <p>高速レール数:{fastCount}本</p>}

      <select value={filter} onChange={handleFilterChange}>
        <option value="all">すべて</option>
        <option value="fast">高速</option>
        <option value="normal">通常</option>
      </select>

      <ul>
        {visibleRails.map((rail) => (
          <li key={rail.id} style={{ color: rail.type === "fast" ? "#ef6c00" : "#333" }}>
            {rail.id}
            {rail.type === "fast" ? " ⚡" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Part B:ケーキの注文キュー**

```tsx
interface Order {
  id: string;
  customerName: string;
  cakeKind: "shortcake" | "chocolate";
  isCompleted: boolean;
}

interface OrderQueueProps {
  orders: Order[];
  onComplete: (orderId: string) => void;
}

function OrderQueue({ orders, onComplete }: OrderQueueProps) {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [orders.length]);

  const handleComplete = (orderId: string) => {
    setHighlightedId(orderId);
    onComplete(orderId);
  };

  return (
    <div style={{ maxHeight: 160, overflowY: "auto" }}>
      {orders.length === 0 ? (
        <p>注文はありません</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li
              key={order.id}
              style={{ background: order.id === highlightedId ? "#fff3e0" : "transparent" }}
            >
              {order.customerName}:{order.cakeKind}
              <button onClick={() => handleComplete(order.id)}>完了</button>
            </li>
          ))}
        </ul>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
```

**呼び出し側**

```tsx
export default function App() {
  const [orders, setOrders] = useState<Order[]>([
    { id: "o1", customerName: "のりまき", cakeKind: "shortcake", isCompleted: false },
  ]);

  const handleComplete = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, isCompleted: true } : order)),
    );
  };

  const addOrder = () => {
    setOrders((prev) => [
      ...prev,
      {
        id: `o${prev.length + 1}`,
        customerName: `お客さん${prev.length + 1}`,
        cakeKind: "chocolate",
        isCompleted: false,
      },
    ]);
  };

  return (
    <div>
      <RailPanel
        rails={[
          { id: "r1", type: "fast" },
          { id: "r2", type: "normal" },
          { id: "r3", type: "fast" },
        ]}
      />
      <hr />
      <button onClick={addOrder}>注文を追加</button>
      <OrderQueue orders={orders} onComplete={handleComplete} />
    </div>
  );
}
```

**ポイント**

- **`&&` と三項演算子の使い分け**。「出すか出さないか」だけなら `&&`(速度表示)、「Aを出すか、Bを出すか」なら三項演算子(空のときのメッセージ)です。
- **`.filter()` の結果に `.length` を繋ぐ**のが、「条件に合うものが何個あるか」の定番の書き方です(1章の `.filter()` がそのまま効いてきます)。
- **`<select>` の `onChange` では `event.target.value` が `string` 型**になります。union typeの状態に入れるには `as` での絞り込みが要ります。より丁寧にやるなら、値が3つのどれかであることを確かめる関数を挟みます。
- **配列の更新は必ず新しい配列を作ります**。`.map()` で「該当するものだけ差し替えた新しい配列」を返すのが基本形です。既存の要素を書き換えるとReactが変化に気づけません。
- **`useEffect` の依存配列を `[orders.length]` にしている**のがポイント。`[orders]` にすると、件数が変わっていなくても配列が作り直されるたびにスクロールが走ってしまいます。
- **`scrollIntoView` は本物のDOMのメソッド**なので、`useRef` で要素そのものを掴む必要があります。ここが `useState` では代用できない場面です。
