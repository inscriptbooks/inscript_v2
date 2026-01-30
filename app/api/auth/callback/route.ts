import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // "next" 파라미터가 있으면 리다이렉트 URL로 사용
  let next = searchParams.get("next") ?? "/";

  if (!next.startsWith("/")) {
    // "next"가 상대 URL이 아니면 기본값 사용
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // OAuth 사용자 정보를 데이터베이스에 동기화
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const provider = user.app_metadata.provider || "google";
          const email = user.email || "";
          const fullName =
            user.user_metadata.full_name ||
            user.user_metadata.name ||
            email.split("@")[0];
          const thumbnail =
            user.user_metadata.avatar_url || user.user_metadata.picture || null;

          // Upsert: 사용자가 없으면 생성, 있으면 업데이트
          await db
            .insert(users)
            .values({
              id: user.id,
              email,
              name: fullName,
              authProvider: provider as "google" | "kakao" | "local",
              role: "user",
              status: "active",
              lastLogin: new Date(),
              thumbnail,
            })
            .onConflictDoUpdate({
              target: users.id,
              set: {
                lastLogin: new Date(),
                thumbnail,
              },
            });
        }
      } catch (dbError) {
        // 데이터베이스 오류가 있어도 로그인은 계속 진행
      }

      const forwardedHost = request.headers.get("x-forwarded-host"); // 로드 밸런서 앞의 원본 origin
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        // 로컬 환경에서는 로드 밸런서가 없으므로 X-Forwarded-Host를 확인할 필요 없음
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // 에러가 있으면 에러 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
