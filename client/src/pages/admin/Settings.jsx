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

/* Repeatable editor for the animated stat counters. Module scope keeps input
   focus stable across re-renders (same reason as Field above). */
function StatsEditor({ stats, onChange }) {
  const update = (i, key, val) => {
    const next = stats.map((s, idx) => (idx === i ? { ...s, [key]: val } : s));
    onChange(next);
  };
  const add = () => onChange([...stats, { value: '', suffix: '+', label: '' }]);
  const remove = (i) => onChange(stats.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {stats.map((s, i) => (
        <div key={i} className="grid grid-cols-[70px_60px_1fr_auto] items-end gap-2">
          <div>
            <label className="label">Value</label>
            <input className="input" value={s.value || ''} onChange={(e) => update(i, 'value', e.target.value)} placeholder="10" />
          </div>
          <div>
            <label className="label">Suffix</label>
            <input className="input" value={s.suffix || ''} onChange={(e) => update(i, 'suffix', e.target.value)} placeholder="+" />
          </div>
          <div>
            <label className="label">Label</label>
            <input className="input" value={s.label || ''} onChange={(e) => update(i, 'label', e.target.value)} placeholder="Years Experience" />
          </div>
          <button type="button" onClick={() => remove(i)} className="btn-ghost h-10 !px-3 text-xs text-red-400">Remove</button>
        </div>
      ))}
      {stats.length < 4 && (
        <button type="button" onClick={add} className="btn-ghost h-9 !px-3 text-xs">+ Add stat</button>
      )}
      <p className="text-xs text-slate-500">Numeric values animate (count-up). Up to 4 shown on the site.</p>
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
          <div className="mt-4"><Field label="Hero sub-heading" path="heroSubheading" textarea form={form} set={set} /></div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="GitHub" path="social.github" form={form} set={set} />
            <Field label="LinkedIn" path="social.linkedin" form={form} set={set} />
            <Field label="Fiverr" path="social.fiverr" form={form} set={set} />
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">About Section</h2>
          <Field label="About heading" path="aboutHeading" form={form} set={set} />
          <div className="mt-4"><Field label="Paragraph 1 (also used as Bio)" path="bio" textarea form={form} set={set} /></div>
          <div className="mt-4"><Field label="Paragraph 2" path="aboutParagraph2" textarea form={form} set={set} /></div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Specialization" path="specialization" form={form} set={set} />
            <Field label="Experience (e.g. 10+ Years)" path="yearsExperience" form={form} set={set} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Development philosophy" path="philosophy" textarea form={form} set={set} />
            <Field label="Technical strengths" path="strengths" textarea form={form} set={set} />
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">Stats (animated counters)</h2>
          <StatsEditor stats={form.stats || []} onChange={(next) => set('stats', next)} />
        </section>

        <section className="card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">“Have a Project in Mind?” CTA</h2>
          <Field label="Heading" path="projectCtaHeading" form={form} set={set} />
          <div className="mt-4"><Field label="Text" path="projectCtaText" textarea form={form} set={set} /></div>
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
