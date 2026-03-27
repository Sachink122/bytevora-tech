import { useState } from 'react'
import { Plus, Calendar, TrendingUp, MoreVertical, Edit, Trash2, ExternalLink } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import AddProjectModal from '../components/AddProjectModal'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import Toast, { type ToastType } from '../components/Toast'
import { useLocalStorageState } from '../hooks/useLocalStorageState'

interface Project {
  id: number
  name: string
  client: string
  type: string
  description?: string
  deadline: string
  assigned: string
  status: 'In Progress' | 'Review' | 'Not Started' | 'On Hold' | 'Completed'
  priority: 'High' | 'Medium' | 'Low'
  progress: number
}

interface ClientRecord {
  id: number
  name: string
}

interface TeamRecord {
  id: number
  name: string
  role?: string
}

const AdminProjects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [showProjectMenu, setShowProjectMenu] = useState<number | null>(null)
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)

  const [projects, setProjects] = useLocalStorageState<Project[]>('admin-projects', [])
  const [clients] = useLocalStorageState<ClientRecord[]>('admin-clients', [])
  const [teamMembers] = useLocalStorageState<TeamRecord[]>('admin-team', [])

  const clientOptions = clients.map((item) => item.name).filter(Boolean)
  const assigneeOptions = teamMembers.length
    ? teamMembers.map((member) => member.name).filter(Boolean)
    : ['Owner']

  const handleAddProject = (newProject: Omit<Project, 'id' | 'progress'>) => {
    setProjects((prev) => [...prev, { ...newProject, id: prev.length ? Math.max(...prev.map((x) => x.id)) + 1 : 1, progress: 0 }])
    setToast({ type: 'success', message: 'Project added successfully.' })
  }

  const filteredProjects = projects.filter((project) => {
    const statusMatch = !statusFilter || project.status === statusFilter
    const priorityMatch = !priorityFilter || project.priority === priorityFilter
    return statusMatch && priorityMatch
  })

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsEditOpen(true)
    setShowProjectMenu(null)
  }

  const handleSaveProject = () => {
    if (!editingProject) return
    setProjects((prev) => prev.map((project) => (project.id === editingProject.id ? editingProject : project)))
    setIsEditOpen(false)
    setEditingProject(null)
    setToast({ type: 'success', message: 'Project updated successfully.' })
  }

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project)
  }

  const confirmDeleteProject = () => {
    if (!projectToDelete) return
    const project = projectToDelete
    setProjects((prev) => prev.filter((item) => item.id !== project.id))
    if (selectedProject?.id === project.id) setSelectedProject(null)
    setShowProjectMenu(null)
    setToast({ type: 'success', message: 'Project deleted.' })
    setProjectToDelete(null)
  }

  const columns = [
    { key: 'name', label: 'Project Name' },
    { key: 'client', label: 'Client' },
    { key: 'type', label: 'Type' },
    {
      key: 'deadline',
      label: 'Deadline',
      render: (row: Project) => (
        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-slate-400" />
          <span className="text-slate-300">{row.deadline}</span>
        </div>
      ),
    },
    {
      key: 'assigned',
      label: 'Assigned To',
      render: (row: Project) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {row.assigned.charAt(0)}
          </div>
          <span className="text-slate-300">{row.assigned}</span>
        </div>
      ),
    },
    {
      key: 'progress',
      label: 'Progress',
      render: (row: Project) => (
        <div className="w-32">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Progress</span>
            <span className="text-white font-medium">{row.progress}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                row.progress >= 75 ? 'bg-green-500' : row.progress >= 50 ? 'bg-blue-500' : row.progress >= 25 ? 'bg-yellow-500' : 'bg-slate-500'
              }`}
              style={{ width: `${row.progress}%` }}
            />
          </div>
        </div>
      ),
    },
    { key: 'status', label: 'Status', render: (row: Project) => <StatusBadge status={row.status} /> },
    { key: 'priority', label: 'Priority', render: (row: Project) => <StatusBadge status={row.priority} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Project Management</h1>
          <p className="text-slate-400 mt-1">Track and manage all your projects</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          <Plus size={18} />
          <span>Add Project</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white text-sm focus:outline-none">
          <option value="">All Status</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="On Hold">On Hold</option>
          <option value="Completed">Completed</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white text-sm focus:outline-none">
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Projects', value: String(projects.length), color: 'blue' },
          { label: 'In Progress', value: String(projects.filter((p) => p.status === 'In Progress').length), color: 'green' },
          { label: 'Completed', value: String(projects.filter((p) => p.status === 'Completed').length), color: 'purple' },
          { label: 'On Hold', value: String(projects.filter((p) => p.status === 'On Hold').length), color: 'orange' },
        ].map((stat, index) => (
          <div
            key={index}
            className={`p-6 bg-gradient-to-br ${
              stat.color === 'blue'
                ? 'from-blue-500/20 to-blue-600/20 border-blue-500/30'
                : stat.color === 'green'
                ? 'from-green-500/20 to-green-600/20 border-green-500/30'
                : stat.color === 'purple'
                ? 'from-purple-500/20 to-purple-600/20 border-purple-500/30'
                : 'from-orange-500/20 to-orange-600/20 border-orange-500/30'
            } rounded-2xl border backdrop-blur-sm`}
          >
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
            <div className="flex items-center text-sm mt-2 text-slate-400">
              <TrendingUp size={14} className="mr-1" />
              Live data
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="p-4 whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
                <th className="p-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-800/40 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 whitespace-nowrap">
                      {col.render ? col.render(project) : <span className="text-white">{(project as unknown as Record<string, string | number>)[col.key]}</span>}
                    </td>
                  ))}
                  <td className="p-4 whitespace-nowrap text-right">
                    <div className="relative inline-block">
                      <button onClick={() => setShowProjectMenu(showProjectMenu === project.id ? null : project.id)} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700">
                        <MoreVertical size={20} />
                      </button>
                      {showProjectMenu === project.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-lg shadow-lg z-10">
                          <button onClick={() => { setSelectedProject(project); setShowProjectMenu(null) }} className="w-full flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"><ExternalLink size={16} className="mr-2" /> View Project</button>
                          <button onClick={() => handleEditProject(project)} className="w-full flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"><Edit size={16} className="mr-2" /> Edit</button>
                          <button onClick={() => handleDeleteProject(project)} className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-700"><Trash2 size={16} className="mr-2" /> Delete</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProject={handleAddProject}
        clientOptions={clientOptions}
        assigneeOptions={assigneeOptions}
      />

      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title="Project Details" size="lg">
        {selectedProject && (
          <div className="space-y-3">
            <div className="text-slate-300"><span className="text-slate-400">Name:</span> {selectedProject.name}</div>
            <div className="text-slate-300"><span className="text-slate-400">Client:</span> {selectedProject.client}</div>
            <div className="text-slate-300"><span className="text-slate-400">Type:</span> {selectedProject.type}</div>
            <div className="text-slate-300"><span className="text-slate-400">Description:</span> {selectedProject.description || '-'}</div>
            <div className="text-slate-300"><span className="text-slate-400">Deadline:</span> {selectedProject.deadline}</div>
            <div className="text-slate-300"><span className="text-slate-400">Assigned:</span> {selectedProject.assigned}</div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Project" size="lg">
        {editingProject && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingProject.name} onChange={(e) => setEditingProject((p) => (p ? { ...p, name: e.target.value } : p))} />
              <select className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingProject.client} onChange={(e) => setEditingProject((p) => (p ? { ...p, client: e.target.value } : p))}>
                <option value="">Select Client</option>
                {clientOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingProject.type} onChange={(e) => setEditingProject((p) => (p ? { ...p, type: e.target.value } : p))} />
              <input className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingProject.deadline} onChange={(e) => setEditingProject((p) => (p ? { ...p, deadline: e.target.value } : p))} />
              <select className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingProject.assigned} onChange={(e) => setEditingProject((p) => (p ? { ...p, assigned: e.target.value } : p))}>
                <option value="">Select Assignee</option>
                {assigneeOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <select className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingProject.status} onChange={(e) => setEditingProject((p) => (p ? { ...p, status: e.target.value as Project['status'] } : p))}>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
              <select className="px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white" value={editingProject.priority} onChange={(e) => setEditingProject((p) => (p ? { ...p, priority: e.target.value as Project['priority'] } : p))}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <textarea className="md:col-span-2 px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white resize-none" rows={3} placeholder="Project Description" value={editingProject.description || ''} onChange={(e) => setEditingProject((p) => (p ? { ...p, description: e.target.value } : p))} />
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={handleSaveProject} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-semibold">Save Changes</button>
            </div>
          </>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!projectToDelete}
        title="Delete Project"
        message={projectToDelete ? `Are you sure you want to delete ${projectToDelete.name}?` : ''}
        subjectLabel="Project"
        subjectValue={projectToDelete?.name}
        confirmLabel="Delete"
        variant="danger"
        onCancel={() => setProjectToDelete(null)}
        onConfirm={confirmDeleteProject}
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default AdminProjects
