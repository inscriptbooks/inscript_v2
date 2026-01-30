import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { plays } from "@/lib/db/schema/plays";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "희곡 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const play = await db.query.plays.findFirst({
      where: (plays, { eq }) => eq(plays.id, id),
      with: {
        author: {
          with: {
            user: true,
          },
        },
        createdBy: true,
      },
    });

    if (!play) {
      return NextResponse.json(
        { error: "희곡을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: play.id,
      title: play.title,
      author: play.author?.authorName || "-",
      createdAt: play.createdAt?.toISOString() || "",
      applyStatus: play.applyStatus,
      rejectionReason: play.rejectionReason,
      userId: play.createdBy?.email || play.createdById,
      summary: play.summary,
      line1: play.line1,
      line2: play.line2,
      line3: play.line3,
      keyword: play.keyword,
      year: play.year,
      country: play.country,
      femaleCharacterCount: play.femaleCharacterCount,
      maleCharacterCount: play.maleCharacterCount,
      characterList: play.characterList,
      publicHistory: play.publicHistory,
      publicStatus: play.publicStatus,
      viewCount: play.viewCount,
      bookmarkCount: play.bookmarkCount,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
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

    if (!id) {
      return NextResponse.json(
        { error: "희곡 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // is_deleted를 true로 업데이트
    const { error } = await supabase
      .from("plays")
      .update({ is_deleted: true })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "희곡 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
