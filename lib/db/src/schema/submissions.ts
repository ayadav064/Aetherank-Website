import { pgTable, varchar, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";

export const submissionsTable = pgTable("submissions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  type: varchar("type", { length: 20 }).notNull(), // contact | audit | proposal
  data: jsonb("data").$type<Record<string, unknown>>().notNull(),
  read: boolean("read").default(false).notNull(),
  ip: varchar("ip", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Submission = typeof submissionsTable.$inferSelect;
export type InsertSubmission = typeof submissionsTable.$inferInsert;
