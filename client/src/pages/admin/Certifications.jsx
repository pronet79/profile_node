import ResourceManager from '../../components/admin/ResourceManager.jsx';

export default function AdminCertifications() {
  return (
    <ResourceManager
      title="Certification"
      basePath="/certifications"
      listPath="/certifications/admin/all"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'issuer', label: 'Issuer' },
        { key: 'category', label: 'Type' },
        { key: 'published', label: 'Published', render: (i) => (i.published ? 'Yes' : 'No') },
      ]}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'issuer', label: 'Issuer (e.g. HackerRank, Codolio)', type: 'text' },
        { name: 'category', label: 'Type', type: 'select', options: ['certification', 'profile'], required: true },
        { name: 'url', label: 'Link URL', type: 'text', required: true },
        { name: 'image', label: 'Badge / logo (optional)', type: 'image' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'icon', label: 'Icon name (optional: award, code-2, sparkles)', type: 'text' },
        { name: 'order', label: 'Order', type: 'number' },
        { name: 'published', label: 'Published', type: 'checkbox' },
      ]}
    />
  );
}
