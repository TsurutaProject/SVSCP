// 上の toggle を、コピペせずに自分の手で入力してみましょう。
// setItems((previous) => ...) の形で書くのがポイントです。
//
// ここは採点されません。何度でも書き換えて試せます。
import { useState } from "react";

export default function App() {
  const [items, setItems] = useState([
    { id: "a", isOn: false },
    { id: "b", isOn: false },
  ]);

  return <div>ここに書いてみましょう</div>;
}
