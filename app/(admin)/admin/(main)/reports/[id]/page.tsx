import { ReportDetail } from "./types";
import ReportDetailClient from "./components/ReportDetailClient";
import { notFound } from "next/navigation";

interface ReportsDetailPageProps {
  params: Promise<{ id: string }>;
}

async function fetchReportDetail(id: string): Promise<ReportDetail | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/admin/reports/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    const { report, targetContent, targetAuthor, comments } = result.data;

    // Map DB data to ReportDetail type
    const categoryMap: Record<string, "댓글" | "게시물" | "메모"> = {
      comment: "댓글",
      post: "게시물",
      memo: "메모",
    };

    const reportDetail: ReportDetail = {
      id: report.id,
      reportId: report.id.slice(0, 8),
      status: report.is_complete || "submitted",
      target: {
        id: targetContent?.id?.slice(0, 8) || "",
        type: categoryMap[report.type] || "댓글",
        author: targetAuthor
          ? `${targetAuthor.name}(${targetAuthor.email})`
          : "알 수 없음",
        content: targetContent?.content || targetContent?.title || "",
        createdAt: targetContent?.created_at
          ? new Date(targetContent.created_at).toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        originalLink:
          report.type === "post" && targetContent?.type
            ? `/community/${targetContent.type}/${report.post_id}`
            : report.type === "memo"
              ? `/memos/${report.memo_id}`
              : undefined,
      },
      reportInfo: {
        reporter: report.users
          ? `${report.users.name}(${report.users.email})`
          : "알 수 없음",
        reportType: report.reason || "",
        reason: report.reason || "",
        reportedAt: new Date(report.created_at).toLocaleString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      comments: comments.map((comment: any) => ({
        id: comment.id,
        author: comment.users ? `${comment.users.name}(${comment.users.email})` : "알 수 없음",
        content: comment.content,
        createdAt: new Date(comment.created_at).toLocaleString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        isPrivate: !comment.is_visible,
        isVisible: comment.is_visible,
      })),
      processingMethod: targetContent?.is_visible ? "visible" : "hidden",
    };

    return reportDetail;
  } catch (error) {
    return null;
  }
}

export default async function ReportsDetailPage({
  params,
}: ReportsDetailPageProps) {
  const { id } = await params;

  const reportDetail = await fetchReportDetail(id);

  if (!reportDetail) {
    notFound();
  }

  return <ReportDetailClient reportDetail={reportDetail} />;
}
