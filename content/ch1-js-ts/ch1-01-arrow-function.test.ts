import { formatPrice } from "./solution";

describe("formatPrice", () => {
  test("500を渡すと\"500円\"を返す", () => {
    expect(formatPrice(500)).toBe("500円");
  });

  test("0を渡すと\"0円\"を返す", () => {
    expect(formatPrice(0)).toBe("0円");
  });

  test("1200を渡すと\"1200円\"を返す", () => {
    expect(formatPrice(1200)).toBe("1200円");
  });
});
