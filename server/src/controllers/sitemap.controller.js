import { Project } from '../models/Project.js';
import { BlogPost } from '../models/BlogPost.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/projects', priority: '0.9', changefreq: 'weekly' },
  { path: '/blog', priority: '0.7', changefreq: 'weekly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/payment-policy', priority: '0.3', changefreq: 'yearly' },
];

const xmlEscape = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

function urlEntry(loc, lastmod, changefreq, priority) {
  return [
    '  <url>',
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod ? `    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>` : '',
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
    priority ? `    <priority>${priority}</priority>` : '',
    '  </url>',
  ].filter(Boolean).join('\n');
}

/* Serves /sitemap.xml built from static routes + published projects & posts. */
export const sitemap = asyncHandler(async (_req, res) => {
  const base = env.siteUrl.replace(/\/$/, '');

  const [projects, posts] = await Promise.all([
    Project.find({ published: true }).select('slug updatedAt').lean(),
    BlogPost.find({ published: true }).select('slug updatedAt publishedAt').lean(),
  ]);

  const entries = [
    ...STATIC_ROUTES.map((r) => urlEntry(`${base}${r.path}`, null, r.changefreq, r.priority)),
    ...projects.map((p) => urlEntry(`${base}/projects/${p.slug}`, p.updatedAt, 'monthly', '0.8')),
    ...posts.map((p) => urlEntry(`${base}/blog/${p.slug}`, p.updatedAt || p.publishedAt, 'monthly', '0.6')),
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries.join('\n') +
    `\n</urlset>\n`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});
