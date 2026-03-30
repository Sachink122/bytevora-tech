import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import Section from '../components/Section'
import { useLocalStorageValue } from '../hooks/useLocalStorageValue'
import { useEffect, useState } from 'react'

interface TeamMember {
  id: number
  name?: string
  role?: string
  email?: string
  phone?: string
  skills?: string
  status?: string
  created?: string
}

const Team = () => {
  const members = useLocalStorageValue<TeamMember[]>('admin-team', [])
  const defaultContent = {
    teamTitle: 'Meet Our Team',
    teamDescription: 'The people behind the strategy, design, and development work.',
    member1: 'Sachi Sharma – Founder & Lead Developer',
    member2: 'Priya Patel – UI/UX Designer',
    member3: 'Rahul Mehta – Automation Specialist',
    member4: 'Ayesha Khan – Project Manager',
    member5: 'Vikram Singh – Marketing Strategist',
  }
  const [content, setContent] = useState(defaultContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch((import.meta.env.VITE_API_BASE_URL || '') + '/api/content/team')
        if (response.ok) {
          const data = await response.json()
          if (data.content) setContent(JSON.parse(data.content))
        }
      } catch {}
      setLoading(false)
    }
    fetchContent()
  }, [])

  const heroWords = content.teamTitle.trim().split(/\s+/).filter(Boolean)
  const heroLead = heroWords.slice(0, -1).join(' ') || 'Meet Our'
  const heroAccent = heroWords[heroWords.length - 1] || 'Team'


  // Fallback: If no admin table members, use content editor fields (member1, member2, ...)
  let activeMembers = members.filter((member) => (member.status || 'Active') === 'Active')
  const [search, setSearch] = useState('')

  // If no admin table members, use content editor fields
  if (!activeMembers.length) {
    // Extract member fields from content (member1, member2, ...)
    activeMembers = Object.keys(content)
      .filter((key) => key.startsWith('member') && content[key])
      .map((key, idx) => {
        // Try to split name and role if possible
        const [name, role] = content[key].split(' – ')
        return {
          id: idx + 1,
          name: name?.trim() || content[key],
          role: role?.trim() || '',
          email: '',
          phone: '',
          skills: '',
          status: 'Active',
          created: '-',
        }
      })
  }

  const filteredMembers = activeMembers.filter(
    (m) =>
      (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.role || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.phone || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.skills || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <section className="relative pt-32 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl lg:text-6xl font-bold mb-2 text-white">Team</h1>
          <p className="text-lg text-slate-400 mb-8">Maintain your internal team directory.</p>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-96 px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/60">
            <table className="min-w-full divide-y divide-white/10">
              <thead>
                <tr className="bg-slate-900">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Skills</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredMembers.length ? (
                  filteredMembers.map((member, idx) => (
                    <tr key={member.id} className="hover:bg-slate-800/60 transition-all">
                      <td className="px-6 py-4 whitespace-nowrap text-white font-semibold">{member.name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-blue-400">{member.role || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-300">{member.email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-300">{member.phone || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-300">{member.skills || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${member.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                          {member.status || 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400">{member.created || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 text-lg">No active team profiles yet. Add members in Admin Team.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}

export default Team
