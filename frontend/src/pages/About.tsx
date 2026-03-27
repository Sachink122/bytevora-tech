import { motion } from 'framer-motion'
import { Award, Target, Users, Zap, Shield, Heart, Rocket, ArrowRight } from 'lucide-react'
import Button from '../components/Button'
import Section from '../components/Section'
import { useLocalStorageValue } from '../hooks/useLocalStorageValue'

const About = () => {
  const agencyName = useLocalStorageValue('admin-settings-agency-name', 'Bytevora Tech')
  const aboutHeroTitle = useLocalStorageValue('admin-settings-about-hero-title', 'About Bytevora Tech')
  const aboutHeroDescription = useLocalStorageValue(
    'admin-settings-about-hero-description',
    'Bytevora Tech is a digital partner for modern businesses, focused on building reliable websites, efficient systems, and measurable business growth.'
  )
  const aboutStoryParagraph1 = useLocalStorageValue(
    'admin-settings-about-story-1',
    'Bytevora Tech was founded with a clear mission: make modern digital solutions practical and accessible for growing businesses.'
  )
  const aboutStoryParagraph2 = useLocalStorageValue(
    'admin-settings-about-story-2',
    'We combine web development, UI/UX design, automation thinking, and business-first strategy to deliver high-impact outcomes.'
  )
  const aboutStoryParagraph3 = useLocalStorageValue(
    'admin-settings-about-story-3',
    'From Panvel, Maharashtra, we work with clients to build, manage, and scale digital operations with clarity and speed.'
  )
  const aboutMission = useLocalStorageValue(
    'admin-settings-about-mission',
    'To help businesses build strong digital foundations, manage operations efficiently, and grow sustainably.'
  )
  const aboutVision = useLocalStorageValue(
    'admin-settings-about-vision',
    'To be a trusted technology growth partner for businesses across India and beyond.'
  )
  const aboutCtaDescription = useLocalStorageValue(
    'admin-settings-about-cta',
    'Tell us your business goals and Bytevora Tech will craft the right digital plan to execute them.'
  )

  const projectCount = useLocalStorageValue<Array<{ id: number }>>('admin-projects', []).length
  const clientCount = useLocalStorageValue<Array<{ id: number }>>('admin-clients', []).length
  const leadCount = useLocalStorageValue<Array<{ id: number }>>('admin-leads', []).length
  const testimonialCount = useLocalStorageValue<Array<{ id: number }>>('admin-testimonials', []).length

  const values = [
    {
      icon: <Award className="text-blue-500" size={32} />,
      title: 'Quality',
      description:
        'We deliver excellence in every project, ensuring the highest standards of design and development.',
    },
    {
      icon: <Target className="text-cyan-500" size={32} />,
      title: 'Clarity',
      description:
        'Transparent communication and clear processes keep you informed every step of the way.',
    },
    {
      icon: <Shield className="text-purple-500" size={32} />,
      title: 'Trust',
      description:
        'Build lasting relationships through reliability, integrity, and consistent delivery.',
    },
    {
      icon: <Zap className="text-yellow-500" size={32} />,
      title: 'Speed',
      description:
        'Fast turnaround times without compromising on quality or attention to detail.',
    },
    {
      icon: <Heart className="text-pink-500" size={32} />,
      title: 'Passion',
      description:
        'Genuine enthusiasm for helping businesses succeed online drives everything we do.',
    },
    {
      icon: <Users className="text-green-500" size={32} />,
      title: 'Support',
      description:
        'Ongoing partnership and support to ensure your continued success and growth.',
    },
  ]

  const stats = [
    {
      number: String(projectCount),
      label: 'Projects Tracked',
    },
    {
      number: String(clientCount),
      label: 'Clients Managed',
    },
    {
      number: String(leadCount),
      label: 'Leads in Pipeline',
    },
    {
      number: String(testimonialCount),
      label: 'Published Testimonials',
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
              {aboutHeroTitle.split(' ')[0] || 'About'}{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {aboutHeroTitle.split(' ').slice(1).join(' ') || 'Our Agency'}
              </span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              {aboutHeroDescription}
            </p>
            <Button href="/contact" size="lg">
              Work With Us
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <Section variant="light">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-slate-900/50 rounded-2xl border border-white/10"
            >
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Our Story Section */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Our{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Story
              </span>
            </h2>
            <div className="space-y-6 text-slate-300 leading-relaxed">
              <p>
                {aboutStoryParagraph1}
              </p>
              <p>
                {aboutStoryParagraph2}
              </p>
              <p>
                {aboutStoryParagraph3}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl p-8 border border-blue-500/30">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Rocket className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                    <p className="text-slate-400">
                      {aboutMission}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="text-cyan-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                    <p className="text-slate-400">
                      {aboutVision}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* What Makes Us Different */}
      <Section variant="light">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            What Makes Us{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Different
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            We're not just another agency. Here's what sets our approach apart.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Business-First Approach',
              description:
                'Every design and development decision is made with your business goals in mind.',
            },
            {
              title: 'Transparent Pricing',
              description:
                'No hidden fees or surprises. Clear, upfront pricing for all our services.',
            },
            {
              title: 'Fast Delivery',
              description:
                'We respect your time with efficient processes and quick turnaround times.',
            },
            {
              title: 'Ongoing Partnership',
              description:
                'We don\'t just build and leave. We\'re here for the long haul with continuous support.',
            },
            {
              title: 'Custom Solutions',
              description:
                'No templates or one-size-fits-all. Every project is uniquely tailored to you.',
            },
            {
              title: 'Results-Driven',
              description:
                'We focus on metrics that matter: conversions, leads, and revenue growth.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-slate-900/50 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all"
            >
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-slate-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Our Values */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Our{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Core Values
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            The principles that guide everything we do.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-slate-900/50 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all"
            >
              <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p className="text-slate-400">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Team Section */}
      <Section variant="light">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Our{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Team
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            A passionate team of experts dedicated to your success.
          </p>
        </div>

        <div className="text-center py-10">
          <p className="text-slate-400 text-lg">Team profiles will be published once finalized.</p>
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Work With{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {agencyName || 'Us'}
            </span>
            ?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            {aboutCtaDescription}
          </p>
          <Button href="/contact" size="lg">
            Start Your Project
            <ArrowRight size={20} className="ml-2" />
          </Button>
        </div>
      </Section>
    </>
  )
}

export default About