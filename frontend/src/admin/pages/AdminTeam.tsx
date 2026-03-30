import AdminSimpleManager from '../components/AdminSimpleManager'

const AdminTeam = () => {
  return (
    <AdminSimpleManager
      title="Team"
      description="Maintain your internal team directory."
      storageKey="admin-team"
      defaultStatus="Active"
      statusOptions={['Active', 'On Leave', 'Inactive']}
      addButtonLabel="Add Team Member"
      fields={[
        { key: 'name', label: 'Full Name', required: true, placeholder: 'Team member name' },
        { key: 'role', label: 'Role', required: true, placeholder: 'UI/UX Designer' },
        { key: 'email', label: 'Email', placeholder: 'member@bytevora.tech' },
        { key: 'phone', label: 'Phone', placeholder: 'Contact number' },
        { key: 'skills', label: 'Skills', placeholder: 'React, Figma, SEO' },
      ]}
    />
  )
}

export default AdminTeam
