import Link from 'next/link';
import { BarChart3, TrendingUp, Scale, Waves, ClipboardList, FileCheck, Upload } from 'lucide-react';

const REPORT_TYPES = [
  { icon: TrendingUp, color: '#2563EB', bg: '#EFF6FF', label: 'Profit & Loss', desc: 'Revenue, expenses, and net profit for any period.' },
  { icon: Scale, color: '#0891B2', bg: '#ECFEFF', label: 'Balance Sheet', desc: 'Assets, liabilities, and equity at a point in time.' },
  { icon: Waves, color: '#059669', bg: '#ECFDF5', label: 'Cash Flow', desc: 'Operating, investing, and financing cash movements.' },
  { icon: ClipboardList, color: '#D97706', bg: '#FFFBEB', label: 'Trial Balance', desc: 'All account balances before final adjustments.' },
  { icon: FileCheck, color: '#0891B2', bg: '#F5F3FF', label: 'GST Summary', desc: 'Output tax, input credit, and net GST payable.' },
  { icon: BarChart3, color: '#DC2626', bg: '#FEF2F2', label: 'Ledger Report', desc: 'Transaction history for any account or date range.' },
];

export default function ReportsPage() {
  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'hsl(var(--foreground))', letterSpacing: '-0.4px', margin: '0 0 6px' }}>Reports</h1>
        <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', margin: 0 }}>
          All reports generated from a real double-entry engine — every number calculated from your actual accounting data.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        {REPORT_TYPES.map(({ icon: Icon, color, bg, label, desc }) => (
          <div key={label} style={{ padding: '20px', borderRadius: 14, backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', opacity: 0.65 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Icon size={17} color={color} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'hsl(var(--foreground))', marginBottom: 5 }}>{label}</div>
            <p style={{ fontSize: 12.5, color: 'hsl(var(--muted-foreground))', margin: 0, lineHeight: 1.5 }}>{desc}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: '32px', borderRadius: 14, backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: '0 0 16px', lineHeight: 1.6 }}>
          Upload bank statements, invoices, and bills to generate your first reports.
        </p>
        <Link href="/app/documents" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, background: '#2563EB', color: 'white', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
          <Upload size={14} /> Upload documents
        </Link>
      </div>
    </div>
  );
}
