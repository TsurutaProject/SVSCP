// Sandpackのテストランナー(parcel/testsモード)では react-dom 本体(DOM版)を
// importするとテストが実行されないまま固まるため、描画の検証は
// react-dom/server の renderToStaticMarkup で行う。
import { renderToStaticMarkup } from "react-dom/server";
import { SelfIntroduction } from "./solution";

describe("SelfIntroduction", () => {
  test("コンポーネント(関数)としてexportされている", () => {
    expect(typeof SelfIntroduction).toBe("function");
  });

  test("pタグを返している", () => {
    const html = renderToStaticMarkup(<SelfIntroduction />);
    expect(html).toContain("<p>");
  });

  test("pタグの中に文章が書かれている", () => {
    const html = renderToStaticMarkup(<SelfIntroduction />);
    const text = html.replace(/<[^>]*>/g, "").trim();
    expect(text.length).toBeGreaterThan(0);
  });
});
