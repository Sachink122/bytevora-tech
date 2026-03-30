import { useEffect, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const defaultContent = {
  agencyName: 'Bytevora Tech',
  tagline: 'Build. Manage. Grow.',
  agencyDescription: 'Bytevora Tech helps businesses build high-performing websites, manage operations with smart systems, and grow through practical digital strategies.',
  homeHeroPrefix: 'Build and Scale',
  homeHeroHighlight: 'Digital Presence',
  homeHeroSuffix: 'with',
  homePrimaryCtaText: 'Join Us',
  homeSecondaryCtaText: 'View Portfolio',
  homeContactTitle: "Let's Start a Conversation",
  homeContactDescription: "Ready to transform your digital presence? Get in touch and let's discuss your project.",
  businessEmail: 'bytevora1tech@gmail.com',
  phoneNumber: '8668398960',
  whatsAppNumber: '8668398960',
}

export default function AdminHome() {
  const [content, setContent] = useState(defaultContent)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = localStorage.getItem('agency_auth_token') || ''
        const response = await fetch(`${API_BASE_URL}/api/admin/content/home`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        })
        if (response.ok) {
          const data = await response.json()
          if (data.content) setContent(JSON.parse(data.content))
        }
      } catch {
        // Ignore fetch errors
      }
      setLoading(false)
    }
    fetchContent()
  }, [])

  const handleChange = (e) => {
    setContent((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const token = localStorage.getItem('agency_auth_token') || ''
      const response = await fetch(`${API_BASE_URL}/api/admin/content/home`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ content: JSON.stringify(content) }),
      })
      if (response.ok) {
        setMessage('Home content saved and published!')
      } else {
        setMessage('Failed to save. Check your connection or login.')
      }
    } catch {
      setMessage('Failed to save. Check your connection or login.')
    }
    setSaving(false)
  }

  if (loading) return <div className="p-6 text-slate-300">Loading Home content...</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <h2 className="text-xl font-semibold text-white mb-2">Edit Home Page Content</h2>
      <div className="space-y-4">
        {Object.keys(defaultContent).map((key) => (
          <div key={key}>
            <label className="block text-slate-400 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type="text"
              name={key}
              value={content[key] || ''}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-800 border border-white/10 p-2 text-slate-200"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold mt-4"
      >
        {saving ? 'Saving...' : 'Save & Publish'}
      </button>
      {message && <div className="mt-2 text-emerald-400">{message}</div>}
    </div>
  )
}
