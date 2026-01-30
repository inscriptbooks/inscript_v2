import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 현재 로그인한 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    // users 테이블에 레코드가 있는지 확인
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (existingUser.length === 0) {
      // 레코드가 없으면 새로 생성 (이메일 로그인 사용자)
      const provider = user.app_metadata.provider || "local";
      const email = user.email || "";
      const name = user.user_metadata.nickname || email.split("@")[0];
      const thumbnail = user.user_metadata.avatar_url || null;

      await db.insert(users).values({
        id: user.id,
        email,
        name,
        authProvider: provider as "google" | "kakao" | "local",
        role: "user",
        status: "active",
        lastLogin: new Date(),
        thumbnail,
      });
    } else {
      // 레코드가 있으면 last_login만 업데이트
      await db
        .update(users)
        .set({ lastLogin: new Date() })
        .where(eq(users.id, user.id));
    }

    return NextResponse.json(
      { message: "last_login이 업데이트되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
