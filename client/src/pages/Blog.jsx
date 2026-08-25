import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../components/Seo.jsx';
import Loader from '../components/Loader.jsx';
import { useApi } from '../hooks/useApi.js';
import { formatDate } from '../utils/format.js';
import { fadeUp, stagger } from '../utils/motion.js';

export default function Blog() {
  const { data, loading } = useApi('/blog');
  const posts = data || [];

  return (
    <div className="py-20">
      <Seo title="Blog — Pradosh Mukherjee" path="/blog" description="Articles on Laravel, Node.js, React, SaaS, AI and APIs." />
      <div className="container-x">
        <span className="section-label">Writing</span>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-4 max-w-2xl text-slate-400">Notes on building production software — Laravel, Node.js, React, SaaS, AI and APIs.</p>

        {loading ? <Loader /> : posts.length === 0 ? (
          <p className="mt-12 text-slate-500">No posts published yet.</p>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <motion.article key={p._id} variants={fadeUp} className="card overflow-hidden">
                <Link to={`/blog/${p.slug}`}>
                  <div className="aspect-video bg-gradient-to-br from-ink-700 to-ink-800">
                    {p.coverImage && <img src={p.coverImage} alt={p.title} loading="lazy" className="h-full w-full object-cover" />}
                  </div>
                  <div className="p-5">
                    <span className="chip">{p.category}</span>
                    <h2 className="mt-3 text-lg font-semibold text-white">{p.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">{p.excerpt}</p>
                    <p className="mt-4 text-xs text-slate-500">{formatDate(p.publishedAt)} · {p.readMinutes} min read</p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
