"use client";

import {
  AuthorDetailHeaderSection,
  AuthorDetailMemoSection,
  AuthorDetailPlaylistSection,
} from "@/components/features/author";

export default function AuthorDetailPage() {
  return (
    <section className="flex flex-col">
      <AuthorDetailHeaderSection />
      <AuthorDetailPlaylistSection />
      <AuthorDetailMemoSection />
    </section>
  );
}
