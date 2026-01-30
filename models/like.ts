import { Memo } from "./memo";
import { Post } from "./post";
import { User } from "./user";

export type LikeType = "memo" | "post";

interface BaseLike {
  id: string;
  type: LikeType;
  user: User;
  createdAt: string;
}

interface MemoLike extends BaseLike {
  type: "memo";
  memo: Memo;
}

interface PostLike extends BaseLike {
  type: "post";
  post: Post;
}

export type Like = MemoLike | PostLike;
