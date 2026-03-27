import { useState } from 'react'
import { Plus, Mail, Phone, DollarSign, FileText } from 'lucide-react'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import Toast, { type ToastType } from '../components/Toast'
import { useLocalStorageState } from '../hooks/useLocalStorageState'

interface Client {
  id: number
  name: string
  email: string
  phone: string
  project: string
  totalAmount: string
  paidAmount: string
  remainingAmount: string
  status: string
  projectCompleted?: boolean
}

const AdminClients = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clientNotes, setClientNotes] = useState('')
  const [notesByClientId, setNotesByClientId] = useLocalStorageState<Record<number, string>>('admin-client-notes', {})
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [isEditClientOpen, setIsEditClientOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

  const [clients, setClients] = useLocalStorageState<Client[]>('admin-clients', [])

  const [newClient, setNewClient] = useState<Omit<Client, 'id'>>({
    name: '',
    email: '',
    phone: '',
    project: '',
    totalAmount: '0',
    paidAmount: '0',
    remainingAmount: '0',
    status: 'Active',
    projectCompleted: false,
  })

  const filteredClients = clients.filter((client) => !statusFilter || client.status === statusFilter)
  const parseAmount = (raw: string) => {
    const numeric = Number(String(raw || '').replace(/[^\d.-]/g, ''))
    return Number.isFinite(numeric) ? numeric : 0
  }

  const totalBilling = clients.reduce((sum, client) => sum + parseAmount(client.totalAmount), 0)
  const totalPaid = clients.reduce((sum, client) => sum + parseAmount(client.paidAmount), 0)
  const totalRemaining = clients.reduce((sum, client) => sum + parseAmount(client.remainingAmount), 0)
  const activeClientsCount = clients.filter((client) => client.status === 'Active').length
  const pendingInvoices = clients.filter((client) => parseAmount(client.remainingAmount) > 0).length

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email || !newClient.phone || !newClient.project) {
      setToast({ type: 'warning', message: 'Please fill all required client fields.' })
      return
    }
    const item: Client = {
      ...newClient,
      id: clients.length ? Math.max(...clients.map((x) => x.id)) + 1 : 1,
    }
    setClients((prev) => [item, ...prev])
    setIsAddClientOpen(false)
    setToast({ type: 'success', message: 'Client added successfully.' })
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setIsEditClientOpen(true)
  }

  const handleSaveClientEdit = () => {
    if (!editingClient) return
    setClients((prev) => prev.map((client) => (client.id === editingClient.id ? editingClient : client)))
    setIsEditClientOpen(false)
    setEditingClient(null)
    setToast({ type: 'success', message: 'Client updated successfully.' })
  }

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client)
  }

  const toggleProjectCompleted = (client: Client) => {
    const nextCompleted = !client.projectCompleted

    setClients((prev) =>
      prev.map((item) => {
        if (item.id !== client.id) return item
        return { ...item, projectCompleted: nextCompleted }
      }),
    )

    if (selectedClient?.id === client.id) {
      setSelectedClient((prev) => {
        if (!prev) return prev
        return { ...prev, projectCompleted: nextCompleted }
      })
    }

    if (editingClient?.id === client.id) {
      setEditingClient((prev) => {
        if (!prev) return prev
        return { ...prev, projectCompleted: nextCompleted }
      })
    }

    setToast({ type: 'success', message: nextCompleted ? 'Marked project as completed.' : 'Marked project as in progress.' })
  }

  const toggleClientStatus = (client: Client) => {
    const nextStatus = client.status === 'Active' ? 'Inactive' : 'Active'
    setClients((prev) => prev.map((item) => (item.id === client.id ? { ...item, status: nextStatus } : item)))
    if (selectedClient?.id === client.id) {
      setSelectedClient((prev) => (prev ? { ...prev, status: nextStatus } : prev))
    }
    if (editingClient?.id === client.id) {
      setEditingClient((prev) => (prev ? { ...prev, status: nextStatus } : prev))
    }
    setToast({ type: 'success', message: `Client marked as ${nextStatus}.` })
  }

  const confirmDeleteClient = () => {
    if (!clientToDelete) return
    const client = clientToDelete
    setClients((prev) => prev.filter((item) => item.id !== client.id))
    if (selectedClient?.id === client.id) setSelectedClient(null)
    setToast({ type: 'success', message: 'Client deleted.' })
    setClientToDelete(null)
  }

  const columns = [
    { key: 'name', label: 'Client Name' },
    { key: 'project', label: 'Project', render: (row: Client) => (
      <div className="flex items-center space-x-2">
        <FileText size={16} className="text-blue-400" />
        <span className="text-slate-300 max-w-xs truncate" title={row.project}>{row.project}</span>
      </div>
    )},
    { key: 'email', label: 'Email', render: (row: Client) => (
      <div className="flex items-center space-x-2">
        <Mail size={16} className="text-blue-400" />
        <span className="text-slate-300">{row.email}</span>
      </div>
    )},
    { key: 'phone', label: 'Phone', render: (row: Client) => (
      <div className="flex items-center space-x-2">
        <Phone size={16} className="text-blue-400" />
        <span className="text-slate-300">{row.phone}</span>
      </div>
    )},
    { key: 'totalAmount', label: 'Total Amount', render: (row: Client) => (
      <div className="flex items-center space-x-2">
        <DollarSign size={16} className="text-orange-400" />
        <span className="text-white font-medium">{row.totalAmount}</span>
      </div>
    )},
    { key: 'paidAmount', label: 'Paid', render: (row: Client) => (
      <div className="flex items-center space-x-2">
        <DollarSign size={16} className="text-green-400" />
        <span className="text-white font-medium">{row.paidAmount}</span>
      </div>
    )},
    { key: 'remainingAmount', label: 'Remaining', render: (row: Client) => (
      <div className="flex items-center space-x-2">
        <DollarSign size={16} className="text-red-400" />
        <span className="text-white font-medium">{row.remainingAmount}</span>
      </div>
    )},
    {
      key: 'projectCompleted',
      label: 'Completed',
      render: (row: Client) => (
        <label className="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!row.projectCompleted}
            onChange={() => toggleProjectCompleted(row)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-green-500 focus:ring-0 focus:outline-none"
          />
          <span className="text-xs text-slate-300">{row.projectCompleted ? 'Done' : 'In Progress'}</span>
        </label>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: Client) => (
        <button
          onClick={() => toggleClientStatus(row)}
          className="inline-flex rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          title="Click to toggle status"
        >
          <StatusBadge status={row.status} />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Client Management</h1>
          <p className="text-slate-400 mt-1">Manage your client relationships</p>
        </div>
        <button
          onClick={() => setIsAddClientOpen(true)}
          className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          <Plus size={18} />
          <span>Add Client</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white text-sm focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Client Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Clients', value: String(clients.length), color: 'blue' },
          { label: 'Active Clients', value: String(activeClientsCount), color: 'green' },
          { label: 'Total Revenue', value: `₹${totalBilling.toLocaleString()}`, color: 'orange' },
          { label: 'Remaining Balance', value: `₹${totalRemaining.toLocaleString()}`, color: 'red' },
        ].map((stat, index) => (
          <div key={index} className={`p-6 bg-gradient-to-br ${
            stat.color === 'blue' ? 'from-blue-500/20 to-blue-600/20 border-blue-500/30' :
            stat.color === 'green' ? 'from-green-500/20 to-green-600/20 border-green-500/30' :
            stat.color === 'orange' ? 'from-orange-500/20 to-orange-600/20 border-orange-500/30' :
            'from-red-500/20 to-red-600/20 border-red-500/30'
          } rounded-2xl border backdrop-blur-sm`}>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredClients}
        onView={(client: Client) => {
          setSelectedClient(client)
          setClientNotes(notesByClientId[client.id] ?? '')
        }}
        onEdit={(client: Client) => handleEditClient(client)}
        onDelete={(client: Client) => handleDeleteClient(client)}
      />

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Client Details</h2>
              <button onClick={() => setSelectedClient(null)} className="text-slate-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Name</label>
                  <p className="text-white font-medium">{selectedClient.name}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Project</label>
                  <p className="text-white font-medium">{selectedClient.project}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Project Status</label>
                  <p className="text-white font-medium">{selectedClient.projectCompleted ? 'Completed' : 'In Progress'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Email</label>
                  <p className="text-white font-medium">{selectedClient.email}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Phone</label>
                  <p className="text-white font-medium">{selectedClient.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Total Amount</label>
                  <p className="text-white font-medium">{selectedClient.totalAmount}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Paid</label>
                  <p className="text-white font-medium">{selectedClient.paidAmount}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Remaining</label>
                  <p className="text-white font-medium">{selectedClient.remainingAmount}</p>
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Notes</label>
                <textarea
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                  rows={4}
                  placeholder="Add notes about this client..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    if (!selectedClient) return
                    setNotesByClientId((prev) => ({ ...prev, [selectedClient.id]: clientNotes }))
                    setToast({ type: 'success', message: 'Client notes saved.' })
                  }}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-medium transition-colors"
                >
                  Save Notes
                </button>
                <button
                  onClick={() => setToast({ type: 'info', message: 'Invoice flow started for this client.' })}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                  Create Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={isAddClientOpen} onClose={() => setIsAddClientOpen(false)} title="Add Client" size="lg">
        <div className="grid md:grid-cols-2 gap-4">
          <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" placeholder="Client Name" value={newClient.name} onChange={(e) => setNewClient((p) => ({ ...p, name: e.target.value }))} />
          <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" placeholder="Project name or details" value={newClient.project} onChange={(e) => setNewClient((p) => ({ ...p, project: e.target.value }))} />
          <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" placeholder="Email" value={newClient.email} onChange={(e) => setNewClient((p) => ({ ...p, email: e.target.value }))} />
          <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" placeholder="Phone" value={newClient.phone} onChange={(e) => setNewClient((p) => ({ ...p, phone: e.target.value }))} />
          <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" placeholder="Total amount (e.g. ₹50,000)" value={newClient.totalAmount} onChange={(e) => setNewClient((p) => ({ ...p, totalAmount: e.target.value }))} />
          <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" placeholder="Paid amount" value={newClient.paidAmount} onChange={(e) => setNewClient((p) => ({ ...p, paidAmount: e.target.value }))} />
          <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" placeholder="Remaining amount" value={newClient.remainingAmount} onChange={(e) => setNewClient((p) => ({ ...p, remainingAmount: e.target.value }))} />
          <select className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={newClient.status} onChange={(e) => setNewClient((p) => ({ ...p, status: e.target.value }))}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <label className="inline-flex items-center space-x-2 md:col-span-2">
            <input
              type="checkbox"
              checked={newClient.projectCompleted}
              onChange={(e) => setNewClient((p) => ({ ...p, projectCompleted: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-green-500 focus:ring-0 focus:outline-none"
            />
            <span className="text-sm text-slate-300">Mark project as completed</span>
          </label>
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={handleAddClient} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-semibold">Save Client</button>
        </div>
      </Modal>

      <Modal isOpen={isEditClientOpen} onClose={() => setIsEditClientOpen(false)} title="Edit Client" size="lg">
        {editingClient && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingClient.name} onChange={(e) => setEditingClient((p) => (p ? { ...p, name: e.target.value } : p))} />
              <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingClient.project} onChange={(e) => setEditingClient((p) => (p ? { ...p, project: e.target.value } : p))} />
              <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingClient.email} onChange={(e) => setEditingClient((p) => (p ? { ...p, email: e.target.value } : p))} />
              <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingClient.phone} onChange={(e) => setEditingClient((p) => (p ? { ...p, phone: e.target.value } : p))} />
              <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingClient.totalAmount} onChange={(e) => setEditingClient((p) => (p ? { ...p, totalAmount: e.target.value } : p))} />
              <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingClient.paidAmount} onChange={(e) => setEditingClient((p) => (p ? { ...p, paidAmount: e.target.value } : p))} />
              <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingClient.remainingAmount} onChange={(e) => setEditingClient((p) => (p ? { ...p, remainingAmount: e.target.value } : p))} />
              <label className="inline-flex items-center space-x-2 md:col-span-2">
                <input
                  type="checkbox"
                  checked={!!editingClient.projectCompleted}
                  onChange={(e) =>
                    setEditingClient((p) => (p ? { ...p, projectCompleted: e.target.checked } : p))
                  }
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-green-500 focus:ring-0 focus:outline-none"
                />
                <span className="text-sm text-slate-300">Mark project as completed</span>
              </label>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={handleSaveClientEdit} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-semibold">Save Changes</button>
            </div>
          </>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!clientToDelete}
        title="Delete Client"
        message={clientToDelete ? `Are you sure you want to delete ${clientToDelete.name}?` : ''}
        subjectLabel="Client"
        subjectValue={clientToDelete?.name}
        confirmLabel="Delete"
        variant="danger"
        onCancel={() => setClientToDelete(null)}
        onConfirm={confirmDeleteClient}
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default AdminClients