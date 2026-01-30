import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { db } from "@/lib/db";
import { plays } from "@/lib/db/schema/plays";
import { desc } from "drizzle-orm";
import { formatKoreanDate } from "@/lib/utils/date";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // 전체 데이터 조회 (페이징 없이)
    const data = await db.query.plays.findMany({
      with: {
        author: {
          with: {
            user: true,
          },
        },
      },
      orderBy: [desc(plays.createdAt)],
    });

    // status 매핑
    const statusDisplayMap: Record<string, string> = {
      applied: "승인대기",
      review: "검토중",
      accepted: "노출중",
      rejected: "반려",
      unpublished: "비공개",
    };

    // 각 희곡의 메모 카운트 조회
    const playsWithCounts = await Promise.all(
      data.map(async (play) => {
        const { count: memosCount } = await supabase
          .from("memos")
          .select("*", { count: "exact", head: true })
          .eq("play_id", play.id)
          .eq("is_deleted", false);

        return {
          ...play,
          memos_count: memosCount || 0,
        };
      })
    );

    // 엑셀 데이터로 변환
    const excelData = playsWithCounts.map((play, index) => ({
      NO: index + 1,
      작품명: play.title || "-",
      작가명: play.author?.authorName || "-",
      등록일자: play.createdAt
        ? formatKoreanDate(play.createdAt.toISOString())
        : "",
      상태: statusDisplayMap[play.applyStatus] || play.applyStatus,
      키워드: Array.isArray(play.keyword) ? play.keyword.join(", ") : "",
      조회수: play.viewCount || 0,
      메모수: play.memos_count || 0,
      스크랩수: play.bookmarkCount || 0,
    }));

    // 워크북 생성
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // 컬럼 너비 설정
    const colWidths = [
      { wch: 5 }, // NO
      { wch: 30 }, // 작품명
      { wch: 15 }, // 작가명
      { wch: 12 }, // 등록일자
      { wch: 10 }, // 상태
      { wch: 20 }, // 키워드
      { wch: 8 }, // 조회수
      { wch: 8 }, // 메모수
      { wch: 8 }, // 스크랩수
    ];
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "희곡 목록");

    // 엑셀 파일 생성
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // 응답 헤더 설정
    const headers = new Headers();
    headers.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    headers.set(
      "Content-Disposition",
      `attachment; filename="plays_${new Date().toISOString().split("T")[0]}.xlsx"`
    );

    return new Response(buffer, {
      headers,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to export plays",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
