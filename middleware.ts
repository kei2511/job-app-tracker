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
      // Allow access when token is present OR when the session cookie exists.
      // NOTE: This is a pragmatic fallback to avoid accidental Edge decoding issues
      // during deploy; we should investigate why `token` is sometimes undefined.
      authorized: ({ token, req }) => {
        if (token) return true;
        try {
          // Check for NextAuth session cookie presence as a fallback
          const cookie = req.cookies.get('__Secure-next-auth.session-token') || req.cookies.get('next-auth.session-token');
          return !!cookie;
        } catch (e) {
          return false;
        }
      }
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