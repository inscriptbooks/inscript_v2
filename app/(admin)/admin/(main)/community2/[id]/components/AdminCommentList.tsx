import { Comment } from "@/models/comment";
import { cn } from "@/lib/utils";
import AdminCommentItem from "@/app/(admin)/admin/(main)/community2/[id]/components/AdminCommentItem";

interface AdminCommentListProps {
  commentList: Comment[];
  className?: string;
}

export default function AdminCommentList({
  commentList,
  className,
}: AdminCommentListProps) {
  if (!commentList || commentList.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-6 ",
        className,
      )}
    >
      {commentList.map((comment) => (
        <AdminCommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
