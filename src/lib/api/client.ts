import axios from 'axios';
import envConstant from '@/constants/envConstant';
import { createClient } from '@/lib/supabase/client';

const apiClient = axios.create({
  baseURL: envConstant.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Supabase JWT + organization id
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        config.headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      // Attach organization id from Zustand store (lazy import to avoid circular deps)
      const { useAuthStore } = await import('@/store/auth.store');
      const organizationId = useAuthStore.getState().organizationId;
      if (organizationId) {
        config.headers['x-organization-id'] = organizationId;
      }
    } catch {
      // Silently fail — interceptor should never break requests
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
