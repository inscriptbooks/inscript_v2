"use client";

import {
  CommunityDetailHeaderSection,
  CommunityDetailCommentSection,
  CommunityDetailSection,
} from "@/components/features/community/sections";
import { useGetPost } from "@/hooks/posts";
import { useGetComments } from "@/hooks/comments";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLoader } from "@/hooks/common";

export default function CommunityRecruitDetailPage() {
  const { showLoader, hideLoader } = useLoader();
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading: postLoading } = useGetPost(id);
  const { data: commentsData, isLoading: commentsLoading } = useGetComments({
    postId: id,
  });

  useEffect(() => {
    if (postLoading || commentsLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [postLoading, commentsLoading, showLoader, hideLoader]);

  useEffect(() => {
    if (id && !postLoading) {
      fetch(`/api/posts/${id}/view`, {
        method: "POST",
      });
    }
  }, [id, postLoading]);

  const commentList = commentsData?.comments ?? [];

  if (!post) {
    return;
  }

  return (
    <section className="flex w-full flex-1 flex-col gap-10">
      <CommunityDetailHeaderSection
        post={post}
        backLinkHref="/community/recruit"
        backLinkText="함께하기"
      />
      <CommunityDetailSection post={post} />
      <CommunityDetailCommentSection postId={id} commentList={commentList} />
    </section>
  );
}
