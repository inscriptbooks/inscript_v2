import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user: adminUser },
    } = await supabase.auth.getUser();

    if (!adminUser) {
      return NextResponse.json({ error: "인증되지 않은 요청입니다." }, { status: 401 });
    }

    const service = createServiceClient();

    const { data: adminRow } = await service
      .from("users")
      .select("role")
      .eq("id", adminUser.id)
      .single();

    if (!adminRow || adminRow.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "email은 필수입니다." }, { status: 400 });
    }

    const { data: userRow } = await service
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    const userId = (userRow?.id as string | undefined) || undefined;

    if (userId) {
      const { error: dbDeleteError } = await service.from("users").delete().eq("id", userId);
      if (dbDeleteError) {
        return NextResponse.json({ error: "사용자 데이터 삭제에 실패했습니다." }, { status: 500 });
      }

      const { error: authDeleteError } = await service.auth.admin.deleteUser(userId);
      if (authDeleteError) {
        return NextResponse.json(
          { success: true, note: "DB는 삭제되었으나 인증 계정 삭제는 실패했습니다." },
          { status: 200 }
        );
      }

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json(
      { success: true, note: "DB에 해당 이메일 사용자가 없어 인증 계정만 수동 확인이 필요할 수 있습니다." },
      { status: 200 }
    );
  } catch (_error) {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
