import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { plays } from "@/lib/db/schema/plays";
import { playLogs } from "@/lib/db/schema/logs";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { playId, action, rejectionReason } = await request.json();

    if (!playId || !action) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 },
      );
    }

    if (action === "reject" && !rejectionReason) {
      return NextResponse.json(
        { error: "반려 사유를 입력해주세요." },
        { status: 400 },
      );
    }

    // 현재 로그인한 관리자 정보 가져오기
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 희곡 승인 또는 반려 처리
    const updateData: any = {
      applyStatus: action === "approve" ? "accepted" : "rejected",
    };

    if (action === "reject") {
      updateData.rejectionReason = rejectionReason;
    }

    if (action === "approve") {
      updateData.isVisible = true;
    }

    const result = await db
      .update(plays)
      .set(updateData)
      .where(eq(plays.id, playId))
      .returning();

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "희곡을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // play_logs 테이블에 승인/반려 이벤트 기록
    try {
      await db.insert(playLogs).values({
        playId: playId,
        userId: user.id,
        eventType: action === "approve" ? "승인" : "반려",
      });
    } catch (logError) {
      // 로그 기록 실패해도 승인/반려 처리는 성공으로 처리
      console.warn("Failed to create play log:", logError);
    }

    // 반려 시 작가에게 알림 전송
    if (action === "reject" && result[0].createdById) {
      try {
        await supabase.from("notifications").insert({
          user_id: result[0].createdById,
          type: "system",
          title: "희곡 등록 반려",
          message: `희곡 "${result[0].title}"이(가) 반려되었습니다.\n반려 사유: ${rejectionReason}`,
          is_read: false,
        });
      } catch (notificationError) {
        console.warn("Failed to send notification:", notificationError);
      }
    }

    return NextResponse.json({
      success: true,
      message:
        action === "approve"
          ? "희곡이 승인되었습니다."
          : "희곡이 반려되었습니다.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
