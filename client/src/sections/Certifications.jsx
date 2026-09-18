import { motion } from 'framer-motion';
import { Award, ExternalLink, UserRound, BadgeCheck } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import { useApi } from '../hooks/useApi.js';
import { fadeUp, stagger, viewportOnce } from '../utils/motion.js';

/*
  Certifications & Profiles — driven by the /certifications API and managed in
  admin. Renders two groups: earned certifications and external coding profiles.
  Renders nothing if there are no published entries.
*/
export default function Certifications() {
  const { data } = useApi('/certifications');
  const items = data || [];
  if (!items.length) return null;

  const certifications = items.filter((i) => i.category === 'certification');
  const profiles = items.filter((i) => i.category === 'profile');

  return (
    <section id="certifications" className="scroll-mt-20 py-24">
      <div className="container-x">
        <SectionHeading
          label="Credentials"
          title="Certifications & Profiles"
          subtitle="Verified certifications and my competitive-programming / coding profiles."
        />

        {certifications.length > 0 && (
          <div className="mt-12">
            <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
              <BadgeCheck className="h-4 w-4" /> Certifications
            </h3>
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((c) => <Card key={c._id} item={c} icon={Award} />)}
            </motion.div>
          </div>
        )}

        {profiles.length > 0 && (
          <div className="mt-12">
            <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
              <UserRound className="h-4 w-4" /> Coding Profiles
            </h3>
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((p) => <Card key={p._id} item={p} icon={UserRound} />)}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

function Card({ item, icon: Icon }) {
  return (
    <motion.a
      variants={fadeUp}
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="card group flex items-start gap-4 p-5 transition-colors hover:border-accent/40"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-accent/15 text-accent">
        {item.image ? (
          <img src={item.image} alt={item.issuer || item.title} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold leading-snug text-white">{item.title}</h4>
          <ExternalLink className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-accent" />
        </div>
        {item.issuer && <p className="mt-0.5 text-xs text-accent">{item.issuer}</p>}
        {item.description && <p className="mt-2 line-clamp-2 text-sm text-slate-400">{item.description}</p>}
        <span className="mt-3 inline-block text-xs font-medium text-slate-500 group-hover:text-white">View credential →</span>
      </div>
    </motion.a>
  );
}
