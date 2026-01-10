import { exchangeCodeForToken, getUserProfile } from "@/lib/google-auth";
import { getOrCreateGoogleUser, createSession } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(
        new URL("/auth/login?error=no_code", request.url)
      );
    }

    // Exchange code for tokens
    const { access_token } = await exchangeCodeForToken(code);

    // Get user profile
    const profile = await getUserProfile(access_token);

    // Get or create user in database
    const user = await getOrCreateGoogleUser({
      id: profile.id,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
    });

    // Create session
    const sessionToken = await createSession(user.id);

    const redirectPath = user.accountStatus === "active" && user.role === "admin" ? "/admin" : "/dashboard";
    const response = NextResponse.redirect(new URL(redirectPath, request.url));

    // Set session cookie
    response.cookies.set("imnet-session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    // Store user ID/role
    response.cookies.set("imnet-user-id", user.id, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    response.cookies.set("imnet-role", user.role, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(
      new URL("/auth/login?error=callback_failed", request.url)
    );
  }
}
