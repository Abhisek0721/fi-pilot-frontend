'use client';

import { useAuthStore } from '@/store/auth.store';

export function useOrganization() {
  const organization = useAuthStore((s) => s.organization);
  const organizationId = useAuthStore((s) => s.organizationId);
  const setOrganization = useAuthStore((s) => s.setOrganization);

  return { organization, organizationId, setOrganization };
}
