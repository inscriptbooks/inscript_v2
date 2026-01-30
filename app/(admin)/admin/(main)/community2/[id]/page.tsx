"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Hamburger } from "@/components/icons";
import {
  CommunityDetailHeaderSection,
  CommunityDetailSection,
} from "@/components/features/community/sections";
import AdminCommentSection from "./components/AdminCommentSection";
import { useGetPost } from "@/hooks/posts";
import { useGetComments } from "@/hooks/comments";
import { useLoader } from "@/hooks/common";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";

export default function CommunityDetailPage() {
  const { showLoader, hideLoader } = useLoader();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading: postLoading } = useGetPost(id);
  const { data: commentsData, isLoading: commentsLoading } = useGetComments({
    postId: id,
    includeHidden: true, // 관리자는 숨겨진 댓글도 볼 수 있음
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

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        showErrorToast("게시글 삭제에 실패했습니다.");
        return;
      }

      showSuccessToast("게시글이 삭제되었습니다.");
      router.push("/admin/community2");
    } catch (error) {
      showErrorToast("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleToggleVisibility = async () => {
    // if (!confirm("게시글을 비공개로 전환하시겠습니까?")) {
    //   return;
    // }

    try {
      const response = await fetch(`/api/posts/${id}/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isVisible: false }),
      });

      if (!response.ok) {
        showErrorToast("게시글 비공개 처리에 실패했습니다.");
        return;
      }

      showSuccessToast("게시글이 비공개로 전환되었습니다.");
      router.push("/admin/community2");
    } catch (error) {
      showErrorToast("게시글 비공개 처리 중 오류가 발생했습니다.");
    }
  };

  if (postLoading || commentsLoading) {
    return null;
  }

  if (!post) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-gray-3">게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const commentList = commentsData?.comments ?? [];

  return (
    <div className="flex h-auto w-full items-start gap-2.5 p-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-20 rounded-[5px] bg-white p-11">
        {/* 게시물 메인 컨테이너 */}
        <div className="flex w-full flex-col gap-10">
          <CommunityDetailHeaderSection
            post={post}
            backLinkHref="/admin/community2"
            backLinkText="커뮤니티 관리"
          />
          <CommunityDetailSection post={post} />
          <AdminCommentSection postId={id} commentList={commentList} />
        </div>

        {/* 하단 액션 버튼들 */}
        <div className="flex w-full items-center justify-between px-20">
          <Button
            onClick={() => router.push("/admin/community2")}
            className="flex h-auto items-center justify-center gap-1.5 rounded-[4px] border border-gray-4 bg-white px-3 py-2.5 font-pretendard text-sm font-semibold leading-4 tracking-[-0.28px] text-gray-2 hover:bg-gray-50"
          >
            <Hamburger size={16} color="#555555" />
            목록으로
          </Button>
          <div className="flex items-center gap-2.5">
            <Button
              onClick={handleDelete}
              className="flex h-9 w-12 items-center justify-center gap-1.5 rounded-[4px] border border-primary bg-white px-3 py-2.5 font-pretendard text-sm font-semibold leading-4 tracking-[-0.28px] text-primary hover:bg-red-50"
            >
              삭제
            </Button>
            <Button
              onClick={handleToggleVisibility}
              className="flex h-9 w-12 items-center justify-center gap-1.5 rounded-[4px] bg-primary px-3 py-2.5 font-pretendard text-sm font-semibold leading-4 tracking-[-0.28px] text-white hover:bg-primary/90"
            >
              비공개
            </Button>
            <Button
              onClick={() => router.push(`/admin/community2/edit?id=${id}`)}
              className="flex h-9 w-12 items-center justify-center gap-1.5 rounded-[4px] bg-primary px-3 py-2.5 font-pretendard text-sm font-semibold leading-4 tracking-[-0.28px] text-white hover:bg-primary/90"
            >
              수정
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
