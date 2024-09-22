import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes from both Clerk and your custom API routes
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook',
  '/api/uploadthing'
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    // Protect the route if it's not public
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

