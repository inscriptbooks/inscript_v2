"use client";

import {
  MemoPreviewCard,
  PlayMemoDetailSection,
} from "@/components/features/memo";
import { useGetMemo } from "@/hooks/memos";
import { useGetComments } from "@/hooks/comments";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLoader } from "@/hooks/common";

export default function PlayDetailMemoPage() {
  const params = useParams();
  const memoId = params.memoId as string;
  const { showLoader, hideLoader } = useLoader();

  const { data: memo, isLoading: isMemoLoading } = useGetMemo(memoId);
  const { data: commentsData, isLoading: isCommentsLoading } = useGetComments({
    memoId: memoId,
  });

  useEffect(() => {
    if (isMemoLoading || isCommentsLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isMemoLoading, isCommentsLoading, showLoader, hideLoader]);

  if (!memo) {
    return;
  }

  const commentList = commentsData?.comments ?? [];

  return (
    <section className="flex w-full flex-1 flex-col gap-10 px-[20px] pt-11 lg:px-[120px] lg:pt-[80px]">
      <MemoPreviewCard memo={memo} hasLink={false} />
      <PlayMemoDetailSection playMemo={memo} commentList={commentList} />
    </section>
  );
}
