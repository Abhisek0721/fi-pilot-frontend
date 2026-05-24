import Link from 'next/link';
import envConstant from '@/constants/envConstant';
import { TrendingUp, ArrowLeft } from 'lucide-react';

const brand = envConstant.NEXT_PUBLIC_BRAND_NAME;

export default function PrivacyPolicyPage() {
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
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.8px', color: 'hsl(var(--foreground))', margin: '0 0 8px' }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', margin: '0 0 48px' }}>Last updated: May 2025</p>

        {[
          {
            title: '1. Information We Collect',
            body: `We collect information you provide when creating an account (name, email, organization details) and information generated through your use of the service (uploaded documents, transactions, accounting data). We do not sell your data to third parties.`,
          },
          {
            title: '2. How We Use Your Information',
            body: `Your data is used solely to provide the ${brand} service — categorizing transactions, generating reports, reconciling accounts, and powering AI insights. We may use anonymized, aggregated data to improve our AI models. No personally identifiable information is shared with AI providers in a way that could identify you.`,
          },
          {
            title: '3. Data Storage and Security',
            body: `All data is stored on secure, encrypted infrastructure. Financial documents and accounting data are encrypted at rest and in transit. We follow industry-standard security practices including access controls, audit logs, and regular security reviews.`,
          },
          {
            title: '4. Data Retention',
            body: `We retain your data for as long as your account is active. When you delete your account, your data is permanently removed from our systems within 30 days, except where we are required to retain it for legal or compliance purposes.`,
          },
          {
            title: '5. Your Rights',
            body: `You have the right to access, correct, or delete your personal data at any time. You can export your accounting data from within the application. To request data deletion or exercise any other rights, contact us at privacy@' + brand.toLowerCase().replace(/ /g, '') + '.in.`,
          },
          {
            title: '6. Cookies',
            body: `We use essential cookies required for authentication and session management. We do not use third-party tracking or advertising cookies.`,
          },
          {
            title: '7. Changes to This Policy',
            body: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through the application. Continued use after changes constitutes acceptance.`,
          },
          {
            title: '8. Contact',
            body: `For privacy-related questions, contact us at: privacy@fipilot.in`,
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
          <Link href="/terms" style={{ color: 'hsl(var(--muted-foreground))', textDecoration: 'none' }}>Terms of Service</Link>
        </p>
      </footer>
    </div>
  );
}
