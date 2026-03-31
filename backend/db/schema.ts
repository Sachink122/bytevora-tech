import { pgTable, text, timestamp, varchar, integer, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: varchar('role', { length: 50 }).notNull().default('Admin'),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const leads = pgTable('leads', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  first_name: text('first_name'),
  last_name: text('last_name'),
  service: text('service'),
  email: text('email').notNull(),
  phone: text('phone'),
  budget: text('budget'),
  project_details: text('project_details'),
  status: varchar('status', { length: 50 }).default('New'),
  created_at: timestamp('created_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  senderName: text('sender_name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('New'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const blogPosts = pgTable('blog_posts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  summary: text('summary'),
  content: text('content'),
  // store images as JSON stringified array to keep compatibility
  images: text('images'),
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const teamMembers = pgTable('team_members', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  role: text('role'),
  email: text('email'),
  phone: text('phone'),
  skills: text('skills'),
  status: varchar('status', { length: 50 }).default('Active'),
  created: timestamp('created').defaultNow(),
});

export const services = pgTable('services', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  summary: text('summary'),
  description: text('description'),
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  category: text('category'),
  description: text('description'),
  image: text('image'),
  projectUrl: text('project_url'),
  tags: text('tags'),
  status: varchar('status', { length: 50 }).default('Published'),
  createdAt: timestamp('created_at').defaultNow(),
});
