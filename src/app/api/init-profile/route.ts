import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profile")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!existingProfile) {
      // Create a new profile
      const { error: insertError } = await supabase.from("profile").insert({
        id: user.id,
        onboarding_status: "pending",
      });

      if (insertError) {
        console.error("Error creating profile:", insertError);
        return NextResponse.json(
          { error: "Failed to create profile" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { success: true, message: "Profile initialized" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
