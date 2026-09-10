// 総合演習:電車の速度表示パネル & ケーキの注文キュー
// 教材のステップA-1〜A-4、B-1〜B-5を、この1ファイルの中で順番に実装してみてください。
//
// 1ステップ書くごとに「実行する」を押して、動くことを確かめてから次に進むのがおすすめです。
// 教材の各ステップにあるレッスンへのリンクは、新しいタブで開きます
// (ここに書いたコードは消えません)。
//
// 練習用のエディタなので採点はされません。
// このファイルの default export が右側に表示されます。

interface Rail {
  id: string;
  type: "fast" | "normal";
}

const rails: Rail[] = [
  { id: "r1", type: "fast" },
  { id: "r2", type: "normal" },
  { id: "r3", type: "fast" },
  { id: "r4", type: "normal" },
];

interface Order {
  id: string;
  customerName: string;
  cakeKind: "shortcake" | "chocolate";
  isCompleted: boolean;
}

const initialOrders: Order[] = [
  { id: "o1", customerName: "のりまき", cakeKind: "shortcake", isCompleted: false },
  { id: "o2", customerName: "たまご", cakeKind: "chocolate", isCompleted: false },
  { id: "o3", customerName: "きゅうり", cakeKind: "shortcake", isCompleted: false },
];

// Part A:ここに RailPanel を書いてみましょう

// Part B:ここに OrderQueue を書いてみましょう

export default function App() {
  return (
    <div>
      <h1>総合演習</h1>
      <p>ここに Part A・Part B のコンポーネントを書いて、呼び出してみましょう</p>
    </div>
  );
}
