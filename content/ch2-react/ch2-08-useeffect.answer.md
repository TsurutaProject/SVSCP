アンマウント側も確かめられるように、表示・非表示を切り替えるボタンを付けています。

```tsx
import { useEffect, useState } from "react";

function LifecycleLogger() {
  useEffect(() => {
    console.log("マウントされました");

    return () => {
      console.log("アンマウントされました");
    };
  }, []);

  return <p>このコンポーネントは表示されています</p>;
}

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div>
      <button onClick={() => setIsVisible((prev) => !prev)}>表示を切り替える</button>
      {isVisible && <LifecycleLogger />}
    </div>
  );
}
```

**ポイント**

- **依存配列 `[]` が「最初の1回だけ」の指定**です。書き忘れると**描画のたびに毎回**実行され、`[count]` のように値を入れるとその値が変わるたびに実行されます。3つの違いは意識して使い分けてください。
- **`return` した関数がクリーンアップ関数**です。コンポーネントが画面から消えるときにReactが呼んでくれます。タイマーの停止やイベントリスナーの解除など、「後片付け」を書く場所です。
- **開発中は「マウントされました」が2回出ることがあります**。React が開発時だけ、意図的にマウント→アンマウント→再マウントを行って、後片付け漏れを見つけやすくしているためです。バグではありません。
- ログはエディタの下のコンソールに出ます。切り替えボタンを押して、アンマウント側のログも確かめてみてください。
