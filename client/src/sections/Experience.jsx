import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import { useApi } from '../hooks/useApi.js';
import { fadeUp, viewportOnce } from '../utils/motion.js';
import { monthYear } from '../utils/format.js';

export default function Experience() {
  const { data } = useApi('/experience');
  const items = data || [];
  if (!items.length) return null;

  return (
    <section id="experience" className="scroll-mt-20 border-y border-white/5 bg-white/[0.02] py-24">
      <div className="container-x">
        <SectionHeading label="Experience" title="A track record of shipped, maintained software." />
        <div className="relative mt-12 space-y-8 before:absolute before:left-[19px] before:top-2 before:h-full before:w-px before:bg-white/10">
          {items.map((exp) => (
            <motion.div
              key={exp._id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="relative pl-14"
            >
              <span className="absolute left-0 top-1 grid h-10 w-10 place-items-center rounded-full border border-accent/30 bg-ink-900 text-accent">
                <Briefcase className="h-4 w-4" />
              </span>
              <div className="card p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{exp.position}</h3>
                    <p className="text-sm text-accent">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  </div>
                  <span className="chip">
                    {monthYear(exp.startDate)} — {exp.current ? 'Present' : monthYear(exp.endDate)}
                  </span>
                </div>

                {exp.achievements?.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {exp.achievements.map((a, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-300">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> {a}
                      </li>
                    ))}
                  </ul>
                )}

                {exp.technologies?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.technologies.map((t) => <span key={t} className="chip">{t}</span>)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
