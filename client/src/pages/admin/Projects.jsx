import ResourceManager from '../../components/admin/ResourceManager.jsx';

export default function AdminProjects() {
  return (
    <ResourceManager
      title="Project"
      basePath="/projects"
      listPath="/projects/admin/all"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'featured', label: 'Featured', render: (i) => (i.featured ? '★ Yes' : 'No') },
        { key: 'published', label: 'Published', render: (i) => (i.published ? 'Yes' : 'No') },
      ]}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'text' },
        { name: 'shortDescription', label: 'Short description', type: 'textarea' },
        { name: 'overview', label: 'Overview', type: 'textarea' },
        { name: 'problem', label: 'Problem', type: 'textarea' },
        { name: 'solution', label: 'Solution', type: 'textarea' },
        { name: 'keyFeatures', label: 'Key features', type: 'list' },
        { name: 'technologies', label: 'Technologies', type: 'list' },
        { name: 'role', label: 'My role', type: 'textarea' },
        { name: 'architecture', label: 'Architecture', type: 'textarea' },
        { name: 'deployment', label: 'Deployment', type: 'text' },
        { name: 'results', label: 'Results', type: 'text' },
        { name: 'coverImage', label: 'Cover image', type: 'image' },
        { name: 'videoUrl', label: 'YouTube video URL', type: 'text' },
        { name: 'githubUrl', label: 'GitHub URL', type: 'text' },
        { name: 'liveUrl', label: 'Live URL', type: 'text' },
        { name: 'order', label: 'Order', type: 'number' },
        { name: 'featured', label: 'Featured', type: 'checkbox' },
        { name: 'published', label: 'Published', type: 'checkbox' },
      ]}
    />
  );
}
