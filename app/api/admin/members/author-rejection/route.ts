import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { authorApplicationId, category, rejectionReason } = await request.json();

    if (!authorApplicationId || !category || !rejectionReason) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 작가 반려
    const { error } = await supabase
      .from("author_applications")
      .update({
        status: "rejected",
        rejection_reason: rejectionReason,
        category: category,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", authorApplicationId);

    if (error) {
      return NextResponse.json(
        { error: "작가 반려에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
