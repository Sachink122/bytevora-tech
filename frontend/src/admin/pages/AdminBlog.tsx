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
        const localRaw = localStorage.getItem('admin-blog')
        const localRecords = localRaw ? (JSON.parse(localRaw) as BlogRecord[]) : []

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
          // Never wipe local records on refresh if API currently returns empty.
          if (records.length > 0 || localRecords.length === 0) {
            localStorage.setItem('admin-blog', JSON.stringify(records))
          }
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
      {/* Quick Add compact form for faster blog creation */}
      <div className="rounded-2xl border border-white/6 bg-slate-900/40 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Quick Add Blog</h3>
          <small className="text-slate-400">Create a lightweight blog draft quickly</small>
        </div>
        <QuickAdd />
      </div>
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

function QuickAdd() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', slug: '', metaTitle: '', metaDescription: '', summary: '', contentHtml: '', status: 'Draft', images: [] as string[] })

  const submit = () => {
    if (!form.title || !form.slug) return alert('Please provide title and slug')
    try {
      // Try to POST directly to API if user is authenticated; otherwise save locally and trigger sync
      const token = localStorage.getItem('agency_auth_token') || ''
      const payload = {
        title: form.title,
        slug: form.slug,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        summary: form.summary,
        content: form.contentHtml,
        images: form.images || [],
        published: form.status === 'Published',
      }

      if (token) {
        // attempt online save
        fetch(`${API_BASE_URL}/api/admin/blog-posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }).then(async (res) => {
          if (!res.ok) throw new Error('API save failed')
          const saved = await res.json()
          try {
            const raw = localStorage.getItem('admin-blog') || '[]'
            const arr = JSON.parse(raw)
            arr.unshift({ ...saved, createdAt: saved.createdAt || new Date().toISOString() })
            localStorage.setItem('admin-blog', JSON.stringify(arr))
            window.dispatchEvent(new CustomEvent('local-storage-update', { detail: { key: 'admin-blog' } }))
          } catch (e) {
            console.warn('Failed to write saved post to localStorage', e)
          }
          setOpen(false)
          setForm({ title: '', slug: '', metaTitle: '', metaDescription: '', summary: '', contentHtml: '', status: 'Draft', images: [] })
          const el = document.getElementById('admin-blog-sync-msg')
          if (el) el.textContent = 'Saved to server'
        }).catch(() => {
          // fallback to local save if network/API fails
          const raw = localStorage.getItem('admin-blog') || '[]'
          const arr = JSON.parse(raw)
          const nextId = arr.length ? Math.max(...arr.map((r: any) => Number(r.id) || 0)) + 1 : Date.now()
          const item = {
            id: nextId,
            createdAt: new Date().toISOString(),
            title: form.title,
            slug: form.slug,
            metaTitle: form.metaTitle,
            metaDescription: form.metaDescription,
            summary: form.summary,
            contentHtml: form.contentHtml,
            images: form.images || [],
            status: form.status,
          }
          arr.unshift(item)
          localStorage.setItem('admin-blog', JSON.stringify(arr))
          window.dispatchEvent(new CustomEvent('local-storage-update', { detail: { key: 'admin-blog' } }))
          setOpen(false)
          setForm({ title: '', slug: '', metaTitle: '', metaDescription: '', summary: '', contentHtml: '', status: 'Draft', images: [] })
          const el = document.getElementById('admin-blog-sync-msg')
          if (el) el.textContent = 'Saved locally — will sync'
        })
      } else {
        // offline/local save
        const raw = localStorage.getItem('admin-blog') || '[]'
        const arr = JSON.parse(raw)
        const nextId = arr.length ? Math.max(...arr.map((r: any) => Number(r.id) || 0)) + 1 : Date.now()
        const item = {
          id: nextId,
          createdAt: new Date().toISOString(),
          title: form.title,
          slug: form.slug,
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          summary: form.summary,
          contentHtml: form.contentHtml,
          images: form.images || [],
          status: form.status,
        }
        arr.unshift(item)
        localStorage.setItem('admin-blog', JSON.stringify(arr))
        // notify sync watcher
        window.dispatchEvent(new CustomEvent('local-storage-update', { detail: { key: 'admin-blog' } }))
        setOpen(false)
        setForm({ title: '', slug: '', metaTitle: '', metaDescription: '', summary: '', contentHtml: '', status: 'Draft', images: [] })
        const el = document.getElementById('admin-blog-sync-msg')
        if (el) el.textContent = 'Saved locally — syncing...'
      }
    } catch (err) {
      console.error('QuickAdd save failed', err)
      alert('Failed to save draft locally')
    }
  }

  return (
    <div className="mt-3">
      <div className="flex items-center gap-3">
        <button onClick={() => setOpen((s) => !s)} className="px-3 py-1 bg-slate-800 rounded text-sm text-white">{open ? 'Close' : 'Quick Add'}</button>
        <span id="admin-blog-sync-msg" className="text-sm text-slate-400" />
      </div>
      {open && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Post Title" className="px-3 py-2 bg-slate-800 rounded" />
          <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="Slug" className="px-3 py-2 bg-slate-800 rounded" />
          <input value={form.metaTitle} onChange={(e) => setForm((p) => ({ ...p, metaTitle: e.target.value }))} placeholder="Meta Title" className="px-3 py-2 bg-slate-800 rounded col-span-2" />
          <textarea value={form.metaDescription} onChange={(e) => setForm((p) => ({ ...p, metaDescription: e.target.value }))} placeholder="Meta Description" className="px-3 py-2 bg-slate-800 rounded col-span-2" rows={2} />
          <textarea value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} placeholder="Summary" className="px-3 py-2 bg-slate-800 rounded col-span-2" rows={2} />
          <textarea value={form.contentHtml} onChange={(e) => setForm((p) => ({ ...p, contentHtml: e.target.value }))} placeholder="Full Blog Content (HTML)" className="px-3 py-2 bg-slate-800 rounded col-span-2" rows={6} />

          <div className="col-span-2">
            <label className="block text-slate-300 text-sm mb-2">Images (multiple)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                if (!files.length) return
                Promise.all(files.map((file) => new Promise<string | null>((resolve) => {
                  const reader = new FileReader()
                  reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null)
                  reader.onerror = () => resolve(null)
                  reader.readAsDataURL(file)
                }))).then((dataUrls) => {
                  const imgs = dataUrls.filter(Boolean) as string[]
                  setForm((p) => ({ ...p, images: [...(p.images || []), ...imgs] }))
                })
              }}
              className="w-full"
            />
            {form.images && form.images.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {form.images.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img src={src} alt={`img-${idx}`} className="w-28 h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="px-3 py-2 bg-slate-800 rounded">
            <option>Draft</option>
            <option>Scheduled</option>
            <option>Published</option>
            <option>Archived</option>
          </select>
          <div className="flex items-center gap-2">
            <button onClick={submit} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded">Save</button>
            <button onClick={() => { setForm({ title: '', slug: '', metaTitle: '', metaDescription: '', summary: '', contentHtml: '', status: 'Draft', images: [] }); setOpen(false) }} className="px-3 py-2 bg-slate-800 text-white rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
