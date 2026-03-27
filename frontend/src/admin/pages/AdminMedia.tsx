import AdminSimpleManager from '../components/AdminSimpleManager'

const AdminMedia = () => {
  return (
    <AdminSimpleManager
      title="Media Library"
      description="Organize image and asset references used across the site."
      storageKey="admin-media"
      defaultStatus="Active"
      statusOptions={['Active', 'Archived']}
      addButtonLabel="Add Media"
      fields={[
        { key: 'fileName', label: 'File Name', required: true, placeholder: 'hero-banner.jpg' },
        { key: 'fileType', label: 'Type', type: 'select', options: ['Image', 'Video', 'Document', 'Other'] },
        { key: 'fileUrl', label: 'File URL', type: 'url', placeholder: 'https://...' },
        { key: 'altText', label: 'Alt Text', placeholder: 'Describe the media for accessibility' },
        { key: 'tags', label: 'Tags', placeholder: 'home, hero, campaign' },
      ]}
    />
  )
}

export default AdminMedia
