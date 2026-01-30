import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // 현재 날짜
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 최근 6개월의 월별 데이터
    const monthlyData: { month: string; count: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();

      // 해당 월의 시작과 끝
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);

      const monthStartStr = monthStart.toISOString();
      const monthEndStr = monthEnd.toISOString();

      // 해당 월 말까지의 누적 사용자 수 (전체 기간 기준)
      const { count } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .lte("created_at", monthEndStr);

      const monthLabel = `${month + 1}월`;
      monthlyData.push({
        month: monthLabel,
        count: count || 0,
      });
    }

    return NextResponse.json(monthlyData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch monthly user data" },
      { status: 500 }
    );
  }
}
