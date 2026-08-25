import ResourceManager from '../../components/admin/ResourceManager.jsx';

export default function AdminSkills() {
  return (
    <ResourceManager
      title="Skill"
      basePath="/skills"
      listPath="/skills/admin/all"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
      ]}
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'select', options: ['Backend', 'Frontend', 'Database', 'APIs & Integrations', 'DevOps / Cloud', 'AI'], required: true },
        { name: 'order', label: 'Order', type: 'number' },
      ]}
    />
  );
}
