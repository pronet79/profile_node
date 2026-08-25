import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FolderKanban, MessageSquareQuote, Mail, HeartHandshake, FileText, Users } from 'lucide-react';
import { useApi } from '../../hooks/useApi.js';
import Loader from '../../components/Loader.jsx';
import { inr } from '../../utils/format.js';

const cardMeta = [
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'pendingFeedback', label: 'Pending Feedback', icon: MessageSquareQuote },
  { key: 'newMessages', label: 'New Messages', icon: Mail },
  { key: 'supporters', label: 'Supporters', icon: Users },
  { key: 'posts', label: 'Blog Posts', icon: FileText },
];

export default function Dashboard() {
  const { data, loading } = useApi('/admin/overview');
  if (loading) return <Loader />;
  const cards = data?.cards || {};
  const support = (data?.charts?.monthlySupport || []).map((m) => ({ month: m._id, total: m.total }));
  const messages = (data?.charts?.monthlyMessages || []).map((m) => ({ month: m._id, total: m.total }));

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-400">Overview of your portfolio activity.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="card p-5 xl:col-span-1">
          <HeartHandshake className="h-5 w-5 text-accent" />
          <p className="mt-3 text-2xl font-bold">{inr(cards.totalSupport)}</p>
          <p className="text-xs text-slate-500">Total Support</p>
        </div>
        {cardMeta.map(({ key, label, icon: Icon }) => (
          <div key={key} className="card p-5">
            <Icon className="h-5 w-5 text-accent" />
            <p className="mt-3 text-2xl font-bold">{cards[key] ?? 0}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Monthly Support (₹)" data={support} />
        <ChartCard title="Monthly Messages" data={messages} />
      </div>
    </div>
  );
}

function ChartCard({ title, data }) {
  return (
    <div className="card p-6">
      <h2 className="text-sm font-semibold text-slate-300">{title}</h2>
      <div className="mt-4 h-64">
        {data.length === 0 ? (
          <div className="grid h-full place-items-center text-sm text-slate-500">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: '#12121d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
              <Bar dataKey="total" fill="#7c5cff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
