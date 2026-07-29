// Reservationというinterfaceを定義してください。name(文字列、必須)、
// seats(数値、必須)、note(文字列、オプション、?を使う)の3つのプロパティを
// 持つ形にしてください。その後、noteありのオブジェクトと、noteなしの
// オブジェクトを、それぞれ1つずつ作成してexportしてください(値は自由でOK)。
//
// クリア条件:
// - noteだけが?つきでoptionalになっていること
// - noteありのオブジェクトと、なしのオブジェクトの両方が作成されていること

interface Reservation {
  name: string;
  seats: number;
  note?: string;
}

export const reservationWithNote: Reservation = undefined as unknown as Reservation; // TODO: noteを含むReservationに置き換えてください
export const reservationWithoutNote: Reservation = undefined as unknown as Reservation; // TODO: noteを含まないReservationに置き換えてください
