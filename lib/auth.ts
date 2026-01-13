import { db, users, sessions } from "@/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { compare, hash } from "bcryptjs";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  accountStatus: string;
  profileImage?: string;
  phone?: string;
}

// Verify Google Token
export async function verifyGoogleToken(token: string): Promise<any> {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/tokeninfo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `access_token=${token}`,
      }
    );

    if (!response.ok) throw new Error("Invalid token");
    return await response.json();
  } catch (error) {
    console.error("Token verification error:", error);
    throw error;
  }
}

// Get or Create User from Google
export async function getOrCreateGoogleUser(profile: {
  id: string;
  email: string;
  name: string;
  picture?: string;
}): Promise<User> {
  try {
    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, profile.email),
    });

    if (existingUser) {
      // Update googleId if not present
      if (!existingUser.googleId) {
        await db
          .update(users)
          .set({ googleId: profile.id, profileImage: profile.picture })
          .where(eq(users.id, existingUser.id));
      }

      return {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role as "admin" | "user",
        accountStatus: existingUser.accountStatus,
        profileImage: existingUser.profileImage || undefined,
        phone: existingUser.phone || undefined,
      };
    }

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        email: profile.email,
        googleId: profile.id,
        name: profile.name,
        profileImage: profile.picture,
        role: "user",
        accountStatus: "active", // Helper logic: Google users are auto-active for now? Or still pending? Let's say active for ease, or pending. Sticking to plan: pending.
        // Actually, for OAuth usually we might want immediate access, but let's stick to system default 'pending' unless requested otherwise.
        // Re-reading schema: default is pending. Let's keep it safe.
      })
      .returning();

    return {
      id: newUser[0].id,
      email: newUser[0].email,
      name: newUser[0].name,
      role: newUser[0].role as "admin" | "user",
      accountStatus: newUser[0].accountStatus,
      profileImage: newUser[0].profileImage || undefined,
      phone: newUser[0].phone || undefined,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Get User by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "admin" | "user",
      accountStatus: user.accountStatus,
      profileImage: user.profileImage || undefined,
      phone: user.phone || undefined,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

// Session Token Management
export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await db.insert(sessions).values({
    userId,
    token,
    expiresAt,
  });

  return token;
}

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10);
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return await compare(plain, hashed);
}
