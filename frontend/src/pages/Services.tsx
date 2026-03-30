import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Clock, TrendingUp, Shield, Zap } from 'lucide-react'
import Button from '../components/Button'
import Section from '../components/Section'
import { useLocalStorageValue } from '../hooks/useLocalStorageValue'

interface AdminServiceRecord {
  id: number
  name?: string
  category?: string
  description?: string
  deliveryTime?: string
  basePrice?: string
  status?: string
}

interface ServiceViewModel {
  icon: string
  title: string
  description: string
  features: string[]
  process: string[]
}

const parseJsonWithFallback = <T,>(raw: string, fallback: T): T => {
  if (!raw.trim()) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

const Services = () => {
  const defaultServices: ServiceViewModel[] = [
    {
      icon: '🌐',
      title: 'Business Website Development',
      description:
        'Professional, conversion-focused websites that establish your brand and drive results. Perfect for businesses looking to make a strong online impression.',
      features: [
        'Custom design tailored to your brand',
        'Mobile-responsive layouts',
        'SEO-optimized structure',
        'Fast loading speeds',
        'Contact forms integration',
        'Social media links',
      ],
      process: [
        'Discovery call to understand your business',
        'Design mockups and approval',
        'Development and content integration',
        'Testing and quality assurance',
        'Launch and deployment',
      ],
    },
    {
      icon: '🎯',
      title: 'Landing Page Design',
      description:
        'High-impact landing pages optimized for conversions and lead generation. Ideal for marketing campaigns, product launches, and special promotions.',
      features: [
        'Attention-grabbing headlines',
        'Clear call-to-action buttons',
        'A/B testing ready',
        'Lead capture forms',
        'Analytics integration',
        'Mobile-first design',
      ],
      process: [
        'Campaign goal analysis',
        'Copywriting and messaging',
        'Visual design development',
        'Conversion optimization',
        'Launch and monitoring',
      ],
    },
    {
      icon: '📸',
      title: 'Portfolio Website Design',
      description:
        'Showcase your work beautifully with custom portfolio websites designed for photographers, designers, artists, and creative professionals.',
      features: [
        'Stunning image galleries',
        'Category filtering',
        'Lightbox image viewing',
        'Client testimonials section',
        'Contact inquiry forms',
        'Social sharing integration',
      ],
      process: [
        'Portfolio content organization',
        'Visual style development',
        'Gallery functionality setup',
        'Mobile responsiveness testing',
        'Launch with SEO basics',
      ],
    },
    {
      icon: '🛒',
      title: 'E-commerce Solutions',
      description:
        'Complete online stores with payment integration, inventory management, and all the features you need to sell products online successfully.',
      features: [
        'Secure payment gateways',
        'Inventory management',
        'Order tracking system',
        'Customer accounts',
        'Product reviews',
        'Shipping calculator',
      ],
      process: [
        'Product catalog setup',
        'Payment integration',
        'Shopping cart development',
        'Security testing',
        'Launch and training',
      ],
    },
    {
      icon: '📊',
      title: 'Custom Dashboard / CRM',
      description:
        'Powerful custom dashboards and CRM systems to manage your business efficiently. Track leads, manage customers, and visualize your data.',
      features: [
        'Custom data visualization',
        'Lead management system',
        'Customer database',
        'Task and project tracking',
        'Report generation',
        'User role management',
      ],
      process: [
        'Workflow analysis',
        'Database architecture design',
        'Dashboard UI development',
        'Integration with existing tools',
        'Testing and deployment',
      ],
    },
    {
      icon: '🔧',
      title: 'Website Maintenance & Support',
      description:
        'Ongoing support, updates, and maintenance to keep your website running smoothly and securely. Focus on your business while we handle the technical details.',
      features: [
        'Regular security updates',
        'Performance monitoring',
        'Content updates',
        'Backup management',
        'Technical support',
        'Uptime monitoring',
      ],
      process: [
        'Website audit and assessment',
        'Maintenance schedule setup',
        'Monitoring implementation',
        'Regular reporting',
        'Continuous optimization',
      ],
    },
    {
      icon: '📍',
      title: 'Google Business Profile Setup',
      description:
        'Get found locally with optimized Google Business Profile setup and management. Improve your local SEO and attract customers in your area.',
      features: [
        'Profile creation and verification',
        'Business information optimization',
        'Photo and video uploads',
        'Review management setup',
        'Post scheduling',
        'Performance tracking',
      ],
      process: [
        'Business information gathering',
        'Profile creation',
        'Verification process',
        'Content optimization',
        'Ongoing management',
      ],
    },
    {
      icon: '🎨',
      title: 'Branding & UI/UX Design',
      description:
        'Complete brand identity and user experience design that stands out. From logos to complete design systems, we create brands that resonate.',
      features: [
        'Logo design',
        'Color palette development',
        'Typography selection',
        'Brand guidelines',
        'UI component library',
        'User experience research',
      ],
      process: [
        'Brand discovery session',
        'Concept development',
        'Design iterations',
        'Final asset delivery',
        'Brand guidelines documentation',
      ],
    },
  ]

  const servicesHeroTitle = useLocalStorageValue('admin-settings-services-hero-title', 'Our Services')
  const servicesHeroDescription = useLocalStorageValue(
    'admin-settings-services-hero-description',
    'Comprehensive digital solutions tailored to help your business thrive in the modern marketplace. From stunning websites to powerful custom systems.'
  )
  const adminServices = useLocalStorageValue<AdminServiceRecord[]>('admin-services', [])
  const servicesJson = useLocalStorageValue('admin-settings-services-json', '')
  const servicesFromSettings = parseJsonWithFallback<ServiceViewModel[]>(servicesJson, [])

  const servicesFromAdmin: ServiceViewModel[] = adminServices
    .filter((service) => (service.status || 'Active') !== 'Archived')
    .map((service, index) => ({
      icon: ['🌐', '🎯', '📸', '🛒', '📊', '🔧', '📍', '🎨'][index % 8],
      title: service.name || service.category || 'Service',
      description:
        service.description ||
        `${service.category || 'Digital'} service designed to improve your online performance.`,
      features: [
        service.category ? `Category: ${service.category}` : 'Tailored strategy and execution',
        service.deliveryTime ? `Delivery timeline: ${service.deliveryTime}` : 'Fast and transparent delivery process',
        service.basePrice ? `Starting from ${service.basePrice}` : 'Custom pricing based on scope',
      ],
      process: [
        'Requirement discovery and planning',
        'Execution with milestone updates',
        'Testing and refinement',
        'Launch and support handover',
      ],
    }))

  const services = servicesFromAdmin.length
    ? servicesFromAdmin
    : servicesFromSettings.length
      ? servicesFromSettings
      : defaultServices

  const heroWords = servicesHeroTitle.trim().split(/\s+/).filter(Boolean)
  const heroLead = heroWords[0] || 'Our'
  const heroAccent = heroWords.slice(1).join(' ') || 'Services'

  const benefits = [
    {
      icon: <TrendingUp className="text-blue-500" size={28} />,
      title: 'Increased Conversions',
      description:
        'Our designs are strategically crafted to turn visitors into customers.',
    },
    {
      icon: <Zap className="text-cyan-500" size={28} />,
      title: 'Faster Time to Market',
      description:
        'Efficient processes get your project launched quickly without sacrificing quality.',
    },
    {
      icon: <Shield className="text-purple-500" size={28} />,
      title: 'Reliable & Secure',
      description:
        'Built with best practices for security, performance, and reliability.',
    },
    {
      icon: <Clock className="text-green-500" size={28} />,
      title: 'Ongoing Support',
      description:
        'We\'re here for you long after launch with maintenance and updates.',
    },
  ]

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
              {servicesHeroDescription}
            </p>
            <Button href="/contact" size="lg">
              Get a Quote
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <Section variant="light">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Why Choose Our{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-slate-900/50 rounded-2xl border border-white/10"
            >
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-xl flex items-center justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-slate-400">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Services Detail */}
      {services.map((service, index) => (
        <Section key={index} variant={index % 2 === 0 ? 'default' : 'light'}>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-6xl mb-6">{service.icon}</div>
              <h2 className="text-4xl font-bold mb-4">{service.title}</h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                {service.description}
              </p>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <CheckCircle2 className="text-blue-500 flex-shrink-0" size={20} />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button href="/contact">
                Join Us
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/50 rounded-2xl p-8 border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-6">Our Process</h3>
              <div className="space-y-6">
                {service.process.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-400 font-semibold text-sm">
                        {idx + 1}
                      </span>
                    </div>
                    <p className="text-slate-300 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Section>
      ))}

      {/* CTA Section */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Get{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Started
            </span>
            ?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Let's discuss your project and find the perfect solution for your
            business needs.
          </p>
          <Button href="/contact" size="lg">
            Contact Us Today
          </Button>
        </div>
      </Section>
    </>
  )
}

export default Services