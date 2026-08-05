```tsx
import { useState } from "react";

function LikeButton() {
  const [likeCount, setLikeCount] = useState(0);

  const handleLike = () => {
    setLikeCount((prev) => prev + 1);
  };

  return (
    <div>
      <p>いいね: {likeCount}</p>
      <button onClick={handleLike}>いいね</button>
    </div>
  );
}

export default function App() {
  return <LikeButton />;
}
```

**ポイント**

- **`useState` は `[今の値, 更新する関数]` の2つを返します**。分割代入で受け取るのが決まった書き方です。
- **`setLikeCount((prev) => prev + 1)` の `prev` は「更新直前の最新の値」**。Reactが渡してくれます。
- **なぜ `setLikeCount(likeCount + 1)` ではなく関数を渡すのか**。`likeCount` はその回の描画時点の値で固定されているため、1回のイベントの中で2回続けて呼ぶと、どちらも同じ古い値を足してしまい、2増えるはずが1しか増えません。関数を渡す形なら毎回最新の値から計算されるので、この落とし穴を避けられます。
- 初期値が `0` なので `useState<number>(0)` の `<number>` は省略できます。初期値から型が推論できるためです。
- **状態を直接書き換えてはいけません**(`likeCount++` のような書き方)。Reactは更新関数が呼ばれたことで再描画のきっかけを知るので、値だけ変えても画面は変わりません。
