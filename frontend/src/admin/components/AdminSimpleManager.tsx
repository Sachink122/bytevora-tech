import { useMemo, useState } from 'react'
import { Download, Plus } from 'lucide-react'
import DataTable from './DataTable'
import Modal from './Modal'
import ConfirmModal from './ConfirmModal'
import Toast, { type ToastType } from './Toast'
import { useLocalStorageState } from '../hooks/useLocalStorageState'

interface FieldConfig {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'number' | 'date' | 'url' | 'select' | 'file'
  required?: boolean
  placeholder?: string
  options?: string[]
  accept?: string
}

interface RecordItem {
  id: number
  createdAt: string
  status: string
  [key: string]: string | number
}

interface AdminSimpleManagerProps {
  title: string
  description: string
  storageKey: string
  fields: FieldConfig[]
  defaultStatus?: string
  statusOptions?: string[]
  addButtonLabel?: string
}

const formatDate = (value: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString()
}

const AdminSimpleManager = ({
  title,
  description,
  storageKey,
  fields,
  defaultStatus = 'Active',
  statusOptions = ['Active', 'Inactive'],
  addButtonLabel = 'Add Item',
}: AdminSimpleManagerProps) => {
  const [records, setRecords] = useLocalStorageState<RecordItem[]>(storageKey, [])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null)
  const [recordToDelete, setRecordToDelete] = useState<RecordItem | null>(null)
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)

  const emptyForm = useMemo(() => {
    const initial: Record<string, string> = {}
    for (const field of fields) {
      initial[field.key] = ''
    }
    return initial
  }, [fields])

  const [newForm, setNewForm] = useState<Record<string, string>>(emptyForm)
  const [editForm, setEditForm] = useState<Record<string, string>>(emptyForm)
  const [newStatus, setNewStatus] = useState(defaultStatus)

  const validate = (form: Record<string, string>) => {
    const requiredFields = fields.filter((field) => field.required)
    const missing = requiredFields.find((field) => !String(form[field.key] || '').trim())
    if (missing) {
      setToast({ type: 'warning', message: `Please fill ${missing.label}.` })
      return false
    }
    return true
  }

  const resetNewForm = () => {
    setNewForm(emptyForm)
    setNewStatus(defaultStatus)
  }

  const openEdit = (row: RecordItem) => {
    const next: Record<string, string> = {}
    for (const field of fields) {
      next[field.key] = String(row[field.key] || '')
    }
    setSelectedRecord(row)
    setEditForm(next)
    setIsEditOpen(true)
  }

  const openView = (row: RecordItem) => {
    setSelectedRecord(row)
  }

  const addRecord = () => {
    if (!validate(newForm)) return

    const nextId = records.length ? Math.max(...records.map((item) => item.id)) + 1 : 1
    const item: RecordItem = {
      id: nextId,
      createdAt: new Date().toISOString(),
      status: newStatus,
      ...newForm,
    }

    setRecords((prev) => [item, ...prev])
    setIsAddOpen(false)
    resetNewForm()
    setToast({ type: 'success', message: `${title} item added.` })
  }

  const saveEdit = () => {
    if (!selectedRecord) return
    if (!validate(editForm)) return

    setRecords((prev) =>
      prev.map((item) =>
        item.id === selectedRecord.id
          ? {
              ...item,
              ...editForm,
            }
          : item
      )
    )

    setIsEditOpen(false)
    setSelectedRecord(null)
    setToast({ type: 'success', message: `${title} item updated.` })
  }

  const deleteRecord = () => {
    if (!recordToDelete) return
    setRecords((prev) => prev.filter((item) => item.id !== recordToDelete.id))
    setRecordToDelete(null)
    setToast({ type: 'success', message: `${title} item deleted.` })
  }

  const exportCsv = () => {
    if (!records.length) {
      setToast({ type: 'warning', message: 'No records available to export.' })
      return
    }

    const headers = ['ID', ...fields.map((field) => field.label), 'Status', 'Created At']
    const rows = records.map((row) => [
      row.id,
      ...fields.map((field) => String(row[field.key] || '')),
      row.status,
      formatDate(row.createdAt),
    ])

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${storageKey}.csv`
    link.click()
    URL.revokeObjectURL(url)

    setToast({ type: 'info', message: 'CSV exported.' })
  }

  const columns = [
    ...fields.map((field) => ({
      key: field.key,
      label: field.label,
      render:
        field.type === 'textarea'
          ? (row: RecordItem) => (
              <span className="text-slate-300 block max-w-xs truncate" title={String(row[field.key] || '-')}>
                {String(row[field.key] || '-')}
              </span>
            )
          : field.type === 'file'
          ? (row: RecordItem) =>
              row[field.key] ? (
                <span className="text-emerald-300 text-sm">Image uploaded</span>
              ) : (
                <span className="text-slate-500 text-sm">No image</span>
              )
          : undefined,
    })),
    { key: 'status', label: 'Status' },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row: RecordItem) => formatDate(row.createdAt),
    },
  ]

  const renderField = (
    field: FieldConfig,
    value: string,
    setValue: (nextValue: string) => void
  ) => {
    if (field.type === 'textarea') {
      return (
        <textarea
          rows={4}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={field.placeholder}
          className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all resize-none"
        />
      )
    }

    if (field.type === 'select') {
      return (
        <select
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
        >
          <option value="">Select {field.label}</option>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
    }

    if (field.type === 'file') {
      return (
        <div className="space-y-3">
          <input
            type="file"
            accept={field.accept || 'image/*'}
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) return

              const reader = new FileReader()
              reader.onload = () => {
                const result = typeof reader.result === 'string' ? reader.result : ''
                setValue(result)
              }
              reader.readAsDataURL(file)
            }}
            className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-medium hover:file:bg-blue-500"
          />
          {value ? (
            <div className="space-y-2">
              <img
                src={value}
                alt={`${field.label} preview`}
                className="w-full max-h-52 object-cover rounded-xl border border-white/10"
              />
              <button
                type="button"
                onClick={() => setValue('')}
                className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
              >
                Remove Image
              </button>
            </div>
          ) : null}
        </div>
      )
    }

    return (
      <input
        type={field.type || 'text'}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={field.placeholder}
        className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-slate-400 mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCsv}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors"
          >
            <Download size={18} />
            <span className="text-sm">Export</span>
          </button>
          <button
            onClick={() => {
              resetNewForm()
              setIsAddOpen(true)
            }}
            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <Plus size={18} />
            <span>{addButtonLabel}</span>
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={records}
        onView={(row: RecordItem) => openView(row)}
        onEdit={(row: RecordItem) => openEdit(row)}
        onDelete={(row: RecordItem) => setRecordToDelete(row)}
      />

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title={`Add ${title} Item`}>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-slate-300 font-medium mb-2">{field.label}</label>
              {renderField(field, newForm[field.key] || '', (next) =>
                setNewForm((prev) => ({ ...prev, [field.key]: next }))
              )}
            </div>
          ))}
          <div>
            <label className="block text-slate-300 font-medium mb-2">Status</label>
            <select
              value={newStatus}
              onChange={(event) => setNewStatus(event.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsAddOpen(false)}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addRecord}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={`Edit ${title} Item`}>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-slate-300 font-medium mb-2">{field.label}</label>
              {renderField(field, editForm[field.key] || '', (next) =>
                setEditForm((prev) => ({ ...prev, [field.key]: next }))
              )}
            </div>
          ))}
          <div>
            <label className="block text-slate-300 font-medium mb-2">Status</label>
            <select
              value={selectedRecord?.status || defaultStatus}
              onChange={(event) =>
                setSelectedRecord((prev) => (prev ? { ...prev, status: event.target.value } : prev))
              }
              className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsEditOpen(false)}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!selectedRecord) return
                setRecords((prev) =>
                  prev.map((item) =>
                    item.id === selectedRecord.id
                      ? {
                          ...item,
                          ...editForm,
                          status: selectedRecord.status,
                        }
                      : item
                  )
                )
                setIsEditOpen(false)
                setSelectedRecord(null)
                setToast({ type: 'success', message: `${title} item updated.` })
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!selectedRecord && !isEditOpen} onClose={() => setSelectedRecord(null)} title={`${title} Item Details`}>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="grid grid-cols-3 gap-4">
              <div className="text-slate-400 text-sm">{field.label}</div>
              <div className="col-span-2 text-white break-words">
                {field.type === 'file' && selectedRecord?.[field.key] ? (
                  <img
                    src={String(selectedRecord[field.key])}
                    alt={`${field.label} preview`}
                    className="w-full max-h-64 object-cover rounded-xl border border-white/10"
                  />
                ) : (
                  String(selectedRecord?.[field.key] || '-')
                )}
              </div>
            </div>
          ))}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-slate-400 text-sm">Status</div>
            <div className="col-span-2 text-white">{selectedRecord?.status || '-'}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-slate-400 text-sm">Created</div>
            <div className="col-span-2 text-white">{formatDate(selectedRecord?.createdAt || '')}</div>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!recordToDelete}
        title="Delete Item"
        message="This record will be permanently removed from this section."
        subjectLabel={fields[0]?.label || 'Item'}
        subjectValue={String(recordToDelete?.[fields[0]?.key] || '')}
        confirmLabel="Delete"
        onConfirm={deleteRecord}
        onCancel={() => setRecordToDelete(null)}
        variant="danger"
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default AdminSimpleManager
