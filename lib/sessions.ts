import { cookies } from "next/headers";
import { db, sessions, users } from "@/db";
import { eq } from "drizzle-orm";

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("imnet-session")?.value;

    if (!sessionToken) {
      return null;
    }

    const session = await db.query.sessions.findFirst({
      where: eq(sessions.token, sessionToken),
      with: { user: true },
    });

    if (!session || new Date(session.expiresAt) < new Date()) {
      return null;
    }

    // Return session with user populated
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session) return null;

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "admin" | "user",
      accountStatus: user.accountStatus,
      profileImage: user.profileImage || undefined,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
