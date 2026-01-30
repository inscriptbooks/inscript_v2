"use client";

import { Post } from "@/models/post";
import { ShowMoreButton, ViewMoreLinkButton } from "@/components/common/Button";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";
import { Attachment } from "@/components/icons";
import { useRouter } from "next/navigation";

interface CommunityPostListColumnProps {
  title: string;
  posts: Post[];
  viewMoreLink?: string;
  onMoreButtonClick?: () => void;
}

const CommunityPostListColumn = ({
  title,
  posts,
  viewMoreLink,
  onMoreButtonClick,
}: CommunityPostListColumnProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-5">
      {/* Title section with border bottom */}
      <div className="flex justify-between border-b border-red-2 pb-3">
        <h2
          onClick={() => viewMoreLink && router.push(viewMoreLink)}
          className={`text-xl font-bold leading-6 text-primary ${
            viewMoreLink
              ? "cursor-pointer transition-opacity hover:opacity-70"
              : ""
          }`}
        >
          {title}
        </h2>
        {viewMoreLink && (
          <ViewMoreLinkButton href={viewMoreLink} variant="gray" />
        )}
      </div>

      {posts.length > 0 ? (
        <div className="flex flex-col">
          {/* Posts list */}
          {posts.map((post) => {
            // viewMoreLink가 없으면 post.type을 기반으로 링크 생성 (인기글의 경우)
            const postLink = viewMoreLink
              ? `${viewMoreLink}/${post.id}`
              : `/community/${post.type}/${post.id}`;

            return (
              <Link
                key={post.id}
                href={postLink}
                className="flex items-center justify-between py-2.5 transition-colors hover:bg-gray-6/50"
              >
                {/* Left side: title and comment count */}
                <div className="flex max-w-[520px] items-center gap-2.5">
                  {post.attachmentUrl && (
                    <Attachment size={16} className="shrink-0 text-gray-3" />
                  )}
                  <span className="line-clamp-1 text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                    {post.title}
                  </span>
                  {post.commentCount > 0 && (
                    <span className="text-sm font-bold leading-4 tracking-[-0.28px] text-primary">
                      {post.commentCount}
                    </span>
                  )}
                </div>

                {/* Right side: timestamp */}
                <div className="flex w-20 items-center justify-end">
                  <span className="text-right text-sm font-bold leading-4 tracking-[-0.28px] text-gray-3">
                    {formatRelativeTime(post.createdAt)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
            게시글이 없습니다.
          </p>
        </div>
      )}

      {onMoreButtonClick && (
        <ShowMoreButton className="self-center" onClick={onMoreButtonClick} />
      )}
    </div>
  );
};

interface SectionItem {
  title: string;
  posts: Post[];
  viewMoreLink?: string;
  onMoreButtonClick?: () => void;
}

interface CommunityPostListSectionProps {
  list: SectionItem[];
}

export default function CommunityPostListSection({
  list,
}: CommunityPostListSectionProps) {
  return (
    <section className="flex w-full flex-col justify-center gap-11 lg:flex-row">
      {list.map((section) => (
        <CommunityPostListColumn
          key={section.title}
          title={section.title}
          posts={section.posts}
          viewMoreLink={section.viewMoreLink}
          onMoreButtonClick={section.onMoreButtonClick}
        />
      ))}
    </section>
  );
}
