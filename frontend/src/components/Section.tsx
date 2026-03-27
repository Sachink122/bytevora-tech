import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
  variant?: 'default' | 'gradient' | 'light'
}

const Section = ({ children, className = '', id, variant = 'default' }: SectionProps) => {
  const variantStyles = {
    default: 'bg-slate-950',
    gradient: 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950',
    light: 'bg-slate-900/50',
  }

  return (
    <section id={id} className={`py-20 lg:py-24 ${variantStyles[variant]} ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {children}
      </motion.div>
    </section>
  )
}

export default Section