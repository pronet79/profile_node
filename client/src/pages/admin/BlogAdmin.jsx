import ResourceManager from '../../components/admin/ResourceManager.jsx';

export default function AdminBlog() {
  return (
    <ResourceManager
      title="Blog Post"
      basePath="/blog"
      listPath="/blog/admin/all"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'published', label: 'Published', render: (i) => (i.published ? 'Yes' : 'Draft') },
      ]}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
        { name: 'content', label: 'Content (Markdown)', type: 'markdown', required: true },
        { name: 'coverImage', label: 'Cover image', type: 'image' },
        { name: 'category', label: 'Category', type: 'select', options: ['Laravel', 'PHP', 'React', 'Node.js', 'AI', 'SaaS', 'Shopify', 'APIs', 'DevOps'] },
        { name: 'tags', label: 'Tags', type: 'list' },
        { name: 'seoTitle', label: 'SEO title', type: 'text' },
        { name: 'seoDescription', label: 'SEO description', type: 'textarea' },
        { name: 'readMinutes', label: 'Read minutes', type: 'number' },
        { name: 'published', label: 'Published', type: 'checkbox' },
      ]}
    />
  );
}
