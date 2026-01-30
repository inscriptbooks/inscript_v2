import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  pgEnum,
  jsonb,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const authorRequestStatusEnum = pgEnum("author_request_status", [
  "pending",
  "approved",
  "rejected",
]);

export const authors = pgTable("authors", {
  id: uuid("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorNameEn: varchar("author_name_en", { length: 255 }),
  keyword: jsonb("keyword").default("[]"),
  description: text("description").notNull(),
  featuredWork: varchar("featured_work", { length: 500 }).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  bookmarkCount: integer("bookmark_count").default(0).notNull(),
  isVisible: boolean("is_visible").default(false).notNull(),
  requestStatus: authorRequestStatusEnum("request_status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  isDeleted: boolean("is_deleted").default(false),
});
