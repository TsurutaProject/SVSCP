import { getPlatformNumber } from "./solution";

describe("getPlatformNumber", () => {
  test("platformがある場合は番号を返す", () => {
    expect(getPlatformNumber({ name: "東京", platform: { number: 3 } })).toBe(3);
  });

  test("platformがない場合は未定を返す", () => {
    expect(getPlatformNumber({ name: "新宿" })).toBe("未定");
  });
});
