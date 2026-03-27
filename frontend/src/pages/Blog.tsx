import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight } from 'lucide-react'
import Button from '../components/Button'
import Section from '../components/Section'
import { useLocalStorageValue } from '../hooks/useLocalStorageValue'

interface BlogPost {
  id: number
  title?: string
  slug?: string
  author?: string
  createdAt?: string
  publishDate?: string
  summary?: string
  status?: string
}

const Blog = () => {
  const posts = useLocalStorageValue<BlogPost[]>('admin-blog', [])
  const blogHeroTitle = useLocalStorageValue('admin-settings-blog-hero-title', 'Latest Blog Posts')
  const blogHeroDescription = useLocalStorageValue(
    'admin-settings-blog-hero-description',
    'Insights, strategies, and practical guides from our team.'
  )

  const heroWords = blogHeroTitle.trim().split(/\s+/).filter(Boolean)
  const heroLead = heroWords.slice(0, -1).join(' ') || 'Latest Blog'
  const heroAccent = heroWords[heroWords.length - 1] || 'Posts'

  const visiblePosts = posts
    .filter((post) => (post.status || 'Draft') === 'Published')
    .sort((a, b) => {
      const aTime = new Date(a.publishDate || a.createdAt || '').getTime()
      const bTime = new Date(b.publishDate || b.createdAt || '').getTime()
      return bTime - aTime
    })

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
            {blogHeroDescription}
          </p>
        </div>
      </section>

      <Section variant="light">
        {visiblePosts.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="p-6 bg-slate-900/50 rounded-2xl border border-white/10 hover:border-blue-500/40 transition-all"
              >
                <h2 className="text-2xl font-semibold mb-3 text-white">{post.title || 'Untitled Post'}</h2>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  {post.summary || 'No summary provided for this post yet.'}
                </p>
                <div className="space-y-2 text-sm text-slate-400 mb-6">
                  <div>
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      {post.status || 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{post.author || 'Team Bytevora Tech'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{post.publishDate || 'Unscheduled'}</span>
                  </div>
                </div>
                <Button href="/contact" variant="secondary" fullWidth>
                  Discuss This Topic
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">No published blog posts yet. Publish posts from Admin Blog.</p>
          </div>
        )}
      </Section>
    </>
  )
}

export default Blog
