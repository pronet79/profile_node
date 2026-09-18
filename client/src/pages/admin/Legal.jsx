import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { api } from '../../services/api.js';
import { useApi } from '../../hooks/useApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import Loader from '../../components/Loader.jsx';
import Markdown from '../../components/Markdown.jsx';

const PAGES = [
  { slug: 'privacy', label: 'Privacy Policy' },
  { slug: 'terms', label: 'Terms of Use' },
  { slug: 'payment-policy', label: 'Payment & Refund Policy' },
];

export default function AdminLegal() {
  const { data, loading, refetch } = useApi('/legal/admin/all');
  const toast = useToast();
  const [active, setActive] = useState('privacy');
  const [form, setForm] = useState({ title: '', content: '' });
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load the selected page's current values into the form.
  useEffect(() => {
    if (!data) return;
    const existing = data.find((p) => p.slug === active);
    const fallbackTitle = PAGES.find((p) => p.slug === active)?.label || '';
    setForm({ title: existing?.title || fallbackTitle, content: existing?.content || '' });
    setPreview(false);
  }, [active, data]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/legal/${active}`, form);
      toast.success('Page saved');
      refetch();
    } catch (e) {
      toast.error(e.errors?.[0] || e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">Legal Pages</h1>
      <p className="mt-1 text-sm text-slate-400">Edit Privacy, Terms and Payment/Refund policy. Content is Markdown.</p>

      {/* Page tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {PAGES.map((p) => (
          <button
            key={p.slug}
            onClick={() => setActive(p.slug)}
            className={`rounded-lg px-4 py-2 text-sm ${active === p.slug ? 'bg-accent text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="card mt-6 space-y-4 p-6">
        <div>
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="label mb-0">Content (Markdown)</label>
            <button type="button" onClick={() => setPreview((v) => !v)} className="btn-ghost h-8 !px-2 text-xs">
              <Eye className="h-3.5 w-3.5" /> {preview ? 'Edit' : 'Preview'}
            </button>
          </div>
          {preview ? (
            <div className="min-h-[240px] rounded-xl border border-white/10 bg-ink-900 p-4">
              <Markdown>{form.content || '_Nothing to preview_'}</Markdown>
            </div>
          ) : (
            <textarea
              rows={16}
              className="input font-mono text-sm"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write the policy in Markdown…"
            />
          )}
        </div>

        <div className="flex justify-end">
          <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save Page'}</button>
        </div>
      </div>
    </div>
  );
}
