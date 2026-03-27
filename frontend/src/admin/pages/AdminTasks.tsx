import AdminSimpleManager from '../components/AdminSimpleManager'

const AdminTasks = () => {
  return (
    <AdminSimpleManager
      title="Tasks"
      description="Plan and monitor execution tasks for your team."
      storageKey="admin-tasks"
      defaultStatus="To Do"
      statusOptions={['To Do', 'In Progress', 'Review', 'Done']}
      addButtonLabel="Add Task"
      fields={[
        { key: 'taskTitle', label: 'Task Title', required: true, placeholder: 'Design landing page hero' },
        { key: 'assignee', label: 'Assignee', placeholder: 'Team member name' },
        { key: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'] },
        { key: 'dueDate', label: 'Due Date', type: 'date' },
        { key: 'details', label: 'Details', type: 'textarea', placeholder: 'Task requirements and dependencies.' },
      ]}
    />
  )
}

export default AdminTasks
