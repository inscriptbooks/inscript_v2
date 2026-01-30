import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // 오늘 날짜 시작
    const nowUtcMs = Date.now();
    const KST_OFFSET_MS = 9 * 60 * 60 * 1000; // UTC+9
    const kstNow = new Date(nowUtcMs + KST_OFFSET_MS);
    const kstStart = new Date(kstNow);
    kstStart.setHours(0, 0, 0, 0);
    kstStart.setDate(kstStart.getDate() - 7);
    const weeklyStartStr = new Date(
      kstStart.getTime() - KST_OFFSET_MS
    ).toISOString();

    // users: 전체와 오늘 신규
    const { count: usersTotal } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: usersNew } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weeklyStartStr);

    // plays: 전체와 오늘 신규
    const { count: playsTotal } = await supabase
      .from("plays")
      .select("*", { count: "exact", head: true });

    const { count: playsNew } = await supabase
      .from("plays")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weeklyStartStr);

    // authors: 전체 (created_at 없음, 신규는 0)
    const { count: authorsTotal } = await supabase
      .from("authors")
      .select("*", { count: "exact", head: true });

    const { count: authorsNew } = await supabase
      .from("authors")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weeklyStartStr);

    // posts: 오늘 신규 글과 댓글 (posts 테이블과 comments 테이블)
    const { count: newPosts } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weeklyStartStr);

    const { count: newComments } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weeklyStartStr);

    // reports: 신규와 미처리
    const { count: reportsNew } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weeklyStartStr);

    const { count: reportsIncomplete } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("is_complete", false);

    return NextResponse.json({
      users: {
        new: usersNew || 0,
        total: usersTotal || 0,
      },
      plays: {
        new: playsNew || 0,
        total: playsTotal || 0,
      },
      authors: {
        new: authorsNew || 0, // authors 테이블에 created_at 없음
        total: authorsTotal || 0,
      },
      posts: {
        newPosts: newPosts || 0,
        newComments: newComments || 0,
      },
      reports: {
        new: reportsNew || 0,
        incomplete: reportsIncomplete || 0,
      },
      meta: {
        weeklyStartUtc: weeklyStartStr,
        weeklyStartKst: new Date(weeklyStartStr).toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        nowKst: new Date().toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        users: { new: 0, total: 0 },
        plays: { new: 0, total: 0 },
        authors: { new: 0, total: 0 },
        posts: { newPosts: 0, newComments: 0 },
        reports: { new: 0, incomplete: 0 },
      },
      { status: 500 }
    );
  }
}
