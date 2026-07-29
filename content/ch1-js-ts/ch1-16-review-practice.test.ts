import { completeOrder, getCakePrice, getCakeLabel } from "./solution";

describe("コード例1: completeOrder", () => {
  test("元のオブジェクトを直接書き換えていない", () => {
    const order = { customerName: "のりまき", isCompleted: false };
    completeOrder(order);

    expect(order.isCompleted).toBe(false);
  });

  test("isCompletedをtrueにした新しいオブジェクトを返す", () => {
    const order = { customerName: "のりまき", isCompleted: false };
    const result = completeOrder(order);

    expect(result.isCompleted).toBe(true);
    expect(result).not.toBe(order);
  });
});

describe("コード例2: getCakePrice", () => {
  test("cakeのpriceを返す", () => {
    expect(getCakePrice({ price: 500 })).toBe(500);
  });
});

describe("コード例3: getCakeLabel", () => {
  test("shortcakeの場合", () => {
    expect(getCakeLabel("shortcake")).toBe("ショートケーキ");
  });

  test("chocolateの場合(元のコードは分岐漏れでundefinedになっていた)", () => {
    expect(getCakeLabel("chocolate")).toBe("チョコケーキ");
  });
});
