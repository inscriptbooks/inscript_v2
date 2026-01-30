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

export default function CommunityNewsDetailPage() {
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

    return () => {
      hideLoader();
    };
  }, [postLoading, commentsLoading, showLoader, hideLoader]);

  useEffect(() => {
    if (id && !postLoading) {
      fetch(`/api/posts/${id}/view`, {
        method: "POST",
      });
    }
  }, [id, postLoading]);

  if (postLoading || commentsLoading) {
    return null;
  }

  const commentList = commentsData?.comments ?? [];

  if (!post) {
    // NOTE: Not Found
    return <div>Post not found</div>;
  }

  return (
    <section className="flex w-full flex-1 flex-col gap-10">
      <CommunityDetailHeaderSection
        post={post}
        backLinkHref="/community/news"
        backLinkText="인크소식"
      />
      <CommunityDetailSection post={post} />
      <CommunityDetailCommentSection postId={id} commentList={commentList} />
    </section>
  );
}
