interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md' | 'lg'
}

const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    'New': { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500' },
    'Contacted': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-500' },
    'Interested': { bg: 'bg-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-500' },
    'Proposal Sent': { bg: 'bg-cyan-500/20', text: 'text-cyan-400', dot: 'bg-cyan-500' },
    'Won': { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-500' },
    'Lost': { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-500' },
    'In Progress': { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500' },
    'Completed': { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-500' },
    'On Hold': { bg: 'bg-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-500' },
    'Pending': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-500' },
    'Paid': { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-500' },
    'Overdue': { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-500' },
    'Partial Paid': { bg: 'bg-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-500' },
    'Unread': { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500' },
    'Read': { bg: 'bg-slate-500/20', text: 'text-slate-400', dot: 'bg-slate-500' },
    'Replied': { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-500' },
    'Resolved': { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-500' },
    'Draft': { bg: 'bg-slate-500/20', text: 'text-slate-400', dot: 'bg-slate-500' },
    'Sent': { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500' },
    'Approved': { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-500' },
    'Rejected': { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-500' },
    'Active': { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-500' },
    'Inactive': { bg: 'bg-slate-500/20', text: 'text-slate-400', dot: 'bg-slate-500' },
    'High': { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-500' },
    'Medium': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-500' },
    'Low': { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-500' },
  }

  const config = statusConfig[status] || {
    bg: 'bg-slate-500/20',
    text: 'text-slate-400',
    dot: 'bg-slate-500'
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <span className={`inline-flex items-center space-x-2 ${config.bg} ${config.text} ${sizeClasses[size]} rounded-full font-medium`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  )
}

export default StatusBadge