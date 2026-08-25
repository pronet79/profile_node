import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Quote, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import { StarInput, StarDisplay } from '../components/StarRating.jsx';
import { useApi } from '../hooks/useApi.js';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { fadeUp, stagger, viewportOnce } from '../utils/motion.js';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  company: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  rating: z.number().min(1, 'Please select a rating').max(5),
  message: z.string().min(10, 'Please share a little more'),
  website_hp: z.string().optional(), // honeypot
});

export default function Testimonials() {
  const { data, refetch } = useApi('/testimonials');
  const toast = useToast();
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0 },
  });
  const rating = watch('rating');

  const onSubmit = async (values) => {
    try {
      await api.post('/testimonials', values);
      setSubmitted(true);
      reset({ rating: 0 });
      toast.success('Feedback submitted for review. Thank you!');
      refetch();
    } catch (e) {
      toast.error(e.message || 'Could not submit feedback');
    }
  };

  const testimonials = data || [];

  return (
    <section id="testimonials" className="scroll-mt-20 py-24">
      <div className="container-x">
        <SectionHeading label="Testimonials" title="What clients and collaborators say." center />

        {testimonials.length > 0 && (
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce} className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <motion.figure key={t._id} variants={fadeUp} className="card p-6">
                <Quote className="h-6 w-6 text-accent/60" />
                <blockquote className="mt-3 text-sm text-slate-300">{t.message}</blockquote>
                <figcaption className="mt-5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{t.name}</div>
                    {t.company && <div className="text-xs text-slate-500">{t.company}</div>}
                  </div>
                  <StarDisplay value={t.rating} />
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        )}

        {/* Submission form */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mx-auto mt-16 max-w-2xl">
          <div className="card p-8">
            {submitted ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                <h3 className="mt-4 text-xl font-semibold text-white">Feedback Submitted</h3>
                <p className="mt-2 text-slate-400">Thank you! Your feedback has been submitted for review.</p>
                <button onClick={() => setSubmitted(false)} className="btn-ghost mt-6">Submit another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <h3 className="text-lg font-semibold text-white">Leave your feedback</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="t-name">Name *</label>
                    <input id="t-name" className="input" {...register('name')} />
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="t-email">Email *</label>
                    <input id="t-email" type="email" className="input" {...register('email')} />
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="t-company">Company</label>
                    <input id="t-company" className="input" {...register('company')} />
                  </div>
                  <div>
                    <label className="label" htmlFor="t-website">Website</label>
                    <input id="t-website" className="input" placeholder="https://" {...register('website')} />
                    {errors.website && <p className="mt-1 text-xs text-red-400">{errors.website.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="label">Rating *</label>
                  <StarInput value={rating} onChange={(n) => setValue('rating', n, { shouldValidate: true })} />
                  {errors.rating && <p className="mt-1 text-xs text-red-400">{errors.rating.message}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="t-message">Feedback *</label>
                  <textarea id="t-message" rows={4} className="input" {...register('message')} />
                  {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                </div>
                {/* Honeypot — hidden from users, catches bots */}
                <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register('website_hp')} />

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                  {isSubmitting ? 'Submitting…' : 'Submit Feedback'}
                </button>
                <p className="text-center text-xs text-slate-500">Submissions are reviewed before appearing publicly.</p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
