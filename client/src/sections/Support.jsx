import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Coffee, CheckCircle2, XCircle } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { fadeUp, viewportOnce } from '../utils/motion.js';
import { inr } from '../utils/format.js';

const presets = [100, 250, 500, 1000, 2500];

/* Loads the Razorpay checkout script on demand. */
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function Support() {
  const toast = useToast();
  const [amount, setAmount] = useState(500);
  const [custom, setCustom] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '', showPublicly: false });
  const [status, setStatus] = useState('idle'); // idle | processing | success | failed
  const [loading, setLoading] = useState(false);

  const effectiveAmount = custom ? Number(custom) : amount;

  const handleSupport = async () => {
    if (!effectiveAmount || effectiveAmount < 1) return toast.error('Please enter a valid amount');
    setLoading(true);
    try {
      // 1. Create the order on the backend
      const { data } = await api.post('/donations/order', { ...form, amount: effectiveAmount });
      const order = data.data;

      const ok = await loadRazorpay();
      if (!ok) { setLoading(false); return toast.error('Could not load payment gateway'); }

      // 2. Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Support Pradosh',
        description: 'Support development work',
        order_id: order.orderId,
        prefill: { name: form.name, email: form.email },
        theme: { color: '#7c5cff' },
        handler: async (resp) => {
          // 3. Verify signature on the backend (source of truth)
          try {
            await api.post('/donations/verify', {
              orderId: resp.razorpay_order_id,
              paymentId: resp.razorpay_payment_id,
              signature: resp.razorpay_signature,
            });
            setStatus('success');
          } catch {
            setStatus('failed');
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.on('payment.failed', () => setStatus('failed'));
      rzp.open();
    } catch (e) {
      toast.error(e.message || 'Payments are currently unavailable');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <SupportResult
        icon={<CheckCircle2 className="h-14 w-14 text-emerald-400" />}
        title="Thank You For Supporting My Work ❤️"
        text="Your support means a lot and helps me keep building and sharing open work."
        onReset={() => setStatus('idle')}
      />
    );
  }
  if (status === 'failed') {
    return (
      <SupportResult
        icon={<XCircle className="h-14 w-14 text-red-400" />}
        title="Payment Could Not Be Completed"
        text="No charge was verified. You can try again whenever you like."
        onReset={() => setStatus('idle')}
      />
    );
  }

  return (
    <section id="support" className="scroll-mt-20 py-24">
      <div className="container-x">
        <SectionHeading label="Support" title="Support My Work" center
          subtitle="If you found my work useful or would like to support my open-source projects and development journey, you can leave a tip." />

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mx-auto mt-12 max-w-xl">
          <div className="card p-8">
            <div className="mb-2 flex items-center gap-2 text-accent"><Coffee className="h-5 w-5" /><span className="font-semibold">Buy me a coffee</span></div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {presets.map((a) => (
                <button
                  key={a}
                  onClick={() => { setAmount(a); setCustom(''); }}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-all ${
                    !custom && amount === a ? 'border-accent bg-accent/15 text-white' : 'border-white/10 text-slate-300 hover:border-accent/40'
                  }`}
                >
                  {inr(a)}
                </button>
              ))}
              <input
                type="number"
                min="1"
                placeholder="Custom"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                className="input col-span-1 text-center"
                aria-label="Custom amount"
              />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <input className="input" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="input" type="email" placeholder="Email (for receipt)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <textarea className="input mt-4" rows={2} placeholder="Optional message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />

            <label className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <input type="checkbox" checked={form.showPublicly} onChange={(e) => setForm({ ...form, showPublicly: e.target.checked })} className="accent-accent" />
              Show my name publicly (otherwise shown as "Anonymous Supporter")
            </label>

            <button onClick={handleSupport} disabled={loading} className="btn-primary mt-6 w-full">
              <Heart className="h-4 w-4" /> {loading ? 'Processing…' : `Send a Tip · ${inr(effectiveAmount)}`}
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">Payments are verified securely on the server. No card details are stored.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SupportResult({ icon, title, text, onReset }) {
  return (
    <section className="py-24">
      <div className="container-x">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-lg">
          <div className="card p-10 text-center">
            <div className="mx-auto w-fit">{icon}</div>
            <h3 className="mt-5 text-2xl font-bold text-white">{title}</h3>
            <p className="mt-3 text-slate-400">{text}</p>
            <button onClick={onReset} className="btn-ghost mt-6">Back</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
