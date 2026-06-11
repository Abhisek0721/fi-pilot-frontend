import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const isAppRoute = pathname.startsWith('/app');
  const isSetupRoute = pathname === '/setup';
  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  if ((isAppRoute || isSetupRoute) && !user) {
    const loginUrl = new URL('/login', request.url);
    if (isAppRoute) loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/app/dashboard', request.url));
  }

  const hasOrg = request.cookies.get('has_org')?.value === 'true';

  // Skip setup if org already exists
  if (isSetupRoute && user && hasOrg) {
    return NextResponse.redirect(new URL('/app/dashboard', request.url));
  }

  // Gate: redirect to setup if user hasn't completed org creation
  if (isAppRoute && user && !hasOrg) {
    return NextResponse.redirect(new URL('/setup', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
