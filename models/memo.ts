import { Play } from "./play";
import { Author } from "./author";
import { Program } from "./program";
import { User } from "./user";

export type MemoType = "play" | "author" | "program";

interface BaseMemo {
  id: string;
  type: MemoType;
  user: User;
  title?: string;
  content: string;
  likeCount: number;
  commentCount: number;
  isVisible?: boolean;
  createdAt: string;
}

interface PlayMemo extends BaseMemo {
  type: "play";
  play: Play;
}

interface AuthorMemo extends BaseMemo {
  type: "author";
  author: Author;
}

interface ProgramMemo extends BaseMemo {
  type: "program";
  program: Program;
}

export type Memo = PlayMemo | AuthorMemo | ProgramMemo;
