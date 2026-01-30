import { pgTable, varchar, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { programs } from "./programs";
import { users } from "./users";

export const applicationStatusEnum = pgEnum("application_status", [
  "submitted",
  "closed",
  "cancelled",
]);

export const programApplications = pgTable("program_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  programId: uuid("program_id")
    .notNull()
    .references(() => programs.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  status: applicationStatusEnum("status").default("submitted").notNull(),
  agreeTerms: varchar("agree_terms", { length: 10 }).notNull(), // 'true' or 'false'
  agreePrivacy: varchar("agree_privacy", { length: 10 }).notNull(),
  agreeMarketing: varchar("agree_marketing", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
