import { motion } from 'framer-motion';
import { Download, MapPin, Briefcase, Layers, User } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { fadeUp, viewportOnce } from '../utils/motion.js';

export default function About() {
  const s = useSettings();

  // Fall back to sensible defaults so the section renders before seeding.
  const name = s.name || 'Pradosh Mukherjee';
  const role = s.role || 'Senior Full-Stack Developer';
  const location = s.location || 'Kolkata, India';
  const bio = s.bio;
  const photo = s.profilePhoto;
  const resumeUrl = s.resumeUrl;

  // Initials for the placeholder when no photo is set.
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const profile = [
    { icon: User, k: 'Name', v: name },
    { icon: Briefcase, k: 'Role', v: role },
    { icon: Layers, k: 'Experience', v: '10+ Years' },
    { icon: MapPin, k: 'Location', v: location },
  ];

  return (
    <section id="about" className="scroll-mt-20 py-24">
      <div className="container-x">
        <SectionHeading label="About" title="An engineer who builds products, not just features." />
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <div className="card p-6">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-gradient-to-br from-accent/20 to-ink-700 grid place-items-center">
                {photo ? (
                  <img src={photo} alt={name} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-6xl font-bold text-accent/50">{initials}</span>
                )}
              </div>
              <dl className="mt-6 space-y-3">
                {profile.map(({ icon: Icon, k, v }) => (
                  <div key={k} className="flex items-center gap-3 text-sm">
                    <Icon className="h-4 w-4 text-accent" />
                    <dt className="w-24 text-slate-500">{k}</dt>
                    <dd className="font-medium text-slate-200">{v}</dd>
                  </div>
                ))}
                <div className="flex items-start gap-3 pt-1 text-sm">
                  <Layers className="mt-0.5 h-4 w-4 text-accent" />
                  <div>
                    <span className="text-slate-500">Specialization</span>
                    <p className="font-medium text-slate-200">SaaS / ERP / APIs / AI / Real-Time Systems</p>
                  </div>
                </div>
              </dl>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="space-y-6">
            {bio ? (
              <p className="text-lg leading-relaxed text-slate-300 whitespace-pre-line">{bio}</p>
            ) : (
              <>
                <p className="text-lg leading-relaxed text-slate-300">
                  I'm a senior full-stack developer with more than a decade of experience shipping
                  production software for startups, agencies and established businesses. I specialize in
                  taking ambiguous business problems and turning them into reliable, maintainable systems.
                </p>
                <p className="leading-relaxed text-slate-400">
                  My work spans SaaS platforms, ERP and CRM systems, Shopify applications, real-time
                  dashboards and AI-powered workflows — across roughly fifteen business domains. I care
                  about clean architecture, sensible security defaults, and software that keeps working
                  long after launch.
                </p>
              </>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { t: 'Development philosophy', d: 'Pragmatic architecture, tested critical paths, and code the next developer can read.' },
                { t: 'Technical strengths', d: 'Backend systems, API design, payments, real-time features and AI integration.' },
              ].map((b) => (
                <div key={b.t} className="card p-5">
                  <h3 className="font-semibold text-white">{b.t}</h3>
                  <p className="mt-2 text-sm text-slate-400">{b.d}</p>
                </div>
              ))}
            </div>

            {resumeUrl ? (
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn-primary w-fit"><Download className="h-4 w-4" /> Download CV</a>
            ) : (
              <span className="btn-ghost w-fit cursor-default opacity-60" title="Add a resume URL in admin settings"><Download className="h-4 w-4" /> Download CV</span>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
