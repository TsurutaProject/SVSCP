```tsx
import type { ChangeEvent } from "react";

export default function App() {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  };

  return (
    <div>
      <p>入力するたびに、コンソールに値が出ます</p>
      <input placeholder="入力してみてください" onChange={handleInputChange} />
    </div>
  );
}
```

**ポイント**

- **`import type` は型だけを読み込む書き方**です。型はコンパイル後には消えるので、`import type` と書いておくと「これは実行時には不要」と明示でき、バンドルにも含まれません。
- **`ChangeEvent<HTMLInputElement>` の `<>` は「どの要素で起きたイベントか」**。これを指定しているおかげで、`event.target` が `HTMLInputElement` だと分かり、`.value` を安全に読めます。`<select>` なら `ChangeEvent<HTMLSelectElement>` になります。
- **型を書かずに `(event) => ...` と書くと、`event` は暗黙の `any`** になり、`event.target.valu` のようなtypoに気づけません。
- ちなみに `onChange={handleInputChange}` のように**JSXの属性から直接渡す場合は、Reactが型を推論してくれる**ので型注釈を省略できます。今回のように関数を先に定義しておく場合は、推論の手がかりが無いので自分で書く必要があります。
