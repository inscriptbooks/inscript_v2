import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// 알림 설정 조회
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 알림 설정 조회
  const { data: settings, error } = await supabase
    .from("notifications_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // 설정이 없으면 기본값으로 생성
  if (error || !settings) {
    const defaultSettings = {
      user_id: user.id,
      memo_comments: true,
      memo_likes: true,
      new_posts: true,
      post_comments: true,
      post_likes: true,
      new_programs: true,
      program_memo_reminder: true,
    };

    const { data: newSettings, error: insertError } = await supabase
      .from("notifications_settings")
      .insert(defaultSettings)
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "알림 설정을 불러오는데 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      memoComments: newSettings.memo_comments,
      memoLikes: newSettings.memo_likes,
      newPosts: newSettings.new_posts,
      postComments: newSettings.post_comments,
      postLikes: newSettings.post_likes,
      newPrograms: newSettings.new_programs,
      programMemoReminder: newSettings.program_memo_reminder,
    });
  }

  return NextResponse.json({
    memoComments: settings.memo_comments,
    memoLikes: settings.memo_likes,
    newPosts: settings.new_posts,
    postComments: settings.post_comments,
    postLikes: settings.post_likes,
    newPrograms: settings.new_programs,
    programMemoReminder: settings.program_memo_reminder,
  });
}

// 알림 설정 저장
export async function PUT(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    memoComments,
    memoLikes,
    newPosts,
    postComments,
    postLikes,
    newPrograms,
    programMemoReminder,
  } = body;

  // 알림 설정 업데이트
  const { error } = await supabase
    .from("notifications_settings")
    .update({
      memo_comments: memoComments,
      memo_likes: memoLikes,
      new_posts: newPosts,
      post_comments: postComments,
      post_likes: postLikes,
      new_programs: newPrograms,
      program_memo_reminder: programMemoReminder,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "알림 설정 저장에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "알림 설정이 저장되었습니다.",
  });
}
