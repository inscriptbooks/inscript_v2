import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: 멤버십 콘텐츠 조회
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("membership_content")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || null });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch membership content" },
      { status: 500 }
    );
  }
}

// PUT: 멤버십 콘텐츠 업데이트
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { introduction, benefits, subscriptionInfo } = body;

    // 기존 데이터 확인
    const { data: existingData } = await supabase
      .from("membership_content")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!existingData) {
      return NextResponse.json(
        { error: "Membership content not found" },
        { status: 404 }
      );
    }

    // 업데이트
    const { data, error } = await supabase
      .from("membership_content")
      .update({
        introduction,
        benefits,
        subscription_info: subscriptionInfo,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingData.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update membership content" },
      { status: 500 }
    );
  }
}
