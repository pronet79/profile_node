/* Parses common YouTube URL shapes and renders a responsive, privacy-enhanced embed.
   Supports: watch?v=ID, youtu.be/ID, /embed/ID, /shorts/ID, and bare IDs. */
function getYouTubeId(url = '') {
  if (!url) return null;
  // Bare 11-char id
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('/')[0] || null;
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const parts = u.pathname.split('/').filter(Boolean);
    const idx = parts.findIndex((p) => p === 'embed' || p === 'shorts');
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
  } catch {
    return null;
  }
  return null;
}

export default function YouTubeEmbed({ url, title = 'Project video' }) {
  const id = getYouTubeId(url);
  if (!id) return null;
  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/5 bg-black">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

export { getYouTubeId };
