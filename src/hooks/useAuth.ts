'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth.store';
import type { Session } from '@supabase/supabase-js';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, setUser, clear } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session && !user) {
        setUser({
          id: session.user.id,
          supabaseId: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
          avatarUrl: session.user.user_metadata?.avatar_url,
          createdAt: session.user.created_at,
          updatedAt: session.user.updated_at || session.user.created_at,
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) clear();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    clear();
  };

  return { session, loading, user, signOut };
}
