import { useState } from 'react';
import { Check, X, Trash2 } from 'lucide-react';
import { useApi } from '../../hooks/useApi.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { StarDisplay } from '../../components/StarRating.jsx';
import Loader from '../../components/Loader.jsx';
import { formatDate } from '../../utils/format.js';

const tabs = ['pending', 'approved', 'rejected', 'all'];

export default function AdminFeedback() {
  const [tab, setTab] = useState('pending');
  const path = tab === 'all' ? '/testimonials/admin/all' : `/testimonials/admin/all?status=${tab}`;
  const { data, loading, refetch } = useApi(path, [tab]);
  const toast = useToast();

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/testimonials/${id}/status`, { status });
      toast.success(`Marked ${status}`);
      refetch();
    } catch (e) { toast.error(e.message); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try { await api.delete(`/testimonials/${id}`); toast.success('Deleted'); refetch(); }
    catch (e) { toast.error(e.message); }
  };

  const items = data || [];
  const badge = { pending: 'bg-yellow-400/15 text-yellow-300', approved: 'bg-emerald-400/15 text-emerald-300', rejected: 'bg-red-400/15 text-red-300' };

  return (
    <div>
      <h1 className="text-2xl font-bold">Feedback</h1>
      <p className="mt-1 text-sm text-slate-400">Approve testimonials before they appear publicly.</p>

      <div className="mt-6 flex gap-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-4 py-2 text-sm capitalize ${tab === t ? 'bg-accent text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>{t}</button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <div className="mt-6 space-y-4">
          {items.length === 0 && <p className="text-slate-500">No feedback here.</p>}
          {items.map((t) => (
            <div key={t._id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white">{t.name}</span>
                    <StarDisplay value={t.rating} />
                    <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badge[t.status]}`}>{t.status}</span>
                  </div>
                  <p className="text-xs text-slate-500">{t.email}{t.company ? ` · ${t.company}` : ''} · {formatDate(t.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  {t.status !== 'approved' && <button onClick={() => setStatus(t._id, 'approved')} className="btn-ghost h-9 !px-3 text-xs text-emerald-400"><Check className="h-4 w-4" /> Approve</button>}
                  {t.status !== 'rejected' && <button onClick={() => setStatus(t._id, 'rejected')} className="btn-ghost h-9 !px-3 text-xs"><X className="h-4 w-4" /> Reject</button>}
                  <button onClick={() => remove(t._id)} className="btn-ghost h-9 !px-3 text-xs text-red-400"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-300">{t.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
