import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* Renders trusted markdown (authored by the site owner in the admin) with
   consistent dark-theme styling. react-markdown escapes raw HTML by default,
   so this is safe against script injection. */
export default function Markdown({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: (p) => <h1 className="mt-8 text-3xl font-bold text-white" {...p} />,
        h2: (p) => <h2 className="mt-8 text-2xl font-semibold text-white" {...p} />,
        h3: (p) => <h3 className="mt-6 text-xl font-semibold text-white" {...p} />,
        p: (p) => <p className="mt-4 leading-relaxed text-slate-300" {...p} />,
        a: (p) => <a className="text-accent underline underline-offset-2 hover:text-accent-soft" target="_blank" rel="noreferrer" {...p} />,
        ul: (p) => <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-300" {...p} />,
        ol: (p) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300" {...p} />,
        li: (p) => <li className="leading-relaxed" {...p} />,
        blockquote: (p) => <blockquote className="mt-4 border-l-2 border-accent/50 pl-4 italic text-slate-400" {...p} />,
        code: ({ inline, className, children, ...props }) =>
          inline ? (
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-accent-soft" {...props}>{children}</code>
          ) : (
            <code className={`${className || ''} font-mono text-sm`} {...props}>{children}</code>
          ),
        pre: (p) => <pre className="mt-4 overflow-x-auto rounded-xl border border-white/5 bg-ink-900 p-4 text-sm" {...p} />,
        img: (p) => <img className="mt-6 w-full rounded-xl border border-white/5" loading="lazy" {...p} />,
        hr: () => <hr className="my-8 border-white/10" />,
        table: (p) => <div className="mt-4 overflow-x-auto"><table className="w-full border-collapse text-left text-sm" {...p} /></div>,
        th: (p) => <th className="border-b border-white/10 px-3 py-2 font-semibold text-white" {...p} />,
        td: (p) => <td className="border-b border-white/5 px-3 py-2 text-slate-300" {...p} />,
      }}
    >
      {children || ''}
    </ReactMarkdown>
  );
}
