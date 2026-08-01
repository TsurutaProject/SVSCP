// Sandpackのテストランナーでは react-dom 本体(DOM版)が使えないため、
// 描画結果は react-dom/server の renderToStaticMarkup で検証する。
import { renderToStaticMarkup } from "react-dom/server";
import { ProfileCard } from "./solution";

describe("ProfileCard", () => {
  test("pタグを返している", () => {
    const html = renderToStaticMarkup(<ProfileCard name="のりまき" hobby="ゲーム" />);
    expect(html).toContain("<p>");
  });

  test("nameとhobbyを組み合わせて表示する", () => {
    const html = renderToStaticMarkup(<ProfileCard name="のりまき" hobby="ゲーム" />);
    const text = html.replace(/<[^>]*>/g, "");
    expect(text).toContain("のりまき");
    expect(text).toContain("ゲーム");
  });

  test("別のPropsを渡すと表示も変わる(値がハードコードされていない)", () => {
    const html = renderToStaticMarkup(<ProfileCard name="しばまき" hobby="料理" />);
    const text = html.replace(/<[^>]*>/g, "");
    expect(text).toContain("しばまき");
    expect(text).toContain("料理");
    expect(text).not.toContain("のりまき");
  });
});
