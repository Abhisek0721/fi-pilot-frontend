import Link from 'next/link';
import envConstant from '@/constants/envConstant';
import { TrendingUp, ArrowLeft } from 'lucide-react';

const brand = envConstant.NEXT_PUBLIC_BRAND_NAME;

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', color: 'var(--foreground)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Nav */}
      <header style={{ borderBottom: '1px solid hsl(var(--border))', padding: '0 28px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={13} color="white" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px', color: 'hsl(var(--foreground))' }}>{brand}</span>
        </Link>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'hsl(var(--muted-foreground))', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Back to home
        </Link>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '60px 28px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.8px', color: 'hsl(var(--foreground))', margin: '0 0 8px' }}>Terms of Service</h1>
        <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: '0 0 48px' }}>Last updated: May 2025</p>

        {[
          {
            title: '1. Acceptance of Terms',
            body: `By accessing or using ${brand}, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.`,
          },
          {
            title: '2. Description of Service',
            body: `${brand} provides AI-powered accounting and bookkeeping tools including document processing, transaction categorization, financial report generation, and AI-driven financial insights. The service is intended for use by businesses, freelancers, and accounting professionals.`,
          },
          {
            title: '3. Account Responsibilities',
            body: `You are responsible for maintaining the security of your account credentials and for all activities that occur under your account. You must provide accurate information when creating your account and keep it up to date.`,
          },
          {
            title: '4. Acceptable Use',
            body: `You agree not to misuse the service, attempt unauthorized access, upload malicious content, or use the platform for illegal activities. You are responsible for ensuring the accuracy of the financial data you upload.`,
          },
          {
            title: '5. AI and Accuracy',
            body: `${brand} uses AI to assist with accounting tasks. While we strive for accuracy, AI-generated categorizations, reconciliations, and insights may contain errors. You are responsible for reviewing and verifying all outputs before using them for tax filing, financial reporting, or any legal purpose. ${brand} is not a licensed accounting firm and does not provide professional accounting advice.`,
          },
          {
            title: '6. Data Ownership',
            body: `You retain full ownership of all financial data you upload to ${brand}. We do not claim ownership of your data. You grant us a limited license to process your data for the purpose of providing the service.`,
          },
          {
            title: '7. Subscription and Billing',
            body: `Subscription terms, pricing, and billing details are outlined at the time of purchase. Subscriptions renew automatically unless cancelled before the renewal date. Refunds are handled on a case-by-case basis.`,
          },
          {
            title: '8. Limitation of Liability',
            body: `${brand} is provided "as is." To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the service, including financial losses resulting from errors in AI-generated outputs.`,
          },
          {
            title: '9. Termination',
            body: `We reserve the right to suspend or terminate accounts that violate these terms. You may cancel your account at any time. Upon termination, your data will be retained for 30 days before permanent deletion.`,
          },
          {
            title: '10. Governing Law',
            body: `These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.`,
          },
          {
            title: '11. Contact',
            body: `For questions about these terms, contact us at: legal@fipilot.in`,
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'hsl(var(--foreground))', margin: '0 0 10px' }}>{section.title}</h2>
            <p style={{ fontSize: 15, color: 'hsl(var(--muted-foreground))', margin: 0, lineHeight: 1.8 }}>{section.body}</p>
          </div>
        ))}
      </main>

      <footer style={{ borderTop: '1px solid hsl(var(--border))', padding: '20px 28px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', margin: 0 }}>
          <Link href="/" style={{ color: 'hsl(var(--muted-foreground))', textDecoration: 'none' }}>{brand}</Link>
          {' · '}
          <Link href="/privacy-policy" style={{ color: 'hsl(var(--muted-foreground))', textDecoration: 'none' }}>Privacy Policy</Link>
        </p>
      </footer>
    </div>
  );
}
