import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import Section from '../components/Section'
import { useLocalStorageValue } from '../hooks/useLocalStorageValue'

interface TeamMember {
  id: number
  name?: string
  role?: string
  email?: string
  phone?: string
  skills?: string
  status?: string
}

const Team = () => {
  const members = useLocalStorageValue<TeamMember[]>('admin-team', [])
  const teamHeroTitle = useLocalStorageValue('admin-settings-team-hero-title', 'Meet Our Team')
  const teamHeroDescription = useLocalStorageValue(
    'admin-settings-team-hero-description',
    'The people behind the strategy, design, and development work.'
  )
  const heroWords = teamHeroTitle.trim().split(/\s+/).filter(Boolean)
  const heroLead = heroWords.slice(0, -1).join(' ') || 'Meet Our'
  const heroAccent = heroWords[heroWords.length - 1] || 'Team'

  const activeMembers = members.filter((member) => (member.status || 'Active') === 'Active')

  return (
    <>
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl lg:text-7xl font-bold mb-6"
          >
            {heroLead}{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {heroAccent}
            </span>
          </motion.h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            {teamHeroDescription}
          </p>
        </div>
      </section>

      <Section variant="light">
        {activeMembers.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="p-6 bg-slate-900/50 rounded-2xl border border-white/10 hover:border-blue-500/40 transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xl font-bold mb-4">
                  {(member.name || 'T').charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-semibold text-white">{member.name || 'Team Member'}</h2>
                <p className="text-blue-400 mt-1 mb-4">{member.role || 'Specialist'}</p>

                <div className="flex items-start gap-2 text-slate-300 text-sm">
                  <Briefcase size={16} className="mt-0.5 text-cyan-400" />
                  <p>{member.skills || 'Skills will be updated soon.'}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">No active team profiles yet. Add members in Admin Team.</p>
          </div>
        )}
      </Section>
    </>
  )
}

export default Team
