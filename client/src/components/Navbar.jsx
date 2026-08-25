import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Code2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';

const links = [
  { label: 'Home', to: '/#home' },
  { label: 'About', to: '/#about' },
  { label: 'Services', to: '/#services' },
  { label: 'Skills', to: '/#skills' },
  { label: 'Projects', to: '/#projects' },
  { label: 'Experience', to: '/#experience' },
  { label: 'Testimonials', to: '/#testimonials' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? 'border-b border-white/5 bg-ink-950/80 backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between" aria-label="Primary">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/15 text-accent">
            <Code2 className="h-5 w-5" />
          </span>
          <span>Pradosh<span className="text-accent">.</span></span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a key={l.to} href={l.to} className="rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:text-white">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <a href="/#contact" className="btn-primary">Let's Work Together</a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" className="btn-ghost h-10 w-10 !px-0">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/5 bg-ink-900 lg:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-4">
              {links.map((l) => (
                <a key={l.to} href={l.to} className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
                  {l.label}
                </a>
              ))}
              <a href="/#contact" className="btn-primary mt-2">Let's Work Together</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
