import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isRecoveryMode = request.cookies.get("recovery-mode")?.value === "true";

  if (request.nextUrl.pathname === "/set-new-password") {
    if (!user || !isRecoveryMode) {
      return NextResponse.redirect(new URL("/forgot-password", request.url));
    }
  }

  // Handle recovery flow
  if (isRecoveryMode && user) {
    if (request.nextUrl.pathname === "/verify-otp") {
      return NextResponse.redirect(new URL("/set-new-password", request.url));
    }

    if (request.nextUrl.pathname !== "/set-new-password") {
      return NextResponse.redirect(new URL("/set-new-password", request.url));
    }
    return supabaseResponse;
  }

  // Normal auth flow
  const authRoutes = ["/login", "/sign-up", "/forgot-password", "/verify-otp"];
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);
  const isResendOtpRoute = request.nextUrl.pathname === "/api/resend-otp";

  if (!user && !isAuthRoute && !isResendOtpRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && isAuthRoute && !isRecoveryMode) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return supabaseResponse;
}
