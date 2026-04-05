import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const pageViewsTable = pgTable("page_views", {
  id: serial("id").primaryKey(),
  path: varchar("path", { length: 500 }).notNull(),
  referrer: text("referrer").default(""),
  userAgent: text("user_agent").default(""),
  ip: varchar("ip", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PageView = typeof pageViewsTable.$inferSelect;
export type InsertPageView = typeof pageViewsTable.$inferInsert;
