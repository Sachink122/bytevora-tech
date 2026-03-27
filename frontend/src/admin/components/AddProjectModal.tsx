import { useState } from 'react'
import type { FormEvent } from 'react'
import Modal from './Modal'
import { Briefcase, User, Calendar, Type, CheckSquare, AlertTriangle, FileText } from 'lucide-react'

interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
  clientOptions?: string[]
  assigneeOptions?: string[]
  onAddProject: (project: {
    name: string
    client: string
    type: string
    deadline: string
    assigned: string
    status: 'In Progress' | 'Review' | 'Not Started' | 'On Hold' | 'Completed'
    priority: 'High' | 'Medium' | 'Low'
    description: string
  }) => void
}

const AddProjectModal = ({ isOpen, onClose, clientOptions = [], assigneeOptions = [], onAddProject }: AddProjectModalProps) => {
  const [projectName, setProjectName] = useState('')
  const [client, setClient] = useState('')
  const [projectType, setProjectType] = useState('')
  const [deadline, setDeadline] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'In Progress' | 'Review' | 'Not Started' | 'On Hold' | 'Completed'>('Not Started')
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Low')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!projectName || !client || !projectType || !deadline || !assignedTo) {
      return
    }
    onAddProject({
      name: projectName,
      client,
      type: projectType,
      deadline,
      assigned: assignedTo,
      status,
      priority,
      description,
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Project">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <select
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="">Select Client</option>
            {clientOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Project Type (e.g., Web Application)"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="date"
            placeholder="Deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="">Select Assignee</option>
            {assigneeOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <FileText className="absolute left-4 top-4 text-slate-400" size={20} />
          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="relative">
                <CheckSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select value={status} onChange={(e) => setStatus(e.target.value as 'In Progress' | 'Review' | 'Not Started' | 'On Hold' | 'Completed')} className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Review</option>
                    <option>On Hold</option>
                    <option>Completed</option>
                </select>
            </div>
            <div className="relative">
                <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select value={priority} onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')} className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
            </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            Add Project
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddProjectModal
