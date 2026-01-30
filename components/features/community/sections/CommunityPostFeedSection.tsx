"use client";

import Image from "next/image";
import { ArrowRight, Comment, Attachment } from "@/components/icons";
import { useRouter } from "next/navigation";
import { Post } from "@/models/post";
import { formatRelativeTime } from "@/lib/utils";

interface FeedItem {
  title: string;
  description: string;
  posts: Post[];
  viewMoreLink: string;
}

interface CommunityPostFeedSectionProps {
  feed: FeedItem;
}

export default function CommunityPostFeedSection({
  feed,
}: CommunityPostFeedSectionProps) {
  const router = useRouter();

  return (
    <section className="flex w-full justify-center">
      <div className="flex w-full flex-col gap-[10px]">
        {/* Title section */}
        <div className="flex w-full items-end justify-between border-b border-red-2 py-3">
          <div
            onClick={() => router.push(feed.viewMoreLink)}
            className="flex cursor-pointer flex-col items-start justify-center transition-opacity hover:opacity-70"
          >
            <h2 className="text-xl font-bold leading-6 text-primary">
              {feed.title}
            </h2>
            <p className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              {feed.description}
            </p>
          </div>
          <button
            onClick={() => router.push(feed.viewMoreLink)}
            className="flex items-center gap-1 transition-colors hover:opacity-70"
          >
            <span className="text-right text-base font-normal leading-5 text-gray-4">
              더보기
            </span>
            <ArrowRight size={24} color="#A0A0A0" />
          </button>
        </div>

        {feed.posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 self-stretch md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {/* Posts grid */}
            {feed.posts.map((post) => (
              <div
                key={post.id}
                onClick={() => router.push(`${feed.viewMoreLink}/${post.id}`)}
                className="flex w-full flex-1 cursor-pointer flex-col items-start border border-red-3 transition-all hover:shadow-lg"
              >
                {/* Image */}
                {/* <div className="flex w-full flex-col items-start gap-[10px] self-stretch"> */}
                <div className="relative aspect-video w-full">
                  <Image
                    src={post.thumbnailUrl ?? "/images/noimage.png"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* </div> */}

                {/* Content */}
                <div className="flex flex-col items-start gap-1 self-stretch bg-white px-[18px] py-4">
                  {/* Title and comment count */}
                  <div className="flex items-center justify-between self-stretch">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      {post.attachmentUrl && (
                        <Attachment
                          size={16}
                          className="shrink-0 text-gray-3"
                        />
                      )}
                      <h3 className="line-clamp-1 text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                        {post.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Comment size={24} color="#6D6D6D" />
                      <span className="text-sm font-medium leading-4 text-gray-3">
                        {post.commentCount}
                      </span>
                    </div>
                  </div>

                  {/* Author and timestamp */}
                  <div className="flex items-center justify-between self-stretch">
                    <div className="flex items-center gap-1.5">
                      <div className="h-5 w-5 rounded-full bg-gray-5" />
                      <span className="line-clamp-1 text-sm font-medium leading-4 text-gray-3">
                        {post.user.name}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm font-bold leading-4 tracking-[-0.28px] text-primary">
                      {formatRelativeTime(post.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-base font-normal leading-6 tracking-[-0.32px] text-gray-2">
              게시글이 없습니다.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
