'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth.store';
import apiClient from '@/lib/api/client';
import type { Session } from '@supabase/supabase-js';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, setUser, setOrganization, setOrganizations, organizationId, clear } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setLoading(false);

      if (!session) return;

      // Populate user from Supabase session if store is empty
      if (!user) {
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

      // Repopulate org in store if missing (new device, cleared storage, re-login)
      if (!organizationId) {
        try {
          const res = await apiClient.post('/auth/sync');
          const syncedUser = res.data.data ?? res.data;
          if (syncedUser) {
            setUser(syncedUser);
            const orgs = (syncedUser.organizationMembers ?? []).map((m: any) => m.organization).filter(Boolean);
            if (orgs.length > 0) {
              setOrganizations(orgs);
              setOrganization(orgs[0]);
            }
          }
        } catch {
          // Non-fatal — user may not have an org yet (new user still on setup)
        }
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
    // Expire the has_org cookie so middleware re-checks on next login
    document.cookie = 'has_org=; path=/; max-age=0; SameSite=Lax';
    clear();
  };

  return { session, loading, user, signOut };
}
