import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getApiBaseUrl } from '../../config/api';
import { setCookie } from '../../utils/cookieUtils';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid administrator credentials');
      }

      // Save Auth Token & User Info in LocalStorage & Cookies for fast repeat visit loading
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify({ username: data.username, _id: data._id }));
      setCookie('adminToken', data.token, 7);
      setCookie('adminUsername', data.username, 7);

      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center px-4 py-12 font-heading selection:bg-indigo-600 selection:text-white">
      
      <Link
        to="/"
        className="absolute top-6 left-6 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 bg-white px-3.5 py-2 shadow-2xs flex items-center gap-1.5 transition-colors"
      >
        ← Return to Storefront
      </Link>

      <div className="w-full max-w-md font-heading">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-slate-900 text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 font-heading shadow-md">
            AB
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-heading uppercase tracking-wide">
            STORE ADMIN PORTAL
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-heading font-medium">
            Verified Administrative Console • Brutal Age Marketplace
          </p>
        </div>

        <div className="bg-white p-8 border border-slate-300 shadow-xl">
          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Standard HTML5 Form enabling Google & Browser Password Save Prompt */}
          <form onSubmit={handleLogin} action="#" method="POST" className="space-y-4">
            <div>
              <label htmlFor="admin-username" className="block text-xs font-extrabold uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin Email / Username *</span>
              </label>
              <input
                id="admin-username"
                name="username"
                type="email"
                required
                autoComplete="username"
                placeholder="admin@domain.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2.5 border border-slate-300 focus:outline-none focus:border-indigo-600 font-bold"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-extrabold uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Password *</span>
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs px-3.5 py-2.5 border border-slate-300 focus:outline-none focus:border-indigo-600 font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-indigo w-full py-3.5 text-xs font-extrabold uppercase tracking-wider mt-3 shadow-xs"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>

        <p className="text-[11px] text-center text-slate-400 mt-6 font-medium">
          Protected by Bcrypt 256-Bit Cryptographic Hashing & Anti-Bruteforce Lockouts
        </p>

      </div>
    </div>
  );
};
