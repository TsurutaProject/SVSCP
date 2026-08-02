// 教材の問題:useState<???>(null) の <> には何が入るべきか、を考える演習です。
// (本来は「考えて答えを出すだけ」でOKですが、ここでは実際に書いて動かして確かめられます)
//
// selectedTopping は「選択中のトッピングの種類、まだ何も選んでなければ null」を管理したい。
// 下の useState の <> を埋めて、setSelectedTopping("いちご") が通り、
// null も入れられることを確かめてみてください。
import { useState } from "react";

type ToppingKind = "いちご" | "生クリーム" | "バナナ";

export default function App() {
  // TODO: <> の中を埋めてみましょう
  const [selectedTopping, setSelectedTopping] = useState<ToppingKind | null>(null);

  return (
    <div>
      <p>選択中: {selectedTopping ?? "まだ選んでいません"}</p>
      <button onClick={() => setSelectedTopping("いちご")}>いちごを選ぶ</button>
      <button onClick={() => setSelectedTopping(null)}>選択を解除</button>
    </div>
  );
}
