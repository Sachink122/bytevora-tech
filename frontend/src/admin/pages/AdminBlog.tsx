import AdminSimpleManager from '../components/AdminSimpleManager'

const AdminBlog = () => {
  return (
    <AdminSimpleManager
      title="Blog"
      description="Draft and track blog content workflow."
      storageKey="admin-blog"
      defaultStatus="Draft"
      statusOptions={['Draft', 'Scheduled', 'Published', 'Archived']}
      addButtonLabel="New Post"
      fields={[
        { key: 'title', label: 'Post Title', required: true, placeholder: 'How to improve local SEO' },
        { key: 'slug', label: 'Slug', required: true, placeholder: 'improve-local-seo' },
        { key: 'author', label: 'Author', placeholder: 'Team Member' },
        { key: 'publishDate', label: 'Publish Date', type: 'date' },
        { key: 'summary', label: 'Summary', type: 'textarea', placeholder: 'Short preview of the article.' },
      ]}
    />
  )
}

export default AdminBlog
