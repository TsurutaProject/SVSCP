// 上の useEffect を、コピペせずに自分の手で入力してみましょう。
// 書けたら依存配列を [] に変えて、呼ばれる回数が変わることを確かめてください。
//
// ログはエディタの下のコンソールに出ます。
// ここは採点されません。何度でも書き換えて試せます。
import { useEffect, useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  // ここに useEffect を書いてみましょう

  return <button onClick={() => setCount((prev) => prev + 1)}>count: {count}</button>;
}
