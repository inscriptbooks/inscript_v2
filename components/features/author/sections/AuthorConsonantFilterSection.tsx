"use client";

import { ConsonantFilter } from "@/components/common";
import { useState } from "react";

interface AuthorConsonantFilterSectionProps {
  initialConsonant?: string;
}

export default function AuthorConsonantFilterSection({
  initialConsonant,
}: AuthorConsonantFilterSectionProps) {
  const [selectedConsonant, setSelectedConsonant] = useState(initialConsonant);

  return (
    <section className="flex flex-col gap-8">
      <span className="font-serif text-xl font-bold text-primary lg:text-[28px]">
        작가
      </span>
      <ConsonantFilter
        selectedConsonant={selectedConsonant}
        onConsonantSelect={setSelectedConsonant}
      />
    </section>
  );
}
