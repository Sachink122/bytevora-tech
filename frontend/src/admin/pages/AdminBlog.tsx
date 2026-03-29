import { useEffect, useState } from 'react'
import AdminSimpleManager from '../components/AdminSimpleManager'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

interface BlogRecord {
  id: number
  createdAt: string
  status: string
  [key: string]: string | number
}

const AdminBlog = () => {
  const [copyLabel, setCopyLabel] = useState('Copy Prompt')
  const [isHydrated, setIsHydrated] = useState(false)
  const [syncMessage, setSyncMessage] = useState('')

  const seoPromptTemplate = `Write a high-quality SEO optimized blog post for my website.

Topic: [Enter Topic]
Target Keyword: [Enter Main Keyword]
Location (optional): [e.g. Pune, India]

CONTENT REQUIREMENTS:

1. The blog must be 800-1200 words.
2. Use simple, clear, and professional language.
3. Avoid long paragraphs (max 2-3 lines each).
4. Make content engaging and easy to read.

FORMATTING REQUIREMENTS (VERY IMPORTANT):

- Output must be in clean HTML format
- Use:
  - <h1> for title
  - <h2> for main sections
  - <h3> for sub-sections
  - <p> for paragraphs
  - <ul><li> for bullet points
- Add proper spacing and structure
- Do NOT write everything in one paragraph
- Make it visually clean and readable (like a professional blog)

SEO REQUIREMENTS:

- Use target keyword naturally:
  - in title
  - in first paragraph
  - in at least 2 headings
- Add:
  - Meta Title (max 60 characters)
  - Meta Description (max 160 characters)
  - 5-7 SEO keywords/tags

IMAGE REQUIREMENTS:

- Suggest 2-3 relevant images
- For each image provide:
  - Image title
  - SEO alt text (with keyword)
  - Placement (e.g. after intro, mid content)
  - Image idea (what type of image)

CONTENT STRUCTURE:

1. Engaging introduction
2. Problem explanation
3. Solution
4. 5-7 sections with headings (H2)
5. Bullet points where needed
6. Strong conclusion

CONVERSION (VERY IMPORTANT):

- Add internal linking suggestions (services/contact page)
- End with a strong CTA in HTML:

Example:
<a href="https://wa.me/918668398960">Chat on WhatsApp</a>

Make the blog conversion-focused for a web design business.

OUTPUT FORMAT:

- Title
- Meta Title
- Meta Description
- Keywords
- Image Suggestions
- Full Blog Content (HTML formatted, clean, structured)`

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(seoPromptTemplate)
      setCopyLabel('Copied')
      setTimeout(() => setCopyLabel('Copy Prompt'), 1500)
    } catch {
      setCopyLabel('Copy failed')
      setTimeout(() => setCopyLabel('Copy Prompt'), 1500)
    }
  }

  useEffect(() => {
    const hydrateFromApi = async () => {
      try {
        const token = localStorage.getItem('agency_auth_token') || ''
        if (!token) {
          setIsHydrated(true)
          return
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/blog-posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        })

        if (response.ok) {
          const records = (await response.json()) as BlogRecord[]
          localStorage.setItem('admin-blog', JSON.stringify(records))
        }
      } catch {
        // Keep local draft data if API is not available.
      } finally {
        setIsHydrated(true)
      }
    }

    void hydrateFromApi()
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    let debounceTimer: ReturnType<typeof setTimeout> | null = null

    const syncBlogPosts = async () => {
      try {
        const token = localStorage.getItem('agency_auth_token') || ''
        if (!token) return

        const raw = localStorage.getItem('admin-blog')
        const posts = raw ? (JSON.parse(raw) as BlogRecord[]) : []

        const response = await fetch(`${API_BASE_URL}/api/admin/blog-posts/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ posts }),
        })

        if (!response.ok) {
          setSyncMessage('Blog sync failed. Please try again.')
          return
        }

        setSyncMessage('Synced to server')
        setTimeout(() => setSyncMessage(''), 2000)
      } catch {
        setSyncMessage('Blog sync failed. Please check API connection.')
      }
    }

    const handleLocalStorageUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ key?: string }>
      if (customEvent.detail?.key !== 'admin-blog') return

      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        void syncBlogPosts()
      }, 500)
    }

    window.addEventListener('local-storage-update', handleLocalStorageUpdate)

    return () => {
      window.removeEventListener('local-storage-update', handleLocalStorageUpdate)
      if (debounceTimer) clearTimeout(debounceTimer)
    }
  }, [isHydrated])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-500/30 bg-slate-900/50 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">SEO Blog Prompt Template</h2>
            <p className="text-sm text-slate-400 mt-1">Use this prompt to generate consistent conversion-focused blog drafts.</p>
          </div>
          <button
            type="button"
            onClick={copyPrompt}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            {copyLabel}
          </button>
        </div>
        <textarea
          value={seoPromptTemplate}
          readOnly
          rows={14}
          className="mt-4 w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-sm text-slate-200 leading-6 resize-none"
        />
      </div>

      {syncMessage ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
          {syncMessage}
        </div>
      ) : null}

      {!isHydrated ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 text-slate-300">Loading blog posts...</div>
      ) : null}

      {isHydrated ? (
        <AdminSimpleManager
          title="Blog"
          description="Create conversion-focused SEO blogs with structured metadata and full HTML content."
          storageKey="admin-blog"
          defaultStatus="Draft"
          statusOptions={['Draft', 'Scheduled', 'Published', 'Archived']}
          addButtonLabel="New Post"
          fields={[
            { key: 'topic', label: 'Topic', required: true, placeholder: 'Website redesign checklist for service businesses' },
            { key: 'targetKeyword', label: 'Target Keyword', required: true, placeholder: 'web design for small business' },
            { key: 'location', label: 'Location (Optional)', placeholder: 'Pune, India' },
            { key: 'title', label: 'Post Title', required: true, placeholder: 'Web Design for Small Business: A Practical Guide' },
            { key: 'slug', label: 'Slug', required: true, placeholder: 'web-design-small-business-guide' },
            { key: 'author', label: 'Author', placeholder: 'Team Member' },
            { key: 'publishDate', label: 'Publish Date', type: 'date' },
            { key: 'metaTitle', label: 'Meta Title', required: true, placeholder: 'Web Design for Small Business | Bytevora Tech' },
            { key: 'metaDescription', label: 'Meta Description', required: true, type: 'textarea', placeholder: 'Get conversion-focused web design for small business. Learn what to include, mistakes to avoid, and how to turn visitors into leads.' },
            { key: 'keywords', label: 'SEO Keywords/Tags', required: true, placeholder: 'web design for small business, responsive web design, business website development' },
            { key: 'featureImage', label: 'Feature Image', type: 'file', accept: 'image/*' },
            { key: 'imageSuggestions', label: 'Image Suggestions', type: 'textarea', placeholder: '1) Hero mockup image | Alt: web design for small business homepage | Placement: after intro' },
            { key: 'internalLinks', label: 'Internal Linking Suggestions', type: 'textarea', placeholder: '/services, /contact, /portfolio' },
            { key: 'summary', label: 'Summary', type: 'textarea', placeholder: 'Short preview of the article.' },
            { key: 'contentHtml', label: 'Full Blog Content (HTML)', required: true, type: 'textarea', placeholder: '<h1>...</h1>\n<p>...</p>\n<h2>...</h2>' },
          ]}
        />
      ) : null}
    </div>
  )
}

export default AdminBlog
