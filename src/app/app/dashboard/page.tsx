'use client';

import { useAuthStore } from '@/store/auth.store';
import { KpiCard } from '@/components/shared/KpiCard';
import { AiSummaryCard } from '@/components/dashboard/AiSummaryCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import {
  Upload,
  FileText,
  GitMerge,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Receipt,
  Landmark,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import Link from 'next/link';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const quickActions = [
  {
    href: '/app/documents',
    icon: Upload,
    color: '#2563EB',
    bg: 'rgba(37,99,235,0.07)',
    title: 'Upload documents',
    desc: 'Bank statements, invoices, or bills',
  },
  {
    href: '/app/invoices',
    icon: FileText,
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.08)',
    title: 'Create an invoice',
    desc: 'Generate and send to your clients',
  },
  {
    href: '/app/reconciliation',
    icon: GitMerge,
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
    title: 'Run reconciliation',
    desc: 'Match payments to invoices and bills',
  },
  {
    href: '/app/review-queue',
    icon: ClipboardList,
    color: '#D97706',
    bg: 'rgba(217,119,6,0.08)',
    title: 'Review queue',
    desc: 'Approve AI-categorized transactions',
  },
];

export default function DashboardPage() {
  const { user, organization } = useAuthStore();
  const greeting = getGreeting();
  const displayName = user?.name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there';

  const now = new Date();
  const monthLabel = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div style={{ maxWidth: 1200 }}>

      {/* ── Welcome header ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'hsl(var(--foreground))', letterSpacing: '-0.5px', margin: '0 0 4px' }}>
              {greeting}, {displayName}.
            </h1>
            <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: 0 }}>
              {organization?.name ?? 'Your organization'} · {monthLabel}
            </p>
          </div>
          <Link href="/app/documents" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '9px 18px', borderRadius: 10,
            background: '#2563EB',
            color: 'white', textDecoration: 'none',
            fontSize: 13, fontWeight: 700,
          }}>
            <Upload size={14} />
            Upload documents
          </Link>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <KpiCard
          title="Revenue"
          value="—"
          icon={<TrendingUp size={16} />}
          changeLabel="Upload documents to see your numbers"
        />
        <KpiCard
          title="Expenses"
          value="—"
          icon={<TrendingDown size={16} />}
          changeLabel="Upload documents to see your numbers"
        />
        <KpiCard
          title="Net Profit"
          value="—"
          icon={<Receipt size={16} />}
          changeLabel="Upload documents to see your numbers"
        />
        <KpiCard
          title="GST Due"
          value="—"
          icon={<Landmark size={16} />}
          changeLabel="Upload documents to see your numbers"
        />
      </div>

      {/* ── Chart + AI summary row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginBottom: 28 }}>
        <RevenueChart data={[]} loading={false} />
        <AiSummaryCard loading={false} />
      </div>

      {/* ── Quick actions ── */}
      <div style={{ marginBottom: 8 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'hsl(var(--foreground))', margin: '0 0 14px', letterSpacing: '-0.2px' }}>
          Quick actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {quickActions.map(({ href, icon: Icon, color, bg, title, desc }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 18px', borderRadius: 12,
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                textDecoration: 'none',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                backgroundColor: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={17} color={color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'hsl(var(--foreground))', marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', lineHeight: 1.4 }}>{desc}</div>
              </div>
              <ArrowRight size={14} color="hsl(var(--muted-foreground))" style={{ flexShrink: 0 }} />
            </Link>
          ))}
        </div>
      </div>

      {/* ── Getting started banner ── */}
      <div style={{
        marginTop: 28,
        padding: '24px 28px',
        borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(29,78,216,0.06) 100%)',
        border: '1px solid rgba(37,99,235,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: '#2563EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'hsl(var(--foreground))', marginBottom: 3 }}>
              Your books are ready to be built
            </div>
            <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', lineHeight: 1.5 }}>
              Upload a bank statement or invoice — AI will categorize, reconcile, and post everything automatically.
            </div>
          </div>
        </div>
        <Link href="/app/documents" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '10px 20px', borderRadius: 10, flexShrink: 0,
          background: '#2563EB',
          color: 'white', textDecoration: 'none', fontSize: 13, fontWeight: 700,
        }}>
          Upload now <ArrowRight size={13} />
        </Link>
      </div>

    </div>
  );
}
