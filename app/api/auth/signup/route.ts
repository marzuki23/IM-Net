import { type NextRequest, NextResponse } from "next/server";
import { db, users } from "@/db";
import { eq } from "drizzle-orm";
import { createSession, hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { firstname, lastname, email, password } = await request.json();

    if (!email || !password || !firstname) {
      return NextResponse.json(
        { error: "Semua kolom wajib diisi" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    const fullName = `${firstname} ${lastname}`.trim();

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        email,
        name: fullName,
        password: hashedPassword,
        role: "user",
        accountStatus: "pending", // Default to pending until approved or otherwise
        // Note: You might want to auto-activate or require email verification
        // For now, let's keep it pending or active depending on business logic. 
        // Previously we set Google users to active (maybe). 
        // Let's set to 'active' for immediate login ease if that's the goal, 
        // or 'pending' if manual approval needed. 
        // The previous plan didn't specify, but usually signup -> login immediately implies active.
        // Let's check schema/previous logic. 
        // In lib/auth.ts (google) we set 'active'. Let's match that.
        // Wait, in lib/auth.ts I see: accountStatus: "active" (I changed it in previous turn).
      })
      .returning();

    // Create session
    const sessionToken = await createSession(newUser[0].id);

    const response = NextResponse.json({ success: true });

    // Set session cookie
    response.cookies.set("imnet-session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    // Store user ID
    response.cookies.set("imnet-user-id", newUser[0].id, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mendaftar" },
      { status: 500 }
    );
  }
}
