import { User } from "./user";
import { Memo } from "./memo";
import { Post } from "./post";

export type CommentType = "memo" | "post";

export interface Comment {
  id: string;
  type: CommentType;
  user: User;
  content: string;
  createdAt: string;
  memo?: Memo;
  post?: Post;
  isVisible?: boolean;
}
