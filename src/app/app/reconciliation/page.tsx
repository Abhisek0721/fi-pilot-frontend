import Link from 'next/link';
import { GitMerge, Upload, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ReconciliationPage() {
  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'hsl(var(--foreground))', letterSpacing: '-0.4px', margin: '0 0 6px' }}>Reconciliation</h1>
        <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', margin: 0 }}>
          Match invoices to bank credits, bills to bank debits, and flag anything that doesn&apos;t match.
        </p>
      </div>

      <div style={{ padding: '48px 40px', borderRadius: 16, textAlign: 'center', backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', marginBottom: 20 }}>
        <div style={{ width: 52, height: 52, borderRadius: 13, margin: '0 auto 18px', backgroundColor: '#ECFDF5', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GitMerge size={22} color="#059669" />
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'hsl(var(--foreground))', margin: '0 0 10px' }}>Nothing to reconcile yet</h2>
        <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: '0 0 24px', lineHeight: 1.6, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
          Upload bank statements and invoices or bills. Reconciliation runs automatically — matching credits to invoices and debits to bills.
        </p>
        <Link href="/app/documents" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, background: '#2563EB', color: 'white', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
          <Upload size={14} /> Upload documents
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { from: 'Invoice', to: 'Bank credit', desc: 'Client payment matched to the original invoice' },
          { from: 'Bill', to: 'Bank debit', desc: 'Vendor payment matched to the original bill' },
          { from: 'Refund', to: 'Original payment', desc: 'Refunds matched to their original transactions' },
          { from: 'Unmatched', to: 'Flagged', desc: 'Items that don\'t match anything are surfaced for review' },
        ].map(({ from, to, desc }) => (
          <div key={from} style={{ padding: '16px', borderRadius: 12, backgroundColor: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#2563EB' }}>{from}</span>
              <ArrowRight size={11} color="hsl(var(--muted-foreground))" />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#059669' }}>{to}</span>
            </div>
            <p style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', margin: 0, lineHeight: 1.5 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
