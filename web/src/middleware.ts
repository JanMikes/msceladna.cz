import { NextResponse, type NextRequest } from 'next/server';

// Surfaces the current pathname to Server Components via a request header so the
// root layout can resolve the correct navbar set server-side (no client flash).
// App Router does not otherwise expose the pathname to a layout.
export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('x-pathname', request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Run on page routes only; skip static assets, fonts, and API routes.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|fonts|api).*)'],
};
