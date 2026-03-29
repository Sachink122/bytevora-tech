import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, X } from 'lucide-react'
import Button from '../components/Button'
import Section from '../components/Section'
import { useLocalStorageValue } from '../hooks/useLocalStorageValue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

interface BlogPost {
  id: number
  title?: string
  slug?: string
  author?: string
  createdAt?: string
  publishDate?: string
  summary?: string
  contentHtml?: string
  featureImage?: string
  status?: string
}

const Blog = () => {
  const localPosts = useLocalStorageValue<BlogPost[]>('admin-blog', [])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const blogHeroTitle = useLocalStorageValue('admin-settings-blog-hero-title', 'Latest Blog Posts')
  const blogHeroDescription = useLocalStorageValue(
    'admin-settings-blog-hero-description',
    'Insights, strategies, and practical guides from our team.'
  )

  const heroWords = blogHeroTitle.trim().split(/\s+/).filter(Boolean)
  const heroLead = heroWords.slice(0, -1).join(' ') || 'Latest Blog'
  const heroAccent = heroWords[heroWords.length - 1] || 'Posts'

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/blog-posts`)
        if (!response.ok) throw new Error('Failed to load blog posts')

        const apiPosts = (await response.json()) as BlogPost[]
        // Keep local posts if API returns an empty list but local data exists.
        if (apiPosts.length > 0 || localPosts.length === 0) {
          setPosts(apiPosts)
        } else {
          setPosts(localPosts)
        }
      } catch {
        setPosts(localPosts)
      } finally {
        setIsLoadingPosts(false)
      }
    }

    void loadPosts()
  }, [localPosts])

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
        {isLoadingPosts ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">Loading blog posts...</p>
          </div>
        ) : visiblePosts.length ? (
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
                {post.featureImage ? (
                  <img
                    src={post.featureImage}
                    alt={post.title || 'Blog feature image'}
                    className="w-full h-48 object-cover rounded-xl mb-4 border border-white/10"
                  />
                ) : null}
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
                <div className="space-y-3">
                  <Button variant="outline" fullWidth onClick={() => setSelectedPost(post)}>
                    See Full Blog
                  </Button>
                  <Button href="/contact" variant="secondary" fullWidth>
                    Discuss This Topic
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">No published blog posts yet. Publish posts from Admin Blog.</p>
          </div>
        )}
      </Section>

      {selectedPost ? (
        <div className="fixed inset-0 z-50 p-4 sm:p-6 overflow-y-auto">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedPost(null)} />
          <article className="relative max-w-4xl mx-auto my-6 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-start justify-between gap-4 p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">{selectedPost.title || 'Untitled Post'}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  <span className="inline-flex items-center gap-2"><User size={14} />{selectedPost.author || 'Team Bytevora Tech'}</span>
                  <span className="inline-flex items-center gap-2"><Calendar size={14} />{selectedPost.publishDate || 'Unscheduled'}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close full blog"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
              {selectedPost.featureImage ? (
                <img
                  src={selectedPost.featureImage}
                  alt={selectedPost.title || 'Blog feature image'}
                  className="w-full max-h-96 object-cover rounded-xl mb-6 border border-white/10"
                />
              ) : null}

              {selectedPost.contentHtml ? (
                <div
                  className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300"
                  dangerouslySetInnerHTML={{ __html: selectedPost.contentHtml }}
                />
              ) : (
                <p className="text-slate-300 leading-relaxed">{selectedPost.summary || 'No full blog content available yet.'}</p>
              )}
            </div>
          </article>
        </div>
      ) : null}
    </>
  )
}

export default Blog
