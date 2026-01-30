import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const body = await request.json();
    const { is_reply } = body;

    // 현재 로그인한 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    // 쪽지 업데이트 - 자신이 받은 쪽지만 업데이트 가능
    const { data, error } = await supabase
      .from("notes")
      .update({ is_reply })
      .eq("id", id)
      .eq("receiver_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "쪽지 업데이트에 실패했습니다.", details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "쪽지를 찾을 수 없거나 권한이 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "쪽지 업데이트 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
