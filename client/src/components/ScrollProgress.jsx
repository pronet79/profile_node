import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

/* Thin accent bar at the very top showing read/scroll progress.
   Hidden entirely for users who prefer reduced motion. */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  if (reduce) return null;
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[60] h-0.5 w-full origin-left bg-gradient-to-r from-accent to-accent-soft"
      aria-hidden="true"
    />
  );
}
