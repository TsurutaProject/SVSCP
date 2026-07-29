import { reservationWithNote, reservationWithoutNote } from "./solution";

describe("Reservation interface", () => {
  test("noteありの予約は正しい形とnoteを持つ", () => {
    expect(typeof reservationWithNote.name).toBe("string");
    expect(typeof reservationWithNote.seats).toBe("number");
    expect(typeof reservationWithNote.note).toBe("string");
  });

  test("noteなしの予約は正しい形でnoteを持たない", () => {
    expect(typeof reservationWithoutNote.name).toBe("string");
    expect(typeof reservationWithoutNote.seats).toBe("number");
    expect(reservationWithoutNote.note).toBeUndefined();
  });
});
