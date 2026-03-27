import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { useLocalStorageValue } from '../hooks/useLocalStorageValue'

interface AdminServiceRecord {
  id: number
  name?: string
  status?: string
}

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const agencyName = useLocalStorageValue('admin-settings-agency-name', 'Bytevora Tech')
  const businessEmail = useLocalStorageValue('admin-settings-business-email', 'bytevora1tech@gmail.com')
  const phoneNumber = useLocalStorageValue('admin-settings-phone', '8668398960')
  const businessAddress = useLocalStorageValue('admin-settings-address', 'Panvel, Maharashtra, India')
  const facebookUrl = useLocalStorageValue('admin-settings-facebook', '')
  const twitterUrl = useLocalStorageValue('admin-settings-twitter', '')
  const instagramUrl = useLocalStorageValue('admin-settings-instagram', '')
  const linkedinUrl = useLocalStorageValue('admin-settings-linkedin', '')
  const adminServices = useLocalStorageValue<AdminServiceRecord[]>('admin-services', [])

  const normalizedPhone = phoneNumber.replace(/[^\d+]/g, '')
  const phoneHref = normalizedPhone ? `tel:${normalizedPhone}` : '#'
  const emailHref = businessEmail ? `mailto:${businessEmail}` : '#'

  const footerServices = adminServices
    .filter((service) => (service.status || 'Active') !== 'Archived')
    .slice(0, 5)

  const hasDynamicServices = footerServices.length > 0

  return (
    <footer className="bg-slate-950 border-t border-white/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {agencyName || 'Bytevora Tech'}
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed">
              Building modern digital experiences that help businesses grow. From stunning websites to powerful custom systems.
            </p>
            <div className="flex space-x-4">
              <a
                href={facebookUrl || '#'}
                target={facebookUrl ? '_blank' : undefined}
                rel={facebookUrl ? 'noopener noreferrer' : undefined}
                className="w-10 h-10 bg-white/5 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href={twitterUrl || '#'}
                target={twitterUrl ? '_blank' : undefined}
                rel={twitterUrl ? 'noopener noreferrer' : undefined}
                className="w-10 h-10 bg-white/5 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href={instagramUrl || '#'}
                target={instagramUrl ? '_blank' : undefined}
                rel={instagramUrl ? 'noopener noreferrer' : undefined}
                className="w-10 h-10 bg-white/5 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href={linkedinUrl || '#'}
                target={linkedinUrl ? '_blank' : undefined}
                rel={linkedinUrl ? 'noopener noreferrer' : undefined}
                className="w-10 h-10 bg-white/5 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-white flex items-center transition-colors group"
                >
                  <ArrowRight size={16} className="mr-2 text-blue-500 group-hover:translate-x-1 transition-transform" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-slate-400 hover:text-white flex items-center transition-colors group"
                >
                  <ArrowRight size={16} className="mr-2 text-blue-500 group-hover:translate-x-1 transition-transform" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-slate-400 hover:text-white flex items-center transition-colors group"
                >
                  <ArrowRight size={16} className="mr-2 text-blue-500 group-hover:translate-x-1 transition-transform" />
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/portfolio"
                  className="text-slate-400 hover:text-white flex items-center transition-colors group"
                >
                  <ArrowRight size={16} className="mr-2 text-blue-500 group-hover:translate-x-1 transition-transform" />
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-slate-400 hover:text-white flex items-center transition-colors group"
                >
                  <ArrowRight size={16} className="mr-2 text-blue-500 group-hover:translate-x-1 transition-transform" />
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/team"
                  className="text-slate-400 hover:text-white flex items-center transition-colors group"
                >
                  <ArrowRight size={16} className="mr-2 text-blue-500 group-hover:translate-x-1 transition-transform" />
                  Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Services</h3>
            <ul className="space-y-4">
              {(hasDynamicServices ? footerServices : [
                { id: 1, name: 'Website Development' },
                { id: 2, name: 'Landing Page Design' },
                { id: 3, name: 'Custom Dashboard' },
                { id: 4, name: 'E-commerce Solutions' },
                { id: 5, name: 'Branding & UI/UX' },
              ]).map((service) => (
                <li key={service.id}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white flex items-center transition-colors group"
                  >
                    <ArrowRight size={16} className="mr-2 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    {service.name || 'Service'}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-slate-400">Email</p>
                  <a href={emailHref} className="text-white hover:text-blue-400 transition-colors">
                    {businessEmail || 'bytevora1tech@gmail.com'}
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-slate-400">Phone</p>
                  <a href={phoneHref} className="text-white hover:text-blue-400 transition-colors">
                    {phoneNumber || '8668398960'}
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-slate-400">Location</p>
                  <p className="text-white">{businessAddress || 'Panvel, Maharashtra, India'}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400 text-sm">
              © {currentYear} {agencyName || 'Bytevora Tech'}. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer