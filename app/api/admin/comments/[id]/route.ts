import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { is_visible } = body;

    if (typeof is_visible !== "boolean") {
      return NextResponse.json(
        { error: "is_visible 값이 유효하지 않습니다." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("comments")
      .update({ is_visible })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "댓글 상태 업데이트에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "댓글 상태가 업데이트되었습니다.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "댓글 상태 업데이트 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // soft delete
    const { error } = await supabase
      .from("comments")
      .update({ is_deleted: true })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "댓글 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "댓글이 삭제되었습니다.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "댓글 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
