import { teamMembers } from '../db/schema.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { db } from '../db/index.js';
import { users, leads, messages, blogPosts, portfolioItems, siteContent } from '../db/schema.js';
import { eq } from 'drizzle-orm';

dotenv.config();

const app = express();
const PORT = Number(process.env.AUTH_API_PORT || 4000);
const JWT_SECRET = process.env.AUTH_JWT_SECRET || 'change-this-secret-in-production';
const REFRESH_SECRET = process.env.AUTH_REFRESH_SECRET || `${JWT_SECRET}-refresh`;
const TOKEN_EXPIRY = process.env.AUTH_TOKEN_EXPIRY || '8h';
const REFRESH_EXPIRY = process.env.AUTH_REFRESH_EXPIRY || '7d';
const REFRESH_COOKIE_NAME = process.env.AUTH_REFRESH_COOKIE_NAME || 'agency_refresh_token';
const ACCESS_COOKIE_NAME = process.env.AUTH_ACCESS_COOKIE_NAME || 'agency_access_token';
const COOKIE_SECURE = process.env.AUTH_COOKIE_SECURE === 'true';
const ADMIN_EMAIL = process.env.AUTH_ADMIN_EMAIL || 'bytevora1tech@gmail.com';
const LEGACY_ADMIN_EMAIL = process.env.AUTH_LEGACY_ADMIN_EMAIL || 'admin@bytevora.in';
const ADMIN_PASSWORD = process.env.AUTH_ADMIN_PASSWORD || 'ChangeMe123!';
const ADMIN_NAME = process.env.AUTH_ADMIN_NAME || 'Admin User';
const ADMIN_ROLE = process.env.AUTH_ADMIN_ROLE || 'Admin';

// --- Team Members Endpoints ---
// Public: Get all team members
app.get('/api/team', async (_req, res) => {
	try {
		const members = await db.select().from(teamMembers);
		res.json({ members });
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch team members' });
	}
});

// requireAuth is provided by server.js; admin routes should use it via import in server.js

// Admin: Add a new team member
app.post('/api/admin/team', requireAuth, async (req, res) => {
	const { name, role, email, phone, skills, status } = req.body;
	if (!name) return res.status(400).json({ message: 'Name is required' });
	try {
		const [member] = await db.insert(teamMembers).values({ name, role, email, phone, skills, status }).returning();
		res.status(201).json({ member });
	} catch (error) {
		res.status(500).json({ message: 'Failed to add team member' });
	}
});

// Admin: Edit a team member
app.put('/api/admin/team/:id', requireAuth, async (req, res) => {
	const id = Number(req.params.id);
	const { name, role, email, phone, skills, status } = req.body;
	if (!name) return res.status(400).json({ message: 'Name is required' });
	try {
		await db.update(teamMembers)
			.set({ name, role, email, phone, skills, status })
			.where(teamMembers.id.eq(id));
		res.json({ message: 'Team member updated' });
	} catch (error) {
		res.status(500).json({ message: 'Failed to update team member' });
	}
});

// Admin: Delete a team member
app.delete('/api/admin/team/:id', requireAuth, async (req, res) => {
	const id = Number(req.params.id);
	try {
		await db.delete(teamMembers).where(teamMembers.id.eq(id));
		res.json({ message: 'Team member deleted' });
	} catch (error) {
		res.status(500).json({ message: 'Failed to delete team member' });
	}
});

// ...rest of your server code (portfolio, auth, etc.)...
