"use client";

import { EmptyBox, ViewMoreLinkButton } from "@/components/common";
import { PlayPreviewCard } from "@/components/features/play";
import { useGetPlays } from "@/hooks/plays";
import { useBreakpoint, useLoader } from "@/hooks/common";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useGetAuthor } from "@/hooks/authors";

// FIXME: 페이지네이션 기획 보류
export default function AuthorDetailPlaylistSection() {
  const { authorId } = useParams<{ authorId: string }>();
  const { showLoader, hideLoader } = useLoader();
  const { isAbove } = useBreakpoint();
  const { data: author } = useGetAuthor(authorId);
  const { data: playData, isLoading } = useGetPlays({
    authorId,
    limit: isAbove("xl") ? 5 : 6,
  });

  // const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetPlaysPaginated({
  //   authorId,
  //   limit: isAbove('xl') ? 5 : 6,
  // });

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  if (!author) return null;

  const playList = playData?.plays ?? [];
  // const playList = data?.pages?.flatMap((page) => page.plays) ?? [];

  return (
    <section className="flex w-full flex-col gap-5 px-[20px] pt-11 lg:px-[120px]">
      <div className="flex items-center justify-between">
        <span className="font-serif text-xl font-bold text-gray-1 lg:text-[28px]">
          작가의 작품
        </span>
        <ViewMoreLinkButton href={`/play?keyword=${author.authorName}`} />
      </div>

      {playList.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5 xl:gap-6">
          {playList.map((play) => (
            <PlayPreviewCard key={play.id} play={play} />
          ))}
        </div>
      ) : (
        <EmptyBox text="작품이 없습니다." />
      )}
      {/* {playList.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5 xl:gap-6">
            {playList.map((play) => (
              <PlayPreviewCard key={play.id} play={play} />
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-5 flex justify-center">
              <ShowMoreButton onClick={() => fetchNextPage()} disabled={isFetchingNextPage} />
            </div>
          )}
        </>
      ) : (
        <EmptyBox text="작품이 없습니다." />
      )} */}
    </section>
  );
}
