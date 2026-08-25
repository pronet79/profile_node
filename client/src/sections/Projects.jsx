import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import Loader from '../components/Loader.jsx';
import { useApi } from '../hooks/useApi.js';
import { stagger, viewportOnce } from '../utils/motion.js';

export default function Projects() {
  const { data, loading } = useApi('/projects');
  const projects = (data || []).filter((p) => !p.featured).slice(0, 6);

  return (
    <section id="projects" className="scroll-mt-20 py-24">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading label="Selected Work" title="Projects built to ship and scale." />
          <Link to="/projects" className="btn-ghost">View All Projects <ArrowRight className="h-4 w-4" /></Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
          </motion.div>
        )}
      </div>
    </section>
  );
}
