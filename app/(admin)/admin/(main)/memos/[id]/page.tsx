import { notFound } from "next/navigation";
import MemoDetailContent from "./components/MemoDetailContent";

interface MemoDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getMemoData(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/memos/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.memo;
  } catch (error) {
    return null;
  }
}

async function getMemoComments(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/memos/${id}/comments`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.comments;
  } catch (error) {
    return [];
  }
}

export default async function MemoDetailPage({ params }: MemoDetailPageProps) {
  const { id } = await params;

  const [memo, comments] = await Promise.all([
    getMemoData(id),
    getMemoComments(id),
  ]);

  if (!memo) {
    notFound();
  }

  return <MemoDetailContent initialMemo={memo} initialComments={comments} />;
}
