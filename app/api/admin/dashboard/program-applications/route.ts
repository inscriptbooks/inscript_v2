import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatKoreanDateTime } from "@/lib/utils/date";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("program_applications")
      .select(
        `
        id,
        created_at,
        name,
        email,
        phone,
        status,
        programs(id, title),
        users(id, name)
      `
      )
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      return NextResponse.json({ applications: [] }, { status: 500 });
    }

    const applications = (data || []).map((app: any) => ({
      id: app.id,
      email: app.email || "이메일 정보 없음",
      title: app.programs?.title || "프로그램 정보 없음",
      user: app.users?.name || app.name || "사용자 정보 없음",
      date: formatKoreanDateTime(app.created_at),
    }));

    return NextResponse.json({ applications });
  } catch (error) {
    return NextResponse.json({ applications: [] }, { status: 500 });
  }
}
