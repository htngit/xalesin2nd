"use server";

import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        email: email,
      },
    },
  });

  console.log("After signUp", error);

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      const { error: updateError } = await supabase.from("users").insert({
        id: user.id,
        name: fullName,
        full_name: fullName,
        email: email,
        user_id: user.id,
        token_identifier: user.id,
        created_at: new Date().toISOString(),
      });

      if (updateError) {
        console.error("Error updating user profile:", updateError);
      }
    } catch (err) {
      console.error("Error in user profile creation:", err);
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  // Check if user has completed onboarding
  const { data: profile } = await supabase
    .from("profile")
    .select("onboarding_status")
    .eq("id", (await supabase.auth.getUser()).data.user?.id)
    .single();

  // If profile exists but onboarding is not completed, redirect to appropriate onboarding phase
  if (profile) {
    if (profile.onboarding_status === "pending") {
      return redirect("/onboarding/phase1");
    } else if (profile.onboarding_status === "in_progress") {
      // Check which phase they're in by checking if tenant_id exists
      const { data: profileDetails } = await supabase
        .from("profile")
        .select("tenant_id, full_name")
        .eq("id", (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profileDetails?.tenant_id) {
        return redirect("/onboarding/phase1");
      } else if (!profileDetails?.full_name) {
        return redirect("/onboarding/phase2");
      } else {
        return redirect("/onboarding/phase3");
      }
    }
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

// Onboarding Actions
export const updateCompanyInfoAction = async (formData: FormData) => {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const companyName = formData.get("company_name")?.toString();
  const industry = formData.get("industry")?.toString();
  const companySize = formData.get("company_size")?.toString();

  if (!companyName || !industry || !companySize) {
    return encodedRedirect(
      "error",
      "/onboarding/phase1",
      "All fields are required",
    );
  }

  try {
    // Create a new tenant
    const { data: tenant, error: tenantError } = await supabase
      .from("tenant")
      .insert({
        name: companyName,
        industry: industry,
        company_size: companySize,
        created_by: user.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (tenantError) {
      console.error("Error creating tenant:", tenantError);
      return encodedRedirect(
        "error",
        "/onboarding/phase1",
        "Failed to create company profile",
      );
    }

    // Update the user's profile with the tenant ID and set onboarding status to in_progress
    const { error: profileError } = await supabase
      .from("profile")
      .update({
        tenant_id: tenant.id,
        onboarding_status: "in_progress",
      })
      .eq("id", user.id);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      return encodedRedirect(
        "error",
        "/onboarding/phase1",
        "Failed to update profile",
      );
    }

    // Redirect to the next phase
    return redirect("/onboarding/phase2");
  } catch (error) {
    console.error("Unexpected error:", error);
    return encodedRedirect(
      "error",
      "/onboarding/phase1",
      "An unexpected error occurred",
    );
  }
};

export const updatePersonalInfoAction = async (formData: FormData) => {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const fullName = formData.get("full_name")?.toString();
  const position = formData.get("position")?.toString();
  const phone = formData.get("phone")?.toString() || null;

  if (!fullName || !position) {
    return encodedRedirect(
      "error",
      "/onboarding/phase2",
      "Name and position are required",
    );
  }

  try {
    // Update the user's profile with personal information
    const { error: profileError } = await supabase
      .from("profile")
      .update({
        full_name: fullName,
        position: position,
        phone: phone,
      })
      .eq("id", user.id);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      return encodedRedirect(
        "error",
        "/onboarding/phase2",
        "Failed to update profile",
      );
    }

    // Redirect to the next phase
    return redirect("/onboarding/phase3");
  } catch (error) {
    console.error("Unexpected error:", error);
    return encodedRedirect(
      "error",
      "/onboarding/phase2",
      "An unexpected error occurred",
    );
  }
};

export const inviteTeamMembersAction = async (formData: FormData) => {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const email = formData.get("email")?.toString();
  const role = formData.get("role")?.toString();

  if (!email || !role) {
    return encodedRedirect(
      "error",
      "/onboarding/phase3",
      "Email and role are required",
    );
  }

  try {
    // Get the user's profile to get the tenant_id
    const { data: profile, error: profileError } = await supabase
      .from("profile")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.tenant_id) {
      console.error("Error getting profile:", profileError);
      return encodedRedirect(
        "error",
        "/onboarding/phase3",
        "Failed to get tenant information",
      );
    }

    // Create an invitation
    const { error: inviteError } = await supabase.from("invites").insert({
      email: email,
      role: role,
      tenant_id: profile.tenant_id,
      invited_by: user.id,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    if (inviteError) {
      console.error("Error creating invitation:", inviteError);
      return encodedRedirect(
        "error",
        "/onboarding/phase3",
        "Failed to send invitation",
      );
    }

    // Update the user's profile to mark onboarding as completed
    const { error: updateError } = await supabase
      .from("profile")
      .update({
        onboarding_status: "completed",
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      // Still continue to dashboard even if this fails
    }

    return encodedRedirect(
      "success",
      "/onboarding/phase3",
      "Invitation sent successfully",
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return encodedRedirect(
      "error",
      "/onboarding/phase3",
      "An unexpected error occurred",
    );
  }
};
