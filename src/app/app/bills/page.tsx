import Link from 'next/link';
import { Receipt, Upload, CheckCircle2 } from 'lucide-react';

export default function BillsPage() {
  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'hsl(var(--foreground))', letterSpacing: '-0.4px', margin: '0 0 6px' }}>Bills</h1>
        <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', margin: 0 }}>
          Vendor bills, purchase invoices, and payables — extracted and reconciled automatically.
        </p>
      </div>

      <div style={{ padding: '48px 40px', borderRadius: 16, textAlign: 'center', backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', marginBottom: 20 }}>
        <div style={{ width: 52, height: 52, borderRadius: 13, margin: '0 auto 18px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Receipt size={22} color="#D97706" />
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'hsl(var(--foreground))', margin: '0 0 10px' }}>No bills uploaded yet</h2>
        <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: '0 0 24px', lineHeight: 1.6, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
          Upload vendor bills or purchase invoices. Vendor name, amount, GST number, and date are extracted — and the journal entry is created automatically.
        </p>
        <Link href="/app/documents" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, background: '#2563EB', color: 'white', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
          <Upload size={14} /> Upload bills
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {[
          { label: 'Vendor extracted', desc: 'Name, address, GST number from every bill' },
          { label: 'GST-aware', desc: 'Input tax credit tracked automatically' },
          { label: 'Reconciled', desc: 'Matched to bank debits when payment is made' },
        ].map(({ label, desc }) => (
          <div key={label} style={{ padding: '16px', borderRadius: 12, backgroundColor: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <CheckCircle2 size={13} color="#059669" />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'hsl(var(--foreground))' }}>{label}</span>
            </div>
            <p style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', margin: 0, lineHeight: 1.5 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
