import AdminSimpleManager from '../components/AdminSimpleManager'

const AdminSupport = () => {
  return (
    <AdminSimpleManager
      title="Support"
      description="Manage support tickets and customer issues."
      storageKey="admin-support"
      defaultStatus="Open"
      statusOptions={['Open', 'In Progress', 'Waiting', 'Resolved', 'Closed']}
      addButtonLabel="Create Ticket"
      fields={[
        { key: 'ticketId', label: 'Ticket ID', required: true, placeholder: 'SUP-001' },
        { key: 'customer', label: 'Customer', required: true, placeholder: 'Customer name' },
        { key: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Urgent'] },
        { key: 'issueType', label: 'Issue Type', placeholder: 'Bug / Access / Billing' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Issue details and troubleshooting notes.' },
      ]}
    />
  )
}

export default AdminSupport
