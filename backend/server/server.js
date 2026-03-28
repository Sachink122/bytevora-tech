import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { db } from '../db/index.js'
import { users, leads, messages } from '../db/schema.js'
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
const ADMIN_EMAIL = process.env.AUTH_ADMIN_EMAIL || 'admin@bytevora.in'
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
      const isEmailMatch = email === adminUser.email.toLowerCase()
      isPasswordMatch = bcrypt.compareSync(password, adminUser.passwordHash)
      if (isEmailMatch && isPasswordMatch) targetUser = adminUser
    }

    if (!targetUser || !isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const accessToken = createAccessToken(targetUser)
    const refreshToken = createRefreshToken(targetUser)
    currentRefreshToken = refreshToken
    setRefreshCookie(res, refreshToken)
    return res.json({ accessToken, user: sanitizeUser(targetUser) })
  } catch (error) {
    const isEmailMatch = email === adminUser.email.toLowerCase()
    const isPwMatch = bcrypt.compareSync(password, adminUser.passwordHash)
    if (isEmailMatch && isPwMatch) {
      const accessToken = createAccessToken(adminUser)
      const refreshToken = createRefreshToken(adminUser)
      currentRefreshToken = refreshToken
      setRefreshCookie(res, refreshToken)
      return res.json({ accessToken, user: sanitizeUser(adminUser) })
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

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Auth API running on http://localhost:${PORT}`)
  })
}
