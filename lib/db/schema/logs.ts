import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { plays } from "./plays";

export const playLogs = pgTable("play_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  playId: uuid("play_id").references(() => plays.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(),
  eventType: text("event_type").notNull(), // '신청등록', '승인', '반려' 등
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PlayLog = typeof playLogs.$inferSelect;
export type NewPlayLog = typeof playLogs.$inferInsert;
