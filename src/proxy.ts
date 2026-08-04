import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { USER_ID_HEADER } from "@/lib/supabase/currentUser";

export async function proxy(request: NextRequest) {
  // getUser() の途中でトークンが更新されると setAll が呼ばれる。
  // レスポンスは検証結果(ユーザーID)が分かってから組み立てたいので、
  // ここでは書き込むCookieを溜めておくだけにする。
  const cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(list) {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.push(...list);
        },
      },
    },
  );

  // セッションのリフレッシュ(Server Component側はcookieの書き込みができないため必須)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 検証済みのユーザーIDをページへ渡す。ページ側で getUser() を呼び直さずに済み、
  // Supabaseへのネットワーク往復が1リクエストあたり2回から1回に減る。
  //
  // 外部から x-authenticated-user-id を付けて送られても、ここで必ず
  // delete → (ログイン時のみ) set しているため、偽装した値は残らない。
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete(USER_ID_HEADER);
  if (user) {
    requestHeaders.set(USER_ID_HEADER, user.id);
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
