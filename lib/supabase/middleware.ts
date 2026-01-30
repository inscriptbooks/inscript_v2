import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * 보호된 경로 설정
 */
const PROTECTED_PATHS = {
  // admin 역할이 필요한 경로
  admin: ["/admin"],
  // author 역할이 필요한 경로
  author: ["/author"],
  // 로그인만 필요한 경로 (역할 무관)
  authenticated: ["/mypage", "/messages"], // FIXME: 알림 등 추가 기획 필요
};

/**
 * 경로가 특정 패턴과 일치하는지 확인
 */
function matchesPath(pathname: string, patterns: string[]): boolean {
  return patterns.some((pattern) => pathname.startsWith(pattern));
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();
  const authUser = data?.claims;
  const pathname = request.nextUrl.pathname;

  // Admin 경로 보호 (role: admin 필요)
  if (matchesPath(pathname, PROTECTED_PATHS.admin)) {
    // 관리자 로그인 페이지는 보호하지 않음
    if (pathname.startsWith("/admin/login")) {
      return supabaseResponse;
    }

    if (!authUser) {
      // 로그인하지 않음 -> 관리자 로그인 페이지로
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // 사용자 역할 확인 (Supabase 클라이언트 사용)
    try {
      const { data: dbUser, error } = await supabase
        .from("users")
        .select("id, role")
        .eq("id", authUser.sub)
        .single();

      if (error || !dbUser || dbUser.role !== "admin") {
        // admin이 아님 -> 관리자 로그인 페이지로
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // DB 조회 오류 -> 관리자 로그인 페이지로
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // 인증만 필요한 경로 (역할 무관)
  if (matchesPath(pathname, PROTECTED_PATHS.authenticated)) {
    if (!authUser) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // 4. 나머지 공개 경로는 접근 허용
  return supabaseResponse;
}
