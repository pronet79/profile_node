import { Helmet } from 'react-helmet-async';

/* Centralized SEO: title, meta, Open Graph, Twitter, canonical, JSON-LD. */
export default function Seo({
  title = 'Pradosh Mukherjee — Senior Full-Stack Developer',
  description = 'Senior Full-Stack Developer building scalable SaaS, ERP, APIs, real-time and AI-powered software with Laravel, PHP, Node.js and React.',
  image,
  path = '',
  type = 'website',
  noindex = false,
  jsonLd,
}) {
  const url = (typeof window !== 'undefined' ? window.location.origin : '') + path;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
