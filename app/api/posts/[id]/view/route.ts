import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("increment_post_view_count", {
    post_id: id,
  });

  if (error) {
    return NextResponse.json(
      { error: "조회수 증가에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data });
}
