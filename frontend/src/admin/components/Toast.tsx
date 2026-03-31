import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'danger'

interface ToastProps {
  type: ToastType
  message: string
  duration?: number
  onClose?: () => void
}

const Toast = ({ type, message, duration = 3000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)
    
    return () => clearTimeout(timer)
  }, [duration, onClose])
  
  if (!isVisible) return null
  
  const icons = {
    success: <CheckCircle className="text-green-500" size={24} />,
    error: <AlertCircle className="text-red-500" size={24} />,
    info: <Info className="text-blue-500" size={24} />,
    warning: <AlertTriangle className="text-yellow-500" size={24} />,
    danger: <AlertCircle className="text-red-500" size={24} />,
  }
  
  const bgColors = {
    success: 'bg-green-500/10 border-green-500/30',
    error: 'bg-red-500/10 border-red-500/30',
    info: 'bg-blue-500/10 border-blue-500/30',
    warning: 'bg-yellow-500/10 border-yellow-500/30',
    danger: 'bg-red-500/10 border-red-500/30',
  }
  
  const textColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-blue-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400',
  }
  
  return (
    <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl border shadow-2xl flex items-start space-x-3 ${bgColors[type]} transition-all duration-300`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-1">
        <p className={`font-medium ${textColors[type]}`}>{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false)
          onClose?.()
        }}
        className="flex-shrink-0 text-slate-400 hover:text-white transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  )
}

export default Toast