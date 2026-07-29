import { getWeatherMessage } from "./solution";

describe("getWeatherMessage", () => {
  test("sunnyの場合は指定のメッセージを返す", () => {
    expect(getWeatherMessage("sunny")).toBe("晴れです、傘は不要です");
  });

  test("cloudyの場合も文字列を返す", () => {
    expect(typeof getWeatherMessage("cloudy")).toBe("string");
    expect(getWeatherMessage("cloudy").length).toBeGreaterThan(0);
  });

  test("rainyの場合も文字列を返す", () => {
    expect(typeof getWeatherMessage("rainy")).toBe("string");
    expect(getWeatherMessage("rainy").length).toBeGreaterThan(0);
  });

  test("3種類のメッセージがそれぞれ異なる", () => {
    const sunny = getWeatherMessage("sunny");
    const cloudy = getWeatherMessage("cloudy");
    const rainy = getWeatherMessage("rainy");

    expect(new Set([sunny, cloudy, rainy]).size).toBe(3);
  });
});
