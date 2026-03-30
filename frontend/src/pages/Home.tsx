import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Globe,
  Smartphone,
  Zap,
  Target,
  CheckCircle2,
  ShoppingCart,
  LayoutDashboard,
  Wrench,
  MapPin,
  Palette,
  Code,
  Rocket,
  Star,
  MessageCircle,
  Clock,
  TrendingUp,
  Users,
  Award,
  Sparkles,
  HeartHandshake,
  Phone,
  Mail,
  Search,
  Layout as LayoutIcon,
  Image,
  Send,
  ArrowRight,
} from 'lucide-react'
import Button from '../components/Button'
import Section from '../components/Section'
import { useLocalStorageValue } from '../hooks/useLocalStorageValue'

interface PublicPortfolioItem {
  id: number
  title: string
  category: string
  image: string
  projectUrl: string
}

interface PublicTestimonialItem {
  id: number
  name: string
  role?: string
  business?: string
  content?: string
  feedback?: string
  rating?: number
}

interface AdminServiceRecord {
  id: number
  name?: string
  category?: string
  description?: string
  deliveryTime?: string
  basePrice?: string
  status?: string
}

interface AdminPricingRecord {
  id: number
  planName?: string
  price?: string
  billingCycle?: string
  targetUser?: string
  features?: string
  status?: string
}

interface AdminBlogRecord {
  id: number
  title?: string
  summary?: string
  author?: string
  publishDate?: string
  createdAt?: string
  status?: string
}

interface AdminSupportRecord {
  id: number
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const Home = () => {
  const [contactFirstName, setContactFirstName] = useState('')
  const [contactLastName, setContactLastName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactService, setContactService] = useState('')
  const [contactBudget, setContactBudget] = useState('')
  const [contactProjectDetails, setContactProjectDetails] = useState('')
  const [contactSubmitted, setContactSubmitted] = useState(false)


  // Home content state
  const [homeContent, setHomeContent] = useState<any>(null)
  const [isLoadingContent, setIsLoadingContent] = useState(true)
  // API-driven state for dynamic homepage sections
  const [portfolioItems, setPortfolioItems] = useState<PublicPortfolioItem[]>([])
  const [testimonialItems, setTestimonialItems] = useState<PublicTestimonialItem[]>([])
  const [adminServices, setAdminServices] = useState<AdminServiceRecord[]>([])
  const [adminPricing, setAdminPricing] = useState<AdminPricingRecord[]>([])
  const [adminClients, setAdminClients] = useState<any[]>([])
  const [adminSupport, setAdminSupport] = useState<AdminSupportRecord[]>([])

  // Fetch homepage content and all dynamic sections from API
  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Home content
        const contentRes = await fetch(`${API_BASE_URL}/api/content/home`)
        if (contentRes.ok) {
          const data = await contentRes.json()
          if (data.content) setHomeContent(JSON.parse(data.content))
        }
      } catch {}
      setIsLoadingContent(false)

      // Portfolio
      try {
        const res = await fetch(`${API_BASE_URL}/api/portfolio`)
        if (res.ok) {
          const data = await res.json()
          setPortfolioItems(data.items || [])
        }
      } catch {}

      // Testimonials (if you have an endpoint, otherwise fallback)
      try {
        const res = await fetch(`${API_BASE_URL}/api/testimonials`)
        if (res.ok) {
          const data = await res.json()
          setTestimonialItems(data.items || [])
        }
      } catch {}

      // Services
      try {
        const res = await fetch(`${API_BASE_URL}/api/services`)
        if (res.ok) {
          const data = await res.json()
          setAdminServices(data.items || [])
        }
      } catch {}

      // Pricing
      try {
        const res = await fetch(`${API_BASE_URL}/api/pricing`)
        if (res.ok) {
          const data = await res.json()
          setAdminPricing(data.items || [])
        }
      } catch {}

      // Clients
      try {
        const res = await fetch(`${API_BASE_URL}/api/clients`)
        if (res.ok) {
          const data = await res.json()
          setAdminClients(data.items || [])
        }
      } catch {}

      // Support
      try {
        const res = await fetch(`${API_BASE_URL}/api/support`)
        if (res.ok) {
          const data = await res.json()
          setAdminSupport(data.items || [])
        }
      } catch {}
    }
    fetchAll()
  }, [])

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/content/home`)
        if (response.ok) {
          const data = await response.json()
          if (data.content) {
            setHomeContent(JSON.parse(data.content))
            setIsLoadingContent(false)
            return
          }
        }
      } catch {}
      // Fallback to localStorage if API fails or no content
      try {
        const local = localStorage.getItem('admin-home')
        if (local) setHomeContent(JSON.parse(local))
      } catch {}
      setIsLoadingContent(false)
    }
    fetchContent()
  }, [])

  // Example: fallback values if no content
  const fallback = {
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
  const content = homeContent || fallback
  const normalizedPhone = content.phoneNumber.replace(/[^\d+]/g, '')
  const normalizedWhatsApp = (content.whatsAppNumber || content.phoneNumber).replace(/[^\d]/g, '')
  const homeContactTitleWords = (content.homeContactTitle || "Let's Start a Conversation").trim().split(/\s+/).filter(Boolean)
  const homeContactTitleLead = homeContactTitleWords.slice(0, -1).join(' ') || "Let's Start a"
  const homeContactTitleAccent = homeContactTitleWords[homeContactTitleWords.length - 1] || 'Conversation'

  const fallbackServices = [
    {
      icon: <Globe className="text-blue-500" size={32} />,
      title: 'Business Website Development',
      description: 'Professional, conversion-focused websites that establish your brand and drive results.',
    },
    {
      icon: <LayoutIcon className="text-cyan-500" size={32} />,
      title: 'Landing Page Design',
      description: 'High-impact landing pages optimized for conversions and lead generation.',
    },
    {
      icon: <Image className="text-purple-500" size={32} />,
      title: 'Portfolio Website Design',
      description: 'Showcase your work beautifully with custom portfolio websites for creatives.',
    },
    {
      icon: <ShoppingCart className="text-pink-500" size={32} />,
      title: 'E-commerce Solutions',
      description: 'Complete online stores with payment integration, inventory management, and more.',
    },
    {
      icon: <LayoutDashboard className="text-green-500" size={32} />,
      title: 'Custom Dashboard / CRM',
      description: 'Powerful custom dashboards and CRM systems to manage your business efficiently.',
    },
    {
      icon: <Wrench className="text-orange-500" size={32} />,
      title: 'Website Maintenance',
      description: 'Ongoing support, updates, and maintenance to keep your website running smoothly.',
    },
    {
      icon: <MapPin className="text-red-500" size={32} />,
      title: 'Google Business Profile',
      description: 'Get found locally with optimized Google Business Profile setup and management.',
    },
    {
      icon: <Palette className="text-indigo-500" size={32} />,
      title: 'Branding & UI/UX Design',
      description: 'Complete brand identity and user experience design that stands out.',
    },
  ]

  const whyChooseUs = [
    {
      icon: <Award className="text-blue-500" size={28} />,
      title: 'Premium Modern UI',
      description: 'Stunning, contemporary designs that captivate your audience.',
    },
    {
      icon: <Target className="text-cyan-500" size={28} />,
      title: 'Business-Oriented',
      description: 'Every design decision focused on your business goals.',
    },
    {
      icon: <Zap className="text-yellow-500" size={28} />,
      title: 'Fast & Responsive',
      description: 'Lightning-fast websites that work perfectly on all devices.',
    },
    {
      icon: <TrendingUp className="text-green-500" size={28} />,
      title: 'Scalable Solutions',
      description: 'Grow with solutions that scale as your business expands.',
    },
    {
      icon: <HeartHandshake className="text-purple-500" size={28} />,
      title: 'End-to-End Support',
      description: 'From concept to launch and beyond, we are with you.',
    },
    {
      icon: <Sparkles className="text-pink-500" size={28} />,
      title: 'Custom Solutions',
      description: 'Tailored specifically to your unique business needs.',
    },
  ]

  // Portfolio section (show up to 6)
  const portfolio = (portfolioItems || []).slice(0, 6).map((item) => ({
    title: item.title,
    category: item.category,
    description: `Explore details of ${item.title}.`,
    image: item.image,
    projectUrl: item.projectUrl,
  }))

  const process = [
    {
      step: '01',
      title: 'Discovery',
      icon: <Search className="text-blue-500" size={32} />,
      description: 'We learn about your business, goals, target audience, and requirements.',
    },
    {
      step: '02',
      title: 'Strategy & Planning',
      icon: <LayoutIcon className="text-cyan-500" size={32} />,
      description: 'Creating a roadmap, wireframes, and detailed project plan.',
    },
    {
      step: '03',
      title: 'Design & Development',
      icon: <Code className="text-purple-500" size={32} />,
      description: 'Building your solution with clean code and stunning design.',
    },
    {
      step: '04',
      title: 'Launch & Support',
      icon: <Rocket className="text-green-500" size={32} />,
      description: 'Deploying your project and providing ongoing support.',
    },
  ]

  const fallbackPricing = [
    {
      name: 'Starter',
      price: '$499',
      description: 'Perfect for small businesses getting started online.',
      features: [
        '1-page website',
        'Mobile responsive',
        'Contact form',
        'Basic SEO structure',
        'Fast delivery',
      ],
      popular: false,
    },
    {
      name: 'Business',
      price: '$999',
      description: 'Ideal for growing businesses needing more features.',
      features: [
        '3-5 pages website',
        'Premium design',
        'WhatsApp/chat integration',
        'SEO basics',
        'Domain & hosting support',
        'Contact forms',
        'Social media links',
      ],
      popular: true,
    },
    {
      name: 'Premium',
      price: '$1,999',
      description: 'Complete custom solution for established businesses.',
      features: [
        'Custom website/web app',
        'Advanced features',
        'Dashboard/CRM or booking system',
        'Performance optimization',
        'Premium support',
        'Priority delivery',
        'Analytics integration',
        'Maintenance included',
      ],
      popular: false,
    },
  ]

  // Testimonials section
  const testimonials = (testimonialItems || []).map((item) => ({
    name: item.name,
    role: item.role || item.business || 'Client',
    content: item.content || item.feedback || '',
    rating: item.rating && item.rating > 0 ? item.rating : 5,
  }))

  const faqs: { question: string; answer: string }[] = [
    {
      question: 'How long does a website take?',
      answer: 'Timeline varies based on project complexity. A simple 1-page website takes 3-5 days, while custom web apps may take 2-4 weeks. We provide clear timelines during our initial consultation.',
    },
    {
      question: 'Do you provide domain and hosting setup?',
      answer: 'Yes! We handle everything - domain registration, hosting setup, SSL certificates, and DNS configuration. Your website will be fully hosted and ready to go.',
    },
    {
      question: 'Is the website mobile responsive?',
      answer: 'Absolutely. Every website we build is fully responsive and optimized for all devices - desktop, tablet, and mobile. Your visitors get a perfect experience everywhere.',
    },
    {
      question: 'Do you offer maintenance?',
      answer: 'Yes, we offer ongoing maintenance packages including updates, security monitoring, backups, and content updates. Keep your website secure and up-to-date worry-free.',
    },
    {
      question: 'Can you redesign an old website?',
      answer: 'Definitely! We specialize in website redesigns. We will modernize your existing site, improve performance, enhance user experience, and boost conversions.',
    },
    {
      question: 'Can you build custom dashboards or CRM systems?',
      answer: 'Yes, custom dashboards and CRM systems are one of our specialties. We build powerful, intuitive systems tailored to your specific business workflows and requirements.',
    },
  ]

  // Active projects and open support tickets
  const activeProjectCount = (adminClients || []).filter((item) => item.project && !item.projectCompleted).length
  const openSupportCount = (adminSupport || []).filter((item) => (item.status || '') === 'Open').length

  const serviceOptions = (adminServices && adminServices.length)
    ? adminServices
        .filter((item) => (item.status || 'Active') !== 'Archived')
        .map((item) => item.name || item.category || 'Service')
    : [
        'Business Website',
        'Landing Page',
        'Portfolio Website',
        'E-commerce',
        'Custom Dashboard',
        'Other',
      ]

  const handleHomeContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const fullName = `${contactFirstName} ${contactLastName}`.trim()
    const messageSubject = `Website inquiry${contactService ? ` - ${contactService}` : ''}`

    try {
      const rawLeads = window.localStorage.getItem('admin-leads')
      const leads = rawLeads ? (JSON.parse(rawLeads) as LeadRecord[]) : []
      const nextLead: LeadRecord = {
        id: leads.length ? Math.max(...leads.map((item) => item.id)) + 1 : 1,
        name: fullName || 'New Contact',
        business: contactBudget
          ? `Homepage Contact Form (Budget: ${contactBudget})`
          : 'Homepage Contact Form',
        service: contactService || 'Other',
        email: contactEmail,
        phone: contactPhone || '-',
        date: new Date().toISOString().split('T')[0],
        status: 'New',
        priority: 'Medium',
      }
      window.localStorage.setItem('admin-leads', JSON.stringify([nextLead, ...leads]))

      window.dispatchEvent(new CustomEvent('local-storage-update', { detail: { key: 'admin-leads' } }))

      setContactSubmitted(true)
      setContactFirstName('')
      setContactLastName('')
      setContactEmail('')
      setContactPhone('')
      setContactService('')
      setContactBudget('')
      setContactProjectDetails('')
    } catch {
      alert('Could not send right now. Please try again.')
    }
  }

  const serviceIcons = [
    <Globe className="text-blue-500" size={32} />,
    <LayoutIcon className="text-cyan-500" size={32} />,
    <Image className="text-purple-500" size={32} />,
    <ShoppingCart className="text-pink-500" size={32} />,
    <LayoutDashboard className="text-green-500" size={32} />,
    <Wrench className="text-orange-500" size={32} />,
    <MapPin className="text-red-500" size={32} />,
    <Palette className="text-indigo-500" size={32} />,
  ]

  const services = (adminServices && adminServices.length)
    ? adminServices
        .filter((service) => (service.status || 'Active') !== 'Archived')
        .map((service, index) => ({
          icon: serviceIcons[index % serviceIcons.length],
          title: service.name || service.category || 'Service',
          description:
            service.description ||
            `${service.category || 'Digital'} service tailored for measurable business growth.`,
        }))
    : fallbackServices

  const pricing = (adminPricing && adminPricing.length)
    ? adminPricing
        .filter((plan) => (plan.status || 'Draft') !== 'Archived')
        .map((plan, index) => {
          const parsedFeatures = (plan.features || '')
            .split(/\n|,/) 
            .map((item) => item.trim())
            .filter(Boolean)

          return {
            name: plan.planName || `Plan ${index + 1}`,
            price: plan.price || 'Custom',
            description: plan.targetUser || 'Designed for growing businesses.',
            features: parsedFeatures.length
              ? parsedFeatures
              : [
                  `Billing: ${plan.billingCycle || 'One-time'}`,
                  'Custom scope based on your requirements',
                  'Consultation and implementation support',
                ],
            popular: index === 1,
          }
        })
    : fallbackPricing

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full"
              >
                <Sparkles className="text-blue-400 mr-2" size={18} />
                <span className="text-blue-300 font-medium">{content.tagline}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-5xl lg:text-7xl font-bold leading-tight"
              >
                {content.homeHeroPrefix}{' '}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {content.homeHeroHighlight}
                </span>{' '}
                {content.homeHeroSuffix} {content.agencyName}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-slate-300 leading-relaxed"
              >
                {content.agencyDescription}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button href="/contact" size="lg">{content.homePrimaryCtaText || 'Join Us'}</Button>
                <Button href="/portfolio" variant="secondary" size="lg">{content.homeSecondaryCtaText || 'View Portfolio'}</Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-6 pt-4"
              >
                {[
                  { icon: <Zap size={20} />, text: 'Fast Delivery' },
                  { icon: <Palette size={20} />, text: 'Modern Design' },
                  { icon: <Smartphone size={20} />, text: 'Mobile Responsive' },
                  { icon: <Target size={20} />, text: 'Business Focused' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 text-slate-300">
                    <span className="text-blue-400">{item.icon}</span>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <div className="text-sm text-slate-400">Dashboard</div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg" />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-24 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-lg" />
                      <div className="h-24 bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 rounded-lg" />
                      <div className="h-24 bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-lg" />
                    </div>
                    <div className="h-32 bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg" />
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-8 -right-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 shadow-xl border border-blue-400/20"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{activeProjectCount}</div>
                      <div className="text-xs text-blue-200">Active projects</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-6 -left-8 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-4 shadow-xl border border-cyan-400/20"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Users className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{openSupportCount}</div>
                      <div className="text-xs text-cyan-200">Open tickets</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust/Social Proof Section */}
      <Section variant="light">
        <div className="text-center space-y-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-lg"
          >
            Built for businesses that want a reliable digital foundation
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              'Conversion-focused designs',
              'Responsive on all devices',
              'Scalable digital solutions',
              'Clean professional branding',
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center space-x-2 p-4 bg-white/5 rounded-xl border border-white/10">
                <CheckCircle2 className="text-blue-500" size={20} />
                <span className="text-slate-300 font-medium">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Services Section */}
      <Section id="services">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold mb-6"
          >
            Our{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Services
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            Comprehensive digital solutions tailored to help your business thrive in
            the modern marketplace.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group p-6 bg-slate-900/50 rounded-2xl border border-white/10 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button href="/services" variant="secondary" size="lg">View All Services</Button>
        </div>
      </Section>

      {/* Why Choose Us Section */}
      <Section variant="gradient" id="why-us">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold mb-6"
          >
            Why Choose{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Our Team
            </span>
            ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            We combine creativity, technology, and business acumen to deliver
            exceptional results.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseUs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-slate-900/50 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-slate-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Portfolio Section */}
      <Section id="portfolio">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold mb-6"
          >
            Featured{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Projects
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            Explore our latest work and see how we've helped businesses succeed
            online.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolio.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <div className="h-64 rounded-2xl mb-4 relative overflow-hidden bg-slate-900/70 border border-white/10">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">No Image</div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      if (project.projectUrl) {
                        window.open(project.projectUrl, '_blank', 'noopener,noreferrer')
                      }
                    }}
                  >
                    View Project
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-blue-400 text-sm font-medium">{project.category}</span>
                <h3 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {portfolio.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">Featured projects will appear here after launch.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button href="/portfolio" variant="secondary" size="lg">View All Projects</Button>
        </div>
      </Section>

      {/* Process Section */}
      <Section variant="light" id="process">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold mb-6"
          >
            How We{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Work
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            A streamlined process designed to deliver exceptional results on time
            and within budget.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {process.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="text-8xl font-bold text-slate-800 absolute -top-4 -left-2">
                {step.step}
              </div>
              <div className="relative pt-12">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section variant="light" id="testimonials">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold mb-6"
          >
            What Our{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Clients Say
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            Don't just take our word for it. Here's what our clients have to say.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-slate-900/50 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-500 fill-yellow-500" size={20} />
                ))}
              </div>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div>
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-slate-400">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">Client testimonials will be published once available.</p>
          </div>
        )}
      </Section>

      {/* FAQ Section */}
      <Section id="faq">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold mb-6"
          >
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="p-6 bg-slate-900/50 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold mb-3 text-blue-400">
                {faq.question}
              </h3>
              <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section variant="gradient">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold mb-6"
          >
            Ready to Build Your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Online Presence
            </span>
            ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 mb-8"
          >
            Let's create something amazing together. Contact {content.agencyName || 'our team'} today for a
            modern digital solution that drives real results.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button href="/contact" size="lg">Start Your Project</Button>
            <Button
              href={normalizedWhatsApp ? `https://wa.me/${normalizedWhatsApp}` : '/contact'}
              variant="whatsapp"
              size="lg"
              onClick={() => {
                if (normalizedWhatsApp) {
                  window.open(`https://wa.me/${normalizedWhatsApp}`, '_blank', 'noopener,noreferrer')
                }
              }}
            >
              Chat on WhatsApp
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section id="contact">
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              {homeContactTitleLead}{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {homeContactTitleAccent}
              </span>
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              {content.homeContactDescription}
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Mail className="text-blue-500" size={24} />
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Email Us</div>
                  <a
                    href={content.businessEmail ? `mailto:${content.businessEmail}` : '#'}
                    className="text-white font-semibold hover:text-blue-400 transition-colors"
                  >
                    {content.businessEmail || 'bytevora1tech@gmail.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Phone className="text-blue-500" size={24} />
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Call Us</div>
                  <a
                    href={normalizedPhone ? `tel:${normalizedPhone}` : '#'}
                    className="text-white font-semibold hover:text-blue-400 transition-colors"
                  >
                    {content.phoneNumber || '8668398960'}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="text-green-500" size={24} />
                </div>
                <div>
                  <div className="text-slate-400 text-sm">WhatsApp</div>
                  <a
                    href={normalizedWhatsApp ? `https://wa.me/${normalizedWhatsApp}` : '#'}
                    className="text-white font-semibold hover:text-green-400 transition-colors"
                  >
                    {content.whatsAppNumber || content.phoneNumber || '8668398960'}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <Clock className="text-blue-400 inline mr-2" size={18} />
              <span className="text-slate-300">
                Business Hours: Mon - Fri, 9:00 AM - 6:00 PM
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleHomeContactSubmit} className="space-y-6">
              {contactSubmitted && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-300 text-sm">
                  Thank you. Your inquiry has been submitted and is now visible in Admin Leads.
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactFirstName}
                    onChange={(event) => setContactFirstName(event.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white placeholder-slate-500"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactLastName}
                    onChange={(event) => setContactLastName(event.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white placeholder-slate-500"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(event) => setContactEmail(event.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white placeholder-slate-500"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(event) => setContactPhone(event.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white placeholder-slate-500"
                  placeholder="Your contact number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Service Interested In
                </label>
                <select
                  required
                  value={contactService}
                  onChange={(event) => setContactService(event.target.value)}
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
                  Your Budget Range
                </label>
                <input
                  type="text"
                  value={contactBudget}
                  onChange={(event) => setContactBudget(event.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white placeholder-slate-500"
                  placeholder="Approximate budget (e.g. ₹50k - ₹1L)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactProjectDetails}
                  onChange={(event) => setContactProjectDetails(event.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white placeholder-slate-500 resize-none"
                  placeholder="Tell us about your project..."
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
    </>
  )
}

export default Home