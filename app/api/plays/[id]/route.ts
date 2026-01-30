import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { plays, publicStatusEnum } from "@/lib/db/schema/plays";
import { playLogs } from "@/lib/db/schema/logs";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await db.query.plays.findFirst({
      where: and(eq(plays.id, id), eq(plays.isDeleted, false)),
      with: {
        author: {
          with: {
            user: true,
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json({ error: "Play not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      author,
      line1,
      line2,
      line3,
      year,
      country,
      keyword,
      plot,
      femaleCharacterCount,
      maleCharacterCount,
      characterList,
      publicStatus,
      publicHistory,
      salesStatus,
      price,
      attachmentUrl,
      attachmentName,
      attachmentPath,
    } = body;

    // 현재 로그인한 사용자 가져오기
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 기존 희곡 확인
    const existingPlay = await db.query.plays.findFirst({
      where: eq(plays.id, id),
    });

    if (!existingPlay) {
      return NextResponse.json({ error: "Play not found" }, { status: 404 });
    }

    // 희곡 수정
    await db
      .update(plays)
      .set({
        title: title || existingPlay.title,
        authorId:
          author === undefined
            ? existingPlay.authorId
            : author === "NONE"
              ? null
              : author,
        line1: line1 !== undefined ? line1 : existingPlay.line1,
        line2: line2 !== undefined ? line2 : existingPlay.line2,
        line3: line3 !== undefined ? line3 : existingPlay.line3,
        year: year !== undefined ? year : existingPlay.year,
        country: country !== undefined ? country : existingPlay.country,
        keyword: keyword || existingPlay.keyword,
        summary: plot || existingPlay.summary,
        femaleCharacterCount:
          femaleCharacterCount !== undefined
            ? femaleCharacterCount
            : existingPlay.femaleCharacterCount,
        maleCharacterCount:
          maleCharacterCount !== undefined
            ? maleCharacterCount
            : existingPlay.maleCharacterCount,
        characterList: characterList || existingPlay.characterList,
        publicStatus:
          publicStatus !== undefined
            ? (publicStatus as (typeof publicStatusEnum.enumValues)[number])
            : existingPlay.publicStatus,
        publicHistory:
          publicHistory !== undefined
            ? publicHistory
            : existingPlay.publicHistory,
        salesStatus:
          salesStatus !== undefined ? salesStatus : existingPlay.salesStatus,
        price:
          price !== undefined
            ? price
              ? parseInt(String(price), 10)
              : null
            : existingPlay.price,
        attachmentUrl:
          attachmentUrl !== undefined
            ? attachmentUrl
            : existingPlay.attachmentUrl,
        attachmentName:
          attachmentName !== undefined
            ? attachmentName
            : existingPlay.attachmentName,
        attachmentPath:
          attachmentPath !== undefined
            ? attachmentPath
            : existingPlay.attachmentPath,
      })
      .where(eq(plays.id, id));

    // play_logs 테이블에 수정 이벤트 기록
    try {
      await db.insert(playLogs).values({
        playId: id,
        userId: user.id,
        eventType: "수정",
      });
    } catch (logError) {
      // 로그 기록 실패해도 수정은 성공으로 처리
    }

    const updatedPlay = await db.query.plays.findFirst({
      where: eq(plays.id, id),
      with: {
        createdBy: true,
        author: {
          with: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPlay);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "희곡 수정 중 오류가 발생했습니다";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
