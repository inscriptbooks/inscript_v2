"use client";

import { useEffect } from "react";
import { MainMemoCarousel } from "../components";
import { useGetMemos } from "@/hooks/memos/queries";
import { useLoader } from "@/hooks/common";

export default function MainMemoSection() {
  const { data, isLoading } = useGetMemos({
    limit: 10,
  });
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  const memoList = data?.memos ?? [];

  return (
    <section className="full-bleed flex flex-col justify-center bg-[#F8F1EA]">
      <div className="bg-primary">
        <div className="mx-auto flex h-[293px] lg:h-[270px] w-full max-w-[1440px] flex-col justify-center gap-3 px-[20px] pb-[120px] md:pb-[185px] xl:pb-[80px] mb:pt-[60px] pt-20 lg:flex-row lg:items-center lg:justify-between lg:px-[120px]">
          <div className="flex flex-col gap-[10px]">
            <h2 className="font-serif text-2xl font-bold text-white">
              지금 뜨는 메모
            </h2>
            <p className="text-white">
              다른 유저가 남기고 간 메모를 발견해보세요
            </p>
          </div>
          <span className="font-serif text-[24px] lg:text-[44px] font-bold leading-[130%] text-orange-1">
            Memo
          </span>
        </div>
      </div>

      <div className="relative flex h-[309px] w-full pb-9 lg:h-[329px]">
        {memoList.length > 0 && <MainMemoCarousel memoList={memoList} />}
      </div>
    </section>
  );
}
