import { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useApi } from '../../hooks/useApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import Loader from '../../components/Loader.jsx';
import ImageUpload from '../../components/admin/ImageUpload.jsx';
import FileUpload from '../../components/admin/FileUpload.jsx';

function pathGet(obj, path) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}

/* Defined at module scope (NOT inside the component) so its identity is stable
   across re-renders. If it were declared inside AdminSettings, every keystroke
   would recreate it, remounting the input and stealing focus after one char. */
function Field({ label, path, textarea, form, set }) {
  const value = pathGet(form, path) || '';
  return (
    <div>
      <label className="label">{label}</label>
      {textarea ? (
        <textarea rows={3} className="input" value={value} onChange={(e) => set(path, e.target.value)} />
      ) : (
        <input className="input" value={value} onChange={(e) => set(path, e.target.value)} />
      )}
    </div>
  );
}

export default function AdminSettings() {
  const { data, loading } = useApi('/settings');
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) setForm(data); }, [data]);
  if (loading || !form) return <Loader />;

  const set = (path, value) => {
    setForm((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = (obj[keys[i]] ||= {});
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/settings', form);
      toast.success('Settings saved');
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="mt-6 space-y-8">
        <section className="card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">Profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" path="name" form={form} set={set} />
            <Field label="Role" path="role" form={form} set={set} />
            <Field label="Email" path="email" form={form} set={set} />
            <Field label="Location" path="location" form={form} set={set} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Profile photo</label>
              <ImageUpload value={form.profilePhoto} onChange={(v) => set('profilePhoto', v)} previewClass="h-20 w-20" />
            </div>
            <div>
              <label className="label">Resume / CV (PDF, stored on your server)</label>
              <FileUpload value={form.resumeUrl} onChange={(v) => set('resumeUrl', v)} />
            </div>
          </div>
          <div className="mt-4"><Field label="Bio" path="bio" textarea form={form} set={set} /></div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">Hero & Social</h2>
          <Field label="Hero heading" path="heroHeading" textarea form={form} set={set} />
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="GitHub" path="social.github" form={form} set={set} />
            <Field label="LinkedIn" path="social.linkedin" form={form} set={set} />
            <Field label="Fiverr" path="social.fiverr" form={form} set={set} />
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">SEO & Analytics</h2>
          <div className="grid gap-4">
            <Field label="Default SEO title" path="seo.defaultTitle" form={form} set={set} />
            <Field label="Default SEO description" path="seo.defaultDescription" textarea form={form} set={set} />
            <Field label="Analytics ID" path="analyticsId" form={form} set={set} />
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <input type="checkbox" className="accent-accent" checked={!!form.donationEnabled} onChange={(e) => set('donationEnabled', e.target.checked)} />
            Enable donations / support section
          </label>
        </section>

        <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save Settings'}</button>
      </div>
    </div>
  );
}
