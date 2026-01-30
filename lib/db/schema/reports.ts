import { pgTable, text, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";
import { memos } from "./memos";
import { posts } from "./posts";
import { comments } from "./comments";

export const reportTypeEnum = pgEnum("report_type", [
  "memo",
  "post",
  "comment",
]);

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: reportTypeEnum("type").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // Separate foreign keys with CASCADE delete
  memoId: uuid("memo_id").references(() => memos.id, { onDelete: "cascade" }),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  commentId: uuid("comment_id").references(() => comments.id, {
    onDelete: "cascade",
  }),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
