import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  pgEnum,
  jsonb,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { authors } from "./authors";

export const applyStatusEnum = pgEnum("apply_status", [
  "applied",
  "review",
  "accepted",
  "rejected",
]);
export const publicStatusEnum = pgEnum("public_status", [
  "published",
  "unpublished",
  "outOfPrint",
]);

// 구매 여부 enum (KO)
export const salesStatusEnum = pgEnum("sales_status", ["판매함", "판매 안 함"]);

export const plays = pgTable("plays", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  bookmarkCount: integer("bookmark_count").default(0).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  authorId: uuid("author_id").references(() => authors.id, {
    onDelete: "cascade",
  }),
  summary: text("summary").notNull(),
  keyword: jsonb("keyword").default("[]"),
  isVisible: boolean("is_visible").default(false).notNull(),
  line1: text("line1"),
  line2: text("line2"),
  line3: text("line3"),
  year: varchar("year", { length: 4 }),
  country: varchar("country", { length: 255 }),
  femaleCharacterCount: varchar("female_character_count", { length: 255 }),
  maleCharacterCount: varchar("male_character_count", { length: 255 }),
  characterList: jsonb("character_list").default("[]"),
  publicHistory: text("public_history"),
  publicStatus: publicStatusEnum("public_status"),
  // 판매 관련 컬럼
  salesStatus: salesStatusEnum("sales_status"),
  price: integer("price"),
  attachmentUrl: text("attachment_url"),
  attachmentName: text("attachment_name"),
  attachmentPath: text("attachment_path"),
  applyStatus: applyStatusEnum("apply_status").notNull(),
  rejectionReason: text("rejection_reason"),
  isDeleted: boolean("is_deleted").default(false),
});
