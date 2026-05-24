import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import envConstant from '@/constants/envConstant';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    envConstant.NEXT_PUBLIC_SUPABASE_URL,
    envConstant.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll called from a Server Component — can be ignored
          }
        },
      },
    },
  );
}
