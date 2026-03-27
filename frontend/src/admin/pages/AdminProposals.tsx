import AdminSimpleManager from '../components/AdminSimpleManager'

const AdminProposals = () => {
  return (
    <AdminSimpleManager
      title="Proposals"
      description="Manage proposal pipeline from draft to approval."
      storageKey="admin-proposals"
      defaultStatus="Draft"
      statusOptions={['Draft', 'Sent', 'Negotiating', 'Accepted', 'Rejected']}
      addButtonLabel="Create Proposal"
      fields={[
        { key: 'proposalName', label: 'Proposal Name', required: true, placeholder: 'Website Revamp Proposal' },
        { key: 'client', label: 'Client', required: true, placeholder: 'ABC Pvt Ltd' },
        { key: 'amount', label: 'Amount', required: true, placeholder: '₹85,000' },
        { key: 'validUntil', label: 'Valid Until', type: 'date' },
        { key: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Scope, terms, and assumptions.' },
      ]}
    />
  )
}

export default AdminProposals
