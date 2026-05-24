import Link from 'next/link';
import { Sparkles, Upload } from 'lucide-react';

const EXAMPLE_INSIGHTS = [
  { icon: '📈', text: '"Revenue is up 18% this month, but net profit is down because ad spend and vendor payments grew 34%. Review your top 3 vendors."' },
  { icon: '⚠️', text: '"₹3.2L in expected payments is incoming, but ₹4.1L is due in outgoing payments. You may face a shortfall if 4 overdue invoices are not collected."' },
  { icon: '🧾', text: '"₹2.75L is overdue from 4 clients. Client A has delayed 3 of the last 5 invoices with an average delay of 18 days."' },
  { icon: '💰', text: '"Estimated GST payable this month is ₹48,200 after adjusting input credit from uploaded purchase bills."' },
];

export default function AiInsightsPage() {
  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={15} color="white" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'hsl(var(--foreground))', letterSpacing: '-0.4px', margin: 0 }}>AI Insights</h1>
        </div>
        <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', margin: 0 }}>
          Specific, number-backed insights calculated from your real accounting data — not summaries.
        </p>
      </div>

      <div style={{ padding: '32px', borderRadius: 16, backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', marginBottom: 20, textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: '0 0 18px', lineHeight: 1.6 }}>
          Upload documents to generate your first insights. Here&apos;s what AI insights look like:
        </p>
        <Link href="/app/documents" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, background: '#2563EB', color: 'white', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
          <Upload size={14} /> Upload documents
        </Link>
      </div>

      <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'hsl(var(--muted-foreground))', marginBottom: 12 }}>
        Example insights (from your data, once uploaded)
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {EXAMPLE_INSIGHTS.map((insight, i) => (
          <div key={i} style={{ padding: '18px 20px', borderRadius: 12, backgroundColor: '#F8FAFF', border: '1px solid #DBEAFE', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{insight.icon}</span>
            <p style={{ margin: 0, fontSize: 13.5, color: '#374151', lineHeight: 1.7, fontStyle: 'italic' }}>{insight.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
