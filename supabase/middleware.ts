import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll().map(({ name, value }) => ({
              name,
              value,
            }));
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              });
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // Handle authentication redirects
    if (error) {
      // If not authenticated and trying to access protected routes
      if (
        request.nextUrl.pathname.startsWith("/dashboard") ||
        request.nextUrl.pathname.startsWith("/onboarding") ||
        request.nextUrl.pathname.startsWith("/protected")
      ) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    } else if (user) {
      // User is authenticated, check onboarding status for specific routes
      if (
        request.nextUrl.pathname.startsWith("/dashboard") ||
        request.nextUrl.pathname.startsWith("/onboarding")
      ) {
        try {
          // Get user's profile to check onboarding status
          const { data: profile } = await supabase
            .from("profile")
            .select("onboarding_status, tenant_id, full_name")
            .eq("id", user.id)
            .single();

          // If profile doesn't exist, redirect to first onboarding phase
          if (!profile) {
            if (!request.nextUrl.pathname.startsWith("/onboarding/phase1")) {
              return NextResponse.redirect(
                new URL("/onboarding/phase1", request.url),
              );
            }
          } else {
            // Handle redirects based on onboarding status
            if (profile.onboarding_status === "pending") {
              // Redirect to phase1 if not already there
              if (!request.nextUrl.pathname.startsWith("/onboarding/phase1")) {
                return NextResponse.redirect(
                  new URL("/onboarding/phase1", request.url),
                );
              }
            } else if (profile.onboarding_status === "in_progress") {
              // Check which phase they're in
              if (!profile.tenant_id) {
                // No tenant_id means they need to complete phase1
                if (
                  !request.nextUrl.pathname.startsWith("/onboarding/phase1")
                ) {
                  return NextResponse.redirect(
                    new URL("/onboarding/phase1", request.url),
                  );
                }
              } else if (!profile.full_name) {
                // No full_name means they need to complete phase2
                if (
                  !request.nextUrl.pathname.startsWith("/onboarding/phase2")
                ) {
                  return NextResponse.redirect(
                    new URL("/onboarding/phase2", request.url),
                  );
                }
              } else {
                // They need to complete phase3
                if (
                  !request.nextUrl.pathname.startsWith("/onboarding/phase3")
                ) {
                  return NextResponse.redirect(
                    new URL("/onboarding/phase3", request.url),
                  );
                }
              }
            } else if (profile.onboarding_status === "completed") {
              // If onboarding is completed and trying to access onboarding pages, redirect to dashboard
              if (request.nextUrl.pathname.startsWith("/onboarding")) {
                return NextResponse.redirect(
                  new URL("/dashboard", request.url),
                );
              }
            }
          }
        } catch (error) {
          console.error("Error checking profile:", error);
          // If there's an error, allow the request to continue
          // The server component will handle the appropriate redirect
        }
      }

      // Redirect authenticated users from auth pages to dashboard
      if (
        request.nextUrl.pathname.startsWith("/sign-in") ||
        request.nextUrl.pathname.startsWith("/sign-up") ||
        request.nextUrl.pathname === "/"
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return response;
  } catch (e) {
    console.error("Middleware error:", e);
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
