import AdminSimpleManager from '../components/AdminSimpleManager'

const AdminPricing = () => {
  return (
    <AdminSimpleManager
      title="Pricing"
      description="Create and maintain pricing plans and packages."
      storageKey="admin-pricing"
      defaultStatus="Draft"
      statusOptions={['Draft', 'Published', 'Archived']}
      addButtonLabel="Add Plan"
      fields={[
        { key: 'planName', label: 'Plan Name', required: true, placeholder: 'Starter' },
        { key: 'price', label: 'Price', required: true, placeholder: '₹19,999' },
        { key: 'billingCycle', label: 'Billing Cycle', type: 'select', options: ['One-time', 'Monthly', 'Quarterly', 'Yearly'] },
        { key: 'targetUser', label: 'Target Audience', placeholder: 'Small businesses' },
        { key: 'features', label: 'Key Features', type: 'textarea', placeholder: 'List plan highlights and limits.' },
      ]}
    />
  )
}

export default AdminPricing
