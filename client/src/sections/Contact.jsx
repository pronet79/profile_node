import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, MapPin, CheckCircle2, Send } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { fadeUp, viewportOnce } from '../utils/motion.js';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  company: z.string().optional(),
  projectType: z.enum(['SaaS', 'ERP', 'Shopify', 'AI', 'API', 'Website', 'Mobile', 'Other']),
  budget: z.string().optional(),
  message: z.string().min(10, 'Please describe your project'),
  website_hp: z.string().optional(),
});

const projectTypes = ['SaaS', 'ERP', 'Shopify', 'AI', 'API', 'Website', 'Mobile', 'Other'];
const budgets = ['Under ₹25K', '₹25K–₹50K', '₹50K–₹1L', '₹1L–₹3L', '₹3L+'];

export default function Contact() {
  const toast = useToast();
  const { email, location } = useSettings();
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { projectType: 'SaaS' },
  });

  const onSubmit = async (values) => {
    try {
      await api.post('/contact', values);
      setSent(true);
      reset();
      toast.success("Message received. I'll get back to you soon.");
    } catch (e) {
      toast.error(e.message || 'Could not send message');
    }
  };

  return (
    <section id="contact" className="scroll-mt-20 border-t border-white/5 bg-white/[0.02] py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading label="Contact" title="Let's build something serious." subtitle="Tell me about your project and I'll review it and get back to you with next steps." />
          <div className="mt-8 space-y-4">
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-3 text-slate-300 hover:text-white">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent"><Mail className="h-4 w-4" /></span>
                {email}
              </a>
            )}
            <div className="flex items-center gap-3 text-slate-300">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent"><MapPin className="h-4 w-4" /></span>
              {location || 'Kolkata, India'}
            </div>
          </div>
        </div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <div className="card p-8">
            {sent ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                <h3 className="mt-4 text-xl font-semibold text-white">Message Received</h3>
                <p className="mt-2 text-slate-400">Thanks! I'll review your project and get back to you.</p>
                <button onClick={() => setSent(false)} className="btn-ghost mt-6">Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="c-name">Name *</label>
                    <input id="c-name" className="input" {...register('name')} />
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="c-email">Email *</label>
                    <input id="c-email" type="email" className="input" {...register('email')} />
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="c-company">Company</label>
                    <input id="c-company" className="input" {...register('company')} />
                  </div>
                  <div>
                    <label className="label" htmlFor="c-type">Project Type</label>
                    <select id="c-type" className="input" {...register('projectType')}>
                      {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="c-budget">Budget</label>
                  <select id="c-budget" className="input" {...register('budget')}>
                    <option value="">Select a range</option>
                    {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="c-message">Message *</label>
                  <textarea id="c-message" rows={4} className="input" {...register('message')} />
                  {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                </div>
                <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register('website_hp')} />
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                  <Send className="h-4 w-4" /> {isSubmitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
