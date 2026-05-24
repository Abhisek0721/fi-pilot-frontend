'use client';

import { useAuthStore } from '@/store/auth.store';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Building2, User, LogOut, Globe, IndianRupee } from 'lucide-react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'hsl(var(--muted-foreground))', margin: '0 0 12px' }}>
        {title}
      </h2>
      <div style={{ borderRadius: 12, backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value, last }: { icon: typeof Building2; label: string; value: string | undefined; last?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: last ? 'none' : '1px solid hsl(var(--border))' }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'hsl(var(--muted))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={14} color="hsl(var(--muted-foreground))" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', marginBottom: 2, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'hsl(var(--foreground))' }}>{value ?? '—'}</div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { organization, user } = useAuthStore();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div style={{ maxWidth: 540 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'hsl(var(--foreground))', letterSpacing: '-0.4px', margin: '0 0 6px' }}>Settings</h1>
        <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', margin: 0 }}>
          Your organization and account details.
        </p>
      </div>

      <Section title="Organization">
        <Row icon={Building2} label="Organization name" value={organization?.name} />
        <Row icon={Globe} label="Country" value={organization?.country} />
        <Row icon={IndianRupee} label="Currency" value={organization?.currency} last />
      </Section>

      <Section title="Account">
        <Row icon={User} label="Name" value={user?.name} />
        <Row icon={User} label="Email" value={user?.email} last />
      </Section>

      <div style={{ marginTop: 8 }}>
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '12px 18px', borderRadius: 10,
            backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
            color: '#DC2626', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </div>
  );
}
