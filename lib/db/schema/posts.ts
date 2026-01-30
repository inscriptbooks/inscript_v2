import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type", { length: 50 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  commentCount: integer("comment_count").default(0).notNull(),
  likeCount: integer("like_count").default(0).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  thumbnailUrl: text("thumbnail_url"),
  attachmentUrl: text("attachment_url"),
  attachmentName: text("attachment_name"),
  isVisible: boolean("is_visible").default(true).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
});
