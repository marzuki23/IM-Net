import { NextRequest, NextResponse } from "next/server";
import { db, payments, subscriptions } from "@/db";
import { getSession } from "@/lib/sessions";
import { sql, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Total Revenue (Sum of all completed payments)
    const revenueResult = await db
      .select({ 
        total: sql<string>`sum(${payments.amount})` 
      })
      .from(payments)
      .where(eq(payments.paymentStatus, "completed")); // Assuming 'completed' or 'paid' based on schema

    // 2. Active Subscriptions count
    const activeSubsResult = await db
      .select({ 
        count: sql<number>`count(*)` 
      })
      .from(subscriptions)
      .where(eq(subscriptions.status, "active"));

    // 3. New Subscriptions this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Note: Drizzle date queries can be tricky depending on driver. 
    // Using simple JS filtering if dataset is small, or raw SQL for better perf.
    // For now taking simple count from DB.
    
    const newSubsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subscriptions)
      .where(
        sql`${subscriptions.createdAt} >= ${startOfMonth.toISOString()}`
      );

    return NextResponse.json({
      totalRevenue: Number(revenueResult[0]?.total || 0),
      activeSubscriptions: Number(activeSubsResult[0]?.count || 0),
      newSubscriptionsThisMonth: Number(newSubsResult[0]?.count || 0),
    });

  } catch (error) {
    console.error("Financial stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
