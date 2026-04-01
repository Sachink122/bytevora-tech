import dotenv from 'dotenv'
import { Client } from 'pg'

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.env' })

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('No DATABASE_URL found in environment')
  process.exit(1)
}

const teamMembers = [
  { name: 'Sachin Gautam', role: 'Founder / Developer', email: 'bytevora1tech@gmail.com', skills: 'React, Node.js, SEO', phone: '' },
  { name: 'John Doe', role: 'Senior Developer', email: 'john.doe@example.com', skills: 'React, TypeScript, Node.js', phone: '' },
  { name: 'Jane Smith', role: 'Designer', email: 'jane.smith@example.com', skills: 'Figma, UI/UX, CSS', phone: '' },
  { name: 'Priya Kumar', role: 'SEO Specialist', email: 'priya.kumar@example.com', skills: 'SEO, Content, Analytics', phone: '' },
]

const blogPosts = [
  {
    title: 'Launching Our New Agency Website',
    slug: 'launching-our-new-agency-website',
    metaTitle: 'Launching Our New Agency Website',
    metaDescription: 'Announcing our new site and services',
    summary: 'We just launched...',
    content: '<h1>Welcome</h1><p>We launched our new website to showcase our work.</p>',
    images: '[]',
    published: true,
  },
  {
    title: 'How We Approach SEO',
    slug: 'how-we-approach-seo',
    metaTitle: 'How We Approach SEO',
    metaDescription: 'Our SEO philosophy and tips',
    summary: 'SEO basics...',
    content: '<h1>SEO Strategy</h1><p>We focus on technical SEO and content.</p>',
    images: '[]',
    published: true,
  },
  {
    title: 'Building Modern React Apps',
    slug: 'building-modern-react-apps',
    metaTitle: 'Building Modern React Apps',
    metaDescription: 'Patterns and tools for modern React',
    summary: 'React tips...',
    content: '<h1>React</h1><p>Use hooks, components, and TypeScript.</p>',
    images: '[]',
    published: true,
  },
]

async function run() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })
  try {
    await client.connect()
    console.log('Connected to DB, seeding data...')

    // Upsert team members by email
    for (const tm of teamMembers) {
      const found = await client.query('SELECT id FROM team_members WHERE email = $1', [tm.email])
      if (found.rows.length) {
        console.log('Skipping existing team member:', tm.email)
        continue
      }
      await client.query(
        `INSERT INTO team_members (name, role, email, phone, skills, status, created) VALUES ($1,$2,$3,$4,$5,$6,now())`,
        [tm.name, tm.role, tm.email, tm.phone || null, tm.skills, 'Active']
      )
      console.log('Inserted team member:', tm.email)
    }

    // Insert blog posts (slug unique)
    for (const post of blogPosts) {
      const found = await client.query('SELECT id FROM blog_posts WHERE slug = $1', [post.slug])
      if (found.rows.length) {
        console.log('Skipping existing blog post:', post.slug)
        continue
      }
      await client.query(
        `INSERT INTO blog_posts (title, slug, meta_title, meta_description, summary, content, images, published, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now())`,
        [post.title, post.slug, post.metaTitle, post.metaDescription, post.summary, post.content, post.images, post.published]
      )
      console.log('Inserted blog post:', post.slug)
    }

    console.log('Seeding complete')
  } catch (err) {
    console.error('Seeding failed', err?.message || err)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

run()
