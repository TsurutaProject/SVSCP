// プレビュー用エントリ。Propsを実際に渡して描画し、見た目を確認できるようにする。
import { createRoot } from "react-dom/client";
import { ProfileCard } from "./solution";

const el = document.getElementById("root");
if (el) {
  createRoot(el).render(
    <div>
      <ProfileCard name="のりまき" hobby="ゲーム" />
      <ProfileCard name="しばまき" hobby="料理" />
    </div>,
  );
}
