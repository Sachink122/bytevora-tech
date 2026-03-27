import { useState } from 'react'
import { ChevronDown, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react'

interface Column {
  key: string
  label: string
  render?: (row: any) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  onView?: (row: any) => void
}

const DataTable = ({ columns, data, onEdit, onDelete, onView }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors">
              <Filter size={18} />
              <span className="text-sm">Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className="px-6 py-4 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors select-none"
                >
                  <div className="flex items-center space-x-2">
                    {column.label}
                    <ChevronDown size={14} className="text-slate-400" />
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right">
                <MoreVertical size={18} className="text-slate-400" />
              </th>
            </tr>
          </thead>
          <tbody>
              {sortedData.map((row, index) => (
              <tr
                key={index}
                className="border-t border-white/10 hover:bg-slate-800/30 transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                <td className="px-6 py-4">
                  <div className="relative flex justify-end">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === index ? null : index)}
                      className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openMenuId === index && (
                      <div className="absolute right-0 top-10 z-20 min-w-36 bg-slate-800 border border-white/10 rounded-lg shadow-xl overflow-hidden">
                        {onView && (
                          <button
                            onClick={() => {
                              onView(row)
                              setOpenMenuId(null)
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center space-x-2"
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => {
                              onEdit(row)
                              setOpenMenuId(null)
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center space-x-2"
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => {
                              onDelete(row)
                              setOpenMenuId(null)
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-slate-700 flex items-center space-x-2"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {sortedData.length === 0 && (
        <div className="p-12 text-center">
          <div className="text-slate-400 text-lg">No records yet</div>
        </div>
      )}
    </div>
  )
}

export default DataTable