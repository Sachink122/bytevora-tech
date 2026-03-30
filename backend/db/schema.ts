
import { pgTable, integer, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const teamMembers = pgTable('team_members', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role'),
  email: text('email'),
  phone: text('phone'),
  skills: text('skills'),
  status: varchar('status', { length: 50 }).default('Active'),
  created: timestamp('created').defaultNow(),
});



  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: varchar('role', { length: 50 }).notNull().default('Admin'),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  business: text('business'),
  service: text('service'),
  email: text('email').notNull(),
  phone: text('phone'),
  status: varchar('status', { length: 50 }).default('New'),
  priority: varchar('priority', { length: 50 }).default('Medium'),
  date: timestamp('date').defaultNow(),
});

  id: integer('id').primaryKey(),
  senderName: text('sender_name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('New'),
  createdAt: timestamp('created_at').defaultNow(),
});

  id: integer('id').primaryKey(),
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
