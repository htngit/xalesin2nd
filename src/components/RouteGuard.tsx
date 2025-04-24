"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

type RouteGuardProps = {
  children: React.ReactNode;
  user: any | null;
  profile: any | null;
  requiredOnboardingStatus?: "pending" | "in_progress" | "completed" | null;
  requiredOnboardingPhase?: 1 | 2 | 3 | null;
  redirectTo?: string;
};

/**
 * A client component that guards routes based on authentication and onboarding status
 * @param children The content to render if the user is allowed to access the route
 * @param user The user object from server-side authentication
 * @param profile The user's profile from server-side data fetching
 * @param requiredOnboardingStatus The onboarding status required to access the route
 * @param requiredOnboardingPhase The specific onboarding phase required (1, 2, or 3)
 * @param redirectTo Where to redirect if the user doesn't meet the requirements
 */
export default function RouteGuard({
  children,
  user,
  profile,
  requiredOnboardingStatus = null,
  requiredOnboardingPhase = null,
  redirectTo = "/dashboard",
}: RouteGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        if (!user) {
          // User is not authenticated, redirect to sign in
          router.push("/sign-in");
          return;
        }

        // If no specific requirements, just render children
        if (!requiredOnboardingStatus && !requiredOnboardingPhase) {
          setIsAuthorized(true);
          return;
        }

        // Check if profile exists
        if (!profile) {
          // Profile doesn't exist, redirect to first onboarding phase
          router.push("/onboarding/phase1");
          return;
        }

        // Check onboarding status requirement
        if (
          requiredOnboardingStatus &&
          profile.onboarding_status !== requiredOnboardingStatus
        ) {
          // Determine where to redirect based on current status
          if (profile.onboarding_status === "completed") {
            // If completed, redirect to dashboard
            router.push("/dashboard");
          } else if (profile.onboarding_status === "pending") {
            // If pending, redirect to phase1
            router.push("/onboarding/phase1");
          } else if (profile.onboarding_status === "in_progress") {
            // If in_progress, determine which phase they're in
            if (!profile.tenant_id) {
              router.push("/onboarding/phase1");
            } else if (!profile.full_name) {
              router.push("/onboarding/phase2");
            } else {
              router.push("/onboarding/phase3");
            }
          } else {
            // Default redirect
            router.push(redirectTo);
          }
          return;
        }

        // Check specific phase requirement
        if (requiredOnboardingPhase) {
          let currentPhase = 1;
          if (profile.tenant_id) currentPhase = 2;
          if (profile.full_name) currentPhase = 3;

          // If they're trying to access a phase they haven't reached yet or have already completed
          if (currentPhase !== requiredOnboardingPhase) {
            if (profile.onboarding_status === "completed") {
              // If completed, redirect to dashboard
              router.push("/dashboard");
            } else {
              // Redirect to their current phase
              router.push(`/onboarding/phase${currentPhase}`);
            }
            return;
          }
        }

        // If we've made it this far, the user is authorized
        setIsAuthorized(true);
      } catch (error) {
        console.error("Error in RouteGuard:", error);
        // On error, redirect to sign in
        router.push("/sign-in");
      }
    };

    checkAuth();
  }, [
    router,
    user,
    profile,
    requiredOnboardingStatus,
    requiredOnboardingPhase,
    redirectTo,
  ]);

  // Only render children if authorized
  return isAuthorized ? <>{children}</> : null;
}
