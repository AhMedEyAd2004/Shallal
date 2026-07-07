import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Redirect root to /home
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to
  // debug issues with users being randomly logged out.

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Protected routes: redirect unauthenticated users to /log-in
  const protectedPaths = ["/dashboard"];
  const isProtected =
    protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path)) &&
    request.nextUrl.pathname !== "/dashboard/set-password";

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/log-in";
    return NextResponse.redirect(url);
  }

  // 1. REDIRECT BASE DASHBOARD TO DASHBOARD/MANAGE
  // If user is logged in and hits exactly /dashboard, send them to /dashboard/manage
  if (user && request.nextUrl.pathname === "/dashboard") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/manage-data";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  const authPaths = ["/log-in"];
  const isAuthPage = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    // 2. Updated target to go straight to /dashboard/manage
    url.pathname = "/dashboard/manage-data";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
