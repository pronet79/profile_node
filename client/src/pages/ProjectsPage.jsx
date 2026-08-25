import { motion } from 'framer-motion';
import Seo from '../components/Seo.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import Loader from '../components/Loader.jsx';
import { useApi } from '../hooks/useApi.js';
import { stagger } from '../utils/motion.js';

export default function ProjectsPage() {
  const { data, loading } = useApi('/projects');
  const projects = data || [];

  return (
    <div className="py-20">
      <Seo title="Projects — Pradosh Mukherjee" path="/projects" description="A selection of SaaS, ERP, Shopify, AI and real-time projects." />
      <div className="container-x">
        <span className="section-label">Portfolio</span>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">All Projects</h1>
        <p className="mt-4 max-w-2xl text-slate-400">Production software across SaaS, ERP, Shopify, AI and real-time systems.</p>

        {loading ? <Loader /> : (
          <motion.div variants={stagger} initial="hidden" animate="show" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
          </motion.div>
        )}
      </div>
    </div>
  );
}
