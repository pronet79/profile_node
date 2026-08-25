import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Briefcase, ArrowRight, Terminal } from 'lucide-react';
import { fadeUp, stagger } from '../utils/motion.js';
import { useSettings } from '../context/SettingsContext.jsx';

const codeLines = [
  { t: '$ ', c: 'whoami', cls: 'text-emerald-400' },
  { t: '', c: 'senior-fullstack-developer', cls: 'text-slate-400' },
  { t: '$ ', c: 'stack --list', cls: 'text-emerald-400' },
  { t: '', c: 'laravel · node · react · mongodb', cls: 'text-accent-soft' },
  { t: '$ ', c: 'build --production', cls: 'text-emerald-400' },
  { t: '', c: '✓ scalable  ✓ secure  ✓ shipped', cls: 'text-slate-300' },
];

export default function Hero() {
  const { social, email, heroHeading } = useSettings();
  const socials = [
    { href: social?.github, label: 'GitHub', Icon: Github },
    { href: social?.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { href: social?.fiverr, label: 'Fiverr', Icon: Briefcase },
    { href: email ? `mailto:${email}` : '', label: 'Email', Icon: Mail },
  ].filter((s) => s.href);

  return (
    <section id="home" className="relative overflow-hidden pt-16 pb-20 sm:pt-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.span variants={fadeUp} className="chip mb-5 gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Available for select projects
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {heroHeading ? (
              heroHeading
            ) : (
              <>
                Senior Full-Stack Developer Turning Complex Business Problems Into{' '}
                <span className="bg-gradient-to-r from-accent to-accent-soft bg-clip-text text-transparent">
                  Production-Ready Software.
                </span>
              </>
            )}
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg text-slate-400">
            10+ years of experience building scalable SaaS platforms, ERP systems, APIs, real-time
            applications and AI-powered solutions using Laravel, PHP, Node.js and React.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="btn-primary">
              View My Work <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#contact" className="btn-ghost">Let's Work Together</a>
          </motion.div>

          {socials.length > 0 && (
            <motion.div variants={fadeUp} className="mt-8 flex items-center gap-4 text-slate-400">
              {socials.map(({ href, label, Icon }) => (
                <a key={label} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" aria-label={label} className="transition-colors hover:text-white">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Terminal-style visual */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="card animate-float overflow-hidden shadow-glow"
        >
          <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.02] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
            <span className="ml-3 flex items-center gap-1.5 text-xs text-slate-500">
              <Terminal className="h-3.5 w-3.5" /> pradosh@dev
            </span>
          </div>
          <div className="space-y-2 p-5 font-mono text-sm">
            {codeLines.map((l, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15 }}
              >
                <span className="text-emerald-400">{l.t}</span>
                <span className={l.cls}>{l.c}</span>
              </motion.div>
            ))}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.9 }}
              className="inline-block h-4 w-2 bg-accent align-middle"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
