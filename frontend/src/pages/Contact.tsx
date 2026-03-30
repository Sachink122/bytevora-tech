import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, CheckCircle2 } from 'lucide-react'
import Button from '../components/Button'
import Section from '../components/Section'
import { useLocalStorageValue } from '../hooks/useLocalStorageValue'

interface AdminServiceRecord {
  id: number
  name?: string
  category?: string
  status?: string
}

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
}

const Contact = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState('')
  const [budget, setBudget] = useState('')
  const [projectDetails, setProjectDetails] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const businessEmail = useLocalStorageValue('admin-settings-business-email', 'bytevora1tech@gmail.com')
  const phoneNumber = useLocalStorageValue('admin-settings-phone', '8668398960')
  const whatsAppNumber = useLocalStorageValue('admin-settings-whatsapp', '8668398960')
  const businessAddress = useLocalStorageValue('admin-settings-address', 'Panvel, Maharashtra, India')
  const adminServices = useLocalStorageValue<AdminServiceRecord[]>('admin-services', [])
  const facebookUrl = useLocalStorageValue('admin-settings-facebook', '')
  const twitterUrl = useLocalStorageValue('admin-settings-twitter', '')
  const instagramUrl = useLocalStorageValue('admin-settings-instagram', '')
  const linkedinUrl = useLocalStorageValue('admin-settings-linkedin', '')
  const contactHeroTitle = useLocalStorageValue('admin-settings-contact-hero-title', "Let's Connect")
  const contactHeroDescription = useLocalStorageValue(
    'admin-settings-contact-hero-description',
    "Ready to transform your digital presence? Get in touch and let's discuss how we can help your business grow."
  )

  const normalizedPhone = phoneNumber.replace(/[^\d+]/g, '')
  const normalizedWhatsApp = (whatsAppNumber || phoneNumber).replace(/[^\d]/g, '')
  const heroWords = contactHeroTitle.trim().split(/\s+/).filter(Boolean)
  const heroLead = heroWords.slice(0, -1).join(' ') || "Let's"
  const heroAccent = heroWords[heroWords.length - 1] || 'Connect'

  const contactInfo = [
    {
      icon: <Mail className="text-blue-500" size={28} />,
      title: 'Email Us',
      value: businessEmail || 'bytevora1tech@gmail.com',
      link: businessEmail ? `mailto:${businessEmail}` : '#',
      description: 'We respond within 24 hours',
    },
    {
      icon: <Phone className="text-cyan-500" size={28} />,
      title: 'Call Us',
      value: phoneNumber || '8668398960',
      link: normalizedPhone ? `tel:${normalizedPhone}` : '#',
      description: 'Mon - Fri, 9AM - 6PM',
    },
    {
      icon: <MessageCircle className="text-green-500" size={28} />,
      title: 'WhatsApp',
      value: whatsAppNumber || phoneNumber || '8668398960',
      link: normalizedWhatsApp ? `https://wa.me/${normalizedWhatsApp}` : '#',
      description: 'Instant messaging support',
    },
    {
      icon: <MapPin className="text-purple-500" size={28} />,
      title: 'Location',
      value: businessAddress || 'Panvel, Maharashtra, India',
      link: '#',
      description: 'Serving clients worldwide',
    },
  ]

  const faqs = [
    {
      question: 'How quickly will you respond to my inquiry?',
      answer:
        'We typically respond to all inquiries within 24 hours. For urgent matters, feel free to reach out via WhatsApp for faster response.',
    },
    {
      question: 'Do I need to prepare anything before contacting you?',
      answer:
        "It helps if you have a basic idea of what you're looking for. Think about your goals, budget range, and timeline. But don't worry - we'll guide you through everything during our call.",
    },
    {
      question: 'Is the initial consultation free?',
      answer:
        'Yes! Our initial consultation is completely free. We\'ll discuss your project, answer your questions, and provide recommendations with no obligation.',
    },
  ]

  const serviceOptions = adminServices.length
    ? adminServices
        .filter((item) => (item.status || 'Active') !== 'Archived')
        .map((item) => item.name || item.category || 'Service')
    : [
        'Business Website',
        'Landing Page',
        'Portfolio Website',
        'E-commerce',
        'Custom Dashboard/CRM',
        'Website Maintenance',
        'Branding & UI/UX',
        'Other',
      ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const fullName = `${firstName} ${lastName}`.trim()
    const messageSubject = `Website inquiry${service ? ` - ${service}` : ''}`
    const messageBody = `Budget: ${budget || 'Not specified'}\n\n${projectDetails}`

    try {
      const rawLeads = window.localStorage.getItem('admin-leads')
      const leads = rawLeads ? (JSON.parse(rawLeads) as LeadRecord[]) : []
      const nextLead: LeadRecord = {
        id: leads.length ? Math.max(...leads.map((item) => item.id)) + 1 : 1,
        name: fullName || firstName || 'New Contact',
        business: 'Website Contact Form',
        service: service || 'Other',
        email,
        phone: phone || '-',
        date: new Date().toISOString().split('T')[0],
        status: 'New',
        priority: 'Medium',
      }
      window.localStorage.setItem('admin-leads', JSON.stringify([nextLead, ...leads]))

      window.dispatchEvent(new CustomEvent('local-storage-update', { detail: { key: 'admin-leads' } }))

      setSubmitted(true)
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setService('')
      setBudget('')
      setProjectDetails('')
    } catch {
      alert('Could not send right now. Please try again.')
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl text-center"
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              {heroLead}{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {heroAccent}
              </span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              {contactHeroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <Section variant="light">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <motion.a
              key={index}
              href={info.link}
              target={info.link.startsWith('http') ? '_blank' : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="block p-6 bg-slate-900/50 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all"
            >
              <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-4">
                {info.icon}
              </div>
              <h3 className="text-lg font-semibold mb-1">{info.title}</h3>
              <p className="text-blue-400 font-medium mb-1">{info.value}</p>
              <p className="text-slate-400 text-sm">{info.description}</p>
            </motion.a>
          ))}
        </div>
      </Section>

      {/* Contact Form Section */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Tell Us About Your{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Project
              </span>
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <Clock className="text-blue-500 inline mr-2" size={18} />
                <span className="text-slate-300">
                  Average response time: Less than 24 hours
                </span>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <CheckCircle2 className="text-green-500 inline mr-2" size={18} />
                <span className="text-slate-300">
                  Free consultation for all new inquiries
                </span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {[
                  { label: 'Facebook', href: facebookUrl },
                  { label: 'Twitter', href: twitterUrl },
                  { label: 'Instagram', href: instagramUrl },
                  { label: 'LinkedIn', href: linkedinUrl },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href || '#'}
                    target={social.href ? '_blank' : undefined}
                    rel={social.href ? 'noopener noreferrer' : undefined}
                    className="w-12 h-12 bg-slate-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <span className="text-sm font-medium">{social.label[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitted && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-300 text-sm">
                  Thank you. Your inquiry has been submitted and is now visible in Admin Leads.
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white placeholder-slate-500"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white placeholder-slate-500"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white placeholder-slate-500"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white placeholder-slate-500"
                  placeholder="+1 (234) 567-890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Service Interested In *
                </label>
                <select
                  required
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white"
                >
                  <option value="">Select a service</option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Budget Range
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white placeholder-slate-500"
                  placeholder="Approximate budget (e.g. ₹50k - ₹1L)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Details *
                </label>
                <textarea
                  required
                  rows={5}
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white placeholder-slate-500 resize-none"
                  placeholder="Tell us about your project, goals, and timeline..."
                />
              </div>

              <Button type="submit" fullWidth size="lg">
                <Send size={20} className="mr-2" />
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section variant="light">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-slate-900/50 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all"
            >
              <h3 className="text-lg font-semibold mb-3 text-blue-400">
                {faq.question}
              </h3>
              <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Prefer to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Chat Directly
            </span>
            ?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Reach out on WhatsApp for instant communication and faster response
            times.
          </p>
          <Button
            href={`https://wa.me/${normalizedWhatsApp || '8668398960'}`}
            variant="whatsapp"
            size="lg"
            onClick={() => {
              if (normalizedWhatsApp) {
                window.open(`https://wa.me/${normalizedWhatsApp}`, '_blank')
              }
            }}
          >
            Chat on WhatsApp
          </Button>
        </div>
      </Section>
    </>
  )
}

export default Contact