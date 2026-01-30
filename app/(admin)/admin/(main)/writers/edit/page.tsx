"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import WriterEditForm from "./components/WriterEditForm";

function WriterEditContent() {
  const searchParams = useSearchParams();
  const authorId = searchParams.get("author_id");

  return <WriterEditForm authorId={authorId || undefined} />;
}

export default function WriterEditPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WriterEditContent />
    </Suspense>
  );
}
