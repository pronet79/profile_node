import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center py-20">
      <Seo title="404 — Not Found" noindex />
      <div className="text-center">
        <p className="text-7xl font-extrabold text-accent">404</p>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-slate-400">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary mt-6">Back home</Link>
      </div>
    </div>
  );
}
