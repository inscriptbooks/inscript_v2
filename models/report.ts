import { User } from "./user";
import { Memo } from "./memo";
import { Post } from "./post";
import { Comment } from "./comment";

export type ReportType = "memo" | "post" | "comment";

interface BaseReport {
  id: string;
  user: User;
  reason: string;
  createdAt: string;
}

interface MemoReport extends BaseReport {
  type: "memo";
  memo: Memo;
}

interface PostReport extends BaseReport {
  type: "post";
  post: Post;
}

interface CommentReport extends BaseReport {
  type: "comment";
  comment: Comment;
}

export type Report = MemoReport | PostReport | CommentReport;
