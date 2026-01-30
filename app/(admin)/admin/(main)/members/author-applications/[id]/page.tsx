import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import AuthorApplicationDetailContent from "./components/AuthorApplicationDetailContent";
import { AuthorApplicationDetail } from "../types";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getApplicationData(
  id: string
): Promise<AuthorApplicationDetail | null> {
  const supabase = await createClient();

  // author_applications 테이블에서 해당 신청 정보 조회
  const { data: applicationData, error: applicationError } = await supabase
    .from("author_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (applicationError || !applicationData) {
    return null;
  }

  // 사용자 정보 조회
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("id", applicationData.user_id)
    .single();

  if (userError || !userData) {
    return null;
  }

  return {
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
    createdAt: applicationData.created_at
      ? new Date(applicationData.created_at).toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
        })
      : "-",
    updatedAt: applicationData.updated_at
      ? new Date(applicationData.updated_at).toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
        })
      : "-",
    reviewedAt: applicationData.reviewed_at
      ? new Date(applicationData.reviewed_at).toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
        })
      : null,
  };
}

export default async function AuthorApplicationDetailPage({
  params,
}: PageProps) {
  const { id } = await params;
  const data = await getApplicationData(id);

  if (!data) {
    notFound();
  }

  return <AuthorApplicationDetailContent data={data} />;
}
