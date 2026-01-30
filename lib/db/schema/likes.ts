import { pgTable, pgEnum, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { memos } from "./memos";
import { posts } from "./posts";

export const likeTypeEnum = pgEnum("like_type", ["memo", "post"]);

export const likes = pgTable("likes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  type: likeTypeEnum("type").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  memoId: uuid("memo_id").references(() => memos.id, { onDelete: "cascade" }),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
