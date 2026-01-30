import Image from "next/image";
import Link from "next/link";
import { Post } from "@/models/post";
import { Card, CardContent } from "@/components/ui/card";
import { Comment } from "@/components/icons";
import { formatRelativeTime } from "@/lib/utils";

interface PostPreviewCardProps {
  post: Post;
  targetLink: string;
}

export default function PostPreviewCard({
  post,
  targetLink,
}: PostPreviewCardProps) {
  return (
    <Link href={`/community/${targetLink}/${post.id}`}>
      <Card className="h-full w-full">
        <CardContent className="flex w-full flex-1 flex-col items-start border border-red-3">
          {/* Image */}
          <div className="relative aspect-video w-full">
            <Image
              src={
                post.thumbnailUrl
                  ? post.thumbnailUrl
                  : "/images/noimage.png"
              }
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col items-start gap-1 self-stretch bg-white px-[18px] py-4">
            {/* Title and comment count */}
            <div className="flex items-center justify-between self-stretch">
              <h3 className="line-clamp-1 text-base font-normal leading-6 tracking-[-0.32px] text-gray-1">
                {post.title}
              </h3>
              <div className="flex items-center gap-1">
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
                  {post.user ? post.user.name : ""}
                </span>
              </div>
              <span className="shrink-0 text-sm font-bold leading-4 tracking-[-0.28px] text-primary">
                {formatRelativeTime(post.createdAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
