import { getFastCarNames } from "./solution";

const cars = [
  { name: "新幹線", speed: 300 },
  { name: "特急", speed: 130 },
  { name: "普通", speed: 80 },
];

describe("getFastCarNames", () => {
  test("速度100以上の車両の名前だけを返す", () => {
    expect(getFastCarNames(cars)).toEqual(["新幹線", "特急"]);
  });

  test("該当なしの場合は空配列を返す", () => {
    expect(getFastCarNames([{ name: "普通", speed: 80 }])).toEqual([]);
  });
});
