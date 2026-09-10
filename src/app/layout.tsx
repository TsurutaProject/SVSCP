import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { parseTheme, themeAttribute, THEME_COOKIE } from "@/lib/theme";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";
import styles from "./layout.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "算数ゲーム開発チーム 学習プラットフォーム",
  description: "教材の進捗・週次ゴール・詰まりポイントをチームで共有する学習プラットフォーム",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 配色の選択はCookieに入っている。ここで読んで <html> に載せることで、
  // 最初に返すHTMLの時点で正しいテーマになる(JSで後から直すと一瞬ちらつく)。
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-theme={themeAttribute(theme)}
    >
      <body>
        {/* 教材ページ・演習ページでも切り替えられるよう、個別のページではなく
            レイアウト側に置いている */}
        <div className={styles.topBar}>
          <ThemeToggle current={theme} />
        </div>
        {children}
      </body>
    </html>
  );
}
