import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatKoreanDateTime } from "@/lib/utils/date";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // author_applications 테이블에서 해당 신청 정보 조회
  const { data: applicationData, error: applicationError } = await supabase
    .from("author_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (applicationError || !applicationData) {
    return NextResponse.json(
      { error: "작가 신청 정보를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  // 사용자 정보 조회
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("id", applicationData.user_id)
    .single();

  if (userError || !userData) {
    return NextResponse.json(
      { error: "사용자 정보를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const response = {
    id: applicationData.id,
    userId: applicationData.user_id,
    userName: userData.name || "-",
    userEmail: userData.email || "-",
    authorName: applicationData.author_name || "-",
    representativeWork: applicationData.representative_work || "-",
    verificationFileUrl: applicationData.verification_file_url || "-",
    keyword: applicationData.keyword || [],
    introduction: applicationData.introduction || "-",
    status: applicationData.status || "pending",
    rejectionReason: applicationData.rejection_reason,
    createdAt: formatKoreanDateTime(applicationData.created_at),
    updatedAt: formatKoreanDateTime(applicationData.updated_at),
    reviewedAt: applicationData.reviewed_at
      ? formatKoreanDateTime(applicationData.reviewed_at)
      : null,
  };

  return NextResponse.json(response);
}
