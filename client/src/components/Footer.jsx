import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Briefcase } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.jsx';

export default function Footer() {
  const { name, role, social, email } = useSettings();
  const year = new Date().getFullYear();

  const socials = [
    { href: social?.github, label: 'GitHub', Icon: Github },
    { href: social?.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { href: social?.fiverr, label: 'Fiverr', Icon: Briefcase },
    { href: email ? `mailto:${email}` : '', label: 'Email', Icon: Mail },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-white/5 bg-ink-950">
      <div className="container-x grid gap-10 py-14 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold">{name || 'Pradosh Mukherjee'}</h3>
          <p className="mt-1 text-sm text-slate-400">{role || 'Senior Full-Stack Developer'}</p>
          <p className="mt-3 max-w-xs text-sm text-slate-500">
            Laravel • PHP • Node.js • React • SaaS • AI
          </p>
          {socials.length > 0 && (
            <div className="mt-4 flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a key={label} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" aria-label={label} className="btn-ghost h-10 w-10 !px-0">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li><a href="/#projects" className="hover:text-white">Projects</a></li>
            <li><a href="/#experience" className="hover:text-white">Experience</a></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
            <li><a href="/#contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Legal</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
            <li><Link to="/payment-policy" className="hover:text-white">Payment / Refund Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row">
          <p>© {year} {name || 'Pradosh Mukherjee'}. All rights reserved.</p>
          <p>Built with React, Node.js & MongoDB.</p>
        </div>
      </div>
    </footer>
  );
}
