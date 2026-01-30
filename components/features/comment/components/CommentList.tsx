import { Comment } from "@/models/comment";
import { cn } from "@/lib/utils";
import CommentItem from "./CommentItem";

interface CommentListProps {
  commentList: Comment[];
  className?: string;
  isAnonymous?: boolean;
}

export default function CommentList({
  commentList,
  className,
  isAnonymous = false,
}: CommentListProps) {
  if (!commentList || commentList.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex w-full flex-col items-center gap-6 ", className)}>
      {commentList.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isAnonymous={isAnonymous}
        />
      ))}
    </div>
  );
}
