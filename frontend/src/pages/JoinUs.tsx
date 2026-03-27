import { useState } from 'react'
import { CheckCircle2, Users, Briefcase } from 'lucide-react'
import { useLocalStorageValue } from '../hooks/useLocalStorageValue'

interface LeadRecord {
  id: number
  name: string
  business: string
  service: string
  email: string
  phone: string
  date: string
  status: string
  priority: string
}

interface MessageRecord {
  id: number
  createdAt: string
  status: string
  senderName: string
  email: string
  subject: string
  channel: string
  message: string
  phone?: string
  role?: string
  skills?: string
  portfolioUrl?: string
  aboutYou?: string
}

const JoinUs = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [skills, setSkills] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [aboutYou, setAboutYou] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const agencyName = useLocalStorageValue('admin-settings-agency-name', 'Bytevora Tech')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const fullName = `${firstName} ${lastName}`.trim() || firstName || 'New Applicant'
    const roleLabel = role || 'General Application'
    const messageSubject = `Join Us Application - ${roleLabel}`
    const messageBody = [
      `Role / Interest: ${roleLabel}`,
      `Skills / Expertise: ${skills || 'Not specified'}`,
      `Portfolio: ${portfolioUrl || 'Not provided'}`,
      '',
      aboutYou || 'No additional details provided.',
    ].join('\n')

    try {
      const rawLeads = window.localStorage.getItem('admin-leads')
      const leads = rawLeads ? (JSON.parse(rawLeads) as LeadRecord[]) : []
      const nextLead: LeadRecord = {
        id: leads.length ? Math.max(...leads.map((item) => item.id)) + 1 : 1,
        name: fullName,
        business: 'Join Us Form',
        service: roleLabel,
        email,
        phone: phone || '-',
        date: new Date().toISOString().split('T')[0],
        status: 'New',
        priority: 'Medium',
      }
      window.localStorage.setItem('admin-leads', JSON.stringify([nextLead, ...leads]))

      const rawMessages = window.localStorage.getItem('admin-messages')
      const messages = rawMessages ? (JSON.parse(rawMessages) as MessageRecord[]) : []
      const nextMessage: MessageRecord = {
        id: messages.length ? Math.max(...messages.map((item) => item.id)) + 1 : 1,
        createdAt: new Date().toISOString(),
        status: 'New',
        senderName: fullName,
        email,
        subject: messageSubject,
        channel: 'Join Us Form',
        message: messageBody,
        phone: phone || '-',
        role: roleLabel,
        skills,
        portfolioUrl,
        aboutYou,
      }
      window.localStorage.setItem('admin-messages', JSON.stringify([nextMessage, ...messages]))

      window.dispatchEvent(new CustomEvent('local-storage-update', { detail: { key: 'admin-leads' } }))
      window.dispatchEvent(new CustomEvent('local-storage-update', { detail: { key: 'admin-messages' } }))

      setSubmitted(true)
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setRole('')
      setSkills('')
      setPortfolioUrl('')
      setAboutYou('')
    } catch {
      alert('Could not send right now. Please try again.')
    }
  }

  return (
    <div className="relative pt-32 pb-20 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 text-center mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Join <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">{agencyName}</span>
          </h1>
          <p className="text-lg text-slate-300">
            We collaborate with designers, developers, marketers, and operators who care about clean execution and real business results.
            Share your details and we&apos;ll reach out when there&apos;s a strong fit.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="text-blue-400" size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Who we work with</h2>
                  <p className="text-slate-400 text-sm">Independent experts, freelancers, and small teams.</p>
                </div>
              </div>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 mt-0.5" size={18} />
                  <span>UI/UX designers, web developers, automation thinkers, content and performance marketers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 mt-0.5" size={18} />
                  <span>People comfortable owning outcomes and collaborating directly with clients.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 mt-0.5" size={18} />
                  <span>Those who prefer clear scopes, practical work, and honest communication.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <Briefcase className="text-cyan-400" size={22} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">What to expect</h3>
                <p className="text-slate-400 text-sm mb-2">
                  We maintain a small network and reach out when a project or collaboration really matches your profile.
                </p>
                <p className="text-slate-400 text-sm">
                  Please share clear, specific information so we can understand how you like to work and where you create the most impact.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 lg:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Join Us Form</h2>
              {submitted && (
                <span className="inline-flex items-center text-sm text-green-400">
                  <CheckCircle2 size={18} className="mr-1" />
                  Sent
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="Sachin"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="Kumar"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Contact Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="8668398960"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">Primary Role / Interest</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Frontend Development">Frontend Development</option>
                  <option value="Backend / APIs">Backend / APIs</option>
                  <option value="No-Code / Automation">No-Code / Automation</option>
                  <option value="Content / Marketing">Content / Marketing</option>
                  <option value="Project Operations">Project Operations</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">Key Skills / Tools</label>
                <textarea
                  rows={3}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all resize-none"
                  placeholder="Figma, React, Next.js, Webflow, SEO, performance marketing, automation tools, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">Portfolio / Work Links (optional)</label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="Portfolio, LinkedIn, GitHub or case studies"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">Tell us about how you like to work</label>
                <textarea
                  rows={4}
                  value={aboutYou}
                  onChange={(e) => setAboutYou(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all resize-none"
                  placeholder="Share how you approach projects, communication, timelines, and the kind of collaborations you prefer."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Submit Application
              </button>

              <p className="text-xs text-slate-500 mt-3">
                We&apos;ll review your details and reach out only when there&apos;s a relevant opportunity. No spam.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JoinUs
