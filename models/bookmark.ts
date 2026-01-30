import { Play } from "./play";
import { Memo } from "./memo";
import { Author } from "./author";
import { Program } from "./program";
import { Post } from "./post";
import { User } from "./user";

export type BookmarkType = "play" | "memo" | "author" | "program" | "post";

export interface PlayBookmark {
  id: string;
  type: "play";
  user: User;
  play: Play;
  createdAt: string;
}

export interface MemoBookmark {
  id: string;
  type: "memo";
  user: User;
  memo: Memo;
  createdAt: string;
}

export interface AuthorBookmark {
  id: string;
  type: "author";
  user: User;
  author: Author;
  createdAt: string;
}

export interface ProgramBookmark {
  id: string;
  type: "program";
  user: User;
  program: Program;
  createdAt: string;
}

export interface PostBookmark {
  id: string;
  type: "post";
  user: User;
  post: Post;
  createdAt: string;
}

export type Bookmark =
  | PlayBookmark
  | MemoBookmark
  | AuthorBookmark
  | ProgramBookmark
  | PostBookmark;
