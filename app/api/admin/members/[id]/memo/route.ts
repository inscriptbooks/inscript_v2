import { NextResponse, NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { memo } = await request.json();
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("users")
      .update({ admin_memo: memo })
      .eq("id", id)
      .select("admin_memo")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "운영자 메모 저장에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      adminMemo: data.admin_memo,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "운영자 메모 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}
