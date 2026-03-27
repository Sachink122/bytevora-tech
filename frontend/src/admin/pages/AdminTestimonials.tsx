import { useState } from 'react'
import { Plus } from 'lucide-react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import Toast, { type ToastType } from '../components/Toast'
import { useLocalStorageState } from '../hooks/useLocalStorageState'

interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
}

const defaultForm: Omit<Testimonial, 'id'> = {
  name: '',
  role: '',
  content: '',
  rating: 5,
}

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useLocalStorageState<Testimonial[]>('admin-testimonials', [])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [deleteItem, setDeleteItem] = useState<Testimonial | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)

  const columns = [
    { key: 'name', label: 'Client Name' },
    { key: 'role', label: 'Role / Company' },
    { key: 'content', label: 'Feedback' },
    {
      key: 'rating',
      label: 'Rating',
      render: (row: Testimonial) => <span className="text-yellow-400">{'★'.repeat(Math.max(1, Math.min(5, row.rating)))}</span>,
    },
  ]

  const openAdd = () => {
    setForm(defaultForm)
    setIsAddOpen(true)
  }

  const handleAdd = () => {
    if (!form.name || !form.role || !form.content) {
      setToast({ type: 'warning', message: 'Please fill all testimonial fields.' })
      return
    }

    const item: Testimonial = {
      ...form,
      id: testimonials.length ? Math.max(...testimonials.map((x) => x.id)) + 1 : 1,
    }

    setTestimonials((prev) => [item, ...prev])
    setIsAddOpen(false)
    setToast({ type: 'success', message: 'Testimonial added.' })
  }

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item)
    setForm({ name: item.name, role: item.role, content: item.content, rating: item.rating })
    setIsEditOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingItem) return
    if (!form.name || !form.role || !form.content) {
      setToast({ type: 'warning', message: 'Please fill all testimonial fields.' })
      return
    }

    setTestimonials((prev) => prev.map((item) => (item.id === editingItem.id ? { ...item, ...form } : item)))
    setIsEditOpen(false)
    setEditingItem(null)
    setToast({ type: 'success', message: 'Testimonial updated.' })
  }

  const confirmDelete = () => {
    if (!deleteItem) return
    setTestimonials((prev) => prev.filter((item) => item.id !== deleteItem.id))
    setDeleteItem(null)
    setToast({ type: 'success', message: 'Testimonial deleted.' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Testimonials</h1>
          <p className="text-slate-400 mt-1">Manage public testimonials shown on the website.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          <Plus size={18} />
          <span>Add Testimonial</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={testimonials}
        onEdit={handleEdit}
        onDelete={(item: Testimonial) => setDeleteItem(item)}
      />

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Testimonial" size="lg">
        <div className="space-y-4">
          <input
            className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white"
            placeholder="Client name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white"
            placeholder="Role or company"
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
          />
          <textarea
            rows={4}
            className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white"
            placeholder="Feedback"
            value={form.content}
            onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
          />
          <select
            className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white"
            value={form.rating}
            onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
          >
            <option value={5}>5 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={2}>2 Stars</option>
            <option value={1}>1 Star</option>
          </select>
          <div className="flex justify-end">
            <button onClick={handleAdd} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-semibold">Save</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Testimonial" size="lg">
        <div className="space-y-4">
          <input
            className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white"
            placeholder="Client name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white"
            placeholder="Role or company"
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
          />
          <textarea
            rows={4}
            className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white"
            placeholder="Feedback"
            value={form.content}
            onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
          />
          <select
            className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white"
            value={form.rating}
            onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
          >
            <option value={5}>5 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={2}>2 Stars</option>
            <option value={1}>1 Star</option>
          </select>
          <div className="flex justify-end">
            <button onClick={handleSaveEdit} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-semibold">Save Changes</button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteItem}
        title="Delete Testimonial"
        message={deleteItem ? `Are you sure you want to delete testimonial from ${deleteItem.name}?` : ''}
        subjectLabel="Client"
        subjectValue={deleteItem?.name}
        confirmLabel="Delete"
        variant="danger"
        onCancel={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default AdminTestimonials
