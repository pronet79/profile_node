import { motion } from 'framer-motion';
import { ArrowRight, Rocket } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.jsx';
import { fadeUp, viewportOnce } from '../utils/motion.js';

/*
  This section used to hold the donation form. That "Support My Work" flow now
  lives in a modal opened from the footer link. In its place is a project CTA.
  Heading/text are editable from admin settings (projectCtaHeading / projectCtaText).
*/
export default function Support() {
  const s = useSettings();
  const heading = s.projectCtaHeading || 'Have a Project in Mind?';
  const text = s.projectCtaText || "Let's turn your idea into reliable, production-ready software. Tell me what you're building and I'll get back to you with next steps.";

  return (
    <section id="start-project" className="scroll-mt-20 py-24">
      <div className="container-x">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-accent/15 via-ink-900 to-ink-900 p-10 text-center sm:p-14"
        >
          <div className="pointer-events-none absolute -top-16 left-1/2 h-64 w-[38rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
          <div className="relative">
            <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-accent/15 text-accent">
              <Rocket className="h-7 w-7" />
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">{text}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#contact" className="btn-primary">Start a Project <ArrowRight className="h-4 w-4" /></a>
              <a href="#projects" className="btn-ghost">See My Work</a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
