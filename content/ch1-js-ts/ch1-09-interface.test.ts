import { station } from "./solution";

describe("Station interface", () => {
  test("nameがstring型", () => {
    expect(typeof station.name).toBe("string");
  });

  test("lineがstring型", () => {
    expect(typeof station.line).toBe("string");
  });

  test("isTerminalがboolean型", () => {
    expect(typeof station.isTerminal).toBe("boolean");
  });
});
