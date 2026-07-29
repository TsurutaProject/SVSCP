import { calculateTotal } from "./solution";

describe("calculateTotal", () => {
  test("デフォルトのtaxRate(0.1)で計算する", () => {
    expect(calculateTotal(100, 2)).toBe(220);
  });

  test("taxRateを明示的に指定しても計算できる", () => {
    expect(calculateTotal(100, 2, 0.1)).toBe(220);
  });

  test("別のtaxRateでも正しく計算する", () => {
    expect(calculateTotal(1000, 1, 0.2)).toBe(1200);
  });
});
