// プレビュー用エントリ。生徒が書いたコンポーネントを実際に描画して見た目を確認できるようにする。
// (テストランナーと違い、プレビューは通常のブラウザ描画なので react-dom を使ってよい)
import { createRoot } from "react-dom/client";
import { SelfIntroduction } from "./solution";

const el = document.getElementById("root");
if (el) {
  createRoot(el).render(<SelfIntroduction />);
}
