import { formatDelayMessage } from "./solution";

describe("formatDelayMessage", () => {
  test("遅延ありの場合", () => {
    expect(formatDelayMessage("東京", 5)).toBe("東京駅で5分遅延しています");
  });

  test("遅延なしの場合", () => {
    expect(formatDelayMessage("東京", 0)).toBe("東京駅は定刻通りです");
  });

  test("駅名が変わっても正しく埋め込まれる", () => {
    expect(formatDelayMessage("新宿", 10)).toBe("新宿駅で10分遅延しています");
  });
});
