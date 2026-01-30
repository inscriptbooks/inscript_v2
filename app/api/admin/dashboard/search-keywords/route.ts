import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("search_keywords")
      .select("keyword")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { keywords: [] },
        { status: 500 }
      );
    }

    // 키워드별로 카운트하고 상위 10개 추출
    const keywordCount: Record<string, number> = {};
    
    data?.forEach((item) => {
      const keyword = item.keyword.toLowerCase();
      keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
    });

    const topKeywords = Object.entries(keywordCount)
      .map(([keyword, count]) => ({
        keyword,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      keywords: topKeywords,
    });
  } catch (error) {
    return NextResponse.json(
      { keywords: [] },
      { status: 500 }
    );
  }
}
