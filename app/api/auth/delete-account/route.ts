import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "인증되지 않은 사용자입니다." }, { status: 401 });
    }

    const userId = user.id;
    const service = createServiceClient();

    await supabase.auth.signOut();

    const { error: dbDeleteError } = await service.from("users").delete().eq("id", userId);
    if (dbDeleteError) {
      return NextResponse.json({ error: "사용자 데이터 삭제에 실패했습니다." }, { status: 500 });
    }

    const { error: authDeleteError } = await service.auth.admin.deleteUser(userId);
    if (authDeleteError) {
      return NextResponse.json({ error: "인증 계정 삭제에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
