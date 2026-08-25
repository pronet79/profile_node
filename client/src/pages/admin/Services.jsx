import ResourceManager from '../../components/admin/ResourceManager.jsx';

export default function AdminServices() {
  return (
    <ResourceManager
      title="Service"
      basePath="/services"
      listPath="/services/admin/all"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'icon', label: 'Icon' },
        { key: 'published', label: 'Published', render: (i) => (i.published ? 'Yes' : 'No') },
      ]}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'icon', label: 'Icon (layout-grid, building-2, shopping-bag, sparkles, radio, plug)', type: 'text' },
        { name: 'tags', label: 'Tags', type: 'list' },
        { name: 'order', label: 'Order', type: 'number' },
        { name: 'published', label: 'Published', type: 'checkbox' },
      ]}
    />
  );
}
