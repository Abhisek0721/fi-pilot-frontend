import Link from 'next/link';
import envConstant from '@/constants/envConstant';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import {
  TrendingUp,
  Sparkles,
  FileText,
  BarChart3,
  GitMerge,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Shield,
  Upload,
  ClipboardList,
  Zap,
  Star,
} from 'lucide-react';

const brand = envConstant.NEXT_PUBLIC_BRAND_NAME;

const features = [
  {
    icon: Upload, color: '#2563EB', bg: 'rgba(37,99,235,0.08)',
    title: 'Upload any document',
    description: 'Bank statements, invoices, bills, receipts — CSV, XLSX, or PDF. Every field extracted: amounts, GST numbers, vendor details, line items.',
  },
  {
    icon: Sparkles, color: '#7C3AED', bg: 'rgba(124,58,237,0.08)',
    title: 'AI categorizes every entry',
    description: "Each transaction gets a category, confidence score, and reason. Anything uncertain goes to a review queue — you approve, the AI doesn't guess.",
  },
  {
    icon: GitMerge, color: '#0891B2', bg: 'rgba(8,145,178,0.08)',
    title: 'Automatic reconciliation',
    description: 'Invoices matched to bank credits. Bills matched to bank debits. Refunds matched to originals. Unmatched items flagged immediately.',
  },
  {
    icon: BarChart3, color: '#059669', bg: 'rgba(5,150,105,0.08)',
    title: 'Real reports, not estimates',
    description: 'P&L, Balance Sheet, Cash Flow, Trial Balance, GST summary — all from a real double-entry engine. Every figure from your actual data.',
  },
  {
    icon: MessageSquare, color: '#D97706', bg: 'rgba(217,119,6,0.08)',
    title: 'Ask anything about your books',
    description: '"What was my profit last month?" "Who owes me money?" "How much GST do I owe?" The AI runs real SQL on your data and gives specific answers.',
  },
  {
    icon: ClipboardList, color: '#DC2626', bg: 'rgba(220,38,38,0.08)',
    title: 'Review queue for CAs',
    description: 'Low-confidence categorizations, missing documents, unmatched transactions — one checklist. CAs get structured review, not a pile of questions.',
  },
];

const insights = [
  { icon: '📈', text: '"Revenue is up 18% this month, but net profit is down because ad spend and vendor payments grew 34%. Review your top 3 vendors."' },
  { icon: '⚠️', text: '"₹3.2L in expected payments is incoming, but ₹4.1L is due in outgoing. You may face a shortfall if 4 overdue invoices are not collected."' },
  { icon: '🧾', text: '"₹2.75L is overdue from 4 clients. Client A has delayed 3 of the last 5 invoices with an average delay of 18 days."' },
  { icon: '💰', text: '"Estimated GST payable this month is ₹48,200 after adjusting input credit from uploaded purchase bills."' },
];

const steps = [
  { n: '01', title: 'Upload your documents', description: 'Bank statements, bills, invoices, receipts. CSV, XLSX, or PDF. Fields are extracted automatically.' },
  { n: '02', title: 'AI builds your books', description: 'Transactions are categorized, reconciled, and posted to a double-entry engine. Review queue catches anything uncertain.' },
  { n: '03', title: 'Get insight, not just reports', description: 'Live P&L, cash flow status, GST estimates, overdue receivables, and an AI assistant for specific answers.' },
];

const testimonials = [
  {
    quote: 'We upload bank statements and invoices, and reconciliation is done automatically. The GST estimates save my accountant significant time every month.',
    name: 'Anjali Mehta',
    role: 'Director, Mehta Trading Co.',
    initials: 'AM',
    color: '#2563EB',
  },
  {
    quote: 'The review queue changes how I work. I see exactly what needs attention — low-confidence entries, missing invoices, unmatched payments. Structured and clean.',
    name: 'CA Vikram Sharma',
    role: 'SVS & Associates',
    initials: 'VS',
    color: '#7C3AED',
  },
  {
    quote: "I finally understand my own finances. I ask 'what's my net profit this month?' and get a specific answer with a breakdown — not a spreadsheet.",
    name: 'Ravi Kumar',
    role: 'Founder, Orbit Digital',
    initials: 'RK',
    color: '#059669',
  },
];

function DashboardMockup({ brandName }: { brandName: string }) {
  return (
    <div style={{
      borderRadius: 16, border: '1px solid #E2E8F0',
      boxShadow: '0 24px 64px rgba(37,99,235,0.10), 0 4px 16px rgba(0,0,0,0.06)',
      overflow: 'hidden', backgroundColor: '#FFFFFF',
    }}>
      <div style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
            <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: c }} />
          ))}
        </div>
        <div style={{ flex: 1, backgroundColor: '#EFF3F8', borderRadius: 5, padding: '3px 10px', fontSize: 11, color: '#94A3B8', maxWidth: 220, fontWeight: 500 }}>
          app.{brandName.toLowerCase().replace(/ /g, '')}.in/dashboard
        </div>
      </div>
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Dashboard</div>
            <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 1 }}>May 2025 · Live</div>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100, backgroundColor: 'rgba(37,99,235,0.07)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.18)' }}>
            Double-entry ✓
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'Revenue', value: '₹8.4L', change: '+18%', up: true },
            { label: 'Expenses', value: '₹6.1L', change: '+34%', up: false },
            { label: 'Net Profit', value: '₹1.2L', change: '−8%', up: false },
            { label: 'GST Due', value: '₹48.2K', change: null, up: null },
          ].map(kpi => (
            <div key={kpi.label} style={{ padding: '11px 12px', borderRadius: 8, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 9.5, color: '#94A3B8', marginBottom: 5, fontWeight: 500 }}>{kpi.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{kpi.value}</div>
              {kpi.change && <div style={{ fontSize: 10, fontWeight: 600, marginTop: 4, color: kpi.up ? '#059669' : '#DC2626' }}>{kpi.change} vs last month</div>}
            </div>
          ))}
        </div>
        <div style={{ height: 68, borderRadius: 8, overflow: 'hidden', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', marginBottom: 12, position: 'relative' }}>
          <svg width="100%" height="68" viewBox="0 0 400 68" preserveAspectRatio="none">
            <defs>
              <linearGradient id="blRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" /><stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="blExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.12" /><stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,55 C50,50 100,45 150,40 C200,35 250,28 300,22 C350,16 375,13 400,11 L400,68 L0,68 Z" fill="url(#blRev)" />
            <path d="M0,55 C50,50 100,45 150,40 C200,35 250,28 300,22 C350,16 375,13 400,11" fill="none" stroke="#2563EB" strokeWidth="1.5" />
            <path d="M0,58 C50,55 100,57 150,52 C200,47 250,50 300,45 C350,40 375,42 400,38 L400,68 L0,68 Z" fill="url(#blExp)" />
            <path d="M0,58 C50,55 100,57 150,52 C200,47 250,50 300,45 C350,40 375,42 400,38" fill="none" stroke="#EF4444" strokeWidth="1.5" />
          </svg>
          <div style={{ position: 'absolute', top: 6, right: 8, display: 'flex', gap: 10 }}>
            <span style={{ fontSize: 9.5, fontWeight: 600, color: '#2563EB' }}>● Revenue</span>
            <span style={{ fontSize: 9.5, fontWeight: 600, color: '#EF4444' }}>● Expenses</span>
          </div>
        </div>
        <div style={{ padding: '10px 12px', borderRadius: 8, backgroundColor: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ fontSize: 12, flexShrink: 0, marginTop: 1 }}>✦</span>
          <p style={{ margin: 0, fontSize: 10.5, color: '#1D4ED8', lineHeight: 1.6, fontStyle: 'italic' }}>
            &quot;Revenue up 18% but profit down — ad spend grew 34%. Review top 3 vendors before month-end.&quot;
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="lp-page" style={{ minHeight: '100vh', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', backgroundColor: 'var(--lp-bg)', color: 'var(--lp-text)' }}>
      <style>{`
        .lp-page {
          --lp-bg: #FFFFFF;
          --lp-bg-alt: #F8FAFC;
          --lp-bg-nav: rgba(255,255,255,0.94);
          --lp-nav-border: #F1F5F9;
          --lp-text: #0F172A;
          --lp-text-sub: #374151;
          --lp-muted: #64748B;
          --lp-dim: #94A3B8;
          --lp-dimmer: #CBD5E1;
          --lp-border: #E2E8F0;
          --lp-card: #FFFFFF;
          --lp-card-alt: #F8FAFC;
          --lp-problem-bg: #FEF2F2;
          --lp-problem-border: #FECACA;
          --lp-steps-num: #DBEAFE;
          --lp-chip-bg: #FFFFFF;
          --lp-section-border: #F1F5F9;
        }
        html.dark .lp-page {
          --lp-bg: #0B1120;
          --lp-bg-alt: #111827;
          --lp-bg-nav: rgba(11,17,32,0.97);
          --lp-nav-border: #1F2937;
          --lp-text: #F1F5F9;
          --lp-text-sub: #CBD5E1;
          --lp-muted: #9CA3AF;
          --lp-dim: #6B7280;
          --lp-dimmer: #4B5563;
          --lp-border: #1F2937;
          --lp-card: #111827;
          --lp-card-alt: #0B1120;
          --lp-problem-bg: #1F0F0F;
          --lp-problem-border: #7F1D1D;
          --lp-steps-num: #1E3A5F;
          --lp-chip-bg: #111827;
          --lp-section-border: #1F2937;
        }
        .lp-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .lp-feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .lp-problem-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .lp-insight-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .lp-steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; text-align: center; }
        .lp-persona-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .lp-testimonial-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 900px) {
          .lp-hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .lp-feature-grid { grid-template-columns: 1fr 1fr; }
          .lp-problem-grid { grid-template-columns: 1fr; }
          .lp-insight-grid { grid-template-columns: 1fr; }
          .lp-steps-grid { grid-template-columns: 1fr; gap: 24px; }
          .lp-persona-grid { grid-template-columns: 1fr; }
          .lp-testimonial-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .lp-feature-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: 'var(--lp-bg-nav)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--lp-nav-border)',
        height: 64, display: 'flex', alignItems: 'center',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 28px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={14} color="white" />
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.3px', color: 'var(--lp-text)' }}>{brand}</span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <a href="#features" style={{ fontSize: 14, fontWeight: 500, color: 'var(--lp-muted)', textDecoration: 'none' }}>Features</a>
            <a href="#how-it-works" style={{ fontSize: 14, fontWeight: 500, color: 'var(--lp-muted)', textDecoration: 'none' }}>How it works</a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ThemeToggle style={{ color: 'var(--lp-dim)' }} />
            <Link href="/login" style={{ padding: '8px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'var(--lp-text-sub)', textDecoration: 'none' }}>
              Sign in
            </Link>
            <Link href="/signup" style={{ padding: '9px 18px', borderRadius: 10, background: '#2563EB', fontSize: 14, fontWeight: 700, color: 'white', textDecoration: 'none' }}>
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 64, backgroundColor: 'var(--lp-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '60px 28px', width: '100%' }}>
          <div className="lp-hero-grid">
            <div>
              <div style={{ marginBottom: 22 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#2563EB', backgroundColor: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', padding: '5px 13px', borderRadius: 100 }}>
                  <span className="animate-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                  AI Accounting Engine
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 900, lineHeight: 1.06, letterSpacing: '-1.8px', color: 'var(--lp-text)', margin: '0 0 20px' }}>
                Upload documents.<br />
                <span style={{ color: '#2563EB' }}>AI handles the rest.</span>
              </h1>

              <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--lp-muted)', margin: '0 0 36px', fontWeight: 400, maxWidth: 460 }}>
                {brand} turns invoices, bank statements, and bills into clean books,
                real-time reports, GST summaries, and AI insights — in one place.
              </p>

              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
                <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 12, background: '#2563EB', color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 700, boxShadow: '0 4px 20px rgba(37,99,235,0.28)' }}>
                  Start free <ArrowRight size={15} />
                </Link>
                <a href="#how-it-works" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 24px', borderRadius: 12, border: '1px solid var(--lp-border)', color: 'var(--lp-text-sub)', textDecoration: 'none', fontSize: 15, fontWeight: 600, backgroundColor: 'var(--lp-card)' }}>
                  See how it works
                </a>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {['Built for India', 'GST-ready', 'Double-entry engine', 'No credit card'].map(t => (
                  <span key={t} style={{ fontSize: 12.5, color: 'var(--lp-dim)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <CheckCircle2 size={13} color="#10B981" />{t}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div className="animate-float-2" style={{ position: 'absolute', top: -18, right: -12, zIndex: 10, backgroundColor: 'var(--lp-chip-bg)', borderRadius: 12, padding: '9px 14px', border: '1px solid var(--lp-border)', boxShadow: '0 8px 28px rgba(0,0,0,0.09)', display: 'flex', alignItems: 'center', gap: 9, whiteSpace: 'nowrap' }}>
                <span className="animate-pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#10B981', flexShrink: 0, display: 'inline-block' }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--lp-text)', lineHeight: 1.3 }}>Processing documents</div>
                  <div style={{ fontSize: 11, color: 'var(--lp-dim)' }}>12 transactions categorized</div>
                </div>
              </div>
              <DashboardMockup brandName={brand} />
              <div className="animate-float" style={{ position: 'absolute', bottom: -18, left: -12, zIndex: 10, backgroundColor: 'var(--lp-chip-bg)', borderRadius: 12, padding: '10px 16px', border: '1px solid var(--lp-border)', boxShadow: '0 8px 28px rgba(0,0,0,0.09)', textAlign: 'center', minWidth: 110 }}>
                <div style={{ fontSize: 10, color: 'var(--lp-dim)', marginBottom: 2 }}>GST this month</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#2563EB', lineHeight: 1 }}>₹48.2K</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#059669', marginTop: 3 }}>↓ ₹6K input credit</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problems ── */}
      <section style={{ padding: '96px 28px', backgroundColor: 'var(--lp-bg-alt)', borderTop: '1px solid var(--lp-section-border)' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, letterSpacing: '-0.8px', color: 'var(--lp-text)', margin: '0 0 12px' }}>Does this sound familiar?</h2>
            <p style={{ fontSize: 16, color: 'var(--lp-dim)', margin: 0 }}>These are the exact problems {brand} is built to eliminate.</p>
          </div>
          <div className="lp-problem-grid">
            {[
              { title: 'You know revenue, not real profit', body: "Cash flow problems, tax liabilities, and overdue invoices surface at month-end — when there's nothing left to do about them." },
              { title: 'Financial data is scattered everywhere', body: 'Invoices, bank exports, Razorpay CSVs, GST reports, WhatsApp receipts, spreadsheets. Pulling it together takes hours every week.' },
              { title: 'Accounting jargon blocks the answers', body: 'You want to know "Can I afford this hire?" and "Who owes me?" — not navigate journal entries and debit-credit rules.' },
            ].map(p => (
              <div key={p.title} style={{ padding: '24px 26px', borderRadius: 16, backgroundColor: 'var(--lp-problem-bg)', border: '1px solid var(--lp-problem-border)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EF4444', marginBottom: 14 }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--lp-text)', margin: '0 0 10px', lineHeight: 1.4 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--lp-muted)', margin: 0, lineHeight: 1.7 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: '96px 28px', backgroundColor: 'var(--lp-bg)', borderTop: '1px solid var(--lp-section-border)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, letterSpacing: '-0.8px', color: 'var(--lp-text)', margin: '0 0 12px' }}>Everything from upload to insight</h2>
            <p style={{ fontSize: 16, color: 'var(--lp-dim)', maxWidth: 480, margin: '0 auto' }}>{brand} handles the complete accounting workflow — raw documents to CA-ready reports.</p>
          </div>
          <div className="lp-feature-grid">
            {features.map(({ icon: Icon, color, bg, title, description }) => (
              <div key={title} style={{ padding: '26px', borderRadius: 16, backgroundColor: 'var(--lp-card)', border: '1px solid var(--lp-border)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={19} color={color} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--lp-text)', margin: '0 0 8px', lineHeight: 1.35 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--lp-muted)', margin: 0, lineHeight: 1.7 }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Insights demo ── */}
      <section style={{ padding: '96px 28px', backgroundColor: 'var(--lp-bg-alt)', borderTop: '1px solid var(--lp-section-border)' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ marginBottom: 14 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#2563EB', backgroundColor: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', padding: '5px 13px', borderRadius: 100 }}>
                <Sparkles size={10} color="#2563EB" /> What AI insights look like
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, letterSpacing: '-0.8px', color: 'var(--lp-text)', margin: '0 0 12px' }}>Specific answers, not vague summaries</h2>
            <p style={{ fontSize: 15, color: 'var(--lp-muted)', margin: '0 auto', maxWidth: 460 }}>Every insight is calculated from your real accounting data — the AI explains the numbers, never invents them.</p>
          </div>
          <div className="lp-insight-grid">
            {insights.map((insight, i) => (
              <div key={i} style={{ padding: '20px 22px', borderRadius: 14, backgroundColor: 'var(--lp-card)', border: '1px solid var(--lp-border)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{insight.icon}</span>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--lp-muted)', lineHeight: 1.7, fontStyle: 'italic' }}>{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ padding: '96px 28px', backgroundColor: 'var(--lp-bg)', borderTop: '1px solid var(--lp-section-border)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, letterSpacing: '-0.8px', color: 'var(--lp-text)', margin: 0 }}>How it works</h2>
          </div>
          <div className="lp-steps-grid">
            {steps.map(s => (
              <div key={s.n}>
                <div style={{ fontSize: 52, fontWeight: 900, color: 'var(--lp-steps-num)', lineHeight: 1, marginBottom: 14 }}>{s.n}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--lp-text)', margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--lp-muted)', margin: 0, lineHeight: 1.7 }}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section style={{ padding: '96px 28px', backgroundColor: 'var(--lp-bg-alt)', borderTop: '1px solid var(--lp-section-border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, letterSpacing: '-0.8px', color: 'var(--lp-text)', margin: 0 }}>Built for</h2>
          </div>
          <div className="lp-persona-grid">
            {[
              { icon: TrendingUp, color: '#2563EB', bg: 'rgba(37,99,235,0.08)', title: 'Business owners', description: 'See revenue, profit, cash balance, receivables, and GST estimate on one dashboard — without learning accounting.' },
              { icon: FileText, color: '#0891B2', bg: 'rgba(8,145,178,0.08)', title: 'Freelancers & agencies', description: 'Track invoices, follow up on overdue payments, manage expenses, and know exactly what you owe in GST.' },
              { icon: Shield, color: '#059669', bg: 'rgba(5,150,105,0.08)', title: 'CAs & bookkeepers', description: 'Get a clean review queue, missing document alerts, reconciliation status, and exports for every client.' },
            ].map(({ icon: Icon, color, bg, title, description }) => (
              <div key={title} style={{ padding: '28px', borderRadius: 16, backgroundColor: 'var(--lp-card)', border: '1px solid var(--lp-border)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={18} color={color} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--lp-text)', margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--lp-muted)', margin: 0, lineHeight: 1.7 }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: '96px 28px', backgroundColor: 'var(--lp-bg)', borderTop: '1px solid var(--lp-section-border)' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, letterSpacing: '-0.8px', color: 'var(--lp-text)', margin: '0 0 12px' }}>What people are saying</h2>
            <p style={{ fontSize: 16, color: 'var(--lp-dim)', margin: 0 }}>Early users across businesses, agencies, and accounting firms.</p>
          </div>
          <div className="lp-testimonial-grid">
            {testimonials.map(({ quote, name, role, initials, color }) => (
              <div key={name} style={{ padding: '28px', borderRadius: 16, backgroundColor: 'var(--lp-card)', border: '1px solid var(--lp-border)', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} color="#F59E0B" fill="#F59E0B" />)}
                </div>
                <p style={{ margin: 0, fontSize: 14.5, color: 'var(--lp-muted)', lineHeight: 1.75, flex: 1 }}>&ldquo;{quote}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'white' }}>{initials}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--lp-text)', lineHeight: 1.3 }}>{name}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-dim)' }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust ── */}
      <section style={{ padding: '80px 28px', backgroundColor: 'var(--lp-bg-alt)', borderTop: '1px solid var(--lp-section-border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ borderRadius: 24, background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #1E3A5F 100%)', padding: '52px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ marginBottom: 18 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#93C5FD', backgroundColor: 'rgba(147,197,253,0.12)', border: '1px solid rgba(147,197,253,0.25)', padding: '5px 14px', borderRadius: 100 }}>
                  <Zap size={10} color="#93C5FD" /> The engine behind it
                </span>
              </div>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 14px', letterSpacing: '-0.5px' }}>AI explains. SQL calculates.</h2>
              <p style={{ fontSize: 15, color: 'rgba(147,197,253,0.75)', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.7 }}>
                Every figure in {brand} is calculated by deterministic SQL from your actual accounting data. The AI only explains what those numbers mean — never invents them.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20 }}>
                {['Double-entry accounting engine', 'Every number from real data', 'AI explains, SQL calculates', 'GST-ready for India'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(147,197,253,0.85)', fontWeight: 500 }}>
                    <CheckCircle2 size={13} color="#60A5FA" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: '80px 28px 96px', backgroundColor: 'var(--lp-bg)', borderTop: '1px solid var(--lp-section-border)', textAlign: 'center' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 900, letterSpacing: '-1px', color: 'var(--lp-text)', margin: '0 0 14px', lineHeight: 1.1 }}>
            Stop managing spreadsheets.<br />Start understanding your business.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--lp-dim)', margin: '0 0 36px', lineHeight: 1.6 }}>
            Upload your first bank statement and see your books take shape automatically.
          </p>
          <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 30px', borderRadius: 12, background: '#2563EB', color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 700, boxShadow: '0 4px 20px rgba(37,99,235,0.28)' }}>
            Get started free <ArrowRight size={15} />
          </Link>
          <p style={{ fontSize: 12, color: 'var(--lp-dimmer)', marginTop: 14 }}>No credit card needed · Built for India · GST-ready</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '36px 28px', borderTop: '1px solid var(--lp-section-border)', backgroundColor: 'var(--lp-bg-alt)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 28 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={11} color="white" />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--lp-text)' }}>{brand}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--lp-dimmer)', margin: 0, maxWidth: 280, lineHeight: 1.6 }}>
                AI bookkeeping and financial insights for growing Indian businesses.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 40 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--lp-dim)', marginBottom: 10, margin: '0 0 10px' }}>Product</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <a href="#features" style={{ fontSize: 13, color: 'var(--lp-muted)', textDecoration: 'none', fontWeight: 500 }}>Features</a>
                  <a href="#how-it-works" style={{ fontSize: 13, color: 'var(--lp-muted)', textDecoration: 'none', fontWeight: 500 }}>How it works</a>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--lp-dim)', margin: '0 0 10px' }}>Account</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link href="/login" style={{ fontSize: 13, color: 'var(--lp-muted)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
                  <Link href="/signup" style={{ fontSize: 13, color: 'var(--lp-muted)', textDecoration: 'none', fontWeight: 500 }}>Sign up</Link>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--lp-dim)', margin: '0 0 10px' }}>Legal</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link href="/privacy-policy" style={{ fontSize: 13, color: 'var(--lp-muted)', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</Link>
                  <Link href="/terms" style={{ fontSize: 13, color: 'var(--lp-muted)', textDecoration: 'none', fontWeight: 500 }}>Terms of Service</Link>
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--lp-section-border)', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <p style={{ fontSize: 12, color: 'var(--lp-dimmer)', margin: 0 }}>© {new Date().getFullYear()} {brand}. All rights reserved.</p>
            <p style={{ fontSize: 12, color: 'var(--lp-dimmer)', margin: 0 }}>Made in India 🇮🇳</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
