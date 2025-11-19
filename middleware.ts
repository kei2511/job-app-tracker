// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Use NextAuth middleware with specific configuration
export default withAuth(
  // Middleware function
  function middleware(req) {
    return NextResponse.next();
  },
  {
    // Configuration
    callbacks: {
      authorized: ({ token }) => !!token // Only allow authenticated users for protected routes
    },
    pages: {
      signIn: '/auth/signin', // Redirect to sign-in page if not authenticated
    }
  }
);

// Define which routes should be protected
// Exclude auth pages, API routes, static assets, and file extensions
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, except auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (authentication pages)
     */
    '/((?!api/auth|auth|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};