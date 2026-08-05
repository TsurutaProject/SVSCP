```tsx
interface CounterProps {
  count: number;
}

function Counter({ count }: CounterProps) {
  const handleIncrement = () => {
    console.log("+1が押されました");
  };

  const handleReset = () => {
    console.log("リセットが押されました");
  };

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={handleIncrement}>+1</button>
      <button onClick={handleReset}>リセット</button>
    </div>
  );
}

export default function App() {
  return <Counter count={5} />;
}
```

**ポイント**

- **`onClick` には関数“そのもの”を渡します**。`onClick={handleIncrement}` と書くのが正解で、`onClick={handleIncrement()}` と書くと**描画された瞬間に実行され**、その戻り値(`undefined`)がハンドラとして登録されてしまいます。実際に書き換えて、コンソールの出方の違いを見てみてください。
- 引数を渡したいときだけ `onClick={() => handleSomething(id)}` のようにアロー関数で包みます。この形なら、包んだ関数が呼ばれるのはクリック時です。
- **ログはブラウザの開発者ツールのコンソールに出ます**(プレビュー画面には出ません)。
- `count` はPropsなので、この時点ではボタンを押しても表示は変わりません。「値を変えて画面を更新する」のは次のレッスンの `useState` の仕事です。
