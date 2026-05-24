import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Organization } from '@/types';

interface AuthState {
  user: User | null;
  organization: Organization | null;
  organizationId: string | null;
  setUser: (user: User | null) => void;
  setOrganization: (org: Organization | null) => void;
  setOrganizationId: (id: string | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      organization: null,
      organizationId: null,

      setUser: (user) => set({ user }),

      setOrganization: (organization) =>
        set({
          organization,
          organizationId: organization?.id ?? null,
        }),

      setOrganizationId: (organizationId) => set({ organizationId }),

      clear: () => set({ user: null, organization: null, organizationId: null }),
    }),
    {
      name: 'fi-pilot-auth',
      partialize: (state) => ({
        organizationId: state.organizationId,
        organization: state.organization,
      }),
    },
  ),
);
