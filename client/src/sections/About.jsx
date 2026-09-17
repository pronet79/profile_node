import { motion } from 'framer-motion';
import { Download, MapPin, Briefcase, Layers, User } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { fadeUp, viewportOnce } from '../utils/motion.js';

export default function About() {
  const s = useSettings();

  // All content below is editable from admin → Settings, with sensible fallbacks.
  const name = s.name || 'Pradosh Mukherjee';
  const role = s.role || 'Senior Full-Stack Developer';
  const location = s.location || 'Kolkata, India';
  const photo = s.profilePhoto;
  const resumeUrl = s.resumeUrl;

  const heading = s.aboutHeading || 'An engineer who builds products, not just features.';
  const para1 = s.bio || "I'm a senior full-stack developer with more than a decade of experience shipping production software for startups, agencies and established businesses. I specialize in taking ambiguous business problems and turning them into reliable, maintainable systems.";
  const para2 = s.aboutParagraph2 || 'My work spans SaaS platforms, ERP and CRM systems, Shopify applications, real-time dashboards and AI-powered workflows. I care about clean architecture, sensible security defaults, and software that keeps working long after launch.';
  const specialization = s.specialization || 'SaaS / ERP / APIs / AI / Real-Time Systems';
  const years = s.yearsExperience || '10+ Years';
  const philosophy = s.philosophy || 'Pragmatic architecture, tested critical paths, and code the next developer can read.';
  const strengths = s.strengths || 'Backend systems, API design, payments, real-time features and AI integration.';

  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const profile = [
    { icon: User, k: 'Name', v: name },
    { icon: Briefcase, k: 'Role', v: role },
    { icon: Layers, k: 'Experience', v: years },
    { icon: MapPin, k: 'Location', v: location },
  ];

  return (
    <section id="about" className="scroll-mt-20 py-24">
      <div className="container-x">
        <SectionHeading label="About" title={heading} />
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
                {specialization && (
                  <div className="flex items-start gap-3 pt-1 text-sm">
                    <Layers className="mt-0.5 h-4 w-4 text-accent" />
                    <div>
                      <span className="text-slate-500">Specialization</span>
                      <p className="font-medium text-slate-200">{specialization}</p>
                    </div>
                  </div>
                )}
              </dl>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="space-y-6">
            {para1 && <p className="text-lg leading-relaxed text-slate-300 whitespace-pre-line">{para1}</p>}
            {para2 && <p className="leading-relaxed text-slate-400 whitespace-pre-line">{para2}</p>}

            <div className="grid gap-4 sm:grid-cols-2">
              {philosophy && (
                <div className="card p-5">
                  <h3 className="font-semibold text-white">Development philosophy</h3>
                  <p className="mt-2 text-sm text-slate-400">{philosophy}</p>
                </div>
              )}
              {strengths && (
                <div className="card p-5">
                  <h3 className="font-semibold text-white">Technical strengths</h3>
                  <p className="mt-2 text-sm text-slate-400">{strengths}</p>
                </div>
              )}
            </div>

            {resumeUrl ? (
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn-primary w-fit"><Download className="h-4 w-4" /> Download CV</a>
            ) : (
              <span className="btn-ghost w-fit cursor-default opacity-60" title="Add a resume in admin settings"><Download className="h-4 w-4" /> Download CV</span>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
