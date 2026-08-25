import { useState } from 'react';
import { Download } from 'lucide-react';
import { useApi } from '../../hooks/useApi.js';
import Loader from '../../components/Loader.jsx';
import { inr, formatDate } from '../../utils/format.js';

export default function AdminDonations() {
  const [status, setStatus] = useState('');
  const { data: stats } = useApi('/donations/admin/stats');
  const { data, loading } = useApi(`/donations/admin/all${status ? `?status=${status}` : ''}`, [status]);
  const items = data || [];

  const exportCsv = () => {
    const rows = [
      ['Transaction ID', 'Name', 'Email', 'Amount', 'Gateway', 'Status', 'Date', 'Message'],
      ...items.map((d) => [d.paymentId || d.orderId || d._id, d.name, d.email || '', d.amount, d.gateway, d.status, formatDate(d.createdAt), (d.message || '').replace(/,/g, ';')]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'donations.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const s = stats || {};

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Support</h1>
        <button onClick={exportCsv} className="btn-ghost"><Download className="h-4 w-4" /> Export CSV</button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Total Support" value={inr(s.totalSupport)} />
        <Stat label="Supporters" value={s.supporters ?? 0} />
        <Stat label="Successful" value={s.successful ?? 0} />
        <Stat label="Failed" value={s.failed ?? 0} />
        <Stat label="Pending" value={s.pending ?? 0} />
      </div>

      <div className="mt-6 flex gap-2">
        {['', 'successful', 'failed', 'created'].map((st) => (
          <button key={st || 'all'} onClick={() => setStatus(st)} className={`rounded-lg px-4 py-2 text-sm capitalize ${status === st ? 'bg-accent text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>{st || 'all'}</button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/5 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-4 py-3">Txn ID</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th></tr>
            </thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No transactions.</td></tr>}
              {items.map((d) => (
                <tr key={d._id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{d.paymentId || d.orderId || '—'}</td>
                  <td className="px-4 py-3">{d.showPublicly ? d.name : 'Anonymous'}</td>
                  <td className="px-4 py-3 text-slate-400">{d.email || '—'}</td>
                  <td className="px-4 py-3 font-semibold">{inr(d.amount)}</td>
                  <td className="px-4 py-3 capitalize">{d.status}</td>
                  <td className="px-4 py-3 text-slate-400">{formatDate(d.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card p-5">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
