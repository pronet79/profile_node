import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import { fadeUp } from '../utils/motion.js';

export default function ProjectCard({ project }) {
  return (
    <motion.article variants={fadeUp} whileHover={{ y: -6 }} className="card group flex flex-col overflow-hidden">
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-ink-700 to-ink-800">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-2xl font-bold text-white/20">{project.title}</div>
        )}
        <span className="absolute left-3 top-3 chip !bg-ink-900/80">{project.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm text-slate-400">{project.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(project.technologies || []).slice(0, 4).map((t) => <span key={t} className="chip">{t}</span>)}
        </div>
        {project.results && (
          <p className="mt-4 text-xs text-emerald-400">↳ {project.results}</p>
        )}
        <div className="mt-5 flex items-center gap-3 border-t border-white/5 pt-4 text-sm">
          <Link to={`/projects/${project.slug}`} className="flex items-center gap-1 font-medium text-accent hover:text-accent-soft">
            Case Study <ArrowUpRight className="h-4 w-4" />
          </Link>
          <span className="ml-auto flex gap-2">
            {project.githubUrl && (
              <a href={project.githubUrl} aria-label="GitHub" className="text-slate-400 hover:text-white"><Github className="h-4 w-4" /></a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} aria-label="Live demo" className="text-slate-400 hover:text-white"><ExternalLink className="h-4 w-4" /></a>
            )}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
