import { useState } from 'react'
import { Plus, MoreVertical, ExternalLink, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import Toast, { type ToastType } from '../components/Toast'
import { useLocalStorageState } from '../hooks/useLocalStorageState'

interface PortfolioItem {
  id: number
  title: string
  category: string
  image: string
  projectUrl: string
}

const AdminPortfolio = () => {
  const [items, setItems] = useLocalStorageState<PortfolioItem[]>('admin-portfolio-items', [])

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState<number | null>(null)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<PortfolioItem | null>(null)
  const [newItem, setNewItem] = useState<Omit<PortfolioItem, 'id'>>({
    title: '',
    category: 'Business Website',
    image: '',
    projectUrl: '',
  })
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)

  const handleAddItem = () => {
    if (!newItem.title || !newItem.image || !newItem.projectUrl) {
      setToast({ type: 'warning', message: 'Please fill title, image, and project URL.' })
      return
    }
    const next: PortfolioItem = {
      ...newItem,
      id: items.length ? Math.max(...items.map((x) => x.id)) + 1 : 1,
    }
    setItems((prev) => [next, ...prev])
    setIsAddOpen(false)
    setNewItem({ title: '', category: 'Business Website', image: '', projectUrl: '' })
    setToast({ type: 'success', message: 'Portfolio item added.' })
  }

  const handleOpenProject = (item: PortfolioItem) => {
    window.open(item.projectUrl, '_blank', 'noopener,noreferrer')
    setToast({ type: 'info', message: 'Opened project in a new tab.' })
  }

  const handleImageUpload = (file: File, mode: 'new' | 'edit') => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = String(reader.result || '')
      if (mode === 'new') {
        setNewItem((prev) => ({ ...prev, image: result }))
      } else {
        setEditingItem((prev) => (prev ? { ...prev, image: result } : prev))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDelete = (item: PortfolioItem) => {
    setItemToDelete(item)
  }

  const confirmDelete = () => {
    if (!itemToDelete) return
    const item = itemToDelete
    setItems((prev) => prev.filter((x) => x.id !== item.id))
    setMenuOpen(null)
    setToast({ type: 'success', message: 'Portfolio item deleted.' })
    setItemToDelete(null)
  }

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item)
    setIsEditOpen(true)
    setMenuOpen(null)
  }

  const handleSaveEdit = () => {
    if (!editingItem) return
    setItems((prev) => prev.map((item) => (item.id === editingItem.id ? editingItem : item)))
    setIsEditOpen(false)
    setEditingItem(null)
    setToast({ type: 'success', message: 'Portfolio item updated.' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Portfolio Management</h1>
          <p className="text-slate-400 mt-1">Add and maintain your public project portfolio</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          <Plus size={18} />
          <span>Add Portfolio Item</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden">
            <div className="relative">
              <img src={item.image} alt={item.title} className="w-full h-44 object-cover" />
              <button
                onClick={() => setMenuOpen((prev) => (prev === item.id ? null : item.id))}
                className="absolute top-3 right-3 p-2 rounded-lg bg-black/40 text-white hover:bg-black/60"
              >
                <MoreVertical size={16} />
              </button>
              {menuOpen === item.id && (
                <div className="absolute top-12 right-3 w-44 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden">
                  <button onClick={() => handleOpenProject(item)} className="w-full flex items-center px-3 py-2 text-sm text-slate-200 hover:bg-slate-700">
                    <ExternalLink size={14} className="mr-2" /> Open Project
                  </button>
                  <button onClick={() => handleEdit(item)} className="w-full flex items-center px-3 py-2 text-sm text-slate-200 hover:bg-slate-700">
                    <Edit size={14} className="mr-2" /> Edit
                  </button>
                  <button onClick={() => handleDelete(item)} className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:bg-slate-700">
                    <Trash2 size={14} className="mr-2" /> Delete
                  </button>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold">{item.title}</h3>
              <p className="text-slate-400 text-sm mt-1">{item.category}</p>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="p-10 text-center bg-slate-900/40 border border-white/10 rounded-2xl">
          <p className="text-slate-300 font-medium">No portfolio items yet</p>
          <p className="text-slate-500 text-sm mt-1">Add your first case study to publish real project work.</p>
        </div>
      )}

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Portfolio Item" size="lg">
        <div className="space-y-4">
          <input className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" placeholder="Project title" value={newItem.title} onChange={(e) => setNewItem((p) => ({ ...p, title: e.target.value }))} />
          <select className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={newItem.category} onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value }))}>
            <option>Business Website</option>
            <option>E-commerce</option>
            <option>Custom Dashboard</option>
            <option>Landing Page</option>
            <option>Portfolio Website</option>
          </select>
          <div className="relative">
            <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" placeholder="Image URL" value={newItem.image} onChange={(e) => setNewItem((p) => ({ ...p, image: e.target.value }))} />
          </div>
          <label className="flex items-center justify-center px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-slate-300 hover:text-white cursor-pointer">
            Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file, 'new')
              }}
            />
          </label>
          <input className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" placeholder="Project URL" value={newItem.projectUrl} onChange={(e) => setNewItem((p) => ({ ...p, projectUrl: e.target.value }))} />
          <div className="flex justify-end">
            <button onClick={handleAddItem} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-semibold">Save Item</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Portfolio Item" size="lg">
        {editingItem && (
          <div className="space-y-4">
            <input className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingItem.title} onChange={(e) => setEditingItem((p) => (p ? { ...p, title: e.target.value } : p))} />
            <input className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingItem.image} onChange={(e) => setEditingItem((p) => (p ? { ...p, image: e.target.value } : p))} />
            <label className="flex items-center justify-center px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-slate-300 hover:text-white cursor-pointer">
              Upload New Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file, 'edit')
                }}
              />
            </label>
            <input className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingItem.projectUrl} onChange={(e) => setEditingItem((p) => (p ? { ...p, projectUrl: e.target.value } : p))} />
            <div className="flex justify-end">
              <button onClick={handleSaveEdit} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-semibold">Save Changes</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Delete Portfolio Item"
        message={itemToDelete ? `Are you sure you want to delete ${itemToDelete.title}?` : ''}
        subjectLabel="Portfolio Item"
        subjectValue={itemToDelete?.title}
        confirmLabel="Delete"
        variant="danger"
        onCancel={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default AdminPortfolio
