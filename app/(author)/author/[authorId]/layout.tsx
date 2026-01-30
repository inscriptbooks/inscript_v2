"use client";

import { AuthorDetailHeader } from "@/components/features/author";
import { useGetAuthor } from "@/hooks/authors";
import { useParams } from "next/navigation";
import { useLoader } from "@/hooks/common";
import { useEffect } from "react";

interface AuthorDetailLayoutProps {
  children: React.ReactNode;
}

export default function AuthorDetailLayout({
  children,
}: AuthorDetailLayoutProps) {
  const params = useParams();
  const authorId = params.authorId as string;

  const { data: author, isLoading } = useGetAuthor(authorId);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  if (!author) {
    return;
  }

  return (
    <section className="flex w-full flex-1 flex-col pb-[60px]">
      <AuthorDetailHeader author={author} />
      {children}
    </section>
  );
}
