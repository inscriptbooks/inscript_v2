import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET: 현재 사용자의 membership 상태 조회
 */
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "인증되지 않은 사용자입니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, name, membership, created_at")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: "사용자 정보를 가져올 수 없습니다." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: data.id,
      name: data.name,
      membership: data.membership || false,
      membershipStartDate: data.membership ? data.created_at : null,
    },
  });
}

/**
 * POST: membership 구독 신청
 */
export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "인증되지 않은 사용자입니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .update({ membership: true })
    .eq("id", user.id)
    .select("id, name, membership, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "멤버십 구독에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: "멤버십 구독이 완료되었습니다.",
    data: {
      id: data.id,
      name: data.name,
      membership: data.membership,
      membershipStartDate: data.created_at,
    },
  });
}

/**
 * DELETE: membership 취소
 */
export async function DELETE() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "인증되지 않은 사용자입니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .update({ membership: false })
    .eq("id", user.id)
    .select("id, name, membership")
    .single();

  if (error) {
    return NextResponse.json({ error: "멤버십 취소에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: "멤버십이 취소되었습니다.",
    data: {
      id: data.id,
      name: data.name,
      membership: data.membership,
    },
  });
}
