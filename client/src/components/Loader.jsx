export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-400">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      {label}
    </div>
  );
}
