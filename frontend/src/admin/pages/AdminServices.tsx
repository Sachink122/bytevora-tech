import { useEffect } from 'react'
import AdminSimpleManager from '../components/AdminSimpleManager'
import { useLocalStorageState } from '../hooks/useLocalStorageState'

interface ServiceRecord {
  id: number
  name?: string
  category?: string
  deliveryTime?: string
  basePrice?: string
  description?: string
  status?: string
  createdAt?: string
}

const AdminServices = () => {
  const [services, setServices] = useLocalStorageState<ServiceRecord[]>('admin-services', [])

  useEffect(() => {
    const defaultServices: Array<Omit<ServiceRecord, 'id'>> = [
      {
        name: 'Business Website Development',
        category: 'Web Development',
        deliveryTime: '7-14 days',
        basePrice: '₹25,000',
        description: 'Professional, conversion-focused websites that establish your brand and drive results.',
        status: 'Active',
      },
      {
        name: 'Landing Page Design',
        category: 'Web Design',
        deliveryTime: '3-7 days',
        basePrice: '₹12,000',
        description: 'High-impact landing pages optimized for conversions and lead generation.',
        status: 'Active',
      },
      {
        name: 'Portfolio Website Design',
        category: 'Web Design',
        deliveryTime: '5-10 days',
        basePrice: '₹18,000',
        description: 'Custom portfolio websites for creatives to showcase work beautifully.',
        status: 'Active',
      },
      {
        name: 'E-commerce Solutions',
        category: 'E-commerce',
        deliveryTime: '14-30 days',
        basePrice: '₹45,000',
        description: 'Complete online stores with payments, inventory, and order workflows.',
        status: 'Active',
      },
      {
        name: 'Custom Dashboard / CRM',
        category: 'Business Systems',
        deliveryTime: '21-45 days',
        basePrice: '₹60,000',
        description: 'Custom dashboards and CRM systems to manage operations and customer data.',
        status: 'Active',
      },
      {
        name: 'Website Maintenance & Support',
        category: 'Maintenance',
        deliveryTime: 'Ongoing',
        basePrice: '₹8,000/month',
        description: 'Ongoing maintenance, monitoring, updates, and technical support.',
        status: 'Active',
      },
      {
        name: 'Google Business Profile Setup',
        category: 'Local SEO',
        deliveryTime: '2-5 days',
        basePrice: '₹6,000',
        description: 'Setup and optimize Google Business Profile to improve local discoverability.',
        status: 'Active',
      },
      {
        name: 'Branding & UI/UX Design',
        category: 'Design',
        deliveryTime: '7-21 days',
        basePrice: '₹20,000',
        description: 'Brand identity, UI systems, and UX design for stronger digital experiences.',
        status: 'Active',
      },
    ]

    const normalize = (value?: string) => (value || '').trim().toLowerCase()

    const existingNames = new Set(services.map((item) => normalize(item.name)))
    const missing = defaultServices.filter((item) => !existingNames.has(normalize(item.name)))

    if (!missing.length) return

    setServices((prev) => {
      const currentMaxId = prev.length ? Math.max(...prev.map((item) => item.id)) : 0
      const nextItems = missing.map((item, index) => ({
        id: currentMaxId + index + 1,
        createdAt: new Date().toISOString(),
        ...item,
      }))
      return [...prev, ...nextItems]
    })
  }, [services, setServices])

  return (
    <AdminSimpleManager
      title="Services"
      description="Manage your service offerings and delivery details."
      storageKey="admin-services"
      defaultStatus="Active"
      statusOptions={['Active', 'Paused', 'Archived']}
      addButtonLabel="Add Service"
      fields={[
        { key: 'name', label: 'Service Name', required: true, placeholder: 'Business Website Development' },
        { key: 'category', label: 'Category', required: true, placeholder: 'Web Development' },
        { key: 'deliveryTime', label: 'Delivery Time', placeholder: '7-14 days' },
        { key: 'basePrice', label: 'Base Price', type: 'text', placeholder: '₹25,000' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the outcome and scope.' },
      ]}
    />
  )
}

export default AdminServices
