import { NextResponse } from "next/server";
import { db, subscriptions, users } from "@/db";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/sessions";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allSubscriptions = await db
      .select({
        id: subscriptions.id,
        userId: subscriptions.userId,
        userName: users.name,
        userEmail: users.email,
        packageName: subscriptions.packageName,
        speed: subscriptions.speed,
        status: subscriptions.status,
        createdAt: subscriptions.createdAt,
      })
      .from(subscriptions)
      .leftJoin(users, eq(subscriptions.userId, users.id))
      .orderBy(desc(subscriptions.createdAt));

    return NextResponse.json({ subscriptions: allSubscriptions });
  } catch (error) {
    console.error("Failed to fetch subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}
