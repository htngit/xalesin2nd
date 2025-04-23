import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import OnboardingLayout from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteTeamMembersAction } from "@/app/actions";

export default async function InviteTeamMembersPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user has a profile with tenant_id and full_name
  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return redirect("/onboarding/phase1");
  } else if (!profile.tenant_id) {
    // If company info is not provided, redirect to phase1
    return redirect("/onboarding/phase1");
  } else if (!profile.full_name) {
    // If personal info is not provided, redirect to phase2
    return redirect("/onboarding/phase2");
  } else if (profile.onboarding_status === "completed") {
    // If onboarding is already completed, redirect to dashboard
    return redirect("/dashboard");
  }

  // Get tenant information
  const { data: tenant } = await supabase
    .from("tenant")
    .select("name")
    .eq("id", profile.tenant_id)
    .single();

  // Get existing invites
  const { data: invites } = await supabase
    .from("invites")
    .select("*")
    .eq("tenant_id", profile.tenant_id);

  return (
    <OnboardingLayout currentStep={3}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Invite Team Members</h1>
          <p className="text-gray-500 mt-1">
            Invite your team members to join {tenant?.name || "your company"}.
          </p>
        </div>

        {/* Display existing invites if any */}
        {invites && invites.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Pending Invitations</h3>
            <ul className="space-y-2">
              {invites.map((invite) => (
                <li
                  key={invite.id}
                  className="flex items-center justify-between"
                >
                  <span>{invite.email}</span>
                  <span className="text-sm text-gray-500">{invite.role}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <form action={inviteTeamMembersAction} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="colleague@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="member">Team Member</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Send Invitation
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Skip for Now
            </Button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
}
