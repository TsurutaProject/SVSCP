// ライト/ダークの選択を覚えておく仕組み。
//
// 保存先は localStorage ではなく Cookie。理由は「ちらつき」を出さないため。
// このアプリはページをサーバー側で描画しているので、選択結果がサーバーに
// 届いていないと、最初の1枚はOSの設定で描かれ、そのあとJSが動いて
// 切り替わる(一瞬だけ違うテーマが見える)。Cookieならリクエストと一緒に
// 送られるので、最初から正しいテーマの状態でHTMLを返せる。
//
// httpOnly は付けない。トグルを押した瞬間に、サーバーへの往復を待たずに
// 画面を切り替えたいので、ブラウザ側からも書き込める必要があるため。
// 中身は見た目の好みだけで、秘密の情報は入らない。

export const THEME_COOKIE = "svscp-theme";

/** 1年。これより長くしても、ブラウザ側で切り詰められることが多い */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * "system" は「OSの設定に従う」。既定はこれで、このときは <html> に
 * data-theme を付けない(globals.css の color-scheme: light dark に任せる)。
 */
export type Theme = "system" | "light" | "dark";

export const THEMES: { value: Theme; label: string; hint: string }[] = [
  { value: "system", label: "自動", hint: "OSの設定に合わせる" },
  { value: "light", label: "ライト", hint: "常に明るい配色にする" },
  { value: "dark", label: "ダーク", hint: "常に暗い配色にする" },
];

/** Cookieの値を Theme に直す。壊れた値や未設定は "system" 扱い */
export function parseTheme(value: string | undefined): Theme {
  return value === "light" || value === "dark" ? value : "system";
}

/** <html data-theme> に入れる値。"system" のときは属性ごと付けない */
export function themeAttribute(theme: Theme): "light" | "dark" | undefined {
  return theme === "system" ? undefined : theme;
}
