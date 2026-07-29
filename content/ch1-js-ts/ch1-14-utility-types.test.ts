import { stock, discounts } from "./solution";

describe("Record / Partial", () => {
  test("stockはshortcake/chocolate両方のキーをnumberで持つ", () => {
    expect(typeof stock.shortcake).toBe("number");
    expect(typeof stock.chocolate).toBe("number");
  });

  test("discountsは存在するキーがすべてnumber", () => {
    expect(typeof discounts).toBe("object");
    for (const value of Object.values(discounts)) {
      expect(typeof value).toBe("number");
    }
  });
});
