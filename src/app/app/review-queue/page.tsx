import Link from 'next/link';
import { ClipboardList, CheckCircle2, Upload } from 'lucide-react';

export default function ReviewQueuePage() {
  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'hsl(var(--foreground))', letterSpacing: '-0.4px', margin: '0 0 6px' }}>Review Queue</h1>
        <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', margin: 0 }}>
          AI-categorized transactions with low confidence, missing documents, and unmatched items — all in one place.
        </p>
      </div>

      <div style={{
        padding: '40px', borderRadius: 16, textAlign: 'center',
        backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
        marginBottom: 20,
      }}>
        <div style={{ width: 52, height: 52, borderRadius: 13, margin: '0 auto 18px', backgroundColor: '#ECFDF5', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={24} color="#059669" />
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'hsl(var(--foreground))', margin: '0 0 8px' }}>Queue is empty</h2>
        <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: '0 0 20px', lineHeight: 1.6, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
          Nothing needs your review right now. Items appear here when the AI is not confident about a categorization or when a document is missing.
        </p>
        <Link href="/app/documents" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 10, border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))', textDecoration: 'none', fontSize: 13, fontWeight: 600, backgroundColor: 'hsl(var(--card))' }}>
          <Upload size={13} /> Upload more documents
        </Link>
      </div>

      <div style={{ padding: '20px 22px', borderRadius: 12, backgroundColor: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))' }}>
        <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(var(--muted-foreground))', marginBottom: 12 }}>
          What appears in the queue
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'Transactions where AI confidence is below threshold',
            'Invoices or bills missing key fields (amount, vendor, date)',
            'Transactions with no matching invoice or bill',
            'Duplicate transaction suspects',
          ].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <ClipboardList size={13} color="hsl(var(--muted-foreground))" />
              <span style={{ fontSize: 13, color: 'hsl(var(--foreground))' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
