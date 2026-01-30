"use client";

import { useEffect, useState } from "react";
import {
  CommunityDetailHeaderSection,
  CommunityDetailCommentSection,
  CommunityDetailSection,
} from "@/components/features/community/sections";
import { useGetPost } from "@/hooks/posts";
import { useGetComments } from "@/hooks/comments";
import { useParams, useRouter } from "next/navigation";
import { useLoader } from "@/hooks/common";
import { useUser } from "@/hooks/auth";
import { AuthorRequiredModal } from "@/components/common/Modal";

export default function CommunityAuthorDetailPage() {
  const { showLoader, hideLoader } = useLoader();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: userLoading } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: post, isLoading: postLoading } = useGetPost(id);
  const { data: commentsData, isLoading: commentsLoading } = useGetComments({
    postId: id,
  });

  // 작가 권한 체크
  useEffect(() => {
    if (!userLoading) {
      if (!user) {
        setIsModalOpen(true);
        return;
      }

      const hasAuthorAccess = user.role === "author" || user.role === "admin";
      if (!hasAuthorAccess) {
        setIsModalOpen(true);
      }
    }
  }, [user, userLoading]);

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

  const handleModalConfirm = () => {
    showLoader();
    router.push("/community");
  };

  const handleModalClose = () => {
    showLoader();
    router.push("/community");
  };

  if (!post) {
    //NOTE: Not Found
    return <div>Post not found</div>;
  }

  return (
    <>
      <section className="flex w-full flex-1 flex-col gap-10">
        <CommunityDetailHeaderSection
          post={post}
          backLinkHref="/community/author"
          backLinkText="작가 커뮤니티"
          isAnonymous={true}
        />
        <CommunityDetailSection post={post} />
        <CommunityDetailCommentSection
          postId={id}
          commentList={commentList}
          isAnonymous={true}
        />
      </section>
      <AuthorRequiredModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />
    </>
  );
}
