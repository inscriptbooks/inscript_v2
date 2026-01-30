import {
  pgTable,
  text,
  varchar,
  integer,
  pgEnum,
  timestamp,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { plays } from "./plays";
import { authors } from "./authors";
import { programs } from "./programs";

export const memoTypeEnum = pgEnum("memo_type", ["play", "author", "program"]);

export const memos = pgTable("memos", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: memoTypeEnum("type").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  likeCount: integer("like_count").default(0).notNull(),
  commentCount: integer("comment_count").default(0).notNull(),
  isVisible: boolean("is_visible").default(true),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  playId: uuid("play_id").references(() => plays.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => authors.id, {
    onDelete: "cascade",
  }),
  programId: uuid("program_id").references(() => programs.id, {
    onDelete: "cascade",
  }),
});
