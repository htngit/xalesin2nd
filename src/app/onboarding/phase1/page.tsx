import { createClient } from "../../../../supabase/server";
import OnboardingLayout from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCompanyInfoAction } from "@/app/actions";
import RouteGuard from "@/components/RouteGuard";
import { redirect } from "next/navigation";

export default async function CompanyInfoPage() {
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
    // Initialize profile if it doesn't exist
    await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/api/init-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // The actual rendering with RouteGuard protection
  return (
    <RouteGuard
      user={user}
      profile={profile}
      requiredOnboardingStatus="pending"
      requiredOnboardingPhase={1}
      redirectTo="/dashboard"
    >
      <OnboardingLayout currentStep={1}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Company Information</h1>
            <p className="text-gray-500 mt-1">
              Tell us about your company to get started with the CRM.
            </p>
          </div>

          <form action={updateCompanyInfoAction} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  placeholder="Acme Inc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select name="industry" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_size">Company Size</Label>
                <Select name="company_size" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="501-1000">501-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Continue to Personal Information
            </Button>
          </form>
        </div>
      </OnboardingLayout>
    </RouteGuard>
  );
}
