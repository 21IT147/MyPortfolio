import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerAdmin } from '@/lib/api';
import { ShieldCheck, Lock, User, Mail, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';

export default function AdminRegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match!');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    try {
      await registerAdmin(username, password, email);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data || 'Failed to create admin account. Username may already be taken.';
      setErrorMsg(typeof msg === 'string' ? msg : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0f14] text-[#e8eaf0] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        <Link to="/admin/login" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-blue-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Admin Login
        </Link>

        <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6 shadow-2xl">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Admin Account</h1>
            <p className="text-xs text-gray-400">Register new credentials to gain authenticated CMS dashboard access.</p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. keval_admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
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
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Confirm Password</label>
              <div className="relative">
                <CheckCircle className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-purple-600/20 transition-all mt-2"
            >
              {loading ? 'Registering Account...' : 'Register & Log In'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-800">
            <p className="text-xs text-gray-400">
              Already have an account?{' '}
              <Link to="/admin/login" className="text-purple-400 font-semibold hover:underline">
                Sign In Here
              </Link>
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}
