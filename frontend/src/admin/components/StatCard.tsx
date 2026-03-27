import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative'
  icon: LucideIcon
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}

const StatCard = ({ title, value, change, changeType, icon: Icon, color = 'blue' }: StatCardProps) => {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
    red: 'from-red-500/20 to-red-600/20 border-red-500/30',
  }

  const iconColorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`p-6 bg-gradient-to-br ${colorClasses[color]} rounded-2xl border backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {change && (
            <div className={`flex items-center text-sm ${
              changeType === 'positive' ? 'text-green-400' : 'text-red-400'
            }`}>
              {changeType === 'positive' ? '↑' : '↓'} {change}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center ${iconColorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard