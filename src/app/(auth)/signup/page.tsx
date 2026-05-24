'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth.store';
import { organizationsApi } from '@/lib/api/organizations';
import apiClient from '@/lib/api/client';

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

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const { setOrganization } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [country, setCountry] = useState('India');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (password.length < 6) { setErr('Password must be at least 6 characters'); return; }
    if (orgName.trim().length < 2) { setErr('Organization name is required'); return; }
    setLoading(true);
    try {
      const { error: signUpErr } = await supabase.auth.signUp({ email, password });
      if (signUpErr) throw signUpErr;
      await apiClient.post('/auth/sync');
      const org = await organizationsApi.create({
        name: orgName.trim(),
        country: country.trim() || 'India',
        currency: 'INR',
        accountingMethod: 'CASH',
      });
      setOrganization(org);
      router.push('/app/dashboard');
    } catch (e: unknown) {
      setErr((e as Error).message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    setErr('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (e: unknown) {
      setErr((e as Error).message || 'Google sign-in failed');
      setGoogleLoading(false);
    }
  }

  return (
    <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0F172A', margin: '0 0 6px', letterSpacing: '-0.5px' }}>Get started free.</h1>
        <p style={{ fontSize: 14, color: '#94A3B8', margin: 0 }}>Create your organization — no credit card needed.</p>
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
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div style={{ position: 'relative' }}>
            <input id="password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required autoComplete="new-password" className="auth-input" style={{ paddingRight: 44 }} />
            <button type="button" onClick={() => setShowPw(v => !v)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0, display: 'flex', fontFamily: 'inherit' }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <FieldLabel htmlFor="orgName">Organization</FieldLabel>
            <input id="orgName" type="text" value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Acme Pvt Ltd" required autoComplete="organization" className="auth-input" />
          </div>
          <div>
            <FieldLabel htmlFor="country">Country</FieldLabel>
            <input id="country" type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="India" required className="auth-input" />
          </div>
        </div>
      </div>

      {err && <ErrorMsg msg={err} />}

      <button type="submit" disabled={loading || googleLoading} className="auth-primary-btn">
        {loading && <Spinner />} Create account
      </button>

      <p style={{ textAlign: 'center', fontSize: 13, color: '#94A3B8', margin: 0 }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
      </p>
    </form>
  );
}
