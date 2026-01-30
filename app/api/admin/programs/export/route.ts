import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // 모든 프로그램 데이터 가져오기
    const { data: programs, error } = await supabase
      .from("programs")
      .select("*")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // 날짜 포맷팅 헬퍼 함수 (YYYY.MM.DD 형식으로 변환, 유효하지 않은 날짜는 빈 문자열 반환)
    const formatDate = (dateString: string | null | undefined): string => {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}.${month}.${day}`;
    };

    // 행사일시 포맷팅 헬퍼 함수 (YYYY.MM.DD HH:MM 형식)
    const formatDateTime = (dateString: string | null | undefined): string => {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    // 각 프로그램의 관련 카운트 가져오기
    const programsWithCounts = await Promise.all(
      (programs || []).map(async (program) => {
        // 메모수 (memos 테이블에서 program_id로 필터)
        const { count: memosCount } = await supabase
          .from("memos")
          .select("*", { count: "exact", head: true })
          .eq("program_id", program.id)
          .eq("is_deleted", false);

        // 스크랩수 (bookmarks 테이블)
        const { count: bookmarksCount } = await supabase
          .from("bookmarks")
          .select("*", { count: "exact", head: true })
          .eq("target_id", program.id)
          .eq("target_type", "program")
          .eq("is_deleted", false);

        return {
          ...program,
          event_date: program.event_date_time,
          event_location: program.location,
          application_start_date: program.application_start_at,
          application_end_date: program.application_end_at,
          status: (() => {
            const now = new Date();
            const startDate = new Date(program.application_start_at);
            const endDate = new Date(program.application_end_at);
            endDate.setHours(23, 59, 59, 999);
            return startDate <= now && now <= endDate ? "진행중" : "종료";
          })(),
          memos_count: memosCount || 0,
          bookmarks_count: bookmarksCount || 0,
        };
      })
    );

    // xlsx 형식으로 변환
    const worksheetData =
      programsWithCounts?.map((program, index) => ({
        NO: index + 1,
        프로그램명: program.title || "",
        행사일시: formatDateTime(program.event_date),
        행사장소: program.event_location || "",
        신청시작일: formatDate(program.application_start_date),
        신청종료일: formatDate(program.application_end_date),
        상태: program.status || "",
        노출여부: program.is_visible ? "노출" : "비노출",
        등록일자: formatDate(program.created_at),
      })) || [];

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "프로그램 목록");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="programs_${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "엑셀 다운로드에 실패했습니다." },
      { status: 500 }
    );
  }
}
