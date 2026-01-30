import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const supabase = await createClient();

    // 삭제되지 않은 작가 데이터 조회 (users 조인)
    const { data: authorsData, error: authorsError } = await supabase
      .from("authors")
      .select(
        `
        id,
        author_name,
        featured_work,
        keyword,
        is_visible,
        created_at,
        users!inner(email)
      `
      )
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (authorsError) {
      return NextResponse.json(
        {
          error: "Failed to fetch authors",
          details: authorsError.message,
        },
        { status: 500 }
      );
    }

    // 각 작가의 작품수, 메모수, 스크랩수 조회
    const writersData = await Promise.all(
      (authorsData || []).map(async (author) => {
        // 작품수 조회
        const { count: worksCount } = await supabase
          .from("plays")
          .select("*", { count: "exact", head: true })
          .eq("author_id", author.id)
          .eq("is_deleted", false);

        // 메모수 조회
        const { count: memosCount } = await supabase
          .from("memos")
          .select("*", { count: "exact", head: true })
          .eq("author_id", author.id);

        // 스크랩수 조회
        const { count: scrapsCount } = await supabase
          .from("bookmarks")
          .select("*", { count: "exact", head: true })
          .eq("author_id", author.id)
          .eq("type", "author");

        return {
          작가명: author.author_name || "-",
          대표작: author.featured_work || "대표작 미등록",
          키워드: Array.isArray(author.keyword)
            ? author.keyword.join(", ")
            : "-",
          상태: author.is_visible ? "노출중" : "미노출중",
          "등록/신청일": author.created_at
            ? new Date(author.created_at).toISOString().split("T")[0]
            : "",
          작품수: worksCount || 0,
          메모수: memosCount || 0,
          스크랩수: scrapsCount || 0,
        };
      })
    );

    // XLSX 워크북 생성
    const worksheet = XLSX.utils.json_to_sheet(writersData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "작가 목록");

    // XLSX 파일을 버퍼로 변환
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="writers_${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to export writers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
