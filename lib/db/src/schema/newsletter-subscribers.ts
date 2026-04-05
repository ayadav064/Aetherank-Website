import { pgTable, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

export const newsletterSubscribersTable = pgTable("newsletter_subscribers", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  ip: varchar("ip", { length: 45 }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type NewsletterSubscriber = typeof newsletterSubscribersTable.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribersTable.$inferInsert;
