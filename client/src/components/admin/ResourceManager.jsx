import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Eye } from 'lucide-react';
import { api } from '../../services/api.js';
import { useApi } from '../../hooks/useApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import Loader from '../Loader.jsx';
import Markdown from '../Markdown.jsx';
import ImageUpload from './ImageUpload.jsx';

/* Field: markdown textarea with a live preview toggle. */
function MarkdownField({ value, onChange }) {
  const [preview, setPreview] = useState(false);
  return (
    <div>
      <div className="mb-2 flex justify-end">
        <button type="button" onClick={() => setPreview((p) => !p)} className="btn-ghost h-8 !px-2 text-xs">
          <Eye className="h-3.5 w-3.5" /> {preview ? 'Edit' : 'Preview'}
        </button>
      </div>
      {preview ? (
        <div className="min-h-[160px] rounded-xl border border-white/10 bg-ink-900 p-4"><Markdown>{value || '_Nothing to preview_'}</Markdown></div>
      ) : (
        <textarea rows={10} className="input font-mono text-sm" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="Write in Markdown…" />
      )}
    </div>
  );
}

/*
  Config-driven CRUD manager.
  props:
    title, basePath ('/projects'), listPath ('/projects/admin/all')
    fields: [{ name, label, type: text|textarea|number|checkbox|select|list, options?, required? }]
    columns: [{ key, label, render? }]
*/
export default function ResourceManager({ title, basePath, listPath, fields, columns }) {
  const { data, loading, refetch } = useApi(listPath);
  const toast = useToast();
  const [editing, setEditing] = useState(null); // object or 'new' or null
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const items = data || [];

  const openNew = () => {
    const blank = {};
    fields.forEach((f) => { blank[f.name] = f.type === 'list' ? '' : f.type === 'checkbox' ? false : ''; });
    setForm(blank);
    setEditing('new');
  };

  const openEdit = (item) => {
    const filled = {};
    fields.forEach((f) => {
      const v = item[f.name];
      filled[f.name] = f.type === 'list' ? (Array.isArray(v) ? v.join(', ') : '') : (v ?? '');
    });
    setForm({ ...filled, _id: item._id });
    setEditing(item);
  };

  const close = () => { setEditing(null); setForm({}); };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {};
      fields.forEach((f) => {
        let v = form[f.name];
        if (f.type === 'list') v = String(v || '').split(',').map((x) => x.trim()).filter(Boolean);
        else if (f.type === 'number') v = v === '' ? undefined : Number(v);
        else if (f.type === 'checkbox') v = Boolean(v);
        payload[f.name] = v;
      });
      if (form._id) await api.put(`${basePath}/${form._id}`, payload);
      else await api.post(basePath, payload);
      toast.success(`${title} saved`);
      close();
      refetch();
    } catch (e) {
      toast.error(e.errors?.[0] || e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    try {
      await api.delete(`${basePath}/${id}`);
      toast.success('Deleted');
      refetch();
    } catch (e) {
      toast.error(e.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button onClick={openNew} className="btn-primary"><Plus className="h-4 w-4" /> New</button>
      </div>

      {loading ? <Loader /> : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/5 text-xs uppercase tracking-wide text-slate-500">
              <tr>{columns.map((c) => <th key={c.key} className="px-4 py-3">{c.label}</th>)}<th className="px-4 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-slate-500">No items yet.</td></tr>}
              {items.map((item) => (
                <tr key={item._id} className="border-b border-white/5 last:border-0">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 text-slate-300">{c.render ? c.render(item) : String(item[c.key] ?? '—')}</td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(item)} className="mr-2 text-slate-400 hover:text-white" aria-label="Edit"><Pencil className="inline h-4 w-4" /></button>
                    <button onClick={() => remove(item._id)} className="text-slate-400 hover:text-red-400" aria-label="Delete"><Trash2 className="inline h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
            onClick={close}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card max-h-[85vh] w-full max-w-lg overflow-y-auto p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{form._id ? 'Edit' : 'New'} {title}</h2>
                <button onClick={close} aria-label="Close"><X className="h-5 w-5 text-slate-400" /></button>
              </div>
              <div className="space-y-4">
                {fields.map((f) => (
                  <div key={f.name}>
                    <label className="label">{f.label}{f.required && ' *'}{f.type === 'list' && ' (comma separated)'}</label>
                    {f.type === 'image' ? (
                      <ImageUpload value={form[f.name]} onChange={(v) => setForm({ ...form, [f.name]: v })} />
                    ) : f.type === 'markdown' ? (
                      <MarkdownField value={form[f.name]} onChange={(v) => setForm({ ...form, [f.name]: v })} />
                    ) : f.type === 'textarea' ? (
                      <textarea rows={4} className="input" value={form[f.name] || ''} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                    ) : f.type === 'checkbox' ? (
                      <input type="checkbox" className="accent-accent" checked={!!form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })} />
                    ) : f.type === 'select' ? (
                      <select className="input" value={form[f.name] || ''} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                        <option value="">Select…</option>
                        {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={f.type === 'number' ? 'number' : 'text'} className="input" value={form[f.name] || ''} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={close} className="btn-ghost">Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
