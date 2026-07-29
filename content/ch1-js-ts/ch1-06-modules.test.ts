import { calculateFare } from "./solution";

describe("calculateFare", () => {
  test("運賃は0より大きい数値", () => {
    expect(calculateFare(10)).toBeGreaterThan(0);
  });

  test("距離が長いほど運賃が高くなる", () => {
    const short = calculateFare(10);
    const long = calculateFare(50);

    expect(long).toBeGreaterThan(short);
  });
});
