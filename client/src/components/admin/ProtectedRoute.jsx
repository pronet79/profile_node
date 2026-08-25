import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Loader from '../Loader.jsx';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="grid min-h-screen place-items-center"><Loader label="Checking session…" /></div>;
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location }} />;
  return children;
}
