// プレビュー用エントリ。3つのコード例をまとめて表示する。
// コード例3の依存配列を直し忘れていると、ここで無限ループになり
// プレビューが固まる(=バグが体感できる)点も含めて学習材料になる。
import { createRoot } from "react-dom/client";
import { SaveButton, TodoList, SearchBox } from "./solution";

const todos = [
  { id: "t1", text: "牛乳を買う" },
  { id: "t2", text: "掃除する" },
];

const el = document.getElementById("root");
if (el) {
  createRoot(el).render(
    <div>
      <SaveButton />
      <TodoList todos={todos} />
      <SearchBox />
    </div>,
  );
}
