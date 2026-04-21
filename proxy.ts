// proxy.ts - Next.js middleware for routing requests to tenant pages based on hostname

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  
  let hostname = request.headers.get('host') || 'localhost';
  
  hostname = hostname.split(':')[0]; 

  if (url.pathname.startsWith('/api') || url.pathname.includes('.')) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL(`/tenant/${hostname}${url.pathname}`, request.url));
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};