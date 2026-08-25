import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading.jsx';
import { useApi } from '../hooks/useApi.js';
import { getIcon } from '../components/iconMap.js';
import { fadeUp, stagger, viewportOnce } from '../utils/motion.js';

const fallback = [
  { title: 'SaaS Development', description: 'Scalable subscription-based web applications.', icon: 'layout-grid', tags: ['Laravel', 'Node.js', 'React'] },
  { title: 'ERP & CRM', description: 'Custom enterprise and business management systems.', icon: 'building-2', tags: ['Laravel', 'MySQL'] },
  { title: 'Shopify Applications', description: 'Shopify apps, integrations and merchant tools.', icon: 'shopping-bag', tags: ['Shopify', 'Node.js'] },
  { title: 'AI-Powered Applications', description: 'AI integrations, automation and intelligent workflows.', icon: 'sparkles', tags: ['LLM', 'Automation'] },
  { title: 'Real-Time Systems', description: 'Live dashboards, notifications, tracking and WebSocket apps.', icon: 'radio', tags: ['WebSockets', 'Redis'] },
  { title: 'API & Integrations', description: 'REST APIs, payment gateways and external service integrations.', icon: 'plug', tags: ['REST', 'Razorpay'] },
];

export default function Services() {
  const { data } = useApi('/services');
  const services = data?.length ? data : fallback;

  return (
    <section id="services" className="scroll-mt-20 py-24">
      <div className="container-x">
        <SectionHeading label="What I Build" title="Services engineered for real business outcomes." center />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s) => {
            const Icon = getIcon(s.icon);
            return (
              <motion.article
                key={s.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="card group p-6 transition-shadow hover:shadow-glow"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{s.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(s.tags || []).map((t) => <span key={t} className="chip">{t}</span>)}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
