import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'whatsapp'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: (e: React.MouseEvent) => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  fullWidth?: boolean
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300'
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  }

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105',
    secondary:
      'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30',
    outline:
      'bg-transparent text-white border-2 border-blue-500 hover:bg-blue-500/10',
    whatsapp:
      'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/30 hover:scale-105',
  }

  const widthClass = fullWidth ? 'w-full' : ''

  const buttonContent = (
    <>
      {children}
      {variant === 'whatsapp' && <MessageCircle size={18} className="ml-2" />}
      {variant === 'primary' && <ArrowRight size={18} className="ml-2" />}
    </>
  )

  if (href) {
    return (
      <Link
        to={href}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthClass} ${className}`}
        onClick={onClick}
      >
        {buttonContent}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthClass} ${className}`}
    >
      {buttonContent}
    </button>
  )
}

export default Button