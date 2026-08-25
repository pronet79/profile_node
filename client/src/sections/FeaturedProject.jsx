import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, ExternalLink, ArrowRight, Star } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { fadeUp, viewportOnce } from '../utils/motion.js';

export default function FeaturedProject() {
  const { data } = useApi('/projects?featured=true');
  const project = data?.[0];
  if (!project) return null;

  const facts = [
    ['Problem', project.problem],
    ['Solution', project.solution],
    ['My Role', project.role],
    ['Architecture', project.architecture],
    ['Deployment', project.deployment],
    ['Results', project.results],
  ].filter(([, v]) => v);

  return (
    <section className="scroll-mt-20 py-24">
      <div className="container-x">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="card overflow-hidden border-accent/20 shadow-glow"
        >
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[280px] bg-gradient-to-br from-accent/25 to-ink-800">
              {project.coverImage ? (
                <img src={project.coverImage} alt={project.title} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-4xl font-bold text-white/20">{project.title}</div>
              )}
              <span className="absolute left-4 top-4 chip !bg-ink-900/80"><Star className="mr-1 h-3 w-3 text-accent" /> Flagship Project</span>
            </div>
            <div className="p-8 lg:p-10">
              <p className="section-label">{project.category}</p>
              <h2 className="mt-2 text-3xl font-bold text-white">{project.title}</h2>
              <p className="mt-4 text-slate-300">{project.overview || project.shortDescription}</p>

              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {facts.slice(0, 4).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-accent">{k}</dt>
                    <dd className="mt-1 text-sm text-slate-400">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-wrap gap-2">
                {(project.technologies || []).map((t) => <span key={t} className="chip">{t}</span>)}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {project.liveUrl && <a href={project.liveUrl} className="btn-primary">View Live <ExternalLink className="h-4 w-4" /></a>}
                <Link to={`/projects/${project.slug}`} className="btn-ghost">View Case Study <ArrowRight className="h-4 w-4" /></Link>
                {project.githubUrl && <a href={project.githubUrl} className="btn-ghost"><Github className="h-4 w-4" /> GitHub</a>}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
