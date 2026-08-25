import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../utils/motion.js';

export default function SectionHeading({ label, title, subtitle, center }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}
    >
      {label && <span className="section-label">{label}</span>}
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-slate-400">{subtitle}</p>}
    </motion.div>
  );
}
