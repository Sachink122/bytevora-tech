import { BarChart3, Briefcase, FileText, MessageSquare, Receipt, Ticket, Users } from 'lucide-react'
import { useLocalStorageValue } from '../../hooks/useLocalStorageValue'

const AdminAnalytics = () => {
  const leads = useLocalStorageValue<Array<{ id: number; status?: string }>>('admin-leads', [])
  const projects = useLocalStorageValue<Array<{ id: number; status?: string }>>('admin-projects', [])
  const clients = useLocalStorageValue<Array<{ id: number; status?: string }>>('admin-clients', [])
  const messages = useLocalStorageValue<Array<{ id: number; status?: string }>>('admin-messages', [])
  const proposals = useLocalStorageValue<Array<{ id: number; status?: string }>>('admin-proposals', [])
  const invoices = useLocalStorageValue<Array<{ id: number; status?: string }>>('admin-invoices', [])
  const supportTickets = useLocalStorageValue<Array<{ id: number; status?: string }>>('admin-support', [])

  const cards = [
    { label: 'Leads', value: leads.length, icon: Users },
    { label: 'Projects', value: projects.length, icon: Briefcase },
    { label: 'Messages', value: messages.length, icon: MessageSquare },
    { label: 'Proposals', value: proposals.length, icon: FileText },
    { label: 'Invoices', value: invoices.length, icon: Receipt },
    { label: 'Support Tickets', value: supportTickets.length, icon: Ticket },
  ]

  const pipeline = [
    { label: 'New Leads', value: leads.filter((item) => item.status === 'New').length },
    { label: 'Won Leads', value: leads.filter((item) => item.status === 'Won').length },
    { label: 'Active Projects', value: projects.filter((item) => item.status === 'In Progress').length },
    { label: 'Active Clients', value: clients.filter((item) => item.status === 'Active').length },
    { label: 'Open Tickets', value: supportTickets.filter((item) => item.status === 'Open').length },
  ]

  const maxValue = Math.max(...pipeline.map((item) => item.value), 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-1">Operational insights from your admin modules.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-slate-900/50 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400">{card.label}</p>
                <Icon className="text-blue-400" size={20} />
              </div>
              <p className="text-4xl font-bold text-white">{card.value}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Pipeline Snapshot</h2>
          <BarChart3 className="text-blue-400" size={20} />
        </div>
        <div className="space-y-4">
          {pipeline.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-300 text-sm">{item.label}</span>
                <span className="text-white text-sm font-semibold">{item.value}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
                  style={{ width: `${Math.max(6, Math.round((item.value / maxValue) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics
