// プレビュー用エントリ。実際の配列を渡して一覧表示を確認できるようにする。
import { createRoot } from "react-dom/client";
import { StudentList } from "./solution";

const students = [
  { id: "s1", name: "のりまき" },
  { id: "s2", name: "しばまき" },
];

const el = document.getElementById("root");
if (el) {
  createRoot(el).render(<StudentList students={students} />);
}
