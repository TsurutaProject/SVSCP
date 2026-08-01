// プレビュー用エントリ。3パターン(満点・通常・0点)を並べて表示し、
// 条件分岐が意図通り効いているか目で確認できるようにする。
import { createRoot } from "react-dom/client";
import { ScoreMessage } from "./solution";

const el = document.getElementById("root");
if (el) {
  createRoot(el).render(
    <div>
      <div>score = 100: <ScoreMessage score={100} /></div>
      <div>score = 80: <ScoreMessage score={80} /></div>
      <div>score = 0: <ScoreMessage score={0} /></div>
    </div>,
  );
}
