import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient();
  const { id } = await params;

  const body = await request.json();
  const { status } = body;

  if (!status) {
    return NextResponse.json(
      { error: "상태값이 필요합니다." },
      { status: 400 }
    );
  }

  if (status !== "cancelled") {
    return NextResponse.json(
      { error: "유효하지 않은 상태값입니다." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("program_applications")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data });
}
