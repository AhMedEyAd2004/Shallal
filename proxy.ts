import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
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

  // Securely fetch user info from cookies
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Route definitions
  const pathname = request.nextUrl.pathname;

  // Public pages rules
  const isSetPasswordPage = pathname === "/set-password";

  // Dashboard routes require authentication, except for the set-password page
  const isProtected = pathname.startsWith("/dashboard") ;

  // Unauthenticated user trying to access a protected page
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/log-in";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from base /dashboard to their manage subpage
  if (user && pathname === "/dashboard") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/manage-data";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login pages
  const authPaths = ["/log-in"];
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
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
