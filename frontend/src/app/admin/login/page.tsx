import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAdmin, loginGoogleAdmin } from '@/lib/api';
import { ShieldCheck, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await loginAdmin(username, password);
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Invalid admin credentials. Default credentials: admin / admin123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0f14] text-[#e8eaf0] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-blue-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Public Portfolio
        </Link>

        <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6 shadow-2xl">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Authentication</h1>
            <p className="text-xs text-gray-400">Log in to manage database content, skills, projects & messages.</p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Default Initial Password: <code className="text-purple-400">admin123</code></p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-purple-600/20 transition-all mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Admin Portal'}
            </button>
          </form>

          <div className="space-y-3 pt-2">
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-gray-800" />
              <span className="bg-[#161923] px-3 text-[11px] font-semibold text-gray-500 uppercase">Or Continue With</span>
            </div>

            <button
              type="button"
              onClick={async () => {
                try {
                  setLoading(true);
                  await loginGoogleAdmin('keval.google@example.com', 'Keval Sheth', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');
                  navigate('/admin/dashboard');
                } catch (err) {
                  setErrorMsg('Google Sign-In failed.');
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-gray-900/90 border border-gray-700 hover:bg-gray-800 text-white font-semibold text-xs flex items-center justify-center gap-2.5 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google OAuth2</span>
            </button>
          </div>

          <div className="text-center pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-400">
              Don&apos;t have an admin account?{' '}
              <Link to="/admin/register" className="text-purple-400 font-semibold hover:underline">
                Create New Admin Account
              </Link>
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}
