import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2, KeyRound, Lock, Mail, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../services/api';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialToken = searchParams.get('reset_token') || '';

  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>(initialToken ? 'reset' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      setNotice(
        res.dev_reset_token
          ? `${res.message} (Dev token: ${res.dev_reset_token})`
          : res.message
      );
      if (res.dev_reset_token) {
        setResetToken(res.dev_reset_token);
        setMode('reset');
      }
    } catch {
      setError('Unable to initiate password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const res = await authApi.resetPassword(resetToken, newPassword);
      setNotice(res.message);
      setMode('login');
      setPassword('');
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail || 'Invalid or expired reset token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-obsidian px-5 py-12">
      <div className="pointer-events-none absolute inset-0 bg-ambient-grid opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-slateMuted hover:text-gold-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolio
        </Link>

        <div className="glass-panel-gold rounded-3xl p-8 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/40 bg-obsidian text-gold-light shadow-goldGlow">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-ivory">Admin Console</h1>
              <p className="text-xs text-slateMuted">Onkar Bhalane Portfolio CMS</p>
            </div>
          </div>

          {error && (
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {notice && (
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="break-all">{notice}</span>
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slateMuted">Admin Email</label>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@domain.com"
                    className="w-full rounded-xl border border-white/10 bg-obsidian/80 py-3 pl-10 pr-4 text-sm text-ivory outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slateMuted">Password</label>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-white/10 bg-obsidian/80 py-3 pl-10 pr-4 text-sm text-ivory outline-none focus:border-gold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-light py-3 text-sm font-semibold text-obsidian shadow-goldGlow transition-opacity disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign In to Dashboard'}
              </button>

              <div className="flex justify-between pt-2 text-xs text-slateMuted">
                <button type="button" onClick={() => setMode('forgot')} className="hover:text-gold-light">
                  Forgot password?
                </button>
                <button type="button" onClick={() => setMode('reset')} className="hover:text-gold-light">
                  Have a reset token?
                </button>
              </div>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="mt-6 space-y-4">
              <p className="text-xs text-slateMuted">
                Enter your administrator email to generate a secure password reset token.
              </p>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slateMuted">Admin Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gold py-3 text-sm font-semibold text-obsidian"
              >
                {loading ? 'Sending...' : 'Request Reset Link'}
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-center text-xs text-slateMuted hover:text-ivory"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={handleReset} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slateMuted">Reset Token</label>
                <div className="relative mt-1.5">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slateMuted" />
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-obsidian/80 py-3 pl-10 pr-4 text-sm text-ivory outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slateMuted">New Password (8+ chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gold py-3 text-sm font-semibold text-obsidian"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-center text-xs text-slateMuted hover:text-ivory"
              >
                Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
