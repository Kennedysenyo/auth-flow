import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

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
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  const pathname = request.nextUrl.pathname;
  const isAuthRoute: string[] = [
    "/login",
    "/sign-up",
    "/forgot-password",
    "/verify-otp",
  ];
  const isRecoveryMode =
    (await cookies()).get("recoveryMode")?.value === "true";

  if (pathname === "/set-new-password") {
    if (!user || !isRecoveryMode) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (user && isRecoveryMode) {
    if (pathname === "/verify-otp") {
      return NextResponse.redirect(new URL("/set-new-password", request.url));
    }

    if (pathname !== "/set-new-password") {
      return NextResponse.redirect(new URL("/set-new-password", request.url));
    }
    return supabaseResponse;
  }

  if (isAuthRoute.includes(pathname) && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!user && !isAuthRoute.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}
