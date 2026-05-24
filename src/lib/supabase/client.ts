import { createBrowserClient } from '@supabase/ssr';
import envConstant from '@/constants/envConstant';

export function createClient() {
  return createBrowserClient(
    envConstant.NEXT_PUBLIC_SUPABASE_URL,
    envConstant.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
