import AdminSimpleManager from '../components/AdminSimpleManager'

const AdminMessages = () => {
  return (
    <AdminSimpleManager
      title="Join Us Applications"
      description="Review and track people who want to work with you."
      storageKey="admin-messages"
      defaultStatus="New"
      statusOptions={['New', 'In Review', 'Replied', 'Closed']}
      addButtonLabel="Add Application"
      fields={[
        { key: 'senderName', label: 'Name', required: true, placeholder: 'Applicant Name' },
        { key: 'email', label: 'Email', type: 'text', placeholder: 'applicant@example.com' },
        { key: 'phone', label: 'Contact Number', type: 'text', placeholder: 'Applicant phone number' },
        { key: 'role', label: 'Role / Interest', placeholder: 'e.g. UI/UX Design' },
        { key: 'skills', label: 'Key Skills / Tools', type: 'textarea', placeholder: 'Tools, stacks, strengths...' },
        { key: 'portfolioUrl', label: 'Portfolio / Links', placeholder: 'Portfolio, LinkedIn, GitHub, etc.' },
        { key: 'aboutYou', label: 'How they like to work', type: 'textarea', placeholder: 'Notes about their working style' },
      ]}
    />
  )
}

export default AdminMessages
