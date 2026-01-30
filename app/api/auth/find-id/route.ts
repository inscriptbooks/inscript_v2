import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "이름과 전화번호를 입력해주세요." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // users 테이블에서 이름과 전화번호로 사용자 찾기
    const [user] = await db
      .select({ email: users.email })
      .from(users)
      .where(and(eq(users.name, name), eq(users.phone, phone)))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "일치하는 사용자 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        email: user.email,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
