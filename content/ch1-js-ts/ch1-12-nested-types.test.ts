import { team } from "./solution";

describe("Team / Player interface", () => {
  test("teamNameがstring型", () => {
    expect(typeof team.teamName).toBe("string");
  });

  test("membersが2人のPlayerを含む配列", () => {
    expect(Array.isArray(team.members)).toBe(true);
    expect(team.members.length).toBe(2);
  });

  test("各memberが正しい形を持つ", () => {
    for (const member of team.members) {
      expect(typeof member.name).toBe("string");
      expect(Array.isArray(member.items)).toBe(true);
      for (const item of member.items) {
        expect(typeof item).toBe("string");
      }
    }
  });
});
