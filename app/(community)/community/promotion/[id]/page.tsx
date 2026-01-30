"use client";

import { useEffect } from "react";
import {
  CommunityDetailHeaderSection,
  CommunityDetailCommentSection,
  CommunityDetailSection,
} from "@/components/features/community/sections";
import { useGetPost } from "@/hooks/posts";
import { useGetComments } from "@/hooks/comments";
import { useParams } from "next/navigation";
import { useLoader } from "@/hooks/common";

export default function CommunityPromotionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { showLoader, hideLoader } = useLoader();
  const { data: post, isLoading: postLoading } = useGetPost(id);
  const { data: commentsData, isLoading: commentsLoading } = useGetComments({
    postId: id,
  });

  const isLoading = postLoading || commentsLoading;

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }

    return () => {
      hideLoader();
    };
  }, [isLoading, showLoader, hideLoader]);

  useEffect(() => {
    if (id && !postLoading) {
      fetch(`/api/posts/${id}/view`, {
        method: "POST",
      });
    }
  }, [id, postLoading]);

  const commentList = commentsData?.comments ?? [];

  if (!post) {
    return null;
  }

  return (
    <section className="flex w-full flex-1 flex-col gap-10">
      <CommunityDetailHeaderSection
        post={post}
        backLinkHref="/community/promotion"
        backLinkText="얘기하기"
      />
      <CommunityDetailSection post={post} />
      <CommunityDetailCommentSection postId={id} commentList={commentList} />
    </section>
  );
}
