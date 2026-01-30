import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "인증되지 않은 사용자입니다." },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { authorName, representativeWork } = body;

  // 이미 신청 이력이 있는지 확인
  const { data: existingApplication } = await supabase
    .from("author_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (existingApplication && existingApplication.status === "pending") {
    return NextResponse.json(
      { error: "이미 검토 중인 신청이 있습니다." },
      { status: 400 }
    );
  }

  // 작가 신청 생성
  const { data, error } = await supabase
    .from("author_applications")
    .insert({
      user_id: user.id,
      author_name: authorName,
      representative_work: representativeWork,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "인증되지 않은 사용자입니다." },
      { status: 401 }
    );
  }

  // 사용자의 최근 신청 이력 조회
  const { data, error } = await supabase
    .from("author_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data || null }, { status: 200 });
}
