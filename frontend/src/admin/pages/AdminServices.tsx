import { useEffect, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const defaultContent = {
  servicesTitle: 'Our Services',
  servicesDescription: 'Explore the digital solutions we offer to help your business grow.',
  service1: 'Web Design & Development',
  service2: 'UI/UX Design',
  service3: 'Automation & Integrations',
  service4: 'SEO & Analytics',
  service5: 'Branding & Identity',
  service6: 'Ongoing Support',
}

export default function AdminServices() {
  const [content, setContent] = useState(defaultContent)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = localStorage.getItem('agency_auth_token') || ''
        const response = await fetch(`${API_BASE_URL}/api/admin/content/services`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        })
        if (response.ok) {
          const data = await response.json()
          if (data.content) setContent(JSON.parse(data.content))
        }
      } catch {
        // ignore fetch errors
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
      const response = await fetch(`${API_BASE_URL}/api/admin/content/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ content: JSON.stringify(content) }),
      })
      if (response.ok) {
        setMessage('Services content saved and published!')
      } else {
        setMessage('Failed to save. Check your connection or login.')
      }
    } catch {
      setMessage('Failed to save. Check your connection or login.')
    }
    setSaving(false)
  }

  if (loading) return <div className="p-6 text-slate-300">Loading Services content...</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <h2 className="text-xl font-semibold text-white mb-2">Edit Services Page Content</h2>
      <div className="space-y-4">
        {Object.keys(content).map((key) => (
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
        onClick={() => {
          // Find next available service key
          let i = 1;
          while (content[`service${i}`]) i++;
          setContent((prev) => ({ ...prev, [`service${i}`]: '' }));
        }}
        className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold mt-2 mr-4"
      >
        + Add Service
      </button>
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold mt-2"
      >
        {saving ? 'Saving...' : 'Save & Publish'}
      </button>
      {message && <div className="mt-2 text-emerald-400">{message}</div>}
    </div>
  )
}


