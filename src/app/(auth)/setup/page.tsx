'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { organizationsApi } from '@/lib/api/organizations';
import { useAuthStore } from '@/store/auth.store';
import apiClient from '@/lib/api/client';
import { countries } from 'countries-list';
import { ChevronDown, Search } from 'lucide-react';

// ── Data ────────────────────────────────────────────────────────────────────

const COUNTRY_LIST = Object.entries(countries)
  .map(([code, c]) => ({ code, name: c.name, currency: c.currency[0] ?? '' }))
  .sort((a, b) => a.name.localeCompare(b.name));

const displayNames = new Intl.DisplayNames(['en'], { type: 'currency' });
const CURRENCY_LIST: { code: string; name: string }[] = (() => {
  try {
    return (Intl as any).supportedValuesOf('currency')
      .map((code: string) => {
        try { return { code, name: displayNames.of(code) ?? code }; }
        catch { return { code, name: code }; }
      })
      .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
  } catch {
    // Fallback for environments without supportedValuesOf
    const fallback = ['AED','AFN','ALL','AMD','ANG','AOA','ARS','AUD','AWG','AZN','BAM','BBD','BDT','BGN','BHD','BIF','BMD','BND','BOB','BRL','BSD','BTN','BWP','BYR','BZD','CAD','CDF','CHF','CLP','CNY','COP','CRC','CUP','CVE','CZK','DJF','DKK','DOP','DZD','EGP','ERN','ETB','EUR','FJD','GBP','GEL','GHS','GMD','GTQ','GYD','HKD','HNL','HRK','HTG','HUF','IDR','ILS','INR','IQD','IRR','ISK','JMD','JOD','JPY','KES','KGS','KHR','KMF','KRW','KWD','KYD','KZT','LAK','LBP','LKR','LRD','LSL','LYD','MAD','MDL','MGA','MKD','MMK','MNT','MOP','MRO','MUR','MVR','MWK','MXN','MYR','MZN','NAD','NGN','NIO','NOK','NPR','NZD','OMR','PAB','PEN','PGK','PHP','PKR','PLN','PYG','QAR','RON','RSD','RUB','RWF','SAR','SBD','SCR','SDG','SEK','SGD','SHP','SLL','SOS','SRD','STD','SVC','SYP','SZL','THB','TJS','TMT','TND','TOP','TRY','TTD','TWD','TZS','UAH','UGX','USD','UYU','UZS','VEF','VND','VUV','WST','XAF','XCD','XOF','XPF','YER','ZAR','ZMW','ZWL'];
    return fallback.map(code => {
      try { return { code, name: displayNames.of(code) ?? code }; }
      catch { return { code, name: code }; }
    }).sort((a, b) => a.name.localeCompare(b.name));
  }
})();

// ── Components ───────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 0.7s linear infinite', flexShrink: 0 }} aria-hidden>
      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

interface SearchDropProps {
  label: string;
  hint?: string;
  selected: string;
  displayValue: string;
  options: { code: string; name: string; sub?: string }[];
  onSelect: (code: string) => void;
  placeholder?: string;
}

function SearchDrop({ label, hint, selected, displayValue, options, onSelect, placeholder = 'Search…' }: SearchDropProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false); setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return q ? options.filter(o => o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q)) : options;
  }, [query, options]);

  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: 6 }}>
        {label}
        {hint && <span style={{ fontWeight: 400, color: '#94A3B8', marginLeft: 6 }}>{hint}</span>}
      </label>
      <div ref={ref} style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="auth-input"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left', width: '100%' }}
        >
          <span style={{ fontWeight: 500 }}>{displayValue || `Select ${label.toLowerCase()}`}</span>
          <ChevronDown size={15} style={{ color: '#94A3B8', flexShrink: 0, transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none' }} />
        </button>

        {open && (
          <div className="setup-country-drop" style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
            background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.14)', marginTop: 4, overflow: 'hidden',
          }}>
            <div style={{ padding: '10px 12px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Search size={14} style={{ color: '#94A3B8', flexShrink: 0 }} />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={placeholder}
                style={{ border: 'none', outline: 'none', fontSize: 13, color: '#0F172A', background: 'transparent', width: '100%', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ maxHeight: 220, overflowY: 'auto' }}>
              {filtered.length === 0
                ? <div style={{ padding: '12px 16px', fontSize: 13, color: '#94A3B8' }}>No results</div>
                : filtered.map(opt => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => { onSelect(opt.code); setOpen(false); setQuery(''); }}
                    className={`country-opt${opt.code === selected ? ' country-opt-active' : ''}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                      width: '100%', padding: '9px 16px', border: 'none',
                      background: opt.code === selected ? '#EFF6FF' : 'transparent',
                      cursor: 'pointer', fontSize: 13, color: '#0F172A', fontFamily: 'inherit', textAlign: 'left',
                    }}
                    onMouseEnter={e => { if (opt.code !== selected) (e.currentTarget as HTMLButtonElement).style.background = '#F8FAFC'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = opt.code === selected ? '#EFF6FF' : 'transparent'; }}
                  >
                    <span style={{ flex: 1 }}>{opt.name}</span>
                    {opt.sub && <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, flexShrink: 0 }}>{opt.sub}</span>}
                    <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, flexShrink: 0 }}>{opt.code}</span>
                  </button>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setOrganization, setUser } = useAuthStore();

  const [orgName, setOrgName] = useState('');
  const [countryCode, setCountryCode] = useState('IN');
  const [currency, setCurrency] = useState('INR');
  const [accountingMethod, setAccountingMethod] = useState<'CASH' | 'ACCRUAL'>('CASH');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [syncErr, setSyncErr] = useState(false);
  const [syncAttempt, setSyncAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiClient.post('/auth/sync');
        if (cancelled) return;
        const user = res.data.data ?? res.data;
        if (user) setUser(user);
        if (user?.organizationMembers?.length > 0) {
          document.cookie = 'has_org=true; path=/; max-age=31536000; SameSite=Lax';
          setOrganization(user.organizationMembers[0].organization);
          router.replace(searchParams.get('next') || '/app/dashboard');
          return;
        }
      } catch {
        if (!cancelled) setSyncErr(true);
      }
      if (!cancelled) setChecking(false);
    })();
    return () => { cancelled = true; };
  }, [syncAttempt]);

  const countryOptions = useMemo(() =>
    COUNTRY_LIST.map(c => ({ code: c.code, name: c.name, sub: c.currency })),
    []
  );

  const currencyOptions = useMemo(() =>
    CURRENCY_LIST.map(c => ({ code: c.code, name: c.name })),
    []
  );

  const handleCountrySelect = (code: string) => {
    setCountryCode(code);
    const found = COUNTRY_LIST.find(c => c.code === code);
    if (found?.currency) setCurrency(found.currency);
  };

  const selectedCountryName = COUNTRY_LIST.find(c => c.code === countryCode)?.name ?? '';
  const selectedCurrencyName = CURRENCY_LIST.find(c => c.code === currency);
  const currencyDisplay = selectedCurrencyName ? `${currency} — ${selectedCurrencyName.name}` : currency;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (orgName.trim().length < 2) { setErr('Organization name must be at least 2 characters'); return; }
    if (!currency) { setErr('Please select a currency'); return; }
    setLoading(true);
    try {
      const org = await organizationsApi.create({
        name: orgName.trim(),
        country: countryCode,
        currency,
        accountingMethod,
      });
      document.cookie = 'has_org=true; path=/; max-age=31536000; SameSite=Lax';
      setOrganization(org);
      router.push(searchParams.get('next') || '/app/dashboard');
    } catch {
      setErr('Failed to create organization. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div style={{ textAlign: 'center', color: '#64748B', fontSize: 14, padding: '40px 0' }}>
        Setting up your account…
      </div>
    );
  }

  if (syncErr) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <p style={{ fontSize: 14, color: '#EF4444', fontWeight: 500, margin: 0 }}>
          Could not connect to the server. Please check your connection and try again.
        </p>
        <button
          type="button"
          className="auth-primary-btn"
          style={{ width: 'auto', padding: '11px 28px' }}
          onClick={() => { setSyncErr(false); setChecking(true); setSyncAttempt(n => n + 1); }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
          One last step.
        </h1>
        <p style={{ fontSize: 15, color: '#64748B', margin: 0, fontWeight: 500 }}>
          Tell us about your business.
        </p>
      </div>

      {/* Organization name */}
      <div>
        <label htmlFor="orgName" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: 6 }}>
          Organization name
        </label>
        <input
          id="orgName"
          type="text"
          value={orgName}
          onChange={e => setOrgName(e.target.value)}
          placeholder="Acme Pvt Ltd"
          required
          autoFocus
          autoComplete="organization"
          className="auth-input"
        />
      </div>

      {/* Country */}
      <SearchDrop
        label="Country"
        selected={countryCode}
        displayValue={selectedCountryName}
        options={countryOptions}
        onSelect={handleCountrySelect}
        placeholder="Search country…"
      />

      {/* Currency */}
      <SearchDrop
        label="Currency"
        hint="auto-filled from country"
        selected={currency}
        displayValue={currencyDisplay}
        options={currencyOptions}
        onSelect={setCurrency}
        placeholder="Search currency…"
      />

      {/* Accounting method */}
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: 6 }}>
          Accounting method
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {(['CASH', 'ACCRUAL'] as const).map(method => (
            <button
              key={method}
              type="button"
              onClick={() => setAccountingMethod(method)}
              className={accountingMethod === method ? 'setup-accounting-btn-active' : 'setup-accounting-btn'}
              style={{
                padding: '11px 14px', borderRadius: 12,
                border: `1.5px solid ${accountingMethod === method ? '#2563EB' : '#E5E7EB'}`,
                background: accountingMethod === method ? '#EFF6FF' : '#F8FAFC',
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: accountingMethod === method ? '#1D4ED8' : '#374151' }}>
                {method === 'CASH' ? 'Cash Basis' : 'Accrual Basis'}
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                {method === 'CASH' ? 'Record when money moves' : 'Record when earned/owed'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {err && <p style={{ fontSize: 13, color: '#EF4444', margin: 0, fontWeight: 500 }}>{err}</p>}

      <button type="submit" disabled={loading} className="auth-primary-btn">
        {loading && <Spinner />}
        Continue to dashboard →
      </button>
    </form>
  );
}
