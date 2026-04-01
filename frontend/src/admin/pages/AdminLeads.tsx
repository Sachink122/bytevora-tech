import { useMemo, useState, useEffect } from 'react'
import { Plus, Download } from 'lucide-react'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import Toast, { type ToastType } from '../components/Toast'
import { useLocalStorageState } from '../hooks/useLocalStorageState'

interface Lead {
  id: number
  name?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  service?: string
  budget?: string
  projectDetails?: string
  date?: string
  status?: string
  priority?: string
}

const AdminLeads = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [leadNotes, setLeadNotes] = useState('')
  const [notesByLeadId, setNotesByLeadId] = useLocalStorageState<Record<number, string>>('admin-lead-notes', {})
  const [leadActionMessage, setLeadActionMessage] = useState('')
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false)
  const [isEditLeadOpen, setIsEditLeadOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [serviceFilter, setServiceFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const [leads, setLeads] = useLocalStorageState<Lead[]>('admin-leads', [])
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

  // Fetch leads from backend when admin is authenticated
  useEffect(() => {
    let mounted = true
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem('agency_auth_token') || ''
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (token) headers.Authorization = `Bearer ${token}`

        const res = await fetch(`${API_BASE_URL}/api/leads`, { headers })
        if (!res.ok) return
        const data = (await res.json()) as any[]
        if (!mounted) return
        const mapped: Lead[] = data.map((d) => ({
          id: d.id,
          firstName: d.firstName || '',
          lastName: d.lastName || '',
          email: d.email || '',
          phone: d.phone || '',
          service: d.service || '',
          budget: d.budget || '',
          projectDetails: d.projectDetails || '',
          date: d.createdAt ? new Date(d.createdAt).toISOString().split('T')[0] : '',
          status: d.status || '',
          priority: d.priority || '',
        }))
        setLeads(mapped)
      } catch (e) {
        // keep local state if fetch fails
        console.error('Failed to fetch admin leads', e)
      }
    }

    fetchLeads()
    return () => {
      mounted = false
    }
  }, [])

  const [newLead, setNewLead] = useState<Omit<Lead, 'id' | 'date'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: 'Business Website',
    budget: '',
    projectDetails: '',
    status: 'New',
    priority: 'Medium',
  })

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const statusMatch = !statusFilter || lead.status === statusFilter
      const serviceMatch = !serviceFilter || lead.service === serviceFilter
      const priorityMatch = !priorityFilter || lead.priority === priorityFilter
      return statusMatch && serviceMatch && priorityMatch
    })
  }, [leads, statusFilter, serviceFilter, priorityFilter])

  const openLeadDetails = (lead: Lead) => {
    setSelectedLead(lead)
    setLeadNotes(notesByLeadId[lead.id] ?? '')
    setLeadActionMessage('')
  }

  const handleAddLead = () => {
    if (!newLead.firstName || !newLead.email || !newLead.phone) {
      setToast({ type: 'warning', message: 'Please fill all required lead fields.' })
      return
    }
    ;(async () => {
      try {
        const token = localStorage.getItem('agency_auth_token') || ''
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (token) headers.Authorization = `Bearer ${token}`

        const payload = {
          firstName: newLead.firstName,
          lastName: newLead.lastName,
          email: newLead.email,
          phone: newLead.phone,
          service: newLead.service,
          budget: newLead.budget,
          projectDetails: newLead.projectDetails,
          status: newLead.status || 'New',
        }

        const res = await fetch(`${API_BASE_URL}/api/leads`, { method: 'POST', headers, body: JSON.stringify(payload) })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          setToast({ type: 'error', message: `Failed to save lead: ${body?.message || res.status}` })
          return
        }

        const body = await res.json().catch(() => null)
        const saved = body?.lead

        const item: Lead = saved
          ? {
              id: saved.id,
              firstName: saved.firstName || '',
              lastName: saved.lastName || '',
              email: saved.email || '',
              phone: saved.phone || '',
              service: saved.service || '',
              budget: saved.budget || '',
              projectDetails: saved.projectDetails || '',
              date: saved.createdAt ? new Date(saved.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              status: saved.status || 'New',
            }
          : {
              ...newLead,
              id: leads.length ? Math.max(...leads.map((x) => x.id)) + 1 : 1,
              date: new Date().toISOString().split('T')[0],
            }

        setLeads((prev) => [item, ...prev])
        setIsAddLeadOpen(false)
        setToast({ type: 'success', message: 'Lead added successfully.' })
        setNewLead({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          service: 'Business Website',
          budget: '',
          projectDetails: '',
          status: 'New',
          priority: 'Medium',
        })
      } catch (err) {
        console.error('Add lead error', err)
        setToast({ type: 'error', message: 'Failed to save lead (network error)' })
      }
    })()
  }

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead)
    setIsEditLeadOpen(true)
  }

  const handleSaveLeadEdit = () => {
    if (!editingLead) return
    setLeads((prev) => prev.map((lead) => (lead.id === editingLead.id ? editingLead : lead)))
    setIsEditLeadOpen(false)
    setEditingLead(null)
    setToast({ type: 'success', message: 'Lead updated successfully.' })
  }

  const handleDeleteLead = (lead: Lead) => {
    setLeadToDelete(lead)
  }

  const confirmDeleteLead = () => {
    if (!leadToDelete) return
    const lead = leadToDelete
    setLeads((prev) => prev.filter((item) => item.id !== lead.id))
    if (selectedLead?.id === lead.id) setSelectedLead(null)
    setToast({ type: 'success', message: 'Lead deleted.' })
    setLeadToDelete(null)
  }

  const handleExportLeads = () => {
    if (!filteredLeads.length) {
      setToast({ type: 'warning', message: 'No leads available to export.' })
      return
    }
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Service', 'Budget', 'Project Details', 'Date', 'Status']
    const rows = filteredLeads.map((lead) => [lead.firstName || '', lead.lastName || '', lead.email || '', lead.phone || '', lead.service || '', lead.budget || '', (lead.projectDetails || '').replace(/\n/g, ' '), lead.date || '', lead.status || ''])
    const csv = [headers.join(','), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'leads-export.csv'
    link.click()
    URL.revokeObjectURL(url)
    setToast({ type: 'info', message: 'Leads exported as CSV.' })
  }

  const columns = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'service', label: 'Service' },
    { key: 'budget', label: 'Budget' },
    { key: 'projectDetails', label: 'Project Details', render: (row: Lead) => <div className="max-w-[24rem] truncate">{row.projectDetails}</div> },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', render: (row: Lead) => <StatusBadge status={row.status} /> },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Lead Management</h1>
          <p className="text-slate-400 mt-1">Manage and track all your leads</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={handleExportLeads} className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors">
            <Download size={18} />
            <span className="text-sm">Export</span>
          </button>
          <button
            onClick={() => setIsAddLeadOpen(true)}
            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <Plus size={18} />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Interested">Interested</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
        >
          <option value="">All Services</option>
          <option value="Business Website">Business Website</option>
          <option value="E-commerce">E-commerce</option>
          <option value="Custom Dashboard">Custom Dashboard</option>
          <option value="Landing Page">Landing Page</option>
          <option value="Portfolio Website">Portfolio Website</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredLeads}
        onView={(lead: Lead) => openLeadDetails(lead)}
        onEdit={(lead: Lead) => handleEditLead(lead)}
        onDelete={(lead: Lead) => handleDeleteLead(lead)}
      />

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Lead Details</h2>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-white transition-colors text-2xl">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">First Name</label>
                  <p className="text-white font-medium">{selectedLead.firstName}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Last Name</label>
                  <p className="text-white font-medium">{selectedLead.lastName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Email</label>
                  <p className="text-white font-medium">{selectedLead.email}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Phone</label>
                  <p className="text-white font-medium">{selectedLead.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Service Interest</label>
                  <p className="text-white font-medium">{selectedLead.service}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Status</label>
                  <StatusBadge status={selectedLead.status} />
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm text-slate-500">Project Details</h4>
                <div className="whitespace-pre-line text-base">{selectedLead.projectDetails || '—'}</div>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Notes</label>
                <textarea
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                  rows={4}
                  placeholder="Add notes about this lead..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    if (!selectedLead) return
                    setNotesByLeadId((prev) => ({ ...prev, [selectedLead.id]: leadNotes }))
                    setLeadActionMessage('Notes saved successfully')
                    setToast({ type: 'success', message: 'Lead notes saved.' })
                  }}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-medium transition-colors"
                >
                  Save Notes
                </button>
                <button
                  onClick={() => {
                    if (!selectedLead) return
                    const proposalMessage = `Proposal started for ${selectedLead.firstName || ''} ${selectedLead.lastName || ''}`
                    const updatedNotes = leadNotes ? `${leadNotes}\n${proposalMessage}` : proposalMessage
                    setLeadNotes(updatedNotes)
                    setNotesByLeadId((prev) => ({ ...prev, [selectedLead.id]: updatedNotes }))
                    setLeads((prev) =>
                      prev.map((lead) =>
                        lead.id === selectedLead.id ? { ...lead, status: 'Proposal Sent' } : lead
                      )
                    )
                    setSelectedLead((prev) => (prev ? { ...prev, status: 'Proposal Sent' } : prev))
                    setLeadActionMessage('Proposal created and status updated')
                    setToast({ type: 'success', message: 'Proposal created.' })
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                  Create Proposal
                </button>
              </div>
              {leadActionMessage && <p className="text-sm text-green-400">{leadActionMessage}</p>}
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={isAddLeadOpen} onClose={() => setIsAddLeadOpen(false)} title="Add Lead" size="lg">
        <div className="grid md:grid-cols-2 gap-4">
          <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" placeholder="First Name" value={newLead.firstName} onChange={(e) => setNewLead((p) => ({ ...p, firstName: e.target.value }))} />
          <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" placeholder="Last Name" value={newLead.lastName} onChange={(e) => setNewLead((p) => ({ ...p, lastName: e.target.value }))} />
          <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" placeholder="Budget" value={newLead.budget} onChange={(e) => setNewLead((p) => ({ ...p, budget: e.target.value }))} />
          <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" placeholder="Project Details" value={newLead.projectDetails} onChange={(e) => setNewLead((p) => ({ ...p, projectDetails: e.target.value }))} />
          <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" placeholder="Email" value={newLead.email} onChange={(e) => setNewLead((p) => ({ ...p, email: e.target.value }))} />
          <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" placeholder="Phone" value={newLead.phone} onChange={(e) => setNewLead((p) => ({ ...p, phone: e.target.value }))} />
          <select className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={newLead.service} onChange={(e) => setNewLead((p) => ({ ...p, service: e.target.value }))}>
            <option>Business Website</option>
            <option>E-commerce</option>
            <option>Custom Dashboard</option>
            <option>Landing Page</option>
            <option>Portfolio Website</option>
          </select>
          <select className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={newLead.priority} onChange={(e) => setNewLead((p) => ({ ...p, priority: e.target.value }))}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={handleAddLead} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-semibold">Save Lead</button>
        </div>
      </Modal>

      <Modal isOpen={isEditLeadOpen} onClose={() => setIsEditLeadOpen(false)} title="Edit Lead" size="lg">
        {editingLead && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingLead.firstName} onChange={(e) => setEditingLead((p) => (p ? { ...p, firstName: e.target.value } : p))} />
              <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingLead.lastName} onChange={(e) => setEditingLead((p) => (p ? { ...p, lastName: e.target.value } : p))} />
              <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingLead.budget} onChange={(e) => setEditingLead((p) => (p ? { ...p, budget: e.target.value } : p))} />
              <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingLead.projectDetails} onChange={(e) => setEditingLead((p) => (p ? { ...p, projectDetails: e.target.value } : p))} />
              <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingLead.email} onChange={(e) => setEditingLead((p) => (p ? { ...p, email: e.target.value } : p))} />
              <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingLead.phone} onChange={(e) => setEditingLead((p) => (p ? { ...p, phone: e.target.value } : p))} />
              <select className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingLead.service} onChange={(e) => setEditingLead((p) => (p ? { ...p, service: e.target.value } : p))}>
                <option>Business Website</option>
                <option>E-commerce</option>
                <option>Custom Dashboard</option>
                <option>Landing Page</option>
                <option>Portfolio Website</option>
              </select>
              <select className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingLead.status} onChange={(e) => setEditingLead((p) => (p ? { ...p, status: e.target.value } : p))}>
                <option>New</option>
                <option>Contacted</option>
                <option>Interested</option>
                <option>Proposal Sent</option>
                <option>Won</option>
                <option>Lost</option>
              </select>
              <select className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingLead.priority} onChange={(e) => setEditingLead((p) => (p ? { ...p, priority: e.target.value } : p))}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={handleSaveLeadEdit} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-semibold">Save Changes</button>
            </div>
          </>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!leadToDelete}
        title="Delete Lead"
        message={leadToDelete ? `Are you sure you want to delete ${leadToDelete.firstName || ''} ${leadToDelete.lastName || ''}?` : ''}
        subjectLabel="Lead"
        subjectValue={leadToDelete ? `${leadToDelete.firstName || ''} ${leadToDelete.lastName || ''}` : ''}
        confirmLabel="Delete"
        variant="danger"
        onCancel={() => setLeadToDelete(null)}
        onConfirm={confirmDeleteLead}
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default AdminLeads