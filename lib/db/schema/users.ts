import {
  pgTable,
  text,
  varchar,
  timestamp,
  pgEnum,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "user", "author"]);
export const authProviderEnum = pgEnum("auth_provider", [
  "google",
  "kakao",
  "local",
]);
export const userStatusEnum = pgEnum("user_status", [
  "active",
  "suspended",
  "blacklist",
]);

export const users = pgTable("users", {
  role: userRoleEnum("role").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  authProvider: authProviderEnum("auth_provider").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: userStatusEnum("status").notNull(),
  thumbnail: text("thumbnail"),
  id: uuid("id").primaryKey().defaultRandom(),
  phone: text("phone"),
  lastLogin: timestamp("last_login", { withTimezone: true }),
  membership: boolean("membership").default(false),
  adminMemo: text("admin_memo"),
  adminKind: text("admin_kind"),
});
