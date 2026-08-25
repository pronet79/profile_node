import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading.jsx';
import { useApi } from '../hooks/useApi.js';
import { fadeUp, viewportOnce } from '../utils/motion.js';

const fallback = {
  Backend: ['PHP', 'Laravel 8–12', 'CodeIgniter', 'Node.js', 'Express.js'],
  Frontend: ['React.js', 'Next.js', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
  Database: ['MongoDB', 'MySQL', 'Redis'],
  'APIs & Integrations': ['REST API', 'WebSockets', 'Payment APIs', 'Shopify APIs', 'Third-party APIs'],
  'DevOps / Cloud': ['Git', 'Linux', 'Railway', 'AWS', 'Deployment', 'Server Management'],
  AI: ['AI API Integration', 'AI Automation', 'AI-powered SaaS', 'LLM-based Applications'],
};

export default function Skills() {
  const { data } = useApi('/skills');

  // Group API skills by category; fall back to static content if empty.
  const grouped = data?.length
    ? data.reduce((acc, s) => {
        (acc[s.category] ||= []).push(s.name);
        return acc;
      }, {})
    : fallback;

  return (
    <section id="skills" className="scroll-mt-20 border-y border-white/5 bg-white/[0.02] py-24">
      <div className="container-x">
        <SectionHeading label="Skills" title="A stack chosen for reliability, not novelty." />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {Object.entries(grouped).map(([category, items]) => (
            <motion.div
              key={category}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="card p-6"
            >
              <h3 className="text-sm font-semibold uppercase tracking-widest text-accent">{category}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {items.map((t) => (
                  <motion.span key={t} whileHover={{ scale: 1.05 }} className="chip cursor-default">
                    {t}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
