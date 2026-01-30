import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { sanctionId, sanctionType, userId } = await request.json();

  if (!sanctionId || !sanctionType || !userId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const tableName = sanctionType === "블랙리스트" ? "blacklist" : "penalty";
  const today = new Date().toISOString();

  try {
    // 1. 제재 테이블의 end_date 업데이트
    const { error: sanctionError } = await supabase
      .from(tableName)
      .update({ end_date: today })
      .eq("id", sanctionId);

    if (sanctionError) {
      throw new Error(`Failed to update sanction: ${sanctionError.message}`);
    }

    // 2. users 테이블의 status 업데이트
    const { error: userError } = await supabase
      .from("users")
      .update({ status: "normal" })
      .eq("id", userId);

    if (userError) {
      throw new Error(`Failed to update user status: ${userError.message}`);
    }

    return NextResponse.json({ message: "Sanction released successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
