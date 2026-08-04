import { headers } from "next/headers";

// proxy.ts が検証済みのユーザーIDを、このヘッダーに載せてページへ渡す。
//
// ページ側でも supabase.auth.getUser() を呼ぶと、Supabaseの認証サーバーへの
// ネットワーク往復が1リクエストにつき2回発生する(proxyで1回、ページで1回)。
// getUser() はCookieを読むだけでなく毎回トークンを検証しに行くため、
// 実測で1往復あたり数十〜200ms程度かかり、ページ遷移の体感に直結していた。
// proxyが必ず先に走って検証しているので、その結果をヘッダーで受け渡して
// ページ側の往復をなくしている。
export const USER_ID_HEADER = "x-authenticated-user-id";

/**
 * proxyが検証したユーザーIDを返す。未ログインなら null。
 *
 * ヘッダーはproxy側で必ず上書き(未ログイン時は削除)しているため、
 * 外部から偽装した値がそのまま入ってくることはない。
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  const requestHeaders = await headers();
  return requestHeaders.get(USER_ID_HEADER);
}
