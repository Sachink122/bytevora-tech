import AdminSimpleManager from '../components/AdminSimpleManager'

const AdminInvoices = () => {
  return (
    <AdminSimpleManager
      title="Invoices"
      description="Track billing records and payment status."
      storageKey="admin-invoices"
      defaultStatus="Unpaid"
      statusOptions={['Unpaid', 'Partially Paid', 'Paid', 'Overdue']}
      addButtonLabel="Create Invoice"
      fields={[
        { key: 'invoiceNumber', label: 'Invoice #', required: true, placeholder: 'INV-2026-001' },
        { key: 'client', label: 'Client', required: true, placeholder: 'Client Name' },
        { key: 'amount', label: 'Amount', required: true, placeholder: '₹45,000' },
        { key: 'dueDate', label: 'Due Date', type: 'date' },
        { key: 'remarks', label: 'Remarks', type: 'textarea', placeholder: 'Payment terms and details.' },
      ]}
    />
  )
}

export default AdminInvoices
