// handleInputChange という関数を作ってください。
// ChangeEvent<HTMLInputElement> 型のイベントを受け取り、event.target.value を
// console.log で出力します。import type { ChangeEvent } from "react" を使うこと。
//
// 練習用のエディタなので採点はされません。
// ログはエディタの下のコンソールに出ます。

export default function App() {
  return (
    <div>
      <p>ここに handleInputChange を書いて、input の onChange に渡してみましょう</p>
      <input placeholder="入力してみてください" />
    </div>
  );
}
