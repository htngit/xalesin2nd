import { createClient } from "../../../../supabase/server";
import OnboardingLayout from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePersonalInfoAction } from "@/app/actions";
import RouteGuard from "@/components/RouteGuard";
import { redirect } from "next/navigation";

export default async function PersonalInfoPage() {
  const supabase = await createClient();

  // Check if user is authenticated for server-side rendering
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch initial data for server-side rendering
  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/onboarding/phase1");
  }

  return (
    <RouteGuard
      user={user}
      profile={profile}
      requiredOnboardingStatus="in_progress"
      requiredOnboardingPhase={2}
      redirectTo="/dashboard"
    >
      <OnboardingLayout currentStep={2}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Personal Information</h1>
            <p className="text-gray-500 mt-1">
              Tell us about yourself so we can personalize your experience.
            </p>
          </div>

          <form action={updatePersonalInfoAction} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  placeholder="Product Manager"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Continue to Team Setup
            </Button>
          </form>
        </div>
      </OnboardingLayout>
    </RouteGuard>
  );
}
