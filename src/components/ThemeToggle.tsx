"use client";

import { useEffect, useState } from "react";
import {
  THEMES,
  THEME_COOKIE,
  THEME_COOKIE_MAX_AGE,
  themeAttribute,
  type Theme,
} from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

type ThemeToggleProps = {
  /** サーバーがCookieから読んだ現在の選択。ボタンの選択状態の初期値になる */
  current: Theme;
};

// ライト/ダークの切り替え。3択にしているのは、一度手で選んだあとに
// 「OSの設定に戻す」ができなくなるのを避けるため(2択のトグルだと戻せない)。
export function ThemeToggle({ current }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(current);

  // <html> と Cookie は、Reactの管理外にあるブラウザ側の状態なので、
  // クリックの中で直接書き換えず、選択が変わったあとの同期として書く。
  //
  // 最初の1回は、サーバーが返した値をそのまま書き戻すだけになる
  // (見た目は変わらない。Cookieの期限が延びるだけ)。
  useEffect(() => {
    // globals.css の :root[data-theme="..."] がここを見ている。
    // "system"(=OSに従う)のときは属性ごと外す。
    const attribute = themeAttribute(theme);
    if (attribute) {
      document.documentElement.dataset.theme = attribute;
    } else {
      delete document.documentElement.dataset.theme;
    }

    // 次回以降は、このCookieを読んでサーバーが最初から正しいテーマで返す。
    document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
  }, [theme]);

  return (
    <div className={styles.group} role="group" aria-label="配色の切り替え">
      {THEMES.map((option) => (
        <button
          key={option.value}
          className={styles.option}
          type="button"
          // 押すたびに選択が移るので、ラジオボタンと同じ扱いにする
          aria-pressed={theme === option.value}
          title={option.hint}
          onClick={() => setTheme(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
