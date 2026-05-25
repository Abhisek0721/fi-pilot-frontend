import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

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
