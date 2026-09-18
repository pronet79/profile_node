import { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import Loader from '../components/Loader.jsx';
import { useApi } from '../hooks/useApi.js';
import { stagger } from '../utils/motion.js';

const PAGE_SIZE = 6; // show 6 per page; pagination appears only when there are more

export default function ProjectsPage() {
  const { data, loading } = useApi('/projects');
  const projects = data || [];
  const [page, setPage] = useState(1);
  const gridTopRef = useRef(null);

  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));

  // Keep the page in range if the project count changes.
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return projects.slice(start, start + PAGE_SIZE);
  }, [projects, page]);

  const goTo = (p) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    // Scroll back to the top of the grid so the new page starts in view.
    gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="py-20">
      <Seo title="Projects — Pradosh Mukherjee" path="/projects" description="A selection of SaaS, ERP, Shopify, AI and real-time projects." />
      <div className="container-x">
        <span className="section-label">Portfolio</span>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">All Projects</h1>
        <p className="mt-4 max-w-2xl text-slate-400">Production software across SaaS, ERP, Shopify, AI and real-time systems.</p>

        <div ref={gridTopRef} className="scroll-mt-24" />

        {loading ? (
          <Loader />
        ) : projects.length === 0 ? (
          <p className="mt-12 text-slate-500">No projects published yet.</p>
        ) : (
          <>
            <motion.div
              key={page} /* re-run the stagger animation on page change */
              variants={stagger}
              initial="hidden"
              animate="show"
              className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {pageItems.map((p) => <ProjectCard key={p._id} project={p} />)}
            </motion.div>

            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onChange={goTo} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onChange }) {
  // Build a compact list of page numbers with ellipses for large counts.
  const pages = getPageList(page, totalPages);
  const btn = 'grid h-10 min-w-10 place-items-center rounded-lg border px-3 text-sm transition-colors';

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Projects pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`${btn} border-white/10 text-slate-300 hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="px-1 text-slate-500">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`${btn} font-medium ${
              p === page ? 'border-accent bg-accent/15 text-white' : 'border-white/10 text-slate-300 hover:border-accent/40'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={`${btn} border-white/10 text-slate-300 hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

/* Returns e.g. [1, '…', 4, 5, 6, '…', 12] — always shows first/last and neighbours. */
function getPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push('…');
    out.push(p);
    prev = p;
  }
  return out;
}
