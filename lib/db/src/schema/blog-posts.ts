import { pgTable, text, varchar, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";

export const blogPostsTable = pgTable("blog_posts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: text("title").notNull(),
  slug: varchar("slug", { length: 300 }).unique().notNull(),
  excerpt: text("excerpt").default(""),
  content: text("content").default(""),
  category: varchar("category", { length: 100 }).default("General"),
  tags: jsonb("tags").$type<string[]>().default([]),
  author: varchar("author", { length: 100 }).default("Aetherank Team"),
  date: varchar("date", { length: 60 }).default(""),
  image: text("image").default(""),
  status: varchar("status", { length: 20 }).default("draft"),
  readTime: varchar("read_time", { length: 30 }).default(""),
  seo: jsonb("seo")
    .$type<{ title: string; description: string; keywords: string; schema: string }>()
    .default({ title: "", description: "", keywords: "", schema: "" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type BlogPost = typeof blogPostsTable.$inferSelect;
export type InsertBlogPost = typeof blogPostsTable.$inferInsert;
