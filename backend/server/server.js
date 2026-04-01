import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { db } from '../db/index.js'
import { teamMembers, blogPosts, leads } from '../db/schema.js'
import { eq } from 'drizzle-orm'

dotenv.config()

const app = express()
const PORT = Number(process.env.AUTH_API_PORT || 4000)
const JWT_SECRET = process.env.AUTH_JWT_SECRET || 'change-this-secret-in-production'
const REFRESH_SECRET = process.env.AUTH_REFRESH_SECRET || `${JWT_SECRET}-refresh`
const TOKEN_EXPIRY = process.env.AUTH_TOKEN_EXPIRY || '8h'
const REFRESH_EXPIRY = process.env.AUTH_REFRESH_EXPIRY || '7d'
const REFRESH_COOKIE_NAME = process.env.AUTH_REFRESH_COOKIE_NAME || 'agency_refresh_token'
const COOKIE_SECURE = process.env.AUTH_COOKIE_SECURE === 'true'
const ADMIN_EMAIL = process.env.AUTH_ADMIN_EMAIL || 'bytevora1tech@gmail.com'
const ADMIN_PASSWORD = process.env.AUTH_ADMIN_PASSWORD || 'ChangeMe123!'
const ADMIN_NAME = process.env.AUTH_ADMIN_NAME || 'Admin User'
const ADMIN_ROLE = process.env.AUTH_ADMIN_ROLE || 'Admin'

const allowedOrigins = (process.env.AUTH_ALLOWED_ORIGINS || '*')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

const corsOptions = {
  origin: allowedOrigins.includes('*') ? true : allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}

const adminUser = {
  id: '1',
  name: ADMIN_NAME,
  email: ADMIN_EMAIL,
  role: ADMIN_ROLE,
  passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, 10),
}

let currentRefreshToken = null

app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.get('/', (_req, res) => {
  res.json({
    service: 'My Agency Auth API',
    status: 'ok',
    health: '/api/health',
  })
})

function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  )
}

function createRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      type: 'refresh',
    },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRY }
  )
}

function setRefreshCookie(res, refreshToken) {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: COOKIE_SECURE,
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: COOKIE_SECURE,
    path: '/api/auth',
  })
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing authorization token' })
  }

  const token = authHeader.slice('Bearer '.length)

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.auth = payload
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Public: Get all team members
app.get('/api/team', async (_req, res) => {
  try {
    const members = await db.select().from(teamMembers)
    return res.json(members)
  } catch (error) {
    console.error('GET /api/team failed', error)
    return res.status(500).json({ message: 'Failed to fetch team members' })
  }
})

// Public: Get blog posts
app.get('/api/blog-posts', async (_req, res) => {
  try {
    const posts = await db.select().from(blogPosts)
    return res.json(posts)
  } catch (error) {
    console.error('GET /api/blog-posts failed', error)
    return res.status(500).json({ message: 'Failed to fetch blog posts' })
  }
})

// DEBUG: Report DB counts and sample rows (temporary - for diagnostics)
app.get('/api/debug/db-status', async (_req, res) => {
  try {
    const teamCount = await db.select().from(teamMembers).count()
    const teamSample = await db.select({ id: teamMembers.id, name: teamMembers.name, role: teamMembers.role }).from(teamMembers).limit(5)

    const blogCount = await db.select().from(blogPosts).count()
    const blogSample = await db.select({ id: blogPosts.id, title: blogPosts.title, slug: blogPosts.slug, published: blogPosts.published }).from(blogPosts).limit(5)

    return res.json({ teamCount: Number(teamCount[0]?.count || 0), teamSample, blogCount: Number(blogCount[0]?.count || 0), blogSample })
  } catch (err) {
    console.error('/api/debug/db-status failed', err)
    return res.status(500).json({ message: 'DB diagnostics failed', error: String(err?.message) })
  }
})

// Admin: Get blog posts (admin view)
app.get('/api/admin/blog-posts', requireAuth, async (_req, res) => {
  try {
    const posts = await db.select().from(blogPosts)
    return res.json(posts)
  } catch (error) {
    console.error('GET /api/admin/blog-posts failed', error)
    return res.status(500).json({ message: 'Failed to fetch admin blog posts' })
  }
})

// Admin: Create a blog post
app.post('/api/admin/blog-posts', requireAuth, async (req, res) => {
  const payload = req.body || {}
  try {
    const insert = await db.insert(blogPosts).values({
      title: payload.title || null,
      slug: payload.slug || null,
      meta_title: payload.metaTitle || payload.meta_title || null,
      meta_description: payload.metaDescription || payload.meta_description || null,
      summary: payload.summary || null,
      content: payload.content || null,
      images: JSON.stringify(payload.images || []),
      published: !!payload.published,
    }).returning()

    return res.status(201).json(insert?.[0] ?? null)
  } catch (error) {
    console.error('POST /api/admin/blog-posts failed', error?.stack || error)
    return res.status(500).json({ message: 'Failed to save blog post', error: String(error?.message) })
  }
})

// Admin: Sync multiple blog posts (upsert by slug)
app.post('/api/admin/blog-posts/sync', requireAuth, async (req, res) => {
  const posts = Array.isArray(req.body?.posts) ? req.body.posts : []
  try {
    const results = []
    for (const p of posts) {
      if (!p?.slug) continue
      const existing = await db.select().from(blogPosts).where(blogPosts.slug.eq(p.slug))
      if (existing?.length) {
        await db.update(blogPosts).set({
          title: p.title || existing[0].title,
          meta_title: p.metaTitle || p.meta_title || existing[0].meta_title,
          meta_description: p.metaDescription || p.meta_description || existing[0].meta_description,
          summary: p.summary || existing[0].summary,
          content: p.content || existing[0].content,
          images: JSON.stringify(p.images || JSON.parse(existing[0].images || '[]')),
          published: typeof p.published === 'boolean' ? p.published : existing[0].published,
        }).where(blogPosts.slug.eq(p.slug))
        results.push({ slug: p.slug, action: 'updated' })
      } else {
        await db.insert(blogPosts).values({
          title: p.title || null,
          slug: p.slug,
          meta_title: p.metaTitle || p.meta_title || null,
          meta_description: p.metaDescription || p.meta_description || null,
          summary: p.summary || null,
          content: p.content || null,
          images: JSON.stringify(p.images || []),
          published: !!p.published,
        })
        results.push({ slug: p.slug, action: 'inserted' })
      }
    }

    return res.json({ ok: true, results })
  } catch (error) {
    console.error('POST /api/admin/blog-posts/sync failed', error?.stack || error)
    return res.status(500).json({ message: 'Failed to sync blog posts', error: String(error?.message) })
  }
})

// Leads: POST public (save a lead), GET requires auth
app.get('/api/leads', requireAuth, async (_req, res) => {
  try {
    const all = await db.select().from(leads)
    return res.json(all)
  } catch (error) {
    console.error('GET /api/leads failed', error?.stack || error)
    return res.status(500).json({ message: 'Failed to fetch leads' })
  }
})

app.post('/api/leads', async (req, res) => {
  const payload = req.body || {}
  try {
    const insert = await db.insert(leads).values({
      first_name: payload.firstName || payload.first_name || null,
      last_name: payload.lastName || payload.last_name || null,
      email: payload.email || null,
      phone: payload.phone || null,
      service: payload.service || null,
      project_details: payload.project_details || payload.details || null,
    }).returning()

    return res.status(201).json({ lead: insert?.[0] ?? null })
  } catch (error) {
    console.error('POST /api/leads failed', error?.stack || error)
    return res.status(500).json({ message: 'Failed to save lead', error: String(error?.message), stack: error?.stack })
  }
})


// Global error handlers to capture unhandled rejections / exceptions in logs
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason?.stack || reason)
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err?.stack || err)
})

app.post('/api/auth/login', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const password = String(req.body?.password || '')

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const isEmailMatch = email === adminUser.email.toLowerCase()
  const isPasswordMatch = bcrypt.compareSync(password, adminUser.passwordHash)

  if (!isEmailMatch || !isPasswordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const accessToken = createAccessToken(adminUser)
  const refreshToken = createRefreshToken(adminUser)
  currentRefreshToken = refreshToken
  setRefreshCookie(res, refreshToken)
  return res.json({ accessToken, user: sanitizeUser(adminUser) })
})

app.post('/api/auth/refresh', (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME]
  if (!refreshToken || refreshToken !== currentRefreshToken) {
    clearRefreshCookie(res)
    return res.status(401).json({ message: 'Refresh token missing or invalid' })
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET)
    if (payload?.type !== 'refresh') {
      throw new Error('Invalid token type')
    }

    const nextAccessToken = createAccessToken(adminUser)
    const nextRefreshToken = createRefreshToken(adminUser)
    currentRefreshToken = nextRefreshToken
    setRefreshCookie(res, nextRefreshToken)

    return res.json({ accessToken: nextAccessToken, user: sanitizeUser(adminUser) })
  } catch {
    currentRefreshToken = null
    clearRefreshCookie(res)
    return res.status(401).json({ message: 'Refresh token expired' })
  }
})

app.post('/api/auth/logout', (_req, res) => {
  currentRefreshToken = null
  clearRefreshCookie(res)
  return res.status(204).send()
})

app.get('/api/auth/me', requireAuth, (req, res) => {
  if (req.auth?.email?.toLowerCase() !== adminUser.email.toLowerCase()) {
    return res.status(401).json({ message: 'User no longer available' })
  }

  return res.json({ user: sanitizeUser(adminUser) })
})

// Only start the HTTP listener when running locally.
// In serverless environments (Vercel) this module is imported and
// the framework will handle the request lifecycle — don't call listen().
if (process.env.RUN_LOCAL === 'true' || process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Auth API running on http://localhost:${PORT}`)
  })
}

// Export the Express app so serverless platforms (Vercel) can use it.
export default app;
