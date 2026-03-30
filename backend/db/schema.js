// Portfolio Items Table
export const portfolioItems = pgTable('portfolio_items', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  image: text('image'),
  projectUrl: text('project_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
// Site-wide editable content (Home, About, etc.)
export const siteContent = pgTable('site_content', {
  id: serial('id').primaryKey(),
  section: varchar('section', { length: 50 }).notNull().unique(),
  content: text('content').notNull(), // Store as JSON string or plain text
  updatedAt: timestamp('updated_at').defaultNow(),
});
import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: varchar('role', { length: 50 }).notNull().default('Admin'),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  business: text('business'),
  service: text('service'),
  email: text('email').notNull(),
  phone: text('phone'),
  status: varchar('status', { length: 50 }).default('New'),
  priority: varchar('priority', { length: 50 }).default('Medium'),
  date: timestamp('date').defaultNow(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  senderName: text('sender_name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('New'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  topic: text('topic'),
  targetKeyword: text('target_keyword'),
  location: text('location'),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  author: text('author'),
  publishDate: text('publish_date'),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  keywords: text('keywords'),
  featureImage: text('feature_image'),
  imageSuggestions: text('image_suggestions'),
  internalLinks: text('internal_links'),
  summary: text('summary'),
  contentHtml: text('content_html'),
  status: varchar('status', { length: 50 }).default('Draft'),
  createdAt: timestamp('created_at').defaultNow(),
});
