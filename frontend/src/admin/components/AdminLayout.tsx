import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FolderKanban,
  Image,
  DollarSign,
  Star,
  MessageSquare,
  FileText,
  CheckCircle,
  Ticket,
  PenTool,
  BarChart3,
  HardDrive,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLocalStorageValue } from '../../hooks/useLocalStorageValue'
import { useLocalStorageState } from '../hooks/useLocalStorageState'

interface NotificationItem {
  id: string
  title: string
  meta: string
  path: string
}

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()
  const agencyName = useLocalStorageValue('admin-settings-agency-name', 'Bytevora Tech')
  const leads = useLocalStorageValue<Array<{ id: number; name?: string; status?: string }>>('admin-leads', [])
  const messages = useLocalStorageValue<Array<{ id: number; senderName?: string; status?: string }>>('admin-messages', [])
  const support = useLocalStorageValue<Array<{ id: number; ticketId?: string; status?: string }>>('admin-support', [])
  const tasks = useLocalStorageValue<Array<{ id: number; taskTitle?: string; dueDate?: string; status?: string }>>('admin-tasks', [])
  const invoices = useLocalStorageValue<Array<{ id: number; invoiceNo?: string; status?: string }>>('admin-invoices', [])
  const notifyLeads = useLocalStorageValue<boolean>('admin-settings-notify-leads', true)
  const notifyDeadlines = useLocalStorageValue<boolean>('admin-settings-notify-deadlines', true)
  const notifyInvoices = useLocalStorageValue<boolean>('admin-settings-notify-invoices', true)
  const notifySupport = useLocalStorageValue<boolean>('admin-settings-notify-support', true)
  const profileName = useLocalStorageValue('admin-profile-name', '')
  const profileEmail = useLocalStorageValue('admin-profile-email', '')
  const profileRole = useLocalStorageValue('admin-profile-role', '')
  const profileAvatarUrl = useLocalStorageValue('admin-profile-avatar-url', '')
  const [readNotificationIds, setReadNotificationIds] = useLocalStorageState<string[]>('admin-read-notification-ids', [])
  const [hasShownDashboardNotifications, setHasShownDashboardNotifications] = useState(false)
  const notificationsRef = useRef<HTMLDivElement | null>(null)
  const profileRef = useRef<HTMLDivElement | null>(null)

  const notifications = useMemo<NotificationItem[]>(() => {
    const items: NotificationItem[] = []

    if (notifyLeads) {
      leads
        .filter((item) => (item.status || 'New') === 'New')
        .slice(0, 4)
        .forEach((item) => {
          items.push({
            id: `lead-${item.id}`,
            title: `New lead: ${item.name || 'Unnamed lead'}`,
            meta: 'Needs follow up',
            path: '/admin/leads',
          })
        })

      messages
        .filter((item) => (item.status || 'New') === 'New')
        .slice(0, 4)
        .forEach((item) => {
          items.push({
            id: `msg-${item.id}`,
            title: `New message from ${item.senderName || 'Website visitor'}`,
            meta: 'Check inbox',
            path: '/admin/messages',
          })
        })
    }

    if (notifySupport) {
      support
        .filter((item) => (item.status || 'Open') === 'Open')
        .slice(0, 4)
        .forEach((item) => {
          items.push({
            id: `support-${item.id}`,
            title: `Open support ticket ${item.ticketId || `#${item.id}`}`,
            meta: 'Customer issue pending',
            path: '/admin/support',
          })
        })
    }

    if (notifyDeadlines) {
      const now = new Date()
      const soon = new Date()
      soon.setDate(now.getDate() + 3)

      tasks
        .filter((item) => {
          if (!item.dueDate || item.status === 'Done') return false
          const due = new Date(item.dueDate)
          return !Number.isNaN(due.getTime()) && due >= now && due <= soon
        })
        .slice(0, 4)
        .forEach((item) => {
          items.push({
            id: `task-${item.id}`,
            title: `Task due soon: ${item.taskTitle || 'Task'}`,
            meta: `Due ${item.dueDate || 'soon'}`,
            path: '/admin/tasks',
          })
        })
    }

    if (notifyInvoices) {
      invoices
        .filter((item) => ['Pending', 'Overdue'].includes(item.status || ''))
        .slice(0, 4)
        .forEach((item) => {
          items.push({
            id: `invoice-${item.id}`,
            title: `Invoice ${item.invoiceNo || `#${item.id}`} is ${item.status || 'Pending'}`,
            meta: 'Review billing status',
            path: '/admin/invoices',
          })
        })
    }

    return items.slice(0, 12)
  }, [invoices, leads, messages, notifyDeadlines, notifyInvoices, notifyLeads, notifySupport, support, tasks])

  const unreadCount = notifications.filter((item) => !readNotificationIds.includes(item.id)).length
  const displayName = profileName || user?.name || 'Admin User'
  const displayRole = profileRole || user?.role || 'Admin'
  const displayEmail = profileEmail || user?.email || ''

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => {
    const onDashboard = location.pathname === '/admin' || location.pathname === '/admin/'

    if (!onDashboard) {
      setHasShownDashboardNotifications(false)
      return
    }

    if (onDashboard && unreadCount > 0 && !hasShownDashboardNotifications) {
      setNotificationsOpen(true)
      setHasShownDashboardNotifications(true)
    }
  }, [location.pathname, unreadCount, hasShownDashboardNotifications])

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Team', path: '/admin/team' },
    { icon: Users, label: 'Leads', path: '/admin/leads' },
    { icon: Briefcase, label: 'Clients', path: '/admin/clients' },
    { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
    { icon: Image, label: 'Portfolio', path: '/admin/portfolio' },
    { icon: PenTool, label: 'Services', path: '/admin/services' },
    { icon: DollarSign, label: 'Pricing', path: '/admin/pricing' },
    { icon: Star, label: 'Testimonials', path: '/admin/testimonials' },
    { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
    { icon: FileText, label: 'Proposals', path: '/admin/proposals' },
    { icon: CheckCircle, label: 'Invoices', path: '/admin/invoices' },
    { icon: Briefcase, label: 'Tasks', path: '/admin/tasks' },
    { icon: Ticket, label: 'Support', path: '/admin/support' },
    { icon: PenTool, label: 'Blog', path: '/admin/blog' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: HardDrive, label: 'Media', path: '/admin/media' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-slate-900 border-r border-white/10 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            {sidebarOpen && (
              <div>
                <div className="text-white font-bold">{agencyName || 'Bytevora Tech'}</div>
                <div className="text-slate-400 text-xs">Admin Panel</div>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-200px)]">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
                {!sidebarOpen && (
                  <div className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight
              size={20}
              className={`transition-transform ${sidebarOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 md:w-96 pl-10 pr-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setNotificationsOpen((prev) => !prev)}
                  className="relative p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-96 max-h-[28rem] overflow-y-auto bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                      <h3 className="text-white font-semibold">Notifications</h3>
                      <button
                        onClick={() => setReadNotificationIds(notifications.map((item) => item.id))}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="p-2 space-y-1">
                      {notifications.length ? (
                        notifications.map((item) => {
                          const isUnread = !readNotificationIds.includes(item.id)
                          return (
                            <Link
                              key={item.id}
                              to={item.path}
                              onClick={() => {
                                setReadNotificationIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]))
                                setNotificationsOpen(false)
                              }}
                              className={`block p-3 rounded-xl border transition-colors ${
                                isUnread
                                  ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/15'
                                  : 'bg-slate-800/50 border-white/10 hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span className={`mt-1 w-2 h-2 rounded-full ${isUnread ? 'bg-blue-400' : 'bg-slate-600'}`} />
                                <div>
                                  <p className="text-sm text-white">{item.title}</p>
                                  <p className="text-xs text-slate-400 mt-1">{item.meta}</p>
                                </div>
                              </div>
                            </Link>
                          )
                        })
                      ) : (
                        <div className="p-4 text-sm text-slate-400">No notifications right now.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={logout}
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Sign out"
              >
                <LogOut size={20} />
              </button>
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center space-x-3 pl-4 border-l border-white/10"
                >
                  <div className="text-right hidden sm:block">
                    <div className="text-white font-medium">{displayName}</div>
                    <div className="text-slate-400 text-xs">{displayRole}</div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                    {profileAvatarUrl ? (
                      <img src={profileAvatarUrl} alt="Profile avatar" className="w-full h-full object-cover" />
                    ) : (
                      (displayName.charAt(0) || 'A').toUpperCase()
                    )}
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <p className="text-white font-semibold">{displayName}</p>
                      <p className="text-xs text-slate-400 mt-1">{displayRole}</p>
                      {displayEmail && <p className="text-xs text-slate-500 mt-1">{displayEmail}</p>}
                    </div>
                    <div className="p-2">
                      <Link
                        to="/admin/settings"
                        onClick={() => setProfileOpen(false)}
                        className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        Edit Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-slate-800"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout