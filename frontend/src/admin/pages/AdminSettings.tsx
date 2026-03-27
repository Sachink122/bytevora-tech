import { useState } from 'react'
import { Save, Building2, Mail, Phone, MessageCircle, Facebook, Twitter, Instagram, Linkedin, Globe, Bell, CreditCard, Lock, Upload, CheckCircle2 } from 'lucide-react'
import { useLocalStorageState } from '../hooks/useLocalStorageState'

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useLocalStorageState<string>('admin-settings-logo-preview', '')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [generalSaved, setGeneralSaved] = useState(false)
  const [contactSaved, setContactSaved] = useState(false)
  const [notificationsSaved, setNotificationsSaved] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [agencyName, setAgencyName] = useLocalStorageState('admin-settings-agency-name', 'Bytevora Tech')
  const [tagline, setTagline] = useLocalStorageState('admin-settings-tagline', 'Build. Manage. Grow.')
  const [description, setDescription] = useLocalStorageState(
    'admin-settings-description',
    'Bytevora Tech helps businesses build high-performing websites, manage operations with smart systems, and grow through practical digital strategies.'
  )
  const [homeHeroPrefix, setHomeHeroPrefix] = useLocalStorageState('admin-settings-home-hero-prefix', 'Build and Scale')
  const [homeHeroHighlight, setHomeHeroHighlight] = useLocalStorageState('admin-settings-home-hero-highlight', 'Digital Presence')
  const [homeHeroSuffix, setHomeHeroSuffix] = useLocalStorageState('admin-settings-home-hero-suffix', 'with')
  const [homePrimaryCtaText, setHomePrimaryCtaText] = useLocalStorageState('admin-settings-home-primary-cta-text', 'Join Us')
  const [homeSecondaryCtaText, setHomeSecondaryCtaText] = useLocalStorageState('admin-settings-home-secondary-cta-text', 'View Portfolio')
  const [homeContactTitle, setHomeContactTitle] = useLocalStorageState('admin-settings-home-contact-title', "Let's Start a Conversation")
  const [homeContactDescription, setHomeContactDescription] = useLocalStorageState(
    'admin-settings-home-contact-description',
    "Ready to transform your digital presence? Get in touch and let's discuss your project."
  )
  const [contactHeroTitle, setContactHeroTitle] = useLocalStorageState('admin-settings-contact-hero-title', "Let's Connect")
  const [contactHeroDescription, setContactHeroDescription] = useLocalStorageState(
    'admin-settings-contact-hero-description',
    "Ready to transform your digital presence? Get in touch and let's discuss how we can help your business grow."
  )
  const [portfolioHeroTitle, setPortfolioHeroTitle] = useLocalStorageState('admin-settings-portfolio-hero-title', 'Our Portfolio')
  const [portfolioHeroDescription, setPortfolioHeroDescription] = useLocalStorageState(
    'admin-settings-portfolio-hero-description',
    "Explore our latest work and see how we've helped businesses succeed online. Each project is a testament to our commitment to quality and innovation."
  )
  const [blogHeroTitle, setBlogHeroTitle] = useLocalStorageState('admin-settings-blog-hero-title', 'Latest Blog Posts')
  const [blogHeroDescription, setBlogHeroDescription] = useLocalStorageState(
    'admin-settings-blog-hero-description',
    'Insights, strategies, and practical guides from our team.'
  )
  const [teamHeroTitle, setTeamHeroTitle] = useLocalStorageState('admin-settings-team-hero-title', 'Meet Our Team')
  const [teamHeroDescription, setTeamHeroDescription] = useLocalStorageState(
    'admin-settings-team-hero-description',
    'The people behind the strategy, design, and development work.'
  )
  const [servicesHeroTitle, setServicesHeroTitle] = useLocalStorageState('admin-settings-services-hero-title', 'Our Services')
  const [servicesHeroDescription, setServicesHeroDescription] = useLocalStorageState(
    'admin-settings-services-hero-description',
    'Practical digital services by Bytevora Tech to help you build a strong online presence, manage your workflow, and grow with confidence.'
  )
  const [servicesJson, setServicesJson] = useLocalStorageState('admin-settings-services-json', '')
  const [pricingHeroTitle, setPricingHeroTitle] = useLocalStorageState('admin-settings-pricing-hero-title', 'Simple Pricing')
  const [pricingHeroDescription, setPricingHeroDescription] = useLocalStorageState(
    'admin-settings-pricing-hero-description',
    'Transparent pricing by Bytevora Tech with no hidden charges. Choose the package that fits your stage and goals.'
  )
  const [pricingPlansJson, setPricingPlansJson] = useLocalStorageState('admin-settings-pricing-plans-json', '')
  const [pricingAddonsJson, setPricingAddonsJson] = useLocalStorageState('admin-settings-pricing-addons-json', '')
  const [pricingFaqsJson, setPricingFaqsJson] = useLocalStorageState('admin-settings-pricing-faqs-json', '')
  const [aboutHeroTitle, setAboutHeroTitle] = useLocalStorageState('admin-settings-about-hero-title', 'About Bytevora Tech')
  const [aboutHeroDescription, setAboutHeroDescription] = useLocalStorageState(
    'admin-settings-about-hero-description',
    'Bytevora Tech is a digital partner for modern businesses, focused on building reliable websites, efficient systems, and measurable business growth.'
  )
  const [aboutStory1, setAboutStory1] = useLocalStorageState(
    'admin-settings-about-story-1',
    'Bytevora Tech was founded with a clear mission: make modern digital solutions practical and accessible for growing businesses.'
  )
  const [aboutStory2, setAboutStory2] = useLocalStorageState(
    'admin-settings-about-story-2',
    'We combine web development, UI/UX design, automation thinking, and business-first strategy to deliver high-impact outcomes.'
  )
  const [aboutStory3, setAboutStory3] = useLocalStorageState(
    'admin-settings-about-story-3',
    'From Panvel, Maharashtra, we work with clients to build, manage, and scale digital operations with clarity and speed.'
  )
  const [aboutMission, setAboutMission] = useLocalStorageState(
    'admin-settings-about-mission',
    'To help businesses build strong digital foundations, manage operations efficiently, and grow sustainably.'
  )
  const [aboutVision, setAboutVision] = useLocalStorageState(
    'admin-settings-about-vision',
    'To be a trusted technology growth partner for businesses across India and beyond.'
  )
  const [aboutCta, setAboutCta] = useLocalStorageState(
    'admin-settings-about-cta',
    'Tell us your business goals and Bytevora Tech will craft the right digital plan to execute them.'
  )
  const [showDraftsOnWebsite, setShowDraftsOnWebsite] = useLocalStorageState<boolean>('admin-settings-show-drafts-on-website', true)
  const [businessEmail, setBusinessEmail] = useLocalStorageState('admin-settings-business-email', 'bytevora1tech@gmail.com')
  const [phoneNumber, setPhoneNumber] = useLocalStorageState('admin-settings-phone', '8668398960')
  const [whatsAppNumber, setWhatsAppNumber] = useLocalStorageState('admin-settings-whatsapp', '8668398960')
  const [businessAddress, setBusinessAddress] = useLocalStorageState('admin-settings-address', 'Panvel, Maharashtra, India')
  const [facebookUrl, setFacebookUrl] = useLocalStorageState('admin-settings-facebook', '')
  const [twitterUrl, setTwitterUrl] = useLocalStorageState('admin-settings-twitter', '')
  const [instagramUrl, setInstagramUrl] = useLocalStorageState('admin-settings-instagram', 'https://www.instagram.com/sachinkumarsk001/')
  const [linkedinUrl, setLinkedinUrl] = useLocalStorageState('admin-settings-linkedin', 'https://www.linkedin.com/in/sachin-kumar-941538312/')
  const [notifyLeads, setNotifyLeads] = useLocalStorageState<boolean>('admin-settings-notify-leads', true)
  const [notifyDeadlines, setNotifyDeadlines] = useLocalStorageState<boolean>('admin-settings-notify-deadlines', true)
  const [notifyInvoices, setNotifyInvoices] = useLocalStorageState<boolean>('admin-settings-notify-invoices', true)
  const [notifySupport, setNotifySupport] = useLocalStorageState<boolean>('admin-settings-notify-support', true)
  const [notifyWeeklySummary, setNotifyWeeklySummary] = useLocalStorageState<boolean>('admin-settings-notify-weekly-summary', false)
  const [profileName, setProfileName] = useLocalStorageState('admin-profile-name', 'Admin User')
  const [profileEmail, setProfileEmail] = useLocalStorageState('admin-profile-email', 'bytevora1tech@gmail.com')
  const [profileRole, setProfileRole] = useLocalStorageState('admin-profile-role', 'Admin')
  const [profileAvatarUrl, setProfileAvatarUrl] = useLocalStorageState('admin-profile-avatar-url', '')

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'contact', label: 'Contact Info', icon: Mail },
    { id: 'profile', label: 'Profile', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Lock },
  ]

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleGeneralSave = () => {
    setGeneralSaved(true)
    setTimeout(() => setGeneralSaved(false), 2500)
  }

  const handleContactSave = () => {
    setContactSaved(true)
    setTimeout(() => setContactSaved(false), 2500)
  }

  const handleNotificationsSave = () => {
    setNotificationsSaved(true)
    setTimeout(() => setNotificationsSaved(false), 2500)
  }

  const handleProfileSave = () => {
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your agency preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-8">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">General Settings</h2>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Agency Name</label>
                  <input
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                  />
                </div>
                <div className="p-4 bg-slate-800/40 border border-white/10 rounded-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-white font-medium">Show drafts on website</p>
                      <p className="text-slate-400 text-sm">When ON, draft blog posts appear on Home and Blog pages. When OFF, only published posts are visible.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDraftsOnWebsite((prev) => !prev)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        showDraftsOnWebsite
                          ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                          : 'bg-slate-700 text-slate-300 border border-white/10'
                      }`}
                    >
                      {showDraftsOnWebsite ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
                <div className="border border-white/10 rounded-2xl p-4 space-y-4 bg-slate-900/30">
                  <h3 className="text-lg font-semibold text-white">Services & Pricing CMS</h3>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Services Hero Title</label>
                    <input
                      type="text"
                      value={servicesHeroTitle}
                      onChange={(e) => setServicesHeroTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="Our Services"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Services Hero Description</label>
                    <textarea
                      rows={3}
                      value={servicesHeroDescription}
                      onChange={(e) => setServicesHeroDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Services List JSON</label>
                    <textarea
                      rows={8}
                      value={servicesJson}
                      onChange={(e) => setServicesJson(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-y font-mono text-sm"
                      placeholder='[{"icon":"🌐","title":"Service","description":"...","features":["..."],"process":["..."]}]'
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Pricing Hero Title</label>
                    <input
                      type="text"
                      value={pricingHeroTitle}
                      onChange={(e) => setPricingHeroTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="Simple Pricing"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Pricing Hero Description</label>
                    <textarea
                      rows={3}
                      value={pricingHeroDescription}
                      onChange={(e) => setPricingHeroDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Pricing Plans JSON</label>
                    <textarea
                      rows={8}
                      value={pricingPlansJson}
                      onChange={(e) => setPricingPlansJson(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-y font-mono text-sm"
                      placeholder='[{"name":"Starter","price":"$499","period":"one-time","description":"...","features":["..."],"notIncluded":[],"popular":false}]'
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Pricing Add-ons JSON</label>
                    <textarea
                      rows={6}
                      value={pricingAddonsJson}
                      onChange={(e) => setPricingAddonsJson(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-y font-mono text-sm"
                      placeholder='[{"name":"Add-on name","price":"+$99"}]'
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Pricing FAQ JSON</label>
                    <textarea
                      rows={8}
                      value={pricingFaqsJson}
                      onChange={(e) => setPricingFaqsJson(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-y font-mono text-sm"
                      placeholder='[{"question":"...","answer":"..."}]'
                    />
                  </div>
                </div>
                <div className="border border-white/10 rounded-2xl p-4 space-y-4 bg-slate-900/30">
                  <h3 className="text-lg font-semibold text-white">Home Page Content</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">Hero Prefix</label>
                      <input
                        type="text"
                        value={homeHeroPrefix}
                        onChange={(e) => setHomeHeroPrefix(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                        placeholder="Build and Scale"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">Hero Highlight</label>
                      <input
                        type="text"
                        value={homeHeroHighlight}
                        onChange={(e) => setHomeHeroHighlight(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                        placeholder="Digital Presence"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Hero Suffix</label>
                    <input
                      type="text"
                      value={homeHeroSuffix}
                      onChange={(e) => setHomeHeroSuffix(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="with"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">Primary CTA Text</label>
                      <input
                        type="text"
                        value={homePrimaryCtaText}
                        onChange={(e) => setHomePrimaryCtaText(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                        placeholder="Join Us"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">Secondary CTA Text</label>
                      <input
                        type="text"
                        value={homeSecondaryCtaText}
                        onChange={(e) => setHomeSecondaryCtaText(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                        placeholder="View Portfolio"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Home Contact Section Title</label>
                    <input
                      type="text"
                      value={homeContactTitle}
                      onChange={(e) => setHomeContactTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="Let's Start a Conversation"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Home Contact Section Description</label>
                    <textarea
                      rows={3}
                      value={homeContactDescription}
                      onChange={(e) => setHomeContactDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                      placeholder="Ready to transform your digital presence? Get in touch and let's discuss your project."
                    />
                  </div>
                </div>
                <div className="border border-white/10 rounded-2xl p-4 space-y-4 bg-slate-900/30">
                  <h3 className="text-lg font-semibold text-white">Public Page Heroes</h3>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Contact Hero Title</label>
                    <input
                      type="text"
                      value={contactHeroTitle}
                      onChange={(e) => setContactHeroTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="Let's Connect"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Contact Hero Description</label>
                    <textarea
                      rows={2}
                      value={contactHeroDescription}
                      onChange={(e) => setContactHeroDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Portfolio Hero Title</label>
                    <input
                      type="text"
                      value={portfolioHeroTitle}
                      onChange={(e) => setPortfolioHeroTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="Our Portfolio"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Portfolio Hero Description</label>
                    <textarea
                      rows={2}
                      value={portfolioHeroDescription}
                      onChange={(e) => setPortfolioHeroDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Blog Hero Title</label>
                    <input
                      type="text"
                      value={blogHeroTitle}
                      onChange={(e) => setBlogHeroTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="Latest Blog Posts"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Blog Hero Description</label>
                    <textarea
                      rows={2}
                      value={blogHeroDescription}
                      onChange={(e) => setBlogHeroDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Team Hero Title</label>
                    <input
                      type="text"
                      value={teamHeroTitle}
                      onChange={(e) => setTeamHeroTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="Meet Our Team"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Team Hero Description</label>
                    <textarea
                      rows={2}
                      value={teamHeroDescription}
                      onChange={(e) => setTeamHeroDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                </div>
                <div className="border border-white/10 rounded-2xl p-4 space-y-4 bg-slate-900/30">
                  <h3 className="text-lg font-semibold text-white">About Page Content</h3>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">About Hero Title</label>
                    <input
                      type="text"
                      value={aboutHeroTitle}
                      onChange={(e) => setAboutHeroTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">About Hero Description</label>
                    <textarea
                      rows={3}
                      value={aboutHeroDescription}
                      onChange={(e) => setAboutHeroDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Story Paragraph 1</label>
                    <textarea
                      rows={3}
                      value={aboutStory1}
                      onChange={(e) => setAboutStory1(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Story Paragraph 2</label>
                    <textarea
                      rows={3}
                      value={aboutStory2}
                      onChange={(e) => setAboutStory2(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Story Paragraph 3</label>
                    <textarea
                      rows={3}
                      value={aboutStory3}
                      onChange={(e) => setAboutStory3(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Mission</label>
                    <textarea
                      rows={2}
                      value={aboutMission}
                      onChange={(e) => setAboutMission(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Vision</label>
                    <textarea
                      rows={2}
                      value={aboutVision}
                      onChange={(e) => setAboutVision(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">About CTA Text</label>
                    <textarea
                      rows={2}
                      value={aboutCta}
                      onChange={(e) => setAboutCta(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Logo</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold relative overflow-hidden">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                      ) : (
                        <span>N</span>
                      )}
                    </div>
                    <label className="flex items-center space-x-3 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10 hover:border-blue-500/50">
                      <Upload size={18} />
                      <span>Upload New Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleGeneralSave}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold"
                  >
                    Save Changes
                  </button>
                  {generalSaved && <span className="text-green-400 text-sm">General settings saved</span>}
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Business Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="email"
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">WhatsApp Number</label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="tel"
                        value={whatsAppNumber}
                        onChange={(e) => setWhatsAppNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Business Address</label>
                    <textarea
                      rows={2}
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-4">Social Media Links</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Facebook</label>
                      <div className="relative">
                        <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="url"
                          placeholder="https://facebook.com/your-brand"
                          value={facebookUrl}
                          onChange={(e) => setFacebookUrl(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Twitter</label>
                      <div className="relative">
                        <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="url"
                          placeholder="https://twitter.com/your-brand"
                          value={twitterUrl}
                          onChange={(e) => setTwitterUrl(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Instagram</label>
                      <div className="relative">
                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="url"
                          placeholder="https://instagram.com/your-brand"
                          value={instagramUrl}
                          onChange={(e) => setInstagramUrl(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">LinkedIn</label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="url"
                          placeholder="https://linkedin.com/company/your-brand"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleContactSave}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold"
                  >
                    Save Changes
                  </button>
                  {contactSaved && <span className="text-green-400 text-sm">Contact info saved</span>}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Display Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Profile Email</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Role Label</label>
                    <input
                      type="text"
                      value={profileRole}
                      onChange={(e) => setProfileRole(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Avatar URL (optional)</label>
                    <input
                      type="url"
                      placeholder="https://example.com/avatar.png"
                      value={profileAvatarUrl}
                      onChange={(e) => setProfileAvatarUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleProfileSave}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold"
                  >
                    Save Profile
                  </button>
                  {profileSaved && <span className="text-green-400 text-sm">Profile updated</span>}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: 'New lead notifications', description: 'Get notified when new leads come in', enabled: notifyLeads, setEnabled: setNotifyLeads },
                    { label: 'Project deadline reminders', description: 'Remind me before project deadlines', enabled: notifyDeadlines, setEnabled: setNotifyDeadlines },
                    { label: 'Invoice payment alerts', description: 'Notify when invoices are paid', enabled: notifyInvoices, setEnabled: setNotifyInvoices },
                    { label: 'Support ticket updates', description: 'Get updates on support tickets', enabled: notifySupport, setEnabled: setNotifySupport },
                    { label: 'Weekly summary email', description: 'Receive weekly activity summary', enabled: notifyWeeklySummary, setEnabled: setNotifyWeeklySummary },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                      <div>
                        <div className="text-white font-medium">{item.label}</div>
                        <div className="text-slate-400 text-sm">{item.description}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={(e) => item.setEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleNotificationsSave}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold"
                  >
                    Save Notification Settings
                  </button>
                  {notificationsSaved && <span className="text-green-400 text-sm">Notification settings saved</span>}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Billing Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Currency</label>
                    <select className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Invoice Prefix</label>
                    <input
                      type="text"
                      defaultValue="INV-"
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Payment Terms</label>
                    <select className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all">
                      <option value="net15">Net 15</option>
                      <option value="net30">Net 30</option>
                      <option value="net45">Net 45</option>
                      <option value="net60">Net 60</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Current Password</label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Two-Factor Authentication</label>
                    <select className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all">
                      <option value="disabled">Disabled</option>
                      <option value="sms">SMS</option>
                      <option value="app">Authenticator App</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-6 border-t border-white/10">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                <Save size={20} />
                <span>Save Changes</span>
              </button>
              {saveSuccess && (
                <div className="ml-4 flex items-center space-x-2 text-green-400">
                  <CheckCircle2 size={20} />
                  <span className="font-medium">Settings saved successfully!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings