import { type NextRequest, NextResponse } from "next/server";
import { db, users, subscriptions } from "@/db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("imnet-user-id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is admin
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get stats
    const totalUsers = await db.query.users.findMany({});
    const activeSubscriptions = await db.query.subscriptions.findMany({
      where: eq(subscriptions.status, "active"),
    });
    const monthlyPayments = await db.query.payments.findMany({});

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const thisMonthPayments = monthlyPayments.filter(
      (p) => new Date(p.createdAt) >= monthStart
    );
    const completedPayments = thisMonthPayments.filter(
      (p) => p.paymentStatus === "completed"
    );
    const pendingPayments = thisMonthPayments.filter(
      (p) => p.paymentStatus === "pending"
    );

    let monthlyRevenue = 0;
    completedPayments.forEach((p) => {
      monthlyRevenue += Number.parseFloat(p.amount);
    });

    return NextResponse.json({
      totalUsers: totalUsers.length,
      activeSubscriptions: activeSubscriptions.length,
      monthlyRevenue,
      pendingPayments: pendingPayments.length,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
