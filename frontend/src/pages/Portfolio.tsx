import { motion } from 'framer-motion'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Button from '../components/Button'
import Section from '../components/Section'
import { useLocalStorageValue } from '../hooks/useLocalStorageValue'

interface PortfolioItem {
  id: number
  title: string
  category: string
  image: string
  projectUrl: string
}

const Portfolio = () => {
  const [filter, setFilter] = useState('all')
  const items = useLocalStorageValue<PortfolioItem[]>('admin-portfolio-items', [])
  const portfolioHeroTitle = useLocalStorageValue('admin-settings-portfolio-hero-title', 'Our Portfolio')
  const portfolioHeroDescription = useLocalStorageValue(
    'admin-settings-portfolio-hero-description',
    "Explore our latest work and see how we've helped businesses succeed online. Each project is a testament to our commitment to quality and innovation."
  )

  const heroWords = portfolioHeroTitle.trim().split(/\s+/).filter(Boolean)
  const heroLead = heroWords.slice(0, -1).join(' ') || 'Our'
  const heroAccent = heroWords[heroWords.length - 1] || 'Portfolio'

  const projects = items.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    categoryLabel: item.category,
    description: `Published portfolio item: ${item.title}`,
    image: item.image,
    projectUrl: item.projectUrl,
    tags: [item.category],
  }))

  const filters = [
    { id: 'all', label: 'All Projects' },
    ...Array.from(new Set(projects.map((project) => project.category))).map((category) => ({
      id: category,
      label: category,
    })),
  ]

  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter((project) => project.category === filter)

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
              {portfolioHeroDescription}
            </p>
            <Button href="/contact" size="lg">
              Start Your Project
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <Section variant="light">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                filter === f.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group"
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
                    <ExternalLink size={16} className="mr-2" />
                    View Project
                  </Button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {project.categoryLabel}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400">{project.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No portfolio projects published yet.</p>
          </div>
        )}
      </Section>

      {/* Process Section */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Our{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Project Process
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            A proven process that ensures quality results every time.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'Discovery', desc: 'Understanding your goals and requirements' },
            { step: '02', title: 'Design', desc: 'Creating stunning visual concepts' },
            { step: '03', title: 'Development', desc: 'Building with clean, efficient code' },
            { step: '04', title: 'Launch', desc: 'Deploying and optimizing for success' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-6xl font-bold text-slate-800 mb-4">{item.step}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="light">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Want a Project Like{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              These
            </span>
            ?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Let's discuss your project and create something amazing together.
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

export default Portfolio