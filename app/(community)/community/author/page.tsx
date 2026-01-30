"use client";

import { Suspense, useEffect, useState } from "react";
import { AuthorDashboard } from "@/components/features/dashboard";
import { useGetPosts } from "@/hooks/posts";
import { useLoader } from "@/hooks/common";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@/hooks/auth";
import { AuthorRequiredModal } from "@/components/common/Modal";

function CommunityAuthorPageContent() {
  const { showLoader, hideLoader } = useLoader();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentPage = Number(searchParams.get("page")) || 1;
  const keyword = searchParams.get("keyword") || undefined;
  const pageSize = 20;

  const { data, isLoading } = useGetPosts({
    page: currentPage,
    limit: pageSize,
    keyword,
    type: "author",
  });

  // 로그인 및 작가 권한 체크
  useEffect(() => {
    if (!userLoading) {
      // 로그인 정보가 없거나 author 권한이 없으면 모달 표시
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
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }

    return () => {
      hideLoader();
    };
  }, [isLoading, showLoader, hideLoader]);

  const posts = data?.posts || [];
  const totalPages = data?.meta?.totalPages || 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/community/author?${params.toString()}`);
  };

  const handleModalConfirm = () => {
    showLoader();
    router.push("/community");
  };

  const handleModalClose = () => {
    showLoader();
    router.push("/community");
  };

  return (
    <>
      <section className="flex w-full flex-1 flex-col pb-[60px]">
        {posts.length > 0 && (
          <AuthorDashboard
            authorItems={posts}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </section>
      <AuthorRequiredModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />
    </>
  );
}

export default function CommunityAuthorPage() {
  return (
    <Suspense fallback={<div />}>
      <CommunityAuthorPageContent />
    </Suspense>
  );
}
