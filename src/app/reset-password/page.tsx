'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import envConstant from '@/constants/envConstant';

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 0.7s linear infinite', flexShrink: 0 }} aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

const CARD: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: '48px 40px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
};

const H1: React.CSSProperties = { fontSize: 28, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' };
const SUB: React.CSSProperties = { fontSize: 14, color: '#64748B', margin: '6px 0 0', lineHeight: 1.6 };
const LABEL: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 };

function LockIcon() {
  return (
    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="11" rx="2" stroke="#2563EB" strokeWidth="1.75"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#2563EB" strokeWidth="1.75" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function SuccessIcon() {
  return (
    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function ResetPasswordInner() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  if (done) return (
    <div style={CARD}>
      <SuccessIcon />
      <h1 style={H1}>Password updated!</h1>
      <p style={SUB}>Taking you to the dashboard…</p>
    </div>
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (password.length < 6) { setErr('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setErr('Passwords do not match'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => router.replace('/app/dashboard'), 1500);
    } catch (e: unknown) {
      setErr((e as Error).message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ ...CARD, alignItems: 'stretch' }}>
      <div>
        <LockIcon />
        <h1 style={H1}>Choose a new password.</h1>
        <p style={SUB}>Must be at least 6 characters.</p>
      </div>

      <div>
        <label style={LABEL}>New password</label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
            autoFocus
            autoComplete="new-password"
            className="auth-input"
            style={{ paddingRight: 48 }}
          />
          <button type="button" onClick={() => setShowPw(v => !v)}
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0, display: 'flex' }}>
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div>
        <label style={LABEL}>Confirm password</label>
        <input
          type={showPw ? 'text' : 'password'}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Same password again"
          required
          autoComplete="new-password"
          className={`auth-input${err.includes('match') ? ' error' : ''}`}
        />
      </div>

      {err && <p style={{ fontSize: 13, color: '#EF4444', margin: 0, fontWeight: 500 }}>{err}</p>}

      <button type="submit" disabled={loading} className="auth-primary-btn">
        {loading && <Spinner />}
        Set new password →
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <Suspense>
          <ResetPasswordInner />
        </Suspense>
      </div>
    </div>
  );
}
