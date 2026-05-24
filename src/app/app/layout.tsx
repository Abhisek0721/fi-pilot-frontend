import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import envConstant from '@/constants/envConstant';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) redirect('/login');

  let hasOrg = false;
  try {
    const res = await fetch(`${envConstant.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
      cache: 'no-store',
    });
    if (res.ok) {
      const payload = await res.json();
      const dbUser = payload.data ?? payload;
      hasOrg = (dbUser?.organizationMembers?.length ?? 0) > 0;
    }
  } catch {
    // Backend unreachable
  }

  if (!hasOrg) redirect('/setup');

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main className="ml-60 pt-16 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
