import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PlayManagement from "./components/PlayManagement";
import PlayInfo from "./components/PlayInfo";
import MemoManagement from "./components/MemoManagement";
import OperationLog from "./components/OperationLog";
import ActionButtons from "./components/ActionButtons";
import { formatKoreanDate } from "@/lib/utils/date";

interface PageParams {
  params: Promise<{ id: string }>;
}

export default async function PlayDetailPage({ params }: PageParams) {
  const { id } = await params;
  const supabase = await createClient();

  // Supabase에서 plays 데이터 가져오기
  const { data: playData, error: playError } = await supabase
    .from("plays")
    .select("*")
    .eq("id", id)
    .single();

  if (playError || !playData) {
    notFound();
  }

  // 등록자 정보 가져오기
  let createdBy = null;
  if (playData.created_by_id) {
    const { data: userData } = await supabase
      .from("users")
      .select("id, name, name_en, email")
      .eq("id", playData.created_by_id)
      .single();
    createdBy = userData;
  }

  // 작가 정보 가져오기
  let author = null;
  if (playData.author_id) {
    const { data: authorData } = await supabase
      .from("authors")
      .select("id, author_name, author_name_en")
      .eq("id", playData.author_id)
      .single();
    author = authorData;
  }

  // 데이터 병합
  const fullPlayData = {
    ...playData,
    created_by: createdBy,
    author: author,
  };

  // 해당 희곡에 대한 메모 데이터 가져오기
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
    .eq("play_id", id)
    .order("created_at", { ascending: false });

  // 각 메모에 대한 신고 수 가져오기
  const memoIds = memosData?.map((memo) => memo.id) || [];
  const { data: reportsData } = await supabase
    .from("reports")
    .select("memo_id")
    .eq("type", "memo")
    .in("memo_id", memoIds);

  // 신고 수 집계
  const reportCounts: Record<string, number> = {};
  reportsData?.forEach((report) => {
    if (report.memo_id) {
      reportCounts[report.memo_id] = (reportCounts[report.memo_id] || 0) + 1;
    }
  });

  const { data: commentRows } = await supabase
    .from("comments")
    .select("memo_id")
    .eq("type", "memo")
    .eq("is_deleted", false)
    .in("memo_id", memoIds);

  const commentCounts: Record<string, number> = {};
  commentRows?.forEach((row) => {
    if (row.memo_id) {
      commentCounts[row.memo_id] = (commentCounts[row.memo_id] || 0) + 1;
    }
  });

  // 메모 데이터 포맷팅
  const memoData =
    memosData?.map((memo: any) => ({
      id: memo.id,
      author: memo.users?.name || memo.users?.email || "알 수 없음",
      content: memo.content.substring(0, 50),
      likes: memo.like_count,
      comments: commentCounts[memo.id] || 0,
      reports: reportCounts[memo.id] || 0,
    })) || [];

  // 해당 희곡에 대한 운영 로그 가져오기
  const { data: logsData, error: logsError } = await supabase
    .from("play_logs")
    .select(
      `
      id,
      event_type,
      created_at,
      user_id,
      users:user_id (
        name,
        email
      )
    `
    )
    .eq("play_id", id)
    .order("created_at", { ascending: false });

  // 로그 데이터 포맷팅
  const logData =
    logsData?.map((log: any) => ({
      date: formatKoreanDate(log.created_at),
      email: log.users?.email || "알 수 없음",
      event: log.event_type,
    })) || [];

  return (
    <div className="bg-transparent p-8">
      <div className="flex w-full flex-col gap-20 rounded-[5px] bg-white p-11">
        {/* 희곡 관리 섹션 */}
        <div className="flex flex-col gap-10">
          <PlayManagement playData={fullPlayData} />
          <PlayInfo playData={fullPlayData} />
          <MemoManagement memoData={memoData} />
          <OperationLog logData={logData} />
        </div>

        {/* 하단 액션 버튼들 */}
        <ActionButtons playId={id} />
      </div>
    </div>
  );
}
