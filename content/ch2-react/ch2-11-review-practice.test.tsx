// Sandpackのテストランナーでは react-dom 本体(DOM版)が使えないため、
// 描画結果は react-dom/server の renderToStaticMarkup で検証する。
//
// コード例1(イベントハンドラ)とコード例2(key)は、描画後のHTMLには現れないため、
// コンポーネントを直接呼び出して、返ってきたReact要素ツリーを調べて検証している。
//
// コード例3(useEffectの依存配列)は、依存配列の有無が描画結果に一切現れないため
// 自動判定できない。ここではコンポーネントを壊していないことだけを確認している。
import { isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SaveButton, TodoList, SearchBox } from "./solution";

function collectListItems(node: ReactNode, found: ReactElement[]): void {
  if (Array.isArray(node)) {
    for (const child of node) collectListItems(child, found);
    return;
  }
  if (!isValidElement(node)) return;

  if (node.type === "li") found.push(node);

  const { children } = node.props as { children?: ReactNode };
  if (children !== undefined) collectListItems(children, found);
}

describe("コード例1: SaveButton", () => {
  test("onClickに関数そのものが渡されている(呼び出した結果ではない)", () => {
    const element = SaveButton() as ReactElement;
    const { onClick } = element.props as { onClick?: unknown };

    expect(typeof onClick).toBe("function");
  });

  test("ボタンとして描画される", () => {
    expect(renderToStaticMarkup(<SaveButton />)).toContain("<button");
  });
});

describe("コード例2: TodoList", () => {
  const todos = [
    { id: "t1", text: "牛乳を買う" },
    { id: "t2", text: "掃除する" },
  ];

  test("keyにインデックス番号ではなくidが使われている", () => {
    const found: ReactElement[] = [];
    collectListItems(TodoList({ todos }), found);

    expect(found.map((item) => item.key)).toEqual(["t1", "t2"]);
  });

  test("すべてのtodoが表示される", () => {
    const text = renderToStaticMarkup(<TodoList todos={todos} />).replace(/<[^>]*>/g, "");
    expect(text).toContain("牛乳を買う");
    expect(text).toContain("掃除する");
  });
});

describe("コード例3: SearchBox", () => {
  test("入力欄と件数表示が壊れていない", () => {
    const html = renderToStaticMarkup(<SearchBox />);
    expect(html).toContain("<input");
    expect(html.replace(/<[^>]*>/g, "")).toContain("件見つかりました");
  });
});
