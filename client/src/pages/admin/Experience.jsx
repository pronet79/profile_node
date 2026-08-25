import ResourceManager from '../../components/admin/ResourceManager.jsx';
import { monthYear } from '../../utils/format.js';

export default function AdminExperience() {
  return (
    <ResourceManager
      title="Experience"
      basePath="/experience"
      listPath="/experience/admin/all"
      columns={[
        { key: 'position', label: 'Position' },
        { key: 'company', label: 'Company' },
        { key: 'period', label: 'Period', render: (i) => `${monthYear(i.startDate)} — ${i.current ? 'Present' : monthYear(i.endDate)}` },
      ]}
      fields={[
        { name: 'company', label: 'Company', type: 'text', required: true },
        { name: 'position', label: 'Position', type: 'text', required: true },
        { name: 'location', label: 'Location', type: 'text' },
        { name: 'type', label: 'Type', type: 'select', options: ['full-time', 'freelance', 'contract', 'part-time'] },
        { name: 'startDate', label: 'Start date (YYYY-MM-DD)', type: 'text', required: true },
        { name: 'endDate', label: 'End date (YYYY-MM-DD)', type: 'text' },
        { name: 'current', label: 'Current position', type: 'checkbox' },
        { name: 'achievements', label: 'Achievements', type: 'list' },
        { name: 'responsibilities', label: 'Responsibilities', type: 'list' },
        { name: 'technologies', label: 'Technologies', type: 'list' },
        { name: 'order', label: 'Order', type: 'number' },
      ]}
    />
  );
}
