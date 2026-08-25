import { useState } from 'react';
import { Trash2, Mail } from 'lucide-react';
import { useApi } from '../../hooks/useApi.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import Loader from '../../components/Loader.jsx';
import { formatDate } from '../../utils/format.js';

const statuses = ['new', 'read', 'replied', 'archived'];

export default function AdminMessages() {
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const query = [status && `status=${status}`, q && `q=${encodeURIComponent(q)}`].filter(Boolean).join('&');
  const { data, loading, refetch } = useApi(`/contact/admin/all${query ? `?${query}` : ''}`, [status, q]);
  const toast = useToast();

  const setMsgStatus = async (id, s) => {
    try { await api.patch(`/contact/${id}/status`, { status: s }); refetch(); }
    catch (e) { toast.error(e.message); }
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try { await api.delete(`/contact/${id}`); toast.success('Deleted'); refetch(); }
    catch (e) { toast.error(e.message); }
  };

  const items = data || [];

  return (
    <div>
      <h1 className="text-2xl font-bold">Messages</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <input className="input max-w-xs" placeholder="Search name, email, message…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input max-w-[160px]" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <Loader /> : (
        <div className="mt-6 space-y-4">
          {items.length === 0 && <p className="text-slate-500">No messages.</p>}
          {items.map((m) => (
            <div key={m._id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-accent" />
                    <span className="font-semibold text-white">{m.name}</span>
                    <span className="chip capitalize">{m.status}</span>
                  </div>
                  <p className="text-xs text-slate-500">{m.email}{m.company ? ` · ${m.company}` : ''} · {m.projectType} · {m.budget || 'no budget'} · {formatDate(m.createdAt)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {statuses.filter((s) => s !== m.status).map((s) => (
                    <button key={s} onClick={() => setMsgStatus(m._id, s)} className="btn-ghost h-8 !px-2 text-xs capitalize">{s}</button>
                  ))}
                  <button onClick={() => remove(m._id)} className="btn-ghost h-8 !px-2 text-xs text-red-400"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-300">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
