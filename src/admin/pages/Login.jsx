import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowRight, ShieldCheck, Building, Terminal } from 'lucide-react';

export default function Login({ setAuthToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('client'); // 'client' | 'super' — only affects post-login redirect hint, not credentials
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const selectAccountMode = (mode) => {
    setSelectedRole(mode);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('prsa_admin_token', data.token);
        localStorage.setItem('prsa_admin_user', JSON.stringify(data.user));
        setAuthToken(data.token);
        
        // Redirect according to role
        if (data.user.role === 'Super Admin') {
          navigate('/admin/content');
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        setError(data.error || 'Login failed. Invalid credentials.');
      }
    } catch (err) {
      setError('Connection error. Server may be starting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-space-xl shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-container to-primary text-on-primary-container flex items-center justify-center font-bold text-xl mx-auto shadow-lg">
            P
          </div>
          <h2 className="text-2xl font-bold text-primary tracking-tight">PRSA ACADEMY PORTAL</h2>
          <p className="text-xs text-on-surface-variant">
            Select your account type to access your dedicated management portal
          </p>
        </div>

        {/* Portal Account Mode Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-surface-container-high/60 p-1.5 rounded-xl border border-outline-variant/20">
          <button
            type="button"
            onClick={() => selectAccountMode('client')}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'client'
                ? 'bg-primary-container text-on-primary-container shadow-md'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Client Portal</span>
          </button>

          <button
            type="button"
            onClick={() => selectAccountMode('super')}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'super'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Super Admin</span>
          </button>
        </div>

        {/* Portal Mode Info Box */}
        <div className={`p-3 rounded-xl border text-xs ${
          selectedRole === 'client'
            ? 'bg-primary-container/10 border-primary-container/30 text-cyan-300'
            : 'bg-amber-400/10 border-amber-400/30 text-amber-300'
        }`}>
          <div className="font-bold flex items-center gap-1.5 mb-0.5">
            {selectedRole === 'client' ? <Building className="w-4 h-4 text-cyan-400" /> : <Terminal className="w-4 h-4 text-amber-400" />}
            <span>{selectedRole === 'client' ? 'Client Operations Portal' : 'Super Admin Developer Portal'}</span>
          </div>
          <p className="text-[11px] text-on-surface-variant">
            {selectedRole === 'client'
              ? 'Access to Dashboard, Trial Bookings (Leads), Contact Enquiries, and Media Library.'
              : 'Full control over Website CMS, SEO, Global Settings, Database Backup, and Developer System Diagnostics.'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-on-surface-variant block mb-1">
              LOGIN EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-outline absolute left-3 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface-container-high text-on-surface pl-10 pr-4 py-3 rounded-lg border border-outline-variant/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface-variant block mb-1">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-outline absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-surface-container-high text-on-surface pl-10 pr-4 py-3 rounded-lg border border-outline-variant/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-lg font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
              selectedRole === 'super'
                ? 'bg-amber-400 text-black shadow-lg hover:bg-amber-300'
                : 'bg-primary-container text-on-primary-container shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]'
            }`}
          >
            {loading ? 'Authenticating...' : (
              <>
                <span>Sign In To {selectedRole === 'super' ? 'Super Admin' : 'Client Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-outline-variant/20 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-primary font-semibold">
            <ShieldCheck className="w-4 h-4 text-primary-container" />
            <span>256-Bit Encrypted Role Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
