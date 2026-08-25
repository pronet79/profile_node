import { useParams, Link } from 'react-router-dom';
import { Github, ExternalLink, ArrowLeft } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Loader from '../components/Loader.jsx';
import YouTubeEmbed from '../components/YouTubeEmbed.jsx';
import { useApi } from '../hooks/useApi.js';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, loading, error } = useApi(`/projects/slug/${slug}`, [slug]);

  if (loading) return <div className="py-32"><Loader /></div>;
  if (error || !project) return (
    <div className="container-x py-32 text-center">
      <p className="text-slate-400">Project not found.</p>
      <Link to="/projects" className="btn-ghost mt-6">Back to projects</Link>
    </div>
  );

  const sections = [
    ['Overview', project.overview],
    ['Problem', project.problem],
    ['Solution', project.solution],
    ['Architecture', project.architecture],
    ['Deployment', project.deployment],
    ['Results', project.results],
    ['My Role', project.role],
    ['Case Study', project.caseStudy],
  ].filter(([, v]) => v);

  return (
    <article className="py-16">
      <Seo
        title={`${project.title} — Case Study`}
        description={project.shortDescription}
        image={project.coverImage}
        path={`/projects/${project.slug}`}
        type="article"
      />
      <div className="container-x max-w-4xl">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> All projects</Link>
        <span className="section-label mt-6 block">{project.category}</span>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">{project.title}</h1>
        <p className="mt-4 text-lg text-slate-400">{project.shortDescription}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.liveUrl && <a href={project.liveUrl} className="btn-primary">View Live <ExternalLink className="h-4 w-4" /></a>}
          {project.githubUrl && <a href={project.githubUrl} className="btn-ghost"><Github className="h-4 w-4" /> GitHub</a>}
        </div>

        {project.coverImage && (
          <img src={project.coverImage} alt={project.title} className="mt-10 w-full rounded-2xl border border-white/5" />
        )}

        {project.videoUrl && (
          <div className="mt-8">
            <YouTubeEmbed url={project.videoUrl} title={`${project.title} — demo`} />
          </div>
        )}

        {project.technologies?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {project.technologies.map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
        )}

        <div className="mt-10 space-y-8">
          {sections.map(([title, body]) => (
            <section key={title}>
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-300">{body}</p>
            </section>
          ))}

          {project.keyFeatures?.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-white">Key Features</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {project.keyFeatures.map((f, i) => (
                  <li key={i} className="flex gap-2 text-slate-300"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> {f}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
