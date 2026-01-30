import { pgTable, text, timestamp, uuid, bigserial } from "drizzle-orm/pg-core";
import { users } from "./users";

export const searchKeywords = pgTable("search_keywords", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  keyword: text("keyword").notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
