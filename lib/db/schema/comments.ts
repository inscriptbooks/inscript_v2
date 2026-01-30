import { pgTable, text, uuid, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";
import { memos } from "./memos";
import { posts } from "./posts";

export const commentTypeEnum = pgEnum("comment_type", ["memo", "post"]);

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: commentTypeEnum("type").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // Separate foreign keys with CASCADE delete
  memoId: uuid("memo_id").references(() => memos.id, { onDelete: "cascade" }),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isVisible: boolean("is_visible").default(true),
});
