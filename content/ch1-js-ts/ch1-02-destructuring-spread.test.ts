import { updateScoreTo100 } from "./solution";

describe("updateScoreTo100", () => {
  test("scoreだけを100に上書きした新しいオブジェクトを返す", () => {
    const player = { name: "のりまき", score: 80 };
    const result = updateScoreTo100(player);

    expect(result).toEqual({ name: "のりまき", score: 100 });
  });

  test("元のオブジェクトを直接書き換えていない", () => {
    const player = { name: "のりまき", score: 80 };
    updateScoreTo100(player);

    expect(player).toEqual({ name: "のりまき", score: 80 });
  });

  test("新しいオブジェクトを返している(同一参照ではない)", () => {
    const player = { name: "のりまき", score: 80 };
    const result = updateScoreTo100(player);

    expect(result).not.toBe(player);
  });
});
