import { getGoogleAuthUrl } from "@/lib/google-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authUrl = await getGoogleAuthUrl();
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.json(
      { error: "Failed to get auth url" },
      { status: 500 }
    );
  }
}
