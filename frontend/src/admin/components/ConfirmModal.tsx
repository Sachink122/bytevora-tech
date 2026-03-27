import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  subjectLabel?: string
  subjectValue?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'default'
}

const ConfirmModal = ({
  isOpen,
  title,
  message,
  subjectLabel,
  subjectValue,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmModalProps) => {
  const confirmClass =
    variant === 'danger'
      ? 'bg-gradient-to-r from-red-600 to-rose-500 hover:shadow-red-500/30'
      : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-blue-500/30'

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 p-2 rounded-lg ${variant === 'danger' ? 'bg-red-500/15 text-red-300' : 'bg-blue-500/15 text-blue-300'}`}>
            <AlertTriangle size={18} />
          </div>
          <div className="space-y-3 flex-1">
            <p className="text-slate-300">{message}</p>
            {subjectValue && (
              <div className={`rounded-xl border px-3 py-2 text-sm ${variant === 'danger' ? 'bg-red-500/10 border-red-500/30 text-red-200' : 'bg-slate-800 border-white/10 text-slate-200'}`}>
                <span className="text-slate-400">{subjectLabel || 'Item'}:</span> {subjectValue}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-medium transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 text-white rounded-xl font-semibold transition-all hover:shadow-lg ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal
