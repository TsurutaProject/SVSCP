// Sandpackのテストランナーでは react-dom 本体(DOM版)が使えないため、
// 描画結果は react-dom/server の renderToStaticMarkup で検証する。
import { renderToStaticMarkup } from "react-dom/server";
import { ScoreMessage } from "./solution";

const textOf = (score: number): string =>
  renderToStaticMarkup(<ScoreMessage score={score} />).replace(/<[^>]*>/g, "");

describe("ScoreMessage", () => {
  test("100点なら満点のメッセージを表示する", () => {
    expect(textOf(100)).toContain("満点です!");
  });

  test("100より大きくても満点のメッセージを表示する", () => {
    expect(textOf(120)).toContain("満点です!");
  });

  test("100未満なら点数を含むメッセージを表示する", () => {
    const text = textOf(80);
    expect(text).toContain("80点でした");
    expect(text).not.toContain("満点です!");
  });

  test("0点のときは追加で「頑張りましょう」も表示する", () => {
    const text = textOf(0);
    expect(text).toContain("0点でした");
    expect(text).toContain("頑張りましょう");
  });

  test("0点以外では「頑張りましょう」を表示しない", () => {
    expect(textOf(80)).not.toContain("頑張りましょう");
    expect(textOf(100)).not.toContain("頑張りましょう");
  });

  test("pタグで表示している", () => {
    expect(renderToStaticMarkup(<ScoreMessage score={100} />)).toContain("<p>");
  });
});
