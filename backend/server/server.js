import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { db } from '../db/index.js'
import { users, leads, messages, blogPosts, teamMembers, services, projects } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

// Debug: print the configured DATABASE_URL (root .env is used)
console.log('DB URL:', process.env.DATABASE_URL)

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

const allowedOrigins = (process.env.AUTH_ALLOWED_ORIGINS || '*')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

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

// Supabase storage client (optional). Provide SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_KEY).
const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || ''
const SUPABASE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'blog-images'
let supabase = null
if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  } catch (err) {
    console.error('Failed to init Supabase client', err)
    supabase = null
  }
}

app.use(helmet({
  contentSecurityPolicy: false,
}))
app.use(cors(corsOptions))
// Accept larger JSON payloads for blog content/uploads (default limit may be too small)
// Increase body parser limits for large blog HTML or base64 image payloads.
// Configure with env vars `EXPRESS_JSON_LIMIT` and `EXPRESS_URLENCODED_LIMIT` if needed.
app.use(express.json({ limit: process.env.EXPRESS_JSON_LIMIT || '50mb' }))
app.use(express.urlencoded({ limit: process.env.EXPRESS_URLENCODED_LIMIT || '50mb', extended: true }))
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

// Public route: anyone can submit a lead (no auth required)
const allowPublic = (req, _res, next) => { req.isPublic = true; next() }

app.post('/api/leads', allowPublic, async (req, res) => {
  const leadData = req.body || {}
  // Expect structured contact form fields
  const firstName = String(leadData.firstName || leadData.firstname || leadData.first_name || '').trim()
  const lastName = String(leadData.lastName || leadData.lastname || leadData.last_name || '').trim()
  const email = String(leadData.email || leadData.contactEmail || '').trim()
  const phone = String(leadData.phone || leadData.contact || leadData.contactPhone || '').trim()
  const service = String(leadData.service || leadData.serviceInterest || leadData.service_interest || 'Other')
  const budget = String(leadData.budget || leadData.estimatedBudget || '').trim()
  const projectDetails = String(leadData.projectDetails || leadData.project_details || leadData.details || '').trim()
  const status = String(leadData.status || 'New')
  const createdAt = new Date()

  try {
    console.log('In leads insert handler — inserting lead:', { firstName, lastName, service, email, phone, budget })
    const [newLead] = await db.insert(leads).values({
      first_name: firstName || null,
      last_name: lastName || null,
      email: email || null,
      phone: phone || null,
      service,
      budget: budget || null,
      project_details: projectDetails || null,
      status,
      created_at: createdAt,
    }).returning()
    // Map DB row to structured response
    const resp = {
      id: newLead.id,
      firstName: newLead.first_name || null,
      lastName: newLead.last_name || null,
      email: newLead.email || null,
      phone: newLead.phone || null,
      service: newLead.service || null,
      budget: newLead.budget || null,
      projectDetails: newLead.project_details || null,
      status: (newLead.status || 'new').toString(),
      createdAt: newLead.created_at || null,
    }
    return res.status(201).json({ message: 'Lead application received', lead: resp })
  } catch (error) {
    // Detailed error logging for DB failures
    try {
      console.error('Insert error message:', error.message)
      console.error('Insert error code:', error.code)
      console.error('Insert error detail:', error.detail)
      console.error('Insert error hint:', error.hint)
      console.error('Insert error (stack):', error.stack)
      console.error('Insert error (full):', JSON.stringify(error, Object.getOwnPropertyNames(error)))
    } catch (logErr) {
      console.error('Failed to stringify error', logErr, error)
    }
    return res.status(500).json({ message: 'Failed to save lead', error: String(error && error.message ? error.message : error) })
  }
})

app.get('/api/leads', requireAuth, async (req, res) => {
  try {
    const allLeads = await db.select().from(leads)
    const mapped = allLeads.map((r) => {
      // fallback: if first_name/last_name are missing, try to split legacy `name` column
      let first = r.first_name || null
      let last = r.last_name || null
      return {
        id: r.id,
        firstName: first,
        lastName: last,
        email: r.email || null,
        phone: r.phone || null,
        service: r.service || null,
        budget: r.budget || null,
        projectDetails: r.project_details || null,
        status: (r.status || 'new').toString(),
        createdAt: r.created_at || null,
      }
    })
    return res.json(mapped)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return res.status(500).json({ message: 'Failed to fetch leads', error: String(error) })
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
  title: String(input.title || ''),
  slug: String(input.slug || ''),
  metaTitle: String(input.metaTitle || ''),
  metaDescription: String(input.metaDescription || ''),
  summary: String(input.summary || ''),
  content: String(input.content || input.contentHtml || ''),
  images: Array.isArray(input.images) ? input.images : (typeof input.images === 'string' ? (() => { try { return JSON.parse(input.images) } catch { return [] } })() : []),
  published: Boolean(input.published) || (String(input.status || '').toLowerCase() === 'published'),
})

const sortBlogPosts = (items) =>
  [...items].sort((a, b) => {
    const aTime = new Date(a.publishDate || a.createdAt || '').getTime()
    const bTime = new Date(b.publishDate || b.createdAt || '').getTime()
    return bTime - aTime
  })

app.get('/api/blog-posts', async (_req, res) => {
  try {
    const rows = await db.select().from(blogPosts)
    // filter for published
    const published = rows.filter((r) => {
      if (typeof r.published === 'number') return r.published === 1
      if (typeof r.published === 'boolean') return r.published === true
      return String(r.published) === '1' || String(r.published).toLowerCase() === 'true'
    })
    return res.json(published.sort((a, b) => new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0)))
  } catch (err) {
    console.error('Failed fetching published blog posts:', err)
    const publishedPosts = sortBlogPosts(blogPostsFallback).filter((post) => (post.published || post.status === 'Published'))
    return res.json(publishedPosts)
  }
})

app.get('/api/admin/blog-posts', requireAuth, async (_req, res) => {
  try {
    const posts = await db.select().from(blogPosts)
    const mapped = Array.isArray(posts) ? posts.map((r) => ({
      id: r.id,
      title: r.title || null,
      slug: r.slug || null,
      metaTitle: r.metaTitle || r.meta_title || null,
      metaDescription: r.metaDescription || r.meta_description || null,
      summary: r.summary || null,
      content: r.content || null,
      images: (() => {
        try {
          if (!r.images) return []
          return Array.isArray(r.images) ? r.images : JSON.parse(r.images)
        } catch (e) {
          return []
        }
      })(),
      published: (typeof r.published === 'boolean') ? r.published : (String(r.published) === '1' || String(r.published).toLowerCase() === 'true'),
      createdAt: r.createdAt || r.created_at || null,
    })) : []

    return res.json(sortBlogPosts(mapped))
  } catch {
    return res.json(sortBlogPosts(blogPostsFallback))
  }
})

  // Public endpoints: team, services, projects
  app.get('/api/team', async (_req, res) => {
    try {
      const rows = await db.select().from(teamMembers)
      return res.json(rows)
    } catch (error) {
      console.error('Error fetching team members:', error)
      return res.status(500).json({ message: 'Failed to fetch team members', error: String(error) })
    }
  })

  app.get('/api/services', async (_req, res) => {
    try {
      const rows = await db.select().from(services)
      return res.json(rows)
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch services' })
    }
  })

  app.get('/api/projects', async (_req, res) => {
    try {
      const rows = await db.select().from(projects)
      return res.json(rows)
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch projects' })
    }
  })

  app.get('/api/projects/:id', async (req, res) => {
    const id = Number(req.params.id)
    if (!id) return res.status(400).json({ message: 'Invalid project id' })
    try {
      const [row] = await db.select().from(projects).where(eq(projects.id, id))
      if (!row) return res.status(404).json({ message: 'Project not found' })
      return res.json(row)
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch project' })
    }
  })

  // Admin CRUD: Team
  app.get('/api/admin/team', requireAuth, async (_req, res) => {
    try {
      const rows = await db.select().from(teamMembers)
      return res.json(rows)
    } catch {
      console.error('Error fetching admin team members:', arguments)
      return res.status(500).json({ message: 'Failed to fetch team members', error: 'admin-fetch-error' })
    }
  })

  app.post('/api/admin/team', requireAuth, async (req, res) => {
    const input = req.body || {}
    if (!input.name) return res.status(400).json({ message: 'Name is required' })
    try {
      const [newRow] = await db.insert(teamMembers).values({
      name: String(input.name),
      role: String(input.role || ''),
      email: String(input.email || ''),
      phone: String(input.phone || ''),
      skills: String(input.skills || ''),
      status: String(input.status || 'Active'),
      }).returning()
      return res.status(201).json(newRow)
    } catch (error) {
      console.error('Error creating team member:', error)
      return res.status(500).json({ message: 'Failed to create team member', error: String(error) })
    }
  })

  app.put('/api/admin/team/:id', requireAuth, async (req, res) => {
    const id = Number(req.params.id)
    if (!id) return res.status(400).json({ message: 'Invalid id' })
    const input = req.body || {}
    try {
      await db.update(teamMembers).set({
      name: String(input.name || ''),
      role: String(input.role || ''),
      email: String(input.email || ''),
      phone: String(input.phone || ''),
      skills: String(input.skills || ''),
      status: String(input.status || 'Active'),
      }).where(eq(teamMembers.id, id))
      const [updated] = await db.select().from(teamMembers).where(eq(teamMembers.id, id))
      return res.json(updated)
    } catch (error) {
      console.error('Error updating team member:', error)
      return res.status(500).json({ message: 'Failed to update team member', error: String(error) })
    }
  })

  app.delete('/api/admin/team/:id', requireAuth, async (req, res) => {
    const id = Number(req.params.id)
    if (!id) return res.status(400).json({ message: 'Invalid id' })
    try {
      await db.delete(teamMembers).where(eq(teamMembers.id, id))
      return res.status(204).send()
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete team member' })
    }
  })

  // Admin CRUD: Services
  app.get('/api/admin/services', requireAuth, async (_req, res) => {
    try {
      const rows = await db.select().from(services)
      return res.json(rows)
    } catch {
      return res.status(500).json({ message: 'Failed to fetch services' })
    }
  })

  app.post('/api/admin/services', requireAuth, async (req, res) => {
    const input = req.body || {}
    if (!input.title || !input.slug) return res.status(400).json({ message: 'Title and slug are required' })
    try {
      const [newRow] = await db.insert(services).values({
        title: String(input.title),
        slug: String(input.slug),
        summary: String(input.summary || ''),
        description: String(input.description || ''),
        icon: String(input.icon || ''),
      }).returning()
      return res.status(201).json(newRow)
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create service' })
    }
  })

  app.put('/api/admin/services/:id', requireAuth, async (req, res) => {
    const id = Number(req.params.id)
    if (!id) return res.status(400).json({ message: 'Invalid id' })
    const input = req.body || {}
    try {
      await db.update(services).set({
        title: String(input.title || ''),
        slug: String(input.slug || ''),
        summary: String(input.summary || ''),
        description: String(input.description || ''),
        icon: String(input.icon || ''),
      }).where(eq(services.id, id))
      const [updated] = await db.select().from(services).where(eq(services.id, id))
      return res.json(updated)
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update service' })
    }
  })

  app.delete('/api/admin/services/:id', requireAuth, async (req, res) => {
    const id = Number(req.params.id)
    if (!id) return res.status(400).json({ message: 'Invalid id' })
    try {
      await db.delete(services).where(eq(services.id, id))
      return res.status(204).send()
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete service' })
    }
  })

  // Admin CRUD: Projects
  app.get('/api/admin/projects', requireAuth, async (_req, res) => {
    try {
      const rows = await db.select().from(projects)
      return res.json(rows)
    } catch {
      return res.status(500).json({ message: 'Failed to fetch projects' })
    }
  })

  app.post('/api/admin/projects', requireAuth, async (req, res) => {
    const input = req.body || {}
    if (!input.title) return res.status(400).json({ message: 'Title is required' })
    try {
      const [newRow] = await db.insert(projects).values({
        title: String(input.title),
        category: String(input.category || ''),
        description: String(input.description || ''),
        image: String(input.image || ''),
        projectUrl: String(input.projectUrl || ''),
        tags: String(input.tags || ''),
        status: String(input.status || 'Published'),
      }).returning()
      return res.status(201).json(newRow)
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create project' })
    }
  })

  app.put('/api/admin/projects/:id', requireAuth, async (req, res) => {
    const id = Number(req.params.id)
    if (!id) return res.status(400).json({ message: 'Invalid id' })
    const input = req.body || {}
    try {
      await db.update(projects).set({
        title: String(input.title || ''),
        category: String(input.category || ''),
        description: String(input.description || ''),
        image: String(input.image || ''),
        projectUrl: String(input.projectUrl || ''),
        tags: String(input.tags || ''),
        status: String(input.status || 'Published'),
      }).where(eq(projects.id, id))
      const [updated] = await db.select().from(projects).where(eq(projects.id, id))
      return res.json(updated)
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update project' })
    }
  })

  app.delete('/api/admin/projects/:id', requireAuth, async (req, res) => {
    const id = Number(req.params.id)
    if (!id) return res.status(400).json({ message: 'Invalid id' })
    try {
      await db.delete(projects).where(eq(projects.id, id))
      return res.status(204).send()
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete project' })
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
    .map((p) => ({
      ...p,
      // ensure images are stringified for DB column
        images: JSON.stringify(Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? (() => { try { return JSON.parse(p.images) } catch { return [] } })() : [])),
        published: Boolean(p.published),
  }))

  try {
    console.log('Blog sync request received. posts count:', normalizedPosts.length)
    // Delete existing posts safely by id (some DB drivers/ORMs disallow delete without where)
    const existing = await db.select().from(blogPosts)
    if (Array.isArray(existing) && existing.length) {
      for (const row of existing) {
        try {
          await db.delete(blogPosts).where(eq(blogPosts.id, row.id))
        } catch (innerErr) {
          console.error('Failed deleting blog post id', row.id, innerErr)
        }
      }
    }

    if (normalizedPosts.length) {
      // Remove `id` from payloads to let DB generate identity values
      const insertRows = normalizedPosts.map((p) => {
        const { id, ...rest } = p
        return rest
      })
      try {
        await db.insert(blogPosts).values(insertRows)
      } catch (insErr) {
        console.error('Failed inserting blog posts:', insErr)
        throw insErr
      }
    }
    return res.json({ message: 'Blog posts synced', count: normalizedPosts.length })
  } catch (err) {
    console.error('Blog sync failed, falling back to local storage', err)
    blogPostsFallback = normalizedPosts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
    }))
    return res.json({ message: 'Blog posts synced to fallback storage', count: normalizedPosts.length })
  }
})

// Helper: upload base64/data-URL images to Supabase storage and return array of URLs
async function uploadImagesToSupabase(images = [], slug = 'post') {
  if (!supabase) {
    // no supabase configured; return original images (preferably URLs)
    return images
  }

  const uploadedUrls = []
  for (let i = 0; i < images.length; i += 1) {
    const img = images[i]
    if (!img) continue
    if (typeof img === 'string' && img.startsWith('data:')) {
      // data:[<mediatype>][;base64],<data>
      const match = img.match(/^data:(image\/[^;]+);base64,(.*)$/)
      if (!match) {
        continue
      }
      const mime = match[1]
      const b64 = match[2]
      const ext = mime.split('/')[1] || 'png'
      const filename = `${slug}/${Date.now()}-${i}.${ext}`
      const buffer = Buffer.from(b64, 'base64')
      try {
        const { error: upErr } = await supabase.storage.from(SUPABASE_BUCKET).upload(filename, buffer, { upsert: true, contentType: mime })
        if (upErr) {
          console.error('Supabase upload error:', upErr)
          continue
        }
        const { data: pu } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(filename)
        const publicUrl = pu?.publicUrl || pu?.publicURL || ''
        uploadedUrls.push(publicUrl || `/${filename}`)
      } catch (err) {
        console.error('Upload failed for image', filename, err)
      }
    } else if (typeof img === 'string') {
      // already a URL
      uploadedUrls.push(img)
    }
  }

  return uploadedUrls
}

// Admin: create a single blog post (uploads images if needed)
app.post('/api/admin/blog-posts', requireAuth, async (req, res) => {
  const input = req.body || {}
  if (!input.title || !input.slug) return res.status(400).json({ message: 'title and slug are required' })

  try {
    const payload = sanitizeBlogPayload(input)
    // images may be data URLs — upload and replace with public URLs
    const uploaded = await uploadImagesToSupabase(payload.images || [], payload.slug || String(Date.now()))
    const imagesToStore = Array.isArray(uploaded) && uploaded.length ? uploaded : (Array.isArray(payload.images) ? payload.images : [])

    const [newPost] = await db.insert(blogPosts).values({
      title: payload.title,
      slug: payload.slug,
      metaTitle: payload.metaTitle || null,
      metaDescription: payload.metaDescription || null,
      summary: payload.summary || null,
      content: payload.content || null,
      images: JSON.stringify(imagesToStore),
      published: Boolean(payload.published),
      createdAt: new Date(),
    }).returning()

    return res.status(201).json(newPost)
  } catch (error) {
    console.error('Error creating blog post:', error)
    return res.status(500).json({ message: 'Failed to create blog post', error: String(error) })
  }
})

// Temporary debug endpoint: return all blog_posts ordered by created_at desc
// NOTE: No auth — this is temporary and should be removed after verification.
app.get('/api/debug/blog-posts', async (_req, res) => {
  try {
    const rows = await db.select().from(blogPosts)
    const sorted = Array.isArray(rows)
      ? rows.sort((a, b) => new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0))
      : rows
    return res.json(sorted)
  } catch (err) {
    console.error('Debug blog-posts query failed:', err)
    return res.status(500).json({ message: 'Failed to fetch blog posts', error: String(err) })
  }
})
export default app;

// Bind host: allow overriding via `AUTH_API_HOST` env var.
// Default to IPv6 unspecified address (`::`) which accepts both IPv6 and IPv4
// loopback on platforms that support dual-stack. This prevents ECONNREFUSED
// when callers (like Vite) resolve `localhost` to ::1.
const HOST = process.env.AUTH_API_HOST || '::'
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, HOST, () => {
    const displayHost = (HOST === '::' || HOST === '0.0.0.0') ? 'localhost' : HOST
    console.log(`Auth API running on http://${displayHost}:${PORT}`)
  })
}
