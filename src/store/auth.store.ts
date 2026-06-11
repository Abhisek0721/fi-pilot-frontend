import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Organization } from '@/types';

interface AuthState {
  user: User | null;
  organization: Organization | null;
  organizationId: string | null;
  organizations: Organization[];
  setUser: (user: User | null) => void;
  setOrganization: (org: Organization | null) => void;
  setOrganizationId: (id: string | null) => void;
  setOrganizations: (orgs: Organization[]) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      organization: null,
      organizationId: null,
      organizations: [],

      setUser: (user) => set({ user }),

      setOrganization: (organization) =>
        set({
          organization,
          organizationId: organization?.id ?? null,
        }),

      setOrganizationId: (organizationId) => set({ organizationId }),

      setOrganizations: (organizations) => set({ organizations }),

      clear: () => set({ user: null, organization: null, organizationId: null, organizations: [] }),
    }),
    {
      name: 'fi-pilot-auth',
      partialize: (state) => ({
        user: state.user,
        organizationId: state.organizationId,
        organization: state.organization,
        organizations: state.organizations,
      }),
    },
  ),
);
