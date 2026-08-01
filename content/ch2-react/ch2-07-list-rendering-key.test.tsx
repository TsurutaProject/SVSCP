// Sandpackのテストランナーでは react-dom 本体(DOM版)が使えないため、
// 描画結果は react-dom/server の renderToStaticMarkup で検証する。
//
// なお key は描画後のHTMLには出力されないため、key の検証だけは
// コンポーネントを直接呼び出して、返ってきたReact要素ツリーを辿って調べている。
import { isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StudentList } from "./solution";

const students = [
  { id: "s1", name: "のりまき" },
  { id: "s2", name: "しばまき" },
];

// 要素ツリーを再帰的に辿って <li> 要素だけを集める
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

describe("StudentList", () => {
  test("全員の名前が表示される", () => {
    const text = renderToStaticMarkup(<StudentList students={students} />).replace(/<[^>]*>/g, "");
    expect(text).toContain("のりまき");
    expect(text).toContain("しばまき");
  });

  test("liタグで一覧表示している", () => {
    const html = renderToStaticMarkup(<StudentList students={students} />);
    expect(html).toContain("<li>");
  });

  test("人数分のliが作られる(.map()で回している)", () => {
    const found: ReactElement[] = [];
    collectListItems(StudentList({ students }), found);
    expect(found.length).toBe(students.length);
  });

  test("keyにインデックス番号ではなくidが使われている", () => {
    const found: ReactElement[] = [];
    collectListItems(StudentList({ students }), found);

    expect(found.map((item) => item.key)).toEqual(["s1", "s2"]);
  });
});
