import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Loader from '../components/Loader.jsx';
import Markdown from '../components/Markdown.jsx';
import { useApi } from '../hooks/useApi.js';
import { formatDate } from '../utils/format.js';

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading, error } = useApi(`/blog/slug/${slug}`, [slug]);

  if (loading) return <div className="py-32"><Loader /></div>;
  if (error || !post) return (
    <div className="container-x py-32 text-center">
      <p className="text-slate-400">Article not found.</p>
      <Link to="/blog" className="btn-ghost mt-6">Back to blog</Link>
    </div>
  );

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: 'Pradosh Mukherjee' },
  };

  return (
    <article className="py-16">
      <Seo
        title={post.seoTitle || `${post.title} — Blog`}
        description={post.seoDescription || post.excerpt}
        image={post.coverImage}
        path={`/blog/${post.slug}`}
        type="article"
        jsonLd={articleSchema}
      />
      <div className="container-x max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Blog</Link>
        <span className="chip mt-6">{post.category}</span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">{post.title}</h1>
        <p className="mt-3 text-sm text-slate-500">{formatDate(post.publishedAt)} · {post.readMinutes} min read</p>
        {post.coverImage && <img src={post.coverImage} alt={post.title} className="mt-8 w-full rounded-2xl border border-white/5" />}
        <div className="mt-8 max-w-none">
          <Markdown>{post.content}</Markdown>
        </div>
      </div>
    </article>
  );
}
