```tsx
import { useRef } from "react";

function FocusInput() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="ここに入力" />
      <button onClick={handleFocus}>入力欄にフォーカス</button>
    </div>
  );
}

export default function App() {
  return <FocusInput />;
}
```

**ポイント**

- **`ref={inputRef}` で要素と結び付けるのを忘れずに**。これを書かないと `inputRef.current` は `null` のままで、ボタンを押しても何も起きません(エラーにもならないので気づきにくいところです)。
- **実際のDOM要素は `.current` に入ります**。`inputRef.focus()` ではなく `inputRef.current.focus()` です。
- **`?.` を使う理由**は、`current` の型が `HTMLInputElement | null` だからです。初回の描画が終わるまでは `null` なので、TypeScriptが「null かもしれない」と警告します。`?.` なら null のときは何もせず素通りします。
- **型引数は「結び付ける要素の型」**。`<input>` なら `HTMLInputElement`、`<div>` なら `HTMLDivElement` です。
- `useRef` は**値が変わっても再描画を起こしません**。画面に出す値は `useState`、DOMそのものを触りたいときは `useRef`、と使い分けます。
