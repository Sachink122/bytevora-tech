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
