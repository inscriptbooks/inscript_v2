import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { authorApplicationId, action } = await request.json();

    const {
      data: { user: adminUser },
    } = await supabase.auth.getUser();
    if (!adminUser) {
      return NextResponse.json(
        { error: "인증되지 않은 요청입니다." },
        { status: 401 }
      );
    }

    const service = createServiceClient();
    const { data: adminRow } = await service
      .from("users")
      .select("role")
      .eq("id", adminUser.id)
      .single();
    if (!adminRow || adminRow.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    if (!authorApplicationId || !action) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    if (action === "approve") {
      // 작가 신청 정보 조회 및 상태 업데이트
      const { data: application, error } = await service
        .from("author_applications")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", authorApplicationId)
        .select(
          "user_id, author_name, representative_work, keyword, introduction"
        )
        .single();

      if (error) {
        return NextResponse.json(
          { error: "작가 승인에 실패했습니다." },
          { status: 500 }
        );
      }

      const userId = application?.user_id as string | undefined;
      if (!userId) {
        return NextResponse.json(
          { error: "승인 대상 사용자를 찾을 수 없습니다." },
          { status: 404 }
        );
      }

      // users 테이블 role 업데이트
      const { error: roleUpdateError } = await service
        .from("users")
        .update({ role: "author" })
        .eq("id", userId);

      if (roleUpdateError) {
        return NextResponse.json(
          { error: "사용자 역할 업데이트에 실패했습니다." },
          { status: 500 }
        );
      }

      // authors 테이블에 작가 정보 추가 (이미 존재하면 스킵)
      const { data: existingAuthor } = await service
        .from("authors")
        .select("id")
        .eq("id", userId)
        .single();

      if (!existingAuthor) {
        const { error: authorInsertError } = await service
          .from("authors")
          .insert({
            id: userId,
            author_name: application.author_name || "",
            featured_work: application.representative_work || "대표작 미등록",
            keyword: application.keyword || [],
            description: application.introduction || "",
            request_status: "approved",
            is_visible: true,
          });

        if (authorInsertError) {
          return NextResponse.json(
            { error: "작가 정보 등록에 실패했습니다." },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({ success: true });
    }

    if (action === "cancel_approval") {
      const { data: application, error } = await service
        .from("author_applications")
        .update({
          status: "pending",
          reviewed_at: null,
        })
        .eq("id", authorApplicationId)
        .select("user_id")
        .single();

      if (error) {
        return NextResponse.json(
          { error: "승인 취소에 실패했습니다." },
          { status: 500 }
        );
      }

      const userId = application?.user_id as string | undefined;
      if (!userId) {
        return NextResponse.json(
          { error: "대상 사용자를 찾을 수 없습니다." },
          { status: 404 }
        );
      }

      const { error: roleRevertError } = await service
        .from("users")
        .update({ role: "user" })
        .eq("id", userId);

      if (roleRevertError) {
        return NextResponse.json(
          { error: "사용자 역할 되돌리기에 실패했습니다." },
          { status: 500 }
        );
      }

      // authors 테이블에서 작가 정보 삭제
      await service.from("authors").delete().eq("id", userId);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
