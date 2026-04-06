import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const mediaTable = pgTable("media", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  objectPath: varchar("object_path", { length: 500 }).notNull(),
  contentType: varchar("content_type", { length: 100 }).notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Media = typeof mediaTable.$inferSelect;
export type NewMedia = typeof mediaTable.$inferInsert;
