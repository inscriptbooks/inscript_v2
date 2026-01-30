import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const now = new Date();

    const { data: popups, error } = await supabase
      .from("popups")
      .select("*")
      .eq("is_visible", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // 현재 날짜가 start_date와 end_date 사이에 있는 팝업만 필터링
    const activePopups = (popups || []).filter((popup) => {
      if (!popup.start_date || !popup.end_date) {
        return false;
      }

      const startDate = new Date(popup.start_date);
      const endDate = new Date(popup.end_date);

      // 시작일의 시작 시간 (00:00:00)
      startDate.setHours(0, 0, 0, 0);
      // 종료일의 종료 시간 (23:59:59)
      endDate.setHours(23, 59, 59, 999);

      return now >= startDate && now <= endDate;
    });

    return NextResponse.json({
      success: true,
      data: activePopups,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "활성 팝업을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
