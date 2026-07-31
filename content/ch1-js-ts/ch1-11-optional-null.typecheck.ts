// 実行時の値だけでなく、宣言した型そのものが正しいかを検証する。
import { reservationWithNote, reservationWithoutNote } from "./solution";

const _name1: string = reservationWithNote.name;
const _seats1: number = reservationWithNote.seats;
const _note1: string = reservationWithNote.note as string;

const _name2: string = reservationWithoutNote.name;
const _seats2: number = reservationWithoutNote.seats;
