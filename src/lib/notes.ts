// メモ1件の文字数上限。
//
// Server Action("use server"のファイル)は非同期関数しかexportできないため、
// 画面側(textareaのmaxLength)とサーバー側の検証で同じ値を使えるよう、
// 定数はこちらに置いている。
export const MAX_NOTE_LENGTH = 2000;
