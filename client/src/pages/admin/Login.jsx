import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Code2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Seo from '../../components/Seo.jsx';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back');
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-ink-950 px-5">
      <Seo title="Admin Login" noindex />
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2 font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent"><Code2 className="h-5 w-5" /></span>
          Admin Console
        </div>
        <form onSubmit={submit} className="card space-y-4 p-8">
          <div className="mb-2 flex items-center gap-2 text-accent"><Lock className="h-4 w-4" /><span className="text-sm font-semibold">Secure sign in</span></div>
          <div>
            <label className="label" htmlFor="a-email">Email</label>
            <input id="a-email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="a-pass">Password</label>
            <input id="a-pass" type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
