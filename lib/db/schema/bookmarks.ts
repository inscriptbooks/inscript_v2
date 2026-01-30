import { pgTable, pgEnum, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { plays } from "./plays";
import { memos } from "./memos";
import { authors } from "./authors";
import { programs } from "./programs";
import { posts } from "./posts";

export const bookmarkTypeEnum = pgEnum("bookmark_type", [
  "play",
  "memo",
  "author",
  "program",
  "post",
]);

export const bookmarks = pgTable("bookmarks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  type: bookmarkTypeEnum("type").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  playId: uuid("play_id").references(() => plays.id, { onDelete: "cascade" }),
  memoId: uuid("memo_id").references(() => memos.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => authors.id, {
    onDelete: "cascade",
  }),
  programId: uuid("program_id").references(() => programs.id, {
    onDelete: "cascade",
  }),
  postId: uuid("post_id").references(() => posts.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
