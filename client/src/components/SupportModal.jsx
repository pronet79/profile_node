import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Coffee, CheckCircle2, XCircle, X } from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { useSupport } from '../context/SupportContext.jsx';
import { inr } from '../utils/format.js';

const presets = [100, 250, 500, 1000, 2500];

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

export default function SupportModal() {
  const { open, closeSupport } = useSupport();
  const toast = useToast();
  const [amount, setAmount] = useState(500);
  const [custom, setCustom] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '', showPublicly: false });
  const [status, setStatus] = useState('idle'); // idle | success | failed
  const [loading, setLoading] = useState(false);

  const effectiveAmount = custom ? Number(custom) : amount;

  // Close on ESC + lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && closeSupport();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, closeSupport]);

  const reset = () => { setStatus('idle'); setForm({ name: '', email: '', message: '', showPublicly: false }); setCustom(''); setAmount(500); };
  const handleClose = () => { closeSupport(); setTimeout(reset, 200); };

  const handleSupport = async () => {
    if (!effectiveAmount || effectiveAmount < 1) return toast.error('Please enter a valid amount');
    setLoading(true);
    try {
      const { data } = await api.post('/donations/order', { ...form, amount: effectiveAmount });
      const order = data.data;
      const ok = await loadRazorpay();
      if (!ok) { setLoading(false); return toast.error('Could not load payment gateway'); }

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
          try {
            await api.post('/donations/verify', {
              orderId: resp.razorpay_order_id,
              paymentId: resp.razorpay_payment_id,
              signature: resp.razorpay_signature,
            });
            setStatus('success');
          } catch { setStatus('failed'); }
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={handleClose}
          role="dialog" aria-modal="true" aria-label="Support My Work"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-glow"
          >
            <button onClick={handleClose} aria-label="Close" className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white">
              <X className="h-5 w-5" />
            </button>

            {status === 'success' ? (
              <Result icon={<CheckCircle2 className="h-14 w-14 text-emerald-400" />} title="Thank You For Supporting My Work ❤️" text="Your support means a lot and helps me keep building and sharing open work." onClose={handleClose} />
            ) : status === 'failed' ? (
              <Result icon={<XCircle className="h-14 w-14 text-red-400" />} title="Payment Could Not Be Completed" text="No charge was verified. You can try again whenever you like." onClose={() => setStatus('idle')} closeLabel="Try again" />
            ) : (
              <div className="p-8">
                <div className="mb-1 flex items-center gap-2 text-accent"><Coffee className="h-5 w-5" /><span className="font-semibold">Support My Work</span></div>
                <p className="mb-5 text-sm text-slate-400">If you found my work useful, you can leave a tip to support my open-source projects and development journey.</p>

                <div className="grid grid-cols-3 gap-3">
                  {presets.map((a) => (
                    <button key={a} onClick={() => { setAmount(a); setCustom(''); }}
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-all ${!custom && amount === a ? 'border-accent bg-accent/15 text-white' : 'border-white/10 text-slate-300 hover:border-accent/40'}`}>
                      {inr(a)}
                    </button>
                  ))}
                  <input type="number" min="1" placeholder="Custom" value={custom} onChange={(e) => setCustom(e.target.value)} className="input col-span-1 text-center" aria-label="Custom amount" />
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
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Result({ icon, title, text, onClose, closeLabel = 'Close' }) {
  return (
    <div className="p-10 text-center">
      <div className="mx-auto w-fit">{icon}</div>
      <h3 className="mt-5 text-2xl font-bold text-white">{title}</h3>
      <p className="mt-3 text-slate-400">{text}</p>
      <button onClick={onClose} className="btn-ghost mt-6">{closeLabel}</button>
    </div>
  );
}
