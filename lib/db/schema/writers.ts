import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const writerRequestStatusEnum = pgEnum("writer_request_status", [
  "pending",
  "approved",
  "rejected",
]);

export const writers = pgTable("writers", {
  id: text("id")
    .primaryKey()
    .references(() => users.id),
  writerName: varchar("writer_name", { length: 255 }).notNull(),
  writerNameEn: varchar("writer_name_en", { length: 255 }),
  genre: varchar("genre", { length: 255 }),
  keyword: jsonb("keyword").default("[]"),
  description: text("description").notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  bookmarkCount: integer("bookmark_count").default(0).notNull(),
  isVisible: boolean("is_visible").default(false).notNull(),
  requestStatus: writerRequestStatusEnum("request_status").notNull(),
});
