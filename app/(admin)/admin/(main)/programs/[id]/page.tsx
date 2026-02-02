import { redirect } from "next/navigation";
import ProgramManagement from "./components/ProgramManagement";
import ProgramDetail from "./components/ProgramDetail";
import MemoManagement from "./components/MemoManagement";
import ApplicantListWrapper from "./components/ApplicantListWrapper";
import BackButton from "./components/BackButton";
import ActionButtons from "./components/ActionButtons";
import {
  MemoData,
  ProgramBasicInfo,
  ProgramDetailInfo,
  ProgramResponse,
  MemoResponse,
} from "./types";
import { formatKoreanDate, formatKoreanDateTime } from "@/lib/utils/date";

async function getProgramData(programId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/programs/${programId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    return null;
  }
}

function transformProgramData(program: ProgramResponse): {
  basicInfo: ProgramBasicInfo;
  programInfo: ProgramDetailInfo;
} {
  const basicInfo: ProgramBasicInfo = {
    programId: program.id.slice(0, 8),
    applicationCount: program.application_count,
    createdAt: formatKoreanDate(program.created_at),
    viewCount: program.view_count,
    bookmarkCount: program.bookmark_count,
  };

  const programInfo: ProgramDetailInfo = {
    title: program.title,
    eventDateTime: formatKoreanDateTime(program.event_date_time),
    applicationPeriod: `${formatKoreanDateTime(program.application_start_at)} ~ ${formatKoreanDateTime(program.application_end_at)}`,
    location: program.location,
    capacity: program.capacity ? `${program.capacity}명` : "",
    notes: program.notes,
    keywords: Array.isArray(program.keyword) ? program.keyword : [],
    description: program.description,
    thumbnailUrl: program.thumbnail_url,
    isVisible: program.is_visible,
    status: getStatus(program.application_start_at, program.application_end_at),
  };

  return { basicInfo, programInfo };
}

function getStatus(startDate: string, endDate: string): string {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "대기중";
  if (now > end) return "종료";
  return "진행중";
}

function transformMemoData(memos: MemoResponse[]): MemoData[] {
  return memos.map((memo) => ({
    id: memo.id.slice(0, 8),
    author: memo.users.name || memo.users.email.split("@")[0],
    content: memo.content.slice(0, 50),
    likes: memo.like_count,
    comments: memo.comment_count,
    reports: 0, // 신고 수는 별도 테이블이 필요할 수 있음
  }));
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: programId } = await params;
  const data = await getProgramData(programId);

  if (!data) {
    redirect("/admin/programs");
  }

  const { basicInfo, programInfo } = transformProgramData(data.program);
  const memoData = transformMemoData(data.memos);

  return (
    <div className="flex w-full flex-col items-start gap-20 p-8">
      <div className="flex w-full flex-col items-center justify-center gap-20 rounded-md bg-white p-11">
        {/* 프로그램 관리 섹션 */}
        <ProgramManagement basicInfo={basicInfo} />

        {/* 프로그램 정보 섹션 */}
        <ProgramDetail programInfo={programInfo} />

        {/* 메모 관리 섹션 */}
        <MemoManagement memos={memoData} />

        {/* 신청자 목록 섹션 */}
        <ApplicantListWrapper
          programId={programId}
          programTitle={programInfo.title}
        />

        {/* 하단 액션 버튼 */}
        <div className="flex w-full items-center justify-between">
          <BackButton />
          <ActionButtons programId={programId} />
        </div>
      </div>
    </div>
  );
}
