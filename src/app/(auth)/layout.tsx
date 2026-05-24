'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import envConstant from '@/constants/envConstant';

const brand = envConstant.NEXT_PUBLIC_BRAND_NAME;

const MOCK_ROWS = [
  { label: 'Revenue',   value: '₹8.4L',   change: '+18%', color: '#4ADE80' },
  { label: 'Expenses',  value: '₹6.1L',   change: '+34%', color: '#F87171' },
  { label: 'Net profit',value: '₹1.2L',   change: '−8%',  color: '#F87171' },
  { label: 'GST payable',value:'₹48,200', change: null,   color: null      },
];

const STATS = [
  { value: '100%', label: 'double-entry accuracy' },
  { value: 'AI',   label: 'categorization engine' },
  { value: 'GST',  label: 'ready for India' },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', display: 'flex', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── LEFT: form panel ── */}
      <div
        className="relative z-10 flex w-full flex-col justify-center px-6 py-12 lg:w-1/2"
        style={{ minHeight: '100vh' }}
      >
        <div style={{ maxWidth: 440, margin: '0 auto', width: '100%' }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 40 }}>
            <span style={{
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: '-0.5px',
              background: '#2563EB',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {brand}
            </span>
          </Link>

          {/* Animated form area */}
          <div style={{ overflow: 'hidden' }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -24, filter: 'blur(8px)' }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* ── RIGHT: dark showcase panel ── */}
      <div
        className="relative hidden overflow-hidden lg:flex lg:w-1/2 flex-col"
        style={{ background: 'linear-gradient(160deg, #0f0e1e 0%, #0a0918 50%, #060610 100%)' }}
      >
        {/* Glow blobs */}
        <div className="pointer-events-none absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 50% at 55% 40%, rgba(37,99,235,0.18) 0%, transparent 100%)',
        }} />
        <div className="pointer-events-none absolute" style={{
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29,78,216,0.10) 0%, transparent 70%)',
          top: '10%', right: '-40px',
        }} />

        {/* ── Zone 1: Headline ── */}
        <div style={{ padding: '52px 52px 0', position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
            color: '#A5B4FC',
            backgroundColor: 'rgba(99,102,241,0.14)',
            border: '1px solid rgba(99,102,241,0.28)',
            padding: '5px 13px', borderRadius: 100,
            marginBottom: 22,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#818CF8', display: 'inline-block' }} className="animate-pulse-dot" />
            AI Accounting Engine
          </div>

          <h2 style={{
            fontSize: 34, fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.8px',
            color: '#FFFFFF', margin: '0 0 12px',
          }}>
            Upload documents.<br />
            <span style={{
              background: 'linear-gradient(90deg, #818CF8, #C084FC)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              AI handles the rest.
            </span>
          </h2>

          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.35)', fontWeight: 400, margin: 0 }}>
            Bank statements, invoices, bills → clean books → GST reports.
          </p>
        </div>

        {/* ── Zone 2: Product mockup ── */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '40px 52px', position: 'relative', zIndex: 10 }}>
          <div style={{ position: 'relative', width: '100%' }}>

            {/* Floating top chip */}
            <div className="animate-float-2" style={{
              position: 'absolute', top: -22, left: 0, zIndex: 20,
              backgroundColor: 'rgba(6,5,20,0.92)',
              borderRadius: 12, padding: '9px 14px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(16px)',
              display: 'flex', alignItems: 'center', gap: 9, whiteSpace: 'nowrap',
            }}>
              <div className="animate-pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#4ADE80', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.3 }}>Processing documents</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>12 transactions categorized</div>
              </div>
            </div>

            {/* Browser frame */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden',
              boxShadow: '0 24px 72px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}>
              {/* Chrome bar */}
              <div style={{
                padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', gap: 8,
                backgroundColor: 'rgba(0,0,0,0.3)',
              }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['#FF5F57','#FEBC2E','#28C840'].map(c => (
                    <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c }} />
                  ))}
                </div>
                <div style={{
                  flex: 1, backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 5, padding: '3px 10px',
                  fontSize: 11, color: 'rgba(255,255,255,0.25)',
                  fontWeight: 500, border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  app.{brand.toLowerCase().replace(' ', '')}.in/reports
                </div>
              </div>

              {/* Table header */}
              <div style={{
                padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>P&amp;L — May 2025</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
                  backgroundColor: 'rgba(99,102,241,0.2)', color: '#A5B4FC',
                }}>
                  Double-entry
                </span>
              </div>

              {/* Rows */}
              {MOCK_ROWS.map((row, i) => (
                <div key={row.label} style={{
                  padding: '11px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderBottom: i < MOCK_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>{row.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{row.value}</span>
                    {row.change && (
                      <span style={{
                        fontSize: 11, fontWeight: 600, color: row.color ?? undefined,
                        background: row.color === '#4ADE80' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                        padding: '2px 6px', borderRadius: 4,
                      }}>
                        {row.change}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* AI insight row */}
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'flex-start', gap: 10,
                background: 'rgba(99,102,241,0.06)',
              }}>
                <span style={{ fontSize: 14, lineHeight: 1, marginTop: 1 }}>✦</span>
                <p style={{ margin: 0, fontSize: 11.5, color: 'rgba(199,210,254,0.75)', lineHeight: 1.6, fontStyle: 'italic' }}>
                  "Revenue up 18% but profit down — ad spend grew 34%. Review vendor payments."
                </p>
              </div>
            </div>

            {/* Floating bottom chip */}
            <div className="animate-float" style={{
              position: 'absolute', bottom: -22, right: 0, zIndex: 20,
              backgroundColor: 'rgba(6,5,20,0.92)',
              borderRadius: 14, padding: '11px 16px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(16px)',
              textAlign: 'center', minWidth: 110,
            }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>GST this month</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#818CF8', lineHeight: 1 }}>₹48.2K</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#4ADE80', marginTop: 4 }}>↓ ₹6K input credit</div>
            </div>

          </div>
        </div>

        {/* ── Zone 3: Stats ── */}
        <div style={{
          padding: '20px 52px 48px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          position: 'relative', zIndex: 10,
          display: 'flex', gap: 0,
        }}>
          {STATS.map((s, i) => (
            <div key={s.value} style={{
              flex: 1,
              paddingLeft: i > 0 ? 28 : 0,
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              marginLeft: i > 0 ? 28 : 0,
            }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 5, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Edge vignette */}
        <div className="pointer-events-none absolute inset-0" style={{
          boxShadow: 'inset 60px 0 80px rgba(0,0,0,0.2), inset 0 0 120px rgba(0,0,0,0.15)',
        }} />
      </div>

    </div>
  );
}
