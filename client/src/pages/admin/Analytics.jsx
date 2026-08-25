import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Eye, Users } from 'lucide-react';
import { useApi } from '../../hooks/useApi.js';
import Loader from '../../components/Loader.jsx';

const ranges = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
];

export default function AdminAnalytics() {
  const [days, setDays] = useState(30);
  const { data, loading } = useApi(`/analytics/summary?days=${days}`, [days]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="mt-1 text-sm text-slate-400">Privacy-friendly pageviews — no cookies, IPs are hashed.</p>
        </div>
        <div className="flex gap-2">
          {ranges.map((r) => (
            <button key={r.value} onClick={() => setDays(r.value)} className={`rounded-lg px-3 py-2 text-sm ${days === r.value ? 'bg-accent text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>{r.label}</button>
          ))}
        </div>
      </div>

      {loading ? <Loader /> : !data ? (
        <p className="mt-6 text-slate-500">No analytics data yet.</p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={<Eye className="h-5 w-5 text-accent" />} value={data.totalViews} label="Total Pageviews" />
            <Stat icon={<Users className="h-5 w-5 text-accent" />} value={data.uniqueVisitors} label="Unique Visitors (approx)" />
            <Stat value={data.topPaths?.[0]?.path || '—'} label="Top Page" small />
            <Stat value={data.topReferrers?.[0]?.referrer || 'Direct'} label="Top Referrer" small />
          </div>

          <div className="card mt-6 p-6">
            <h2 className="text-sm font-semibold text-slate-300">Pageviews over time</h2>
            <div className="mt-4 h-64">
              {data.daily?.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.daily}>
                    <defs>
                      <linearGradient id="pv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c5cff" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#7c5cff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: '#12121d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                    <Area type="monotone" dataKey="count" stroke="#7c5cff" strokeWidth={2} fill="url(#pv)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : <div className="grid h-full place-items-center text-sm text-slate-500">No views in this range</div>}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <ListCard title="Top Pages" rows={data.topPaths} keyField="path" />
            <ListCard title="Top Referrers" rows={data.topReferrers} keyField="referrer" empty="No external referrers yet" />
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ icon, value, label, small }) {
  return (
    <div className="card p-5">
      {icon}
      <p className={`mt-3 font-bold ${small ? 'truncate text-base' : 'text-2xl'}`}>{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function ListCard({ title, rows = [], keyField, empty = 'No data yet' }) {
  return (
    <div className="card p-6">
      <h2 className="text-sm font-semibold text-slate-300">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {rows.map((r, i) => (
            <li key={i} className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-slate-300">{r[keyField] || 'Direct'}</span>
              <span className="chip shrink-0">{r.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
