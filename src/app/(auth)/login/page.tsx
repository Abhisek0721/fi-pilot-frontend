'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth.store';
import apiClient from '@/lib/api/client';

type Step = 'login' | 'forgot' | 'forgot_sent';

// ── Primitives ────────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 13.251 17.64 10.943 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" style={{ animation: 'spin 0.7s linear infinite', flexShrink: 0 }} aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
      {children}
    </label>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8 }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7" stroke="#EF4444" strokeWidth="1.5"/>
        <path d="M8 5v3M8 11h.01" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span style={{ fontSize: 13, color: '#DC2626', fontWeight: 500 }}>{msg}</span>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>or</span>
      <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { setOrganization } = useAuthStore();

  const [step, setStep] = useState<Step>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function clrErr() { setErr(''); }

  useEffect(() => {
    if (searchParams.get('error')) setErr('Google sign-in failed. Please try again.');
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    clrErr();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      try {
        const res = await apiClient.post('/auth/sync');
        const user = res.data.data ?? res.data;
        if (user?.organizationMembers?.[0]?.organization) setOrganization(user.organizationMembers[0].organization);
      } catch { /* handled on dashboard */ }
      router.push(searchParams.get('redirectTo') || '/app/dashboard');
    } catch (e: unknown) {
      setErr((e as Error).message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    clrErr();
    try {
      const cb = new URL('/auth/callback', window.location.origin);
      const next = searchParams.get('redirectTo');
      if (next) cb.searchParams.set('next', next);
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: cb.toString() } });
      if (error) throw error;
    } catch (e: unknown) {
      setErr((e as Error).message || 'Google sign-in failed');
      setGoogleLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    clrErr();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      if (error) throw error;
      setStep('forgot_sent');
    } catch (e: unknown) {
      setErr((e as Error).message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  }

  // ── Step: reset sent ──────────────────────────────────────────────
  if (step === 'forgot_sent') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" stroke="#2563EB" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Check your inbox.</h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0, lineHeight: 1.6 }}>
          Reset link sent to <strong style={{ color: '#0F172A' }}>{email}</strong>.
        </p>
      </div>
      <button type="button" onClick={() => { setStep('login'); clrErr(); }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#2563EB', fontSize: 14, fontWeight: 600, padding: 0, fontFamily: 'inherit' }}>
        <ArrowLeft size={14} /> Back to sign in
      </button>
    </div>
  );

  // ── Step: forgot email ────────────────────────────────────────────
  if (step === 'forgot') return (
    <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <button type="button" onClick={() => { setStep('login'); clrErr(); }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 13, fontWeight: 500, padding: '0 0 20px', fontFamily: 'inherit' }}>
          <ArrowLeft size={13} /> Sign in
        </button>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', margin: '0 0 6px', letterSpacing: '-0.5px' }}>Forgot password?</h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Enter your email and we&apos;ll send a reset link.</p>
      </div>
      <div>
        <FieldLabel htmlFor="fr-email">Email address</FieldLabel>
        <input id="fr-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus autoComplete="email" className={`auth-input${err ? ' error' : ''}`} />
      </div>
      {err && <ErrorMsg msg={err} />}
      <button type="submit" disabled={loading} className="auth-primary-btn">
        {loading && <Spinner />} Send reset link
      </button>
    </form>
  );

  // ── Step: sign in ─────────────────────────────────────────────────
  return (
    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0F172A', margin: '0 0 6px', letterSpacing: '-0.5px' }}>Welcome back.</h1>
        <p style={{ fontSize: 14, color: '#94A3B8', margin: 0 }}>Sign in to your account.</p>
      </div>

      <button type="button" onClick={handleGoogle} disabled={googleLoading || loading} className="auth-social-btn">
        <GoogleIcon />
        {googleLoading ? 'Redirecting…' : 'Continue with Google'}
      </button>

      <Divider />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" className="auth-input" />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <button type="button" onClick={() => { setStep('forgot'); clrErr(); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563EB', fontSize: 12.5, fontWeight: 500, padding: 0, fontFamily: 'inherit' }}>
              Forgot password?
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <input id="password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" className="auth-input" style={{ paddingRight: 44 }} />
            <button type="button" onClick={() => setShowPw(v => !v)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0, display: 'flex', fontFamily: 'inherit' }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      {err && <ErrorMsg msg={err} />}

      <button type="submit" disabled={loading || googleLoading} className="auth-primary-btn">
        {loading && <Spinner />} Sign in
      </button>

      <p style={{ textAlign: 'center', fontSize: 13, color: '#94A3B8', margin: 0 }}>
        No account?{' '}
        <Link href="/signup" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Create one →</Link>
      </p>
    </form>
  );
}
