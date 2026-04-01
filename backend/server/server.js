import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import pg from 'pg'
import { db } from '../db/index.js'
import { teamMembers, blogPosts, leads } from '../db/schema.js'
import { eq } from 'drizzle-orm'

dotenv.config()

// Temporary in-memory store for last admin error (for debugging only)
let lastAdminError = null
// Temporary store for last admin POST attempt (headers + payload snippet)
let lastAdminAttempt = null

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
app.get('/api/blog-posts', async (req, res) => {
  try {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_POSTGRES_URL
    const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } })
    await client.connect()
    const result = await client.query(`
      SELECT id, title, slug, content, meta_title, meta_description, summary, images, published, created_at
      FROM blog_posts
      ORDER BY created_at DESC
    `)
    await client.end()

    const rows = (result && result.rows) ? result.rows : []
    const out = rows.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      metaTitle: r.meta_title || null,
      metaDescription: r.meta_description || null,
      summary: r.summary || null,
      content: r.content || null,
      contentHtml: r.content || null,
      images: (() => { try { return JSON.parse(r.images || '[]') } catch { return [] } })(),
      featureImage: (() => { try { const imgs = JSON.parse(r.images || '[]'); return imgs && imgs.length ? imgs[0] : null } catch { return null } })(),
      published: !!r.published,
      status: r.published ? 'Published' : 'Draft',
      publishDate: r.created_at || null,
      createdAt: r.created_at || null,
    }))

    return res.json(out)
  } catch (error) {
    console.error('GET /api/blog-posts failed (pg client)', error)
    return res.status(500).json({ message: 'Failed to fetch blog posts' })
  }
})

// DEBUG: Report DB counts and sample rows (temporary - for diagnostics)
app.get('/api/debug/db-status', async (_req, res) => {
  try {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_POSTGRES_URL
    const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } })
    await client.connect()
    const tCount = await client.query('SELECT COUNT(*) AS cnt FROM team_members')
    const tSample = await client.query('SELECT id, name, role, email, status FROM team_members ORDER BY id LIMIT 5')
    const bCount = await client.query('SELECT COUNT(*) AS cnt FROM blog_posts')
    const bSample = await client.query('SELECT id, title, slug, published FROM blog_posts ORDER BY id LIMIT 5')
    await client.end()

    return res.json({ teamCount: Number(tCount.rows[0]?.cnt || 0), teamSample: tSample.rows, blogCount: Number(bCount.rows[0]?.cnt || 0), blogSample: bSample.rows })
  } catch (err) {
    console.error('/api/debug/db-status failed', err)
    return res.status(500).json({ message: 'DB diagnostics failed', error: String(err?.message) })
  }
})

// DEBUG: Run raw blog_posts query to capture runtime errors (temporary)
app.get('/api/debug/blog-raw', async (_req, res) => {
  try {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_POSTGRES_URL
    const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } })
    await client.connect()
    const rows = await client.query('SELECT * FROM blog_posts WHERE published = true')
    await client.end()
    return res.json({ ok: true, rows: rows.rows })
  } catch (err) {
    console.error('/api/debug/blog-raw failed', err)
    return res.status(500).json({ message: 'Raw blog query failed', error: String(err?.message), stack: err?.stack })
  }
})

// Debug: expose last admin error (temporary)
app.get('/api/debug/last-admin-error', (_req, res) => {
  return res.json({ lastAdminError })
})

// Debug: expose last admin attempt (temporary)
app.get('/api/debug/last-admin-attempt', (_req, res) => {
  return res.json({ lastAdminAttempt })
})

// Backwards-compat: redirect admin GET requests to the unified public endpoints
app.get('/api/admin/blog-posts', (_req, res) => {
  return res.redirect(307, '/api/blog-posts')
})

// Backwards-compat: admin team -> public team
app.get('/api/admin/team', (_req, res) => {
  return res.redirect(307, '/api/team')
})

// Admin: Add a new team member (API-backed)
app.post('/api/admin/team', requireAuth, async (req, res) => {
  const { name, role, email, phone, skills, status } = req.body || {}
  if (!name) return res.status(400).json({ message: 'Name is required' })
  try {
    const insert = await db.insert(teamMembers).values({ name, role, email, phone, skills, status }).returning()
    const member = insert?.[0] || null
    return res.status(201).json({ member })
  } catch (err) {
    console.error('POST /api/admin/team failed', err)
    return res.status(500).json({ message: 'Failed to add team member', error: String(err?.message) })
  }
})

// Admin: Update a team member
app.put('/api/admin/team/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id)
  const { name, role, email, phone, skills, status } = req.body || {}
  if (!name) return res.status(400).json({ message: 'Name is required' })
  try {
    await db.update(teamMembers).set({ name, role, email, phone, skills, status }).where(eq(teamMembers.id, id))
    const rows = await db.select().from(teamMembers).where(eq(teamMembers.id, id))
    return res.json({ member: rows?.[0] || null })
  } catch (err) {
    console.error('PUT /api/admin/team/:id failed', err)
    return res.status(500).json({ message: 'Failed to update team member', error: String(err?.message) })
  }
})

// Admin: Delete a team member
app.delete('/api/admin/team/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id)
  try {
    await db.delete(teamMembers).where(eq(teamMembers.id, id))
    return res.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/admin/team/:id failed', err)
    return res.status(500).json({ message: 'Failed to delete team member', error: String(err?.message) })
  }
})

// Admin: Create a blog post
app.post('/api/admin/blog-posts', requireAuth, async (req, res) => {
  const payload = req.body || {}
  try {
    lastAdminAttempt = {
      time: new Date().toISOString(),
      authHeaderPresent: !!req.headers.authorization,
      payloadSnippet: (() => { try { return JSON.stringify(payload).slice(0, 2000) } catch { return null } })(),
    }
  } catch (_) {}
  try {
    console.log('/api/admin/blog-posts called. authHeaderPresent=', !!req.headers.authorization, 'payloadKeys=', Object.keys(payload))

    // Basic sanitization and validation for slug to avoid SQL/driver issues
    const rawSlug = String(payload.slug || '').trim()
    // remove characters that commonly break SQL/URLs (quotes, semicolons)
    const sanitizedSlug = rawSlug.replace(/["'`;\\]/g, '') || null
    // fallback: generate a simple slug from title if not provided
    const makeSlugFromTitle = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
    const finalSlug = sanitizedSlug || makeSlugFromTitle(payload.title) || null

    const published = payload.published === true || String(payload.status || '').toLowerCase() === 'published'
    const insert = await db.insert(blogPosts).values({
      title: payload.title || null,
      slug: finalSlug,
      metaTitle: payload.metaTitle || payload.meta_title || null,
      metaDescription: payload.metaDescription || payload.meta_description || null,
      summary: payload.summary || null,
      content: payload.content || null,
      images: JSON.stringify(payload.images || []),
      published: published,
    }).returning()

    const r = insert?.[0]
    const out = r
      ? {
          id: r.id,
          title: r.title,
          slug: r.slug,
          metaTitle: r.meta_title || r.metaTitle || null,
          metaDescription: r.meta_description || r.metaDescription || null,
          summary: r.summary,
          content: r.content,
          contentHtml: r.content,
          images: (() => {
            try {
              return JSON.parse(r.images || '[]')
            } catch {
              return []
            }
          })(),
          featureImage: (() => {
            try {
              const imgs = JSON.parse(r.images || '[]')
              return imgs && imgs.length ? imgs[0] : null
            } catch {
              return null
            }
          })(),
          published: !!r.published,
          status: r.status || (r.published ? 'Published' : 'Draft'),
          publishDate: r.publish_date || r.created_at,
          createdAt: r.created_at,
        }
      : null

    return res.status(201).json(out)
  } catch (error) {
    console.error('POST /api/admin/blog-posts failed', error?.stack || error)
    try {
      lastAdminError = {
        time: new Date().toISOString(),
        route: '/api/admin/blog-posts',
        message: String(error?.message),
        stack: error?.stack || null,
        authHeaderPresent: !!req.headers.authorization,
        payloadSnippet: (() => {
          try { return JSON.stringify(req.body).slice(0, 1000) } catch { return null }
        })(),
      }
    } catch (_) {}

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
      const existing = await db.select().from(blogPosts).where(eq(blogPosts.slug, p.slug))
      if (existing?.length) {
        await db.update(blogPosts).set({
          title: p.title || existing[0].title,
          metaTitle: p.metaTitle || p.meta_title || existing[0].metaTitle || existing[0].meta_title,
          metaDescription: p.metaDescription || p.meta_description || existing[0].metaDescription || existing[0].meta_description,
          summary: p.summary || existing[0].summary,
          content: p.content || existing[0].content,
          images: JSON.stringify(p.images || JSON.parse(existing[0].images || '[]')),
          published: typeof p.published === 'boolean' ? p.published : existing[0].published,
        }).where(eq(blogPosts.slug, p.slug))
        results.push({ slug: p.slug, action: 'updated' })
      } else {
        await db.insert(blogPosts).values({
          title: p.title || null,
          slug: p.slug,
          metaTitle: p.metaTitle || p.meta_title || null,
          metaDescription: p.metaDescription || p.meta_description || null,
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

// Admin: One-time seed defaults (protected) — inserts sample team members and blog posts
app.post('/api/admin/seed-defaults', requireAuth, async (_req, res) => {
  try {
    const teamMembersData = [
      { name: 'Sachin Gautam', role: 'Founder / Developer', email: 'bytevora1tech@gmail.com', skills: 'React, Node.js, SEO', phone: null, status: 'Active' },
      { name: 'John Doe', role: 'Senior Developer', email: 'john.doe@example.com', skills: 'React, TypeScript, Node.js', phone: null, status: 'Active' },
      { name: 'Jane Smith', role: 'Designer', email: 'jane.smith@example.com', skills: 'Figma, UI/UX, CSS', phone: null, status: 'Active' },
    ]

    const blogPostsData = [
      { title: 'Launching Our New Agency Website', slug: 'launching-our-new-agency-website', meta_title: 'Launching Our New Agency Website', meta_description: 'Announcing our new site and services', summary: 'We just launched...', content: '<h1>Welcome</h1><p>We launched our new website to showcase our work.</p>', images: JSON.stringify([]), published: true },
      { title: 'How We Approach SEO', slug: 'how-we-approach-seo', meta_title: 'How We Approach SEO', meta_description: 'Our SEO philosophy and tips', summary: 'SEO basics...', content: '<h1>SEO Strategy</h1><p>We focus on technical SEO and content.</p>', images: JSON.stringify([]), published: true },
    ]

    for (const t of teamMembersData) {
      const exists = await db.select().from(teamMembers).where(eq(teamMembers.email, t.email))
      if (!exists?.length) {
        await db.insert(teamMembers).values(t)
      }
    }

    for (const b of blogPostsData) {
      const exists = await db.select().from(blogPosts).where(eq(blogPosts.slug, b.slug))
      if (!exists?.length) {
        await db.insert(blogPosts).values(b)
      }
    }

    return res.json({ ok: true })
  } catch (err) {
    console.error('/api/admin/seed-defaults failed', err)
    return res.status(500).json({ message: 'Seeding failed', error: String(err?.message) })
  }
})

// Leads: POST public (save a lead), GET requires auth
app.get('/api/leads', requireAuth, async (_req, res) => {
  try {
    const rows = await db.select().from(leads)
    const all = (rows || []).map((r) => ({
      id: r.id,
      firstName: r.first_name || null,
      lastName: r.last_name || null,
      email: r.email,
      phone: r.phone,
      service: r.service,
      budget: r.budget,
      projectDetails: r.project_details || null,
      status: r.status,
      createdAt: r.created_at || r.createdAt,
    }))
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
      project_details: payload.projectDetails || payload.project_details || payload.details || null,
      budget: payload.budget || null,
    }).returning()

    const r = insert?.[0]
    const lead = r ? {
      id: r.id,
      firstName: r.first_name,
      lastName: r.last_name,
      email: r.email,
      phone: r.phone,
      service: r.service,
      budget: r.budget,
      projectDetails: r.project_details,
      status: r.status,
      createdAt: r.created_at,
    } : null

    return res.status(201).json({ lead })
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
