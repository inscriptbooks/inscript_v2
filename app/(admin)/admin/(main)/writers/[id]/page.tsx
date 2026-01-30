import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import WriterManagement from "./components/WriterManagement";
import WriterInfo from "./components/WriterInfo";
import PlayStatus from "./components/PlayStatus";
import MemoManagement from "./components/MemoManagement";
import ActionButtons from "./components/ActionButtons";
import { PlayData, MemoData } from "./types";

interface PageParams {
  params: Promise<{ id: string }>;
}

export default async function WriterDetailPage({ params }: PageParams) {
  const { id } = await params;
  const supabase = await createClient();

  // Supabase에서 authors 데이터 가져오기
  const { data: authorData, error: authorError } = await supabase
    .from("authors")
    .select("*")
    .eq("id", id)
    .single();

  if (authorError || !authorData) {
    notFound();
  }

  // 해당 작가의 작품 데이터 가져오기
  const { data: playsData } = await supabase
    .from("plays")
    .select("id, title, created_at")
    .eq("author_id", id)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  // 각 작품에 대한 좋아요, 댓글, 신고 수 가져오기
  const playIds = playsData?.map((play) => play.id) || [];

  // 좋아요 수 집계
  const { data: likesData } = await supabase
    .from("likes")
    .select("memo_id")
    .eq("type", "memo")
    .in("memo_id", playIds);

  // 댓글 수 집계(숨김 포함: is_deleted=false만 적용)
  const { data: commentsData } = await supabase
    .from("comments")
    .select("memo_id")
    .eq("type", "memo")
    .eq("is_deleted", false)
    .in("memo_id", playIds);

  // 신고 수 집계
  const { data: reportsData } = await supabase
    .from("reports")
    .select("play_id")
    .eq("type", "play")
    .in("play_id", playIds);

  const likeCounts: Record<string, number> = {};
  const commentCounts: Record<string, number> = {};
  const reportCounts: Record<string, number> = {};

  likesData?.forEach((like) => {
    if (like.memo_id) {
      likeCounts[like.memo_id] = (likeCounts[like.memo_id] || 0) + 1;
    }
  });

  commentsData?.forEach((comment) => {
    if (comment.memo_id) {
      commentCounts[comment.memo_id] =
        (commentCounts[comment.memo_id] || 0) + 1;
    }
  });

  reportsData?.forEach((report) => {
    if (report.play_id) {
      reportCounts[report.play_id] = (reportCounts[report.play_id] || 0) + 1;
    }
  });

  // 작품 데이터 포맷팅
  const playData: PlayData[] =
    playsData?.map((play) => ({
      id: play.id,
      title: play.title,
      created_at: play.created_at,
      like_count: likeCounts[play.id] || 0,
      comment_count: commentCounts[play.id] || 0,
      report_count: reportCounts[play.id] || 0,
    })) || [];

  // 해당 작가의 메모 데이터 가져오기
  const { data: memosData } = await supabase
    .from("memos")
    .select(
      `
      id,
      content,
      like_count,
      comment_count,
      user_id,
      users:user_id (
        name,
        email
      )
    `
    )
    .eq("author_id", id)
    .order("created_at", { ascending: false });

  // 각 메모에 대한 신고/댓글 수 집계용 메모 ID
  const memoIds = memosData?.map((memo) => memo.id) || [];

  // 메모 댓글 수 집계(숨김 포함: is_deleted=false만 적용)
  const { data: memoCommentRows } = await supabase
    .from("comments")
    .select("memo_id")
    .eq("type", "memo")
    .eq("is_deleted", false)
    .in("memo_id", memoIds);

  const memoCommentCounts: Record<string, number> = {};
  memoCommentRows?.forEach((row: any) => {
    if (row.memo_id) {
      memoCommentCounts[row.memo_id] =
        (memoCommentCounts[row.memo_id] || 0) + 1;
    }
  });

  const { data: memoReportsData } = await supabase
    .from("reports")
    .select("memo_id")
    .eq("type", "memo")
    .in("memo_id", memoIds);

  const memoReportCounts: Record<string, number> = {};
  memoReportsData?.forEach((report) => {
    if (report.memo_id) {
      memoReportCounts[report.memo_id] =
        (memoReportCounts[report.memo_id] || 0) + 1;
    }
  });

  // 메모 데이터 포맷팅
  const memoData: MemoData[] =
    memosData?.map((memo: any) => ({
      id: memo.id,
      author: memo.users?.name || memo.users?.email || "알 수 없음",
      content: memo.content.substring(0, 50),
      like_count: memo.like_count,
      comment_count: memoCommentCounts[memo.id] || 0,
      report_count: memoReportCounts[memo.id] || 0,
    })) || [];

  return (
    <div className="bg-transparent p-8">
      <div className="flex w-full flex-col gap-20 rounded bg-white p-11">
        {/* 작가 관리 섹션 */}
        <div className="flex flex-col gap-10">
          <WriterManagement authorData={authorData} />
          <WriterInfo authorData={authorData} />
          <PlayStatus playData={playData} />
          <MemoManagement memoData={memoData} />
        </div>

        {/* 하단 액션 버튼들 */}
        <ActionButtons authorId={id} />
      </div>
    </div>
  );
}
