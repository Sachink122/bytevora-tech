import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Briefcase,
  CheckCircle,
  DollarSign,
  MessageSquare,
  Ticket,
  Calendar,
  BarChart3,
  PieChart,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import Modal from '../components/Modal'
import Toast, { type ToastType } from '../components/Toast'
import { useLocalStorageState } from '../hooks/useLocalStorageState'

interface LeadSummary {
  id: number
  status: string
  service: string
}

interface ProjectSummary {
  id: number
  name: string
  client: string
  deadline: string
  status: string
}

interface InvoiceSummary {
  id: number
  amount?: string
  dueDate?: string
  createdAt?: string
  status?: string
}

interface ClientSummary {
  id: number
  status: string
  totalAmount?: string
  paidAmount?: string
  remainingAmount?: string
  project?: string
  projectCompleted?: boolean
}

interface SupportTicketSummary {
  id: number
  status: string
}

interface ProposalSummary {
  id: number
  status: string
}

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [showCalendar, setShowCalendar] = useState(false)
  const [showAllActivity, setShowAllActivity] = useState(false)
  const [revenueRange, setRevenueRange] = useState('Last 6 months')
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [invoiceTitle, setInvoiceTitle] = useState('')
  const [invoiceAmount, setInvoiceAmount] = useState('')
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)
  const [savedInvoices, setSavedInvoices] = useLocalStorageState<Array<{ id: number; title: string; amount: string; createdAt: string }>>('admin-dashboard-invoices', [])
  const [invoices] = useLocalStorageState<InvoiceSummary[]>('admin-invoices', [])
  const [leads] = useLocalStorageState<LeadSummary[]>('admin-leads', [])
  const [projects] = useLocalStorageState<ProjectSummary[]>('admin-projects', [])
  const [clients] = useLocalStorageState<ClientSummary[]>('admin-clients', [])
  const [supportTickets] = useLocalStorageState<SupportTicketSummary[]>('admin-support', [])
  const [proposals] = useLocalStorageState<ProposalSummary[]>('admin-proposals', [])

  const combinedInvoices = [
    ...savedInvoices.map((invoice) => ({ amount: invoice.amount, createdAt: invoice.createdAt })),
    ...invoices.map((invoice) => ({ amount: invoice.amount || '0', createdAt: invoice.dueDate || invoice.createdAt || '' })),
  ]

  const invoiceTotal = combinedInvoices.reduce((sum, invoice) => {
    const amount = Number(String(invoice.amount || '').replace(/[^\d.-]/g, ''))
    return sum + (Number.isFinite(amount) ? amount : 0)
  }, 0)

  const monthlyRevenueRaw = Array.from({ length: 12 }, () => 0)
  for (const invoice of combinedInvoices) {
    const amount = Number(String(invoice.amount || '').replace(/[^\d.-]/g, ''))
    if (!Number.isFinite(amount)) continue
    const createdAt = new Date(invoice.createdAt || '')
    if (Number.isNaN(createdAt.getTime())) continue
    if (createdAt.getFullYear() === new Date().getFullYear()) {
      monthlyRevenueRaw[createdAt.getMonth()] += amount
    }
  }

  const normalizePercent = (values: number[]) => {
    const max = Math.max(...values, 0)
    if (max === 0) return values.map(() => 5)
    return values.map((value) => Math.max(5, Math.round((value / max) * 100)))
  }

  const revenueByRange: Record<string, number[]> = {
    'Last 6 months': normalizePercent(monthlyRevenueRaw.slice(6)),
    'Last 12 months': normalizePercent(monthlyRevenueRaw),
    'This year': normalizePercent(monthlyRevenueRaw),
  }

  const monthsByRange: Record<string, string[]> = {
    'Last 6 months': ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    'Last 12 months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    'This year': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  }

  const parseAmount = (raw: string | undefined) => {
    const numeric = Number(String(raw || '').replace(/[^\d.-]/g, ''))
    return Number.isFinite(numeric) ? numeric : 0
  }

  const totalBilled = clients.reduce((sum, client) => sum + parseAmount(client.totalAmount), 0)
  const totalPaid = clients.reduce((sum, client) => sum + parseAmount(client.paidAmount), 0)
  const totalUnpaid = clients.reduce((sum, client) => sum + parseAmount(client.remainingAmount), 0)
  const clientsWithUnpaid = clients.filter((client) => parseAmount(client.remainingAmount) > 0).length
  const clientsWithBilled = clients.filter((client) => parseAmount(client.totalAmount) > 0).length
  const clientsWithPaid = clients.filter((client) => parseAmount(client.paidAmount) > 0).length

  const activeProjects = clients.filter((client) => client.project && !client.projectCompleted).length
  const completedProjects = clients.filter((client) => client.project && client.projectCompleted).length
  const pendingInvoices = combinedInvoices.length
  const activeClients = clients.filter((client) => client.status === 'Active').length
  const wonLeads = leads.filter((lead) => lead.status === 'Won').length
  const acceptedProposals = proposals.filter((proposal) => proposal.status === 'Accepted').length
  const totalOpportunities = leads.length + proposals.length
  const convertedOpportunities = wonLeads + acceptedProposals
  const conversionRate = totalOpportunities ? Math.round((convertedOpportunities / totalOpportunities) * 100) : 0
  const supportTicketCount = supportTickets.length

  const stats = [
    { title: 'Total Leads', value: String(leads.length), change: 'Live', changeType: 'positive' as const, icon: Users, color: 'blue' as const },
    { title: 'Active Projects', value: String(activeProjects), change: 'Live', changeType: 'positive' as const, icon: Briefcase, color: 'green' as const },
    { title: 'Completed Projects', value: String(completedProjects), change: 'Live', changeType: 'positive' as const, icon: CheckCircle, color: 'purple' as const },
    { title: `Total Revenue (₹) ${clientsWithPaid}`, value: `₹${totalPaid.toLocaleString()}`, change: 'Live', changeType: 'positive' as const, icon: DollarSign, color: 'orange' as const },
    { title: `Total Billed (₹) ${clientsWithBilled}`, value: `₹${totalBilled.toLocaleString()}`, change: 'Live', changeType: 'positive' as const, icon: DollarSign, color: 'green' as const },
    { title: `Unpaid Amount (₹) ${clientsWithUnpaid}`, value: `₹${totalUnpaid.toLocaleString()}`, change: 'Live', changeType: 'positive' as const, icon: DollarSign, color: 'red' as const },
    { title: 'Active Clients', value: String(activeClients), change: 'Live', changeType: 'positive' as const, icon: MessageSquare, color: 'blue' as const },
    { title: 'Support Tickets', value: String(supportTicketCount), change: 'Live', changeType: 'positive' as const, icon: Ticket, color: 'purple' as const },
  ]

  const recentActivity = [
    ...(savedInvoices[0]
      ? [
          {
            id: savedInvoices[0].id,
            type: 'invoice' as const,
            message: `Invoice saved: ${savedInvoices[0].title}`,
            time: new Date(savedInvoices[0].createdAt).toLocaleDateString(),
          },
        ]
      : []),
    ...(projects.length
      ? [{ id: 9001, type: 'project' as const, message: `${projects.length} projects in workspace`, time: 'Current snapshot' }]
      : []),
    ...(leads.length ? [{ id: 9002, type: 'lead' as const, message: `${leads.length} leads in pipeline`, time: 'Current snapshot' }] : []),
  ]

  const upcomingDeadlines = projects
    .filter((project) => project.deadline)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 4)
    .map((project) => ({
      project: project.name,
      client: project.client,
      deadline: project.deadline,
      status: project.status,
    }))

  const serviceCount = leads.reduce<Record<string, number>>((acc, lead) => {
    const key = lead.service || 'Uncategorized'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  const totalServiceRequests = Object.values(serviceCount).reduce((sum, value) => sum + value, 0)
  const topServices = Object.entries(serviceCount)
    .map(([service, requests]) => ({
      service,
      requests,
      percentage: totalServiceRequests ? Math.round((requests / totalServiceRequests) * 100) : 0,
    }))
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1">Live operational snapshot for your workspace.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCalendar((prev) => !prev)}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors"
          >
            <Calendar />
            <span className="ml-2">View Calendar</span>
          </button>
          <button
            onClick={() => navigate('/admin/projects')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <Briefcase />
            <span className="ml-2">Add Project</span>
          </button>
          <button
            onClick={() => setIsInvoiceOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors"
          >
            <DollarSign />
            <span className="ml-2">Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Calendar */}
      {showCalendar && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Calendar</h3>
              <p className="text-slate-400 text-sm">Upcoming deadlines and events</p>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-slate-400 text-sm">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="font-semibold">{day}</div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i - 3
              const isCurrentMonth = day > 0 && day <= 31
              const isToday = day === 24
              return (
                <div
                  key={i}
                  className={`p-2 rounded-lg ${
                    isCurrentMonth ? 'text-white' : 'text-slate-600'
                  } ${isToday ? 'bg-blue-600' : ''}`}
                >
                  {isCurrentMonth ? day : ''}
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Revenue Overview</h3>
              <p className="text-slate-400 text-sm">Monthly revenue trends</p>
            </div>
            <select
              value={revenueRange}
              onChange={(e) => setRevenueRange(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
            >
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>This year</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {revenueByRange[revenueRange].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-lg"
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-slate-400 text-xs">
            {monthsByRange[revenueRange].map(month => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </motion.div>

        {/* Lead Conversion Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/50 rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Lead Conversion</h3>
              <p className="text-slate-400 text-sm">Conversion by source</p>
            </div>
            <BarChart3 className="text-blue-500" />
          </div>
          <div className="space-y-4">
            {[
              { label: 'New', value: leads.filter((lead) => lead.status === 'New').length, color: 'from-blue-500 to-blue-600' },
              { label: 'Contacted', value: leads.filter((lead) => lead.status === 'Contacted').length, color: 'from-cyan-500 to-cyan-600' },
              { label: 'Proposal Sent', value: leads.filter((lead) => lead.status === 'Proposal Sent').length, color: 'from-purple-500 to-purple-600' },
              { label: 'Won', value: leads.filter((lead) => lead.status === 'Won').length, color: 'from-green-500 to-green-600' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${leads.length ? Math.max(5, Math.round((item.value / leads.length) * 100)) : 5}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
            {!leads.length && <p className="text-slate-500 text-sm">No lead data yet. Add leads to see pipeline breakdown.</p>}
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-slate-900/50 rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
            <button
              onClick={() => setShowAllActivity((prev) => !prev)}
              className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
            >
              {showAllActivity ? 'Show less' : 'View all'}
            </button>
          </div>
          <div className="space-y-4">
            {(showAllActivity ? recentActivity : recentActivity.slice(0, 3)).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activity.type === 'lead' ? 'bg-blue-500/20 text-blue-400' :
                  activity.type === 'project' ? 'bg-green-500/20 text-green-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {activity.type === 'lead' && <Users />}
                  {activity.type === 'project' && <CheckCircle />}
                  {activity.type === 'invoice' && <DollarSign />}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.message}</p>
                  <p className="text-slate-400 text-sm mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && <p className="text-slate-500 text-sm">No recent activity yet.</p>}
          </div>
        </motion.div>

        {/* Top Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900/50 rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Top Services</h3>
            <PieChart className="text-blue-500" />
          </div>
          <div className="space-y-4">
            {topServices.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">{item.service}</span>
                  <span className="text-white font-medium">{item.requests}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  />
                </div>
              </div>
            ))}
            {topServices.length === 0 && <p className="text-slate-500 text-sm">No service demand data yet.</p>}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Deadlines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-900/50 rounded-2xl border border-white/10 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="text-blue-500" />
            <h3 className="text-xl font-semibold text-white">Upcoming Deadlines</h3>
          </div>
          <button
            onClick={() => {
              setShowCalendar(true)
              window.scrollTo({ top: 0, behavior: 'smooth' })
              setToast({ type: 'info', message: 'Calendar opened.' })
            }}
            className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
          >
            View calendar
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {upcomingDeadlines.map((deadline, index) => (
            <div
              key={index}
              className="p-4 bg-slate-800/30 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <Calendar className="text-slate-400" />
                <span className={`text-xs px-2 py-1 rounded-full ${
                  deadline.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                  deadline.status === 'Review' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {deadline.status}
                </span>
              </div>
              <h4 className="text-white font-medium mb-1">{deadline.project}</h4>
              <p className="text-slate-400 text-sm mb-2">{deadline.client}</p>
              <p className="text-blue-400 text-xs font-medium">{deadline.deadline}</p>
            </div>
          ))}
          {upcomingDeadlines.length === 0 && <p className="text-slate-500 text-sm col-span-full">No project deadlines scheduled yet.</p>}
        </div>
      </motion.div>

      <Modal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} title="Create Invoice" size="md">
        <div className="space-y-4">
          <input
            value={invoiceTitle}
            onChange={(e) => setInvoiceTitle(e.target.value)}
            placeholder="Invoice title"
            className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white"
          />
          <input
            value={invoiceAmount}
            onChange={(e) => setInvoiceAmount(e.target.value)}
            placeholder="Amount (e.g. 2500)"
            className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white"
          />
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (!invoiceTitle || !invoiceAmount) {
                  setToast({ type: 'warning', message: 'Please enter invoice title and amount.' })
                  return
                }
                setSavedInvoices((prev) => [
                  {
                    id: Date.now(),
                    title: invoiceTitle,
                    amount: invoiceAmount,
                    createdAt: new Date().toISOString(),
                  },
                  ...prev,
                ])
                setIsInvoiceOpen(false)
                setInvoiceTitle('')
                setInvoiceAmount('')
                setToast({ type: 'success', message: 'Invoice saved successfully.' })
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-semibold"
            >
              Save Invoice
            </button>
          </div>
        </div>
      </Modal>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default AdminDashboard
