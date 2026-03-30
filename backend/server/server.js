import { teamMembers } from '../db/schema.js'
// --- Team Members Endpoints ---

// Public: Get all team members
app.get('/api/team', async (_req, res) => {
  try {
    const members = await db.select().from(teamMembers)
    res.json({ members })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch team members' })
  }
})

// Admin: Add a new team member
app.post('/api/admin/team', requireAuth, async (req, res) => {
  const { name, role, email, phone, skills, status } = req.body
  if (!name) return res.status(400).json({ message: 'Name is required' })
  try {
    const [member] = await db.insert(teamMembers).values({ name, role, email, phone, skills, status }).returning()
    res.status(201).json({ member })
  } catch (error) {
    res.status(500).json({ message: 'Failed to add team member' })
  }
})

// Admin: Edit a team member
app.put('/api/admin/team/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id)
  const { name, role, email, phone, skills, status } = req.body
  if (!name) return res.status(400).json({ message: 'Name is required' })
  try {
    await db.update(teamMembers)
      .set({ name, role, email, phone, skills, status })
      .where(teamMembers.id.eq(id))
    res.json({ message: 'Team member updated' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to update team member' })
  }
})

// Admin: Delete a team member
app.delete('/api/admin/team/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id)
  try {
    await db.delete(teamMembers).where(teamMembers.id.eq(id))
    res.json({ message: 'Team member deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete team member' })
  }
})
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { db } from '../db/index.js'
import { users, leads, messages, blogPosts, portfolioItems, siteContent } from '../db/schema.js'
import { eq } from 'drizzle-orm'

dotenv.config()

const app = express()
const PORT = Number(process.env.AUTH_API_PORT || 4000)
const JWT_SECRET = process.env.AUTH_JWT_SECRET || 'change-this-secret-in-production'
const REFRESH_SECRET = process.env.AUTH_REFRESH_SECRET || `${JWT_SECRET}-refresh`
const TOKEN_EXPIRY = process.env.AUTH_TOKEN_EXPIRY || '8h'
const REFRESH_EXPIRY = process.env.AUTH_REFRESH_EXPIRY || '7d'
const REFRESH_COOKIE_NAME = process.env.AUTH_REFRESH_COOKIE_NAME || 'agency_refresh_token'
const ACCESS_COOKIE_NAME = process.env.AUTH_ACCESS_COOKIE_NAME || 'agency_access_token'
const COOKIE_SECURE = process.env.AUTH_COOKIE_SECURE === 'true'
const ADMIN_EMAIL = process.env.AUTH_ADMIN_EMAIL || 'bytevora1tech@gmail.com'
const LEGACY_ADMIN_EMAIL = process.env.AUTH_LEGACY_ADMIN_EMAIL || 'admin@bytevora.in'
const ADMIN_PASSWORD = process.env.AUTH_ADMIN_PASSWORD || 'ChangeMe123!'
const ADMIN_NAME = process.env.AUTH_ADMIN_NAME || 'Admin User'
const ADMIN_ROLE = process.env.AUTH_ADMIN_ROLE || 'Admin'

// --- Portfolio Items Endpoints ---

// Public: Get all portfolio items
app.get('/api/portfolio', async (_req, res) => {
  try {
    const items = await db.select().from(portfolioItems).orderBy(portfolioItems.createdAt.desc())
    res.json({ items })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch portfolio items' })
  }
})

// Admin: Get all portfolio items
app.get('/api/admin/portfolio', requireAuth, async (_req, res) => {
  try {
    const items = await db.select().from(portfolioItems).orderBy(portfolioItems.createdAt.desc())
    res.json({ items })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch portfolio items' })
  }
})

// Admin: Create portfolio item
app.post('/api/admin/portfolio', requireAuth, async (req, res) => {
  const { title, category, image, projectUrl } = req.body
  if (!title || !category) return res.status(400).json({ message: 'Title and category are required' })
  try {
    const [item] = await db.insert(portfolioItems).values({ title, category, image, projectUrl }).returning()
    res.status(201).json({ item })
  } catch (error) {
    res.status(500).json({ message: 'Failed to create portfolio item' })
  }
})

// Admin: Update portfolio item
app.put('/api/admin/portfolio/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id)
  const { title, category, image, projectUrl } = req.body
  if (!title || !category) return res.status(400).json({ message: 'Title and category are required' })
  try {
    await db.update(portfolioItems)
      .set({ title, category, image, projectUrl, updatedAt: new Date() })
      .where(portfolioItems.id.eq(id))
    res.json({ message: 'Portfolio item updated' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to update portfolio item' })
  }
})

// Admin: Delete portfolio item
app.delete('/api/admin/portfolio/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id)
  try {
    await db.delete(portfolioItems).where(portfolioItems.id.eq(id))
    res.json({ message: 'Portfolio item deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete portfolio item' })
  }
})
// --- Site Content Endpoints (About section) ---

// Public fetch
app.get('/api/content/about', async (_req, res) => {
  try {
    const [row] = await db.select().from(siteContent).where(siteContent.section.eq('about'))
    if (!row) return res.json({ content: '' })
    return res.json({ content: row.content })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch about content' })
  }
})

// Admin fetch
app.get('/api/admin/content/about', requireAuth, async (_req, res) => {
  try {
    const [row] = await db.select().from(siteContent).where(siteContent.section.eq('about'))
    if (!row) return res.json({ content: '' })
    return res.json({ content: row.content })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch about content' })
  }
})

// Admin update
app.post('/api/admin/content/about', requireAuth, async (req, res) => {
  const content = String(req.body?.content || '')
  if (!content) return res.status(400).json({ message: 'Content required' })
  try {
    // Upsert
    await db.delete(siteContent).where(siteContent.section.eq('about'))
    await db.insert(siteContent).values({ section: 'about', content })
    return res.json({ message: 'About content updated' })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update about content' })
  }
})
// Duplicate import removed: siteContent is already imported above
// --- Site Content Endpoints (Home as example) ---

// Public fetch
app.get('/api/content/home', async (_req, res) => {
  try {
    const [row] = await db.select().from(siteContent).where(siteContent.section.eq('home'))
    if (!row) return res.json({ content: '' })
    return res.json({ content: row.content })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch home content' })
  }
})

// Admin fetch
app.get('/api/admin/content/home', requireAuth, async (_req, res) => {
  try {
    const [row] = await db.select().from(siteContent).where(siteContent.section.eq('home'))
    if (!row) return res.json({ content: '' })
    return res.json({ content: row.content })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch home content' })
  }
})

// Admin update
app.post('/api/admin/content/home', requireAuth, async (req, res) => {
  const content = String(req.body?.content || '')
  if (!content) return res.status(400).json({ message: 'Content required' })
  try {
    // Upsert
    await db.delete(siteContent).where(siteContent.section.eq('home'))
    await db.insert(siteContent).values({ section: 'home', content })
    return res.json({ message: 'Home content updated' })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update home content' })
  }
})
// Duplicate imports and initialization removed
// Duplicate constants removed
// Removed stray .split(',') chain; ensure allowedOrigins is defined properly below if needed

const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
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
let blogPostsFallback = []

const adminEmails = [ADMIN_EMAIL, LEGACY_ADMIN_EMAIL]
  .map((email) => String(email || '').trim().toLowerCase())
  .filter(Boolean)

const isAdminEmail = (email) => adminEmails.includes(String(email || '').trim().toLowerCase())

app.use(helmet({
  contentSecurityPolicy: false,
}))
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

function setAccessCookie(res, accessToken) {
  res.cookie(ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: COOKIE_SECURE,
    path: '/api',
    maxAge: 8 * 60 * 60 * 1000,
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

function clearAccessCookie(res) {
  res.clearCookie(ACCESS_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: COOKIE_SECURE,
    path: '/api',
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
  const bearerToken = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : ''
  const cookieToken = String(req.cookies?.[ACCESS_COOKIE_NAME] || '')
  const bodyToken = String(req.body?.accessToken || '')
  const queryToken = String(req.query?.accessToken || '')
  const token = bearerToken || cookieToken || bodyToken || queryToken

  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.auth = payload
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}


app.get('/api/health', async (_req, res) => {
  try {
    // Try a simple DB query (select 1 from users or blogPosts)
    await db.select().from(users).limit(1)
    res.json({ status: 'ok', db: 'ok' })
  } catch (error) {
    res.json({ status: 'ok', db: 'error', error: error.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const password = String(req.body?.password || '')

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    const [dbUser] = await db.select().from(users).where(eq(users.email, email))
    
    let targetUser = null
    let isPasswordMatch = false

    if (dbUser) {
      targetUser = dbUser
      isPasswordMatch = bcrypt.compareSync(password, dbUser.passwordHash)
    } else {
      const isEmailMatch = isAdminEmail(email)
      isPasswordMatch = bcrypt.compareSync(password, adminUser.passwordHash)
      if (isEmailMatch && isPasswordMatch) {
        targetUser = {
          ...adminUser,
          email,
        }
      }
    }

    if (!targetUser || !isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const accessToken = createAccessToken(targetUser)
    const refreshToken = createRefreshToken(targetUser)
    currentRefreshToken = refreshToken
    setRefreshCookie(res, refreshToken)
    setAccessCookie(res, accessToken)
    return res.json({ accessToken, user: sanitizeUser(targetUser) })
  } catch (error) {
    const isEmailMatch = isAdminEmail(email)
    const isPwMatch = bcrypt.compareSync(password, adminUser.passwordHash)
    if (isEmailMatch && isPwMatch) {
      const fallbackAdmin = {
        ...adminUser,
        email,
      }
      const accessToken = createAccessToken(fallbackAdmin)
      const refreshToken = createRefreshToken(fallbackAdmin)
      currentRefreshToken = refreshToken
      setRefreshCookie(res, refreshToken)
      setAccessCookie(res, accessToken)
      return res.json({ accessToken, user: sanitizeUser(fallbackAdmin) })
    }
    return res.status(401).json({ message: 'Invalid credentials' })
  }
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
    setAccessCookie(res, nextAccessToken)

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
  clearAccessCookie(res)
  return res.status(204).send()
})

app.get('/api/auth/me', requireAuth, (req, res) => {
  if (!isAdminEmail(req.auth?.email)) {
    return res.status(401).json({ message: 'User no longer available' })
  }

  return res.json({
    user: sanitizeUser({
      ...adminUser,
      email: String(req.auth?.email || adminUser.email),
    }),
  })
})

app.post('/api/leads', async (req, res) => {
  const leadData = req.body
  try {
    const [newLead] = await db.insert(leads).values({
      name: leadData.name,
      business: leadData.business,
      service: leadData.service,
      email: leadData.email,
      phone: leadData.phone,
      status: leadData.status || 'New',
      priority: leadData.priority || 'Medium',
    }).returning()
    return res.status(201).json({ message: 'Lead application received', lead: newLead })
  } catch (error) {
    return res.status(201).json({ message: 'Received (Local Only)', lead: leadData })
  }
})

app.get('/api/leads', requireAuth, async (req, res) => {
  try {
    const allLeads = await db.select().from(leads)
    return res.json(allLeads)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch leads' })
  }
})

app.post('/api/messages', async (req, res) => {
  const msgData = req.body
  try {
    const [newMsg] = await db.insert(messages).values({
      senderName: msgData.senderName,
      email: msgData.email,
      subject: msgData.subject,
      message: msgData.message,
    }).returning()
    return res.status(201).json({ message: 'Message sent', msg: newMsg })
  } catch (error) {
    return res.status(201).json({ message: 'Sent (Local Only)', msg: msgData })
  }
})

app.get('/api/messages', requireAuth, async (req, res) => {
  try {
    const allMessages = await db.select().from(messages)
    return res.json(allMessages)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch messages' })
  }
})

const sanitizeBlogPayload = (input = {}) => ({
  topic: String(input.topic || ''),
  targetKeyword: String(input.targetKeyword || ''),
  location: String(input.location || ''),
  title: String(input.title || ''),
  slug: String(input.slug || ''),
  author: String(input.author || ''),
  publishDate: String(input.publishDate || ''),
  metaTitle: String(input.metaTitle || ''),
  metaDescription: String(input.metaDescription || ''),
  keywords: String(input.keywords || ''),
  featureImage: String(input.featureImage || ''),
  imageSuggestions: String(input.imageSuggestions || ''),
  internalLinks: String(input.internalLinks || ''),
  summary: String(input.summary || ''),
  contentHtml: String(input.contentHtml || ''),
  status: String(input.status || 'Draft') || 'Draft',
})

const sortBlogPosts = (items) =>
  [...items].sort((a, b) => {
    const aTime = new Date(a.publishDate || a.createdAt || '').getTime()
    const bTime = new Date(b.publishDate || b.createdAt || '').getTime()
    return bTime - aTime
  })

app.get('/api/blog-posts', async (_req, res) => {
  try {
    const posts = await db.select().from(blogPosts)
    const publishedPosts = sortBlogPosts(posts).filter((post) => (post.status || 'Draft') === 'Published')
    return res.json(publishedPosts)
  } catch {
    const publishedPosts = sortBlogPosts(blogPostsFallback).filter((post) => (post.status || 'Draft') === 'Published')
    return res.json(publishedPosts)
  }
})

app.get('/api/admin/blog-posts', requireAuth, async (_req, res) => {
  try {
    const posts = await db.select().from(blogPosts)
    return res.json(sortBlogPosts(posts))
  } catch {
    return res.json(sortBlogPosts(blogPostsFallback))
  }
})

app.post('/api/admin/blog-posts/sync', requireAuth, async (req, res) => {
  const postsInput = Array.isArray(req.body?.posts) ? req.body.posts : []
  const nowIso = new Date().toISOString()

  const normalizedPosts = postsInput.map((post, index) => ({
    id: Number(post.id) || index + 1,
    createdAt: post.createdAt ? new Date(post.createdAt) : new Date(nowIso),
    ...sanitizeBlogPayload(post),
  }))

  try {
    await db.delete(blogPosts)
    if (normalizedPosts.length) {
      await db.insert(blogPosts).values(normalizedPosts)
    }
    return res.json({ message: 'Blog posts synced', count: normalizedPosts.length })
  } catch {
    blogPostsFallback = normalizedPosts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
    }))
    return res.json({ message: 'Blog posts synced to fallback storage', count: normalizedPosts.length })
  }
})

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Auth API running on http://localhost:${PORT}`)
  })
}
