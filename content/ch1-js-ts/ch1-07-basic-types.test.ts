import { price, itemName, inStock } from "./solution";

describe("基本の型注釈", () => {
  test("priceがnumber型の値を持つ", () => {
    expect(typeof price).toBe("number");
  });

  test("itemNameがstring型の値を持つ", () => {
    expect(typeof itemName).toBe("string");
    expect((itemName as string).length).toBeGreaterThan(0);
  });

  test("inStockがboolean型の値を持つ", () => {
    expect(typeof inStock).toBe("boolean");
  });
});
