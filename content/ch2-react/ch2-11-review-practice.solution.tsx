// 3つのコード例には、それぞれ問題が1つずつ潜んでいます。
// 何が問題かを考えて、修正したコードに書き換えてください。
//
// 注意: コード例3(useEffectの依存配列)は、その性質上この採点機能では
// 自動判定できません(依存配列の有無は描画結果に表れないため)。
// MDXの「解答を見る」と照らし合わせて、自分で確認してください。

import { useEffect, useState } from "react";

// --- コード例1: イベントハンドラの渡し方 ---
export function SaveButton() {
  const handleSave = () => {
    console.log("保存しました");
  };

  // TODO: ボタンを押した時ではなく、描画された瞬間に実行されてしまっている
  return <button onClick={handleSave()}>保存</button>;
}

// --- コード例2: リストのkey ---
export interface Todo {
  id: string;
  text: string;
}

export function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        // TODO: keyに使うべきものが他にあるはず
        <li key={index}>{todo.text}</li>
      ))}
    </ul>
  );
}

// --- コード例3: useEffectの依存配列 ---
export function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  // TODO: このままだと無限ループに陥る危険がある
  useEffect(() => {
    const filtered = ["りんご", "バナナ", "みかん"].filter((item) => item.includes(query));
    setResults(filtered);
  });

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <p>{results.length}件見つかりました</p>
    </div>
  );
}
